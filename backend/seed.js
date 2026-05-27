// Seed script: creates one user per role. Run: node seed.js
require('dotenv').config();
const connectDB = require('./config/db');
const { User } = require('./models');

(async () => {
  await connectDB();
  const seeds = [
    { username: 'admin', email: 'admin@club.com', password: 'admin123', role: 'administrator' },
    { username: 'coach', email: 'coach@club.com', password: 'coach123', role: 'coach' },
    { username: 'player', email: 'player@club.com', password: 'player123', role: 'player' },
    { username: 'accountant', email: 'acc@club.com', password: 'acc12345', role: 'accountant' },
  ];
  for (const s of seeds) {
    const exists = await User.findOne({ email: s.email });
    if (exists) { console.log('skip', s.email); continue; }
    await User.create(s);
    console.log('✔ created', s.email, '/', s.password);
  }
  process.exit(0);
})();
