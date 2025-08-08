const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');

// Submit a new review
router.post('/reviews', reviewController.submitReview);

// Get all reviews for a specific property
router.get('/reviews/property/:propertyId', reviewController.getPropertyReviews);

module.exports = router;
