import React, { useState } from 'react';
import { HiOutlineViewGrid, HiOutlineClipboardList, HiOutlineLogout, HiOutlineCog, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import './Sidebar.css';

const Sidebar = ({ currentUser, onLogout, activeView, onViewChange }) => {
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid /> },
        { id: 'tasks', label: 'All Tasks', icon: <HiOutlineClipboardList /> },
    ];

    return (
        <aside className={`sidebar glass-panel ${collapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <HiOutlineViewGrid />
                    </div>
                    {!collapsed && <span className="logo-text">SmartTask</span>}
                </div>
                <button
                    className="btn-collapse"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <div className="nav-section-label">{!collapsed && 'MENU'}</div>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onViewChange(item.id)}
                        title={collapsed ? item.label : ''}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                        {activeView === item.id && <span className="nav-indicator" />}
                    </button>
                ))}
            </nav>

            {/* User Profile */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {currentUser?.username?.charAt(0)?.toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="sidebar-user-info">
                            <span className="sidebar-username">{currentUser?.username}</span>
                            <span className="sidebar-role" data-role={currentUser?.role}>
                                {currentUser?.role?.replace('ROLE_', '')}
                            </span>
                        </div>
                    )}
                </div>
                <button className="btn-sidebar-logout" onClick={onLogout} title="Log out">
                    <HiOutlineLogout />
                    {!collapsed && <span>Log Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
