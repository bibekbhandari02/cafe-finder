import express from 'express';
import Review from '../models/Review.js';
import Cafe from '../models/Cafe.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a cafe
router.get('/cafe/:cafeId', async (req, res) => {
  try {
    const reviews = await Review.find({ cafe: req.params.cafeId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/', protect, async (req, res) => {
  try {
    const { cafe, rating, comment } = req.body;

    const existingReview = await Review.findOne({ cafe, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this cafe' });
    }

    const review = await Review.create({
      user: req.user._id,
      cafe,
      rating,
      comment
    });

    // Update cafe rating
    const reviews = await Review.find({ cafe });
    const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
    
    await Cafe.findByIdAndUpdate(cafe, {
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    });

    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;