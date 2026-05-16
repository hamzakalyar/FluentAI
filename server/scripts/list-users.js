/**
 * Lists all users in the database (without passwords).
 * Usage: node scripts/list-users.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    
    if (users.length === 0) {
      console.log('⚠️  No users found in the database.');
    } else {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach((u, i) => {
        console.log(`[${i + 1}] Name:  ${u.name}`);
        console.log(`     Email: ${u.email}`);
        console.log(`     ID:    ${u._id}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

listUsers();
