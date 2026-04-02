// Project: TeamSync - Real-time Task Management
// Tech: MERN Stack (MongoDB, Express, React, Node.js)
// Pattern: RESTful API, JWT Auth, Socket.io, Zustand
// Style: ES6+, async/await, functional React with hooks
// File: Compact online users presence strip with overflow indicator

const OnlineUsers = ({ users = [], isConnected = false }) => {
  const maxVisible = 5;
  const visibleUsers = users.slice(0, maxVisible);
  const extraCount = Math.max(users.length - maxVisible, 0);

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    background: '#ffffff',
  };

  const stackStyle = {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '8px',
  };

  const avatarStyle = {
    width: '34px',
    height: '34px',
    borderRadius: '999px',
    border: '2px solid #ffffff',
    marginLeft: '-8px',
    objectFit: 'cover',
    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
  };

  const fallbackStyle = {
    ...avatarStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '12px',
  };

  const statusDot = {
    width: '10px',
    height: '10px',
    borderRadius: '999px',
    background: isConnected ? '#22c55e' : '#9ca3af',
    boxShadow: isConnected ? '0 0 0 3px rgba(34,197,94,0.18)' : 'none',
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || '?';

  return (
    <div style={containerStyle}>
      <div style={statusDot} />
      <div style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>
        {isConnected ? `${users.length} online` : 'Offline'}
      </div>
      <div style={stackStyle}>
        {visibleUsers.map((user) =>
          user.avatar ? (
            <img
              key={user._id}
              src={user.avatar}
              alt={user.name}
              title={user.name}
              style={avatarStyle}
            />
          ) : (
            <div key={user._id} title={user.name} style={fallbackStyle}>
              {getInitials(user.name)}
            </div>
          )
        )}
        {extraCount > 0 && (
          <div
            style={{
              ...fallbackStyle,
              background: '#111827',
              marginLeft: '-8px',
            }}
            title={`${extraCount} more users online`}
          >
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;
