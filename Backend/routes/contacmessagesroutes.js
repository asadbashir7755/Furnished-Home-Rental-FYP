const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authmiddleware");
const Contact = require("../models/ContactUs");

// GET /api/contacts/all - Get all contact messages (admin)
router.get("/contacts/all", verifyToken, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch contact messages" });
    }
});

// PATCH /api/contacts/:contactId/status - Update contact message status
router.patch("/contacts/:contactId/status", verifyToken, async (req, res) => {
    try {
        const { contactId } = req.params;
        const { status } = req.body;
        const updatedContact = await Contact.findByIdAndUpdate(
            contactId,
            { status },
            { new: true }
        );
        if (!updatedContact) {
            return res.status(404).json({ message: "Contact message not found" });
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(500).json({ message: "Failed to update contact status" });
    }
});

module.exports = router;
