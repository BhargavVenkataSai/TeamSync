// Project: TeamSync - Real-time Task Management
// File: Dashboard component with clean, spacious layout

import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  LayoutGrid,
  LogOut,
  Menu,
  X,
  Wifi,
  WifiOff,
  BarChart3,
  Users,
  ChevronDown,
  Moon,
  Sun,
  Activity,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore, getThemeColors } from '../store/themeStore';
import useSocket from '../hooks/useSocket';
import TaskList from './tasks/TaskList';
import KanbanBoard from './kanban/KanbanBoard';
import ActivityFeed from './ActivityFeed';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const { user, logout } = useAuthStore();
  const { tasks, stats, fetchStats, fetchTasks } = useTaskStore();
  const { isConnected, onlineUsers } = useSocket();
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const colors = getThemeColors(theme);

  useEffect(() => {
    initTheme();
    fetchStats();
    fetchTasks();
  }, [fetchStats, fetchTasks, initTheme]);

  const navItems = [
    { id: 'tasks', label: 'Task List', icon: ClipboardList },
    { id: 'kanban', label: 'Kanban Board', icon: LayoutGrid },
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
      case 'activity':
        return <ActivityFeed />;
      case 'stats':
        return <StatsView stats={stats} colors={colors} />;
      default:
        return <TaskList />;
    }
  };

  const styles = getStyles(colors);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          {/* Left - Logo & Menu */}
          <div style={styles.headerLeft}>
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              style={styles.menuButton}
            >
              <Menu size={22} />
            </button>
            
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <LayoutDashboard size={20} color="#fff" />
              </div>
              <span style={styles.logoText}>TeamSync</span>
            </div>

            {/* Desktop Navigation */}
            <nav style={styles.desktopNav}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  style={{
                    ...styles.navItem,
                    ...(activeView === item.id ? styles.navItemActive : {}),
                  }}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Right - Status & User */}
          <div style={styles.headerRight}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={styles.themeToggle}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Connection Status */}
            <div style={{
              ...styles.connectionBadge,
              background: isConnected ? colors.successBg : colors.errorBg,
              color: isConnected ? '#16a34a' : '#dc2626',
            }}>
              {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
              <span style={styles.connectionText}>
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>

            {/* Online Users Dropdown */}
            <div style={styles.onlineUsersWrapper}>
              <button 
                onClick={() => setShowOnlineUsers(!showOnlineUsers)}
                style={styles.onlineUsersButton}
              >
                <Users size={18} />
                <span style={styles.onlineCount}>{onlineUsers.length}</span>
                <ChevronDown size={16} style={{
                  transform: showOnlineUsers ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }} />
              </button>

              {/* Dropdown */}
              {showOnlineUsers && (
                <>
                  <div 
                    style={styles.dropdownOverlay} 
                    onClick={() => setShowOnlineUsers(false)} 
                  />
                  <div style={styles.onlineUsersDropdown}>
                    <div style={styles.dropdownHeader}>
                      <span style={styles.dropdownTitle}>Online Team Members</span>
                      <span style={styles.dropdownCount}>{onlineUsers.length} online</span>
                    </div>
                    <div style={styles.dropdownList}>
                      {onlineUsers.length > 0 ? (
                        onlineUsers.map((u) => (
                          <div key={u._id || u.id} style={styles.dropdownItem}>
                            <div style={styles.dropdownAvatar}>
                              {getInitials(u.name)}
                            </div>
                            <div style={styles.dropdownUserInfo}>
                              <span style={styles.dropdownUserName}>{u.name}</span>
                              <span style={styles.dropdownUserEmail}>{u.email}</span>
                            </div>
                            <div style={styles.onlineDot} />
                          </div>
                        ))
                      ) : (
                        <div style={styles.dropdownEmpty}>
                          No other users online
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div style={styles.userMenu}>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user?.name}</span>
                <span style={styles.userEmail}>{user?.email}</span>
              </div>
              <div style={styles.userAvatar}>
                {getInitials(user?.name)}
              </div>
              <button onClick={logout} style={styles.logoutBtn} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div style={styles.sidebarOverlay} onClick={() => setIsSidebarOpen(false)}>
          <div style={styles.sidebar} onClick={(e) => e.stopPropagation()}>
            <div style={styles.sidebarHeader}>
              <span style={styles.sidebarTitle}>Menu</span>
              <button onClick={() => setIsSidebarOpen(false)} style={styles.sidebarClose}>
                <X size={20} />
              </button>
            </div>
            <nav style={styles.sidebarNav}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }}
                  style={{
                    ...styles.sidebarItem,
                    ...(activeView === item.id ? styles.sidebarItemActive : {}),
                  }}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div style={styles.sidebarFooter}>
              <button onClick={toggleTheme} style={styles.sidebarThemeToggle}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
              <button onClick={logout} style={styles.sidebarLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.mainContent}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Stats View Component
const StatsView = ({ stats, colors }) => {
  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.textSecondary }}>
        Loading statistics...
      </div>
    );
  }

  const statusCards = [
    { label: 'To Do', value: stats.byStatus?.todo || 0, bg: colors.bgTertiary, color: colors.textPrimary, icon: '📋' },
    { label: 'In Progress', value: stats.byStatus?.['in-progress'] || 0, bg: colors.warningBg, color: '#d97706', icon: '🔄' },
    { label: 'Completed', value: stats.byStatus?.done || 0, bg: colors.successBg, color: '#15803d', icon: '✅' },
    { label: 'Overdue', value: stats.overdue || 0, bg: colors.errorBg, color: '#dc2626', icon: '⏰' },
  ];

  const priorityData = [
    { label: 'High', value: stats.byPriority?.high || 0, color: '#ef4444' },
    { label: 'Medium', value: stats.byPriority?.medium || 0, color: '#f59e0b' },
    { label: 'Low', value: stats.byPriority?.low || 0, color: '#3b82f6' },
  ];

  const statsStyles = {
    totalCard: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      borderRadius: '20px',
      padding: '40px',
      marginBottom: '24px',
      boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)',
    },
    totalInner: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#fff',
    },
    totalNumber: {
      fontSize: '56px',
      fontWeight: '800',
      lineHeight: 1,
    },
    totalLabel: {
      fontSize: '16px',
      marginTop: '8px',
      opacity: 0.9,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    card: {
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    },
    cardIcon: {
      fontSize: '32px',
    },
    cardValue: {
      fontSize: '32px',
      fontWeight: '700',
    },
    cardLabel: {
      fontSize: '14px',
      fontWeight: '500',
    },
    priorityCard: {
      background: colors.cardBg,
      borderRadius: '20px',
      padding: '28px',
      boxShadow: colors.cardShadow,
      border: colors.cardBorder,
    },
    priorityTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: '24px',
    },
    priorityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    priorityHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
    },
    priorityLabelGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    priorityDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
    },
    priorityLabel: {
      fontSize: '14px',
      color: colors.textSecondary,
    },
    priorityValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: colors.textPrimary,
    },
    progressBar: {
      height: '8px',
      background: colors.bgTertiary,
      borderRadius: '4px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.5s ease',
    },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: colors.textPrimary, margin: 0 }}>
          Statistics
        </h1>
        <p style={{ color: colors.textSecondary, marginTop: '8px', fontSize: '15px' }}>
          Track your team's productivity and task progress
        </p>
      </div>

      {/* Total Tasks */}
      <div style={statsStyles.totalCard}>
        <div style={statsStyles.totalInner}>
          <span style={statsStyles.totalNumber}>{stats.total || 0}</span>
          <span style={statsStyles.totalLabel}>Total Tasks</span>
        </div>
      </div>

      {/* Status Grid */}
      <div style={statsStyles.grid}>
        {statusCards.map((card) => (
          <div 
            key={card.label} 
            style={{ ...statsStyles.card, background: card.bg }}
          >
            <span style={statsStyles.cardIcon}>{card.icon}</span>
            <span style={{ ...statsStyles.cardValue, color: card.color }}>{card.value}</span>
            <span style={{ ...statsStyles.cardLabel, color: card.color }}>{card.label}</span>
          </div>
        ))}
      </div>

      {/* Priority Breakdown */}
      <div style={statsStyles.priorityCard}>
        <h3 style={statsStyles.priorityTitle}>Priority Breakdown</h3>
        <div style={statsStyles.priorityList}>
          {priorityData.map((item) => (
            <div key={item.label}>
              <div style={statsStyles.priorityHeader}>
                <div style={statsStyles.priorityLabelGroup}>
                  <span style={{ ...statsStyles.priorityDot, background: item.color }} />
                  <span style={statsStyles.priorityLabel}>{item.label} Priority</span>
                </div>
                <span style={statsStyles.priorityValue}>{item.value}</span>
              </div>
              <div style={statsStyles.progressBar}>
                <div style={{
                  ...statsStyles.progressFill,
                  background: item.color,
                  width: `${stats.total > 0 ? (item.value / stats.total) * 100 : 0}%`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Generate styles based on theme colors
const getStyles = (colors) => ({
  container: {
    minHeight: '100vh',
    background: colors.bgPrimary,
  },
  header: {
    background: colors.bgSecondary,
    borderBottom: `1px solid ${colors.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 40,
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  menuButton: {
    display: 'none',
    padding: '10px',
    background: 'none',
    border: 'none',
    color: colors.textSecondary,
    borderRadius: '10px',
    cursor: 'pointer',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginLeft: '24px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: 'none',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    color: colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  navItemActive: {
    background: colors.primaryLight,
    color: '#6366f1',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  themeToggle: {
    padding: '10px',
    background: colors.bgTertiary,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    color: colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  connectionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  connectionText: {
    display: 'inline',
  },
  onlineUsersWrapper: {
    position: 'relative',
  },
  onlineUsersButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    background: colors.bgTertiary,
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    color: colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  onlineCount: {
    background: '#22c55e',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  dropdownOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 45,
  },
  onlineUsersDropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '300px',
    background: colors.cardBg,
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    border: `1px solid ${colors.border}`,
    zIndex: 50,
    overflow: 'hidden',
  },
  dropdownHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${colors.borderLight}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  dropdownCount: {
    fontSize: '12px',
    color: '#22c55e',
    fontWeight: '500',
  },
  dropdownList: {
    maxHeight: '280px',
    overflowY: 'auto',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    borderBottom: `1px solid ${colors.borderLight}`,
  },
  dropdownAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
  },
  dropdownUserInfo: {
    flex: 1,
    minWidth: 0,
  },
  dropdownUserName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: colors.textPrimary,
  },
  dropdownUserEmail: {
    display: 'block',
    fontSize: '12px',
    color: colors.textMuted,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  onlineDot: {
    width: '10px',
    height: '10px',
    background: '#22c55e',
    borderRadius: '50%',
    boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.2)',
  },
  dropdownEmpty: {
    padding: '24px',
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: '14px',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingLeft: '16px',
    borderLeft: `1px solid ${colors.border}`,
  },
  userInfo: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: '12px',
    color: colors.textMuted,
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
  },
  logoutBtn: {
    padding: '10px',
    background: 'none',
    border: 'none',
    color: colors.textMuted,
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  sidebarOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 50,
    display: 'flex',
  },
  sidebar: {
    width: '280px',
    background: colors.bgSecondary,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    borderBottom: `1px solid ${colors.borderLight}`,
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sidebarClose: {
    padding: '8px',
    background: colors.bgTertiary,
    border: 'none',
    borderRadius: '8px',
    color: colors.textSecondary,
    cursor: 'pointer',
  },
  sidebarNav: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: 'none',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '500',
    color: colors.textSecondary,
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  sidebarItemActive: {
    background: colors.primaryLight,
    color: '#6366f1',
  },
  sidebarFooter: {
    padding: '16px',
    borderTop: `1px solid ${colors.borderLight}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sidebarThemeToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: colors.bgTertiary,
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '500',
    color: colors.textSecondary,
    cursor: 'pointer',
    width: '100%',
  },
  sidebarLogout: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: colors.errorBg,
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#dc2626',
    cursor: 'pointer',
    width: '100%',
  },
  main: {
    minHeight: 'calc(100vh - 70px)',
  },
  mainContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px',
  },
});

// Add responsive styles via media query
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @media (max-width: 1024px) {
    .dashboard-menu-btn { display: flex !important; }
    .dashboard-desktop-nav { display: none !important; }
    .dashboard-connection-text { display: none !important; }
    .dashboard-user-info { display: none !important; }
  }
  @media (max-width: 640px) {
    .dashboard-user-menu { padding-left: 12px !important; }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(styleSheet);
}

export default Dashboard;
