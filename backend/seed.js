require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Shipment = require('./models/Shipment');
const Inquiry = require('./models/Inquiry');
const User = require('./models/User');

const seedData = async () => {
  try {
    await connectDB();

    // Clear all existing data
    await Shipment.deleteMany({});
    await Inquiry.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared all data (shipments, inquiries, users) from database.');

    // Seed admin user
    const adminUser = new User({
      username: 'meharroadlines',
      email: 'admin@meharroadlines.com',
      password: 'mehar1522'
    });

    await adminUser.save();
    console.log('Successfully seeded admin user: meharroadlines');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
