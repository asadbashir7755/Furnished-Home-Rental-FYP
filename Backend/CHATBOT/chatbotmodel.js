// chatbotmodel.js
const mongoose = require("mongoose");

// Project info (no _id for subdocument)
const ProjectInfoSchema = new mongoose.Schema(
  {
    title: String,
    createdBy: [String],
    developer: String,
    developerNote: String
  },
  { _id: false }
);

// FAQ entry embedded in ChatbotData (no _id for each FAQ item)
const FaqItemSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    tags: [String]
  },
  { _id: false }
);

// Whole document: projectInfo + faqs[]
const ChatbotDataSchema = new mongoose.Schema(
  {
    projectInfo: ProjectInfoSchema,
    faqs: [FaqItemSchema]
  },
  {
    collection: "faq", // set to your actual collection name
    timestamps: true
  }
);

const ChatbotData = mongoose.model("ChatbotData", ChatbotDataSchema);
module.exports = ChatbotData;
