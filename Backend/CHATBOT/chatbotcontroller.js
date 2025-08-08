// chatbotController.js
// Single-file chatbot controller: pulls FAQs from your Mongo doc, asks Gemini to match,
// and falls back to general chat if no FAQ match. Update the model import path below.

const axios = require("axios");
// TODO: CHANGE THIS PATH to your existing model that contains { projectInfo, faqs: [{question, answer}] }
const ChatbotData = require("./chatbotmodel"); // e.g., one doc with projectInfo + faqs[]

/* ----------------------------- utils ----------------------------- */
function tokenize(s = "") {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Simple keyword overlap to shortlist top-k FAQs (keeps prompt small)
function pickTopFaqs(userQuestion, faqs, k = 12) {
  const qTokens = new Set(tokenize(userQuestion));
  return [...faqs]
    .map(f => {
      const text = `${f.question || ""} ${f.answer || ""}`;
      const fTokens = tokenize(text);
      const score = fTokens.reduce((acc, t) => acc + (qTokens.has(t) ? 1 : 0), 0);
      return { ...f, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, k);
}

function extractTextFromGemini(data) {
  const candidates = data?.candidates || [];
  let collected = "";

  for (const c of candidates) {
    const parts = c?.content?.parts || [];
    const textParts = parts.map(p => p?.text).filter(Boolean);
    if (textParts.length) {
      collected += (collected ? "\n" : "") + textParts.join("\n");
    }
  }
  if (collected.trim()) return collected.trim();

  const firstFinish = candidates[0]?.finishReason;
  const blockReason = data?.promptFeedback?.blockReason;
  if (blockReason) {
    return `Your message was blocked (${String(blockReason).toLowerCase()}). Please rephrase.`;
  }
  if (firstFinish && firstFinish !== "STOP") {
    return `The model couldn’t complete (finishReason: ${firstFinish}). Please try rephrasing.`;
  }
  return "";
}

function buildFaqPrompt({ projectTitle, userQuestion, faqs }) {
  return `
You are an FAQ assistant for "${projectTitle}".
Task: Read the user's question and the FAQ list. If the question matches any FAQ (even if rephrased or if the user refers to "this project", "this platform", etc),
output ONLY the exact answer text of that FAQ. If there is no clear match, output exactly: NO_MATCH

User question:
${userQuestion}

FAQs:
${faqs.map((f, i) => `${i + 1}. Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

Instructions:
- If the user question matches any FAQ (even if rephrased or refers to "this project", "this platform", etc), reply with ONLY the exact answer text from that FAQ, with no extra words.
- If the user question is an exact match for a FAQ question, reply with ONLY the answer from that FAQ, with no extra words.
- If there is no clear match, reply with NO_MATCH (all caps).
`.trim();
}

function buildGeneralPrompt(message, projectTitle) {
  return `
You are the assistant for "${projectTitle}" (a MERN-based furnished home rental platform).
Answer the user's question clearly and concisely in 3–6 sentences.
If specifics like pricing, availability, or policy are unknown, explain how to find them on the platform.

User question:
${message}
`.trim();
}

/* ----------------------------- Gemini calls ----------------------------- */
async function callGemini({ prompt, apiKey, model = "gemini-2.5-flash", maxOutputTokens = 768, temperature = 0.2 }) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`;
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      topK: 40,
      topP: 0.95,
      maxOutputTokens
    }
  };
  try {
    // Increase timeout to 60 seconds to avoid timeout errors
    const resp = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      timeout: 60000 // 60 seconds
    });
    return extractTextFromGemini(resp.data);
  } catch (err) {
    // Log timeout or network errors clearly
    if (err.code === 'ECONNABORTED') {
      console.error("Gemini API timeout: request took too long.");
      throw new Error("Gemini API timeout: request took too long.");
    }
    throw err;
  }
}

/* ----------------------------- Controller ----------------------------- */
exports.sendMessageToBot = async (req, res) => {
  const { message } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return res.status(500).json({ error: "Gemini API key not configured." });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    // FIX: Use the correct model export for Mongoose
    // If your model is exported as: module.exports = mongoose.model('ChatbotData', schema)
    // then use: ChatbotData.findOne(...)
    // If you exported as { Main } or similar, use: Main.findOne(...)

    // If your chatbotmodel.js looks like:
    // module.exports = mongoose.model('ChatbotData', schema);
    // then this is correct:
    const doc = await ChatbotData.findOne({}, { "projectInfo.title": 1, faqs: 1 }).lean();

    const projectTitle = doc?.projectInfo?.title || "Furnished Home Rentals";
    const allFaqs = Array.isArray(doc?.faqs) ? doc.faqs.filter(f => f?.question && f?.answer) : [];

    // 2) Shortlist FAQs to keep prompt small
    const shortlist = allFaqs.length ? pickTopFaqs(message, allFaqs, 12) : [];

    // 3) Try FAQ matching first
    if (shortlist.length) {
      const faqPrompt = buildFaqPrompt({
        projectTitle,
        userQuestion: message,
        faqs: shortlist
      });

      let faqReply = await callGemini({
        prompt: faqPrompt,
        apiKey: geminiApiKey,
        model: "gemini-2.5-flash",
        maxOutputTokens: 512,
        temperature: 0.1
      });

      if (faqReply) {
        const trimmed = faqReply.trim();
        if (trimmed.toUpperCase() !== "NO_MATCH") {
          return res.json({ reply: trimmed, source: "faq" });
        }
      }
    }

    // 4) Fallback: general chat (concise)
    const generalPrompt = buildGeneralPrompt(message, projectTitle);
    let reply = await callGemini({
      prompt: generalPrompt,
      apiKey: geminiApiKey,
      model: "gemini-2.5-flash",
      maxOutputTokens: 1024,
      temperature: 0.7
    });

    if (!reply || !reply.trim()) {
      reply = "Sorry, I couldn’t generate a response. Please try rephrasing.";
    }

    return res.json({ reply: reply.trim(), source: "chat" });
  } catch (error) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.error("Gemini API error:", status, JSON.stringify(data || error.message, null, 2));
    return res.status(500).json({ error: "Failed to get response from Gemini API." });
  }
};
