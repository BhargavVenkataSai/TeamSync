import { useState } from 'react';
import {
  DndContext, DragOverlay, closestCorners, KeyboardSensor,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Layout, RefreshCw, Loader2, Search } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import KanbanTaskCard from './KanbanTaskCard';
import { useTaskStore } from '../../store/taskStore';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const KanbanBoard = ({ tasks = [], onTaskUpdate, isLoading }) => {
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const { updateTask, createTask } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = !search || 
      task.title?.toLowerCase().includes(search.toLowerCase()) || 
      task.description?.toLowerCase().includes(search.toLowerCase());
    const matchesAssignee = !assigneeFilter || task.assignedTo?._id === assigneeFilter;
    return matchesSearch && matchesAssignee;
  });

  const assignees = Array.from(
    new Map(tasks.filter((t) => t.assignedTo?._id).map((t) => [t.assignedTo._id, t.assignedTo])).values()
  );

  const getTasksByStatus = (status) => filteredTasks.filter((t) => t.status === status);

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }

    const activeTask = tasks.find((t) => t._id === active.id);
    const overId = over.id;
    let newStatus = COLUMNS.some((c) => c.id === overId) ? overId : tasks.find((t) => t._id === overId)?.status;

    if (activeTask && newStatus && activeTask.status !== newStatus) {
      try {
        await updateTask(activeTask._id, { status: newStatus });
        if (onTaskUpdate) onTaskUpdate();
      } catch (error) { console.error('Failed to update task:', error); }
    }
    setActiveId(null);
  };

  const handleDragCancel = () => setActiveId(null);
  const activeTask = activeId ? tasks.find((t) => t._id === activeId) : null;

  const handleAddTask = async (status) => {
    const rawTitle = window.prompt('Task title');
    const title = rawTitle?.trim();
    if (!title) return;

    await createTask({ title, status, priority: 'medium', description: '', tags: [] });
    if (onTaskUpdate) onTaskUpdate();
  };

  return (
    <div className="space-y-6 min-h-[calc(100vh-200px)] relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Kanban Board</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Drag and drop to update task status</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="px-4 py-2 text-sm font-semibold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-full border border-indigo-500/20">
            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
          </span>
          <Button variant="outline" onClick={onTaskUpdate} disabled={isLoading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-9 bg-background/50 border-border/50"
          />
        </div>
        <select 
          value={assigneeFilter} 
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="h-10 px-3 py-2 text-sm bg-background/50 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input text-foreground w-full sm:w-[200px]"
        >
          <option value="">All Assignees</option>
          {assignees.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>
      </div>

      {/* Board */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px] overflow-x-auto lg:overflow-visible pb-4">
          {filteredTasks.length === 0 && !isLoading ? (
            <div className="col-span-1 lg:col-span-3 flex flex-col items-center justify-center py-20 bg-card rounded-2xl border-2 border-dashed border-border/50 shadow-sm">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-5">
                <Layout className="w-10 h-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No tasks found</h3>
              <p className="text-muted-foreground text-center max-w-xs">Try changing filters or create a new task in a column</p>
            </div>
          ) : (
            COLUMNS.map((col) => (
              <KanbanColumn key={col.id} title={col.title} status={col.id} tasks={getTasksByStatus(col.id)} onAddTask={handleAddTask} />
            ))
          )}
        </div>
        <DragOverlay>{activeTask ? <KanbanTaskCard task={activeTask} isDragging /> : null}</DragOverlay>
      </DndContext>

      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">Updating board...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
