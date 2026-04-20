import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Circle, Plus } from 'lucide-react';
import KanbanTaskCard from './KanbanTaskCard';
import { Button } from '../ui/button';

const columnMeta = {
  todo: { title: 'To Do', colorClass: 'text-slate-500', bgClass: 'bg-slate-500', bgLightClass: 'bg-slate-500/10' },
  'in-progress': { title: 'In Progress', colorClass: 'text-amber-500', bgClass: 'bg-amber-500', bgLightClass: 'bg-amber-500/10' },
  done: { title: 'Done', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500', bgLightClass: 'bg-emerald-500/10' },
};

const KanbanColumn = ({ title, status, tasks, onAddTask }) => {
  const column = columnMeta[status] || columnMeta.todo;
  const displayTitle = title || column.title;

  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col min-h-[500px] rounded-2xl p-4 transition-all duration-300 ${
        isOver ? 'bg-indigo-500/5 border-2 border-dashed border-indigo-500' : 'bg-muted/30 border-2 border-transparent'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-5 p-4 bg-card rounded-xl shadow-sm border border-border/50">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${column.bgClass} shadow-sm`} />
          <h3 className="text-base font-bold text-foreground">{displayTitle}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${column.bgLightClass} ${column.colorClass}`}>
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
          {tasks.length > 0 ? (
            tasks.map((task) => <KanbanTaskCard key={task._id} task={task} />)
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-card rounded-xl border-2 border-dashed border-border/50 text-center">
              <div className={`w-14 h-14 rounded-full ${column.bgLightClass} flex items-center justify-center mb-4`}>
                <Circle className={`w-6 h-6 ${column.colorClass}`} />
              </div>
              <p className="text-sm text-muted-foreground mb-4">No tasks in {displayTitle.toLowerCase()}</p>
              {isOver && (
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-lg text-sm font-medium">
                  <Plus className="w-4 h-4" /> Drop task here
                </div>
              )}
            </div>
          )}
        </div>
      </SortableContext>

      {onAddTask && (
        <Button 
          variant="outline" 
          onClick={() => onAddTask(status)}
          className={`w-full mt-4 border-dashed border-2 ${column.colorClass} hover:${column.bgLightClass} hover:${column.colorClass} bg-card`}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Task
        </Button>
      )}
    </div>
  );
};

export default KanbanColumn;
