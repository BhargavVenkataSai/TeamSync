import { useEffect, useState } from 'react';
import { Plus, ClipboardList, Loader2 } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import { Button } from '../ui/button';

const TaskList = () => {
  const {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    fetchTasks,
    deleteTask,
    createTask,
    updateTask,
  } = useTaskStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
      } else {
        await createTask(formData);
      }
      handleCloseForm();
    } catch (err) {
      console.error('Failed to save task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track your team's tasks</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/20 w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFilterChange={setFilters} />

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && tasks.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && tasks.length === 0 && (
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <ClipboardList className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">No tasks yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Get started by creating your first task. Click the button below to add a new task.
          </p>
          <Button onClick={handleOpenCreate} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700">
            <Plus className="mr-2 h-5 w-5" />
            Create First Task
          </Button>
        </div>
      )}

      {/* Task Grid */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Loading overlay when refetching */}
      {loading && tasks.length > 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        task={editingTask}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

// Loading skeleton component
const TaskSkeleton = () => (
  <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm animate-pulse">
    <div className="h-1 bg-muted rounded-full w-full mb-4" />
    <div className="h-4 bg-muted rounded w-3/4 mb-3" />
    <div className="h-3 bg-muted rounded w-full mb-2" />
    <div className="h-3 bg-muted rounded w-2/3 mb-4" />
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 bg-muted rounded-full" />
      <div className="h-6 w-16 bg-muted rounded-full" />
    </div>
    <div className="flex justify-between items-center pt-3 border-t border-border/50">
      <div className="h-4 w-20 bg-muted rounded" />
      <div className="h-7 w-7 bg-muted rounded-full" />
    </div>
  </div>
);

export default TaskList;
