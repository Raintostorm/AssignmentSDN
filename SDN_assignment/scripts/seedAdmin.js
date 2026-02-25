require('dotenv').config();

const mongoose = require('mongoose');
const Member = require('../models/Member');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sdn_assignment';

async function seedAdmin() {
  try {
    await mongoose.connect(mongoUrl);

    const existing = await Member.findOne({ email: 'admin@myteam.com' });
    if (existing) {
      console.log('Admin user already exists.');
      return;
    }

    await Member.create({
      email: 'admin@myteam.com',
      password: 'admin123',
      name: 'Do Nam Trung',
      YOB: 1990,
      gender: true,
      isAdmin: true,
    });

    console.log('Admin user created successfully.');
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();

