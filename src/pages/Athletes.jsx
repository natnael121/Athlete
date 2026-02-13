import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FaMedal, FaMapMarkerAlt } from 'react-icons/fa';

const Athletes = () => {
    const [athletes, setAthletes] = useState([]);
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

    return (
        <div className="page-athletes" style={{ backgroundColor: '#0A0A0F', minHeight: '100vh', color: 'white' }}>
            <SEO
                title="Athletes Directory"
                description="Meet our world-class athletes. Explore their profiles, achievements, and journey to greatness."
            />

            {/* Hero Banner */}
            <section style={{
                padding: '4rem 0 2rem',
                background: 'linear-gradient(180deg, #12121a 0%, #0A0A0F 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(circle at 30% 50%, rgba(68, 102, 255, 0.05) 0%, transparent 60%)',
                }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center' }}
                    >
                        <span style={{
                            display: 'inline-block',
                            padding: '0.4rem 1.25rem',
                            backgroundColor: 'rgba(68, 102, 255, 0.1)',
                            color: '#4466FF',
                            borderRadius: '2rem',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(68, 102, 255, 0.15)'
                        }}>
                            The Roster
                        </span>
                        <h1 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '3rem',
                            fontWeight: '900',
                            lineHeight: 1.1,
                            marginBottom: '1rem',
                        }}>
                            All <span style={{ color: '#4466FF' }}>Champions</span>
                        </h1>
                        <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto', fontSize: '1rem' }}>
                            Explore the complete roster of Ethiopia's legendary distance runners.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Athletes Grid */}
            <section style={{ padding: '3rem 0 6rem' }}>
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', color: '#444', padding: '4rem 0' }}>
                            <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #222', borderTopColor: '#4466FF', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                            Loading roster...
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {athletes.map((athlete, idx) => (
                                <motion.div
                                    key={athlete.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Link to={`/product/${athlete.id}`} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            backgroundColor: '#111116',
                                            borderRadius: '1rem',
                                            overflow: 'hidden',
                                            border: '1px solid #1a1a22',
                                            transition: 'all 0.3s ease',
                                        }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = '#4466FF';
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = '#1a1a22';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <div style={{ height: '350px', overflow: 'hidden', position: 'relative' }}>
                                                <img
                                                    src={athlete.imageUrl || 'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?q=80&w=400'}
                                                    alt={athlete.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <div style={{
                                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                                    height: '60%',
                                                    background: 'linear-gradient(to top, #111116, transparent)',
                                                }}></div>

                                                {athlete.medals > 0 && (
                                                    <div style={{
                                                        position: 'absolute', top: '1rem', right: '1rem',
                                                        backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                                                        padding: '0.4rem 0.75rem', borderRadius: '2rem',
                                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                        fontSize: '0.75rem', color: '#D4F462', fontWeight: '800',
                                                        border: '1px solid rgba(212, 244, 98, 0.2)'
                                                    }}>
                                                        <FaMedal size={11} /> {athlete.medals}
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ padding: '1.25rem' }}>
                                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.3rem', color: 'white' }}>
                                                    {athlete.name}
                                                </h3>
                                                <p style={{ color: '#4466FF', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                                                    {athlete.subtitle || athlete.category}
                                                </p>
                                                {athlete.hometown && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#555', fontSize: '0.8rem' }}>
                                                        <FaMapMarkerAlt size={10} /> {athlete.hometown}
                                                    </div>
                                                )}
                                                <div style={{ marginTop: '1.25rem', color: '#4466FF', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                                    View Profile →
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Athletes;
