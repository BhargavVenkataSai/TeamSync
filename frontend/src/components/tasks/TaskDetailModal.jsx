// Project: TeamSync - Real-time Task Management
// File: Task Detail Modal with comments and attachments

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  MessageSquare,
  Paperclip,
  Send,
  Trash2,
  Download,
  FileText,
  Image,
  File,
  Clock,
  User,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { tasksAPI } from '../../utils/api';
import { useThemeStore, getThemeColors } from '../../store/themeStore';

const TaskDetailModal = ({ isOpen, onClose, task, onTaskUpdate }) => {
  const [activeTab, setActiveTab] = useState('comments');
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { theme } = useThemeStore();
  const colors = getThemeColors(theme);

  useEffect(() => {
    if (task) {
      setComments(task.comments || []);
      setAttachments(task.attachments || []);
    }
  }, [task]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;

    setLoading(true);
    try {
      const response = await tasksAPI.addComment(task._id, { text: newComment });
      const updatedTask = response.data.data.task;
      setComments(updatedTask.comments);
      setNewComment('');
      if (onTaskUpdate) onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!task) return;

    try {
      const response = await tasksAPI.deleteComment(task._id, commentId);
      const updatedTask = response.data.data.task;
      setComments(updatedTask.comments);
      if (onTaskUpdate) onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !task) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await tasksAPI.addAttachment(task._id, formData);
      const updatedTask = response.data.data.task;
      setAttachments(updatedTask.attachments);
      if (onTaskUpdate) onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!task) return;

    try {
      const response = await tasksAPI.deleteAttachment(task._id, attachmentId);
      const updatedTask = response.data.data.task;
      setAttachments(updatedTask.attachments);
      if (onTaskUpdate) onTaskUpdate(updatedTask);
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) {
      return <Image size={20} color="#10b981" />;
    }
    if (mimetype === 'application/pdf') {
      return <FileText size={20} color="#ef4444" />;
    }
    return <File size={20} color="#6366f1" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isOpen || !task) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: colors.modalOverlay,
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    },
    modal: {
      background: colors.cardBg,
      borderRadius: '20px',
      width: '90%',
      minWidth: '500px',
      maxWidth: '650px',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
    },
    header: {
      padding: '24px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '16px',
      flexShrink: 0,
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: colors.textPrimary,
      margin: 0,
    },
    closeButton: {
      padding: '8px',
      background: colors.bgTertiary,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      color: colors.textSecondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabs: {
      display: 'flex',
      padding: '0 24px',
      borderBottom: `1px solid ${colors.border}`,
      gap: '8px',
      flexShrink: 0,
    },
    tab: (isActive) => ({
      padding: '14px 20px',
      background: 'none',
      border: 'none',
      borderBottom: isActive ? '3px solid #6366f1' : '3px solid transparent',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: isActive ? '#6366f1' : colors.textSecondary,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }),
    tabBadge: {
      background: 'rgba(99, 102, 241, 0.15)',
      color: '#6366f1',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '12px',
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px',
    },
    commentInput: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      background: colors.bgSecondary,
      color: colors.textPrimary,
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    sendButton: {
      padding: '12px 16px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      border: 'none',
      borderRadius: '12px',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    commentItem: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
      padding: '16px',
      background: colors.bgTertiary,
      borderRadius: '12px',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '600',
      flexShrink: 0,
    },
    commentContent: {
      flex: 1,
      minWidth: 0,
    },
    commentHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '4px',
    },
    commentAuthor: {
      fontSize: '14px',
      fontWeight: '600',
      color: colors.textPrimary,
    },
    commentTime: {
      fontSize: '12px',
      color: colors.textMuted,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    commentText: {
      fontSize: '14px',
      color: colors.textSecondary,
      lineHeight: '1.5',
      margin: 0,
    },
    deleteButton: {
      padding: '6px',
      background: 'none',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      color: colors.textMuted,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '16px',
      border: `2px dashed ${colors.border}`,
      borderRadius: '12px',
      background: 'transparent',
      color: colors.textSecondary,
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'all 0.2s',
      width: '100%',
    },
    attachmentItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 16px',
      background: colors.bgTertiary,
      borderRadius: '12px',
      marginBottom: '10px',
    },
    attachmentIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: colors.bgSecondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    attachmentInfo: {
      flex: 1,
      minWidth: 0,
    },
    attachmentName: {
      fontSize: '14px',
      fontWeight: '500',
      color: colors.textPrimary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    attachmentMeta: {
      fontSize: '12px',
      color: colors.textMuted,
    },
    attachmentActions: {
      display: 'flex',
      gap: '8px',
    },
    iconButton: {
      padding: '8px',
      background: colors.bgSecondary,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      color: colors.textSecondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    empty: {
      textAlign: 'center',
      padding: '32px',
      color: colors.textMuted,
    },
  };

  return createPortal(
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{task.title}</h2>
            {task.description && (
              <p style={{ margin: '8px 0 0', color: colors.textSecondary, fontSize: '14px' }}>
                {task.description}
              </p>
            )}
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('comments')}
            style={styles.tab(activeTab === 'comments')}
          >
            <MessageSquare size={18} />
            Comments
            <span style={styles.tabBadge}>{comments.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('attachments')}
            style={styles.tab(activeTab === 'attachments')}
          >
            <Paperclip size={18} />
            Files
            <span style={styles.tabBadge}>{attachments.length}</span>
          </button>
        </div>

        <div style={styles.content}>
          {activeTab === 'comments' && (
            <>
              <div style={styles.commentInput}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  style={styles.input}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  style={styles.sendButton}
                  disabled={loading || !newComment.trim()}
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>

              {comments.length === 0 ? (
                <div style={styles.empty}>
                  <MessageSquare size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} style={styles.commentItem}>
                    <div style={styles.avatar}>
                      {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div style={styles.commentContent}>
                      <div style={styles.commentHeader}>
                        <span style={styles.commentAuthor}>
                          {comment.user?.name || 'Unknown User'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={styles.commentTime}>
                            <Clock size={12} />
                            {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                          </span>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            style={styles.deleteButton}
                            title="Delete comment"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p style={styles.commentText}>{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'attachments' && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={styles.uploadButton}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Paperclip size={20} />
                    Click to upload a file (max 10MB)
                  </>
                )}
              </button>

              {attachments.length === 0 ? (
                <div style={styles.empty}>
                  <Paperclip size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p>No attachments yet. Upload files to share with your team.</p>
                </div>
              ) : (
                attachments.map((attachment) => (
                  <div key={attachment._id} style={styles.attachmentItem}>
                    <div style={styles.attachmentIcon}>
                      {getFileIcon(attachment.mimetype)}
                    </div>
                    <div style={styles.attachmentInfo}>
                      <div style={styles.attachmentName}>{attachment.originalName}</div>
                      <div style={styles.attachmentMeta}>
                        {formatFileSize(attachment.size)} • Uploaded by {attachment.uploadedBy?.name || 'Unknown'}
                      </div>
                    </div>
                    <div style={styles.attachmentActions}>
                      <a
                        href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${attachment.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.iconButton}
                        title="Download"
                      >
                        <Download size={16} />
                      </a>
                      <button
                        onClick={() => handleDeleteAttachment(attachment._id)}
                        style={styles.iconButton}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TaskDetailModal;
