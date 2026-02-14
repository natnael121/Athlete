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

  const selected = athletes[selectedIndex] || null;

  const handleKeyDown = useCallback((e) => {
    if (athletes.length === 0) return;
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev + 1) % athletes.length);
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev - 1 + athletes.length) % athletes.length);
    }
  }, [athletes.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0A0A0F',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#999'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="home-page">
      <SEO title="Home" description="Athletes showcase" />

      <style>{`
        .home-page {
          background: #0A0A0F;
          color: white;
          height: 100vh;
          overflow: hidden;
        }

        /* ===== MOBILE (TikTok Style) ===== */
        .mobile-feed {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-layout {
            display: none;
          }

          .mobile-feed {
            display: block;
            height: 100vh;
            overflow-y: scroll;
            scroll-snap-type: y mandatory;
          }

          .mobile-card {
            height: 100vh;
            position: relative;
            scroll-snap-align: start;
          }

          .mobile-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1.5rem;
            background: linear-gradient(transparent, rgba(0,0,0,0.85));
          }

          .overlay h2 {
            font-size: 1.4rem;
            font-weight: 800;
          }

          .overlay p {
            font-size: 0.8rem;
            color: rgba(255,255,255,0.7);
          }

          .cta-btn {
            margin-top: 10px;
            display: inline-block;
            background: #4466FF;
            padding: 8px 14px;
            border-radius: 6px;
            font-size: 12px;
            text-decoration: none;
            color: white;
          }
        }

        /* ===== DESKTOP (YOUR ORIGINAL STYLE) ===== */
        .desktop-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100%;
          padding: 2rem;
        }

        .left {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .right img {
          width: 100%;
          height: 80vh;
          object-fit: cover;
          border-radius: 10px;
        }
      `}</style>

      {/* ===== MOBILE TikTok FEED ===== */}
      <div className="mobile-feed">
        {athletes.map((athlete, index) => (
          <div
            key={athlete.id}
            className="mobile-card"
            onClick={() => setSelectedIndex(index)}
          >
            <img src={athlete.imageUrl} alt={athlete.name} />

            <div className="overlay">
              <h2>{athlete.name}</h2>
              <p>{athlete.category}</p>

              {athlete.medals > 0 && (
                <p><FaMedal /> {athlete.medals} medals</p>
              )}

              <Link to={`/product/${athlete.id}`} className="cta-btn">
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="desktop-layout">
        <div className="left">
          {selected && (
            <>
              <h1>{selected.name}</h1>
              <p>{selected.category}</p>

              {selected.medals > 0 && (
                <p><FaMedal /> {selected.medals} medals</p>
              )}

              <Link to={`/product/${selected.id}`} className="cta-btn">
                View Profile
              </Link>
            </>
          )}
        </div>

        <div className="right">
          {selected && (
            <img src={selected.imageUrl} alt={selected.name} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;