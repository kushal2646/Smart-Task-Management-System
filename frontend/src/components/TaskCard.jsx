import React from 'react';
import './TaskCard.css';
import { HiOutlineUser, HiOutlineCalendar, HiOutlineTrash } from 'react-icons/hi';

const TaskCard = ({ task, onDelete, onStatusUpdate, currentUser }) => {
    const getStatusColor = (status) => {
        if (status?.toLowerCase() === 'completed') return 'var(--accent-emerald)';
        if (status?.toLowerCase() === 'overdue') return 'var(--accent-rose)';
        if (status?.toLowerCase() === 'in progress') return 'var(--accent-amber)';
        return 'var(--accent-blue-light)';
    };

    const priorityClass = `priority-${(task.priority || 'medium').toLowerCase()}`;
    const isManagerOrAdmin = currentUser?.role === 'ROLE_MANAGER' || currentUser?.role === 'ROLE_ADMIN';

    return (
        <div className={`task-card ${priorityClass} ${task.status === 'Overdue' ? 'card-overdue' : ''}`}>
            {/* Priority Bar */}
            <div className={`priority-bar ${priorityClass}`}></div>

            <div className="card-body">
                <div className="card-top">
                    <h3 className="card-title">{task.title}</h3>
                    <span className={`priority-tag ${priorityClass}`}>
                        {task.priority || 'Medium'}
                    </span>
                </div>

                {task.description && (
                    <p className="card-description">{task.description}</p>
                )}

                <div className="card-meta">
                    {task.assigneeUsername && (
                        <span className="meta-item">
                            <HiOutlineUser className="meta-icon" />
                            {task.assigneeUsername}
                        </span>
                    )}
                    {task.dueDate && (
                        <span className={`meta-item ${task.status === 'Overdue' ? 'overdue-text' : ''}`}>
                            <HiOutlineCalendar className="meta-icon" />
                            {task.dueDate}
                        </span>
                    )}
                </div>

                <div className="card-actions">
                    <select
                        className="status-dropdown"
                        style={{
                            color: getStatusColor(task.status),
                            borderColor: getStatusColor(task.status),
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

                    {isManagerOrAdmin && (
                        <button className="btn-card-delete" onClick={() => onDelete(task.taskId)} id={`delete-${task.taskId}`}>
                            <HiOutlineTrash />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
