// Project: TeamSync - Real-time Task Management
// File: OnlineUsers component with inline styles

import { useState } from 'react';
import { Users, User, Circle, ChevronDown, ChevronUp, Wifi, WifiOff } from 'lucide-react';

const OnlineUsers = ({ users = [], isConnected }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const styles = {
    container: {
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 20px',
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05))',
      borderBottom: isExpanded ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
      cursor: 'pointer',
      transition: 'background 0.2s',
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
      background: isConnected 
        ? 'linear-gradient(135deg, #22c55e, #10b981)' 
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: isConnected 
        ? '0 4px 12px rgba(34, 197, 94, 0.3)'
        : '0 4px 12px rgba(239, 68, 68, 0.3)',
    },
    headerTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1a1a2e',
      margin: 0,
    },
    headerSubtitle: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '2px',
    },
    badge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    count: {
      background: isConnected 
        ? 'linear-gradient(135deg, #22c55e, #10b981)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: '#ffffff',
      fontSize: '13px',
      fontWeight: '700',
      padding: '6px 12px',
      borderRadius: '20px',
      minWidth: '24px',
      textAlign: 'center',
    },
    expandButton: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: 'none',
      background: 'rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280',
      transition: 'all 0.2s',
    },
    content: {
      padding: '16px',
      maxHeight: isExpanded ? '400px' : '0',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease, padding 0.3s ease',
    },
    userList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    userItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 14px',
      background: '#f8f9fc',
      borderRadius: '12px',
      transition: 'all 0.2s',
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      objectFit: 'cover',
      border: '2px solid #e5e7eb',
    },
    avatarPlaceholder: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '16px',
    },
    statusDot: {
      position: 'absolute',
      bottom: '-2px',
      right: '-2px',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      background: '#22c55e',
      border: '3px solid #ffffff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    userInfo: {
      flex: 1,
      minWidth: 0,
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1a1a2e',
      margin: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    userEmail: {
      fontSize: '12px',
      color: '#9ca3af',
      marginTop: '2px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    onlineTag: {
      fontSize: '11px',
      fontWeight: '600',
      color: '#22c55e',
      background: 'rgba(34, 197, 94, 0.1)',
      padding: '4px 10px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '30px 20px',
    },
    emptyIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '16px',
      background: 'rgba(107, 114, 128, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
    },
    emptyText: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0,
    },
    disconnectedBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      background: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '12px',
      marginBottom: '12px',
    },
    disconnectedText: {
      fontSize: '13px',
      color: '#dc2626',
      fontWeight: '500',
    },
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div
        style={styles.header}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.08))'}
        onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05))'}
      >
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            {isConnected ? <Wifi size={20} color="#ffffff" /> : <WifiOff size={20} color="#ffffff" />}
          </div>
          <div>
            <h3 style={styles.headerTitle}>Team Online</h3>
            <p style={styles.headerSubtitle}>
              {isConnected ? 'Real-time sync active' : 'Connection lost'}
            </p>
          </div>
        </div>
        <div style={styles.badge}>
          <span style={styles.count}>{users.length}</span>
          <button
            style={styles.expandButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
            }}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ ...styles.content, padding: isExpanded ? '16px' : '0 16px' }}>
        {!isConnected && (
          <div style={styles.disconnectedBanner}>
            <WifiOff size={18} color="#dc2626" />
            <span style={styles.disconnectedText}>
              Reconnecting to server...
            </span>
          </div>
        )}

        {users.length > 0 ? (
          <div style={styles.userList}>
            {users.map((user) => (
              <div
                key={user._id || user.id}
                style={styles.userItem}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f0f1f5';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f8f9fc';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={styles.avatarContainer}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} style={styles.avatar} />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div style={styles.statusDot} />
                </div>
                <div style={styles.userInfo}>
                  <h4 style={styles.userName}>{user.name}</h4>
                  {user.email && <p style={styles.userEmail}>{user.email}</p>}
                </div>
                <div style={styles.onlineTag}>
                  <Circle size={8} fill="#22c55e" />
                  Online
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Users size={28} color="#9ca3af" />
            </div>
            <p style={styles.emptyText}>
              {isConnected
                ? "You're the only one online"
                : 'Unable to fetch online users'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;
