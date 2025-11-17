import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cafe from './models/Cafe.js';

dotenv.config();

const sampleCafes = [
  {
    name: "The Coffee House",
    description: "Cozy cafe with artisanal coffee and homemade pastries",
    address: {
      street: "123 Main St",
      city: "Lalitpur",
      country: "Nepal",
      coordinates: { lat: 27.6667, lng: 85.3167 }
    },
    priceRange: "$$",
    amenities: ["WiFi", "Outdoor Seating", "Parking"],
    openingHours: {
      monday: "7:00 AM - 9:00 PM",
      tuesday: "7:00 AM - 9:00 PM",
      wednesday: "7:00 AM - 9:00 PM",
      thursday: "7:00 AM - 9:00 PM",
      friday: "7:00 AM - 10:00 PM",
      saturday: "8:00 AM - 10:00 PM",
      sunday: "8:00 AM - 8:00 PM"
    }
  },
  {
    name: "Brew & Bean",
    description: "Modern coffee shop with specialty roasts",
    address: {
      street: "456 Lakeside",
      city: "Pokhara",
      country: "Nepal",
      coordinates: { lat: 28.2096, lng: 83.9856 }
    },
    priceRange: "$$$",
    amenities: ["WiFi", "Live Music", "Delivery"],
    openingHours: {
      monday: "6:00 AM - 8:00 PM",
      tuesday: "6:00 AM - 8:00 PM",
      wednesday: "6:00 AM - 8:00 PM",
      thursday: "6:00 AM - 8:00 PM",
      friday: "6:00 AM - 9:00 PM",
      saturday: "7:00 AM - 9:00 PM",
      sunday: "7:00 AM - 7:00 PM"
    }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Cafe.deleteMany({});
    await Cafe.insertMany(sampleCafes);
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();