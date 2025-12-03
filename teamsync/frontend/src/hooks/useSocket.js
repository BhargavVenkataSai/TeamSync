// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Custom hook for Socket.io connection management

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import {
  initSocket,
  disconnectSocket,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
  onUsersOnline,
  offTaskCreated,
  offTaskUpdated,
  offTaskDeleted,
  offUsersOnline,
} from '../utils/socket';

export const useSocket = () => {
  const { token } = useAuthStore();
  const { addTask, updateTaskInStore, removeTask } = useTaskStore();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Socket event handlers
  const handleTaskCreated = useCallback((task) => {
    addTask(task);
  }, [addTask]);

  const handleTaskUpdated = useCallback((data) => {
    updateTaskInStore(data.task);
  }, [updateTaskInStore]);

  const handleTaskDeleted = useCallback((taskId) => {
    removeTask(taskId);
  }, [removeTask]);

  const handleUsersOnline = useCallback((users) => {
    setOnlineUsers(users);
  }, []);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      setIsConnected(false);
      setOnlineUsers([]);
      return;
    }

    // Initialize socket connection
    const socket = initSocket(token);

    // Handle connection state
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set up event listeners
    onTaskCreated(handleTaskCreated);
    onTaskUpdated(handleTaskUpdated);
    onTaskDeleted(handleTaskDeleted);
    onUsersOnline(handleUsersOnline);

    // Set initial connection state
    if (socket.connected) {
      setIsConnected(true);
    }

    // Cleanup on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      offTaskCreated(handleTaskCreated);
      offTaskUpdated(handleTaskUpdated);
      offTaskDeleted(handleTaskDeleted);
      offUsersOnline(handleUsersOnline);
      disconnectSocket();
    };
  }, [token, handleTaskCreated, handleTaskUpdated, handleTaskDeleted, handleUsersOnline]);

  return { isConnected, onlineUsers };
};

export default useSocket;
