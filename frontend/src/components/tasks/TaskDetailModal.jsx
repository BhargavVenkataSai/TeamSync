import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X, MessageSquare, Paperclip, Send, Trash2, Download, FileText, Image, File,
  Clock, Loader2, ListChecks, Plus, CheckCircle2, Circle, Play, Square
} from 'lucide-react';
import { format } from 'date-fns';
import { tasksAPI } from '../../utils/api';
import { useTaskStore } from '../../store/taskStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const TaskDetailModal = ({ isOpen, onClose, task, onTaskUpdate }) => {
  const [activeTab, setActiveTab] = useState('subtasks');
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creatingSubtask, setCreatingSubtask] = useState(false);
  const fileInputRef = useRef(null);
  const { tasks, createTask, updateTask, startTimer, stopTimer } = useTaskStore();

  // Get subtasks for this task
  const subtasks = tasks.filter(t => t.parentTaskId === task?._id);
  const completedSubtasks = subtasks.filter(t => t.status === 'done').length;

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
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim() || !task) return;
    setCreatingSubtask(true);
    try {
      await createTask({
        title: newSubtaskTitle.trim(),
        parentTaskId: task._id,
        status: 'todo',
        priority: task.priority || 'medium',
        description: '',
        tags: [],
      });
      setNewSubtaskTitle('');
    } catch (error) {
      console.error('Error creating subtask:', error);
    } finally {
      setCreatingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtask) => {
    const newStatus = subtask.status === 'done' ? 'todo' : 'done';
    await updateTask(subtask._id, { status: newStatus });
  };

  const getFileIcon = (mimetype) => {
    if (mimetype?.startsWith('image/')) return <Image className="h-5 w-5 text-emerald-500" />;
    if (mimetype === 'application/pdf') return <FileText className="h-5 w-5 text-rose-500" />;
    return <File className="h-5 w-5 text-indigo-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isOpen || !task) return null;

  const tabs = [
    { id: 'subtasks', label: 'Subtasks', icon: ListChecks, count: subtasks.length },
    { id: 'comments', label: 'Comments', icon: MessageSquare, count: comments.length },
    { id: 'attachments', label: 'Files', icon: Paperclip, count: attachments.length },
  ];

  const subtaskProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-card rounded-2xl w-[90%] min-w-[400px] max-w-[650px] max-h-[85vh] flex flex-col shadow-2xl border border-border/50 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-border/50 flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-foreground truncate">{task.title}</h2>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 rounded-lg">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-border/50 gap-1 shrink-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-[3px] transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-500'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span className="bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full text-[11px] font-bold">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* === SUBTASKS TAB === */}
          {activeTab === 'subtasks' && (
            <div className="space-y-4">
              {/* Progress */}
              {subtasks.length > 0 && (
                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Progress</span>
                    <span className={`font-bold ${subtaskProgress === 100 ? 'text-emerald-500' : 'text-foreground'}`}>
                      {completedSubtasks}/{subtasks.length} completed
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${subtaskProgress === 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                      style={{ width: `${subtaskProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Add Subtask Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  className="bg-background/50 border-border/50"
                />
                <Button
                  onClick={handleAddSubtask}
                  disabled={creatingSubtask || !newSubtaskTitle.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shrink-0 px-4"
                >
                  {creatingSubtask ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>

              {/* Subtask Checklist */}
              {subtasks.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <ListChecks className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No subtasks yet</p>
                  <p className="text-sm mt-1">Break this task into smaller pieces</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {subtasks.map(subtask => (
                    <div
                      key={subtask._id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                        subtask.status === 'done'
                          ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
                          : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                      }`}
                      onClick={() => handleToggleSubtask(subtask)}
                    >
                      {subtask.status === 'done' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground group-hover:text-indigo-500 shrink-0 transition-colors" />
                      )}
                      <span className={`text-sm font-medium flex-1 ${subtask.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {subtask.title}
                      </span>
                      {subtask.activeTimerStart && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          tracking
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === COMMENTS TAB === */}
          {activeTab === 'comments' && (
            <>
              <div className="flex gap-3 mb-5">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  className="bg-background/50 border-border/50"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={loading || !newComment.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shrink-0 px-4"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              {comments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No comments yet</p>
                  <p className="text-sm mt-1">Be the first to comment!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-foreground">{comment.user?.name || 'Unknown'}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                            </span>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* === ATTACHMENTS TAB === */}
          {activeTab === 'attachments' && (
            <>
              <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-border/50 rounded-xl text-muted-foreground hover:text-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all mb-5"
              >
                {uploading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Uploading...</>
                ) : (
                  <><Paperclip className="h-5 w-5" /> Click to upload a file (max 10MB)</>
                )}
              </button>

              {attachments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Paperclip className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No attachments yet</p>
                  <p className="text-sm mt-1">Upload files to share with your team</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {attachments.map((attachment) => (
                    <div key={attachment._id} className="flex items-center gap-3 p-3.5 bg-muted/30 rounded-xl border border-border/50">
                      <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center border border-border/50 shrink-0">
                        {getFileIcon(attachment.mimetype)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{attachment.originalName}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {formatFileSize(attachment.size)} • {attachment.uploadedBy?.name || 'Unknown'}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <a
                          href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${attachment.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteAttachment(attachment._id)}
                          className="p-2 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
