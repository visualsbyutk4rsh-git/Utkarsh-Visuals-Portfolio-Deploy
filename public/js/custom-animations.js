// custom-animations.js — Production-Optimized Scroll Reveal & Tilt System

document.addEventListener("DOMContentLoaded", () => {
    // Delay to ensure React hydration is complete
    setTimeout(() => {
        // --- 0. LENIS SMOOTH SCROLL INITIALIZATION ---
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
            window.lenis = lenis;

            // --- 0.5. ANCHOR SCROLL INTERCEPTION FOR LENIS ---
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    
                    if (targetId.startsWith('#')) {
                        e.preventDefault();
                        if (targetId === '#') {
                            window.lenis.scrollTo(0, { duration: 1.5 });
                            return;
                        }
                        const targetEl = document.querySelector(targetId);
                        if (targetEl) {
                            window.lenis.scrollTo(targetEl, {
                                offset: -80, // match header height (scroll-margin-top is 80px)
                                duration: 1.5,
                                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                            });
                        }
                    }
                });
            });
        }

        // --- 1. SCROLL REVEAL (IntersectionObserver with cleanup) ---
        const revealTargets = Array.from(document.querySelectorAll('div > img:not([width="16"]), div > h1, div > h2, div > p, section > div'))
            .filter(el => !el.closest('footer') && el.id !== 'video-sections-wrapper');

        revealTargets.forEach(el => {
            el.classList.add('saas-reveal');
        });

        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // PERFORMANCE: Stop observing once revealed (one-shot)
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.saas-reveal').forEach(el => {
            revealObserver.observe(el);
        });


        // --- 2. 3D HOVER TILT (rAF-throttled for 60fps) ---
        // Skip on mobile/touch devices entirely
        if (window.matchMedia("(max-width: 768px)").matches || window.matchMedia("(hover: none)").matches) {
            return; // Skip tilt setup entirely on mobile
        }

        const tiltTargets = Array.from(document.querySelectorAll('img, [class*="bg-card"]')).filter(el => {
            // Exclude WhatsApp links, small icons, fixed elements, circular avatars
            if (el.closest('a[href*="wa.me"], a[href*="whatsapp"]')) return false;
            if (el.tagName.toLowerCase() === 'img' && (el.width < 100 || el.height < 100)) return false;

            // Use class checks instead of expensive getComputedStyle
            const cls = el.className || '';
            if (cls.includes('fixed') || cls.includes('absolute')) return false;
            if (cls.includes('rounded-full')) return false; // circular avatars
            if (cls.includes('icon') || cls.includes('cursor') || cls.includes('logo')) return false;

            return true;
        });

        tiltTargets.forEach(el => {
            el.classList.add('saas-tilt');

            let tiltRAF = null;

            el.addEventListener('mousemove', (e) => {
                // Cancel any pending frame to prevent queuing
                if (tiltRAF) cancelAnimationFrame(tiltRAF);

                tiltRAF = requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -6;
                    const rotateY = ((x - centerX) / centerX) * 6;

                    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                    tiltRAF = null;
                });
            }, { passive: true });

            el.addEventListener('mouseleave', () => {
                if (tiltRAF) {
                    cancelAnimationFrame(tiltRAF);
                    tiltRAF = null;
                }
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });

        // --- 3. Add Safe Button Hover Class ---
        document.querySelectorAll('button, a.inline-flex, a.flex').forEach(btn => {
            const cls = btn.className || '';
            // Use class check instead of getComputedStyle
            if (!cls.includes('fixed') && !cls.includes('absolute')) {
                btn.classList.add('saas-button');
            }
        });

    }, 500);
});
