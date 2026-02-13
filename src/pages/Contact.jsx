import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import SEO from '../components/common/SEO';

const Contact = () => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    const contactInfo = [
        {
            icon: <FaMapMarkerAlt />,
            title: "Headquarters",
            lines: ["Bole Main Road, Woreda 03", "Near Alem Cinema, 7th Floor", "Addis Ababa, Ethiopia"]
        },
        {
            icon: <FaPhone />,
            title: "Phone",
            lines: ["+251 948 66 66 11", "+251 948 66 66 33", "+251 948 66 66 55"]
        },
        {
            icon: <FaEnvelope />,
            title: "Email",
            lines: ["info@ztabor.com", "mekonenworkineh6@gmail.com"]
        },
        {
            icon: <FaClock />,
            title: "Hours",
            lines: ["Mon - Fri: 8:30 AM - 6:00 PM", "Sat: 9:00 AM - 1:00 PM"]
        }
    ];

    const inputStyle = {
        padding: '0.85rem 1rem',
        borderRadius: '0.5rem',
        border: '1px solid #1a1a22',
        backgroundColor: '#111116',
        color: 'white',
        fontSize: '0.9rem',
        outline: 'none',
        width: '100%',
        transition: 'border-color 0.2s ease',
    };

    return (
        <div style={{ backgroundColor: '#0A0A0F', minHeight: '100vh', color: 'white' }}>
            <SEO
                title="Contact Us"
                description="Get in touch with us. Contact information and a message form."
            />

            {/* Hero */}
            <section style={{
                padding: '4rem 0 2rem',
                background: 'linear-gradient(180deg, #12121a 0%, #0A0A0F 100%)',
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(68,102,255,0.05) 0%, transparent 60%)',
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
                            Reach Out
                        </span>
                        <h1 style={{
                            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                            fontWeight: '900', lineHeight: 1.1, marginBottom: '1rem',
                        }}>
                            Get in <span style={{ color: '#4466FF' }}>Touch</span>
                        </h1>
                        <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto' }}>
                            Have a question or want to connect? We'd love to hear from you.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section style={{ padding: '3rem 0 5rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '3rem', alignItems: 'start' }}>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                backgroundColor: '#111116', borderRadius: '1rem',
                                padding: '2.5rem', border: '1px solid #1a1a22',
                            }}
                        >
                            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <FaPaperPlane style={{ color: '#4466FF' }} /> Send a Message
                            </h2>

                            {sent ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ textAlign: 'center', padding: '3rem 0' }}
                                >
                                    <FaCheckCircle size={48} style={{ color: '#4466FF', marginBottom: '1rem' }} />
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Message Sent!</h3>
                                    <p style={{ color: '#888' }}>We'll get back to you as soon as possible.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name</label>
                                            <input
                                                type="text" required placeholder="Your name"
                                                style={inputStyle}
                                                onFocus={e => e.target.style.borderColor = '#4466FF'}
                                                onBlur={e => e.target.style.borderColor = '#1a1a22'}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
                                            <input
                                                type="email" required placeholder="you@example.com"
                                                style={inputStyle}
                                                onFocus={e => e.target.style.borderColor = '#4466FF'}
                                                onBlur={e => e.target.style.borderColor = '#1a1a22'}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subject</label>
                                        <select
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = '#4466FF'}
                                            onBlur={e => e.target.style.borderColor = '#1a1a22'}
                                        >
                                            <option>General Inquiry</option>
                                            <option>Partnership</option>
                                            <option>Media & Press</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Message</label>
                                        <textarea
                                            rows="5" required placeholder="How can we help?"
                                            style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                                            onFocus={e => e.target.style.borderColor = '#4466FF'}
                                            onBlur={e => e.target.style.borderColor = '#1a1a22'}
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '0.9rem', borderRadius: '0.5rem',
                                            border: 'none', backgroundColor: '#4466FF',
                                            color: 'white', fontSize: '0.9rem', fontWeight: '700',
                                            cursor: 'pointer', transition: 'all 0.2s ease',
                                            letterSpacing: '0.03em',
                                        }}
                                        onMouseEnter={e => e.target.style.backgroundColor = '#3355ee'}
                                        onMouseLeave={e => e.target.style.backgroundColor = '#4466FF'}
                                    >
                                        Send Message →
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Contact Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ display: 'grid', gap: '1.25rem' }}
                        >
                            {contactInfo.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex', gap: '1.25rem', alignItems: 'start',
                                        backgroundColor: '#111116', borderRadius: '0.75rem',
                                        padding: '1.5rem', border: '1px solid #1a1a22',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(68,102,255,0.3)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a22'; }}
                                >
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '0.75rem',
                                        backgroundColor: 'rgba(68,102,255,0.1)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', color: '#4466FF',
                                        flexShrink: 0, fontSize: '1rem',
                                    }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{item.title}</h4>
                                        {item.lines.map((line, j) => (
                                            <p key={j} style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.6 }}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
