import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FaMedal } from 'react-icons/fa';

const Home = () => {
    const [athletes, setAthletes] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAthletes(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Arrow key navigation
    const handleKeyDown = useCallback((e) => {
        if (athletes.length === 0) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % athletes.length);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + athletes.length) % athletes.length);
        }
    }, [athletes.length]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const selected = athletes[selectedIndex] || null;

    const getAchievementYears = (athlete) => {
        if (!athlete?.timeline || athlete.timeline.length === 0) return [];
        return athlete.timeline.map(t => ({ year: t.year, title: t.title }));
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', backgroundColor: '#0A0A0F',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #222', borderTopColor: '#4466FF', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                    Loading...
                </div>
            </div>
        );
    }

    // Show 6 photos at a time in the grid (2 cols x 3 rows)
    const gridStartIndex = Math.max(0, Math.min(
        Math.floor(selectedIndex / 6) * 6,
        Math.max(0, athletes.length - 6)
    ));
    const visibleAthletes = athletes.slice(gridStartIndex, gridStartIndex + 6);

    return (
        <div
            style={{
                height: '100vh',
                backgroundColor: '#0A0A0F',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
            tabIndex={0}
        >
            <SEO
                title="Home"
                description="Meet our world-class athletes. Explore their profiles, achievements, and legacy."
            />

            <style>{`
                @keyframes neonGlow {
                    0%, 100% { box-shadow: 0 0 8px rgba(68, 102, 255, 0.3), 0 0 20px rgba(68, 102, 255, 0.1); }
                    50% { box-shadow: 0 0 14px rgba(68, 102, 255, 0.5), 0 0 30px rgba(68, 102, 255, 0.15); }
                }
                @keyframes neonGlowSelected {
                    0%, 100% { box-shadow: 0 0 12px rgba(68, 102, 255, 0.6), 0 0 30px rgba(68, 102, 255, 0.25); }
                    50% { box-shadow: 0 0 18px rgba(68, 102, 255, 0.8), 0 0 40px rgba(68, 102, 255, 0.35); }
                }
                .grid-photo {
                    animation: neonGlow 3s ease-in-out infinite;
                    transition: all 0.35s ease;
                    cursor: pointer;
                }
                .grid-photo:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 18px rgba(68, 102, 255, 0.6), 0 0 35px rgba(68, 102, 255, 0.2) !important;
                }
                .grid-photo.active {
                    animation: neonGlowSelected 2.5s ease-in-out infinite;
                    border-color: #4466FF !important;
                }
            `}</style>

            {/* Background Watermark Number */}
            <div style={{
                position: 'absolute', left: '-3%', top: '50%', transform: 'translateY(-50%)',
                fontSize: 'clamp(18rem, 32vw, 30rem)', fontWeight: '900',
                color: 'rgba(255,255,255,0.02)', lineHeight: 1,
                fontFamily: 'var(--font-heading)', pointerEvents: 'none', zIndex: 0, userSelect: 'none',
            }}>
                {String(selectedIndex + 1).padStart(2, '0')}
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1, display: 'grid', gridTemplateColumns: '1fr auto auto',
                padding: '3rem 3rem 0 4rem', position: 'relative', zIndex: 1, alignItems: 'center',
            }}>
                {/* LEFT — Heading + Athlete Info */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '3rem' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span style={{
                            display: 'inline-block', color: '#4466FF', fontSize: '0.7rem',
                            fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem',
                        }}>Our Champions</span>

                        <h1 style={{
                            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            fontWeight: '900', textTransform: 'uppercase', lineHeight: 1,
                            marginBottom: '1.5rem', letterSpacing: '-0.02em',
                        }}>The<br />Athletes</h1>

                        <p style={{
                            color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem',
                            lineHeight: 1.7, maxWidth: '340px', marginBottom: '2.5rem',
                        }}>
                            A roster of world-class competitors who redefine limits
                            and inspire generations through their dedication.
                        </p>
                    </motion.div>

                    {/* Selected Athlete Details */}
                    <AnimatePresence mode="wait">
                        {selected && (
                            <motion.div
                                key={selected.id}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 15 }}
                                transition={{ duration: 0.3 }}
                                style={{ borderLeft: '2px solid #4466FF', paddingLeft: '1.25rem' }}
                            >
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                                    {selected.name}
                                </h3>
                                <p style={{ color: '#4466FF', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
                                    {selected.subtitle || selected.category || 'Athlete'}
                                </p>

                                {getAchievementYears(selected).length > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                            {getAchievementYears(selected).slice(0, 3).map((ach, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                        width: '42px', padding: '0.2rem 0',
                                                        backgroundColor: 'rgba(68, 102, 255, 0.1)', color: '#4466FF',
                                                        fontSize: '0.7rem', fontWeight: '800', borderRadius: '3px',
                                                    }}>{ach.year}</span>
                                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>{ach.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selected.medals > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                                        <FaMedal style={{ color: '#D4F462', fontSize: '0.85rem' }} />
                                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                            {selected.medals} Olympic Medal{selected.medals !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}

                                <Link to={`/product/${selected.id}`} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.55rem 1.25rem', backgroundColor: '#4466FF', color: 'white',
                                    borderRadius: '0.35rem', fontSize: '0.75rem', fontWeight: '700',
                                    letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'none',
                                }}>View Profile →</Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* CENTER — Photo Grid (2 cols x 3 rows, small photos) */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={gridStartIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}
                        >
                            {visibleAthletes.map((athlete, idx) => {
                                const realIdx = gridStartIndex + idx;
                                const isSelected = realIdx === selectedIndex;
                                return (
                                    <div
                                        key={athlete.id}
                                        className={`grid-photo ${isSelected ? 'active' : ''}`}
                                        onClick={() => setSelectedIndex(realIdx)}
                                        style={{
                                            width: '120px', height: '140px', borderRadius: '3px',
                                            overflow: 'hidden', position: 'relative', flexShrink: 0,
                                            border: isSelected ? '2px solid #4466FF' : '2px solid rgba(255,255,255,0.06)',
                                        }}
                                    >
                                        <img
                                            src={athlete.imageUrl || 'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?q=80&w=300'}
                                            alt={athlete.name}
                                            style={{
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                filter: isSelected ? 'brightness(1) grayscale(0)' : 'brightness(0.5) grayscale(0.4)',
                                                transition: 'all 0.35s ease',
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: isSelected ? 'transparent' : 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.5) 100%)',
                                        }}></div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* RIGHT — Selected Athlete Name (vertical style) */}
                <div style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '180px' }}>
                    <AnimatePresence mode="wait">
                        {selected && (
                            <motion.div
                                key={selected.id + '-name'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 style={{
                                    fontFamily: 'var(--font-heading)', fontSize: '1.75rem',
                                    fontWeight: '900', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '0.5rem',
                                }}>
                                    {selected.name?.split(' ').map((word, i) => (
                                        <span key={i} style={{ display: 'block' }}>{word}</span>
                                    ))}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: '500', letterSpacing: '0.05em' }}>
                                    {selected.category || 'Athlete'}
                                </p>

                                {/* Arrow key hint */}
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: '24px', height: '24px', borderRadius: '4px',
                                        border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)',
                                    }}>▲</span>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: '24px', height: '24px', borderRadius: '4px',
                                        border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)',
                                    }}>▼</span>
                                    <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)', marginLeft: '0.3rem' }}>navigate</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* BOTTOM — Numbered Selector */}
            {athletes.length > 0 && (
                <div style={{
                    padding: '1rem 4rem 1.5rem',
                    display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                    gap: '0.2rem', position: 'relative', zIndex: 1, flexWrap: 'wrap',
                }}>
                    <span style={{
                        color: 'rgba(255,255,255,0.15)', fontSize: '0.65rem', fontWeight: '600',
                        letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: '1rem',
                    }}>Athletes</span>
                    {athletes.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            style={{
                                width: '30px', height: '30px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '3px',
                                border: selectedIndex === idx ? '1.5px solid #4466FF' : '1px solid rgba(255,255,255,0.06)',
                                backgroundColor: selectedIndex === idx ? 'rgba(68, 102, 255, 0.15)' : 'transparent',
                                color: selectedIndex === idx ? '#4466FF' : 'rgba(255,255,255,0.2)',
                                fontSize: '0.65rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.25s ease',
                            }}
                        >
                            {String(idx + 1).padStart(2, '0')}
                        </button>
                    ))}
                </div>
            )}

            {/* Social */}
            <div style={{ padding: '0 4rem 1.25rem', display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.65rem', fontWeight: '500' }}>Facebook</span>
                <span style={{ color: 'rgba(255,255,255,0.06)' }}>/</span>
                <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.65rem', fontWeight: '500' }}>Instagram</span>
            </div>
        </div>
    );
};

export default Home;
