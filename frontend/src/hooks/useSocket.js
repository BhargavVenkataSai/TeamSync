// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Custom hook for Socket.io connection management

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import {
  initSocket,
  disconnectSocket,
  getSocket,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
  onUsersOnline,
  onUserStatusChange,
  offTaskCreated,
  offTaskUpdated,
  offTaskDeleted,
  offUsersOnline,
  offUserStatusChange,
} from '../utils/socket';

export const useSocket = () => {
  const { token } = useAuthStore();
  const { addTask, updateTaskInStore, removeTask } = useTaskStore();
  const [socket, setSocket] = useState(null);
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

  const handleUserStatus = useCallback((statusPayload) => {
    setOnlineUsers((prevUsers) => {
      const existing = prevUsers.find((user) => user._id === statusPayload.userId);

      if (statusPayload.isOnline) {
        if (existing) {
          return prevUsers;
        }

        const nextUser = statusPayload.user || {
          _id: statusPayload.userId,
          name: 'Unknown User',
          email: '',
        };
        return [...prevUsers, nextUser];
      }

      return prevUsers.filter((user) => user._id !== statusPayload.userId);
    });
  }, []);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
      return;
    }

    // Initialize socket connection
    const socketClient = initSocket(token);
    setSocket(socketClient);

    // Handle connection state
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketClient.on('connect', handleConnect);
    socketClient.on('disconnect', handleDisconnect);

    // Set up event listeners
    onTaskCreated(socketClient, handleTaskCreated);
    onTaskUpdated(socketClient, handleTaskUpdated);
    onTaskDeleted(socketClient, handleTaskDeleted);
    onUsersOnline(socketClient, handleUsersOnline);
    onUserStatusChange(socketClient, handleUserStatus);

    // Set initial connection state
    if (socketClient.connected) {
      setIsConnected(true);
    }

    // Cleanup on unmount
    return () => {
      socketClient.off('connect', handleConnect);
      socketClient.off('disconnect', handleDisconnect);
      offTaskCreated(socketClient, handleTaskCreated);
      offTaskUpdated(socketClient, handleTaskUpdated);
      offTaskDeleted(socketClient, handleTaskDeleted);
      offUsersOnline(socketClient, handleUsersOnline);
      offUserStatusChange(socketClient, handleUserStatus);

      // Disconnect only if this is the active singleton.
      if (getSocket() === socketClient) {
        disconnectSocket(socketClient);
      }
    };
  }, [
    token,
    handleTaskCreated,
    handleTaskUpdated,
    handleTaskDeleted,
    handleUsersOnline,
    handleUserStatus,
  ]);

  return { socket, isConnected, onlineUsers };
};

export default useSocket;
