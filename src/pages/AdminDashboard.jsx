import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
    FaChartPie, FaRunning, FaEnvelope, FaUsers, FaCog, FaSignOutAlt,
    FaMoon, FaSun, FaArrowUp, FaArrowDown, FaPlus, FaSearch, FaBell
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import NewsManager from '../components/NewsManager';
import ProductManager from '../components/ProductManager';
import TelegramSettings from '../components/TelegramSettings';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('analytics');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                navigate('/login');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTopColor: '#3B82F6', borderRadius: '50%' }}></div>
        </div>
    );

    const theme = {
        bg: isDarkMode ? '#111827' : '#F3F4F6',
        card: isDarkMode ? '#1F2937' : '#FFFFFF',
        text: isDarkMode ? '#F9FAFB' : '#111827',
        textMuted: isDarkMode ? '#9CA3AF' : '#6B7280',
        border: isDarkMode ? '#374151' : '#E5E7EB',
        sidebar: isDarkMode ? '#111827' : '#FFFFFF',
        accent: '#8B5CF6' // Purple accent matching the "Business" logo color in image
    };

    const navItems = [
        { id: 'analytics', label: 'Analytics', icon: <FaChartPie /> },
        { id: 'products', label: 'Athletes', icon: <FaRunning /> },
        { id: 'news', label: 'Messages', icon: <FaEnvelope /> },
        { id: 'customers', label: 'Customers', icon: <FaUsers /> },
    ];

    const bottomNavItems = [
        { id: 'settings', label: 'Settings', icon: <FaCog /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: "'Inter', sans-serif" }}>

            {/* SIDEBAR */}
            <aside style={{
                width: '260px',
                backgroundColor: theme.sidebar,
                borderRight: `1px solid ${theme.border}`,
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1.5rem',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Z</div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Business</h2>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.8rem 1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeTab === item.id ? (isDarkMode ? '#374151' : '#F3F4F6') : 'transparent',
                                color: activeTab === item.id ? theme.text : theme.textMuted,
                                fontWeight: activeTab === item.id ? '600' : '500',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: `1px solid ${theme.border}`, paddingTop: '1.5rem' }}>
                    {bottomNavItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.8rem 1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeTab === item.id ? (isDarkMode ? '#374151' : '#F3F4F6') : 'transparent',
                                color: activeTab === item.id ? theme.text : theme.textMuted,
                                fontWeight: activeTab === item.id ? '600' : '500',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.8rem 1rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'transparent',
                            color: '#EF4444',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            marginTop: '0.5rem'
                        }}
                    >
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>

                {/* Sidebar Card Placeholder like in image */}
                <div style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: isDarkMode ? '#374151' : '#EFF6FF', borderRadius: '16px', position: 'relative' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Need help?<br />Feel free to contact</p>
                    <button style={{ backgroundColor: '#3B82F6', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' }}>Get support</button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '2rem 3rem' }}>

                {/* Top Headers */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p style={{ fontSize: '0.85rem', color: theme.textMuted }}>01.06.2022 - 31.08.2022</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ backgroundColor: theme.card, borderRadius: '20px', padding: '4px', display: 'flex', border: `1px solid ${theme.border}` }}>
                            <button onClick={() => setIsDarkMode(false)} style={{ padding: '6px 12px', borderRadius: '16px', backgroundColor: !isDarkMode ? theme.bg : 'transparent', color: !isDarkMode ? theme.text : theme.textMuted, border: 'none' }}><FaSun /></button>
                            <button onClick={() => setIsDarkMode(true)} style={{ padding: '6px 12px', borderRadius: '16px', backgroundColor: isDarkMode ? (isDarkMode ? '#374151' : '#eee') : 'transparent', color: isDarkMode ? theme.text : theme.textMuted, border: 'none' }}><FaMoon /></button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>Kristi Kamilykova</p>
                                <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>Admin</p>
                            </div>
                            <img src="https://ui-avatars.com/api/?name=Kristi+K&background=8B5CF6&color=fff" style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="profile" />
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'analytics' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <AnalyticsDashboard isDarkMode={isDarkMode} />
                        </motion.div>
                    )}

                    {activeTab === 'products' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1000px' }}>
                            <ProductManager isDarkMode={isDarkMode} />
                        </motion.div>
                    )}

                    {activeTab === 'news' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '900px' }}>
                            <NewsManager isDarkMode={isDarkMode} />
                        </motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '600px' }}>
                            <TelegramSettings isDarkMode={isDarkMode} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;
