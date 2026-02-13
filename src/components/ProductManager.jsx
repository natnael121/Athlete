import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc
} from 'firebase/firestore';
import { FaImage, FaPlus, FaTimes, FaRunning, FaEdit, FaTrash, FaCheck, FaMedal, FaChevronDown, FaChevronUp, FaQrcode, FaDownload } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';

const ProductManager = ({ isDarkMode }) => {
    // Form States — Athlete fields
    const [name, setName] = useState('');
    const [subtitle, setSubtitle] = useState(''); // "Word" e.g. PASSIONATE
    const [description, setDescription] = useState('');
    const [qrOpenId, setQrOpenId] = useState(null); // Track which athlete's QR is open

    const getAthleteUrl = (athleteId) => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return `${origin}/product/${athleteId}`;
    };

    const downloadQR = (athleteId, athleteName) => {
        const canvas = document.getElementById(`qr-${athleteId}`);
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${athleteName || 'athlete'}-qr.png`;
            link.href = url;
            link.click();
        }
    };
    const [category, setCategory] = useState('Track & Field');
    const [dimensions, setDimensions] = useState(''); // Height
    const [hometown, setHometown] = useState('');
    const [birthday, setBirthday] = useState('');
    const [college, setCollege] = useState('');
    const [medals, setMedals] = useState('');
    const [favoriteSubject, setFavoriteSubject] = useState('');
    const [firstJob, setFirstJob] = useState('');
    const [favoriteBreakfast, setFavoriteBreakfast] = useState('');
    const [favoriteRestaurant, setFavoriteRestaurant] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Timeline management
    const [timeline, setTimeline] = useState([]);
    const [showTimelineForm, setShowTimelineForm] = useState(false);
    const [tlYear, setTlYear] = useState('');
    const [tlTitle, setTlTitle] = useState('');
    const [tlDescription, setTlDescription] = useState('');
    const [tlImage, setTlImage] = useState('');

    // Management States
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const theme = {
        bg: isDarkMode ? '#1F2937' : '#FFFFFF',
        cardBg: isDarkMode ? '#374151' : '#F9FAFB',
        text: isDarkMode ? '#F9FAFB' : '#111827',
        textMuted: isDarkMode ? '#9CA3AF' : '#6B7280',
        border: isDarkMode ? '#4B5563' : '#E5E7EB',
        inputBg: isDarkMode ? '#374151' : '#FFFFFF',
        accent: '#D4F462',
    };

    // Fetch Products
    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const prods = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(prods);
        });
        return () => unsubscribe();
    }, []);

    const inputStyle = {
        padding: '0.85rem 1rem',
        borderRadius: '0.75rem',
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.inputBg,
        color: theme.text,
        fontSize: '0.9rem',
        transition: 'border-color 0.2s ease',
        outline: 'none',
        width: '100%',
    };

    const labelStyle = {
        fontSize: '0.8rem',
        fontWeight: '700',
        color: theme.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '0.4rem',
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const addTimelineItem = () => {
        if (tlYear && tlTitle) {
            setTimeline([...timeline, { year: tlYear, title: tlTitle, description: tlDescription, image: tlImage || null }]);
            setTlYear(''); setTlTitle(''); setTlDescription(''); setTlImage('');
            setShowTimelineForm(false);
        }
    };

    const removeTimelineItem = (index) => {
        setTimeline(timeline.filter((_, i) => i !== index));
    };

    const uploadImageToImgBB = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (data.success) return data.data.url;
        throw new Error('Image upload failed');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let imageUrl = previewUrl;
            if (imageFile) {
                setMessage('Uploading image...');
                imageUrl = await uploadImageToImgBB(imageFile);
            }

            const athleteData = {
                name, subtitle, description, category, dimensions, hometown, birthday, college,
                medals: medals ? parseInt(medals) : 0,
                favoriteSubject, firstJob, favoriteBreakfast, favoriteRestaurant,
                imageUrl, timeline, updatedAt: serverTimestamp()
            };

            if (editingId) {
                setMessage('Updating athlete...');
                await updateDoc(doc(db, 'products', editingId), athleteData);
                setMessage('Athlete updated successfully!');
            } else {
                setMessage('Adding athlete...');
                await addDoc(collection(db, 'products'), {
                    ...athleteData, createdAt: serverTimestamp()
                });
                setMessage('Athlete added successfully!');
            }
            resetForm();
        } catch (error) {
            console.error(error);
            setMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName(''); setSubtitle(''); setDescription('');
        setDimensions(''); setCategory('Track & Field');
        setHometown(''); setBirthday(''); setCollege('');
        setMedals(''); setFavoriteSubject(''); setFirstJob('');
        setFavoriteBreakfast(''); setFavoriteRestaurant('');
        setImageFile(null); setPreviewUrl('');
        setEditingId(null); setTimeline([]);
    };

    const handleEdit = (prod) => {
        setEditingId(prod.id);
        setName(prod.name || '');
        setSubtitle(prod.subtitle || '');
        setDescription(prod.description || '');
        setCategory(prod.category || 'Track & Field');
        setDimensions(prod.dimensions || '');
        setHometown(prod.hometown || '');
        setBirthday(prod.birthday || '');
        setCollege(prod.college || '');
        setMedals(prod.medals ? String(prod.medals) : '');
        setFavoriteSubject(prod.favoriteSubject || '');
        setFirstJob(prod.firstJob || '');
        setFavoriteBreakfast(prod.favoriteBreakfast || '');
        setFavoriteRestaurant(prod.favoriteRestaurant || '');
        setPreviewUrl(prod.imageUrl || '');
        setTimeline(prod.timeline || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this athlete?')) {
            try {
                await deleteDoc(doc(db, 'products', id));
                setMessage('Athlete removed successfully.');
            } catch (error) {
                console.error(error);
                setMessage('Error removing athlete.');
            }
        }
    };

    const handleLoadDemoData = async () => {
        if (!window.confirm('This will add 15 demo athletes to your database. Continue?')) return;
        setLoading(true);
        setMessage('Loading 15 demo athletes...');

        const demoAthletes = [
            {
                name: "Solomon Barega", subtitle: "DETERMINED", category: "Track & Field",
                dimensions: "1.76m", hometown: "Gurage", birthday: "Jan 1, 2000", college: "N/A", medals: 1,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Solomon_Barega_Doha_2019.jpg/600px-Solomon_Barega_Doha_2019.jpg",
                description: "Olympic champion in the 10,000 meters at the 2020 Tokyo Olympics. A fierce competitor known for his finishing kick.",
                timeline: [{ year: "2021", title: "Olympic Gold", description: "Won gold in 10,000m at Tokyo Olympics" }]
            },
            {
                name: "Fatuma Roba", subtitle: "PIONEER", category: "Marathon",
                dimensions: "1.65m", hometown: "Arsi", birthday: "Dec 18, 1973", college: "N/A", medals: 1,
                imageUrl: "https://i.pinimg.com/736x/82/06/61/82066160356c92d52cf46820560879ee.jpg",
                description: "The first African woman to win a gold medal in the women's Olympic marathon (Atlanta 1996).",
                timeline: [{ year: "1996", title: "Olympic Gold", description: "Historic marathon victory in Atlanta" }]
            },
            {
                name: "Million Wolde", subtitle: "SURPRISE", category: "Track & Field",
                dimensions: "1.70m", hometown: "Addis Ababa", birthday: "Mar 17, 1979", college: "N/A", medals: 1,
                imageUrl: "https://c8.alamy.com/comp/G4ER3R/million-wolde-eth-edmonton-2001-G4ER3R.jpg",
                description: "Gold medalist in the 5000 meters at the 2000 Sydney Olympics.",
                timeline: [{ year: "2000", title: "Olympic Gold", description: "Won the 5000m final in Sydney" }]
            },
            {
                name: "Gezehagn Abera", subtitle: "CONSISTENT", category: "Marathon",
                dimensions: "1.68m", hometown: "Etya", birthday: "Apr 23, 1978", college: "N/A", medals: 1,
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh3Jb6qX0r7yR5k8z1pW2gX6l9j4u3t2e1sA&s",
                description: "Marathon gold medalist at the 2000 Sydney Olympics and 2001 World Championships.",
                timeline: [{ year: "2000", title: "Olympic Gold", description: "Sydney Marathon Champion" }]
            },
            {
                name: "Mamo Wolde", subtitle: "LEGACY", category: "Marathon",
                dimensions: "1.70m", hometown: "Dire Jila", birthday: "Jun 12, 1932", college: "N/A", medals: 2,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Mamo_Wolde_1968.jpg",
                description: "Kept the Ethiopian marathon legacy alive by winning Gold in Mexico City 1968, succeeding Abebe Bikila.",
                timeline: [{ year: "1968", title: "Olympic Gold", description: "Marathon champion in Mexico City" }]
            },
            {
                name: "Abebe Bikila", subtitle: "LEGEND", category: "Marathon",
                dimensions: "1.77m", hometown: "Shewa", birthday: "Aug 7, 1932", college: "Imperial Guard", medals: 2,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Abebe_Bikila_1960_Rome_Olympics.jpg",
                description: "The first black African Olympic gold medalist. Famously won the 1960 Rome marathon barefoot, then won again in Tokyo 1964.",
                timeline: [
                    { year: "1960", title: "Barefoot Gold", description: "Won Rome Marathon barefoot" },
                    { year: "1964", title: "Tokyo Gold", description: "Defended title with world record" }
                ]
            },
            {
                name: "Tamirat Tola", subtitle: "RESILIENT", category: "Marathon",
                dimensions: "1.80m", hometown: "Oromia", birthday: "Aug 11, 1991", college: "N/A", medals: 2,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Tamirat_Tola_Rio_2016.jpg/800px-Tamirat_Tola_Rio_2016.jpg",
                description: "World Champion and Olympic Medalist. Known for his incredible endurance and 2024 Olympic Record.",
                timeline: [
                    { year: "2022", title: "World Champion", description: "Gold at World Championships" },
                    { year: "2024", title: "Olympic Gold", description: "Paris Marathon Gold (OR)" }
                ]
            },
            {
                name: "Derartu Tulu", subtitle: "ICON", category: "Track & Field",
                dimensions: "1.60m", hometown: "Bekoji", birthday: "Mar 21, 1972", college: "N/A", medals: 2,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/62/Derartu_Tulu.jpg",
                description: "The first black African woman to win an Olympic gold medal (1992). Two-time Olympic 10,000m champion.",
                timeline: [
                    { year: "1992", title: "First Gold", description: "Historic 10,000m win in Barcelona" },
                    { year: "2000", title: "Second Gold", description: "Reclaimed title in Sydney" }
                ]
            },
            {
                name: "Tiki Gelana", subtitle: "SPEED", category: "Marathon",
                dimensions: "1.65m", hometown: "Bekoji", birthday: "Oct 22, 1987", college: "N/A", medals: 1,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Tiki_Gelana_London_2012.jpg",
                description: "Olympic Marathon Champion at London 2012, setting a new Olympic Record.",
                timeline: [{ year: "2012", title: "Olympic Gold", description: "London Marathon Champion (OR)" }]
            },
            {
                name: "Miruts Yifter", subtitle: "SHIFTER", category: "Track & Field",
                dimensions: "1.62m", hometown: "Adigrat", birthday: "May 15, 1944", college: "N/A", medals: 2,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Miruts_Yifter_1980.jpg",
                description: "Known as 'Yifter the Shifter' for his devastating kick. Double gold medalist (5k & 10k) in Moscow 1980.",
                timeline: [
                    { year: "1980", title: "Double Gold", description: "Won both 5000m and 10000m in Moscow" }
                ]
            },
            {
                name: "Almaz Ayana", subtitle: "UNSTOPPABLE", category: "Track & Field",
                dimensions: "1.66m", hometown: "Benishangul", birthday: "Nov 21, 1991", college: "N/A", medals: 2,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Almaz_Ayana_Rio_2016.jpg/600px-Almaz_Ayana_Rio_2016.jpg",
                description: "Smashed the 10,000m World Record to win Gold at Rio 2016 by a massive margin.",
                timeline: [{ year: "2016", title: "World Record Gold", description: "Rio 10,000m Champion in WR time" }]
            },
            {
                name: "Haile Gebrselassie", subtitle: "EMPEROR", category: "Track & Field",
                dimensions: "1.64m", hometown: "Asella", birthday: "Apr 18, 1973", college: "N/A", medals: 2,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Haile_Gebrselassie.jpg/800px-Haile_Gebrselassie.jpg",
                description: "Regarded as one of the greatest distance runners of all time. Two-time Olympic 10,000m champion.",
                timeline: [
                    { year: "1996", title: "Atlanta Gold", description: "10,000m Olympic Champion" },
                    { year: "2000", title: "Sydney Gold", description: "Retained 10,000m title" }
                ]
            },
            {
                name: "Tirunesh Dibaba", subtitle: "DESTROYER", category: "Track & Field",
                dimensions: "1.66m", hometown: "Bekoji", birthday: "Jun 1, 1985", college: "N/A", medals: 3,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Tirunesh_Dibaba_Beijing_2008.jpg/600px-Tirunesh_Dibaba_Beijing_2008.jpg",
                description: "The 'Baby Faced Destroyer'. Three-time Olympic gold medalist and 5000m world record holder.",
                timeline: [
                    { year: "2008", title: "Double Gold", description: "Won 5000m and 10000m in Beijing" },
                    { year: "2012", title: "London Gold", description: "Defended 10000m title" }
                ]
            },
            {
                name: "Meseret Defar", subtitle: "ELEGANT", category: "Track & Field",
                dimensions: "1.55m", hometown: "Addis Ababa", birthday: "Nov 19, 1983", college: "N/A", medals: 2,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Meseret_Defar_London_2012.jpg/600px-Meseret_Defar_London_2012.jpg",
                description: "Two-time Olympic 5000m champion known for her tactical brilliance and finishing speed.",
                timeline: [
                    { year: "2004", title: "Athens Gold", description: "5000m Olympic Champion" },
                    { year: "2012", title: "London Gold", description: "Reclaimed 5000m title" }
                ]
            },
            {
                name: "Kenenisa Bekele", subtitle: "GOAT", category: "Track & Field",
                dimensions: "1.67m", hometown: "Bekoji", birthday: "Jun 13, 1982", college: "N/A", medals: 3,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Kenenisa_Bekele_Berlin_2009.jpg/600px-Kenenisa_Bekele_Berlin_2009.jpg",
                description: "The second most gold medals in Olympic 5000m/10000m history. World Record holder for many years.",
                timeline: [
                    { year: "2004", title: "Athens Gold", description: "10,000m Champion" },
                    { year: "2008", title: "Double Gold", description: "5000m & 10000m Champion in Beijing" }
                ]
            }
        ];

        try {
            const batchPromises = demoAthletes.map(athlete => {
                return addDoc(collection(db, 'products'), {
                    ...athlete,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            });
            await Promise.all(batchPromises);
            setMessage('Success! 15 Athletes Added.');
        } catch (e) {
            console.error(e);
            setMessage('Error adding demo data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Form Card */}
            <div style={{
                backgroundColor: theme.bg,
                borderRadius: '1rem',
                padding: '2.5rem',
                border: `1px solid ${theme.border}`,
                boxShadow: '0 4px 6px rgba(0,0,0,0.04)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: theme.text,
                        margin: 0
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FaRunning style={{ color: '#D4F462' }} /> {editingId ? 'Edit Athlete' : 'Add New Athlete'}
                        </span>
                    </h3>

                    <button
                        type="button"
                        onClick={handleLoadDemoData}
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: '#3B82F6',
                            backgroundColor: 'rgba(59,130,246,0.1)',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(59,130,246,0.2)',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <FaPlus size={10} /> Load Demo Athletes
                    </button>

                    {editingId && (
                        <button onClick={resetForm} style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel Edit</button>
                    )}
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Section: Basic Info */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#D4F462', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                            Basic Information
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Athlete Name *</label>
                                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Sanya Richards-Ross" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Defining Word *</label>
                                <input type="text" required value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                                    placeholder="e.g. PASSIONATE, FIERCE, LEGEND" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Sport / Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                                    <option>Track & Field</option>
                                    <option>Marathon</option>
                                    <option>Cross Country</option>
                                    <option>Swimming</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Height</label>
                                <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)}
                                    placeholder="e.g. 5'8&quot; or 172 cm" style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Section: Personal Details */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#D4F462', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                            Personal Details
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Hometown</label>
                                <input type="text" value={hometown} onChange={(e) => setHometown(e.target.value)}
                                    placeholder="e.g. Austin, TX" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Birthday</label>
                                <input type="text" value={birthday} onChange={(e) => setBirthday(e.target.value)}
                                    placeholder="e.g. February 26, 1985" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>College / School</label>
                                <input type="text" value={college} onChange={(e) => setCollege(e.target.value)}
                                    placeholder="e.g. University of Texas" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Olympic Medals</label>
                                <input type="number" value={medals} onChange={(e) => setMedals(e.target.value)}
                                    placeholder="e.g. 3" style={inputStyle} min="0" />
                            </div>
                        </div>
                    </div>

                    {/* Section: Fun Facts */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#D4F462', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                            Fun Facts
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Favorite Subject</label>
                                <input type="text" value={favoriteSubject} onChange={(e) => setFavoriteSubject(e.target.value)}
                                    placeholder="e.g. Math" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>First Job</label>
                                <input type="text" value={firstJob} onChange={(e) => setFirstJob(e.target.value)}
                                    placeholder="e.g. Professional Athlete" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Favorite Breakfast</label>
                                <input type="text" value={favoriteBreakfast} onChange={(e) => setFavoriteBreakfast(e.target.value)}
                                    placeholder="e.g. Eggs, Cereal or Waffles" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={labelStyle}>Favorite Restaurant Type</label>
                                <input type="text" value={favoriteRestaurant} onChange={(e) => setFavoriteRestaurant(e.target.value)}
                                    placeholder="e.g. Jamaican" style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Section: Profile Image */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#D4F462', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                            Profile Photo
                        </h4>
                        <div
                            style={{
                                border: `2px dashed ${theme.border}`,
                                borderRadius: '1rem',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: theme.cardBg,
                                transition: 'border-color 0.2s ease',
                            }}
                            onClick={() => document.getElementById('product-image').click()}
                        >
                            {previewUrl ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={previewUrl} alt="Preview" style={{ width: '160px', height: '200px', objectFit: 'cover', borderRadius: '0.75rem', margin: '0 auto' }} />
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setPreviewUrl(''); setImageFile(null); }}
                                        style={{ position: 'absolute', top: '-8px', right: 'calc(50% - 88px)', backgroundColor: '#EF4444', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ color: theme.textMuted }}>
                                    <FaImage size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
                                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Upload Athlete Photo</p>
                                    <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.6 }}>Click to browse or drag & drop</p>
                                </div>
                            )}
                            <input type="file" id="product-image" hidden accept="image/*" onChange={handleImageChange} />
                        </div>
                    </div>

                    {/* Section: Bio / Description */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#D4F462', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}` }}>
                            Biography
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={labelStyle}>Bio / Description</label>
                            <textarea rows="4" required value={description} onChange={(e) => setDescription(e.target.value)}
                                placeholder="Write a short biography for this athlete..."
                                style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}></textarea>
                        </div>
                    </div>

                    {/* Section: Timeline / Achievements */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#D4F462', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            Timeline / Key Achievements
                            <button type="button" onClick={() => setShowTimelineForm(!showTimelineForm)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '700', color: '#D4F462', backgroundColor: 'rgba(212,244,98,0.1)', border: '1px solid rgba(212,244,98,0.2)', padding: '0.4rem 0.8rem', borderRadius: '2rem', cursor: 'pointer' }}>
                                <FaPlus size={10} /> Add Event
                            </button>
                        </h4>

                        {/* Existing Timeline Items */}
                        {timeline.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                {timeline.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '0.75rem 1rem',
                                        backgroundColor: theme.cardBg,
                                        borderRadius: '0.75rem',
                                        border: `1px solid ${theme.border}`,
                                    }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '0.5rem', backgroundColor: 'rgba(212,244,98,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span style={{ fontWeight: '800', fontSize: '0.8rem', color: '#D4F462' }}>{item.year}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h5 style={{ fontWeight: '700', fontSize: '0.9rem', color: theme.text }}>{item.title}</h5>
                                            <p style={{ fontSize: '0.75rem', color: theme.textMuted }}>{item.description?.substring(0, 80)}...</p>
                                        </div>
                                        <button type="button" onClick={() => removeTimelineItem(idx)}
                                            style={{ color: '#EF4444', padding: '0.5rem', flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add Timeline Item Form */}
                        {showTimelineForm && (
                            <div style={{
                                padding: '1.5rem',
                                backgroundColor: theme.cardBg,
                                borderRadius: '0.75rem',
                                border: `1px solid ${theme.border}`,
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={labelStyle}>Year</label>
                                        <input type="text" value={tlYear} onChange={(e) => setTlYear(e.target.value)}
                                            placeholder="e.g. 2012" style={inputStyle} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={labelStyle}>Achievement Title</label>
                                        <input type="text" value={tlTitle} onChange={(e) => setTlTitle(e.target.value)}
                                            placeholder="e.g. Olympic Gold Medal" style={inputStyle} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Description</label>
                                    <textarea rows="2" value={tlDescription} onChange={(e) => setTlDescription(e.target.value)}
                                        placeholder="Short description of this achievement..." style={{ ...inputStyle, resize: 'none' }}></textarea>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                                    <label style={labelStyle}>Image URL (optional)</label>
                                    <input type="url" value={tlImage} onChange={(e) => setTlImage(e.target.value)}
                                        placeholder="https://example.com/image.jpg" style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowTimelineForm(false)}
                                        style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem', border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: '0.85rem', fontWeight: '600', backgroundColor: 'transparent', cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                    <button type="button" onClick={addTimelineItem}
                                        style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#D4F462', color: '#111', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}>
                                        Add Achievement
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div>
                        {message && (
                            <div style={{
                                padding: '0.85rem',
                                borderRadius: '0.75rem',
                                backgroundColor: message.includes('success') || message.includes('Loading') ? '#ECFDF5' : '#FEF2F2',
                                color: message.includes('success') || message.includes('Loading') ? '#065F46' : '#991B1B',
                                fontSize: '0.85rem',
                                textAlign: 'center',
                                marginBottom: '1rem',
                                fontWeight: '600'
                            }}>
                                {message}
                            </div>
                        )}
                        <button type="submit" disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                backgroundColor: loading ? '#999' : '#D4F462',
                                color: '#111',
                                fontSize: '0.95rem',
                                fontWeight: '800',
                                letterSpacing: '0.02em',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                            }}>
                            {loading ? 'Processing...' : (editingId ? '✏️ Update Athlete Profile' : '🏅 Add Athlete to Roster')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Athlete List Card */}
            <div style={{
                backgroundColor: theme.bg,
                borderRadius: '1rem',
                padding: '2.5rem',
                marginTop: '2rem',
                border: `1px solid ${theme.border}`,
                boxShadow: '0 4px 6px rgba(0,0,0,0.04)'
            }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '2rem', color: theme.text, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FaMedal style={{ color: '#D4F462' }} /> Athlete Roster ({products.length})
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {products.length === 0 ? (
                        <p style={{ color: theme.textMuted, fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>No athletes in the roster yet. Add one above!</p>
                    ) : (
                        products.map(prod => (
                            <div key={prod.id} style={{
                                display: 'flex', flexWrap: 'wrap', gap: '1.25rem',
                                padding: '1.25rem',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '0.75rem',
                                alignItems: 'center',
                                backgroundColor: theme.cardBg,
                                transition: 'all 0.2s ease',
                            }}>
                                <div style={{ width: '64px', height: '80px', backgroundColor: '#333', borderRadius: '0.5rem', overflow: 'hidden', flexShrink: 0 }}>
                                    {prod.imageUrl && <img src={prod.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem', color: theme.text }}>{prod.name}</h4>
                                    <div style={{ fontSize: '0.75rem', color: theme.textMuted, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        {prod.subtitle && <span style={{ fontWeight: '700', color: '#D4F462' }}>{prod.subtitle}</span>}
                                        {prod.category && <span>• {prod.category}</span>}
                                        {prod.hometown && <span>• {prod.hometown}</span>}
                                        {prod.medals > 0 && <span>• 🏅 ×{prod.medals}</span>}
                                    </div>
                                    {prod.timeline && prod.timeline.length > 0 && (
                                        <div style={{ fontSize: '0.7rem', color: theme.textMuted, marginTop: '0.3rem' }}>
                                            {prod.timeline.length} timeline event{prod.timeline.length !== 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                    <button onClick={() => setQrOpenId(qrOpenId === prod.id ? null : prod.id)} style={{
                                        color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        fontSize: '0.8rem', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: qrOpenId === prod.id ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)', border: 'none', cursor: 'pointer'
                                    }}>
                                        <FaQrcode size={12} /> QR
                                    </button>
                                    <button onClick={() => handleEdit(prod)} style={{
                                        color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        fontSize: '0.8rem', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: 'rgba(59,130,246,0.08)', border: 'none', cursor: 'pointer'
                                    }}>
                                        <FaEdit size={12} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(prod.id)} style={{
                                        color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        fontSize: '0.8rem', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                                        backgroundColor: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer'
                                    }}>
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                                {/* QR Code Panel */}
                                {qrOpenId === prod.id && (
                                    <div style={{
                                        width: '100%',
                                        display: 'flex', alignItems: 'center', gap: '1.5rem',
                                        marginTop: '0.75rem', padding: '1.25rem',
                                        backgroundColor: isDarkMode ? '#1a1a2e' : '#F5F3FF',
                                        borderRadius: '0.75rem',
                                        border: `1px solid ${isDarkMode ? '#2a2a4a' : '#DDD6FE'}`,
                                    }}>
                                        <div style={{ padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.75rem', flexShrink: 0 }}>
                                            <QRCodeCanvas
                                                id={`qr-${prod.id}`}
                                                value={getAthleteUrl(prod.id)}
                                                size={120}
                                                bgColor="#FFFFFF"
                                                fgColor="#111111"
                                                level="H"
                                                includeMargin={false}
                                            />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h5 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.3rem', color: theme.text }}>
                                                QR Code — {prod.name}
                                            </h5>
                                            <p style={{ fontSize: '0.7rem', color: theme.textMuted, marginBottom: '0.75rem', lineHeight: 1.5 }}>
                                                Scan this QR code to open this athlete's profile page directly.
                                            </p>
                                            <div style={{
                                                fontSize: '0.65rem', color: theme.textMuted, marginBottom: '0.75rem',
                                                padding: '0.4rem 0.6rem', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                                borderRadius: '0.3rem', wordBreak: 'break-all',
                                                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`
                                            }}>
                                                {getAthleteUrl(prod.id)}
                                            </div>
                                            <button onClick={() => downloadQR(prod.id, prod.name)} style={{
                                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                padding: '0.5rem 1rem', backgroundColor: '#8B5CF6', color: 'white',
                                                borderRadius: '0.35rem', fontSize: '0.75rem', fontWeight: '700',
                                                border: 'none', cursor: 'pointer',
                                            }}>
                                                <FaDownload size={11} /> Download PNG
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManager;
