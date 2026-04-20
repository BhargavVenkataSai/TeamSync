import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { CalendarDays, X, Clock, Tag, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const CalendarView = ({ tasks = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Map tasks to calendar events
  const events = useMemo(() => {
    return tasks
      .filter(t => t.dueDate)
      .map(task => ({
        id: task._id,
        title: task.title,
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        allDay: true,
        resource: task,
      }));
  }, [tasks]);

  const handleSelectSlot = useCallback(({ start }) => {
    const dateStr = format(start, 'yyyy-MM-dd');
    const dayTasks = tasks.filter(t => {
      if (!t.dueDate) return false;
      return format(new Date(t.dueDate), 'yyyy-MM-dd') === dateStr;
    });
    setSelectedDate(start);
    setSelectedTasks(dayTasks);
  }, [tasks]);

  const handleSelectEvent = useCallback((event) => {
    const task = event.resource;
    const dateStr = format(new Date(task.dueDate), 'yyyy-MM-dd');
    const dayTasks = tasks.filter(t => {
      if (!t.dueDate) return false;
      return format(new Date(t.dueDate), 'yyyy-MM-dd') === dateStr;
    });
    setSelectedDate(new Date(task.dueDate));
    setSelectedTasks(dayTasks);
  }, [tasks]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in-progress': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'done': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
    }
  };

  const statusLabels = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

  // Custom event component for the calendar
  const EventComponent = ({ event }) => {
    const task = event.resource;
    return (
      <div className="flex items-center gap-1.5 px-1.5 py-0.5 text-[11px] font-medium truncate">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getPriorityColor(task.priority)}`} />
        <span className="truncate">{event.title}</span>
      </div>
    );
  };

  // Custom styling for calendar events based on task priority
  const eventPropGetter = useCallback((event) => {
    const task = event.resource;
    const isDone = task.status === 'done';
    const isOverdue = new Date(task.dueDate) < new Date() && !isDone;

    return {
      style: {
        backgroundColor: isDone ? 'rgba(34,197,94,0.15)' : isOverdue ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)',
        color: isDone ? '#22c55e' : isOverdue ? '#ef4444' : '#6366f1',
        border: 'none',
        borderLeft: `3px solid ${isDone ? '#22c55e' : isOverdue ? '#ef4444' : '#6366f1'}`,
        borderRadius: '6px',
        fontSize: '12px',
        padding: '2px 4px',
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <CalendarDays className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
          <p className="text-sm text-muted-foreground mt-0.5">View tasks by their due dates</p>
        </div>
      </div>

      {/* Calendar Container */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="calendar-wrapper" style={{ height: 650 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              components={{ event: EventComponent }}
              eventPropGetter={eventPropGetter}
              views={['month', 'week', 'day']}
              defaultView="month"
              popup
              style={{ height: '100%' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Tasks Panel */}
      {selectedDate && (
        <Card className="border-border/50 shadow-sm animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Tasks for {format(selectedDate, 'MMMM d, yyyy')}</h3>
              <p className="text-sm text-muted-foreground">{selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} due</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { setSelectedDate(null); setSelectedTasks([]); }}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            {selectedTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">No tasks due on this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedTasks.map(task => (
                  <div key={task._id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className={`w-1.5 h-10 rounded-full shrink-0 ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${getStatusBadge(task.status)}`}>
                          {statusLabels[task.status]}
                        </span>
                        {task.assignedTo && (
                          <span className="text-[10px] text-muted-foreground">{task.assignedTo.name}</span>
                        )}
                      </div>
                    </div>
                    {new Date(task.dueDate) < new Date() && task.status !== 'done' && (
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Calendar Styles */}
      <style>{`
        .calendar-wrapper .rbc-calendar {
          font-family: inherit;
        }
        .calendar-wrapper .rbc-header {
          padding: 12px 8px;
          font-weight: 600;
          font-size: 13px;
          color: var(--muted-foreground, #6b7280);
          border-bottom: 1px solid var(--border, #e5e7eb);
          background: var(--muted, #f9fafb);
        }
        .dark .calendar-wrapper .rbc-header {
          background: oklch(0.205 0 0);
          color: oklch(0.708 0 0);
          border-bottom-color: oklch(1 0 0 / 10%);
        }
        .calendar-wrapper .rbc-month-view,
        .calendar-wrapper .rbc-time-view {
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 12px;
          overflow: hidden;
        }
        .dark .calendar-wrapper .rbc-month-view,
        .dark .calendar-wrapper .rbc-time-view {
          border-color: oklch(1 0 0 / 10%);
        }
        .calendar-wrapper .rbc-day-bg {
          transition: background 0.2s;
        }
        .calendar-wrapper .rbc-day-bg:hover {
          background: rgba(99, 102, 241, 0.04);
        }
        .calendar-wrapper .rbc-today {
          background: rgba(99, 102, 241, 0.06) !important;
        }
        .calendar-wrapper .rbc-off-range-bg {
          background: var(--muted, #f9fafb);
        }
        .dark .calendar-wrapper .rbc-off-range-bg {
          background: oklch(0.18 0 0);
        }
        .calendar-wrapper .rbc-date-cell {
          padding: 6px 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--foreground, #1a1a2e);
        }
        .dark .calendar-wrapper .rbc-date-cell {
          color: oklch(0.985 0 0);
        }
        .calendar-wrapper .rbc-off-range {
          color: var(--muted-foreground, #9ca3af);
        }
        .calendar-wrapper .rbc-toolbar {
          margin-bottom: 16px;
          gap: 8px;
          flex-wrap: wrap;
        }
        .calendar-wrapper .rbc-toolbar button {
          border: 1px solid var(--border, #e5e7eb);
          background: var(--card, #ffffff);
          color: var(--foreground, #1a1a2e);
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .dark .calendar-wrapper .rbc-toolbar button {
          border-color: oklch(1 0 0 / 10%);
          background: oklch(0.205 0 0);
          color: oklch(0.985 0 0);
        }
        .calendar-wrapper .rbc-toolbar button:hover {
          background: var(--accent, #f1f5f9);
        }
        .dark .calendar-wrapper .rbc-toolbar button:hover {
          background: oklch(0.269 0 0);
        }
        .calendar-wrapper .rbc-toolbar button.rbc-active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-color: transparent;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }
        .calendar-wrapper .rbc-toolbar-label {
          font-size: 18px;
          font-weight: 700;
          color: var(--foreground, #1a1a2e);
        }
        .dark .calendar-wrapper .rbc-toolbar-label {
          color: oklch(0.985 0 0);
        }
        .calendar-wrapper .rbc-month-row + .rbc-month-row {
          border-top: 1px solid var(--border, #e5e7eb);
        }
        .dark .calendar-wrapper .rbc-month-row + .rbc-month-row {
          border-top-color: oklch(1 0 0 / 10%);
        }
        .calendar-wrapper .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid var(--border, #e5e7eb);
        }
        .dark .calendar-wrapper .rbc-day-bg + .rbc-day-bg {
          border-left-color: oklch(1 0 0 / 10%);
        }
        .calendar-wrapper .rbc-event {
          cursor: pointer;
        }
        .calendar-wrapper .rbc-event:focus {
          outline: 2px solid #6366f1;
          outline-offset: 1px;
        }
        .calendar-wrapper .rbc-show-more {
          color: #6366f1;
          font-weight: 600;
          font-size: 11px;
          padding: 2px 6px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default CalendarView;
