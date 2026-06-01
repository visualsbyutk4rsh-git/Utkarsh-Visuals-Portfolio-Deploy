// analytics.js — Centralized Analytics & Dynamic SDK Loader
// Supports: Sentry Error Monitoring + Google Analytics GA4 + Microsoft Clarity
// Automatically pulls client-safe configurations dynamically from `/api/config`.

// Centralized event tracking helpers (available globally immediately)
window.trackAnalyticsEvent = (action, category, label, value) => {
    // Track in Google Analytics if active
    if (typeof window.gtag === 'function') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    // Track in Microsoft Clarity if active
    if (typeof window.clarity === 'function') {
        window.clarity('set', action, label || category);
    }
    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[Analytics Event] Action: ${action} | Category: ${category} | Label: ${label} | Value: ${value}`);
    }
};

(async function() {
    'use strict';

    try {
        // 1. Fetch public client configuration from Node.js backend
        const configResponse = await fetch('/api/config');
        if (!configResponse.ok) {
            throw new Error(`Failed to load config: ${configResponse.statusText}`);
        }
        
        const config = await configResponse.json();
        const { ga4Id, clarityId, sentryDsn } = config;

        // ═══════════════════════════════════════════
        // 2. SENTRY BROWSER SDK (Dynamic Init)
        // ═══════════════════════════════════════════
        if (sentryDsn && sentryDsn !== 'https://xxxx@sentry.io/xxxx') {
            const sentryScript = document.createElement('script');
            sentryScript.src = 'https://browser.sentry-cdn.com/8.30.0/bundle.min.js';
            sentryScript.crossOrigin = 'anonymous';
            sentryScript.onload = () => {
                if (window.Sentry) {
                    window.Sentry.init({
                        dsn: sentryDsn,
                        environment: window.location.hostname === 'localhost' ? 'development' : 'production',
                        tracesSampleRate: 0.2, // 20% performance trace capture in production
                        replaysSessionSampleRate: 0.1,
                        replaysOnErrorSampleRate: 1.0,
                    });
                    console.log('[Sentry] Browser SDK Initialized successfully');
                }
            };
            sentryScript.onerror = (e) => console.error('[Sentry] Failed to load Sentry browser script', e);
            document.head.appendChild(sentryScript);
        }

        // ═══════════════════════════════════════════
        // 3. GOOGLE ANALYTICS GA4 (Dynamic Init)
        // ═══════════════════════════════════════════
        if (ga4Id && ga4Id !== 'G-XXXXXXXXXX') {
            const gtagScript = document.createElement('script');
            gtagScript.async = true;
            gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
            gtagScript.onload = () => {
                window.dataLayer = window.dataLayer || [];
                window.gtag = function() { window.dataLayer.push(arguments); };
                window.gtag('js', new Date());
                window.gtag('config', ga4Id, {
                    send_page_view: true,
                    cookie_flags: 'SameSite=None;Secure'
                });
                console.log('[GA4] Loaded successfully');
            };
            gtagScript.onerror = (e) => console.error('[GA4] Failed to load Google Tag Manager script', e);
            document.head.appendChild(gtagScript);
        }

        // ═══════════════════════════════════════════
        // 4. MICROSOFT CLARITY (Dynamic Init)
        // ═══════════════════════════════════════════
        if (clarityId && clarityId !== 'xxxxxxxxxx') {
            (function(c, l, a, r, i, t, y) {
                c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
                t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
                console.log('[Clarity] Init script injected');
            })(window, document, "clarity", "script", clarityId);
        }

        // ═══════════════════════════════════════════
        // 5. AUTO-TRACKING: Performance Metrics
        // ═══════════════════════════════════════════
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (window.performance && window.performance.timing) {
                    const navStart = window.performance.timing.navigationStart;
                    const loadEnd = window.performance.timing.loadEventEnd;
                    if (navStart && loadEnd && loadEnd >= navStart) {
                        const loadTime = loadEnd - navStart;
                        window.trackAnalyticsEvent('page_load_time', 'performance', 'duration_ms', Math.round(loadTime));
                    }
                }
            }, 0);
        });

        // ═══════════════════════════════════════════
        // 6. AUTO-TRACKING: Scroll Depth
        // ═══════════════════════════════════════════
        let scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
        let scrollRAF = null;

        window.addEventListener('scroll', () => {
            if (scrollRAF) return;
            scrollRAF = requestAnimationFrame(() => {
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (totalHeight <= 0) return;
                
                const scrollPercent = Math.min(100, Math.round((window.scrollY / totalHeight) * 100));

                [25, 50, 75, 100].forEach(milestone => {
                    if (scrollPercent >= milestone && !scrollMilestones[milestone]) {
                        scrollMilestones[milestone] = true;
                        window.trackAnalyticsEvent('scroll_depth', 'engagement', `${milestone}%`, milestone);
                    }
                });
                scrollRAF = null;
            });
        }, { passive: true });

        // ═══════════════════════════════════════════
        // 7. AUTO-TRACKING: Time on Page
        // ═══════════════════════════════════════════
        const pageStartTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);
            window.trackAnalyticsEvent('time_on_page', 'engagement', 'seconds', timeOnPage);
        });

    } catch (err) {
        console.error('[Analytics] Failed to initialize analytics pipeline:', err);
    }
})();
