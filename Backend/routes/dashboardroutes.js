const express = require("express");
const { fetchUsersStats, fetchItemsStats, fetchReservationsStats, fetchContactsStats } = require("../controllers/dashboarddetails/dashboard");
const { verifyToken } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/admin/fetchusers", verifyToken, fetchUsersStats);
router.get("/admin/items", verifyToken, fetchItemsStats);
router.get("/admin/reservations", verifyToken, fetchReservationsStats);
router.get("/admin/contacts", verifyToken, fetchContactsStats);

module.exports = router;
