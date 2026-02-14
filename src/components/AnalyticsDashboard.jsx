import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { 
    FaGlobe, FaMobileAlt, FaDesktop, FaTabletAlt, FaEye, FaMapMarkerAlt,
    FaClock, FaWifi, FaBolt, FaChartBar, FaChrome, FaFirefox, 
    FaSafari, FaEdge, FaOpera, FaApple, FaWindows, FaLinux,
    FaMemory, FaMicrochip, FaLanguage, FaSun, FaMoon, FaTachometerAlt,
    FaChartLine, FaHourglassHalf, FaNetworkWired, FaBatteryFull,
    FaPlug, FaMousePointer, FaQrcode, FaUserSecret, FaDownload
} from 'react-icons/fa';

const AnalyticsDashboard = ({ isDarkMode, timeRange = '24h' }) => {
    const [stats, setStats] = useState({
        totalVisits: 0,
        uniqueVisitors: new Set(),
        recentVisits: [],
        deviceData: { Mobile: 0, Desktop: 0, Tablet: 0 },
        browserData: {},
        osData: {},
        topPages: {},
        topCountries: {},
        topCities: {},
        connectionData: {},
        screenResolutions: {},
        avgLoadTime: 0,
        bounceRate: 0,
        returningVisitors: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedMetric, setSelectedMetric] = useState('realtime');
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 24 * 60 * 60 * 1000),
        end: new Date()
    });

    useEffect(() => {
        // Adjust time range based on selection
        const now = new Date();
        let startDate = new Date();
        switch(timeRange) {
            case '1h':
                startDate = new Date(now - 60 * 60 * 1000);
                break;
            case '24h':
                startDate = new Date(now - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now - 24 * 60 * 60 * 1000);
        }

        const q = query(
            collection(db, 'visits'), 
            where('timestamp', '>=', startDate),
            orderBy('timestamp', 'desc'), 
            limit(500)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const visits = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));

            // Initialize stats objects
            const devices = { Mobile: 0, Desktop: 0, Tablet: 0 };
            const browsers = {};
            const operatingSystems = {};
            const pages = {};
            const countries = {};
            const cities = {};
            const connections = {};
            const resolutions = {};
            const uniqueIps = new Set();
            let totalLoadTime = 0;
            let loadTimeCount = 0;
            let bounceCount = 0;
            let returnCount = 0;

            // Track visitors by IP for uniqueness
            const visitorHistory = new Map();

            visits.forEach((v, index) => {
                // Basic stats
                if (v.device) devices[v.device] = (devices[v.device] || 0) + 1;
                if (v.browser) browsers[v.browser] = (browsers[v.browser] || 0) + 1;
                if (v.os) operatingSystems[v.os] = (operatingSystems[v.os] || 0) + 1;
                if (v.path) pages[v.path] = (pages[v.path] || 0) + 1;
                if (v.country) countries[v.country] = (countries[v.country] || 0) + 1;
                if (v.city) cities[v.city] = (cities[v.city] || 0) + 1;
                
                // Connection info
                if (v.connectionType) {
                    connections[v.connectionType] = (connections[v.connectionType] || 0) + 1;
                }

                // Screen resolution
                if (v.screenWidth && v.screenHeight) {
                    const res = `${v.screenWidth}x${v.screenHeight}`;
                    resolutions[res] = (resolutions[res] || 0) + 1;
                }

                // Unique visitors by IP
                if (v.ip) {
                    uniqueIps.add(v.ip);
                    
                    // Track returning visitors (simplified - visits from same IP)
                    if (visitorHistory.has(v.ip)) {
                        returnCount++;
                    } else {
                        visitorHistory.set(v.ip, true);
                    }
                }

                // Load time performance
                if (v.loadTime) {
                    totalLoadTime += v.loadTime;
                    loadTimeCount++;
                }

                // Bounce rate (simplified - only one page view in session)
                if (index === 0 || v.referrer === 'Direct') {
                    bounceCount++;
                }
            });

            setStats({
                totalVisits: visits.length,
                uniqueVisitors: uniqueIps.size,
                recentVisits: visits.slice(0, 15),
                deviceData: devices,
                browserData: Object.entries(browsers).sort((a, b) => b[1] - a[1]),
                osData: Object.entries(operatingSystems).sort((a, b) => b[1] - a[1]),
                topPages: Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 10),
                topCountries: Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 8),
                topCities: Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 8),
                connectionData: Object.entries(connections).sort((a, b) => b[1] - a[1]),
                screenResolutions: Object.entries(resolutions).sort((a, b) => b[1] - a[1]).slice(0, 5),
                avgLoadTime: loadTimeCount > 0 ? (totalLoadTime / loadTimeCount).toFixed(0) : 0,
                bounceRate: visits.length > 0 ? ((bounceCount / visits.length) * 100).toFixed(1) : 0,
                returningVisitors: visits.length > 0 ? ((returnCount / visits.length) * 100).toFixed(1) : 0
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [timeRange]);

    const theme = {
        card: isDarkMode ? '#1F2937' : '#FFFFFF',
        text: isDarkMode ? '#F9FAFB' : '#111827',
        textMuted: isDarkMode ? '#9CA3AF' : '#6B7280',
        border: isDarkMode ? '#374151' : '#E5E7EB',
        accent: isDarkMode ? '#3B82F6' : '#2563EB',
        bg: isDarkMode ? '#111827' : '#F3F4F6'
    };

    const getBrowserIcon = (browser) => {
        switch(browser?.toLowerCase()) {
            case 'chrome': return <FaChrome color="#4285F4" />;
            case 'firefox': return <FaFirefox color="#FF7139" />;
            case 'safari': return <FaSafari color="#006CFF" />;
            case 'edge': return <FaEdge color="#0078D7" />;
            case 'opera': return <FaOpera color="#FF1B2D" />;
            default: return <FaGlobe color={theme.textMuted} />;
        }
    };

    const getOsIcon = (os) => {
        if (os?.toLowerCase().includes('windows')) return <FaWindows color="#00ADEF" />;
        if (os?.toLowerCase().includes('mac')) return <FaApple color="#555555" />;
        if (os?.toLowerCase().includes('linux')) return <FaLinux color="#FCC624" />;
        if (os?.toLowerCase().includes('android')) return <FaMobileAlt color="#3DDC84" />;
        if (os?.toLowerCase().includes('ios')) return <FaApple color="#555555" />;
        return <FaMicrochip color={theme.textMuted} />;
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '400px',
                color: theme.textMuted 
            }}>
                <FaHourglassHalf size={48} style={{ animation: 'spin 2s linear infinite' }} />
                <p style={{ marginLeft: '1rem' }}>Loading analytics data...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '2rem', padding: '1rem' }}>
            {/* Metric Selection Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                padding: '0.5rem',
                backgroundColor: theme.card,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                overflowX: 'auto'
            }}>
                {['realtime', 'geography', 'technology', 'performance'].map(metric => (
                    <button
                        key={metric}
                        onClick={() => setSelectedMetric(metric)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: selectedMetric === metric ? theme.accent : 'transparent',
                            color: selectedMetric === metric ? '#FFFFFF' : theme.textMuted,
                            cursor: 'pointer',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s'
                        }}
                    >
                        {metric}
                    </button>
                ))}
            </div>

            {/* Key Metrics Cards */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.5rem' 
            }}>
                <MetricCard 
                    icon={<FaEye />}
                    label="Total Visits"
                    value={stats.totalVisits}
                    subValue={`${stats.uniqueVisitors} unique`}
                    color="#3B82F6"
                    theme={theme}
                />
                <MetricCard 
                    icon={<FaGlobe />}
                    label="Countries"
                    value={stats.topCountries.length}
                    subValue={stats.topCountries[0]?.[0] || 'N/A'}
                    color="#10B981"
                    theme={theme}
                />
                <MetricCard 
                    icon={<FaTachometerAlt />}
                    label="Avg Load Time"
                    value={`${stats.avgLoadTime}ms`}
                    subValue={`${stats.bounceRate}% bounce`}
                    color="#F59E0B"
                    theme={theme}
                />
                <MetricCard 
                    icon={<FaChartLine />}
                    label="Return Rate"
                    value={`${stats.returningVisitors}%`}
                    subValue="returning visitors"
                    color="#8B5CF6"
                    theme={theme}
                />
            </div>

            {/* Main Dashboard Content */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: selectedMetric === 'realtime' ? '2fr 1fr' : '1fr 1fr', 
                gap: '1.5rem' 
            }}>
                
                {/* Recent Visitors Table - Always visible */}
                <div style={{ 
                    backgroundColor: theme.card, 
                    padding: '1.5rem', 
                    borderRadius: '20px', 
                    border: `1px solid ${theme.border}`,
                    gridColumn: selectedMetric === 'realtime' ? '1 / 2' : '1 / -1'
                }}>
                    <h4 style={{ 
                        marginBottom: '1.5rem', 
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <FaChartLine color={theme.accent} /> Recent Visitors
                        <span style={{ 
                            fontSize: '0.7rem', 
                            backgroundColor: theme.accent, 
                            color: '#FFFFFF',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '12px',
                            marginLeft: 'auto'
                        }}>
                            LIVE
                        </span>
                    </h4>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead style={{ borderBottom: `2px solid ${theme.border}`, color: theme.textMuted }}>
                                <tr>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Visitor</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Location</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Page</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Device</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Browser/OS</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Connection</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentVisits.map(v => (
                                    <tr key={v.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <td style={{ padding: '1rem 0.75rem', fontWeight: '600' }}>
                                            <FaUserSecret size={12} style={{ marginRight: '4px', opacity: 0.5 }} />
                                            {v.ip ? v.ip.split('.').slice(0,2).join('.') + '.xxx' : 'Anonymous'}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem' }}>
                                            <FaMapMarkerAlt size={12} style={{ marginRight: '4px' }} /> 
                                            {v.city || 'Unknown'}, {v.countryCode || '--'}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', color: theme.accent }}>
                                            {v.path?.split('/').pop() || '/'}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem' }}>
                                            {v.device === 'Mobile' ? <FaMobileAlt /> : 
                                             v.device === 'Tablet' ? <FaTabletAlt /> : <FaDesktop />}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem' }}>
                                            {getBrowserIcon(v.browser)} {v.browser} / {getOsIcon(v.os)} {v.os?.split(' ')[0]}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem' }}>
                                            {v.connectionType && <FaWifi size={12} />} {v.connectionType || 'Unknown'}
                                        </td>
                                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right', color: theme.textMuted }}>
                                            {v.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Dynamic Content Based on Selected Metric */}
                {selectedMetric === 'geography' && (
                    <div style={{ 
                        backgroundColor: theme.card, 
                        padding: '1.5rem', 
                        borderRadius: '20px', 
                        border: `1px solid ${theme.border}` 
                    }}>
                        <h4 style={{ marginBottom: '1rem', fontWeight: '800' }}>
                            <FaGlobe color="#10B981" /> Geographic Distribution
                        </h4>
                        
                        {/* Countries */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>Top Countries</h5>
                            {stats.topCountries.map(([country, count]) => (
                                <div key={country} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0'
                                }}>
                                    <span style={{ color: theme.text }}>{country}</span>
                                    <span style={{ fontWeight: '600' }}>{count} visits</span>
                                </div>
                            ))}
                        </div>

                        {/* Cities */}
                        <div>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>Top Cities</h5>
                            {stats.topCities.map(([city, count]) => (
                                <div key={city} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0'
                                }}>
                                    <span style={{ color: theme.text }}>{city}</span>
                                    <span style={{ fontWeight: '600' }}>{count} visits</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedMetric === 'technology' && (
                    <div style={{ 
                        backgroundColor: theme.card, 
                        padding: '1.5rem', 
                        borderRadius: '20px', 
                        border: `1px solid ${theme.border}` 
                    }}>
                        <h4 style={{ marginBottom: '1rem', fontWeight: '800' }}>
                            <FaMicrochip color="#8B5CF6" /> Technology Stack
                        </h4>

                        {/* Browsers */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>Browsers</h5>
                            {stats.browserData.slice(0, 5).map(([browser, count]) => (
                                <div key={browser} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    justifyContent: 'space-between', 
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {getBrowserIcon(browser)} {browser}
                                    </span>
                                    <span style={{ fontWeight: '600' }}>{count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Operating Systems */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>Operating Systems</h5>
                            {stats.osData.slice(0, 5).map(([os, count]) => (
                                <div key={os} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    justifyContent: 'space-between', 
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {getOsIcon(os)} {os}
                                    </span>
                                    <span style={{ fontWeight: '600' }}>{count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Screen Resolutions */}
                        <div>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>Screen Resolutions</h5>
                            {stats.screenResolutions.map(([res, count]) => (
                                <div key={res} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    marginBottom: '0.25rem',
                                    fontSize: '0.8rem'
                                }}>
                                    <span>{res}</span>
                                    <span>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedMetric === 'performance' && (
                    <div style={{ 
                        backgroundColor: theme.card, 
                        padding: '1.5rem', 
                        borderRadius: '20px', 
                        border: `1px solid ${theme.border}` 
                    }}>
                        <h4 style={{ marginBottom: '1rem', fontWeight: '800' }}>
                            <FaTachometerAlt color="#F59E0B" /> Performance Metrics
                        </h4>

                        {/* Core Metrics */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ 
                                padding: '1rem', 
                                backgroundColor: theme.bg, 
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <FaHourglassHalf size={20} color={theme.accent} />
                                <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>Load Time</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{stats.avgLoadTime}ms</p>
                            </div>
                            <div style={{ 
                                padding: '1rem', 
                                backgroundColor: theme.bg, 
                                borderRadius: '12px',
                                textAlign: 'center'
                            }}>
                                <FaBounce size={20} color={theme.accent} />
                                <p style={{ fontSize: '0.7rem', color: theme.textMuted }}>Bounce Rate</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{stats.bounceRate}%</p>
                            </div>
                        </div>

                        {/* Connection Types */}
                        <div>
                            <h5 style={{ color: theme.textMuted, marginBottom: '0.5rem' }}>
                                <FaNetworkWired /> Connection Distribution
                            </h5>
                            {stats.connectionData.map(([type, count]) => (
                                <div key={type} style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    marginBottom: '0.5rem'
                                }}>
                                    <span style={{ textTransform: 'uppercase' }}>{type || 'Unknown'}</span>
                                    <span style={{ fontWeight: '600' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Popular Pages - Always visible */}
            <div style={{ 
                backgroundColor: theme.card, 
                padding: '1.5rem', 
                borderRadius: '20px', 
                border: `1px solid ${theme.border}` 
            }}>
                <h4 style={{ marginBottom: '1rem', fontWeight: '800' }}>
                    <FaChartBar color={theme.accent} /> Popular Pages
                </h4>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem' 
                }}>
                    {stats.topPages.map(([page, count]) => (
                        <div key={page} style={{ 
                            padding: '1rem',
                            backgroundColor: theme.bg,
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: theme.text, fontWeight: '500' }}>
                                {page.split('/').pop() || '/'}
                            </span>
                            <span style={{ 
                                backgroundColor: theme.accent,
                                color: '#FFFFFF',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}>
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Metric Card Component
const MetricCard = ({ icon, label, value, subValue, color, theme }) => (
    <div style={{ 
        backgroundColor: theme.card, 
        padding: '1.5rem', 
        borderRadius: '20px', 
        border: `1px solid ${theme.border}`,
        transition: 'transform 0.2s',
        cursor: 'pointer',
        ':hover': {
            transform: 'translateY(-2px)'
        }
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ color }}>{icon}</span>
            <p style={{ color: theme.textMuted, fontSize: '0.8rem', fontWeight: '700' }}>{label}</p>
        </div>
        <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' }}>{value}</h3>
        <p style={{ color: theme.textMuted, fontSize: '0.8rem' }}>{subValue}</p>
    </div>
);

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

export default AnalyticsDashboard;