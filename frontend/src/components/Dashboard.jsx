import { useState, useEffect } from 'react';
import {
  ClipboardList, LayoutGrid, LogOut, Menu, X, Wifi, WifiOff,
  BarChart3, Users, ChevronDown, Activity, User, CalendarDays, Timer
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import useSocket from '../hooks/useSocket';
import TaskList from './tasks/TaskList';
import KanbanBoard from './kanban/KanbanBoard';
import ActivityFeed from './ActivityFeed';
import { ThemeToggle } from './ThemeToggle';
import { ProductivityChart } from './charts/ProductivityChart';
import CalendarView from './views/CalendarView';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { tasks, stats, fetchStats, fetchTasks } = useTaskStore();
  const { isConnected, onlineUsers } = useSocket();

  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, [fetchStats, fetchTasks]);

  const navItems = [
    { id: 'tasks', label: 'Task List', icon: ClipboardList },
    { id: 'kanban', label: 'Kanban Board', icon: LayoutGrid },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'activity', label: 'Activity Feed', icon: Activity },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ];

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'kanban':
        return <KanbanBoard tasks={tasks} onTaskUpdate={fetchTasks} />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'activity':
        return <ActivityFeed />;
      case 'stats':
        return <StatsView stats={stats} />;
      default:
        return <TaskList />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="flex h-20 items-center justify-between px-6 lg:px-8 max-w-[1400px] mx-auto">
          {/* Left - Logo & Menu */}
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveView('tasks')}>
              <img src="/teamsync-logo.png" alt="TeamSync" className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 ml-8 bg-muted/40 p-1.5 rounded-xl border border-border/50">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeView === item.id 
                    ? 'bg-background shadow-md text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right - Status & User */}
          <div className="flex items-center gap-4">
            {/* Connection Status - Desktop only */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              isConnected ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
            }`}>
              {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              <span>{isConnected ? 'Connected' : 'Offline'}</span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Online Users */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-full border-border/50 bg-background hover:bg-accent px-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    {onlineUsers.length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl">
                <DropdownMenuLabel className="text-xs uppercase text-muted-foreground">Online Team ({onlineUsers.length})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto pr-1">
                  {onlineUsers.length > 0 ? (
                    onlineUsers.map((u) => (
                      <div key={u._id || u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                        <Avatar className="h-8 w-8 border border-border/50">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] text-white">
                            {getInitials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-none truncate">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate mt-1">{u.email}</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]" />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">No others online</div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full ml-2 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <Avatar className="h-12 w-12 border-2 border-primary/20 hover:border-primary transition-colors">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-base">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-3 rounded-2xl">
                <div className="flex items-center justify-start gap-4 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-semibold text-base">{user?.name}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive rounded-xl p-3" onClick={logout}>
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-72 max-w-[80%] bg-card h-full shadow-2xl flex flex-col border-r border-border/50">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <span className="font-semibold text-lg tracking-tight">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeView === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-border/50 space-y-2">
              <div className="flex items-center justify-between px-2 py-1 mb-2">
                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <Button variant="destructive" className="w-full justify-start rounded-xl" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
        <div className="animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Stats View Component
const StatsView = ({ stats }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse">
        Loading statistics...
      </div>
    );
  }

  const statusCards = [
    { label: 'To Do', value: stats.byStatus?.todo || 0, bg: 'bg-slate-500/10 hover:bg-slate-500/20', color: 'text-slate-500 dark:text-slate-400', border: 'border-slate-500/20', icon: '📋' },
    { label: 'In Progress', value: stats.byStatus?.['in-progress'] || 0, bg: 'bg-amber-500/10 hover:bg-amber-500/20', color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', icon: '🔄' },
    { label: 'Completed', value: stats.byStatus?.done || 0, bg: 'bg-emerald-500/10 hover:bg-emerald-500/20', color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', icon: '✅' },
    { label: 'Overdue', value: stats.overdue || 0, bg: 'bg-rose-500/10 hover:bg-rose-500/20', color: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20', icon: '⏰' },
  ];

  const priorityData = [
    { label: 'High', value: stats.byPriority?.high || 0, color: 'bg-rose-500' },
    { label: 'Medium', value: stats.byPriority?.medium || 0, color: 'bg-amber-500' },
    { label: 'Low', value: stats.byPriority?.low || 0, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Statistics Dashboard</h1>
        <p className="text-muted-foreground">Track your team's productivity and task progress in real-time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg shadow-indigo-500/20 overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <BarChart3 className="w-32 h-32" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-white/80 font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-extrabold tracking-tighter">{stats.total || 0}</div>
          </CardContent>
        </Card>

        {/* Status Grid inside a unified layout */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards.map((card) => (
            <Card key={card.label} className={`${card.bg} ${card.border} border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300`}>
              <CardContent className="p-6 flex flex-col items-center justify-center gap-3 h-full">
                <span className="text-3xl drop-shadow-sm">{card.icon}</span>
                <span className={`text-3xl font-bold ${card.color}`}>{card.value}</span>
                <span className={`text-sm font-medium ${card.color} opacity-80`}>{card.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Time Tracked Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardContent className="p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Timer className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Time Tracked</p>
            <p className="text-3xl font-extrabold tracking-tighter">{stats.totalHoursLogged || 0} <span className="text-lg font-medium text-muted-foreground">hours</span></p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Priority Breakdown */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle>Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {priorityData.map((item) => {
              const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0;
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`} />
                      <span className="text-sm font-medium">{item.label} Priority</span>
                    </div>
                    <span className="font-semibold">{item.value} <span className="text-muted-foreground text-xs font-normal">({percentage.toFixed(0)}%)</span></span>
                  </div>
                  <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                    <div 
                      className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Productivity Chart */}
        <ProductivityChart />
      </div>
    </div>
  );
};

export default Dashboard;
