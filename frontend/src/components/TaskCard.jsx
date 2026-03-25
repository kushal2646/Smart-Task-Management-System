import React from 'react';
import './TaskCard.css';
import { HiOutlineUser, HiOutlineCalendar, HiOutlineTrash } from 'react-icons/hi';

const TaskCard = ({ task, onDelete, onStatusUpdate, currentUser }) => {
    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'var(--accent-rose)';
            case 'medium': return 'var(--accent-amber)';
            case 'low': return 'var(--accent-emerald)';
            default: return 'var(--text-secondary)';
        }
    };

    const getStatusColor = (status) => {
        if (status?.toLowerCase() === 'completed') return 'var(--accent-emerald)';
        if (status?.toLowerCase() === 'overdue') return 'var(--accent-rose)';
        if (status?.toLowerCase() === 'in progress') return 'var(--accent-amber)';
        return 'var(--accent-blue-light)';
    };

    const priorityClass = `priority-${(task.priority || 'medium').toLowerCase()}`;
    const isManagerOrAdmin = currentUser?.role === 'ROLE_MANAGER' || currentUser?.role === 'ROLE_ADMIN';

    return (
        <div className={`task-card glass-panel ${priorityClass} ${task.status === 'Overdue' ? 'card-overdue' : ''}`}>
            <div className="task-header">
                <h3>{task.title}</h3>
                <span className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                    {task.priority || 'Normal'}
                </span>
            </div>
            
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-footer">
                <div className="task-meta">
                    <div className="status-selector">
                        <select 
                            className="status-dropdown"
                            style={{ 
                                color: getStatusColor(task.status), 
                                borderColor: getStatusColor(task.status)
                            }}
                            value={task.status} 
                            onChange={(e) => onStatusUpdate(task.taskId, e.target.value)}
                            id={`status-${task.taskId}`}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            {task.status === 'Overdue' && <option value="Overdue" disabled>Overdue</option>}
                        </select>
                    </div>
                    {task.assigneeUsername && (
                        <span className="assignee">
                            <HiOutlineUser className="assignee-icon" />
                            {task.assigneeUsername}
                        </span>
                    )}
                    {task.dueDate && (
                        <span className={`due-date ${task.status === 'Overdue' ? 'overdue-text' : ''}`}>
                            <HiOutlineCalendar className="date-icon" />
                            {task.dueDate}
                        </span>
                    )}
                </div>
                
                {isManagerOrAdmin && (
                    <button className="btn-delete" onClick={() => onDelete(task.taskId)} id={`delete-${task.taskId}`}>
                        <HiOutlineTrash />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
