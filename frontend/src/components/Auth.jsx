import React, { useState } from 'react';
import './Auth.css';
import { login, register } from '../services/auth.service';
import { HiOutlineViewGrid, HiOutlineUser, HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi';

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
                await login(username, password);
                onAuthSuccess();
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.response?.data || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box glass-panel">
                <div className="auth-header">
                    <div className="auth-logo-icon">
                        <HiOutlineViewGrid />
                    </div>
                    <h1>Smart Task Manager</h1>
                    <p>{isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}</p>
                </div>

                <div className="auth-tabs">
                    <button 
                        type="button"
                        className={`auth-tab ${isLogin ? 'active' : ''}`} 
                        onClick={() => setIsLogin(true)}
                    >
                        Sign In
                    </button>
                    <button 
                        type="button"
                        className={`auth-tab ${!isLogin ? 'active' : ''}`} 
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <div className="input-with-icon">
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                                placeholder="Enter your username"
                                id="auth-username"
                            />
                            <HiOutlineUser className="input-icon" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="••••••••"
                                id="auth-password"
                            />
                            <HiOutlineLockClosed className="input-icon" />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="form-group" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                            <label>Role</label>
                            <div className="input-with-icon">
                                <select value={role} onChange={(e) => setRole(e.target.value)} id="auth-role">
                                    <option value="ROLE_USER">User</option>
                                    <option value="ROLE_MANAGER">Manager</option>
                                    <option value="ROLE_ADMIN">Admin</option>
                                </select>
                                <HiOutlineShieldCheck className="input-icon" />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn-auth" disabled={loading} id="auth-submit">
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
