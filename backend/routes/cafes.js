import express from 'express';
import Cafe from '../models/Cafe.js';
import { protect, adminOnly } from '../middleware/auth.js';
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

// Get all cafes with improved search
router.get('/', async (req, res) => {
  try {
    const { search, city, priceRange, amenity } = req.query;
    let query = {};

    // Improved search: search in name, description, and amenities
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { amenities: { $regex: search, $options: 'i' } }
      ];
    }

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

// Add cafe with image upload (Admin only)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
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
      openingHours: req.body.openingHours ? JSON.parse(req.body.openingHours) : undefined,
      image: imagePath || undefined,
    });

    res.status(201).json(cafe);
  } catch (error) {
    console.error('ERROR ADDING CAFE:', error);
    res.status(500).json({ message: 'Failed to add cafe', error: error.message });
  }
});

// Update cafe (Admin only)
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : cafe.image;

    cafe.name = req.body.name || cafe.name;
    cafe.description = req.body.description || cafe.description;
    cafe.address.street = req.body.street || cafe.address.street;
    cafe.address.city = req.body.city || cafe.address.city;
    cafe.address.coordinates.lat = req.body.lat ? parseFloat(req.body.lat) : cafe.address.coordinates.lat;
    cafe.address.coordinates.lng = req.body.lng ? parseFloat(req.body.lng) : cafe.address.coordinates.lng;
    cafe.priceRange = req.body.priceRange || cafe.priceRange;
    cafe.amenities = req.body.amenities ? req.body.amenities.split(',').map(a => a.trim()) : cafe.amenities;
    cafe.image = imagePath;

    const updatedCafe = await cafe.save();
    res.json(updatedCafe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete cafe (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) return res.status(404).json({ message: 'Cafe not found' });

    await cafe.deleteOne();
    res.json({ message: 'Cafe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
