import express from 'express';
import Cafe from '../models/Cafe.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload, hasCloudinaryConfig } from '../config/cloudinary.js';

const router = express.Router();

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
    console.log('=== ADD CAFE REQUEST ===');
    console.log('BODY:', JSON.stringify(req.body, null, 2));
    console.log('FILE:', JSON.stringify(req.file, null, 2));
    console.log('Cloudinary configured:', hasCloudinaryConfig);

    // Handle image path based on storage type
    let imagePath = null;
    if (req.file) {
      if (hasCloudinaryConfig) {
        imagePath = req.file.path;
        console.log('Using Cloudinary path:', imagePath);
      } else {
        imagePath = `/uploads/${req.file.filename}`;
        console.log('Using local path:', imagePath);
      }
    }

    const cafeData = {
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
    };

    console.log('Creating cafe with data:', cafeData);
    const cafe = await Cafe.create(cafeData);
    console.log('✅ Cafe created successfully:', cafe._id);
    
    res.status(201).json(cafe);
  } catch (error) {
    console.error('❌ ERROR ADDING CAFE:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      message: 'Failed to add cafe', 
      error: error.message,
      details: error.toString()
    });
  }
});

// Update cafe (Admin only)
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    console.log('=== UPDATE CAFE REQUEST ===');
    console.log('ID:', req.params.id);
    console.log('BODY:', JSON.stringify(req.body, null, 2));
    console.log('FILE:', req.file ? JSON.stringify(req.file, null, 2) : 'No file uploaded');
    console.log('Cloudinary configured:', hasCloudinaryConfig);

    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) {
      console.log('❌ Cafe not found');
      return res.status(404).json({ message: 'Cafe not found' });
    }

    console.log('Current cafe image:', cafe.image);

    // Handle image path based on storage type
    let imagePath = cafe.image; // Keep existing image by default
    if (req.file) {
      if (hasCloudinaryConfig) {
        // Cloudinary returns the full URL in req.file.path
        imagePath = req.file.path;
        console.log('✅ New Cloudinary image path:', imagePath);
      } else {
        // Local storage returns filename
        imagePath = `/uploads/${req.file.filename}`;
        console.log('✅ New local image path:', imagePath);
      }
    } else {
      console.log('ℹ️ No new image uploaded, keeping existing image');
    }

    // Update fields
    cafe.name = req.body.name || cafe.name;
    cafe.description = req.body.description || cafe.description;
    cafe.address.street = req.body.street || cafe.address.street;
    cafe.address.city = req.body.city || cafe.address.city;
    cafe.address.coordinates.lat = req.body.lat ? parseFloat(req.body.lat) : cafe.address.coordinates.lat;
    cafe.address.coordinates.lng = req.body.lng ? parseFloat(req.body.lng) : cafe.address.coordinates.lng;
    cafe.priceRange = req.body.priceRange || cafe.priceRange;
    cafe.amenities = req.body.amenities ? req.body.amenities.split(',').map(a => a.trim()) : cafe.amenities;
    
    // Handle opening hours if provided
    if (req.body.openingHours) {
      try {
        cafe.openingHours = typeof req.body.openingHours === 'string' 
          ? JSON.parse(req.body.openingHours) 
          : req.body.openingHours;
      } catch (e) {
        console.log('⚠️ Could not parse opening hours:', e.message);
      }
    }
    
    cafe.image = imagePath;

    console.log('Saving cafe with image:', cafe.image);
    const updatedCafe = await cafe.save();
    console.log('✅ UPDATE SUCCESS - Cafe ID:', updatedCafe._id);
    console.log('✅ Final image path:', updatedCafe.image);
    
    res.json(updatedCafe);
  } catch (error) {
    console.error('❌ UPDATE ERROR:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      message: 'Failed to update cafe',
      error: error.message,
      details: error.toString()
    });
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
