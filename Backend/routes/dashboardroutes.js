const express = require("express");
const { fetchUsersStats, fetchItemsStats } = require("../controllers/dashboarddetails/dashboard");
const { verifyToken } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/admin/fetchusers", verifyToken, fetchUsersStats);
router.get("/admin/items", verifyToken, fetchItemsStats);

module.exports = router;
