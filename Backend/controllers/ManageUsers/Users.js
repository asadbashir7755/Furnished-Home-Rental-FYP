const User = require("../../models/user");

exports.getAllUsers = async (req, res) => {
    console.log("Fetching users from getallusers");
    try {
        const users = await User.find().select("-password -confirmPassword -verificationCode");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

exports.deleteUser = async (req, res) => {
    console.log("Deleting user from deleteuser");
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

exports.editUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password -confirmPassword -verificationCode");
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
};

exports.changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password -confirmPassword -verificationCode");
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User role updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error changing user role:", error);
        res.status(500).json({ message: "Failed to change user role" });
    }
};
