// Project: TeamSync - Real-time Task Management
// File: Activity Feed component

import { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  MessageSquare, 
  Paperclip,
  UserPlus,
  UserMinus,
  ArrowRight,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { activitiesAPI } from '../utils/api';
import { useThemeStore, getThemeColors } from '../store/themeStore';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useThemeStore();
  const colors = getThemeColors(theme);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activitiesAPI.getAll({ limit: 50 });
      setActivities(response.data.data.activities);
      setError(null);
    } catch (err) {
      setError('Failed to load activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const iconProps = { size: 16 };
    switch (action) {
      case 'task_created':
        return <CheckCircle2 {...iconProps} color="#22c55e" />;
      case 'task_updated':
        return <Edit3 {...iconProps} color="#6366f1" />;
      case 'task_deleted':
        return <Trash2 {...iconProps} color="#ef4444" />;
      case 'task_status_changed':
        return <ArrowRight {...iconProps} color="#f59e0b" />;
      case 'task_assigned':
        return <UserPlus {...iconProps} color="#3b82f6" />;
      case 'task_unassigned':
        return <UserMinus {...iconProps} color="#94a3b8" />;
      case 'comment_added':
        return <MessageSquare {...iconProps} color="#8b5cf6" />;
      case 'comment_deleted':
        return <MessageSquare {...iconProps} color="#94a3b8" />;
      case 'file_uploaded':
        return <Paperclip {...iconProps} color="#10b981" />;
      case 'file_deleted':
        return <Paperclip {...iconProps} color="#94a3b8" />;
      default:
        return <Activity {...iconProps} color="#6b7280" />;
    }
  };

  const getActionText = (activity) => {
    const userName = activity.user?.name || 'Someone';
    const taskTitle = activity.entityTitle || 'a task';

    switch (activity.action) {
      case 'task_created':
        return <><strong>{userName}</strong> created task <strong>"{taskTitle}"</strong></>;
      case 'task_updated':
        return <><strong>{userName}</strong> updated task <strong>"{taskTitle}"</strong></>;
      case 'task_deleted':
        return <><strong>{userName}</strong> deleted task <strong>"{taskTitle}"</strong></>;
      case 'task_status_changed':
        return (
          <>
            <strong>{userName}</strong> changed status of <strong>"{taskTitle}"</strong> from{' '}
            <span style={styles.statusBadge(activity.oldValue)}>{formatStatus(activity.oldValue)}</span>
            {' → '}
            <span style={styles.statusBadge(activity.newValue)}>{formatStatus(activity.newValue)}</span>
          </>
        );
      case 'task_assigned':
        return <><strong>{userName}</strong> assigned someone to <strong>"{taskTitle}"</strong></>;
      case 'task_unassigned':
        return <><strong>{userName}</strong> unassigned task <strong>"{taskTitle}"</strong></>;
      case 'comment_added':
        return <><strong>{userName}</strong> commented on <strong>"{taskTitle}"</strong></>;
      case 'comment_deleted':
        return <><strong>{userName}</strong> deleted a comment from <strong>"{taskTitle}"</strong></>;
      case 'file_uploaded':
        return <><strong>{userName}</strong> uploaded a file to <strong>"{taskTitle}"</strong></>;
      case 'file_deleted':
        return <><strong>{userName}</strong> removed a file from <strong>"{taskTitle}"</strong></>;
      default:
        return <><strong>{userName}</strong> performed an action on <strong>"{taskTitle}"</strong></>;
    }
  };

  const formatStatus = (status) => {
    const statusLabels = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done',
    };
    return statusLabels[status] || status;
  };

  const styles = {
    container: {
      background: colors.cardBg,
      borderRadius: '20px',
      boxShadow: colors.cardShadow,
      border: colors.cardBorder,
      overflow: 'hidden',
    },
    header: {
      padding: '20px 24px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    headerIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: colors.textPrimary,
      margin: 0,
    },
    subtitle: {
      fontSize: '13px',
      color: colors.textSecondary,
      margin: 0,
    },
    refreshButton: {
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
    content: {
      maxHeight: '500px',
      overflowY: 'auto',
    },
    activityItem: {
      display: 'flex',
      gap: '14px',
      padding: '16px 24px',
      borderBottom: `1px solid ${colors.borderLight}`,
      transition: 'background 0.2s',
    },
    iconWrapper: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      background: colors.bgTertiary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    activityContent: {
      flex: 1,
      minWidth: 0,
    },
    activityText: {
      fontSize: '14px',
      color: colors.textPrimary,
      lineHeight: '1.5',
      margin: 0,
    },
    activityTime: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: colors.textMuted,
      marginTop: '4px',
    },
    statusBadge: (status) => ({
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      background: status === 'done' 
        ? 'rgba(34, 197, 94, 0.15)' 
        : status === 'in-progress'
          ? 'rgba(245, 158, 11, 0.15)'
          : 'rgba(107, 114, 128, 0.15)',
      color: status === 'done' 
        ? '#16a34a' 
        : status === 'in-progress'
          ? '#d97706'
          : '#4b5563',
    }),
    empty: {
      padding: '48px 24px',
      textAlign: 'center',
      color: colors.textSecondary,
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '16px',
      background: colors.bgTertiary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
    },
    loading: {
      padding: '48px 24px',
      textAlign: 'center',
      color: colors.textSecondary,
    },
    error: {
      padding: '24px',
      textAlign: 'center',
      color: '#ef4444',
      background: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '12px',
      margin: '24px',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>
              <Activity size={20} color="#fff" />
            </div>
            <div>
              <h3 style={styles.title}>Activity Feed</h3>
              <p style={styles.subtitle}>Loading...</p>
            </div>
          </div>
        </div>
        <div style={styles.loading}>
          <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <Activity size={20} color="#fff" />
          </div>
          <div>
            <h3 style={styles.title}>Activity Feed</h3>
            <p style={styles.subtitle}>{activities.length} recent activities</p>
          </div>
        </div>
        <button 
          onClick={fetchActivities}
          style={styles.refreshButton}
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.content}>
        {activities.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              <Activity size={28} color={colors.textMuted} />
            </div>
            <h4 style={{ margin: '0 0 8px', color: colors.textPrimary }}>No activities yet</h4>
            <p style={{ margin: 0 }}>Start creating and updating tasks to see activity here</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div 
              key={activity._id} 
              style={styles.activityItem}
            >
              <div style={styles.iconWrapper}>
                {getActionIcon(activity.action)}
              </div>
              <div style={styles.activityContent}>
                <p style={styles.activityText}>
                  {getActionText(activity)}
                </p>
                <div style={styles.activityTime}>
                  <Clock size={12} />
                  <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
