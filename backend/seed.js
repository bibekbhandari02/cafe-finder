import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cafe from './models/Cafe.js';

dotenv.config();

const sampleCafes = [
  // Kathmandu Cafes
  {
    name: "Himalayan Java Coffee",
    description: "Popular coffee chain known for its quality coffee and cozy atmosphere. Great place for meetings and casual hangouts with free WiFi.",
    address: {
      street: "Thamel Marg",
      city: "Kathmandu",
      country: "Nepal",
      coordinates: { lat: 27.7145, lng: 85.3120 }
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Parking", "Outdoor Seating"],
    openingHours: {
      monday: "7:00 AM - 9:00 PM",
      tuesday: "7:00 AM - 9:00 PM",
      wednesday: "7:00 AM - 9:00 PM",
      thursday: "7:00 AM - 9:00 PM",
      friday: "7:00 AM - 10:00 PM",
      saturday: "7:00 AM - 10:00 PM",
      sunday: "7:00 AM - 9:00 PM"
    }
  },
  {
    name: "The Bakery Cafe",
    description: "Charming European-style bakery and cafe offering fresh pastries, sandwiches, and excellent coffee. Known for their breakfast menu.",
    address: {
      street: "Jhamsikhel Road",
      city: "Kathmandu",
      country: "Nepal",
      coordinates: { lat: 27.6769, lng: 85.3099 } // Jhamsikhel
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Outdoor Seating", "Bakery"]
  },
  {
    name: "Cafe Soma",
    description: "Trendy cafe with a modern vibe, serving specialty coffee, healthy food options, and delicious desserts. Popular among young professionals.",
    address: {
      street: "Lazimpat Road",
      city: "Kathmandu",
      country: "Nepal",
      coordinates: { lat: 27.7253, lng: 85.3240 } // Lazimpat
    },
    priceRange: "₹₹₹",
    amenities: ["WiFi", "Air Conditioning", "Parking"]
  },
  {
    name: "Roadhouse Cafe",
    description: "Lively cafe and bar with live music, great pizzas, and a vibrant atmosphere. Perfect for evening hangouts with friends.",
    address: {
      street: "Thamel",
      city: "Kathmandu",
      country: "Nepal",
      coordinates: { lat: 27.7156, lng: 85.3108 } // Thamel
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Live Music", "Bar", "Outdoor Seating"]
  },
  {
    name: "Illy Cafe",
    description: "Premium Italian coffee experience in the heart of Kathmandu. Elegant setting with high-quality espresso and Italian pastries.",
    address: {
      street: "Durbar Marg",
      city: "Kathmandu",
      country: "Nepal",
      coordinates: { lat: 27.7089, lng: 85.3206 } // Durbar Marg
    },
    priceRange: "₹₹₹",
    amenities: ["WiFi", "Air Conditioning", "Premium Coffee"]
  },
  // Lalitpur Cafes
  {
    name: "Cafe Cheeno",
    description: "Cozy neighborhood cafe in Patan with organic coffee and homemade cakes. Perfect spot for reading and relaxing.",
    address: {
      street: "Pulchowk",
      city: "Lalitpur",
      country: "Nepal",
      coordinates: { lat: 27.6784, lng: 85.3169 } // Pulchowk
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Organic Coffee", "Quiet Space"]
  },
  {
    name: "Dhokaima Cafe",
    description: "Traditional Newari cafe with authentic local cuisine and coffee. Beautiful garden setting with cultural ambiance.",
    address: {
      street: "Patan Dhoka",
      city: "Lalitpur",
      country: "Nepal",
      coordinates: { lat: 27.6726, lng: 85.3260 } // Patan Dhoka
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Garden Seating", "Traditional Food"]
  },
  {
    name: "Cafe de Patan",
    description: "Artsy cafe near Patan Durbar Square with local art displays and specialty coffee. Great for tourists and locals alike.",
    address: {
      street: "Mangal Bazaar",
      city: "Lalitpur",
      country: "Nepal",
      coordinates: { lat: 27.6722, lng: 85.3256 } // Near Patan Durbar Square
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Art Gallery", "Rooftop Seating"]
  },
  {
    name: "Himalayan Java - Jawalakhel",
    description: "Branch of popular coffee chain in Jawalakhel. Spacious seating with consistent quality coffee and snacks.",
    address: {
      street: "Jawalakhel Road",
      city: "Lalitpur",
      country: "Nepal",
      coordinates: { lat: 27.6698, lng: 85.3158 } // Jawalakhel
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Parking", "Meeting Rooms"]
  },
  {
    name: "Newa Lahana",
    description: "Traditional Newari restaurant and cafe with authentic local dishes and coffee. Cultural experience with great food.",
    address: {
      street: "Kumaripati",
      city: "Lalitpur",
      country: "Nepal",
      coordinates: { lat: 27.6650, lng: 85.3189 } // Kumaripati
    },
    priceRange: "₹₹₹",
    amenities: ["WiFi", "Traditional Decor", "Cultural Shows"]
  },
  // Bhaktapur Cafes
  {
    name: "Nyatapola Cafe",
    description: "Rooftop cafe with stunning views of Nyatapola Temple. Traditional architecture with modern coffee culture.",
    address: {
      street: "Taumadhi Square",
      city: "Bhaktapur",
      country: "Nepal",
      coordinates: { lat: 27.6719, lng: 85.4284 } // Taumadhi Square
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Rooftop View", "Traditional Setting"]
  },
  {
    name: "Peacock Guest House Cafe",
    description: "Heritage cafe in restored Newari building. Famous for their juju dhau (king yogurt) and coffee combination.",
    address: {
      street: "Durbar Square",
      city: "Bhaktapur",
      country: "Nepal",
      coordinates: { lat: 27.6722, lng: 85.4298 } // Bhaktapur Durbar Square
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Heritage Building", "Local Specialties"]
  },
  {
    name: "Cafe Nyatapola",
    description: "Modern cafe with traditional touch near the famous five-story temple. Great coffee and local snacks.",
    address: {
      street: "Taumadhi",
      city: "Bhaktapur",
      country: "Nepal",
      coordinates: { lat: 27.6716, lng: 85.4279 } // Near Nyatapola Temple
    },
    priceRange: "₹",
    amenities: ["WiFi", "Budget Friendly", "Quick Service"]
  },
  {
    name: "Beans The Coffee Shop",
    description: "Contemporary coffee shop in Bhaktapur with specialty brews. Popular among students and young professionals.",
    address: {
      street: "Suryabinayak",
      city: "Bhaktapur",
      country: "Nepal",
      coordinates: { lat: 27.6689, lng: 85.4356 } // Suryabinayak area
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Study Space", "Power Outlets"]
  },
  {
    name: "Pottery Square Cafe",
    description: "Unique cafe in the pottery square area. Watch potters at work while enjoying your coffee and traditional snacks.",
    address: {
      street: "Pottery Square",
      city: "Bhaktapur",
      country: "Nepal",
      coordinates: { lat: 27.6733, lng: 85.4267 } // Pottery Square
    },
    priceRange: "₹₹",
    amenities: ["WiFi", "Cultural Experience", "Outdoor Seating"]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing cafes
    await Cafe.deleteMany({});
    console.log('Cleared existing cafes');
    
    // Insert new cafes
    await Cafe.insertMany(sampleCafes);
    console.log(`✅ Database seeded successfully with ${sampleCafes.length} real cafes!`);
    console.log('\nCafes added:');
    
    const kathmandu = sampleCafes.filter(c => c.address.city === 'Kathmandu');
    const lalitpur = sampleCafes.filter(c => c.address.city === 'Lalitpur');
    const bhaktapur = sampleCafes.filter(c => c.address.city === 'Bhaktapur');
    
    console.log(`\n📍 Kathmandu (${kathmandu.length}):`);
    kathmandu.forEach((cafe, index) => {
      console.log(`  ${index + 1}. ${cafe.name} - ${cafe.address.coordinates.lat}, ${cafe.address.coordinates.lng}`);
    });
    
    console.log(`\n📍 Lalitpur (${lalitpur.length}):`);
    lalitpur.forEach((cafe, index) => {
      console.log(`  ${index + 1}. ${cafe.name} - ${cafe.address.coordinates.lat}, ${cafe.address.coordinates.lng}`);
    });
    
    console.log(`\n📍 Bhaktapur (${bhaktapur.length}):`);
    bhaktapur.forEach((cafe, index) => {
      console.log(`  ${index + 1}. ${cafe.name} - ${cafe.address.coordinates.lat}, ${cafe.address.coordinates.lng}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
