const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { verifyToken } = require('../middleware/authmiddleware');
 // adjust path if needed

console.log("Loaded reservationRoutes.js");

// Reservation endpoints
router.get('/reservations', verifyToken, reservationController.getUserReservations);
router.get('/reservations/all', verifyToken, reservationController.getAllReservations);
router.get('/reservations/property/:propertyId', verifyToken, reservationController.getPropertyReservations);
// router.get('/reservations/:id', verifyToken, reservationController.getReservation);

// New reservation endpoints
// Remove or comment out these lines if you don't have the controller functions yet:
// router.post('/reservations', verifyToken, reservationController.createReservation);
// router.patch('/reservations/:id/status', verifyToken, reservationController.updateReservationStatus);
router.patch('/reservations/:id/cancel', verifyToken, reservationController.cancelReservation);

// Add this route for checking user reservations
router.get('/user/reservations/check', verifyToken, reservationController.checkUserReservations);

module.exports = router;
