// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Socket.io client manager

import { io } from 'socket.io-client';

let socket = null;

// Initialize socket connection
export const initSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // Remove '/api' from the URL if present
  const socketURL = API_URL.replace('/api', '');

  socket = io(socketURL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Get current socket instance
export const getSocket = () => socket;

// Event listener helpers
export const onTaskCreated = (callback) => {
  socket?.on('task:created', callback);
};

export const onTaskUpdated = (callback) => {
  socket?.on('task:updated', callback);
};

export const onTaskDeleted = (callback) => {
  socket?.on('task:deleted', callback);
};

export const onUsersOnline = (callback) => {
  socket?.on('users:online', callback);
};

export const onUserTyping = (callback) => {
  socket?.on('user:typing', callback);
};

// Event emitter helpers
export const emitTaskCreate = (task) => {
  socket?.emit('task:create', task);
};

export const emitTaskUpdate = (data) => {
  socket?.emit('task:update', data);
};

export const emitTaskDelete = (taskId) => {
  socket?.emit('task:delete', taskId);
};

export const emitUserTyping = (taskId, isTyping) => {
  socket?.emit('user:typing', { taskId, isTyping });
};

export const joinTaskRoom = (taskId) => {
  socket?.emit('join:task', taskId);
};

export const leaveTaskRoom = (taskId) => {
  socket?.emit('leave:task', taskId);
};

// Remove event listeners
export const offTaskCreated = (callback) => {
  socket?.off('task:created', callback);
};

export const offTaskUpdated = (callback) => {
  socket?.off('task:updated', callback);
};

export const offTaskDeleted = (callback) => {
  socket?.off('task:deleted', callback);
};

export const offUsersOnline = (callback) => {
  socket?.off('users:online', callback);
};
