import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaChevronLeft, FaMapMarkerAlt, FaCalendarAlt, FaUniversity,
    FaCalculator, FaRunning, FaUtensils, FaMedal
} from 'react-icons/fa';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import SEO from '../components/common/SEO';

const AthleteProfile = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allAthletes, setAllAthletes] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Fetch all athletes for "Other Athletes" section
    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllAthletes(data);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return (
        <div style={{
            minHeight: '100vh', backgroundColor: '#0A0A0F', color: '#555',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #222', borderTopColor: '#4466FF', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
                Loading athlete profile...
            </div>
        </div>
    );

    const athlete = product ? {
        name: product.name || "Unknown Athlete",
        word: product.subtitle || product.word || "CHAMPION",
        image: product.imageUrl || product.mainImage || "https://images.unsplash.com/photo-1552674605-5d28c4e1902c?q=80&w=2574&auto=format&fit=crop",
        description: product.description,
        stats: {
            height: product.dimensions || product.height || "N/A",
            hometown: product.hometown || "Ethiopia",
            birthday: product.birthday || "N/A",
            college: product.college || "N/A"
        },
        funFacts: [
            { icon: <FaCalculator />, label: "Favorite Subject", value: product.favoriteSubject || "N/A" },
            { icon: <FaRunning />, label: "First Job", value: product.firstJob || "Athlete" },
            { icon: <FaUtensils />, label: "Favorite Breakfast", value: product.favoriteBreakfast || "N/A" },
            { icon: <FaUtensils />, label: "Fav Restaurant", value: product.favoriteRestaurant || "N/A" },
        ],
        medals: product.medals || 0,
        timeline: product.timeline || []
    } : null;

    if (!athlete) {
        return (
            <div style={{
                minHeight: '100vh', backgroundColor: '#0A0A0F', color: 'white',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem'
            }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Athlete Not Found</h2>
                <Link to="/" style={{ padding: '0.6rem 1.5rem', backgroundColor: '#4466FF', color: 'white', borderRadius: '0.4rem', fontWeight: '700', fontSize: '0.85rem' }}>Back Home</Link>
            </div>
        );
    }

    const otherAthletes = allAthletes.filter(a => a.id !== id);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="product-detail-page"
        >
            <SEO title={`${athlete.name} - Profile`} description={`Profile of ${athlete.name}`} image={athlete.image} />

            <style>{`
                .product-detail-page {
                    background-color: #0A0A0F;
                    min-height: 100vh;
                    color: white;
                    overflow-x: hidden;
                    width: 100%;
                }
                .athlete-profile-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    align-items: start;
                }
                .athlete-stats-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }
                .athlete-image-container {
                    height: auto !important;
                    width: 100%;
                    aspect-ratio: 4/5;
                    max-height: 70vh;
                }
                .athlete-name-hero {
                    font-size: clamp(2.5rem, 8vw, 4.5rem) !important;
                    margin-bottom: 2rem !important;
                }
                .dimension-label {
                    display: none;
                }

                @media (min-width: 768px) {
                    .athlete-stats-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 3rem;
                    }
                    .breadcrumb-container {
                        flex-direction: row !important;
                        align-items: center !important;
                    }
                }

                @media (min-width: 1024px) {
                    .athlete-profile-grid {
                        grid-template-columns: minmax(300px, 40%) 1fr;
                        gap: 4rem;
                    }
                    .athlete-image-container {
                        height: 600px !important;
                        aspect-ratio: auto;
                    }
                    .dimension-label {
                        display: flex;
                    }
                    .athlete-name-hero {
                        margin-bottom: 3rem !important;
                    }
                }

                /* Timeline */
                .timeline-line {
                    position: absolute; left: 50%; transform: translateX(-50%); top: 0; bottom: 0; width: 2px; background-color: #222;
                }
                .timeline-row {
                    display: flex; position: relative; align-items: center;
                }
                .timeline-content-wrapper {
                     width: 50%; display: flex;
                }
                .timeline-dot {
                    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
                    width: 16px; height: 16px; background-color: #0A0A0F;
                    border: 2px solid #4466FF; border-radius: 50%; z-index: 2;
                    box-shadow: 0 0 15px rgba(68, 102, 255, 0.5);
                }
                
                @media (max-width: 768px) {
                    .timeline-line { left: 20px; transform: none; }
                    .timeline-row { justify-content: flex-start !important; }
                    .timeline-content-wrapper { width: 100% !important; padding: 0 0 0 3rem !important; justify-content: flex-start !important; }
                    .timeline-dot { left: 20px; }
                    .timeline-arrow { display: none !important; }
                    .section-title { font-size: 2.25rem !important; }
                }
                .breadcrumb-container { display: flex; flex-direction: column; align-items: flex-start; gap: 1rem; }
                @media (max-width: 500px) {
                    .breadcrumb-container { gap: 1rem; }
                    .section-header { margin-bottom: 3rem !important; }
                }
            `}</style>

            {/* HERO / PROFILE */}
            <section style={{ padding: '2rem 0 4rem' }}>
                <div className="container">

                    {/* Breadcrumb */}
                    <div className="breadcrumb-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', fontSize: '0.85rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit' }}>
                            <FaChevronLeft size={10} /> BACK TO HOME
                        </Link>
                        <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4466FF' }}>Athlete Profile</div>
                    </div>

                    <div className="athlete-profile-grid">

                        {/* Photo */}
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative' }}>
                            <div className="athlete-image-container" style={{ height: '600px', width: '100%', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <img src={athlete.image} alt={athlete.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="dimension-label" style={{ position: 'absolute', left: '-30px', top: '10%', bottom: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', color: '#4466FF' }}>
                                <FaChevronLeft style={{ transform: 'rotate(90deg)' }} />
                                <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontWeight: '700', letterSpacing: '0.1em' }}>HEIGHT {athlete.stats.height}</div>
                                <FaChevronLeft style={{ transform: 'rotate(-90deg)' }} />
                                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: '#4466FF', zIndex: -1, opacity: 0.5 }}></div>
                            </div>
                        </motion.div>

                        {/* Stats & Info */}
                        <div style={{ paddingTop: '1rem' }}>
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <h5 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#888' }}>{athlete.name.split(' ')[0]} in a Word:</h5>
                                </div>
                                <h1 className="athlete-name-hero" style={{ fontWeight: '800', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-0.02em' }}>
                                    <span style={{ color: '#4466FF' }}>{athlete.word?.charAt(0)}</span>{athlete.word?.slice(1)}
                                </h1>
                            </motion.div>

                            <div className="athlete-stats-grid">
                                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ color: '#4466FF', fontSize: '3rem' }}><FaMapMarkerAlt /></div>
                                    <div>
                                        <h4 style={{ fontWeight: '700', fontSize: '1.25rem' }}>Hometown</h4>
                                        <p style={{ color: '#888', fontSize: '1.1rem' }}>{athlete.stats.hometown}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ color: '#4466FF', fontSize: '2rem' }}><FaCalendarAlt /></div>
                                        <div><h4 style={{ fontWeight: '700' }}>Birthday</h4><p style={{ color: '#888' }}>{athlete.stats.birthday}</p></div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ color: '#4466FF', fontSize: '2rem' }}><FaUniversity /></div>
                                        <div><h4 style={{ fontWeight: '700' }}>College</h4><p style={{ color: '#888' }}>{athlete.stats.college}</p></div>
                                    </div>
                                    <div style={{ marginTop: '2rem' }}>
                                        {athlete.funFacts.slice(0, 2).map((fact, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                                <div style={{ padding: '0.6rem', borderRadius: '0.5rem', backgroundColor: 'rgba(68, 102, 255, 0.1)', color: '#4466FF', fontSize: '1.2rem' }}>{fact.icon}</div>
                                                <div><h5 style={{ fontSize: '0.85rem', fontWeight: '700' }}>{fact.label}</h5><p style={{ fontSize: '0.9rem', color: '#888' }}>{fact.value}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {athlete.funFacts.slice(2, 4).map((fact, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{ padding: '0.6rem', borderRadius: '0.5rem', backgroundColor: 'rgba(68, 102, 255, 0.1)', color: '#4466FF', fontSize: '1.2rem' }}>{fact.icon}</div>
                                            <div><h5 style={{ fontSize: '0.85rem', fontWeight: '700' }}>{fact.label}</h5><p style={{ fontSize: '0.9rem', color: '#888' }}>{fact.value}</p></div>
                                        </div>
                                    ))}

                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '1rem', background: 'linear-gradient(90deg, rgba(68,102,255,0.1) 0%, transparent 100%)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(68,102,255,0.2)' }}>
                                        <div style={{ fontSize: '5rem', fontWeight: '800', lineHeight: 1, color: '#4466FF' }}>{athlete.medals}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <h4 style={{ fontWeight: '700', fontSize: '1.1rem', lineHeight: 1.2 }}>Olympic<br />Medals</h4>
                                            <div style={{ display: 'flex', gap: '0.25rem', color: '#D4F462' }}>
                                                {[...Array(athlete.medals)].map((_, i) => <FaMedal key={i} size={16} />)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TIMELINE */}
            {athlete.timeline && athlete.timeline.length > 0 && (
                <section style={{ backgroundColor: '#050508', padding: '6rem 0' }}>
                    <div className="container">
                        <div className="section-header" style={{ textAlign: 'center', marginBottom: '5rem' }}>
                            <h2 className="section-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                                Career <span style={{ color: '#4466FF' }}>Highlights</span>
                            </h2>
                            <p style={{ color: '#888', fontSize: '1.1rem' }}>A journey of dedication and success.</p>
                        </div>
                        <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
                            <div className="timeline-line"></div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                                {athlete.timeline.map((item, index) => {
                                    const isEven = index % 2 === 0;
                                    return (
                                        <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}
                                            className="timeline-row"
                                            style={{ justifyContent: isEven ? 'flex-end' : 'flex-start' }}
                                        >
                                            <div className="timeline-dot"></div>
                                            <div className="timeline-content-wrapper" style={{ padding: isEven ? '0 0 0 3rem' : '0 3rem 0 0', justifyContent: isEven ? 'flex-start' : 'flex-end' }}>
                                                <div style={{ backgroundColor: '#111116', border: '1px solid #222', padding: '2rem', borderRadius: '0.5rem', position: 'relative', width: '100%', maxWidth: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                                                    <div className="timeline-arrow" style={{ position: 'absolute', top: '50%', marginTop: '-10px', [isEven ? 'left' : 'right']: '-11px', width: '20px', height: '20px', backgroundColor: '#111116', borderLeft: isEven && '1px solid #222', borderBottom: isEven && '1px solid #222', borderRight: !isEven && '1px solid #222', borderTop: !isEven && '1px solid #222', transform: 'rotate(45deg)', zIndex: 1 }}></div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                        <span style={{ color: '#4466FF', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '0.05em' }}>{item.year}</span>
                                                        <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', margin: 0 }}>{item.title}</h3>
                                                        <p style={{ color: '#999', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.description}</p>
                                                        {item.image && (
                                                            <div style={{ marginTop: '1rem', width: '100%', height: '180px', overflow: 'hidden', borderRadius: '4px' }}>
                                                                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )
            }

            {/* OTHER ATHLETES */}
            {
                otherAthletes.length > 0 && (
                    <section style={{ backgroundColor: '#050508', borderTop: '1px solid #1a1a22', padding: '4rem 0 6rem' }}>
                        <div className="container">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div>
                                    <span style={{ display: 'inline-block', color: '#4466FF', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
                                        More Champions
                                    </span>
                                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em' }}>
                                        Other Athletes
                                    </h2>
                                </div>
                                <Link to="/athletes" style={{ color: '#4466FF', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    View All →
                                </Link>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                gap: '0.75rem',
                            }}>
                                {otherAthletes.slice(0, 12).map((a) => (
                                    <Link key={a.id} to={`/product/${a.id}`} style={{ textDecoration: 'none' }}>
                                        <motion.div
                                            whileHover={{ scale: 1.04 }}
                                            transition={{ duration: 0.2 }}
                                            style={{
                                                position: 'relative', borderRadius: '0.5rem',
                                                overflow: 'hidden', border: '2px solid rgba(68, 102, 255, 0.15)',
                                                cursor: 'pointer', transition: 'border-color 0.3s ease',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = '#4466FF'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(68, 102, 255, 0.15)'}
                                        >
                                            <img
                                                src={a.imageUrl || 'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?q=80&w=300'}
                                                alt={a.name}
                                                style={{
                                                    width: '100%', height: '160px', objectFit: 'cover',
                                                    filter: 'brightness(0.6) grayscale(0.3)', transition: 'all 0.35s ease',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1) grayscale(0)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(0.6) grayscale(0.3)'; }}
                                            />
                                            <div style={{
                                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                                padding: '2rem 0.65rem 0.5rem',
                                                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                                            }}>
                                                <p style={{
                                                    fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase',
                                                    letterSpacing: '0.06em', color: 'rgba(255,255,255,0.9)',
                                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                }}>{a.name}</p>
                                                {a.medals > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
                                                        <FaMedal size={9} style={{ color: '#D4F462' }} />
                                                        <span style={{ fontSize: '0.6rem', color: '#D4F462', fontWeight: '700' }}>×{a.medals}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
        </motion.div>
    );
};

export default AthleteProfile;
