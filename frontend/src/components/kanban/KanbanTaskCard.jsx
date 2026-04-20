import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tag, GripVertical, AlertCircle, Clock, MessageSquare, Paperclip } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const KanbanTaskCard = ({ task, isDragging, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'done';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const getPriorityClasses = () => {
    switch (task.priority) {
      case 'high': return { bar: 'bg-gradient-to-r from-rose-500 to-rose-400', badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
      case 'medium': return { bar: 'bg-gradient-to-r from-amber-500 to-amber-400', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      default: return { bar: 'bg-gradient-to-r from-blue-500 to-blue-400', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    }
  };

  const priorityClasses = getPriorityClasses();

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onClick?.(task)}
      className={`relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-200 cursor-grab hover:shadow-md ${
        isDragging || isSortableDragging ? 'shadow-xl opacity-50 z-50 scale-105 cursor-grabbing' : 'shadow-sm'
      }`}
      {...attributes}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${priorityClasses.bar}`} />
      
      <div className="p-4 pt-4">
        <div className="flex items-start gap-2 mb-2">
          <div className="mt-0.5 text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing p-1 -ml-1 rounded-md" {...listeners}>
            <GripVertical className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{task.title}</h4>
        </div>

        {task.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3 ml-7">{task.description}</p>}

        {task.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3 ml-7">
            {task.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-500">
                <Tag className="w-2.5 h-2.5" /> {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 ml-7">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${priorityClasses.badge}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-[10px] font-medium ${isOverdue ? 'text-destructive' : isDueToday ? 'text-amber-500' : 'text-muted-foreground'}`}>
                {isOverdue && <AlertCircle className="w-3 h-3" />}
                <Clock className="w-3 h-3" />
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}
            
            {(task.comments?.length > 0 || task.attachments?.length > 0) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                {task.comments?.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-medium" title={`${task.comments.length} comments`}>
                    <MessageSquare className="w-2.5 h-2.5" /> {task.comments.length}
                  </span>
                )}
                {task.attachments?.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-medium" title={`${task.attachments.length} files`}>
                    <Paperclip className="w-2.5 h-2.5" /> {task.attachments.length}
                  </span>
                )}
              </div>
            )}
          </div>

          {task.assignedTo && (
            <Avatar className="w-6 h-6 border border-border shrink-0">
              <AvatarImage src={task.assignedTo.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-[8px] text-white">
                {task.assignedTo.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanTaskCard;
