import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cafe from './models/Cafe.js';

dotenv.config();

const defaultHours = {
  monday: "7:00 AM - 9:00 PM",
  tuesday: "7:00 AM - 9:00 PM",
  wednesday: "7:00 AM - 9:00 PM",
  thursday: "7:00 AM - 9:00 PM",
  friday: "7:00 AM - 10:00 PM",
  saturday: "7:00 AM - 10:00 PM",
  sunday: "7:00 AM - 9:00 PM"
};

const sampleCafes = [
  {
    name: "Himalayan Java Coffee",
    description: "Popular coffee chain known for its quality coffee and cozy atmosphere. Great place for meetings and casual hangouts with free WiFi.",
    address: { street: "Thamel Marg", city: "Kathmandu", country: "Nepal", coordinates: { lat: 27.7145, lng: 85.3120 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Parking", "Outdoor Seating"],
    openingHours: defaultHours
  },
  {
    name: "The Bakery Cafe",
    description: "Charming European-style bakery and cafe offering fresh pastries, sandwiches, and excellent coffee. Known for their breakfast menu.",
    address: { street: "Jhamsikhel Road", city: "Kathmandu", country: "Nepal", coordinates: { lat: 27.6769, lng: 85.3099 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Outdoor Seating", "Bakery"],
    openingHours: { ...defaultHours, monday: "7:00 AM - 8:00 PM", tuesday: "7:00 AM - 8:00 PM", wednesday: "7:00 AM - 8:00 PM", thursday: "7:00 AM - 8:00 PM" }
  },
  {
    name: "Cafe Soma",
    description: "Trendy cafe with a modern vibe, serving specialty coffee, healthy food options, and delicious desserts. Popular among young professionals.",
    address: { street: "Lazimpat Road", city: "Kathmandu", country: "Nepal", coordinates: { lat: 27.7253, lng: 85.3240 } },
    priceRange: "₹₹₹",
    amenities: ["WiFi", "Air Conditioning", "Parking"],
    openingHours: { monday: "8:00 AM - 9:00 PM", tuesday: "8:00 AM - 9:00 PM", wednesday: "8:00 AM - 9:00 PM", thursday: "8:00 AM - 9:00 PM", friday: "8:00 AM - 10:00 PM", saturday: "8:00 AM - 10:00 PM", sunday: "8:00 AM - 9:00 PM" }
  },
  {
    name: "Roadhouse Cafe",
    description: "Lively cafe and bar with live music, great pizzas, and a vibrant atmosphere. Perfect for evening hangouts with friends.",
    address: { street: "Thamel", city: "Kathmandu", country: "Nepal", coordinates: { lat: 27.7156, lng: 85.3108 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Live Music", "Bar", "Outdoor Seating"],
    openingHours: { monday: "10:00 AM - 11:00 PM", tuesday: "10:00 AM - 11:00 PM", wednesday: "10:00 AM - 11:00 PM", thursday: "10:00 AM - 11:00 PM", friday: "10:00 AM - 12:00 AM", saturday: "10:00 AM - 12:00 AM", sunday: "10:00 AM - 11:00 PM" }
  },
  {
    name: "Illy Cafe",
    description: "Premium Italian coffee experience in the heart of Kathmandu. Elegant setting with high-quality espresso and Italian pastries.",
    address: { street: "Durbar Marg", city: "Kathmandu", country: "Nepal", coordinates: { lat: 27.7089, lng: 85.3206 } },
    priceRange: "₹₹₹",
    amenities: ["WiFi", "Air Conditioning", "Premium Coffee"],
    openingHours: defaultHours
  },
  {
    name: "Cafe Cheeno",
    description: "Cozy neighborhood cafe in Patan with organic coffee and homemade cakes. Perfect spot for reading and relaxing.",
    address: { street: "Pulchowk", city: "Lalitpur", country: "Nepal", coordinates: { lat: 27.6784, lng: 85.3169 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Organic Coffee", "Quiet Space"],
    openingHours: { monday: "8:00 AM - 8:00 PM", tuesday: "8:00 AM - 8:00 PM", wednesday: "8:00 AM - 8:00 PM", thursday: "8:00 AM - 8:00 PM", friday: "8:00 AM - 9:00 PM", saturday: "8:00 AM - 9:00 PM", sunday: "8:00 AM - 8:00 PM" }
  },
  {
    name: "Dhokaima Cafe",
    description: "Traditional Newari cafe with authentic local cuisine and coffee. Beautiful garden setting with cultural ambiance.",
    address: { street: "Patan Dhoka", city: "Lalitpur", country: "Nepal", coordinates: { lat: 27.6726, lng: 85.3260 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Garden Seating", "Traditional Food"],
    openingHours: { monday: "9:00 AM - 9:00 PM", tuesday: "9:00 AM - 9:00 PM", wednesday: "9:00 AM - 9:00 PM", thursday: "9:00 AM - 9:00 PM", friday: "9:00 AM - 10:00 PM", saturday: "9:00 AM - 10:00 PM", sunday: "9:00 AM - 9:00 PM" }
  },
  {
    name: "Cafe de Patan",
    description: "Artsy cafe near Patan Durbar Square with local art displays and specialty coffee. Great for tourists and locals alike.",
    address: { street: "Mangal Bazaar", city: "Lalitpur", country: "Nepal", coordinates: { lat: 27.6722, lng: 85.3256 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Art Gallery", "Rooftop Seating"],
    openingHours: defaultHours
  },
  {
    name: "Himalayan Java - Jawalakhel",
    description: "Branch of popular coffee chain in Jawalakhel. Spacious seating with consistent quality coffee and snacks.",
    address: { street: "Jawalakhel Road", city: "Lalitpur", country: "Nepal", coordinates: { lat: 27.6698, lng: 85.3158 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Parking", "Meeting Rooms"],
    openingHours: defaultHours
  },
  {
    name: "Newa Lahana",
    description: "Traditional Newari restaurant and cafe with authentic local dishes and coffee. Cultural experience with great food.",
    address: { street: "Kumaripati", city: "Lalitpur", country: "Nepal", coordinates: { lat: 27.6650, lng: 85.3189 } },
    priceRange: "₹₹₹",
    amenities: ["WiFi", "Traditional Decor", "Cultural Shows"],
    openingHours: { monday: "10:00 AM - 9:00 PM", tuesday: "10:00 AM - 9:00 PM", wednesday: "10:00 AM - 9:00 PM", thursday: "10:00 AM - 9:00 PM", friday: "10:00 AM - 10:00 PM", saturday: "10:00 AM - 10:00 PM", sunday: "10:00 AM - 9:00 PM" }
  },
  {
    name: "Nyatapola Cafe",
    description: "Rooftop cafe with stunning views of Nyatapola Temple. Traditional architecture with modern coffee culture.",
    address: { street: "Taumadhi Square", city: "Bhaktapur", country: "Nepal", coordinates: { lat: 27.6719, lng: 85.4284 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Rooftop View", "Traditional Setting"],
    openingHours: { monday: "7:00 AM - 8:00 PM", tuesday: "7:00 AM - 8:00 PM", wednesday: "7:00 AM - 8:00 PM", thursday: "7:00 AM - 8:00 PM", friday: "7:00 AM - 9:00 PM", saturday: "7:00 AM - 9:00 PM", sunday: "7:00 AM - 8:00 PM" }
  },
  {
    name: "Peacock Guest House Cafe",
    description: "Heritage cafe in restored Newari building. Famous for their juju dhau (king yogurt) and coffee combination.",
    address: { street: "Durbar Square", city: "Bhaktapur", country: "Nepal", coordinates: { lat: 27.6722, lng: 85.4298 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Heritage Building", "Local Specialties"],
    openingHours: defaultHours
  },
  {
    name: "Cafe Nyatapola",
    description: "Modern cafe with traditional touch near the famous five-story temple. Great coffee and local snacks.",
    address: { street: "Taumadhi", city: "Bhaktapur", country: "Nepal", coordinates: { lat: 27.6716, lng: 85.4279 } },
    priceRange: "₹",
    amenities: ["WiFi", "Budget Friendly", "Quick Service"],
    openingHours: { monday: "6:00 AM - 8:00 PM", tuesday: "6:00 AM - 8:00 PM", wednesday: "6:00 AM - 8:00 PM", thursday: "6:00 AM - 8:00 PM", friday: "6:00 AM - 9:00 PM", saturday: "6:00 AM - 9:00 PM", sunday: "6:00 AM - 8:00 PM" }
  },
  {
    name: "Beans The Coffee Shop",
    description: "Contemporary coffee shop in Bhaktapur with specialty brews. Popular among students and young professionals.",
    address: { street: "Suryabinayak", city: "Bhaktapur", country: "Nepal", coordinates: { lat: 27.6689, lng: 85.4356 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Study Space", "Power Outlets"],
    openingHours: defaultHours
  },
  {
    name: "Pottery Square Cafe",
    description: "Unique cafe in the pottery square area. Watch potters at work while enjoying your coffee and traditional snacks.",
    address: { street: "Pottery Square", city: "Bhaktapur", country: "Nepal", coordinates: { lat: 27.6733, lng: 85.4267 } },
    priceRange: "₹₹",
    amenities: ["WiFi", "Cultural Experience", "Outdoor Seating"],
    openingHours: { monday: "8:00 AM - 7:00 PM", tuesday: "8:00 AM - 7:00 PM", wednesday: "8:00 AM - 7:00 PM", thursday: "8:00 AM - 7:00 PM", friday: "8:00 AM - 8:00 PM", saturday: "8:00 AM - 8:00 PM", sunday: "8:00 AM - 7:00 PM" }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    await Cafe.deleteMany({});
    console.log('Cleared existing cafes');
    
    await Cafe.insertMany(sampleCafes);
    console.log(`✅ Database seeded with ${sampleCafes.length} cafes (with opening hours)!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
