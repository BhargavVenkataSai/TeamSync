// Project: TeamSync - Real-time Task Management
// File: TaskCard component with inline styles

import { useState } from 'react';
import {
  Calendar,
  Edit2,
  Trash2,
  AlertCircle,
  User,
  MoreVertical,
  Clock,
  Tag,
  MessageSquare,
  Paperclip,
  Eye,
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import TaskDetailModal from './TaskDetailModal';

const TaskCard = ({ task, onEdit, onDelete, onTaskUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setShowMenu(false);
  };

  const confirmDelete = () => {
    onDelete(task._id);
    setShowDeleteConfirm(false);
  };

  // Priority styles
  const getPriorityStyles = () => {
    switch (task.priority) {
      case 'high':
        return {
          bar: { background: 'linear-gradient(90deg, #ef4444, #f87171)' },
          badge: { 
            background: 'rgba(239, 68, 68, 0.15)', 
            color: '#dc2626',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }
        };
      case 'medium':
        return {
          bar: { background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' },
          badge: { 
            background: 'rgba(245, 158, 11, 0.15)', 
            color: '#d97706',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }
        };
      default:
        return {
          bar: { background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' },
          badge: { 
            background: 'rgba(59, 130, 246, 0.15)', 
            color: '#2563eb',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }
        };
    }
  };

  // Status styles
  const getStatusStyles = () => {
    switch (task.status) {
      case 'in-progress':
        return { 
          background: 'rgba(245, 158, 11, 0.15)', 
          color: '#d97706'
        };
      case 'done':
        return { 
          background: 'rgba(34, 197, 94, 0.15)', 
          color: '#16a34a'
        };
      default:
        return { 
          background: 'rgba(107, 114, 128, 0.15)', 
          color: '#4b5563'
        };
    }
  };

  const statusLabels = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done',
  };

  const priorityStyles = getPriorityStyles();
  const statusStyles = getStatusStyles();

  // Styles
  const styles = {
    card: {
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: isHovered 
        ? '0 10px 40px rgba(0, 0, 0, 0.12)' 
        : '0 2px 12px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    },
    priorityBar: {
      height: '4px',
      ...priorityStyles.bar,
    },
    content: {
      padding: '20px',
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: '12px',
    },
    title: {
      fontSize: '16px',
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
    menuButton: {
      padding: '6px',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#9ca3af',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
    },
    menuDropdown: {
      position: 'absolute',
      right: 0,
      top: '100%',
      marginTop: '4px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      padding: '6px',
      zIndex: 20,
      minWidth: '140px',
    },
    menuItem: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      fontSize: '14px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'background 0.2s',
    },
    description: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '14px',
      lineHeight: '1.5',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    tagsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '14px',
    },
    tag: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
      color: '#6366f1',
      fontSize: '12px',
      fontWeight: '500',
      borderRadius: '20px',
    },
    tagExtra: {
      padding: '4px 10px',
      background: 'rgba(107, 114, 128, 0.1)',
      color: '#6b7280',
      fontSize: '12px',
      fontWeight: '500',
      borderRadius: '20px',
    },
    badgesContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
      flexWrap: 'wrap',
    },
    statusBadge: {
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: '600',
      borderRadius: '20px',
      ...statusStyles,
    },
    priorityBadge: {
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: '600',
      borderRadius: '20px',
      ...priorityStyles.badge,
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '14px',
      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    },
    dueDate: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: '500',
      color: isOverdue ? '#dc2626' : isDueToday ? '#d97706' : '#6b7280',
    },
    assignee: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    avatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #e5e7eb',
    },
    avatarPlaceholder: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    assigneeName: {
      fontSize: '12px',
      color: '#4b5563',
      fontWeight: '500',
      maxWidth: '100px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    unassigned: {
      fontSize: '12px',
      color: '#9ca3af',
      fontStyle: 'italic',
    },
    indicators: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginLeft: 'auto',
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '11px',
      color: '#6b7280',
      fontWeight: '500',
    },
    viewDetailsBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      fontSize: '12px',
      fontWeight: '500',
      color: '#6366f1',
      background: 'rgba(99, 102, 241, 0.1)',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px',
    },
    modal: {
      background: '#ffffff',
      borderRadius: '20px',
      padding: '28px',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1a1a2e',
      marginBottom: '10px',
    },
    modalText: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '24px',
      lineHeight: '1.5',
    },
    modalButtons: {
      display: 'flex',
      gap: '12px',
    },
    cancelButton: {
      flex: 1,
      padding: '12px 20px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      background: 'transparent',
      color: '#4b5563',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    deleteButton: {
      flex: 1,
      padding: '12px 20px',
      border: 'none',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  };

  return (
    <div 
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Priority indicator bar */}
      <div style={styles.priorityBar} />

      <div style={styles.content}>
        {/* Header with title and menu */}
        <div style={styles.header}>
          <h3 style={styles.title}>{task.title}</h3>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={styles.menuButton}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.color = '#4b5563';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }}
            >
              <MoreVertical size={18} />
            </button>
            
            {/* Dropdown menu */}
            {showMenu && (
              <>
                <div style={styles.menuOverlay} onClick={() => setShowMenu(false)} />
                <div style={styles.menuDropdown}>
                  <button
                    onClick={() => {
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    style={{ ...styles.menuItem, color: '#374151' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{ ...styles.menuItem, color: '#dc2626' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p style={styles.description}>{task.description}</p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div style={styles.tagsContainer}>
            {task.tags.slice(0, 3).map((tag, index) => (
              <span key={index} style={styles.tag}>
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span style={styles.tagExtra}>+{task.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Status and Priority badges */}
        <div style={styles.badgesContainer}>
          <span style={styles.statusBadge}>
            {statusLabels[task.status]}
          </span>
          <span style={styles.priorityBadge}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          {/* Comments and Attachments indicators */}
          {(task.comments?.length > 0 || task.attachments?.length > 0) && (
            <div style={styles.indicators}>
              {task.comments?.length > 0 && (
                <span style={styles.indicator} title={`${task.comments.length} comments`}>
                  <MessageSquare size={12} />
                  {task.comments.length}
                </span>
              )}
              {task.attachments?.length > 0 && (
                <span style={styles.indicator} title={`${task.attachments.length} files`}>
                  <Paperclip size={12} />
                  {task.attachments.length}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer with due date and assignee */}
        <div style={styles.footer}>
          {/* Due date */}
          {task.dueDate ? (
            <div style={styles.dueDate}>
              {isOverdue && <AlertCircle size={14} />}
              <Clock size={14} />
              <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
            </div>
          ) : (
            <div />
          )}

          {/* View Details Button */}
          <button
            onClick={() => setShowDetailModal(true)}
            style={styles.viewDetailsBtn}
            title="View details, comments & files"
          >
            <Eye size={14} />
            <span>Details</span>
          </button>

          {/* Assigned user */}
          {task.assignedTo ? (
            <div style={styles.assignee}>
              {task.assignedTo.avatar ? (
                <img
                  src={task.assignedTo.avatar}
                  alt={task.assignedTo.name}
                  style={styles.avatar}
                />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  <User size={14} color="#9ca3af" />
                </div>
              )}
              <span style={styles.assigneeName}>{task.assignedTo.name}</span>
            </div>
          ) : (
            <span style={styles.unassigned}>Unassigned</span>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Delete Task?</h3>
            <p style={styles.modalText}>
              Are you sure you want to delete "<strong>{task.title}</strong>"? This action cannot be undone.
            </p>
            <div style={styles.modalButtons}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={styles.cancelButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={styles.deleteButton}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal with Comments & Attachments */}
      <TaskDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        task={task}
        onTaskUpdate={onTaskUpdate}
      />
    </div>
  );
};

export default TaskCard;
