import express from 'express';
import Cafe from '../models/Cafe.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all cafes
router.get('/', async (req, res) => {
  try {
    const { search, city, priceRange, amenity } = req.query;
    let query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (priceRange) query.priceRange = priceRange;
    if (amenity) query.amenities = { $in: [amenity] };

    const cafes = await Cafe.find(query).sort({ avgRating: -1 });
    res.json(cafes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single cafe
router.get('/:id', async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

    res.json(cafe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add cafe with image upload
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const cafe = await Cafe.create({
      name: req.body.name,
      description: req.body.description,
      address: {
        street: req.body.street,
        city: req.body.city,
        country: 'Nepal',
        coordinates: {
          lat: parseFloat(req.body.lat),
          lng: parseFloat(req.body.lng),
        },
      },
      priceRange: req.body.priceRange || '₹',
      amenities: req.body.amenities
        ? req.body.amenities.split(',').map(a => a.trim())
        : [],
      image: imagePath || undefined,
    });

    res.status(201).json(cafe);
  } catch (error) {
    console.error('ERROR ADDING CAFE:', error);
    res.status(500).json({ message: 'Failed to add cafe', error: error.message });
  }
});


export default router;
