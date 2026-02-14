import { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteName = "Ethiopian Olympic Champions Showcase";

    const fullTitle = title
        ? `${title} | ${siteName}`
        : `${siteName} - Celebrating Ethiopia’s Greatest Olympic Legends`;

    const metaDescription =
        description ||
        "Discover Ethiopia’s Olympic champions, legendary athletes, and historic victories. A tribute to greatness, endurance, and national pride.";

    const metaKeywords =
        keywords ||
        "Ethiopian Olympic champions, Ethiopia athletics, Haile Gebrselassie, Kenenisa Bekele, Tirunesh Dibaba, Olympic history Ethiopia, Ethiopian runners";

    const metaImage =
        image ||
        "https://images.unsplash.com/photo-1546519638-68e109acd27d?auto=format&fit=crop&w=1200&q=80";

    const siteUrl = url || window.location.href;

    useEffect(() => {
        // Update document title
        document.title = fullTitle;

        // Helper function to update/create meta tags
        const updateMetaTag = (attr, value, content) => {
            let element = document.querySelector(`meta[${attr}="${value}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, value);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Standard SEO
        updateMetaTag('name', 'description', metaDescription);
        updateMetaTag('name', 'keywords', metaKeywords);

        // OpenGraph (Facebook, LinkedIn)
        updateMetaTag('property', 'og:title', fullTitle);
        updateMetaTag('property', 'og:description', metaDescription);
        updateMetaTag('property', 'og:image', metaImage);
        updateMetaTag('property', 'og:url', siteUrl);
        updateMetaTag('property', 'og:type', 'website');

        // Twitter SEO
        updateMetaTag('name', 'twitter:card', 'summary_large_image');
        updateMetaTag('name', 'twitter:title', fullTitle);
        updateMetaTag('name', 'twitter:description', metaDescription);
        updateMetaTag('name', 'twitter:image', metaImage);

    }, [fullTitle, metaDescription, metaKeywords, metaImage, siteUrl]);

    return null;
};

export default SEO;