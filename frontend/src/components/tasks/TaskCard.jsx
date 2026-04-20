import { useState, useEffect, useCallback } from 'react';
import {
  Edit2, Trash2, AlertCircle, MoreVertical,
  Clock, Tag, MessageSquare, Paperclip, Eye,
  Play, Square, CheckCircle2, ListChecks
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import TaskDetailModal from './TaskDetailModal';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useTaskStore } from '../../store/taskStore';

const TaskCard = ({ task, onEdit, onDelete, onTaskUpdate }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const { startTimer, stopTimer, tasks } = useTaskStore();

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));
  const isTimerRunning = !!task.activeTimerStart;

  // Subtask progress
  const subtasks = tasks.filter(t => t.parentTaskId === task._id);
  const completedSubtasks = subtasks.filter(t => t.status === 'done').length;
  const subtaskProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  // Live timer tick
  useEffect(() => {
    if (!isTimerRunning) { setElapsed(0); return; }
    const start = new Date(task.activeTimerStart).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, task.activeTimerStart]);

  const formatElapsed = useCallback((secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, []);

  const handleTimerToggle = async (e) => {
    e.stopPropagation();
    if (isTimerRunning) {
      await stopTimer(task._id);
    } else {
      await startTimer(task._id);
    }
  };

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = () => {
    onDelete(task._id);
    setShowDeleteConfirm(false);
  };

  const getPriorityClasses = () => {
    switch (task.priority) {
      case 'high':
        return { bar: 'bg-gradient-to-r from-rose-500 to-rose-400', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
      case 'medium':
        return { bar: 'bg-gradient-to-r from-amber-500 to-amber-400', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      default:
        return { bar: 'bg-gradient-to-r from-blue-500 to-blue-400', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    }
  };

  const getStatusClasses = () => {
    switch (task.status) {
      case 'in-progress': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'done': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
    }
  };

  const statusLabels = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
  const priorityClasses = getPriorityClasses();
  const statusClasses = getStatusClasses();

  return (
    <>
      <Card className={`overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${isTimerRunning ? 'ring-2 ring-emerald-500/50' : ''}`}>
        {/* Priority indicator bar */}
        <div className={`h-1.5 w-full ${priorityClasses.bar}`} />

        <CardHeader className="p-5 pb-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-2">{task.title}</h3>
            
            <div className="flex items-center gap-1">
              {/* Timer Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTimerToggle}
                className={`h-8 w-8 transition-all ${isTimerRunning ? 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 opacity-100' : 'text-muted-foreground opacity-50 group-hover:opacity-100 hover:text-emerald-500 hover:bg-emerald-500/10'}`}
                title={isTimerRunning ? 'Stop timer' : 'Start timer'}
              >
                {isTimerRunning ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                  <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer">
                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Live Timer Display */}
          {isTimerRunning && (
            <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono font-bold text-emerald-500 tabular-nums">{formatElapsed(elapsed)}</span>
              <span className="text-[10px] text-emerald-500/70 font-medium">tracking</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-5 pt-2 pb-4">
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Subtask Progress Bar */}
          {subtasks.length > 0 && (
            <div className="mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <ListChecks className="h-3.5 w-3.5" />
                  Subtasks
                </span>
                <span className={`font-bold ${subtaskProgress === 100 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {completedSubtasks}/{subtasks.length}
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${subtaskProgress === 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>
            </div>
          )}

          {task.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  <Tag className="h-2.5 w-2.5" /> {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                  +{task.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusClasses}`}>
              {statusLabels[task.status]}
            </span>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${priorityClasses.badge}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            
            {(task.comments?.length > 0 || task.attachments?.length > 0) && (
              <div className="flex items-center gap-2.5 ml-auto text-muted-foreground">
                {task.comments?.length > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-medium" title={`${task.comments.length} comments`}>
                    <MessageSquare className="h-3 w-3" /> {task.comments.length}
                  </span>
                )}
                {task.attachments?.length > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-medium" title={`${task.attachments.length} files`}>
                    <Paperclip className="h-3 w-3" /> {task.attachments.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 border-t border-border/50 bg-muted/20 flex flex-wrap items-center justify-between gap-2 mt-2">
          {task.dueDate ? (
            <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-destructive' : isDueToday ? 'text-amber-500' : 'text-muted-foreground'}`}>
              {isOverdue && <AlertCircle className="h-3.5 w-3.5" />}
              <Clock className="h-3.5 w-3.5" />
              <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
            </div>
          ) : <div />}

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowDetailModal(true)} className="h-7 px-2.5 text-xs font-medium gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border-0">
              <Eye className="h-3 w-3" /> Details
            </Button>
            
            {task.assignedTo ? (
              <div className="flex items-center gap-2" title={`Assigned to ${task.assignedTo.name}`}>
                <Avatar className="h-7 w-7 border border-border">
                  <AvatarImage src={task.assignedTo.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px]">
                    {task.assignedTo.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <span className="text-[10px] italic text-muted-foreground opacity-60">Unassigned</span>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm shadow-2xl border-border/50 animate-in zoom-in-95 duration-200">
            <CardHeader>
              <h3 className="text-lg font-bold">Delete Task?</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete "<strong>{task.title}</strong>"? This action cannot be undone.
              </p>
            </CardContent>
            <CardFooter className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="rounded-xl">Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} className="rounded-xl shadow-lg shadow-destructive/20 text-white">Delete</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Task Detail Modal with Comments & Attachments */}
      <TaskDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        task={task}
        onTaskUpdate={onTaskUpdate}
      />
    </>
  );
};

export default TaskCard;
