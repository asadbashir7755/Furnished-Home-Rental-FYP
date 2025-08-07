// const User = require("../../../models/user");
const User=require("../../models/user")
const ListingItem = require("../../models/listingitemmodel");
const Reservation = require("../../models/Reservation");
const Contact = require("../../models/ContactUs");

exports.fetchUsersStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        res.status(200).json({ usersCount });
    } catch (error) {
        console.error("Error fetching users stats:", error);
        res.status(500).json({ message: "Failed to fetch users stats" });
    }
};

exports.fetchItemsStats = async (req, res) => {
    try {
        const itemsCount = await ListingItem.countDocuments();
        res.status(200).json({ itemsCount });
    } catch (error) {
        console.error("Error fetching items stats:", error);
        res.status(500).json({ message: "Failed to fetch items stats" });
    }
};

exports.fetchReservationsStats = async (req, res) => {
    try {
        const reservationsCount = await Reservation.countDocuments();
        res.status(200).json({ reservationsCount });
    } catch (error) {
        console.error("Error fetching reservations stats:", error);
        res.status(500).json({ message: "Failed to fetch reservations stats" });
    }
};

exports.fetchContactsStats = async (req, res) => {
    try {
        const contactsCount = await Contact.countDocuments();
        res.status(200).json({ contactsCount });
    } catch (error) {
        console.error("Error fetching contacts stats:", error);
        res.status(500).json({ message: "Failed to fetch contacts stats" });
    }
};
    
