// const User = require("../../../models/user");
const User=require("../../models/user")
const ListingItem = require("../../models/listingitemmodel");

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
