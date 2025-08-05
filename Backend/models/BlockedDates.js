const mongoose = require("mongoose");

const blockedDateSchema = new mongoose.Schema({
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "ListingItem", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("BlockedDate", blockedDateSchema);
