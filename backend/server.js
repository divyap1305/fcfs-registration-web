const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
const eventsRoutes = require('./routes/events');
app.use('/', eventsRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const conn = await connectDB(process.env.MONGO_URI);
    conn.on('connected', () => console.log('MongoDB connected'));
    conn.on('error', (err) => console.error('MongoDB error', err));

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
