import mongoose from 'mongoose';

const cafeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  address: {
    street: String,
    city: String,
    country: String,
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1554119921-6c2c948fd9b0'
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$', '₹', '₹₹', '₹₹₹'], // ✅ added ₹ options
    default: '₹' // optional: set default to ₹
  },
  amenities: [String],
  avgRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  openingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  }
});

export default mongoose.model('Cafe', cafeSchema);
