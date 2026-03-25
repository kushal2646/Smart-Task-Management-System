import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { getTasks, addTask, deleteTask, getStats, updateTaskStatus } from '../services/api';
import { HiOutlineClipboardList, HiOutlineClock, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineRefresh, HiOutlineSearch, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import './Dashboard.css';

const Dashboard = ({ currentUser }) => {
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

    // Filter tasks by search and priority
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = !searchQuery || 
            task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.assigneeUsername?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    // Group tasks by status for Kanban view
    const groupedTasks = {
        'Pending': filteredTasks.filter(t => t.status === 'Pending'),
        'In Progress': filteredTasks.filter(t => t.status === 'In Progress'),
        'Completed': filteredTasks.filter(t => t.status === 'Completed'),
        'Overdue': filteredTasks.filter(t => t.status === 'Overdue'),
    };

    const columns = [
        { key: 'Pending', label: 'Pending', dotClass: 'pending', icon: '⏳' },
        { key: 'In Progress', label: 'In Progress', dotClass: 'in-progress', icon: '⚡' },
        { key: 'Completed', label: 'Completed', dotClass: 'completed', icon: '✅' },
        { key: 'Overdue', label: 'Overdue', dotClass: 'overdue', icon: '🔴' },
    ];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header animate-fade-in">
                <h1>📊 Dashboard</h1>
                <p>
                    {isManagerOrAdmin 
                        ? 'Manage and track all team tasks' 
                        : `Welcome back, ${currentUser?.username}!`
                    }
                </p>
            </header>

            <main className="dashboard-main">
                {/* Stats Section */}
                {stats && (
                    <section className="stats-banner">
                        <div className="stat-card">
                            <div className="stat-icon total">
                                <HiOutlineClipboardList />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.total || 0}</span>
                                <span className="stat-label">Total Tasks</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon active">
                                <HiOutlineClock />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{(stats.inProgress || 0) + (stats.pending || 0)}</span>
                                <span className="stat-label">Active</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon completed">
                                <HiOutlineCheckCircle />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.completed || 0}</span>
                                <span className="stat-label">Completed</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon overdue">
                                <HiOutlineExclamationCircle />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.overdue || 0}</span>
                                <span className="stat-label">Overdue</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* Create Task Button + Form */}
                {isManagerOrAdmin && (
                    <section className="form-section">
                        <button 
                            className={`btn-toggle-form ${showForm ? 'active' : ''}`}
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? <><HiOutlineX /> Cancel</> : <><HiOutlinePlus /> Create New Task</>}
                        </button>
                        {showForm && <TaskForm onAdd={handleAddTask} />}
                    </section>
                )}

                {/* Tasks Section */}
                <section className="tasks-section animate-fade-in">
                    <div className="tasks-header">
                        <h2>
                            {isManagerOrAdmin ? '📋 All Tasks' : '📋 My Tasks'} 
                            <span className="task-count">({filteredTasks.length})</span>
                        </h2>
                        <button className="btn-refresh" onClick={loadData} disabled={loading}>
                            <HiOutlineRefresh style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="search-filter-bar">
                        <div className="search-box">
                            <HiOutlineSearch className="search-icon" />
                            <input 
                                type="text"
                                placeholder="Search tasks by title, description, or assignee..."
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
                        <div className="filter-group">
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
                        <div className="kanban-board">
                            {columns.map(col => (
                                <div className="kanban-column" key={col.key}>
                                    <div className="kanban-column-header">
                                        <div className="kanban-column-title">
                                            <span className={`column-dot ${col.dotClass}`}></span>
                                            {col.label}
                                        </div>
                                        <span className="kanban-column-count">
                                            {groupedTasks[col.key]?.length || 0}
                                        </span>
                                    </div>
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
                                        <div className="kanban-empty">No tasks</div>
                                    )}
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
