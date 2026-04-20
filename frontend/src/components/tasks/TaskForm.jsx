import { useState, useEffect } from 'react';
import { X, Save, Tag, Calendar, User, AlertTriangle, Loader2 } from 'lucide-react';
import { authAPI } from '../../utils/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const TaskForm = ({ isOpen, onClose, onSubmit, task, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', status: 'todo', priority: 'medium',
    dueDate: '', assignedTo: '', tags: '',
  });
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadUsers = async () => {
      if (!isOpen) return;
      setUsersLoading(true);
      try {
        const response = await authAPI.getUsers();
        setUsers(response.data?.data?.users || []);
      } catch (error) {
        console.error('Failed to load users:', error);
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };
    loadUsers();
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '', description: task.description || '',
        status: task.status || 'todo', priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignedTo: task.assignedTo?._id || '',
        tags: task.tags ? task.tags.join(', ') : '',
      });
    } else {
      setFormData({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', assignedTo: '', tags: '' });
    }
    setErrors({});
  }, [task, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (formData.description && formData.description.length > 500) newErrors.description = 'Description must be less than 500 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      assignedTo: formData.assignedTo || null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  if (!isOpen) return null;

  const inputClass = "w-full h-11 px-4 text-sm bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;
  const labelClass = "flex items-center gap-2 text-sm font-semibold text-foreground mb-2";

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-card rounded-2xl max-w-[560px] w-full max-h-[90vh] overflow-hidden shadow-2xl border border-border/50 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-7 py-6 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
          <h2 className="text-xl font-bold text-foreground">{task ? 'Edit Task' : 'Create New Task'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-7 overflow-y-auto max-h-[calc(90vh-160px)] space-y-5">
            {/* Title */}
            <div>
              <label className={labelClass}>
                <Tag className="h-4 w-4 text-indigo-500" />
                Task Title <span className="text-destructive">*</span>
              </label>
              <Input
                name="title" value={formData.title} onChange={handleChange}
                placeholder="Enter task title..."
                className={`bg-background/50 border-border/50 ${errors.title ? 'border-destructive focus:ring-destructive/20' : ''}`}
              />
              {errors.title && (
                <p className="flex items-center gap-1.5 mt-1.5 text-xs text-destructive"><AlertTriangle className="h-3.5 w-3.5" />{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description" value={formData.description} onChange={handleChange}
                placeholder="Add task description (optional)..."
                className="w-full px-4 py-3 text-sm bg-background/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground resize-y min-h-[100px] font-[inherit] transition-all"
              />
              <p className="text-[11px] text-muted-foreground text-right mt-1">{formData.description.length}/500</p>
              {errors.description && (
                <p className="flex items-center gap-1.5 mt-1 text-xs text-destructive"><AlertTriangle className="h-3.5 w-3.5" />{errors.description}</p>
              )}
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={selectClass}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className={selectClass}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className={labelClass}><Calendar className="h-4 w-4 text-indigo-500" /> Due Date</label>
              <Input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="bg-background/50 border-border/50" />
            </div>

            {/* Assignee */}
            <div>
              <label className={labelClass}><User className="h-4 w-4 text-indigo-500" /> Assign To</label>
              <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} disabled={usersLoading} className={selectClass}>
                <option value="">Unassigned</option>
                {users.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
              </select>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                {usersLoading ? 'Loading team members...' : 'Select a team member'}
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className={labelClass}><Tag className="h-4 w-4 text-indigo-500" /> Tags</label>
              <Input name="tags" value={formData.tags} onChange={handleChange} placeholder="design, frontend, urgent..." className="bg-background/50 border-border/50" />
              <p className="text-[11px] text-muted-foreground mt-1.5">Separate multiple tags with commas</p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-7 py-5 border-t border-border/50 flex gap-3 justify-end bg-muted/30">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
            <Button
              type="submit" disabled={isLoading}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 gap-2"
            >
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> {task ? 'Update Task' : 'Create Task'}</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
