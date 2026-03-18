import React, { useState } from 'react';
import './Auth.css';
import logo from '../assets/logo.png';
import { login, register } from '../services/auth.service';

const Auth = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ROLE_USER');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(username, password);
                onAuthSuccess();
            } else {
                await register(username, password, role);
                // After successful registration, automatically log them in
                await login(username, password);
                onAuthSuccess();
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.response?.data || 'Authentication failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box glass-panel animate-fade-in">
                <div className="auth-header">
                    <img src={logo} alt="Smart Task Management Logo" className="auth-logo" />
                    <h1>Smart Task Management System</h1>
                    <p>{isLogin ? 'Welcome back! Please login.' : 'Create your new account.'}</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="ROLE_USER">User</option>
                                <option value="ROLE_MANAGER">Manager</option>
                                <option value="ROLE_ADMIN">Admin</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign up' : 'Log in'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
