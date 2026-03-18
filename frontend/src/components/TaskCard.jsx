import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onDelete, onStatusUpdate, currentUser }) => {
    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'var(--danger-color)';
            case 'medium': return 'var(--warning-color)';
            case 'low': return 'var(--success-color)';
            default: return 'var(--text-secondary)';
        }
    };

    const getStatusColor = (status) => {
        if (status?.toLowerCase() === 'completed') return 'var(--success-color)';
        if (status?.toLowerCase() === 'overdue') return 'var(--danger-color)';
        return 'var(--primary-color)';
    };

    const isManagerOrAdmin = currentUser?.role === 'ROLE_MANAGER' || currentUser?.role === 'ROLE_ADMIN';

    return (
        <div className={`task-card glass-panel animate-fade-in ${task.status === 'Overdue' ? 'card-overdue' : ''}`}>
            <div className="task-header">
                <h3>{task.title}</h3>
                <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                    {task.priority || 'Normal'}
                </span>
            </div>
            
            <p className="task-description">{task.description}</p>
            
            <div className="task-footer">
                <div className="task-meta">
                    <div className="status-selector">
                        <select 
                            className="status-dropdown"
                            style={{ color: getStatusColor(task.status), borderColor: getStatusColor(task.status) }}
                            value={task.status} 
                            onChange={(e) => onStatusUpdate(task.taskId, e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            {task.status === 'Overdue' && <option value="Overdue" disabled>Overdue</option>}
                        </select>
                    </div>
                    {task.assigneeUsername && <span className="assignee">Assigned to: {task.assigneeUsername}</span>}
                    {task.dueDate && <span className={`due-date ${task.status === 'Overdue' ? 'overdue-text' : ''}`}>Due: {task.dueDate}</span>}
                </div>
                
                {isManagerOrAdmin && (
                    <button className="btn-delete" onClick={() => onDelete(task.taskId)}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
