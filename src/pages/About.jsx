import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { FaHeart, FaHandshake, FaUsers, FaStar, FaGlobeAfrica, FaShieldAlt, FaTrophy, FaQuoteLeft } from 'react-icons/fa';

const About = () => {
    const team = [
        {
            name: "Mr. Solomon Awoke",
            role: "Co-Founder & Managing Director",
            desc: "Bahir Dar University Graduate. 10+ years in wholesale distribution. Financial management expert.",
            icon: <FaStar />
        },
        {
            name: "Mr. Dagmawi Buzuneh",
            role: "Co-Founder & Deputy Manager",
            desc: "10+ years in import-export business. Specialist in sports management and international relations.",
            icon: <FaGlobeAfrica />
        }
    ];

    const values = [
        { title: "Loyalty", text: "Steadfast commitment to our athletes and mission.", icon: <FaHeart /> },
        { title: "Respect", text: "Dignity and fairness in all relationships.", icon: <FaHandshake /> },
        { title: "Teamwork", text: "Collective efforts for greater achievements.", icon: <FaUsers /> },
        { title: "Excellence", text: "Pushing limits in everything we do.", icon: <FaTrophy /> },
        { title: "Integrity", text: "Sustainable and ethical practices always.", icon: <FaShieldAlt /> },
        { title: "Diversity", text: "Inclusive environment driving innovation.", icon: <FaGlobeAfrica /> }
    ];

    const stats = [
        { number: "15+", label: "Olympic Champions" },
        { number: "30+", label: "Gold Medals" },
        { number: "50+", label: "Years of Legacy" },
        { number: "1M+", label: "Fans Worldwide" },
    ];

    return (
        <div style={{ backgroundColor: '#0A0A0F', minHeight: '100vh', color: 'white' }}>
            <SEO
                title="About Us"
                description="Learn about our mission, leadership, and commitment to celebrating Ethiopian athletic excellence."
            />

            {/* Hero */}
            <section style={{
                padding: '4rem 0 3rem',
                background: 'linear-gradient(180deg, #12121a 0%, #0A0A0F 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(circle at 20% 60%, rgba(68,102,255,0.06) 0%, transparent 60%)',
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
                            Our Story
                        </span>
                        <h1 style={{
                            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                            fontWeight: '900', lineHeight: 1.1, marginBottom: '1.5rem',
                        }}>
                            Celebrating Ethiopian<br /><span style={{ color: '#4466FF' }}>Athletic Legacy</span>
                        </h1>
                        <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
                            We honor the extraordinary achievements of Ethiopia's world-class distance runners
                            and preserve their legacy for future generations.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <section style={{ padding: '3rem 0', borderTop: '1px solid #1a1a22', borderBottom: '1px solid #1a1a22' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#4466FF', fontFamily: 'var(--font-heading)' }}>
                                    {stat.number}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div style={{ borderRadius: '1rem', overflow: 'hidden', height: '400px', border: '1px solid #1a1a22' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80"
                                    alt="Athletics"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }}
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>
                                Our <span style={{ color: '#4466FF' }}>Mission</span>
                            </h2>
                            <p style={{ color: '#888', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1rem' }}>
                                We are dedicated to showcasing the incredible talent and stories of Ethiopian athletes
                                who have transformed the landscape of distance running on the world stage.
                            </p>
                            <p style={{ color: '#888', lineHeight: 1.8, fontSize: '1rem' }}>
                                From Abebe Bikila's barefoot marathon victory in 1960 to the modern champions
                                who continue to break records, Ethiopia's athletic legacy is unparalleled.
                            </p>
                            <div style={{ marginTop: '2rem', borderLeft: '2px solid #4466FF', paddingLeft: '1.5rem' }}>
                                <FaQuoteLeft style={{ color: '#4466FF', marginBottom: '0.5rem' }} />
                                <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.7 }}>
                                    "The distance runner is the purest form of athlete — it's just you against yourself and the road ahead."
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section style={{ padding: '5rem 0', backgroundColor: '#050508' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                            Our <span style={{ color: '#4466FF' }}>Leadership</span>
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                        {team.map((person, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                style={{
                                    backgroundColor: '#111116', borderRadius: '1rem',
                                    padding: '2.5rem', border: '1px solid #1a1a22',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(68,102,255,0.3)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a22'; }}
                            >
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '0.75rem',
                                    backgroundColor: 'rgba(68,102,255,0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', color: '#4466FF',
                                    fontSize: '1.2rem', marginBottom: '1.5rem',
                                }}>
                                    {person.icon}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{person.name}</h3>
                                <p style={{ color: '#4466FF', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '1rem' }}>{person.role}</p>
                                <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6 }}>{person.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section style={{ padding: '5rem 0' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                            Core <span style={{ color: '#4466FF' }}>Values</span>
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
                        {values.map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                style={{
                                    backgroundColor: '#111116', borderRadius: '0.75rem',
                                    padding: '2rem', textAlign: 'center',
                                    border: '1px solid #1a1a22',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(68,102,255,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a22'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '0.75rem',
                                    backgroundColor: 'rgba(68,102,255,0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', color: '#4466FF',
                                    margin: '0 auto 1rem', fontSize: '1.1rem',
                                }}>
                                    {v.icon}
                                </div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{v.title}</h4>
                                <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.6 }}>{v.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
