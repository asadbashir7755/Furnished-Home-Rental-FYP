const express = require("express");
const { getAllUsers, deleteUser, editUser, changeUserRole } = require("../controllers/ManageUsers/Users");
const { verifyToken } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/manage/getuser", verifyToken, getAllUsers); // Fetch all users
router.delete("/manage/deleteuser/:id", verifyToken, deleteUser); // Delete a user
router.put("/manage/edituser/:id", verifyToken, editUser); // Edit a user
router.put("/manage/updaterole/:id", verifyToken, changeUserRole); // Change user role

module.exports = router;
