import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AnalyticsService = {
    logVisit: async (path) => {
        try {
            // Basic Device Detection
            const ua = navigator.userAgent;
            let deviceType = 'Desktop';
            if (/Mobi|Android/i.test(ua)) deviceType = 'Mobile';
            if (/Tablet|iPad/i.test(ua)) deviceType = 'Tablet';

            // Extract basic browser info
            let browser = 'Unknown';
            if (ua.includes('Chrome')) browser = 'Chrome';
            else if (ua.includes('Firefox')) browser = 'Firefox';
            else if (ua.includes('Safari')) browser = 'Safari';
            else if (ua.includes('Edge')) browser = 'Edge';

            // Fetch IP/Geo info (using a free public API)
            let geoData = {};
            try {
                const geoRes = await fetch('https://ipapi.co/json/');
                if (geoRes.ok) {
                    const data = await geoRes.json();
                    geoData = {
                        city: data.city,
                        country: data.country_name,
                        region: data.region,
                        ip: data.ip
                    };
                }
            } catch (e) {
                console.warn('Geo tracking blocked or failed:', e);
            }

            // Log to Firestore
            await addDoc(collection(db, 'visits'), {
                path: path || window.location.pathname,
                device: deviceType,
                browser: browser,
                referrer: document.referrer || 'Direct',
                timestamp: serverTimestamp(),
                ...geoData
            });

        } catch (error) {
            console.error('Analytics log failed:', error);
        }
    }
};

export default AnalyticsService;
