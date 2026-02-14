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

    const handleKeyDown = useCallback((e) => {
        if (athletes.length === 0) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            setSelectedIndex(prev => (prev + 1) % athletes.length);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            setSelectedIndex(prev => (prev - 1 + athletes.length) % athletes.length);
        }
    }, [athletes.length]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const selected = athletes[selectedIndex];

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#0A0A0F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#777'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="home">
            <SEO
                title="Ethiopian Olympic Champions"
                description="Explore Ethiopia’s greatest Olympic legends and their achievements."
            />

            <style>{`
                .home {
                    background: #0A0A0F;
                    color: white;
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                /* ===== MOBILE FIRST ===== */
                .container {
                    display: flex;
                    flex-direction: column;
                    padding: 1rem;
                    gap: 1.5rem;
                }

                .header {
                    text-align: center;
                }

                .header h1 {
                    font-size: 2rem;
                    font-weight: 900;
                }

                .header p {
                    font-size: 0.9rem;
                    opacity: 0.6;
                }

                .main-card {
                    background: #111;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .main-card img {
                    width: 100%;
                    height: 240px;
                    object-fit: cover;
                }

                .card-content {
                    padding: 1rem;
                }

                .grid {
                    display: flex;
                    overflow-x: auto;
                    gap: 0.7rem;
                    padding-bottom: 0.5rem;
                }

                .grid-item {
                    min-width: 110px;
                    height: 130px;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 2px solid transparent;
                    cursor: pointer;
                }

                .grid-item.active {
                    border-color: #4466FF;
                }

                .grid-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                /* ===== DESKTOP ===== */
                @media (min-width: 1024px) {
                    .container {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        padding: 3rem;
                        gap: 3rem;
                    }

                    .header {
                        text-align: left;
                    }

                    .header h1 {
                        font-size: 4rem;
                    }

                    .main-card img {
                        height: 420px;
                    }

                    .grid {
                        flex-wrap: wrap;
                        overflow: visible;
                    }

                    .grid-item {
                        width: 120px;
                    }
                }
            `}</style>

            <div className="container">

                {/* HEADER */}
                <div className="header">
                    <h1>Olympic Champions</h1>
                    <p>
                        Celebrating legends like{" "}
                        0
                    </p>
                </div>

                {/* SELECTED ATHLETE */}
                {selected && (
                    <motion.div
                        key={selected.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="main-card"
                    >
                        <img src={selected.imageUrl} alt={selected.name} />

                        <div className="card-content">
                            <h2>{selected.name}</h2>

                            <p style={{ opacity: 0.6 }}>
                                {selected.category}
                            </p>

                            {selected.medals > 0 && (
                                <p style={{ marginTop: '0.5rem' }}>
                                    <FaMedal /> {selected.medals} Olympic Medals
                                </p>
                            )}

                            <Link
                                to={`/product/${selected.id}`}
                                style={{
                                    display: 'inline-block',
                                    marginTop: '1rem',
                                    background: '#4466FF',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '6px',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}
                            >
                                View Profile
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* SCROLLABLE GRID */}
                <div className="grid">
                    {athletes.map((athlete, index) => (
                        <div
                            key={athlete.id}
                            className={`grid-item ${index === selectedIndex ? 'active' : ''}`}
                            onClick={() => setSelectedIndex(index)}
                        >
                            <img src={athlete.imageUrl} alt={athlete.name} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;