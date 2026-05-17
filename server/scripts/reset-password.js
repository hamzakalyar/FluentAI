/**
 * Run this script to fix a user whose password is stored as plain text in MongoDB.
 * Usage: node scripts/reset-password.js
 * 
 * Edit EMAIL and NEW_PASSWORD below before running.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EMAIL = 'hamza@test.com';
const NEW_PASSWORD = 'Test1234'; // <-- change this to whatever password you want

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email: EMAIL });
    if (!user) {
      console.log(`❌ User not found: ${EMAIL}`);
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`);

    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 12);
    await usersCollection.updateOne(
      { email: EMAIL },
      { $set: { password: hashedPassword } }
    );

    console.log(`✅ Password reset successfully for ${EMAIL}`);
    console.log(`   New password: ${NEW_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

resetPassword();
