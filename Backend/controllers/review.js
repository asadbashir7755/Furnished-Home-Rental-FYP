const Review = require('../models/reviewmodel');

// Submit a new review
exports.submitReview = async (req, res) => {
  try {
    const { propertyId, userId, userName, rating, comment } = req.body;
    if (!propertyId || !userId || !userName || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const review = new Review({
      propertyId,
      userId,
      userName,
      rating,
      comment
    });
    await review.save();
    res.status(201).json({ message: 'Review submitted successfully.', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit review.', error: error.message });
  }
};

// Get all reviews for a specific property
exports.getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const reviews = await Review.find({ propertyId }).sort({ createdAt: 1 });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews.', error: error.message });
  }
};
