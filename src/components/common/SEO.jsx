import { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteName = "Z Tabor Trading PLC";
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Ethiopia's Construction & Trade Leader`;
    const metaDescription = description || "Your Premier Partner for High-Quality Construction Materials, Import-Export Solutions, and Agricultural Excellence in Ethiopia.";
    const metaKeywords = keywords || "Construction materials Ethiopia, SPC flooring, WPC panels, Import-Export Ethiopia, Agricultural exports, Z Tabor";
    const metaImage = image || "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
    const siteUrl = url || window.location.href;

    useEffect(() => {
        // Update document title
        document.title = fullTitle;

        // Update or create meta tags
        const updateMetaTag = (attr, value, content) => {
            let element = document.querySelector(`meta[${attr}="${value}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, value);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        updateMetaTag('name', 'description', metaDescription);
        updateMetaTag('name', 'keywords', metaKeywords);

        // OpenGraph
        updateMetaTag('property', 'og:title', fullTitle);
        updateMetaTag('property', 'og:description', metaDescription);
        updateMetaTag('property', 'og:image', metaImage);
        updateMetaTag('property', 'og:url', siteUrl);
        updateMetaTag('property', 'og:type', 'website');

        // Twitter
        updateMetaTag('name', 'twitter:card', 'summary_large_image');
        updateMetaTag('name', 'twitter:title', fullTitle);
        updateMetaTag('name', 'twitter:description', metaDescription);
        updateMetaTag('name', 'twitter:image', metaImage);

    }, [fullTitle, metaDescription, metaKeywords, metaImage, siteUrl]);

    return null;
};

export default SEO;
