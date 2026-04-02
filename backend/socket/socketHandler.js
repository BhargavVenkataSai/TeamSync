// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Socket.io event handler for real-time features

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store online users: userId -> { user, sockets: Set<socketId> }
const onlineUsers = new Map();

const setupSocket = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };

      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.userId})`);

    // Add user to online users (support multiple sockets per user)
    const existing = onlineUsers.get(socket.userId);
    if (existing) {
      existing.sockets.add(socket.id);
    } else {
      onlineUsers.set(socket.userId, {
        user: socket.user,
        sockets: new Set([socket.id]),
      });
    }

    // Update user online status in database
    try {
      await User.findByIdAndUpdate(socket.userId, { isOnline: true });
    } catch (error) {
      console.error('Error updating online status:', error);
    }

    io.emit('user:status', {
      userId: socket.userId,
      isOnline: true,
      user: socket.user,
    });

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Broadcast updated online users list (unique users)
    const onlineUsersList = Array.from(onlineUsers.values()).map((u) => u.user);
    io.emit('users:online', onlineUsersList);

    // Handle task events
    socket.on('task:create', (task) => {
      // Broadcast to all except sender
      socket.broadcast.emit('task:created', task);
    });

    socket.on('task:update', (data) => {
      // Broadcast to all except sender
      socket.broadcast.emit('task:updated', data);
    });

    socket.on('task:delete', (taskId) => {
      // Broadcast to all except sender
      socket.broadcast.emit('task:deleted', taskId);
    });

    // Handle typing indicator for task details
    socket.on('user:typing', ({ taskId, isTyping }) => {
      socket.to(`task:${taskId}`).emit('user:typing', {
        user: socket.user,
        taskId,
        isTyping,
      });
    });

    // Room management for focused task updates
    socket.on('join:task', (taskId) => {
      socket.join(`task:${taskId}`);
      console.log(`User ${socket.user.name} joined task room: ${taskId}`);
    });

    socket.on('leave:task', (taskId) => {
      socket.leave(`task:${taskId}`);
      console.log(`User ${socket.user.name} left task room: ${taskId}`);
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.user.name} (${socket.userId})`);
      let becameOffline = false;

      // Remove this socket from the user's socket set
      const entry = onlineUsers.get(socket.userId);
      if (entry) {
        entry.sockets.delete(socket.id);

        // If no more sockets for this user, mark offline and remove from map
        if (entry.sockets.size === 0) {
          onlineUsers.delete(socket.userId);
          becameOffline = true;

          try {
            await User.findByIdAndUpdate(socket.userId, { isOnline: false });
          } catch (error) {
            console.error('Error updating offline status:', error);
          }
        }
      }

      if (becameOffline) {
        io.emit('user:status', {
          userId: socket.userId,
          isOnline: false,
          user: socket.user,
        });
      }

      // Broadcast updated online users list (unique users)
      const onlineUsersList = Array.from(onlineUsers.values()).map((u) => u.user);
      io.emit('users:online', onlineUsersList);
    });
  });
};

module.exports = { setupSocket, onlineUsers };
