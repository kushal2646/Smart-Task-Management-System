import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { isAuthenticated as checkAuth, logout as performLogout, getCurrentUser } from './services/auth.service';
import logo from './assets/logo.png';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Check initial auth state on load
        if (checkAuth()) {
            setIsAuthenticated(true);
            setCurrentUser(getCurrentUser());
        }
    }, []);

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        setCurrentUser(getCurrentUser());
    };

    const handleLogout = () => {
        performLogout();
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    if (!isAuthenticated) {
        return <Auth onAuthSuccess={handleAuthSuccess} />;
    }

    return (
        <div className="app-main">
            <nav className="top-nav glass-panel">
                <div className="nav-brand">
                    <img src={logo} alt="Logo" className="nav-logo" />
                    <span className="nav-title">Smart Task</span>
                </div>
                
                <div className="nav-user">
                    <div className="user-info">
                        <span className="username">{currentUser?.username}</span>
                        <span className="role-badge" data-role={currentUser?.role}>
                            {currentUser?.role?.replace('ROLE_', '')}
                        </span>
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>Log Out</button>
                </div>
            </nav>

            <Dashboard currentUser={currentUser} />
        </div>
    );
}

export default App;
