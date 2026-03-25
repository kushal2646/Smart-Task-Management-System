import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { getTasks, addTask, deleteTask, getStats, updateTaskStatus } from '../services/api';
import {
    HiOutlineClipboardList, HiOutlineClock, HiOutlineCheckCircle,
    HiOutlineExclamationCircle, HiOutlineRefresh, HiOutlineSearch,
    HiOutlinePlus, HiOutlineX, HiOutlineTrendingUp, HiOutlineCalendar
} from 'react-icons/hi';
import './Dashboard.css';

const Dashboard = ({ currentUser, activeView }) => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('All');

    const isManagerOrAdmin = currentUser?.role === 'ROLE_MANAGER' || currentUser?.role === 'ROLE_ADMIN';

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tasksData, statsData] = await Promise.all([
                getTasks(),
                getStats()
            ]);
            setTasks(tasksData);
            setStats(statsData);
            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try refreshing.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            await addTask(taskData);
            setShowForm(false);
            loadData();
        } catch (err) {
            console.error('Error adding task:', err);
            alert('Failed to add task.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await deleteTask(taskId);
            loadData();
        } catch (err) {
            console.error('Error deleting task:', err);
            alert('Failed to delete task.');
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);
            loadData();
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status.');
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = !searchQuery ||
            task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.assigneeUsername?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const groupedTasks = {
        'Pending': filteredTasks.filter(t => t.status === 'Pending'),
        'In Progress': filteredTasks.filter(t => t.status === 'In Progress'),
        'Completed': filteredTasks.filter(t => t.status === 'Completed'),
        'Overdue': filteredTasks.filter(t => t.status === 'Overdue'),
    };

    const columns = [
        { key: 'Pending', label: 'Pending', dotClass: 'pending', icon: <HiOutlineClock /> },
        { key: 'In Progress', label: 'In Progress', dotClass: 'in-progress', icon: <HiOutlineTrendingUp /> },
        { key: 'Completed', label: 'Completed', dotClass: 'completed', icon: <HiOutlineCheckCircle /> },
        { key: 'Overdue', label: 'Overdue', dotClass: 'overdue', icon: <HiOutlineExclamationCircle /> },
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getCompletionRate = () => {
        if (!stats || !stats.total || stats.total === 0) return 0;
        return Math.round(((stats.completed || 0) / stats.total) * 100);
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="dashboard-container">
            {/* Greeting Banner */}
            <header className="greeting-banner animate-fade-in">
                <div className="greeting-left">
                    <h1>{getGreeting()}, {currentUser?.username} 👋</h1>
                    <p className="greeting-subtitle">
                        {isManagerOrAdmin
                            ? 'Here\'s an overview of your team\'s progress.'
                            : 'Here\'s what you have on your plate today.'}
                    </p>
                </div>
                <div className="greeting-right">
                    <div className="date-display">
                        <HiOutlineCalendar className="date-icon-large" />
                        <span>{today}</span>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                {/* Stats Row */}
                {stats && (
                    <section className="stats-row">
                        <div className="stat-card stat-total">
                            <div className="stat-icon-wrap total">
                                <HiOutlineClipboardList />
                            </div>
                            <div className="stat-body">
                                <span className="stat-number">{stats.total || 0}</span>
                                <span className="stat-label">Total Tasks</span>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                        <div className="stat-card stat-active">
                            <div className="stat-icon-wrap active">
                                <HiOutlineClock />
                            </div>
                            <div className="stat-body">
                                <span className="stat-number">{(stats.inProgress || 0) + (stats.pending || 0)}</span>
                                <span className="stat-label">Active</span>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                        <div className="stat-card stat-completed">
                            <div className="stat-icon-wrap completed">
                                <HiOutlineCheckCircle />
                            </div>
                            <div className="stat-body">
                                <span className="stat-number">{stats.completed || 0}</span>
                                <span className="stat-label">Completed</span>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>
                        <div className="stat-card stat-overdue">
                            <div className="stat-icon-wrap overdue">
                                <HiOutlineExclamationCircle />
                            </div>
                            <div className="stat-body">
                                <span className="stat-number">{stats.overdue || 0}</span>
                                <span className="stat-label">Overdue</span>
                            </div>
                            <div className="stat-decoration"></div>
                        </div>

                        {/* Completion Ring */}
                        <div className="stat-card stat-ring-card">
                            <div className="completion-ring">
                                <svg viewBox="0 0 100 100" className="ring-svg">
                                    <circle className="ring-bg" cx="50" cy="50" r="42" />
                                    <circle
                                        className="ring-progress"
                                        cx="50" cy="50" r="42"
                                        style={{
                                            strokeDasharray: `${getCompletionRate() * 2.64} 264`,
                                        }}
                                    />
                                </svg>
                                <div className="ring-value">{getCompletionRate()}%</div>
                            </div>
                            <div className="stat-body">
                                <span className="stat-label">Completion Rate</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* Create Task Button + Modal */}
                {isManagerOrAdmin && (
                    <section className="actions-bar">
                        <button
                            className={`btn-create-task ${showForm ? 'active' : ''}`}
                            onClick={() => setShowForm(!showForm)}
                            id="create-task-btn"
                        >
                            {showForm
                                ? <><HiOutlineX /> Cancel</>
                                : <><HiOutlinePlus /> Create New Task</>
                            }
                        </button>
                    </section>
                )}

                {/* Task Form Modal */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <TaskForm onAdd={handleAddTask} onClose={() => setShowForm(false)} />
                        </div>
                    </div>
                )}

                {/* Tasks Board */}
                <section className="tasks-section animate-fade-in">
                    <div className="tasks-toolbar">
                        <div className="toolbar-left">
                            <h2>
                                {isManagerOrAdmin ? 'All Tasks' : 'My Tasks'}
                                <span className="task-count-badge">{filteredTasks.length}</span>
                            </h2>
                        </div>
                        <div className="toolbar-right">
                            <div className="search-wrap">
                                <HiOutlineSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                    id="task-search"
                                />
                                {searchQuery && (
                                    <button className="search-clear" onClick={() => setSearchQuery('')}>
                                        <HiOutlineX />
                                    </button>
                                )}
                            </div>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="filter-select"
                                id="priority-filter"
                            >
                                <option value="All">All Priorities</option>
                                <option value="High">🔴 High</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="Low">🟢 Low</option>
                            </select>
                            <button className="btn-refresh" onClick={loadData} disabled={loading} id="refresh-btn">
                                <HiOutlineRefresh style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner-ring"></div>
                            <span className="loading-text">Loading tasks...</span>
                        </div>
                    ) : filteredTasks.length === 0 && tasks.length > 0 ? (
                        <div className="empty-state glass-panel">
                            <div className="empty-state-icon">🔍</div>
                            <h3>No matching tasks</h3>
                            <p>Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="empty-state glass-panel">
                            <div className="empty-state-icon">📋</div>
                            <h3>No tasks yet!</h3>
                            <p>{isManagerOrAdmin ? "Click 'Create New Task' to get started." : "You have no assigned tasks right now."}</p>
                        </div>
                    ) : (
                        <div className="board-grid">
                            {columns.map(col => (
                                <div className="board-column" key={col.key}>
                                    <div className="board-column-header">
                                        <div className="board-column-title">
                                            <span className={`column-dot ${col.dotClass}`}></span>
                                            <span className="column-icon">{col.icon}</span>
                                            {col.label}
                                        </div>
                                        <span className="board-column-count">
                                            {groupedTasks[col.key]?.length || 0}
                                        </span>
                                    </div>
                                    <div className="board-column-body">
                                        {groupedTasks[col.key]?.length > 0 ? (
                                            groupedTasks[col.key].map(task => (
                                                <TaskCard
                                                    key={task.taskId}
                                                    task={task}
                                                    currentUser={currentUser}
                                                    onDelete={handleDeleteTask}
                                                    onStatusUpdate={handleStatusUpdate}
                                                />
                                            ))
                                        ) : (
                                            <div className="board-empty">No tasks</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
