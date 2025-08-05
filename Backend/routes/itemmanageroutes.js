const express = require("express");
const { addItem, updateItem, deleteItem, getItem, getAllItems, blockDates, getBlockedDates, unblockDates, searchItems, upload } = require("../controllers/listingitemcontroller");
const router = express.Router();
const { verifyToken } = require("../middleware/authmiddleware");

router.post("/add", verifyToken, upload.array('mediaFiles', 10), addItem); // Adjust to handle media files
router.put("/update/:id", verifyToken, upload.array('mediaFiles', 10), updateItem); // Adjust to handle media files
router.delete("/delete/:id", verifyToken, deleteItem);
router.get("/list/:id", verifyToken, getItem);
router.get("/list", verifyToken, getAllItems);
router.post("/block-dates", verifyToken, blockDates); // Add route to block dates
router.get("/blocked-dates", verifyToken, getBlockedDates); // Add route to fetch blocked dates
router.post("/unblock-dates", verifyToken, unblockDates); // Add route to unblock dates
router.get("/search", verifyToken, searchItems); // Add route to search items

module.exports = router;
