import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { getTasks, addTask, deleteTask, getStats, updateTaskStatus } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ currentUser }) => {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            setError('Failed to load tasks or statistics from server.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (taskData) => {
        try {
            await addTask(taskData);
            loadData(); // Reload to get fresh sorting and stats
        } catch (err) {
            console.error('Error adding task:', err);
            alert('Failed to add task.');
        }
    };

    const handleDeleteTask = async (taskId) => {
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

    return (
        <div className="dashboard-container">
            <header className="dashboard-header animate-fade-in">
                <h1>Smart Task Management</h1>
                <p>Organize your work with elegance</p>
            </header>

            <main className="dashboard-main">
                {stats && (
                    <section className="stats-banner glass-panel animate-fade-in">
                        <div className="stat-item">
                            <span className="stat-value text-primary">{stats.total}</span>
                            <span className="stat-label">Total Tasks</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value text-warning">{stats.inProgress + stats.pending}</span>
                            <span className="stat-label">Active</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value text-success">{stats.completed}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value text-danger">{stats.overdue}</span>
                            <span className="stat-label">Overdue</span>
                        </div>
                    </section>
                )}

                {isManagerOrAdmin && (
                    <section className="form-section">
                        <TaskForm onAdd={handleAddTask} />
                    </section>
                )}

                <section className="tasks-section animate-fade-in">
                    <div className="tasks-header">
                        <h2>{isManagerOrAdmin ? 'All Tasks' : 'My Assigned Tasks'} <span className="task-count">({tasks.length})</span></h2>
                        <button className="btn-refresh" onClick={loadData} disabled={loading}>
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    {loading ? (
                        <div className="loading-spinner">Loading tasks...</div>
                    ) : tasks.length === 0 ? (
                        <div className="empty-state glass-panel">
                            <h3>No tasks left!</h3>
                            <p>{isManagerOrAdmin ? "Create a new task above." : "You have no assigned tasks right now."}</p>
                        </div>
                    ) : (
                        <div className="tasks-grid">
                            {tasks.map(task => (
                                <TaskCard 
                                    key={task.taskId} 
                                    task={task} 
                                    currentUser={currentUser}
                                    onDelete={handleDeleteTask} 
                                    onStatusUpdate={handleStatusUpdate}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
