import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SkillSwap API is running' });
});

// --- Socket.io for Chat ---
const users = {};

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // Register user with their userId
  socket.on('register', (userId) => {
    users[userId] = socket.id;
    console.log(`✅ User ${userId} registered with socket ${socket.id}`);
  });

  // Join a chat room (between two users)
  socket.on('join-chat', (roomId) => {
    socket.join(roomId);
    console.log(`📥 User joined room: ${roomId}`);
  });

  // Send message
  socket.on('send-message', (data) => {
    const { roomId, message, fromUser, toUser } = data;
    console.log(`💬 Message in ${roomId}: ${message}`);
    
    // Emit to everyone in the room
    io.to(roomId).emit('receive-message', {
      message,
      fromUser,
      toUser,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
    // Remove user from users object
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`💬 Socket.io server ready`);
});