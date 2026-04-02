// Project: TeamSync - Real-time Task Management
// File: TaskFilters component with inline styles

import { useState } from 'react';
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

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

  const styles = {
    container: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      marginBottom: '24px',
    },
    topRow: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    searchContainer: {
      flex: 1,
      minWidth: '240px',
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px 12px 44px',
      fontSize: '14px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s',
      background: '#fafafa',
      boxSizing: 'border-box',
    },
    filterButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 18px',
      fontSize: '14px',
      fontWeight: '600',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      background: showFilters ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#ffffff',
      color: showFilters ? '#ffffff' : '#4b5563',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    clearButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 16px',
      fontSize: '13px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '10px',
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#dc2626',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    badge: {
      background: '#ffffff',
      color: '#6366f1',
      fontSize: '11px',
      fontWeight: '700',
      padding: '2px 7px',
      borderRadius: '10px',
      marginLeft: '4px',
    },
    filtersPanel: {
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    filterLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    selectWrapper: {
      position: 'relative',
    },
    select: {
      width: '100%',
      padding: '12px 40px 12px 14px',
      fontSize: '14px',
      fontWeight: '500',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.2s',
      background: '#fafafa',
      cursor: 'pointer',
      appearance: 'none',
      color: '#374151',
      boxSizing: 'border-box',
    },
    selectIcon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      pointerEvents: 'none',
    },
    quickFilters: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    },
    quickFilterButton: {
      padding: '8px 14px',
      fontSize: '13px',
      fontWeight: '500',
      border: '1px solid #e5e7eb',
      borderRadius: '20px',
      background: '#ffffff',
      color: '#6b7280',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    quickFilterActive: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
      borderColor: '#6366f1',
      color: '#6366f1',
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '8px',
    },
  };

  const statusColors = {
    todo: '#6b7280',
    'in-progress': '#f59e0b',
    done: '#22c55e',
  };

  const priorityColors = {
    low: '#3b82f6',
    medium: '#f59e0b',
    high: '#ef4444',
  };

  const activeFilterCount = [
    localFilters.status,
    localFilters.priority,
    localFilters.search,
  ].filter(Boolean).length;

  return (
    <div style={styles.container}>
      {/* Top Row - Search and Filter Toggle */}
      <div style={styles.topRow}>
        <div style={styles.searchContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={localFilters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.background = '#ffffff';
              e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.background = '#fafafa';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
          onMouseOver={(e) => {
            if (!showFilters) {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseOut={(e) => {
            if (!showFilters) {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          <SlidersHorizontal size={18} />
          Filters
          {activeFilterCount > 0 && (
            <span style={styles.badge}>{activeFilterCount}</span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={styles.clearButton}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={styles.filtersPanel}>
          {/* Status Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status</label>
            <div style={styles.selectWrapper}>
              <select
                value={localFilters.status || ''}
                onChange={(e) => handleChange('status', e.target.value)}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#fafafa';
                }}
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <ChevronDown size={16} style={styles.selectIcon} />
            </div>
          </div>

          {/* Priority Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Priority</label>
            <div style={styles.selectWrapper}>
              <select
                value={localFilters.priority || ''}
                onChange={(e) => handleChange('priority', e.target.value)}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#fafafa';
                }}
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <ChevronDown size={16} style={styles.selectIcon} />
            </div>
          </div>

          {/* Sort By */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Sort By</label>
            <div style={styles.selectWrapper}>
              <select
                value={localFilters.sortBy || 'createdAt'}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#fafafa';
                }}
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
              <ChevronDown size={16} style={styles.selectIcon} />
            </div>
          </div>

          {/* Sort Order */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Order</label>
            <div style={styles.selectWrapper}>
              <select
                value={localFilters.sortOrder || 'desc'}
                onChange={(e) => handleChange('sortOrder', e.target.value)}
                style={styles.select}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#fafafa';
                }}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
              <ChevronDown size={16} style={styles.selectIcon} />
            </div>
          </div>
        </div>
      )}

      {/* Quick Filters */}
      {showFilters && (
        <div style={styles.quickFilters}>
          <span style={{ fontSize: '13px', color: '#9ca3af', marginRight: '8px', alignSelf: 'center' }}>
            Quick:
          </span>
          <button
            onClick={() => handleChange('status', localFilters.status === 'todo' ? '' : 'todo')}
            style={{
              ...styles.quickFilterButton,
              ...(localFilters.status === 'todo' ? styles.quickFilterActive : {}),
            }}
            onMouseOver={(e) => {
              if (localFilters.status !== 'todo') {
                e.currentTarget.style.background = '#f9fafb';
              }
            }}
            onMouseOut={(e) => {
              if (localFilters.status !== 'todo') {
                e.currentTarget.style.background = '#ffffff';
              }
            }}
          >
            <span style={{ ...styles.statusDot, background: statusColors.todo }} />
            To Do
          </button>
          <button
            onClick={() => handleChange('status', localFilters.status === 'in-progress' ? '' : 'in-progress')}
            style={{
              ...styles.quickFilterButton,
              ...(localFilters.status === 'in-progress' ? styles.quickFilterActive : {}),
            }}
            onMouseOver={(e) => {
              if (localFilters.status !== 'in-progress') {
                e.currentTarget.style.background = '#f9fafb';
              }
            }}
            onMouseOut={(e) => {
              if (localFilters.status !== 'in-progress') {
                e.currentTarget.style.background = '#ffffff';
              }
            }}
          >
            <span style={{ ...styles.statusDot, background: statusColors['in-progress'] }} />
            In Progress
          </button>
          <button
            onClick={() => handleChange('priority', localFilters.priority === 'high' ? '' : 'high')}
            style={{
              ...styles.quickFilterButton,
              ...(localFilters.priority === 'high' ? styles.quickFilterActive : {}),
            }}
            onMouseOver={(e) => {
              if (localFilters.priority !== 'high') {
                e.currentTarget.style.background = '#f9fafb';
              }
            }}
            onMouseOut={(e) => {
              if (localFilters.priority !== 'high') {
                e.currentTarget.style.background = '#ffffff';
              }
            }}
          >
            <span style={{ ...styles.statusDot, background: priorityColors.high }} />
            High Priority
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
