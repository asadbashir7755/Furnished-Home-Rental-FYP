const ListingItem = require("../models/listingitemmodel");
const BlockedDate = require("../models/BlockedDates");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

exports.upload = upload;

exports.addItem = async (req, res) => {
    try {
        const mediaFiles = req.files ? req.files.map(file => ({
            url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            type: file.mimetype.startsWith('image/') ? 'image' : 'video'
        })) : [];
        console.log("mediaFiles in add item : ", mediaFiles);

        const { _id, address, pricing, status } = req.body; // Accept _id from frontend
        const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
        const parsedPricing = typeof pricing === "string" ? JSON.parse(pricing) : pricing;

        const newItem = new ListingItem({
            _id, // Explicitly set _id if provided
            ...req.body,
            address: parsedAddress,
            pricing: parsedPricing,
            status,
            mediaFiles
        });
        await newItem.save();
        res.status(201).json({ message: "Item added successfully", item: newItem });
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        console.log("control in update section");
        const mediaFiles = req.files ? req.files.map(file => ({
            url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            type: file.mimetype.startsWith('image/') ? 'image' : 'video'
        })) : undefined;
        console.log("mediaFiles : ", mediaFiles);
        
        // Destructure all needed fields from req.body
        const { address, pricing, status, mediaFiles: bodyMediaFiles } = req.body;
        const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
        const parsedPricing = typeof pricing === "string" ? JSON.parse(pricing) : pricing;

        // Create base update data without mediaFiles
        const updateData = {
            description: req.body.description,
            listingName: req.body.listingName,
            externalListingName: req.body.externalListingName,
            tags: req.body.tags,
            personCapacity: req.body.personCapacity,
            propertyType: req.body.propertyType,
            roomType: req.body.roomType,
            numBedrooms: req.body.numBedrooms,
            numBeds: req.body.numBeds,
            numBathrooms: req.body.numBathrooms,
            bathroomType: req.body.bathroomType,
            numGuestBathrooms: req.body.numGuestBathrooms,
            address: parsedAddress,
            pricing: parsedPricing,
            status,
            amenities: req.body.amenities,
        };

        // If new files were uploaded, add them to updateData
        if (req.files && req.files.length > 0) {
            updateData.mediaFiles = mediaFiles;
            console.log("New media files uploaded, updating mediaFiles");
        } 
        // Otherwise DON'T include mediaFiles in updateData to keep existing ones
        else {
            console.log("No new media files, keeping existing ones");
        }

        // Save previous item for comparison
        const prevItem = await ListingItem.findById(req.params.id);

        const updatedItem = await ListingItem.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });

        // If status changed to "canceled", remove blocked dates
        if (prevItem && updateData.status && updateData.status.toLowerCase() === "canceled") {
            // Remove all blocked dates for this property
            const result = await BlockedDate.deleteMany({ propertyId: req.params.id });
            console.log(`Dates unblocked after status changed to cancelled for property ${req.params.id}. Count: ${result.deletedCount}`);
        }

        res.status(200).json({ message: "Item updated successfully", item: updatedItem });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await ListingItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getItem = async (req, res) => {
    try {
        const item = await ListingItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        // Fetch blocked dates for this property
        const blockedDates = await BlockedDate.find({ propertyId: req.params.id })
            .select('startDate endDate -_id');

        res.status(200).json({ ...item.toObject(), blockedDates });
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let blockedProperties = [];
        if (startDate && endDate) {
            blockedProperties = await BlockedDate.find({
                $or: [
                    { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
                    { startDate: { $gte: new Date(startDate) }, startDate: { $lte: new Date(endDate) } },
                    { endDate: { $gte: new Date(startDate) }, endDate: { $lte: new Date(endDate) } }
                ]
            }).distinct("propertyId");
        }

        const items = await ListingItem.find({ _id: { $nin: blockedProperties } });
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.blockDates = async (req, res) => {
    try {
        const { propertyId, startDate, endDate } = req.body;
        const blockedDate = new BlockedDate({ propertyId, startDate, endDate });
        await blockedDate.save();
        res.status(201).json({ message: "Dates blocked successfully", blockedDate });
    } catch (error) {
        console.error("Error blocking dates:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getBlockedDates = async (req, res) => {
    try {
        const blockedDates = await BlockedDate.find().populate("propertyId", "listingName");
        res.status(200).json(blockedDates);
    } catch (error) {
        console.error("Error fetching blocked dates:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.unblockDates = async (req, res) => {
    try {
        const { propertyId, startDate, endDate } = req.body;
        await BlockedDate.deleteMany({ propertyId, startDate, endDate });
        res.status(200).json({ message: "Dates unblocked successfully" });
    } catch (error) {
        console.error("Error unblocking dates:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.searchItems = async (req, res) => {
    console.log("user in search items");
    try {
        const { location, checkInDate, checkOutDate, adults } = req.query;
        console.log("Check-in date:", checkInDate);
        console.log("Check-out date:", checkOutDate);

        const query = {};
        if (location) {
            query.$or = [
                { "address.city": { $regex: location, $options: "i" } },
                { "address.country": { $regex: location, $options: "i" } }
            ];
        }
        if (adults) query.personCapacity = { $gte: Number(adults) };

        let blockedProperties = [];
        if (checkInDate && checkOutDate) {
            console.log("Check-in date:", new Date(checkInDate));
            console.log("Check-out date:", new Date(checkOutDate));
            blockedProperties = await BlockedDate.find({
                $or: [
                    { startDate: { $lte: new Date(checkOutDate) }, endDate: { $gte: new Date(checkInDate) } },
                    { startDate: { $gte: new Date(checkInDate) }, startDate: { $lte: new Date(checkOutDate) } },
                    { endDate: { $gte: new Date(checkInDate) }, endDate: { $lte: new Date(checkOutDate) } }
                ]
            }).distinct("propertyId");
            console.log("Blocked properties:", blockedProperties);
        }

        query._id = { $nin: blockedProperties };

        const items = await ListingItem.find(query);
        res.status(200).json(items);
    } catch (error) {
        console.error("Error searching items:", error);
        res.status(500).json({ message: error.message });
    }
};