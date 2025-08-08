require("dotenv").config();
const axios = require("axios");
const ListingItem = require("../models/listingitemmodel");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama3-8b-8192";

// Send all listings to Groq API and ask for answer, but first check for sensitive/spam content
async function runDynamicDbQuery(message) {
  if (!GROQ_API_KEY) return { reply: null, action: "no_db_action", params: {} };

  // Prevent generic greetings from triggering a search
  const greetings = ["hello", "hi", "hey", "salam", "assalamualaikum"];
  if (
    typeof message === "string" &&
    greetings.some(greet => message.trim().toLowerCase() === greet)
  ) {
    return { reply: null, action: "no_db_action", params: {} };
  }

  // 1. Check for sensitive/spam/sexual content using Groq API
  const moderationPrompt = `
You are a content moderation assistant. Analyze the following user message for any sexual, spam, abusive, or sensitive content.
If the message is inappropriate or violates community guidelines, reply ONLY with "BLOCKED".
If the message is safe, reply ONLY with "SAFE".

User message:
"${message}"
  `.trim();

  const moderationPayload = {
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: "You are a content moderation assistant." },
      { role: "user", content: moderationPrompt }
    ],
    temperature: 0.0
  };

  const moderationRes = await axios.post(GROQ_ENDPOINT, moderationPayload, {
    headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" }
  });

  const moderationReply = moderationRes.data.choices?.[0]?.message?.content?.trim();
  if (moderationReply && moderationReply.toUpperCase() === "BLOCKED") {
    return {
      reply: "Your message was blocked due to inappropriate or sensitive content. Please rephrase your query.",
      action: "blocked",
      params: {}
    };
  }

  // Fetch all listings (limit to 100 for performance, adjust as needed)
  const listings = await ListingItem.find({}, { listingName: 1, _id: 1, address: 1, pricing: 1, propertyType: 1, roomType: 1, personCapacity: 1, numBedrooms: 1, numBeds: 1, numBathrooms: 1, amenities: 1 }).limit(100).lean();

  // Compose prompt for Groq API
  const prompt = `
You are a property assistant. Here is the user's question:
"${message}"

Here is the list of available properties (as JSON array):
${JSON.stringify(listings, null, 2)}

Instructions:
- Analyze the user's question and the listings data.
- Answer ONLY based on the listings data provided.
- If the user asks for details about a property, use the listingName or _id to find it.
- If the user asks for properties in a city, filter by address.city.
- If the user asks for counts, amenities, or other info, answer using the listings data.
- If nothing matches, reply: "Sorry, no matching property found."
- Reply concisely and clearly.
`;

  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: "You are a helpful property assistant." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  };

  const res = await axios.post(GROQ_ENDPOINT, payload, {
    headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" }
  });

  const reply = res.data.choices?.[0]?.message?.content?.trim() || "Sorry, no matching property found.";
  return {
    reply,
    action: "listingitems_groq",
    params: {}
  };
}

exports.runDynamicDbQuery = runDynamicDbQuery;
