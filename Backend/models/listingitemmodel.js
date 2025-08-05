const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    publicAddress: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    zipCode: { type: String, required: true },
});

const mediaFileSchema = new mongoose.Schema({
    url: { type: String, required: true },
    type: { type: String, required: true },
});

const pricingSchema = new mongoose.Schema({
    pricePerNight: { type: Number, required: true },
    pricePerWeek: { type: Number, required: true },
    pricePerMonth: { type: Number, required: true },
    weeklyDiscount: { type: String },
    monthlyDiscount: { type: String },
});

const listingItemSchema = new mongoose.Schema({
    listingName: { type: String, required: true },
    externalListingName: { type: String },
    tags: { type: [String] },
    description: { type: String },
    personCapacity: { type: Number, required: true },
    propertyType: { type: String, required: true },
    roomType: { type: String, required: true },
    numBedrooms: { type: Number, required: true },
    numBeds: { type: Number, required: true },
    numBathrooms: { type: Number, required: true },
    bathroomType: { type: String, required: true },
    numGuestBathrooms: { type: Number },
    address: addressSchema,
    amenities: { type: [String] },
    mediaFiles: [mediaFileSchema],
    pricing: pricingSchema,
}, { timestamps: true });

module.exports = mongoose.model("ListingItem", listingItemSchema);
