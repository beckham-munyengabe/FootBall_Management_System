require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// DB
connectDB();

// Routes
app.get('/', (_req, res) => res.json({ message: 'Football Club API running ⚽' }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/players', require('./routes/player.routes'));
app.use('/api/coaches', require('./routes/coach.routes'));
app.use('/api/matches', require('./routes/match.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/performance', require('./routes/performance.routes'));
app.use('/api/training', require('./routes/training.routes'));
app.use('/api/finance', require('./routes/finance.routes'));
app.use('/api/salary', require('./routes/salary.routes'));

// 404 + error handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
