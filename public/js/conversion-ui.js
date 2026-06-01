// conversion-ui.js - Lead Generation Engine (Production Hardened)

document.addEventListener("DOMContentLoaded", () => {

    // --- SECURITY: Input sanitization helper ---
    const sanitize = (str) => {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML.substring(0, 2000);
    };

    const isValidEmail = (email) => /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);

    // --- ANALYTICS: Track events if GA4 is loaded ---
    const trackEvent = (action, category, label) => {
        if (typeof window.trackAnalyticsEvent === 'function') {
            window.trackAnalyticsEvent(action, category, label);
        } else {
            if (typeof gtag === 'function') {
                gtag('event', action, { event_category: category, event_label: label });
            }
            if (typeof clarity === 'function') {
                clarity('set', action, label || category);
            }
        }
    };

    // --- 2. INJECT LEAD CAPTURE SYSTEM ---

    const modalHTML = `
        <div id="lead-modal">
            <button class="close-lead-btn">&times;</button>
            <div class="lead-form-container">
                <div id="lead-form-content">
                    <div class="lead-form-header">
                        <h2>Ready to Scale?</h2>
                        <p>Get a high-converting video strategy for your brand.</p>
                    </div>
                    <form id="lead-capture-form">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="lead-name" class="form-input" placeholder="Enter your name" required minlength="2" maxlength="100">
                        </div>
                        <div class="form-group">
                            <label>Work Email</label>
                            <input type="email" id="lead-email" class="form-input" placeholder="email@company.com" required>
                        </div>
                        <div class="form-group">
                            <label>Budget Range</label>
                            <select id="lead-budget" class="form-input" style="background: #1e293b;">
                                <option value="1k-3k">$1,000 - $3,000</option>
                                <option value="3k-5k">$3,000 - $5,000</option>
                                <option value="5k+">$5,000+</option>
                            </select>
                        </div>
                        <div style="position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;overflow:hidden;" aria-hidden="true">
                            <input type="text" name="_hp" id="lead-hp" tabindex="-1" autocomplete="off">
                        </div>
                        <button type="submit" class="submit-lead-btn">Start My Project</button>
                    </form>
                </div>
                <div id="lead-success-content" class="success-overlay">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <h2 style="color: white; margin-bottom: 10px;">Request Received!</h2>
                    <p style="color: #94a3b8;">I will reach out to you within 24 hours.</p>
                    <button class="submit-lead-btn" onclick="document.getElementById('lead-modal').classList.remove('active')" style="margin-top: 20px;">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);


    // --- 3. FORM LOGIC ---
    const modal = document.getElementById('lead-modal');
    const openBtn = document.getElementById('open-lead-modal');
    const closeBtn = document.querySelector('.close-lead-btn');
    const form = document.getElementById('lead-capture-form');
    const formContent = document.getElementById('lead-form-content');
    const successContent = document.getElementById('lead-success-content');

    const openLeadModal = () => {
        modal.classList.add('active');
        if (window.lenis) { window.lenis.stop(); }
        modal.setAttribute('tabindex', '-1');
        modal.style.outline = 'none';
        modal.focus();
        trackEvent('modal_open', 'lead_form', 'lead_modal');
    };

    const closeLeadModal = () => {
        modal.classList.remove('active');
        if (window.lenis) { window.lenis.start(); }
    };

    if (openBtn) openBtn.addEventListener('click', openLeadModal);
    closeBtn.addEventListener('click', closeLeadModal);

    // Close lead modal when pressing the Escape key
    const handleLeadKeyDown = (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (modal.classList.contains('active')) {
                closeLeadModal();
            }
        }
    };
    document.addEventListener('keydown', handleLeadKeyDown);

    // --- Submit debounce state ---
    let isSubmitting = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Debounce protection
        if (isSubmitting) return;
        isSubmitting = true;

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = "Sending...";
        btn.disabled = true;

        const nameVal = sanitize(document.getElementById('lead-name').value.trim());
        const emailVal = document.getElementById('lead-email').value.trim();
        const hpVal = document.getElementById('lead-hp') ? document.getElementById('lead-hp').value : '';

        // Client-side validation
        if (nameVal.length < 2) {
            alert('Please enter your full name (at least 2 characters).');
            btn.innerText = originalText;
            btn.disabled = false;
            isSubmitting = false;
            return;
        }
        if (!isValidEmail(emailVal)) {
            alert('Please enter a valid email address.');
            btn.innerText = originalText;
            btn.disabled = false;
            isSubmitting = false;
            return;
        }

        const leadData = {
            name: nameVal,
            email: emailVal,
            budget: document.getElementById('lead-budget').value,
            page: window.location.origin + window.location.pathname,
            _hp: hpVal
        };

        try {
            const startTime = Date.now();
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadData)
            });

            // Handle rate limiting
            if (response.status === 429) {
                const data = await response.json();
                alert(data.error || 'Too many requests. Please wait a few minutes.');
                btn.innerText = originalText;
                btn.disabled = false;
                isSubmitting = false;
                return;
            }

            const result = await response.json();

            // Smooth premium delay
            const elapsed = Date.now() - startTime;
            if (elapsed < 800) {
                await new Promise(r => setTimeout(r, 800 - elapsed));
            }

            if (result.success) {
                formContent.style.display = 'none';
                successContent.style.display = 'block';
                trackEvent('form_submit', 'lead_form', 'modal_lead');
            }
        } catch (error) {
            console.error("Lead submission failed:", error);
            alert("Submission failed. Please try again later.");
            btn.innerText = originalText;
            btn.disabled = false;
        } finally {
            // Re-enable after 3 seconds to prevent rapid resubmission
            setTimeout(() => { isSubmitting = false; }, 3000);
        }
    });

    // --- 4. WIRE UP MAIN CONTACT FORM TO THE BACKEND ---
    const wireContactForm = () => {
        const contactForm = document.querySelector('#contact form');
        if (!contactForm) return false;

        // Check if we already bound the submit handler to avoid double-binding
        if (contactForm.dataset.boundBackend === 'true') return true;
        contactForm.dataset.boundBackend = 'true';

        // Inject honeypot into contact form
        const hpField = document.createElement('div');
        hpField.style.cssText = 'position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;overflow:hidden;';
        hpField.setAttribute('aria-hidden', 'true');
        hpField.innerHTML = '<input type="text" name="_hp" id="contact-hp" tabindex="-1" autocomplete="off">';
        contactForm.appendChild(hpField);

        let contactSubmitting = false;

        contactForm.addEventListener('submit', async (e) => {
            // Stop React's standard handler from running
            e.preventDefault();
            e.stopImmediatePropagation();

            if (contactSubmitting) return;
            contactSubmitting = true;

            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const descInput = contactForm.querySelector('textarea');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const hpInput = document.getElementById('contact-hp');

            if (!nameInput || !emailInput || !descInput) return;

            const nameVal = sanitize(nameInput.value.trim());
            const emailVal = emailInput.value.trim();

            // Client-side validation
            if (nameVal.length < 2) {
                alert('Please enter your name (at least 2 characters).');
                contactSubmitting = false;
                return;
            }
            if (!isValidEmail(emailVal)) {
                alert('Please enter a valid email address.');
                contactSubmitting = false;
                return;
            }

            const leadData = {
                name: nameVal,
                email: emailVal,
                budget: "Contact Form Quote Request",
                description: sanitize(descInput.value.trim()),
                page: window.location.origin + window.location.pathname,
                source: "Main Contact Form",
                _hp: hpInput ? hpInput.value : ''
            };

            const originalBtnHTML = submitBtn ? submitBtn.innerHTML : null;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending...';
            }

            try {
                const startTime = Date.now();
                const response = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadData)
                });

                // Handle rate limiting
                if (response.status === 429) {
                    const data = await response.json();
                    if (submitBtn) {
                        submitBtn.innerHTML = '<span style="color: #f59e0b">⏳ Please wait a few minutes</span>';
                    }
                    setTimeout(() => {
                        if (submitBtn && originalBtnHTML) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnHTML;
                        }
                        contactSubmitting = false;
                    }, 5000);
                    return;
                }

                // Smooth premium delay
                const elapsed = Date.now() - startTime;
                if (elapsed < 800) {
                    await new Promise(r => setTimeout(r, 800 - elapsed));
                }

                // Success feedback
                if (submitBtn) {
                    submitBtn.style.background = 'rgba(34, 197, 94, 0.15)';
                    submitBtn.style.border = '1px solid rgba(34, 197, 94, 0.3)';
                    submitBtn.style.boxShadow = '0 0 24px rgba(34, 197, 94, 0.2)';
                    submitBtn.innerHTML = '<span style="color: #4ade80">✓ Message sent successfully!</span>';
                }

                trackEvent('form_submit', 'contact_form', 'main_contact');

                // Clear input fields
                nameInput.value = '';
                emailInput.value = '';
                descInput.value = '';
            } catch (error) {
                console.error("Failed to store contact form lead:", error);
                if (submitBtn) {
                    submitBtn.innerHTML = '<span style="color: #ef4444">⚠️ Error sending. Please retry.</span>';
                }
            } finally {
                if (submitBtn && originalBtnHTML) {
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        submitBtn.style.border = '';
                        submitBtn.style.boxShadow = '';
                        submitBtn.innerHTML = originalBtnHTML;
                        contactSubmitting = false;
                    }, 2500);
                }
            }
        }, true); // Capture phase overrides React event pipeline

        return true;
    };

    // --- 4.5 INJECT PREMIUM CINEMATIC HERO SECTION ---
    const injectCinematicHero = () => {
        const heroSection = document.querySelector('section.relative.min-h-screen');
        if (!heroSection) return false;
        if (heroSection.dataset.cinematicActive === 'true') return true;

        // Strip React's inline gradient so our layers control the background
        heroSection.removeAttribute('style');
        heroSection.classList.add('cinematic-hero');

        const videoWrap = document.createElement('div');
        videoWrap.className = 'hero-video-wrap';

        const video = document.createElement('video');
        video.className = 'hero-bg-video';
        video.src = 'videos/hero-cinematic.mp4';
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('preload', 'auto');

        // Playback failsafe start
        video.play().catch(() => {});

        // Explicit ended event listener for bulletproof seamless loop recovery
        video.addEventListener('ended', () => {
            video.currentTime = 0;
            video.play().catch(() => {});
        });

        // Failsafe auto-trigger play on user interaction to bypass autoplay restrictions on strict browsers
        const forcePlayOnInteraction = () => {
            if (video.paused) {
                video.play().catch(() => {});
            }
        };
        ['click', 'touchstart', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, forcePlayOnInteraction, { once: true, passive: true });
        });

        // --- PERFORMANCE: Pause video when not visible ---
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.1 });
            videoObserver.observe(heroSection);
        }

        videoWrap.appendChild(video);

        // ── Overlay layers ──
        const overlayPrimary = document.createElement('div');
        overlayPrimary.className = 'hero-overlay-primary';

        const overlaySecondary = document.createElement('div');
        overlaySecondary.className = 'hero-overlay-secondary';

        const noise = document.createElement('div');
        noise.className = 'hero-noise';

        // Insert layers at top of section in correct z-order
        heroSection.insertBefore(noise, heroSection.firstChild);
        heroSection.insertBefore(overlaySecondary, heroSection.firstChild);
        heroSection.insertBefore(overlayPrimary, heroSection.firstChild);
        heroSection.insertBefore(videoWrap, heroSection.firstChild);

        // ── Content wrapper ──
        const contentWrapper = heroSection.querySelector(
            'div.relative.z-20, div.relative.z-10, div.container, div.max-w-7xl, div.max-w-6xl'
        );
        if (contentWrapper) {
            contentWrapper.classList.add('cinematic-hero-content');
        } else {
            const mainChild = heroSection.children[4];
            if (mainChild) mainChild.classList.add('cinematic-hero-content');
        }

        // ── Heading & Title Overrides (Explicit Exact Copy, Hide duplicate tags) ──
        const headings = heroSection.querySelectorAll('h1');
        headings.forEach((heading, idx) => {
            if (idx === 0) {
                heading.innerHTML = 'Cinematic Edits<br>That Turn Views<br>Into <span class="highlight-text">Clients</span>';
                heading.style.setProperty('display', 'block', 'important');
            } else {
                heading.style.setProperty('display', 'none', 'important');
            }
        });

        // ── Subtitle ──
        const para = heroSection.querySelector('.cinematic-hero-content p');
        if (para) {
            para.style.setProperty('display', 'none', 'important');
        }

        // ── Button group ──
        const primaryBtn = heroSection.querySelector(
            'a[href*="calendly"], a.inline-flex, button'
        );
        if (primaryBtn) {
            primaryBtn.classList.add('hero-cta-btn');
            // Track CTA clicks
            primaryBtn.addEventListener('click', () => {
                trackEvent('cta_click', 'hero', 'primary_cta');
            });
            const btnGroup = primaryBtn.parentElement;
            if (btnGroup) {
                btnGroup.classList.add('hero-btn-group');
                btnGroup.querySelectorAll('a, button').forEach(btn => {
                    if (!btn.classList.contains('hero-cta-btn')) {
                        btn.classList.add('hero-sec-btn');
                        btn.addEventListener('click', () => {
                            trackEvent('cta_click', 'hero', 'secondary_cta');
                        });
                    }
                });
            }
        }

        // ── Floating stats cards — organic staggered float keyframes ──
        const cards = heroSection.querySelectorAll('div.absolute.hidden.lg\\:flex');
        const isMobile = window.innerWidth <= 768;
        const cardPositions = isMobile ? [
            { left: '4%', top: '12%', right: null, bottom: null },
            { left: null, top: '10%', right: '4%', bottom: null },
            { left: '4%', top: null, right: null, bottom: '8%' },
            { left: null, top: null, right: '4%', bottom: '6%' },
        ] : [
            { left: '10%', top: '24%', right: null, bottom: null },
            { left: null, top: '22%', right: '10%', bottom: null },
            { left: '8%', top: null, right: null, bottom: '26%' },
            { left: null, top: null, right: '8%', bottom: '26%' },
        ];

        cards.forEach((card, i) => {
            card.classList.add('hero-floating-card');
            card.classList.add(`hero-card-${i + 1}`);

            // Wipe React's inline styling
            card.style.removeProperty('background');
            card.style.removeProperty('border');
            card.style.removeProperty('backdrop-filter');
            card.style.removeProperty('transition');
            card.style.removeProperty('transform');
            card.style.removeProperty('min-width');
            card.style.removeProperty('box-shadow');
            card.style.removeProperty('animation');

            // Apply balanced positions
            const pos = cardPositions[i] || cardPositions[0];
            card.style.setProperty('left', pos.left || 'auto', 'important');
            card.style.setProperty('right', pos.right || 'auto', 'important');
            card.style.setProperty('top', pos.top || 'auto', 'important');
            card.style.setProperty('bottom', pos.bottom || 'auto', 'important');

            // Apply staggered floating animation
            const animName = `cinematicFloat${(i % 4) + 1}`;
            let dur = '8s';
            let del = '0s';
            if (i === 0) { dur = '8s'; del = '0s'; }
            else if (i === 1) { dur = '9s'; del = '1.5s'; }
            else if (i === 2) { dur = '7.5s'; del = '0.8s'; }
            else if (i === 3) { dur = '8.5s'; del = '2.2s'; }

            card.style.setProperty('animation', `${animName} ${dur} ease-in-out ${del} infinite alternate`, 'important');
        });

        heroSection.dataset.cinematicActive = 'true';
        return true;
    };

    // --- 5. REPLACE NAVBAR LOGO WITH NEW LOGO.PNG ---
    const replaceNavbarLogo = () => {
        const logoLink = document.querySelector('nav a[href="#"]');
        if (!logoLink) return false;

        const iconDiv = logoLink.querySelector('div');
        if (!iconDiv) return false;

        if (logoLink.dataset.logoReplaced === 'true') return true;
        logoLink.dataset.logoReplaced = 'true';

        iconDiv.outerHTML = `
            <img src="logo.png?v=3" alt="Utkarsh Visuals Logo" class="navbar-logo-img" loading="eager">
        `;

        // Smooth scroll to hero on logo click
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        return true;
    };

    // --- 6. REPLACE FOOTER LOGO AND LINKS ---
    const modifyFooter = () => {
        const footerBrandContainer = document.querySelector('footer .flex.items-center.gap-2\\.5');
        const mailtoLink = document.querySelector('footer a[href^="mailto:"]');

        if (!footerBrandContainer || !mailtoLink) return false;

        let brandDone = false;
        let linksDone = false;

        if (footerBrandContainer.dataset.logoReplaced === 'true') {
            brandDone = true;
        } else {
            const footerIcon = footerBrandContainer.querySelector('div');
            if (footerIcon) {
                footerBrandContainer.classList.add('footer-logo-container');
                footerIcon.outerHTML = `<img src="logo.png?v=3" alt="Utkarsh Visuals Logo" class="footer-logo-img" loading="lazy">`;
                footerBrandContainer.dataset.logoReplaced = 'true';
                brandDone = true;
            }
        }

        if (mailtoLink) {
            if (mailtoLink.dataset.linksReplaced === 'true') {
                linksDone = true;
            } else {
                mailtoLink.outerHTML = `
                    <a href="mailto:visualsbyutk4rsh@gmail.com" id="footer-mailto-link" class="text-sm font-medium flex items-center gap-1.5 transition-colors duration-300" style="color: rgba(255,255,255,0.32);" onmouseenter="this.style.color='#3B82F6'" onmouseleave="this.style.color='rgba(255,255,255,0.32)'" data-links-replaced="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; display: inline-block; vertical-align: -2px; margin-right: 4px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        visualsbyutk4rsh@gmail.com
                    </a>
                `;
                linksDone = true;
            }
        }

        return brandDone && linksDone;
    };

    // --- Track WhatsApp clicks ---
    const trackWhatsApp = () => {
        document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
            if (link.dataset.tracked) return;
            link.dataset.tracked = 'true';
            link.addEventListener('click', () => {
                trackEvent('whatsapp_click', 'engagement', 'whatsapp');
            });
        });
    };

    // Run on interval to override dynamic React hydration
    let contactWired = false;
    let logoReplaced = false;
    let footerReplaced = false;
    let heroActive = false;
    const wireInterval = setInterval(() => {
        if (!contactWired) {
            contactWired = wireContactForm();
        }
        if (!logoReplaced) {
            logoReplaced = replaceNavbarLogo();
        }
        if (!footerReplaced) {
            footerReplaced = modifyFooter();
        }
        if (!heroActive) {
            heroActive = injectCinematicHero();
        }
        trackWhatsApp();

        if (contactWired && logoReplaced && footerReplaced && heroActive) {
            clearInterval(wireInterval);
        }
    }, 200);

    // Failsafe: stop trying after 15 seconds
    setTimeout(() => clearInterval(wireInterval), 15000);

    // --- CONTINUOUS MUTATION OBSERVER ROUTING & HYDRATION FAILSAFE ---
    const setupRouteObserver = () => {
        const observer = new MutationObserver(() => {
            const heroSection = document.querySelector('section.relative.min-h-screen');
            if (heroSection && heroSection.dataset.cinematicActive !== 'true') {
                injectCinematicHero();
            }
            
            // Re-enforce other overrides
            wireContactForm();
            replaceNavbarLogo();
            modifyFooter();
            trackWhatsApp();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };
    setupRouteObserver();

    // --- 7. SMART FLOATING CARD ENFORCEMENT (MutationObserver) ---
    // Replaces the old 1-second setInterval with an efficient MutationObserver
    // that only fires when React actually modifies the DOM.
    const setupCardEnforcement = () => {
        const heroSection = document.querySelector('section.relative.min-h-screen.cinematic-hero');
        if (!heroSection) return;

        const applyCardStyles = () => {
            const cards = heroSection.querySelectorAll('div.absolute.hidden.lg\\:flex, .hero-floating-card');
            const isMobile = window.innerWidth <= 768;
            const cardPositions = isMobile ? [
                { left: '4%', top: '12%', right: null, bottom: null },
                { left: null, top: '10%', right: '4%', bottom: null },
                { left: '4%', top: null, right: null, bottom: '8%' },
                { left: null, top: null, right: '4%', bottom: '6%' },
            ] : [
                { left: '10%', top: '24%', right: null, bottom: null },
                { left: null, top: '22%', right: '10%', bottom: null },
                { left: '8%', top: null, right: null, bottom: '26%' },
                { left: null, top: null, right: '8%', bottom: '26%' },
            ];

            cards.forEach((card, i) => {
                if (!card.classList.contains('hero-floating-card')) {
                    card.classList.add('hero-floating-card');
                }
                const cardIndexClass = `hero-card-${i + 1}`;
                if (!card.classList.contains(cardIndexClass)) {
                    card.classList.add(cardIndexClass);
                }

                card.style.removeProperty('background');
                card.style.removeProperty('border');
                card.style.removeProperty('backdrop-filter');
                card.style.removeProperty('transition');
                card.style.removeProperty('transform');
                card.style.removeProperty('min-width');
                card.style.removeProperty('box-shadow');

                const pos = cardPositions[i] || cardPositions[0];
                card.style.setProperty('left', pos.left || 'auto', 'important');
                card.style.setProperty('right', pos.right || 'auto', 'important');
                card.style.setProperty('top', pos.top || 'auto', 'important');
                card.style.setProperty('bottom', pos.bottom || 'auto', 'important');

                const animName = `cinematicFloat${(i % 4) + 1}`;
                let dur = '5s', del = '0s';
                if (i === 0) { dur = '5s'; del = '0s'; }
                else if (i === 1) { dur = '5.9s'; del = '0.45s'; }
                else if (i === 2) { dur = '6.7s'; del = '0.85s'; }
                else if (i === 3) { dur = '5.5s'; del = '0.25s'; }

                const expectedAnim = `${animName} ${dur} ease-in-out ${del} infinite alternate`;
                if (card.style.animation !== expectedAnim) {
                    card.style.setProperty('animation', expectedAnim, 'important');
                }
            });

            // Card 5 (About Section)
            const cardFive = document.querySelector('section div.absolute.-bottom-4.-right-4, div.absolute.-bottom-4.-right-4, .hero-floating-card-5');
            if (cardFive) {
                if (!cardFive.classList.contains('hero-floating-card-5')) {
                    cardFive.classList.add('hero-floating-card-5');
                }
                cardFive.style.removeProperty('transition');
                const expectedAnim5 = `cinematicFloat5 6.2s ease-in-out 0.6s infinite alternate`;
                if (cardFive.style.animation !== expectedAnim5) {
                    cardFive.style.setProperty('animation', expectedAnim5, 'important');
                }
            }
        };

        // Initial enforcement
        applyCardStyles();

        // MutationObserver for React re-renders (replaces setInterval)
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    needsUpdate = true;
                    break;
                }
                if (mutation.type === 'childList') {
                    needsUpdate = true;
                    break;
                }
            }
            if (needsUpdate) {
                requestAnimationFrame(applyCardStyles);
            }
        });

        observer.observe(heroSection, {
            attributes: true,
            attributeFilter: ['style'],
            childList: true,
            subtree: true
        });

        // Safety fallback: also run once after 5s and 15s to catch late hydration
        setTimeout(applyCardStyles, 5000);
        setTimeout(applyCardStyles, 15000);

        // Re-run enforcement on window resize to guarantee instant responsiveness without reloads
        window.addEventListener('resize', () => {
            requestAnimationFrame(applyCardStyles);
        });

        // Stop observer after 60 seconds (React stabilizes by then)
        setTimeout(() => {
            observer.disconnect();
        }, 60000);
    };

    // Wait for hero to be injected, then set up enforcement
    setTimeout(setupCardEnforcement, 3000);
});
