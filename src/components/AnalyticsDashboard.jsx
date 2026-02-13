import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';
import { FaGlobe, FaMobileAlt, FaDesktop, FaTabletAlt, FaEye, FaMapMarkerAlt } from 'react-icons/fa';

const AnalyticsDashboard = ({ isDarkMode }) => {
    const [stats, setStats] = useState({
        totalVisits: 0,
        recentVisits: [],
        deviceData: { Mobile: 0, Desktop: 0, Tablet: 0 },
        topPages: {},
        topCountries: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'visits'), orderBy('timestamp', 'desc'), limit(100));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const visits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Process Stats
            const devices = { Mobile: 0, Desktop: 0, Tablet: 0 };
            const pages = {};
            const countries = {};

            visits.forEach(v => {
                if (v.device) devices[v.device] = (devices[v.device] || 0) + 1;
                if (v.path) pages[v.path] = (pages[v.path] || 0) + 1;
                if (v.country) countries[v.country] = (countries[v.country] || 0) + 1;
            });

            setStats({
                totalVisits: visits.length, // Shown from last 100 for live feel, or we could fetch total count
                recentVisits: visits.slice(0, 10),
                deviceData: devices,
                topPages: Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 5),
                topCountries: Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 5)
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const theme = {
        card: isDarkMode ? '#1F2937' : '#FFFFFF',
        text: isDarkMode ? '#F9FAFB' : '#111827',
        textMuted: isDarkMode ? '#9CA3AF' : '#6B7280',
        border: isDarkMode ? '#374151' : '#E5E7EB',
    };

    if (loading) return <div>Loading Analytics...</div>;

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>

            {/* Top Summaries */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div style={{ backgroundColor: theme.card, padding: '1.5rem', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                    <p style={{ color: theme.textMuted, fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>VISITS (RECENT 100)</p>
                    <h3 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaEye color="#3B82F6" /> {stats.totalVisits}
                    </h3>
                </div>
                <div style={{ backgroundColor: theme.card, padding: '1.5rem', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                    <p style={{ color: theme.textMuted, fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>TOP COUNTRY</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaGlobe color="#10B981" /> {stats.topCountries[0]?.[0] || 'N/A'}
                    </h3>
                </div>
                <div style={{ backgroundColor: theme.card, padding: '1.5rem', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                    <p style={{ color: theme.textMuted, fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>MOST ACTIVE DEVICE</p>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaMobileAlt color="#8B5CF6" /> {Object.entries(stats.deviceData).sort((a, b) => b[1] - a[1])[0][0]}
                    </h3>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                {/* Real-time Traffic table */}
                <div style={{ backgroundColor: theme.card, padding: '1.5rem', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Recent Visitors (Live)</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead style={{ borderBottom: `1px solid ${theme.border}`, color: theme.textMuted }}>
                            <tr>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Location</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Page</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Device</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentVisits.map(v => (
                                <tr key={v.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                    <td style={{ padding: '1rem 0.75rem', fontWeight: '600' }}>
                                        <FaMapMarkerAlt size={12} style={{ marginRight: '4px' }} /> {v.city || 'Unknown'}, {v.country || 'ET'}
                                    </td>
                                    <td style={{ padding: '1rem 0.75rem', color: '#3B82F6' }}>{v.path}</td>
                                    <td style={{ padding: '1rem 0.75rem' }}>
                                        {v.device === 'Mobile' ? <FaMobileAlt /> : <FaDesktop />} {v.browser}
                                    </td>
                                    <td style={{ padding: '1rem 0.75rem', textAlign: 'right', color: theme.textMuted }}>
                                        {v.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Popularity Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: theme.card, padding: '1.5rem', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                        <h4 style={{ marginBottom: '1rem', size: '0.9rem', fontWeight: '800' }}>Popular Pages</h4>
                        {stats.topPages.map(([page, count]) => (
                            <div key={page} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                                <span style={{ color: theme.textMuted }}>{page}</span>
                                <span style={{ fontWeight: '700' }}>{count} views</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ backgroundColor: theme.card, padding: '1.5rem', borderRadius: '20px', border: `1px solid ${theme.border}` }}>
                        <h4 style={{ marginBottom: '1rem', size: '0.9rem', fontWeight: '800' }}>Device Distribution</h4>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-around' }}>
                            <div style={{ textAlign: 'center' }}>
                                <FaDesktop size={24} color="#3B82F6" />
                                <p style={{ fontSize: '0.7rem', fontWeight: '700', marginTop: '0.5rem' }}>{stats.deviceData.Desktop}</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <FaMobileAlt size={24} color="#8B5CF6" />
                                <p style={{ fontSize: '0.7rem', fontWeight: '700', marginTop: '0.5rem' }}>{stats.deviceData.Mobile}</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <FaTabletAlt size={24} color="#10B981" />
                                <p style={{ fontSize: '0.7rem', fontWeight: '700', marginTop: '0.5rem' }}>{stats.deviceData.Tablet}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
