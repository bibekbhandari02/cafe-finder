import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@cafe.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@cafe.com',
      password: 'admin123',
      isAdmin: true
    });

    console.log('Admin created successfully!');
    console.log('Email: admin@cafe.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
