// Project: TeamSync - Real-time Task Management
// File: KanbanColumn component with inline styles

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Circle, Plus } from 'lucide-react';
import KanbanTaskCard from './KanbanTaskCard';

const columnMeta = {
  todo: {
    title: 'To Do',
    color: '#6b7280',
    gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
  },
  'in-progress': {
    title: 'In Progress',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
  done: {
    title: 'Done',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e, #4ade80)',
  },
};

const KanbanColumn = ({ title, status, tasks, onAddTask }) => {
  const column = columnMeta[status] || columnMeta.todo;
  const displayTitle = title || column.title;

  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const styles = {
    column: {
      background: isOver ? 'rgba(99, 102, 241, 0.05)' : '#f8f9fc',
      borderRadius: '20px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '500px',
      transition: 'all 0.3s ease',
      border: isOver ? '2px dashed #6366f1' : '2px solid transparent',
    },
    addTaskButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '14px',
      padding: '10px 12px',
      borderRadius: '10px',
      border: `1px dashed ${column.color}`,
      background: '#ffffff',
      color: column.color,
      fontWeight: '600',
      cursor: 'pointer',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      padding: '16px',
      background: '#ffffff',
      borderRadius: '14px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    statusDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: column.gradient,
      boxShadow: `0 2px 8px ${column.color}40`,
    },
    columnTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1a1a2e',
      margin: 0,
    },
    taskCount: {
      background: `${column.color}15`,
      color: column.color,
      fontSize: '13px',
      fontWeight: '700',
      padding: '6px 12px',
      borderRadius: '20px',
      minWidth: '28px',
      textAlign: 'center',
    },
    taskList: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      overflowY: 'auto',
      paddingRight: '4px',
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: '#ffffff',
      borderRadius: '16px',
      border: '2px dashed #e5e7eb',
    },
    emptyIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: `${column.color}10`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px',
    },
    emptyText: {
      fontSize: '14px',
      color: '#9ca3af',
      textAlign: 'center',
      lineHeight: '1.5',
    },
    dropHint: {
      marginTop: '16px',
      padding: '12px 20px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
      borderRadius: '12px',
      fontSize: '13px',
      color: '#6366f1',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  };

  return (
    <div ref={setNodeRef} style={styles.column}>
      {/* Column Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.statusDot} />
          <h3 style={styles.columnTitle}>{displayTitle}</h3>
        </div>
        <span style={styles.taskCount}>{tasks.length}</span>
      </div>

      {/* Task List */}
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={styles.taskList}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <KanbanTaskCard key={task._id} task={task} />
            ))
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Circle size={24} color={column.color} />
              </div>
              <p style={styles.emptyText}>
                No tasks in {displayTitle.toLowerCase()}
              </p>
              {isOver && (
                <div style={styles.dropHint}>
                  <Plus size={16} />
                  Drop task here
                </div>
              )}
            </div>
          )}
        </div>
      </SortableContext>

      {onAddTask && (
        <button style={styles.addTaskButton} onClick={() => onAddTask(status)}>
          <Plus size={16} />
          Add Task
        </button>
      )}
    </div>
  );
};

export default KanbanColumn;
