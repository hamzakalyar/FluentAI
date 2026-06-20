/**
 * DATABASE RESET SCRIPT
 * =====================
 * Clears: Sessions, PracticeResults, and user weak-sound/stats fields.
 * 
 * Usage:
 *   node scripts/clearDatabase.js
 * 
 * Run from the /server directory.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('\n❌  No MONGO_URI found in .env — aborting.\n');
  process.exit(1);
}

async function clearDatabase() {
  console.log('\n🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅  Connected.\n');

  const db = mongoose.connection.db;

  // ── 1. Drop Sessions ──────────────────────────────────────────
  const sessionResult = await db.collection('sessions').deleteMany({});
  console.log(`🗑️   Sessions deleted:        ${sessionResult.deletedCount}`);

  // ── 2. Drop PracticeResults ───────────────────────────────────
  let practiceResult = { deletedCount: 0 };
  try {
    practiceResult = await db.collection('practiceresults').deleteMany({});
  } catch (_) {
    // collection may not exist yet — that's fine
  }
  console.log(`🗑️   PracticeResults deleted: ${practiceResult.deletedCount}`);

  // ── 3. Reset all User stats & weak sounds ────────────────────
  const userResult = await db.collection('users').updateMany(
    {},
    {
      $set: {
        weakSounds:           [],
        totalSessions:        0,
        averageFluencyScore:  0,
      }
    }
  );
  console.log(`🔄  Users reset:              ${userResult.modifiedCount}`);

  console.log('\n✅  Full database reset complete.\n');
  await mongoose.disconnect();
  process.exit(0);
}

clearDatabase().catch(err => {
  console.error('\n❌  Reset failed:', err.message);
  process.exit(1);
});
