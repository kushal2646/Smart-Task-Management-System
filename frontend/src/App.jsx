import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import { isAuthenticated as checkAuth, logout as performLogout, getCurrentUser } from './services/auth.service';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');

    useEffect(() => {
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
        <div className="app-layout">
            <Sidebar
                currentUser={currentUser}
                onLogout={handleLogout}
                activeView={activeView}
                onViewChange={setActiveView}
            />
            <main className="main-content">
                <Dashboard currentUser={currentUser} activeView={activeView} />
            </main>
        </div>
    );
}

export default App;
