const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const sequelize = require('./config/database');
const setupSocket = require('./socket/chat');

// Import models to register associations
require('./models/User');
require('./models/Listing');
require('./models/Message');
require('./models/Review');
require('./models/Wishlist');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] },
});

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Disable caching for API responses
app.use('/api', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => res.json({ message: 'NestBazaar API running' }));

setupSocket(io);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, () => console.log(`NestBazaar server running on port ${PORT}`));
}).catch((err) => console.error('DB connection failed:', err));
