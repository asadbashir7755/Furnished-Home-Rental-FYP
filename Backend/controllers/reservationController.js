const Reservation = require('../models/Reservation');
const ListingItem = require('../models/listingitemmodel');
const BlockedDate = require('../models/BlockedDates'); // <-- Add this line

console.log("Loaded reservationController.js");

// Utility: Update completed reservations
async function updateCompletedReservations() {
    const now = new Date();
    // Find reservations that will be marked as completed
    const reservationsToComplete = await Reservation.find(
        { 'dates.endDate': { $lt: now }, status: 'booked' }
    );

    // Update their status to completed
    await Reservation.updateMany(
        { 'dates.endDate': { $lt: now }, status: 'booked' },
        { $set: { status: 'completed' } }
    );

    // Unblock dates for these reservations
    for (const reservation of reservationsToComplete) {
        if (
            reservation.propertyId &&
            reservation.dates &&
            reservation.dates.startDate &&
            reservation.dates.endDate
        ) {
            const result = await BlockedDate.deleteMany({
                propertyId: reservation.propertyId,
                startDate: reservation.dates.startDate,
                endDate: reservation.dates.endDate
            });
            console.log(`Dates unblocked after status changed to completed for property ${reservation.propertyId}. Count: ${result.deletedCount}`);
        }
    }
}

// Get all reservations (admin endpoint)
exports.getAllReservations = async (req, res) => {
    console.log("getAllReservations called");
    try {
        await updateCompletedReservations(); // Update statuses before fetching
        const reservations = await Reservation.find()
            .populate('propertyId', 'listingName address pricing mediaFiles');
            
        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get user's reservations (for logged-in users)
exports.getUserReservations = async (req, res) => {
    console.log("getUserReservations called");
    try {
        await updateCompletedReservations(); // Update statuses before fetching
        // Find reservations where user.id matches the logged-in user's ID
        const reservations = await Reservation.find({ 'user.id': req.user._id })
            .populate('propertyId', 'listingName address pricing mediaFiles');

        // Add property details to each reservation
        const reservationsWithDetails = await Promise.all(
            reservations.map(async (reservation) => {
                const reservationObj = reservation.toObject();
                return reservationObj;
            })
        );
            
        res.status(200).json(reservationsWithDetails);
    } catch (error) {
        console.error('Error fetching user reservations:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get property reservations (for property owners or admin)
exports.getPropertyReservations = async (req, res) => {
    console.log("getPropertyReservations called");
    try {
        const { propertyId } = req.params;
        const reservations = await Reservation.find({ propertyId });
        const property = await ListingItem.findById(propertyId)
            .select('listingName address pricing description');
        res.status(200).json({
            property,
            reservations
        });
    } catch (error) {
        console.error('Error fetching property reservations:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get a specific reservation by ID
exports.getReservation = async (req, res) => {
    console.log("getReservation called");
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('propertyId', 'listingName address pricing mediaFiles');
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Format the reservation object to match your sample structure
        const formattedReservation = {
            _id: reservation._id,
            propertyId: reservation.propertyId?._id || reservation.propertyId,
            dates: {
                startDate: reservation.dates?.startDate || reservation.checkInDate,
                endDate: reservation.dates?.endDate || reservation.checkOutDate
            },
            paymentIntentId: reservation.paymentIntentId,
            status: reservation.status,
            guests: reservation.guests,
            user: reservation.user,
            createdAt: reservation.createdAt,
            __v: reservation.__v
        };

        res.status(200).json(formattedReservation);
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new reservation
exports.createReservation = async (req, res) => {
    console.log("createReservation called");
    try {
        // Save reservation
        const reservation = new Reservation(req.body);
        await reservation.save();

        // Do NOT block dates here. This will be handled after payment in the Stripe webhook.

        res.status(201).json({ message: "Reservation created", reservation });
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update reservation status
exports.updateReservationStatus = async (req, res) => {
    console.log("updateReservationStatus called");
    res.status(501).json({ message: "Not implemented" });
};

// Cancel a reservation
exports.cancelReservation = async (req, res) => {
    console.log("cancelReservation called");
    try {
        const reservationId = req.params.id;
        const userId = req.user._id || req.user.userId;

        if (!reservationId || !userId) {
            return res.status(400).json({ message: "reservationId and user authentication required." });
        }

        // Find the reservation by _id and user.id, then update status
        const reservation = await Reservation.findOneAndUpdate(
            { _id: reservationId, 'user.id': userId },
            { $set: { status: 'canceled' } },
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found for this user." });
        }

        // Remove blocked dates for this reservation
        if (reservation.propertyId && reservation.dates && reservation.dates.startDate && reservation.dates.endDate) {
            await BlockedDate.deleteMany({
                propertyId: reservation.propertyId,
                startDate: reservation.dates.startDate,
                endDate: reservation.dates.endDate
            });
        }

        res.status(200).json({ message: "Reservation canceled successfully.", reservation });
    } catch (error) {
        console.error("Error canceling reservation:", error);
        res.status(500).json({ message: error.message });
    }
};

// Check if user has any reservations (for /user/reservations/check)
exports.checkUserReservations = async (req, res) => {
    try {
        console.log("control in checkuserreservations");
        if (!req.user || !(req.user._id || req.user.userId)) {
            console.error("req.user or user id is undefined:", req.user);
            return res.status(401).json({ message: "Unauthorized: user info missing in request." });
        }
        const userId = req.user._id || req.user.userId;
        console.log("user id in reservations is:", userId);

        const reservations = await Reservation.find({ 'user.id': userId });
        res.status(200).json({ hasReservations: reservations.length > 0, reservations });
    } catch (error) {
        console.error('Error checking user reservations:', error);
        res.status(500).json({ message: error.message });
    }
};
