// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// File: Zustand store for task management

import { create } from 'zustand';
import { tasksAPI } from '../utils/api';
import { emitTaskCreate, emitTaskUpdate, emitTaskDelete } from '../utils/socket';

export const useTaskStore = create((set, get) => ({
  // State
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    search: '',
  },
  stats: null,

  // Actions
  fetchTasks: async () => {
    const { filters } = get();
    set({ loading: true, error: null });
    
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;
      
      const response = await tasksAPI.getAll(params);
      set({ 
        tasks: response.data.data.tasks, 
        loading: false 
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  createTask: async (taskData) => {
    set({ loading: true, error: null });
    
    try {
      const response = await tasksAPI.create(taskData);
      const newTask = response.data.data.task;
      
      // Optimistic update
      set((state) => ({ 
        tasks: [newTask, ...state.tasks],
        loading: false 
      }));
      
      // Emit socket event for real-time update
      emitTaskCreate(newTask);
      
      return { success: true, task: newTask };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  updateTask: async (id, updates) => {
    const { tasks } = get();
    const originalTask = tasks.find(t => t._id === id);
    
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map(task => 
        task._id === id ? { ...task, ...updates } : task
      ),
    }));
    
    try {
      const response = await tasksAPI.update(id, updates);
      const updatedTask = response.data.data.task;
      
      set((state) => ({
        tasks: state.tasks.map(task => 
          task._id === id ? updatedTask : task
        ),
      }));
      
      // Emit socket event for real-time update
      emitTaskUpdate({ taskId: id, task: updatedTask });
      
      return { success: true, task: updatedTask };
    } catch (error) {
      // Revert on error
      set((state) => ({
        tasks: state.tasks.map(task => 
          task._id === id ? originalTask : task
        ),
        error: error.response?.data?.message || 'Failed to update task',
      }));
      return { success: false, error: error.response?.data?.message };
    }
  },

  deleteTask: async (id) => {
    const { tasks } = get();
    const originalTasks = [...tasks];
    
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.filter(task => task._id !== id),
    }));
    
    try {
      await tasksAPI.delete(id);
      
      // Emit socket event for real-time update
      emitTaskDelete(id);
      
      return { success: true };
    } catch (error) {
      // Revert on error
      set({ 
        tasks: originalTasks,
        error: error.response?.data?.message || 'Failed to delete task',
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  fetchStats: async () => {
    try {
      const response = await tasksAPI.getStats();
      set({ stats: response.data.data.stats });
      return { success: true };
    } catch {
      return { success: false };
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    // Refetch tasks with new filters
    get().fetchTasks();
  },

  clearFilters: () => {
    set({
      filters: { status: '', priority: '', search: '' },
    });
    get().fetchTasks();
  },

  setCurrentTask: (task) => set({ currentTask: task }),
  clearCurrentTask: () => set({ currentTask: null }),
  clearError: () => set({ error: null }),

  // Real-time update handlers
  addTask: (task) => {
    set((state) => ({
      tasks: [task, ...state.tasks.filter(t => t._id !== task._id)],
    }));
  },

  updateTaskInStore: (updatedTask) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      ),
    }));
  },

  removeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task._id !== taskId),
    }));
  },

  // Timer actions
  startTimer: async (taskId) => {
    try {
      const response = await tasksAPI.startTimer(taskId);
      const updatedTask = response.data.data.task;
      set((state) => ({
        tasks: state.tasks.map(task =>
          task._id === taskId ? { ...task, activeTimerStart: updatedTask.activeTimerStart } : task
        ),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to start timer' };
    }
  },

  stopTimer: async (taskId) => {
    try {
      const response = await tasksAPI.stopTimer(taskId);
      const updatedTask = response.data.data.task;
      set((state) => ({
        tasks: state.tasks.map(task =>
          task._id === taskId ? { ...task, activeTimerStart: null } : task
        ),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to stop timer' };
    }
  },

  // Get subtasks for a parent task
  getSubtasks: (parentId) => {
    return get().tasks.filter(t => t.parentTaskId === parentId);
  },
}));
