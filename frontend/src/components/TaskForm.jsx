import React, { useState, useEffect } from 'react';
import './TaskForm.css';
import { getAllUsers } from '../services/api';

const TaskForm = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [status, setStatus] = useState('Pending');
    const [dueDate, setDueDate] = useState('');
    const [assigneeUsername, setAssigneeUsername] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
                if (data.length > 0) setAssigneeUsername(data[0]);
            } catch (err) {
                console.error("Could not fetch users", err);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!title.trim()) return;

        const newTask = {
            title,
            description,
            priority,
            status,
            dueDate: dueDate || null,
            assigneeUsername: assigneeUsername || null
        };

        onAdd(newTask);
        
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setStatus('Pending');
        setDueDate('');
        if (users.length > 0) setAssigneeUsername(users[0]);
    };

    return (
        <form className="task-form glass-panel animate-fade-in" onSubmit={handleSubmit}>
            <h2>Create New Task</h2>
            
            <div className="form-group">
                <label>Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter task title..."
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Description</label>
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Task details..."
                    rows="3"
                />
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label>Priority</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Assignee</label>
                    <select value={assigneeUsername} onChange={(e) => setAssigneeUsername(e.target.value)}>
                        <option value="">-- Unassigned --</option>
                        {users.map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Due Date</label>
                    <input 
                        type="date" 
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                    />
                </div>
            </div>
            
            <button type="submit" className="btn-submit">Add Task</button>
        </form>
    );
};

export default TaskForm;
