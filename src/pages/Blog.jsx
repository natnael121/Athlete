import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/common/SEO';
import { FaCalendarAlt, FaUser, FaChevronRight, FaNewspaper } from 'react-icons/fa';

const Blog = () => {
    const [newsPosts, setNewsPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNewsPosts(posts);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getPlaceholder = (category) => {
        const cat = category?.toUpperCase();
        if (cat?.includes('SPORT')) return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80';
        if (cat?.includes('EVENT')) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
        return 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&w=800&q=80';
    };

    const allPosts = newsPosts.length > 0 ? newsPosts : [
        {
            id: 'p1',
            title: "Ethiopian Athletes Dominate World Championships",
            category: "SPORTS",
            author: "Admin",
            date: "FEB 10, 2026",
            imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
            excerpt: "Ethiopian distance runners continue their legendary dominance at the World Athletics Championships, bringing home multiple gold medals and setting new records."
        },
        {
            id: 'p2',
            title: "New Training Facility Opens in Bekoji",
            category: "FACILITIES",
            author: "Admin",
            date: "JAN 28, 2026",
            imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
            excerpt: "A state-of-the-art high-altitude training center opens in Bekoji, the legendary birthplace of Ethiopian champions."
        },
        {
            id: 'p3',
            title: "Youth Athletics Program Launches Nationwide",
            category: "EVENTS",
            date: "JAN 20, 2026",
            excerpt: "A new initiative aims to discover and develop the next generation of Ethiopian running talent across all regions."
        }
    ];

    const featuredPost = selectedPost || allPosts[0];
    const otherPosts = allPosts.filter(p => p.id !== featuredPost?.id);

    return (
        <div style={{ backgroundColor: '#0A0A0F', minHeight: '100vh', color: 'white' }}>
            <SEO
                title={selectedPost ? selectedPost.title : "News"}
                description="Stay updated with the latest news and updates."
            />

            <style>{`
                .blog-featured-article {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 3rem;
                    margin-bottom: 4rem;
                    background-color: #111116;
                    border-radius: 1rem;
                    overflow: hidden;
                    border: 1px solid #1a1a22;
                }
                .blog-posts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }
                .about-featured-content {
                    padding: 2.5rem 2.5rem 2.5rem 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                @media (max-width: 900px) {
                    .blog-featured-article {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }
                    .blog-featured-image {
                        height: 300px !important;
                    }
                    .about-featured-content {
                        padding: 2rem !important;
                    }
                    .blog-posts-grid {
                        grid-template-columns: 1fr;
                    }
                    h1 { font-size: 2.5rem !important; }
                }
            `}</style>

            {/* Hero Header */}
            <section style={{
                padding: '3rem 0 2rem',
                background: 'linear-gradient(180deg, #12121a 0%, #0A0A0F 100%)',
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(circle at 70% 30%, rgba(68,102,255,0.06) 0%, transparent 60%)',
                }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                        <span style={{
                            display: 'inline-block', padding: '0.4rem 1.25rem',
                            backgroundColor: 'rgba(68,102,255,0.1)', color: '#4466FF',
                            borderRadius: '2rem', fontWeight: '600', fontSize: '0.8rem',
                            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem',
                            border: '1px solid rgba(68,102,255,0.15)'
                        }}>
                            Latest Updates
                        </span>
                        <h1 style={{
                            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                            fontWeight: '900', lineHeight: 1.1, marginBottom: '1rem',
                        }}>
                            News & <span style={{ color: '#4466FF' }}>Stories</span>
                        </h1>
                        <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto' }}>
                            The latest updates, events, and stories from the world of athletics.
                        </p>
                    </motion.div>
                </div>
            </section>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#555' }}>Loading news...</div>
            ) : (
                <section style={{ padding: '3rem 0 5rem' }}>
                    <div className="container">

                        {/* Featured Post */}
                        {featuredPost && (
                            <AnimatePresence mode="wait">
                                <motion.article
                                    key={featuredPost.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="blog-featured-article"
                                >
                                    <div className="blog-featured-image" style={{ height: '400px', overflow: 'hidden' }}>
                                        <img
                                            src={featuredPost.imageUrl || getPlaceholder(featuredPost.category)}
                                            alt={featuredPost.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="about-featured-content">
                                        <span style={{
                                            display: 'inline-block', width: 'fit-content',
                                            padding: '0.3rem 0.8rem', backgroundColor: 'rgba(68,102,255,0.12)',
                                            color: '#4466FF', borderRadius: '4px', fontSize: '0.7rem',
                                            fontWeight: '700', letterSpacing: '0.1em', marginBottom: '1.25rem',
                                        }}>
                                            {featuredPost.category || 'NEWS'}
                                        </span>
                                        <h2 style={{
                                            fontSize: '1.75rem', fontWeight: '800',
                                            fontFamily: 'var(--font-heading)', lineHeight: 1.2,
                                            marginBottom: '1rem',
                                        }}>
                                            {featuredPost.title}
                                        </h2>
                                        <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                                            {featuredPost.excerpt}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: '#555' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <FaUser size={10} /> {featuredPost.author || 'Admin'}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <FaCalendarAlt size={10} /> {featuredPost.date || 'Recent'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            </AnimatePresence>
                        )}

                        {/* Other Posts Grid */}
                        {otherPosts.length > 0 && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                    <FaNewspaper style={{ color: '#4466FF' }} />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>More Stories</h3>
                                    <div style={{ flex: 1, height: '1px', backgroundColor: '#1a1a22' }}></div>
                                </div>
                                <div className="blog-posts-grid">
                                    {otherPosts.map((post, idx) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.08 }}
                                            onClick={() => { setSelectedPost(post); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            style={{
                                                backgroundColor: '#111116', borderRadius: '0.75rem',
                                                overflow: 'hidden', border: '1px solid #1a1a22',
                                                cursor: 'pointer', transition: 'all 0.3s ease',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.borderColor = 'rgba(68,102,255,0.3)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.borderColor = '#1a1a22';
                                            }}
                                        >
                                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                                <img
                                                    src={post.imageUrl || getPlaceholder(post.category)}
                                                    alt={post.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                                />
                                            </div>
                                            <div style={{ padding: '1.5rem' }}>
                                                <span style={{
                                                    fontSize: '0.65rem', fontWeight: '700',
                                                    color: '#4466FF', letterSpacing: '0.1em',
                                                    textTransform: 'uppercase', marginBottom: '0.5rem',
                                                    display: 'block',
                                                }}>
                                                    {post.category || 'NEWS'}
                                                </span>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                                                    {post.title}
                                                </h4>
                                                <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {post.excerpt}
                                                </p>
                                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4466FF', fontSize: '0.8rem', fontWeight: '600' }}>
                                                    Read More <FaChevronRight size={10} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}

                        {allPosts.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#555' }}>
                                <FaNewspaper size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                <p>No news posts yet. Add them via Admin Dashboard.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Blog;
