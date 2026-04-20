import { useState } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const defaultFilters = {
  search: '',
  status: '',
  priority: '',
};

const TaskFilters = ({ filters = defaultFilters, onFilterChange = () => {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({ ...defaultFilters, ...filters });

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = 
    localFilters.search || 
    localFilters.status || 
    localFilters.priority;

  const statusColors = {
    todo: 'bg-slate-500',
    'in-progress': 'bg-amber-500',
    done: 'bg-emerald-500',
  };

  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-amber-500',
    high: 'bg-rose-500',
  };

  const activeFilterCount = [
    localFilters.status,
    localFilters.priority,
    localFilters.search,
  ].filter(Boolean).length;

  return (
    <div className="bg-card rounded-2xl p-4 md:p-5 shadow-sm border border-border/50 mb-6 transition-all duration-300">
      {/* Top Row - Search and Filter Toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search tasks by title or description..."
            value={localFilters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/20 h-11"
          />
        </div>

        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className={`h-11 px-4 gap-2 border-border/50 ${showFilters ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0' : 'bg-background hover:bg-muted'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-background text-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-11 px-4 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-5 pt-5 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
            <div className="relative">
              <select
                value={localFilters.status || ''}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm bg-background/50 border border-border/50 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Priority Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Priority</label>
            <div className="relative">
              <select
                value={localFilters.priority || ''}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm bg-background/50 border border-border/50 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Sort By</label>
            <div className="relative">
              <select
                value={localFilters.sortBy || 'createdAt'}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm bg-background/50 border border-border/50 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Sort Order */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Order</label>
            <div className="relative">
              <select
                value={localFilters.sortOrder || 'desc'}
                onChange={(e) => handleChange('sortOrder', e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm bg-background/50 border border-border/50 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Quick Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50 animate-in slide-in-from-top-1 duration-300">
          <span className="text-xs text-muted-foreground mr-1 font-medium">Quick:</span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChange('status', localFilters.status === 'todo' ? '' : 'todo')}
            className={`h-8 rounded-full text-xs gap-1.5 border-border/50 ${localFilters.status === 'todo' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-200 dark:border-indigo-800' : 'bg-background'}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusColors.todo}`} />
            To Do
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChange('status', localFilters.status === 'in-progress' ? '' : 'in-progress')}
            className={`h-8 rounded-full text-xs gap-1.5 border-border/50 ${localFilters.status === 'in-progress' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-200 dark:border-indigo-800' : 'bg-background'}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusColors['in-progress']}`} />
            In Progress
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleChange('priority', localFilters.priority === 'high' ? '' : 'high')}
            className={`h-8 rounded-full text-xs gap-1.5 border-border/50 ${localFilters.priority === 'high' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-200 dark:border-indigo-800' : 'bg-background'}`}
          >
            <span className={`w-2 h-2 rounded-full ${priorityColors.high}`} />
            High Priority
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
