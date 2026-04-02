// Project: TeamSync - Real-time Task Management
// File: KanbanTaskCard component with inline styles

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Tag, User, GripVertical, AlertCircle, Clock, MessageSquare, Paperclip } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const KanbanTaskCard = ({ task, isDragging, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  // Priority styles
  const getPriorityStyles = () => {
    switch (task.priority) {
      case 'high':
        return {
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#dc2626',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          dot: '#ef4444',
        };
      case 'medium':
        return {
          background: 'rgba(245, 158, 11, 0.15)',
          color: '#d97706',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          dot: '#f59e0b',
        };
      default:
        return {
          background: 'rgba(59, 130, 246, 0.15)',
          color: '#2563eb',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          dot: '#3b82f6',
        };
    }
  };

  const priorityStyles = getPriorityStyles();

  const styles = {
    card: {
      background: '#ffffff',
      borderRadius: '14px',
      boxShadow: isDragging || isSortableDragging
        ? '0 20px 40px rgba(0, 0, 0, 0.2)'
        : '0 2px 8px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      cursor: isDragging ? 'grabbing' : 'grab',
      opacity: isSortableDragging ? 0.5 : 1,
      transform: isDragging ? 'rotate(3deg)' : 'none',
      transition: 'box-shadow 0.2s, transform 0.2s',
    },
    priorityBar: {
      height: '3px',
      background: `linear-gradient(90deg, ${priorityStyles.dot}, ${priorityStyles.dot}80)`,
    },
    content: {
      padding: '16px',
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      marginBottom: '10px',
    },
    dragHandle: {
      padding: '4px',
      color: '#d1d5db',
      cursor: 'grab',
      flexShrink: 0,
      marginTop: '2px',
    },
    title: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1a1a2e',
      margin: 0,
      lineHeight: '1.4',
      flex: 1,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    description: {
      fontSize: '13px',
      color: '#6b7280',
      marginBottom: '12px',
      marginLeft: '28px',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '12px',
      marginLeft: '28px',
    },
    tag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 8px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))',
      color: '#6366f1',
      fontSize: '11px',
      fontWeight: '500',
      borderRadius: '12px',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '12px',
      marginLeft: '28px',
      borderTop: '1px solid rgba(0, 0, 0, 0.04)',
    },
    footerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    priorityBadge: {
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: '600',
      borderRadius: '12px',
      ...priorityStyles,
    },
    dueDate: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '11px',
      fontWeight: '500',
      color: isOverdue ? '#dc2626' : isDueToday ? '#d97706' : '#9ca3af',
    },
    assignee: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    avatar: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #e5e7eb',
    },
    avatarPlaceholder: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    assigneeName: {
      fontSize: '11px',
      color: '#6b7280',
      fontWeight: '500',
      maxWidth: '80px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    indicators: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      fontSize: '10px',
      color: '#9ca3af',
      fontWeight: '500',
    },
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...styles.card, ...style }}
      onClick={() => onClick?.(task)}
      {...attributes}
    >
      {/* Priority bar */}
      <div style={styles.priorityBar} />

      <div style={styles.content}>
        {/* Header with drag handle and title */}
        <div style={styles.header}>
          <div style={styles.dragHandle} {...listeners}>
            <GripVertical size={16} />
          </div>
          <h4 style={styles.title}>{task.title}</h4>
        </div>

        {/* Description */}
        {task.description && (
          <p style={styles.description}>{task.description}</p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div style={styles.tagsContainer}>
            {task.tags.slice(0, 2).map((tag, index) => (
              <span key={index} style={styles.tag}>
                <Tag size={9} />
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span style={{ ...styles.tag, background: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' }}>
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerLeft}>
            <span style={styles.priorityBadge}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            {task.dueDate && (
              <div style={styles.dueDate}>
                {isOverdue && <AlertCircle size={12} />}
                <Clock size={12} />
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}
            {/* Comments and Attachments indicators */}
            {(task.comments?.length > 0 || task.attachments?.length > 0) && (
              <div style={styles.indicators}>
                {task.comments?.length > 0 && (
                  <span style={styles.indicator} title={`${task.comments.length} comments`}>
                    <MessageSquare size={10} />
                    {task.comments.length}
                  </span>
                )}
                {task.attachments?.length > 0 && (
                  <span style={styles.indicator} title={`${task.attachments.length} files`}>
                    <Paperclip size={10} />
                    {task.attachments.length}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Assignee */}
          {task.assignedTo && (
            <div style={styles.assignee}>
              {task.assignedTo.avatar ? (
                <img
                  src={task.assignedTo.avatar}
                  alt={task.assignedTo.name}
                  style={styles.avatar}
                />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  <User size={12} color="#9ca3af" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanTaskCard;
