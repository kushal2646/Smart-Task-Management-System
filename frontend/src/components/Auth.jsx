import React, { useState } from 'react';
import './Auth.css';
import { login, register } from '../services/auth.service';
import { HiOutlineViewGrid, HiOutlineUser, HiOutlineLockClosed, HiOutlineShieldCheck, HiOutlineLightningBolt, HiOutlineCube, HiOutlineChartBar } from 'react-icons/hi';

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
        <div className="auth-page">
            {/* Left Panel — Branding */}
            <div className="auth-brand-panel">
                <div className="brand-content">
                    <div className="brand-logo">
                        <div className="brand-logo-icon">
                            <HiOutlineViewGrid />
                        </div>
                        <span className="brand-logo-text">SmartTask</span>
                    </div>
                    <h2 className="brand-headline">Streamline Your Team's Productivity</h2>
                    <p className="brand-description">
                        Organize, assign, and track tasks with intelligent role-based management.
                    </p>
                    <div className="brand-features">
                        <div className="brand-feature">
                            <div className="feature-icon"><HiOutlineLightningBolt /></div>
                            <div>
                                <strong>Real-time Updates</strong>
                                <span>Track progress instantly</span>
                            </div>
                        </div>
                        <div className="brand-feature">
                            <div className="feature-icon"><HiOutlineCube /></div>
                            <div>
                                <strong>Task Board</strong>
                                <span>Drag & drop workflow</span>
                            </div>
                        </div>
                        <div className="brand-feature">
                            <div className="feature-icon"><HiOutlineChartBar /></div>
                            <div>
                                <strong>Analytics</strong>
                                <span>Insights & statistics</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="brand-orb brand-orb-1"></div>
                <div className="brand-orb brand-orb-2"></div>
                <div className="brand-orb brand-orb-3"></div>
            </div>

            {/* Right Panel — Form */}
            <div className="auth-form-panel">
                <div className="auth-form-wrapper">
                    <div className="auth-form-header">
                        <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                        <p>{isLogin ? 'Sign in to continue to your dashboard.' : 'Get started with your free account.'}</p>
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
                                <HiOutlineUser className="input-icon" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Enter your username"
                                    id="auth-username"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-with-icon">
                                <HiOutlineLockClosed className="input-icon" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    id="auth-password"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="form-group" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                                <label>Role</label>
                                <div className="input-with-icon">
                                    <HiOutlineShieldCheck className="input-icon" />
                                    <select value={role} onChange={(e) => setRole(e.target.value)} id="auth-role">
                                        <option value="ROLE_USER">User</option>
                                        <option value="ROLE_MANAGER">Manager</option>
                                        <option value="ROLE_ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn-auth" disabled={loading} id="auth-submit">
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
