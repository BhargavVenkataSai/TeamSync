// Project: TeamSync - Real-time Task Management
// File: KanbanBoard component with drag and drop

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Layout, RefreshCw, Loader2 } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import KanbanTaskCard from './KanbanTaskCard';
import { useTaskStore } from '../../store/taskStore';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#6b7280', gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)' },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { id: 'done', title: 'Done', color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #4ade80)' },
];

const KanbanBoard = ({ tasks = [], onTaskUpdate, isLoading }) => {
  const [activeId, setActiveId] = useState(null);
  const { updateTask } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = tasks.find((task) => task._id === active.id);
    const overId = over.id;

    // Determine new status
    let newStatus;
    if (COLUMNS.some((col) => col.id === overId)) {
      newStatus = overId;
    } else {
      const overTask = tasks.find((task) => task._id === overId);
      newStatus = overTask?.status;
    }

    if (activeTask && newStatus && activeTask.status !== newStatus) {
      try {
        await updateTask(activeTask._id, { status: newStatus });
        if (onTaskUpdate) onTaskUpdate();
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find((task) => task._id === activeId) : null;

  const styles = {
    container: {
      minHeight: 'calc(100vh - 200px)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '28px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    headerIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1a1a2e',
      margin: 0,
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '4px',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    refreshButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 18px',
      fontSize: '14px',
      fontWeight: '600',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      background: '#ffffff',
      color: '#4b5563',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    taskCount: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
      color: '#6366f1',
      borderRadius: '20px',
    },
    boardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      minHeight: '600px',
    },
    '@media (max-width: 1024px)': {
      boardContainer: {
        gridTemplateColumns: '1fr',
      },
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '16px',
      zIndex: 10,
    },
    loadingContent: {
      textAlign: 'center',
    },
    loadingText: {
      marginTop: '12px',
      fontSize: '14px',
      color: '#6b7280',
    },
    emptyBoard: {
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
      border: '2px dashed #e5e7eb',
    },
    emptyIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    emptyTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1a1a2e',
      marginBottom: '8px',
    },
    emptyText: {
      fontSize: '14px',
      color: '#6b7280',
      textAlign: 'center',
      maxWidth: '300px',
    },
  };

  // Responsive board container style
  const getBoardStyle = () => {
    if (window.innerWidth <= 1024) {
      return {
        ...styles.boardContainer,
        gridTemplateColumns: '1fr',
        overflowX: 'auto',
      };
    }
    return styles.boardContainer;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Layout size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={styles.title}>Kanban Board</h2>
            <p style={styles.subtitle}>Drag and drop to update task status</p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.taskCount}>
            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
          </span>
          <button
            onClick={onTaskUpdate}
            disabled={isLoading}
            style={styles.refreshButton}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <RefreshCw size={16} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div style={getBoardStyle()}>
          {tasks.length === 0 && !isLoading ? (
            <div style={styles.emptyBoard}>
              <div style={styles.emptyIcon}>
                <Layout size={36} color="#6366f1" />
              </div>
              <h3 style={styles.emptyTitle}>No tasks yet</h3>
              <p style={styles.emptyText}>
                Create your first task to start organizing your work on the Kanban board
              </p>
            </div>
          ) : (
            COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={getTasksByStatus(column.id)}
              />
            ))
          )}
        </div>

        <DragOverlay>
          {activeTask ? (
            <KanbanTaskCard task={activeTask} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Loading Overlay */}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={styles.loadingText}>Updating board...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .kanban-board-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default KanbanBoard;
