const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables specifically from the server folder
dotenv.config({ path: path.join(__dirname, '.env') });

// Use 127.0.0.1 for better compatibility with local MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/speakflow';

async function resetHamzaData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected.');

    // Inline schema to avoid importing model files
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ 
        name: String, 
        weakSounds: Array,
        fluencyTrend: Array
    }));
    
    const hamza = await User.findOne({ name: { $regex: /^hamza$/i } });

    if (!hamza) {
      console.log('❌ User "Hamza" not found. Please check the name in your database.');
      process.exit(1);
    }

    console.log(`👤 Found User: ${hamza.name} (ID: ${hamza._id})`);

    // 2. Clear Collections
    // We use the raw collection names to ensure they are cleared even without models
    const collections = ['practiceresults', 'sessions'];
    
    for (const collName of collections) {
      const result = await mongoose.connection.db.collection(collName).deleteMany({ 
        $or: [
          { user: hamza._id },
          { userId: hamza._id }
        ]
      });
      console.log(`🗑️  Deleted ${result.deletedCount} records from ${collName}.`);
    }

    // 3. Reset User Profile
    await User.updateOne(
      { _id: hamza._id },
      { $set: { weakSounds: [], fluencyTrend: [] } }
    );
    console.log('✨ Hamza\'s profile metrics have been reset.');

    console.log('\n✅ ALL DATA CLEARED. Hamza now has a fresh profile.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during reset:', err);
    process.exit(1);
  }
}

resetHamzaData();
