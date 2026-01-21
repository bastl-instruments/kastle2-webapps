// SPDX-License-Identifier: MIT
// Copyright (c) 2025 Vaclav Mach (Bastl Instruments)

const initAnalytics = () => {
    const GTAG = import.meta.env.VITE_GTAG;
    if (!GTAG) {
        return;
    }
    // Don't use on localhost
    if (window.location.hostname === 'localhost') {
        return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GTAG);
};

const trackEvent = (action, params = {}) => {
    if (window.gtag) {
        window.gtag('event', action, params);
    }
};

export { initAnalytics, trackEvent };