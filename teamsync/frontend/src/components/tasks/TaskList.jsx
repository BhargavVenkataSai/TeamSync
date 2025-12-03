// Project: TeamSync - Real-time Task Management
// File: TaskList component with modern inline styles

import { useEffect, useState } from 'react';
import { Plus, ClipboardList, Loader2 } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';

const TaskList = () => {
  const { tasks, loading, error, fetchTasks, deleteTask, createTask, updateTask } = useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
      } else {
        await createTask(formData);
      }
      handleCloseForm();
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    // Refresh the task list to get updated data
    fetchTasks();
  };

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Tasks</h1>
          <p style={styles.subtitle}>Manage and track your team's tasks</p>
        </div>
        <button onClick={handleOpenCreate} style={styles.addButton}>
          <Plus style={{ width: '20px', height: '20px' }} />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <TaskFilters />

      {/* Error State */}
      {error && (
        <div style={styles.errorBox}>{error}</div>
      )}

      {/* Loading State */}
      {loading && tasks.length === 0 && (
        <div style={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && tasks.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <ClipboardList style={{ width: '32px', height: '32px', color: '#6366f1' }} />
          </div>
          <h3 style={styles.emptyTitle}>No tasks yet</h3>
          <p style={styles.emptyText}>
            Get started by creating your first task. Click the button below to add a new task.
          </p>
          <button onClick={handleOpenCreate} style={styles.createButton}>
            <Plus style={{ width: '20px', height: '20px' }} />
            Create First Task
          </button>
        </div>
      )}

      {/* Task Grid */}
      {tasks.length > 0 && (
        <div style={styles.grid}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTaskUpdate={handleTaskUpdate}
            />
          ))}
        </div>
      )}

      {/* Loading overlay when refetching */}
      {loading && tasks.length > 0 && (
        <div style={styles.loadingOverlay}>
          <Loader2 style={{ width: '24px', height: '24px', color: '#6366f1', animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        task={editingTask}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

// Loading skeleton component
const TaskSkeleton = () => (
  <div style={styles.skeleton}>
    <div style={{ ...styles.skeletonBar, height: '4px', marginBottom: '16px' }} />
    <div style={{ ...styles.skeletonBar, width: '75%', marginBottom: '12px' }} />
    <div style={{ ...styles.skeletonBar, marginBottom: '8px' }} />
    <div style={{ ...styles.skeletonBar, width: '60%', marginBottom: '16px' }} />
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      <div style={{ ...styles.skeletonBar, width: '60px', height: '24px', borderRadius: '12px' }} />
      <div style={{ ...styles.skeletonBar, width: '60px', height: '24px', borderRadius: '12px' }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
      <div style={{ ...styles.skeletonBar, width: '80px' }} />
      <div style={{ ...styles.skeletonBar, width: '24px', height: '24px', borderRadius: '50%' }} />
    </div>
  </div>
);

const styles = {
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '4px',
    margin: 0,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.9rem',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
    transition: 'all 0.2s',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid #fecaca',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb',
    padding: '64px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    backgroundColor: '#eef2ff',
    borderRadius: '16px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#6b7280',
    marginBottom: '24px',
    maxWidth: '360px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  createButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: 'white',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.9rem',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
  },
  loadingOverlay: {
    display: 'flex',
    justifyContent: 'center',
    padding: '32px',
  },
  skeleton: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb',
    padding: '20px',
    animation: 'pulse 2s ease-in-out infinite',
  },
  skeletonBar: {
    height: '16px',
    backgroundColor: '#e5e7eb',
    borderRadius: '8px',
  },
};

export default TaskList;
