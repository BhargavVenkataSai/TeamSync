// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// Pattern: RESTful API, JWT Auth, Socket.io, Zustand
// Style: ES6+, async/await, functional React with hooks
// File: Socket.io client singleton and event helper utilities

import { io } from 'socket.io-client';

let socketInstance = null;

const resolveSocket = (socket) => socket || socketInstance;

const normalizeBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

export const initSocket = (token) => {
  if (socketInstance?.connected) {
    return socketInstance;
  }

  if (socketInstance && !socketInstance.connected) {
    socketInstance.connect();
    return socketInstance;
  }

  socketInstance = io(normalizeBaseUrl(), {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  socketInstance.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  return socketInstance;
};

export const disconnectSocket = (socket) => {
  const target = resolveSocket(socket);
  if (!target) {
    return;
  }

  target.disconnect();
  if (target === socketInstance) {
    socketInstance = null;
  }
};

export const getSocket = () => socketInstance;

export const onTaskCreated = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.on('task:created', callback);
};

export const onTaskUpdated = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.on('task:updated', callback);
};

export const onTaskDeleted = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.on('task:deleted', callback);
};

export const onUsersOnline = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.on('users:online', callback);
};

export const onUserStatusChange = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.on('user:status', callback);
};

export const onUserTyping = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.on('user:typing', callback);
};

export const emitTaskCreate = (socketOrTaskData, maybeTaskData) => {
  const socket = typeof socketOrTaskData?.emit === 'function' ? socketOrTaskData : socketInstance;
  const taskData = typeof socketOrTaskData?.emit === 'function' ? maybeTaskData : socketOrTaskData;
  socket?.emit('task:create', taskData);
};

export const emitTaskUpdate = (socketOrTaskId, taskIdOrUpdates, maybeUpdates) => {
  const isSocketFirst = typeof socketOrTaskId?.emit === 'function';
  const socket = isSocketFirst ? socketOrTaskId : socketInstance;

  if (typeof taskIdOrUpdates === 'string') {
    socket?.emit('task:update', {
      taskId: taskIdOrUpdates,
      updates: maybeUpdates,
    });
    return;
  }

  socket?.emit('task:update', isSocketFirst ? taskIdOrUpdates : socketOrTaskId);
};

export const emitTaskDelete = (socketOrTaskId, maybeTaskId) => {
  const taskId = typeof socketOrTaskId?.emit === 'function' ? maybeTaskId : socketOrTaskId;
  const socket = typeof socketOrTaskId?.emit === 'function' ? socketOrTaskId : socketInstance;
  socket?.emit('task:delete', taskId);
};

export const emitUserTyping = (socketOrTaskId, taskIdOrTyping, maybeTyping) => {
  const isSocketFirst = typeof socketOrTaskId?.emit === 'function';
  const socket = isSocketFirst ? socketOrTaskId : socketInstance;
  const taskId = isSocketFirst ? taskIdOrTyping : socketOrTaskId;
  const isTyping = isSocketFirst ? maybeTyping : taskIdOrTyping;

  socket?.emit('user:typing', { taskId, isTyping });
};

export const joinTaskRoom = (socketOrTaskId, maybeTaskId) => {
  const taskId = typeof socketOrTaskId?.emit === 'function' ? maybeTaskId : socketOrTaskId;
  const socket = typeof socketOrTaskId?.emit === 'function' ? socketOrTaskId : socketInstance;
  socket?.emit('join:task', taskId);
};

export const leaveTaskRoom = (socketOrTaskId, maybeTaskId) => {
  const taskId = typeof socketOrTaskId?.emit === 'function' ? maybeTaskId : socketOrTaskId;
  const socket = typeof socketOrTaskId?.emit === 'function' ? socketOrTaskId : socketInstance;
  socket?.emit('leave:task', taskId);
};

export const offTaskCreated = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.off('task:created', callback);
};

export const offTaskUpdated = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.off('task:updated', callback);
};

export const offTaskDeleted = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.off('task:deleted', callback);
};

export const offUsersOnline = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.off('users:online', callback);
};

export const offUserStatusChange = (socketOrCallback, maybeCallback) => {
  const callback = typeof socketOrCallback === 'function' ? socketOrCallback : maybeCallback;
  const socket = typeof socketOrCallback === 'function' ? socketInstance : socketOrCallback;
  socket?.off('user:status', callback);
};
