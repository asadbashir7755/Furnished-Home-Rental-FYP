require("dotenv").config();
const axios = require("axios");
const ChatbotData = require("./chatbotmodel");
const ListingItem = require("../models/listingitemmodel");
const dbInteraction = require("./controllerdatabaseinteraction");
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Utility: Shortlist top-k FAQs by keyword overlap
function tokenize(s = "") {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
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

// Helper: Use Groq to classify if the user wants a property database interaction
async function classifyDatabaseIntent(message) {
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";
  const payload = {
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `You are an intent classifier. If the user's message is a request to get property counts, search properties by city/location, or similar database queries, reply ONLY with one of:
- "COUNT_PROPERTIES"
- "SEARCH_BY_CITY:<city>"
- "NO_DB_ACTION"

Examples:
User: How many properties exist? => COUNT_PROPERTIES
User: Show me properties in Muzaffarabad => SEARCH_BY_CITY:Muzaffarabad
User: Is there any property near Lahore? => SEARCH_BY_CITY:Lahore
User: What is your refund policy? => NO_DB_ACTION

If city is mentioned, extract it and use SEARCH_BY_CITY:<city>. If not a DB action, reply NO_DB_ACTION.`
      },
      {
        role: "user",
        content: message
      }
    ],
    temperature: 0.1
  };
  const response = await axios.post(endpoint, payload, {
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    }
  });
  return response.data.choices[0]?.message?.content?.trim();
}

// Helper: Enhance user question for DB query if not FAQ
async function enhanceForDbQuery(userQuestion) {
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";
  const payload = {
    model: "llama3-8b-8192",
    messages: [
      {
        role: "system",
        content: `You are an assistant that rewrites user questions to make them clear and structured for database search in a property rental platform. 
If the user asks about property details, counts, locations, or amenities, rewrite the question to be explicit and database-friendly. 
If not possible, return the original question. Reply with the enhanced query only.`
      },
      {
        role: "user",
        content: userQuestion
      }
    ],
    temperature: 0.2
  };
  const response = await axios.post(endpoint, payload, {
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    }
  });
  return response.data.choices[0]?.message?.content?.trim() || userQuestion;
}

// Main handler for incoming messages
exports.sendMessageToBot = async (req, res) => {
  console.log("[GROQ] Received request to send message to bot");
  const { message } = req.body;

  if (!GROQ_API_KEY) {
    console.error("[GROQ] API key not configured");
    return res.status(500).json({ error: "GROQ API key not configured." });
  }

  if (!message || !message.trim()) {
    console.warn("[GROQ] No message provided in request body");
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    // Load projectInfo and faqs from DB
    const doc = await ChatbotData.findOne({}, { "projectInfo.title": 1, faqs: 1 }).lean();
    const projectTitle = doc?.projectInfo?.title || "Furnished Home Rentals";
    // Ensure faqs is a plain array of objects with question/answer
    let allFaqs = [];
    if (Array.isArray(doc?.faqs)) {
      allFaqs = doc.faqs.map(f => ({
        question: typeof f.question === "string" ? f.question : "",
        answer: typeof f.answer === "string" ? f.answer : ""
      })).filter(f => f.question && f.answer);
    }
    console.log("[GROQ] Loaded FAQs from DB:", allFaqs);

    // 1) Check for exact FAQ match before calling Groq
    const exactMatch = allFaqs.find(
      f => f.question.trim().toLowerCase() === message.trim().toLowerCase()
    );
    if (exactMatch) {
      console.log("[GROQ] Exact FAQ match found, answering directly from DB.");
      // Only return the answer (not the question)
      return res.json({ reply: exactMatch.answer, source: "faq-db" });
    }

    // 2) Shortlist FAQs for prompt size
    const shortlist = allFaqs.length ? pickTopFaqs(message, allFaqs, 12) : [];
    console.log("[GROQ] Shortlisted FAQs for API prompt:", shortlist);

    // 3) Try FAQ matching with Groq if no exact match
    if (shortlist.length) {
      const faqPrompt = buildFaqPrompt({
        projectTitle,
        userQuestion: message,
        faqs: shortlist
      });

      const endpoint = "https://api.groq.com/openai/v1/chat/completions";
      const payload = {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are an FAQ matcher. Follow the instructions in the prompt exactly."
          },
          {
            role: "user",
            content: faqPrompt
          }
        ],
        temperature: 0.1
      };

      console.log(`[GROQ] Sending FAQ match request to Groq API`);
      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      });

      const faqReply = response.data.choices[0]?.message?.content?.trim();
      console.log(`[GROQ] FAQ match reply: ${faqReply}`);
      if (faqReply && faqReply.toUpperCase() !== "NO_MATCH") {
        // Extract only the answer part if the model returns "question\n\nA: answer" or "Q: ...\nA: ..."
        let answer = faqReply;
        const aMatch = faqReply.match(/A:\s*(.*)$/is);
        if (aMatch) {
          answer = aMatch[1].trim();
        } else if (faqReply.includes('\n')) {
          // If no "A:", take the last non-empty line, but skip if it matches the question
          const lines = faqReply.split('\n').map(l => l.trim()).filter(Boolean);
          // Remove lines that match the question (case-insensitive)
          const filtered = lines.filter(l => l.toLowerCase() !== message.trim().toLowerCase());
          answer = filtered.length ? filtered[filtered.length - 1] : lines[lines.length - 1];
        }
        return res.json({ reply: answer, source: "faq" });
      }

      // If NO_MATCH, continue to DB intent detection
    }

    // 4) Database interaction intent detection (use controllerdatabaseinteraction.js)
    const dbResult = await dbInteraction.runDynamicDbQuery(message);
    if (
      dbResult &&
      typeof dbResult.reply === "string" &&
      dbResult.reply.trim() &&
      dbResult.action &&
      dbResult.action !== "no_db_action"
    ) {
      console.log("[GROQ] Database interaction result:", dbResult);
      return res.json({
        reply: dbResult.reply,
        source: "db",
        dbAction: dbResult.action,
        dbParams: dbResult.params
      });
    }

    // 5) Fallback: general chat
    const generalPrompt = buildGeneralPrompt(message, projectTitle);
    const endpoint = "https://api.groq.com/openai/v1/chat/completions";
    const payload = {
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are a smart assistant for a furnished home rental platform. Respond clearly and concisely."
        },
        {
          role: "user",
          content: generalPrompt
        }
      ],
      temperature: 0.3
    };

    console.log(`[GROQ] Sending general chat request to Groq API`);
    // FIX: Ensure this is inside the async function (it is)
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const reply = response.data.choices[0]?.message?.content || "No reply received.";
    console.log(`[GROQ] General chat reply: ${reply}`);
    return res.json({ reply, source: "groq" });
  } catch (error) {
    if (error.response) {
      console.error(`[GROQ] API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`[GROQ] API error: ${error.message}`);
    }
    return res.status(500).json({ error: "Error communicating with Groq API." });
  }
};