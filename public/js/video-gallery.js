// video-gallery.js - Tejantra Rebrand & Video Categorization Engine

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 0. DYNAMIC COPY REPLACEMENT (TEJANTRA REBRAND - STAGGERED SCHEDULER) ---
    // Safely and efficiently replaces text nodes once React has finished hydration.
    // Completely eliminates continuous background setInterval polling.
    const replaceTejantraCopy = () => {
        const allParagraphs = document.querySelectorAll('p, h2, h3, div');
        let replaced = false;

        allParagraphs.forEach(el => {
            if (el.textContent.includes("A premium portfolio showcase for cinematic video editing") || 
                el.textContent.includes("focused on helping brands and creators scale through high-impact visual storytelling")) {
                
                el.innerHTML = `<strong>Lead Video Editor at Tejantra.</strong><br/> Generating high-ROI performance ads & cinematic creatives for 150+ brands.`;
                el.style.color = "#f8fafc"; // Ensure it pops
                replaced = true;
            }
        });
        return replaced;
    };

    // Staggered trigger array that stops instantly as soon as replacement is successful
    const runStaggeredReplacement = () => {
        if (replaceTejantraCopy()) return;
        setTimeout(() => {
            if (replaceTejantraCopy()) return;
            setTimeout(() => {
                if (replaceTejantraCopy()) return;
                setTimeout(replaceTejantraCopy, 1500);
            }, 600);
        }, 200);
    };
    runStaggeredReplacement();


    // --- 2. INJECT VIDEO GALLERY STRUCTURE ---
    
    // Simplified & organized Video Data
    const videoData = [
        {
            id: 'before-after-ad-short',
            title: 'Before & After Ad Creative Edit | Commercial Showcase',
            brand: 'Performance Ad Showcase',
            category: 'before-after',
            categoryLabel: 'Reels • Before & After Edit',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/80GE8l1Fcs4', 
            isVertical: true,
            metrics: { visualQuality: 8.5, editingQuality: 9.5, motionDesignQuality: 8.5, commercialValue: 9.0, creativeExecution: 9.0 }
        },
        {
            id: 'apple-creative-short',
            title: 'Raw to Refined | Apple-Inspired Creative Showcase',
            brand: 'Performance Ad Showcase',
            category: 'before-after',
            categoryLabel: 'Reels • Product Showcase',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/gv9iIG-GZCU', 
            isVertical: true,
            metrics: { visualQuality: 9.0, editingQuality: 9.0, motionDesignQuality: 9.0, commercialValue: 9.0, creativeExecution: 8.5 }
        },
        {
            id: 'content-that-converts-short',
            title: 'Content That Converts | Before & After Transformation',
            brand: 'Strategic Content Edit',
            category: 'before-after',
            categoryLabel: 'Reels • Before & After Edit',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/06b0cSLbq1g', 
            isVertical: true,
            metrics: { visualQuality: 8.8, editingQuality: 9.2, motionDesignQuality: 8.5, commercialValue: 9.3, creativeExecution: 8.8 }
        },
        {
            id: 'google-calendar-workflow-short',
            title: 'Google Calendar Workflow | Before & After Transformation',
            brand: 'Productivity Workflow Edit',
            category: 'before-after',
            categoryLabel: 'Reels • Before & After Edit',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/XSeEpy9tqn0', 
            isVertical: true,
            metrics: { visualQuality: 8.7, editingQuality: 9.0, motionDesignQuality: 8.5, commercialValue: 9.0, creativeExecution: 8.6 }
        },
        {
            id: 'event-highlights-short',
            title: 'Cinematic Event Highlights | Moments in Motion',
            brand: 'Event Recap Film',
            category: 'events-bts',
            categoryLabel: 'Reels • Event Highlights',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/O2IH2nfdsSs',
            isVertical: true,
            metrics: { visualQuality: 9.5, editingQuality: 9.0, motionDesignQuality: 7.5, commercialValue: 8.5, creativeExecution: 9.0 }
        },
        {
            id: 'event-bts-short',
            title: 'Cinematic Event BTS | Behind the Production',
            brand: 'Event Production',
            category: 'events-bts',
            categoryLabel: 'Reels • Event BTS',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/a6ErYHIvdc8', 
            isVertical: true,
            metrics: { visualQuality: 8.5, editingQuality: 8.5, motionDesignQuality: 7.0, commercialValue: 8.0, creativeExecution: 8.5 }
        },
        {
            id: 'kb7v1fyrndw-short',
            title: 'Cinematic BTS Campaign Edit | Professional Commercial Showcase',
            brand: 'Performance Ad Showcase',
            category: 'events-bts',
            categoryLabel: 'Reels • Cinematic BTS',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/rDguyLsSyyE', 
            isVertical: true,
            metrics: { visualQuality: 9.0, editingQuality: 8.5, motionDesignQuality: 7.5, commercialValue: 8.5, creativeExecution: 8.5 }
        },
        {
            id: 'portfolio-reel',
            title: 'Creative Editor Portfolio Reel | Ads • Cinematics • Visual Design',
            brand: 'Utkarsh Visuals',
            category: 'cinematic',
            categoryLabel: 'Cinematic Edit • Storytelling',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtu.be/W5gVU7JWx2c', 
            isVertical: false,
            metrics: { visualQuality: 10.0, editingQuality: 10.0, motionDesignQuality: 9.0, commercialValue: 10.0, creativeExecution: 10.0 }
        },
        {
            id: 'yamaha-r1-cinematic',
            title: 'Beyond Speed | Yamaha R1 Cinematic Film',
            brand: 'Automotive Cinematic Film',
            category: 'cinematic',
            categoryLabel: 'Cinematic Edit • Automotive Film',
            thumbnail: 'https://img.youtube.com/vi/kBZyXwLSNus/hqdefault.jpg', // Pre-defined to prevent 404 console error on maxresdefault
            videoUrl: 'https://youtu.be/kBZyXwLSNus', 
            isVertical: false,
            metrics: { visualQuality: 9.5, editingQuality: 9.7, motionDesignQuality: 9.0, commercialValue: 9.4, creativeExecution: 9.8 }
        },
        {
            id: 'imagination-motion-showreel',
            title: 'Where Imagination Meets Motion | Creative Showreel',
            brand: 'Motion Design Showcase',
            category: 'cinematic',
            categoryLabel: 'Cinematic Edit • Motion Design',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtu.be/8HX_lcsZHW8', 
            isVertical: false,
            metrics: { visualQuality: 9.6, editingQuality: 9.6, motionDesignQuality: 9.8, commercialValue: 9.4, creativeExecution: 9.6 }
        },
        {
            id: 'pick-your-poison-cinematic',
            title: 'Pick Your Poison | Cinematic Reflection',
            brand: 'Visual Storytelling Project',
            category: 'cinematic',
            categoryLabel: 'Cinematic Edit • Visual Concept',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtu.be/Rh1wIvFXrXw', 
            isVertical: false,
            metrics: { visualQuality: 9.7, editingQuality: 9.5, motionDesignQuality: 9.3, commercialValue: 9.2, creativeExecution: 9.6 }
        },
        {
            id: 'stop-scrolling-creator-edit',
            title: 'What Makes People Stop Scrolling | Creator Edit',
            brand: 'Creator Concept Edit',
            category: 'cinematic',
            categoryLabel: 'Cinematic Edit • Creator Content',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtu.be/gUkp2R-m0RY', 
            isVertical: false,
            metrics: { visualQuality: 9.6, editingQuality: 9.8, motionDesignQuality: 9.2, commercialValue: 9.5, creativeExecution: 9.7 }
        },
        {
            id: 'creator-growth-blueprint',
            title: 'The Creator Growth Blueprint | Cinematic Storytelling',
            brand: 'Creator Storytelling Project',
            category: 'cinematic',
            categoryLabel: 'Cinematic Edit • Storytelling',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtu.be/AdH1zcAKo6Y', 
            isVertical: false,
            metrics: { visualQuality: 9.5, editingQuality: 9.6, motionDesignQuality: 9.2, commercialValue: 9.4, creativeExecution: 9.5 }
        },
        {
            id: 'mrbeast-documentary-short',
            title: 'The Rise of MrBeast | A Creator Biography & Pacing Edit',
            brand: 'Creator Case Study',
            category: 'documentary',
            categoryLabel: 'Short-Form Documentary • Growth Case Study',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/RhhSSUFDBiM', 
            isVertical: true,
            metrics: { visualQuality: 9.6, editingQuality: 9.8, motionDesignQuality: 9.2, commercialValue: 9.5, creativeExecution: 9.8 }
        },
        {
            id: 'formula-one-documentary-short',
            title: 'The $600M Formula 1 Success Story | Cinematic Sports Documentary',
            brand: 'Sports Business Case Study',
            category: 'documentary',
            categoryLabel: 'Short-Form Documentary • Sports Business',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/nTYm0E_Caz8', 
            isVertical: true,
            metrics: { visualQuality: 9.5, editingQuality: 9.7, motionDesignQuality: 9.0, commercialValue: 9.4, creativeExecution: 9.8 }
        },

        {
            id: 'henry-ford-documentary-short',
            title: 'The Man Who Changed Cars Forever | Henry Ford Mini-Documentary',
            brand: 'Historical Biography Case Study',
            category: 'documentary',
            categoryLabel: 'Short-Form Documentary • History Case Study',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/o-bkMA84TL8', 
            isVertical: true,
            metrics: { visualQuality: 9.4, editingQuality: 9.7, motionDesignQuality: 9.0, commercialValue: 9.3, creativeExecution: 9.7 }
        },
        {
            id: 'steve-jobs-innovation-documentary',
            title: 'The Visionary Behind Apple | Innovation Story',
            brand: 'Innovation Case Study',
            category: 'documentary',
            categoryLabel: 'Short-Form Documentary • Innovation Story',
            thumbnail: '', // Auto-extracted from YouTube
            videoUrl: 'https://youtube.com/shorts/rt7qTNjAwmg', 
            isVertical: true,
            metrics: { visualQuality: 9.3, editingQuality: 9.5, motionDesignQuality: 9.0, commercialValue: 9.2, creativeExecution: 9.5 }
        }
    ];

    // --- FUTURE-PROOFING: MULTI-CATEGORY AUTO-RECOGNITION RULE ENGINE ---
    // Respects intentional manually assigned categories. ONLY runs routing logic if vid.category is blank/falsy.
    videoData.forEach(vid => {
        if (vid.category) return; // PRESERVE INTENTIONAL MANUAL CATEGORIZATION
        
        const searchableText = `${vid.title} ${vid.brand} ${vid.categoryLabel}`.toLowerCase();
        
        // 1. Documentary Keywords (Storytelling, case study, biographical)
        const documentaryKeywords = [
            'documentary', 'founder', 'business', 'creator', 'startup', 
            'entrepreneurship', 'educational', 'case study', 'biography', 'essay', 'storytelling'
        ];
        
        // 2. Before & After Keywords (Transformation, raw-to-refined, split screen)
        const beforeAfterKeywords = [
            'before & after', 'before and after', 'raw to refined', 'transformation', 
            'split screen', 'editing comparison', 'raw-to-refined'
        ];
        
        // 3. Cinematic Keywords (Motion design, UI promo, campaign, creative reel, product promo)
        const cinematicKeywords = [
            'motion design', 'ui promo', 'campaign', 'creative reel', 'product promo', 
            'saas platform', 'luxury campaign', 'creative editor portfolio'
        ];
        
        // 4. Events & BTS Keywords (Event highlight, event film, behind the scenes, BTS)
        const eventsBtsKeywords = [
            'event highlight', 'event film', 'behind the scenes', 'bts', 'event recap', 
            'live experience', 'moments in motion', 'production bts'
        ];
        
        if (documentaryKeywords.some(kw => searchableText.includes(kw))) {
            vid.category = 'documentary';
        } else if (beforeAfterKeywords.some(kw => searchableText.includes(kw))) {
            vid.category = 'before-after';
        } else if (cinematicKeywords.some(kw => searchableText.includes(kw))) {
            vid.category = 'cinematic';
        } else if (eventsBtsKeywords.some(kw => searchableText.includes(kw))) {
            vid.category = 'events-bts';
        }
    });

    // Helper: Dynamic Curation Score calculation based on quality metrics
    const getCurationScore = (vid) => {
        const q = vid.metrics || { visualQuality: 5, editingQuality: 5, motionDesignQuality: 5, commercialValue: 5, creativeExecution: 5 };
        return (
            q.visualQuality * 2.5 +
            q.editingQuality * 2.5 +
            q.motionDesignQuality * 1.5 +
            q.commercialValue * 2.0 +
            q.creativeExecution * 1.5
        );
    };

    const generateVideoGrid = (filter = 'all') => {
        const wrapper = document.getElementById('video-sections-wrapper');
        if (!wrapper) return;
        
        wrapper.classList.remove('saas-reveal');
        wrapper.innerHTML = ''; // clear
        
        // Filter video data
        let filtered = filter === 'all' ? videoData : videoData.filter(v => v.category === filter);
        
        // Dynamic Intelligent Position Logic: Automatically sort descending by curation score
        filtered = [...filtered].sort((a, b) => {
            // Permanent Pin: Flagship Cinematic Showreel must always be first
            if (a.id === 'imagination-motion-showreel') return -1;
            if (b.id === 'imagination-motion-showreel') return 1;
            
            // Permanent Pin: Pick Your Poison Cinematic must always be second
            if (a.id === 'pick-your-poison-cinematic') return -1;
            if (b.id === 'pick-your-poison-cinematic') return 1;
            
            // Permanent Pin: Stop Scrolling Creator Edit must always be third
            if (a.id === 'stop-scrolling-creator-edit') return -1;
            if (b.id === 'stop-scrolling-creator-edit') return 1;
            
            // Permanent Pin: Beyond Speed Yamaha R1 must always be fourth
            if (a.id === 'yamaha-r1-cinematic') return -1;
            if (b.id === 'yamaha-r1-cinematic') return 1;
            
            // Permanent Pin: Creator Growth Blueprint must always be fifth
            if (a.id === 'creator-growth-blueprint') return -1;
            if (b.id === 'creator-growth-blueprint') return 1;
            
            // Permanent Pin: Portfolio Reel must always be sixth
            if (a.id === 'portfolio-reel') return -1;
            if (b.id === 'portfolio-reel') return 1;
            
            return getCurationScore(b) - getCurationScore(a);
        });
        
        // Split filtered videos into four logical categories
        const beforeAfterVideos = filtered.filter(v => v.category === 'before-after');
        const eventsBtsVideos = filtered.filter(v => v.category === 'events-bts');
        const cinematicVideos = filtered.filter(v => v.category === 'cinematic');
        const documentaryVideos = filtered.filter(v => v.category === 'documentary');

        // Helper to render a single card
        const createCardElement = (vid) => {
            let thumbnailSrc = vid.thumbnail || '';
            const isYouTube = vid.videoUrl.includes('youtube.com') || vid.videoUrl.includes('youtu.be');
            
            if (!thumbnailSrc && isYouTube) {
                let ytId = "";
                if (vid.videoUrl.includes('youtu.be/')) {
                    ytId = vid.videoUrl.split('youtu.be/').pop().split('?')[0];
                } else if (vid.videoUrl.includes('shorts/')) {
                    ytId = vid.videoUrl.split('shorts/').pop().split('?')[0];
                } else if (vid.videoUrl.includes('watch?v=')) {
                    const parts = vid.videoUrl.split('watch?v=');
                    if (parts.length > 1) {
                        ytId = parts[1].split('&')[0];
                    }
                }
                if (ytId) {
                    thumbnailSrc = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
                }
            }
            
            if (!thumbnailSrc) {
                thumbnailSrc = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop';
            }

            // Determine display aspect ratio layout class
            const layoutClass = vid.isVertical ? 'short-form' : (vid.id === 'portfolio-reel' || vid.id === 'tejantra-cinematic' || vid.id === 'imagination-motion-showreel' ? 'long-form' : 'commercial-ads');
            const catMeta = vid.isVertical ? 'SHORTS' : (layoutClass === 'long-form' ? 'FILM' : 'COMMERCIAL');
            
            const card = document.createElement('div');
            card.className = `video-card ${layoutClass}`;
            card.innerHTML = `
                <img src="${thumbnailSrc}" alt="${vid.title}" loading="lazy" decoding="async" class="video-thumbnail" onload="if(this.naturalWidth === 120) { this.src = this.src.replace('maxresdefault.jpg', 'hqdefault.jpg'); }" onerror="if(this.src.includes('maxresdefault.jpg')) { this.src = this.src.replace('maxresdefault.jpg', 'hqdefault.jpg'); } else { this.src='https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop'; }" />
                <div class="video-overlay">
                    <span class="video-category">${catMeta}</span>
                    <h3 class="video-title">${vid.title}</h3>
                </div>
                <div class="video-play-btn">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            `;
            
            card.addEventListener('click', () => {
                window.openCinematicVideo(vid.videoUrl, vid.isVertical);
            });
            
            return card;
        };

        // Render Cinematic Section (can hold films and ads in appropriate grids)
        if (cinematicVideos.length > 0) {
            const section = document.createElement('div');
            section.className = 'video-section-group cinematic-group';
            
            const primaryCinematic = cinematicVideos.slice(0, 6);
            const secondaryCinematic = cinematicVideos.slice(6);
            
            let curatedGridHTML = primaryCinematic.length > 0 ? `<div class="custom-video-grid cinematic-curated-grid" id="cinematic-curated-grid"></div>` : '';
            
            let secondaryHTML = '';
            if (secondaryCinematic.length > 0) {
                secondaryHTML = `
                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px dashed rgba(255,255,255,0.1);">
                        <div class="custom-video-grid commercial-grid" id="cinematic-secondary-grid"></div>
                    </div>
                `;
            }

            section.innerHTML = `
                <div class="section-group-header">
                    <div class="section-header-title">
                        <span class="pulse-icon" style="background-color: #60a5fa; box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7);"></span>
                        <h3>Cinematic</h3>
                    </div>
                    <p>Luxury campaigns, commercial showcases, and premium brand storytelling with high visual impact.</p>
                </div>
                ${curatedGridHTML}
                ${secondaryHTML}
            `;
            wrapper.appendChild(section);
            
            if (primaryCinematic.length > 0) {
                const gridEl = section.querySelector('#cinematic-curated-grid');
                primaryCinematic.forEach(vid => gridEl.appendChild(createCardElement(vid)));
            }
            if (secondaryCinematic.length > 0) {
                const gridEl = section.querySelector('#cinematic-secondary-grid');
                secondaryCinematic.forEach(vid => gridEl.appendChild(createCardElement(vid)));
            }
        }

        // Render Documentary Section
        if (documentaryVideos.length > 0) {
            const section = document.createElement('div');
            section.className = 'video-section-group documentary-group';
            
            const verticalItems = documentaryVideos.filter(v => v.isVertical);
            const filmItems = documentaryVideos.filter(v => !v.isVertical && (v.id === 'portfolio-reel' || v.id === 'tejantra-cinematic'));
            const commercialItems = documentaryVideos.filter(v => !v.isVertical && v.id !== 'portfolio-reel' && v.id !== 'tejantra-cinematic');
            
            let verticalGridHTML = verticalItems.length > 0 ? `<div class="custom-video-grid vertical-grid" id="doc-vertical-grid"></div>` : '';
            let filmGridHTML = filmItems.length > 0 ? `<div class="custom-video-grid long-form-grid" id="doc-film-grid" style="margin-top: 16px;"></div>` : '';
            let commercialGridHTML = commercialItems.length > 0 ? `<div class="custom-video-grid commercial-grid" id="doc-commercial-grid" style="margin-top: 16px;"></div>` : '';

            section.innerHTML = `
                <div class="section-group-header">
                    <div class="section-header-title">
                        <span class="classic-icon" style="background-color: #fbbf24; box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7);"></span>
                        <h3>Documentary</h3>
                    </div>
                    <p>Story-driven edits, long-form narrative content, and testimonial-based brand essays.</p>
                </div>
                ${verticalGridHTML}
                ${filmGridHTML}
                ${commercialGridHTML}
            `;
            wrapper.appendChild(section);
            
            if (verticalItems.length > 0) {
                const gridEl = section.querySelector('#doc-vertical-grid');
                verticalItems.forEach(vid => gridEl.appendChild(createCardElement(vid)));
            }
            if (filmItems.length > 0) {
                const gridEl = section.querySelector('#doc-film-grid');
                filmItems.forEach(vid => gridEl.appendChild(createCardElement(vid)));
            }
            if (commercialItems.length > 0) {
                const gridEl = section.querySelector('#doc-commercial-grid');
                commercialItems.forEach(vid => gridEl.appendChild(createCardElement(vid)));
            }
        }

        // Render Before & After Section
        if (beforeAfterVideos.length > 0) {
            const section = document.createElement('div');
            section.className = 'video-section-group before-after-group';
            
            section.innerHTML = `
                <div class="section-group-header">
                    <div class="section-header-title">
                        <span class="pulse-icon" style="background-color: #34d399; box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);"></span>
                        <h3>Before & After</h3>
                    </div>
                    <p>Demonstrating the raw-to-refined transformation of marketing assets through pace, sound design, and graphics.</p>
                </div>
                <div class="custom-video-grid vertical-grid" id="before-after-grid-element"></div>
            `;
            wrapper.appendChild(section);
            
            const gridEl = section.querySelector('#before-after-grid-element');
            beforeAfterVideos.forEach(vid => gridEl.appendChild(createCardElement(vid)));
        }

        // Render Events & BTS Section
        if (eventsBtsVideos.length > 0) {
            const section = document.createElement('div');
            section.className = 'video-section-group events-bts-group';
            
            section.innerHTML = `
                <div class="section-group-header">
                    <div class="section-header-title">
                        <span class="classic-icon" style="background-color: #8b5cf6; box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);"></span>
                        <h3>Events & BTS</h3>
                    </div>
                    <p>Behind-the-scenes engineering and stage highlights capturing the raw energy of live productions.</p>
                </div>
                <div class="custom-video-grid vertical-grid" id="events-bts-grid-element"></div>
            `;
            wrapper.appendChild(section);
            
            const gridEl = section.querySelector('#events-bts-grid-element');
            eventsBtsVideos.forEach(vid => gridEl.appendChild(createCardElement(vid)));
        }

        if (filtered.length === 0) {
            wrapper.innerHTML = `
                <div style="text-align: center; padding: 60px; color: #64748b; border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px; max-width: 1200px; margin: 0 auto;">
                    <h3>No videos found</h3>
                    <p>No clips available in this category yet.</p>
                </div>
            `;
        }
    };

    // Global Modal state declarations to ensure strict stability and prevent event listener memory leaks
    let videoModal = null;
    let closeBtn = null;
    let videoPlayer = null;
    let iframePlayer = null;
    let videoContainer = null;
    let ytPlayer = null;
    let closeTimeout = null;
    let isModalEventBound = false;

    const cleanPlayers = () => {
        if (ytPlayer) {
            try {
                ytPlayer.destroy();
            } catch(e) {
                console.log("Error destroying YT player in cleanPlayers:", e);
            }
            ytPlayer = null;
        }
        const vp = document.getElementById('modal-video-player');
        if (vp) {
            try {
                vp.pause();
                vp.src = "";
                vp.load();
            } catch(e) {}
            vp.remove();
        }
        const ip = document.getElementById('modal-iframe-player');
        if (ip) ip.remove();
        videoPlayer = null;
        iframePlayer = null;
    };

    const modalVideoController = {
        playPause: () => {
            if (videoPlayer) {
                if (videoPlayer.paused) {
                    videoPlayer.play().catch(() => {});
                } else {
                    videoPlayer.pause();
                }
            } else if (ytPlayer && typeof ytPlayer.getPlayerState === 'function') {
                try {
                    const state = ytPlayer.getPlayerState();
                    if (state === 1) { // PLAYING
                        ytPlayer.pauseVideo();
                    } else {
                        ytPlayer.playVideo();
                    }
                } catch (e) {
                    console.log("YT Player State check failed:", e);
                }
            } else if (iframePlayer) {
                // Direct postMessage control to YouTube iframe (100% reliable fallback)
                try {
                    const targetWindow = iframePlayer.contentWindow;
                    if (targetWindow) {
                        if (window.isYtPlaying === undefined) {
                            window.isYtPlaying = true; // starts as true due to autoplay=1
                        }
                        if (window.isYtPlaying) {
                            targetWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
                            window.isYtPlaying = false;
                        } else {
                            targetWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
                            window.isYtPlaying = true;
                        }
                    }
                } catch (e) {
                    console.log("Fallback YT control failed:", e);
                }
            }
        },
        toggleMute: () => {
            if (videoPlayer) {
                videoPlayer.muted = !videoPlayer.muted;
            } else if (ytPlayer && typeof ytPlayer.isMuted === 'function') {
                try {
                    if (ytPlayer.isMuted()) {
                        ytPlayer.unMute();
                    } else {
                        ytPlayer.mute();
                    }
                } catch (e) {
                    console.log("YT Mute toggle failed:", e);
                }
            } else if (iframePlayer) {
                // Fallback toggle mute
                try {
                    const targetWindow = iframePlayer.contentWindow;
                    if (targetWindow) {
                        if (window.isYtMuted === undefined) {
                            window.isYtMuted = false;
                        }
                        if (window.isYtMuted) {
                            targetWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
                            window.isYtMuted = false;
                        } else {
                            targetWindow.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
                            window.isYtMuted = true;
                        }
                    }
                } catch (e) {
                    console.log("Fallback YT mute failed:", e);
                }
            }
        },
        toggleFullscreen: () => {
            if (videoContainer) {
                if (!document.fullscreenElement) {
                    videoContainer.requestFullscreen().catch(err => {
                        console.log("Error attempting to enable fullscreen:", err);
                    });
                } else {
                    document.exitFullscreen();
                }
            }
        },
        seek: (offset) => {
            if (videoPlayer) {
                videoPlayer.currentTime = Math.max(0, Math.min(videoPlayer.duration || 0, videoPlayer.currentTime + offset));
            } else if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
                try {
                    const curTime = ytPlayer.getCurrentTime();
                    ytPlayer.seekTo(Math.max(0, curTime + offset), true);
                } catch (e) {
                    console.log("YT Seek failed:", e);
                }
            }
        }
    };

    const closeModal = () => {
        if (!videoModal) return;
        videoModal.classList.remove('active');
        if (window.lenis) { window.lenis.start(); }
        
        // Immediately pause sound to prevent 400ms leak during fade-out
        try {
            if (videoPlayer) {
                videoPlayer.pause();
            } else if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
                ytPlayer.pauseVideo();
            } else if (iframePlayer) {
                iframePlayer.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
            }
        } catch (e) {
            console.log("Error pausing video immediately on close:", e);
        }

        // Cancel any pending open/close timeout to prevent race conditions
        if (closeTimeout) {
            clearTimeout(closeTimeout);
        }
        
        closeTimeout = setTimeout(() => {
            if (ytPlayer) {
                try {
                    ytPlayer.destroy();
                } catch(e) {}
                ytPlayer = null;
            }
            cleanPlayers();
            closeTimeout = null;
        }, 400); // wait for fade out
    };

    // Keyboard media shortcuts (Single, leak-proof global event listener)
    const handleKeyDown = (e) => {
        if (!videoModal || !videoModal.classList.contains('active')) return;

        // Escape key to close modal
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeModal();
            return;
        }

        // Safety: Skip shortcuts if focused on text input fields
        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.tagName === 'SELECT' || 
            activeElement.isContentEditable
        )) {
            return;
        }

        const key = e.key.toLowerCase();
        if (key === ' ' || e.code === 'Space') {
            e.preventDefault();
            modalVideoController.playPause();
        } else if (key === 'k') {
            e.preventDefault();
            modalVideoController.playPause();
        } else if (key === 'm') {
            e.preventDefault();
            modalVideoController.toggleMute();
        } else if (key === 'f') {
            e.preventDefault();
            modalVideoController.toggleFullscreen();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            modalVideoController.seek(-5);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            modalVideoController.seek(5);
        }
    };

    const injectGallery = () => {
        const reactWorkSection = document.getElementById('work');
        if (!reactWorkSection) return false; // Wait until React renders it

        // Change the ID of the original React section and hide it
        reactWorkSection.id = 'work-react-original';
        reactWorkSection.style.display = 'none';

        const galleryHTML = `
            <section id="work" style="padding-top: 80px; padding-bottom: 80px; border-top: 1px solid rgba(255,255,255,0.05);">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="font-size: 40px; color: white; font-weight: 800; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1px;">Portfolio</h2>
                    <p style="color: #94a3b8; font-size: 16px; max-width: 600px; margin: 10px auto 0;">High-Converting Ad Creatives & Cinematic Brand Films</p>
                </div>
                
                <!-- Filter Bar -->
                <div class="portfolio-filter-container">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="cinematic">Cinematic</button>
                    <button class="filter-btn" data-filter="documentary">Documentary</button>
                    <button class="filter-btn" data-filter="before-after">Before & After</button>
                    <button class="filter-btn" data-filter="events-bts">Events & BTS</button>
                </div>
                
                <!-- Video Sections Wrapper -->
                <div id="video-sections-wrapper" class="video-sections-wrapper"></div>
            </section>
        `;

        const modalHTML = `
            <!-- Cinematic Modal -->
            <div id="video-modal">
                <div class="video-container" id="modal-video-container">
                    <button class="modal-close-btn" id="modal-close-btn">&times;</button>
                </div>
            </div>
        `;

        // Insert our section right where the old one was
        reactWorkSection.parentNode.insertBefore(document.createRange().createContextualFragment(galleryHTML), reactWorkSection);

        const wrapper = document.getElementById('video-sections-wrapper');
        if (wrapper) {
            wrapper.classList.remove('saas-reveal');
        }

        // Always recreate modal directly on body to ensure correct stacking context and latest markup
        const existingModal = document.getElementById('video-modal');
        if (existingModal) {
            existingModal.remove();
        }
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Initialize Grid
        generateVideoGrid('all');

        // Filter Logic
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                generateVideoGrid(e.target.getAttribute('data-filter'));
            });
        });

        // --- 3. MODAL LOGIC ---
        // Dynamically insert YouTube Iframe API if not already present
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Retrieve elements and assign to outer-scope variables
        videoModal = document.getElementById('video-modal');
        closeBtn = document.getElementById('modal-close-btn');
        videoContainer = document.getElementById('modal-video-container');
        videoPlayer = null;
        iframePlayer = null;

        // Re-bind listeners strictly once to avoid duplicates and leaks
        if (!isModalEventBound) {
            closeBtn.addEventListener('click', closeModal);
            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) {
                    closeModal();
                }
            });
            document.addEventListener('keydown', handleKeyDown);
            isModalEventBound = true;
        }

        // Expose dynamic video player
        window.openCinematicVideo = (videoUrl, isShortForm = false) => {
            // Cancel any pending closeTimeout to prevent race conditions on fast re-opening
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }

            // Always clean up any existing player elements first
            cleanPlayers();

            if (videoContainer) {
                if (isShortForm) {
                    videoContainer.classList.add('short-form');
                } else {
                    videoContainer.classList.remove('short-form');
                }
            }
            
            const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
            const isVimeo = videoUrl.includes('vimeo.com');

            // Reset local YT state
            window.isYtPlaying = true;
            window.isYtMuted = false;

            if (isYouTube) {
                let embedUrl = "";
                let ytId = "";
                if (videoUrl.includes('youtu.be/')) {
                    ytId = videoUrl.split('youtu.be/').pop().split('?')[0];
                } else if (videoUrl.includes('shorts/')) {
                    ytId = videoUrl.split('shorts/').pop().split('?')[0];
                } else if (videoUrl.includes('watch?v=')) {
                    const parts = videoUrl.split('watch?v=');
                    if (parts.length > 1) {
                        ytId = parts[1].split('&')[0];
                    }
                } else if (videoUrl.includes('embed/')) {
                    ytId = videoUrl.split('embed/').pop().split('?')[0];
                }
                embedUrl = "https://www.youtube.com/embed/" + ytId + "?autoplay=1&rel=0&enablejsapi=1&origin=" + encodeURIComponent(window.location.origin);
                
                // Dynamically create iframe player
                iframePlayer = document.createElement('iframe');
                iframePlayer.id = 'modal-iframe-player';
                iframePlayer.style.cssText = 'border:none; width:100%; height:100%; display:block;';
                iframePlayer.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                iframePlayer.setAttribute('allowfullscreen', '');
                iframePlayer.src = embedUrl;
                
                videoContainer.appendChild(iframePlayer);

                // Initialize YT API Player Instance
                if (window.YT && window.YT.Player) {
                    if (ytPlayer) {
                        try { ytPlayer.destroy(); } catch(e) {}
                    }
                    ytPlayer = new window.YT.Player('modal-iframe-player');
                }
            } else if (isVimeo) {
                let vimeoId = videoUrl.split('/').pop().split('?')[0];
                let embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
                
                // Dynamically create iframe player
                iframePlayer = document.createElement('iframe');
                iframePlayer.id = 'modal-iframe-player';
                iframePlayer.style.cssText = 'border:none; width:100%; height:100%; display:block;';
                iframePlayer.allow = 'autoplay; fullscreen; picture-in-picture';
                iframePlayer.setAttribute('allowfullscreen', '');
                iframePlayer.src = embedUrl;
                
                videoContainer.appendChild(iframePlayer);
            } else {
                // Dynamically create HTML5 video player
                videoPlayer = document.createElement('video');
                videoPlayer.id = 'modal-video-player';
                videoPlayer.controls = true;
                videoPlayer.style.cssText = 'width:100%; height:100%; display:block; object-fit: contain;';
                videoPlayer.src = videoUrl;
                
                videoContainer.appendChild(videoPlayer);
                videoPlayer.play().catch(e => console.log("Auto-play prevented", e));
            }

            if (videoModal) {
                videoModal.classList.add('active');
                if (window.lenis) { window.lenis.stop(); }
                videoModal.setAttribute('tabindex', '-1');
                videoModal.style.outline = 'none';
                videoModal.focus();
            }
        };

        return true;
    };

    // --- CLIENT STORIES SECTION OVERRIDE WITH DYNAMIC CAROUSEL ---
    const injectTestimonials = () => {
        const reactTestimonialsSection = document.getElementById('testimonials');
        if (!reactTestimonialsSection) return false;

        const testimonialData = [
            {
                rating: 5.0,
                quote: "“The reels came out way better than expected. Clean edits, good pacing, and premium overall feel.”",
                name: "Rajat Khanna",
                role: "Fashion Brand Owner"
            },
            {
                rating: 4.5,
                quote: "“Very smooth communication and fast work delivery. The final video matched our brand style nicely.”",
                name: "Kriti Sharma",
                role: "Streetwear Startup Founder"
            },
            {
                rating: 5.0,
                quote: "“Utkarsh understands short-form content really well. The hooks and transitions were on point.”",
                name: "Kunal Arora",
                role: "Content Creator"
            },
            {
                rating: 4.0,
                quote: "“Loved the cinematic approach. Simple, classy, and engaging without trying too hard.”",
                name: "Anjali Sethi",
                role: "Lifestyle Brand Director"
            },
            {
                rating: 5.0,
                quote: "“The edit gave our campaign a much more professional look. Definitely worth working with him.”",
                name: "Aryan Malhotra",
                role: "Marketing Lead"
            },
            {
                rating: 4.5,
                quote: "“What I liked most was the attention to detail. Music sync and visuals felt very polished.”",
                name: "Riya Verma",
                role: "Creative Strategist"
            },
            {
                rating: 4.0,
                quote: "“Quick revisions, good understanding of the brief, and overall a very smooth experience.”",
                name: "Dev Bansal",
                role: "Apparel Brand Founder"
            },
            {
                rating: 5.0,
                quote: "“The final output looked like a proper ad campaign. Really happy with the quality.”",
                name: "Pooja Kapoor",
                role: "Brand Owner"
            },
            {
                rating: 4.5,
                quote: "“Didn’t overcomplicate the edit. Clean storytelling and modern visuals throughout.”",
                name: "Aakash Mehra",
                role: "Social Media Manager"
            },
            {
                rating: 5.0,
                quote: "“You can tell he actually studies current trends and brand aesthetics. The reels performed great too.”",
                name: "Neha Anand",
                role: "D2C Brand Founder"
            }
        ];

        const generateStarsHTML = (rating, idx) => {
            let stars = '';
            const fullStars = Math.floor(rating);
            const hasHalf = rating % 1 !== 0;
            
            for (let i = 0; i < 5; i++) {
                if (i < fullStars) {
                    stars += '<svg class="star-icon" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" style="width:16px; height:16px; display:inline-block; margin-right:1px;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
                } else if (i === fullStars && hasHalf) {
                    stars += '<svg class="star-icon" viewBox="0 0 24 24" style="width:16px; height:16px; display:inline-block; margin-right:1px;"><defs><linearGradient id="half-grad-' + idx + '-' + i + '"><stop offset="50%" stop-color="#fbbf24"/><stop offset="50%" stop-color="rgba(255,255,255,0.1)"/></linearGradient></defs><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="url(#half-grad-' + idx + '-' + i + ')" stroke="#fbbf24" stroke-width="0.5"/></svg>';
                } else {
                    stars += '<svg class="star-icon" viewBox="0 0 24 24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" style="width:16px; height:16px; display:inline-block; margin-right:1px;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>';
                }
            }
            return stars;
        };

        const cardsHTML = testimonialData.map((item, idx) => {
            return `
                <div class="testimonial-card">
                    <div>
                        <div class="rating-container" style="display:flex; align-items:center; gap:8px; margin-bottom: 15px;">
                            <div class="stars-wrapper" style="display:flex; gap:2px; align-items:center;">
                                ${generateStarsHTML(item.rating, idx)}
                            </div>
                        </div>
                        <svg class="mb-4 opacity-20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; display:block;"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 1 1 .691 0 2.193-.028 3.736-2.028 5.736L3 21zM17 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 1 1 .691 0 2.193-.028 3.736-2.028 5.736L17 21z"/></svg>
                        <p class="testimonial-quote" style="margin: 10px 0 15px 0;">${item.quote}</p>
                    </div>
                    <div style="margin-top:20px; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 15px;">
                        <p style="font-size:14px; font-weight:700; color:white; margin:0; font-family:inherit;">${item.name}</p>
                        <p style="font-size:12px; color:#64748b; margin:2px 0 0 0; font-family:inherit;">${item.role}</p>
                    </div>
                </div>
            `;
        }).join('');

        const testimonialsHTML = `
            <section id="testimonials" class="relative py-24 md:py-32" style="background: transparent; overflow: hidden; border-top: 1px solid rgba(255,255,255,0.04);">
                <!-- Decorative background glow -->
                <div class="testimonials-glow" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(59,130,246,0.03) 0%, rgba(139,92,246,0.02) 50%, rgba(0,0,0,0) 100%); pointer-events: none; filter: blur(80px); z-index: 1;"></div>
                
                <div class="max-w-7xl mx-auto px-6 md:px-10" style="position: relative; z-index: 2;">
                    <div style="display:flex; flex-direction:column; align-items:center; text-align: center; margin-bottom: 60px;">
                        <h2 style="font-size: clamp(2rem, 4vw, 3.2rem); font-family: inherit; font-weight: 900; letter-spacing: -1px; line-height:1.1; color: white; margin: 0 0 12px 0; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Client Stories</h2>
                        <p style="color: #64748b; font-size: 16px; max-width: 580px; margin: 0 auto; line-height: 1.6;">Hear directly from founders, content creators, and brand owners who scaled their channels with our short-form edits.</p>
                    </div>
                    
                    <!-- Carousel Viewport -->
                    <div class="carousel-viewport" style="width: 100%; overflow: hidden; padding: 10px 0;">
                        <div class="carousel-track" id="testimonial-carousel-track" style="display: flex; gap: 24px; transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); will-change: transform;">
                            ${cardsHTML}
                        </div>
                    </div>

                    <!-- Navigation Controls -->
                    <div class="carousel-controls" style="display: flex; align-items: center; justify-content: space-between; margin-top: 40px;">
                        <!-- Dots -->
                        <div class="carousel-dots" id="carousel-dots-container" style="display: flex; gap: 8px; align-items:center;"></div>
                        
                        <!-- Buttons -->
                        <div style="display: flex; gap: 12px;">
                            <button class="carousel-nav-btn prev" id="carousel-prev-btn" aria-label="Previous testimonials" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <button class="carousel-nav-btn next" id="carousel-next-btn" aria-label="Next testimonials" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq" class="relative py-24 md:py-32" style="background: linear-gradient(180deg, #090d16 0%, #0d1527 100%); overflow: hidden; border-top: 1px solid rgba(255,255,255,0.04);">
                <!-- Decorative background glow -->
                <div class="faq-glow" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(139,92,246,0.02) 0%, rgba(59,130,246,0.02) 50%, rgba(0,0,0,0) 100%); pointer-events: none; filter: blur(80px); z-index: 1;"></div>
                
                <div class="max-w-4xl mx-auto px-6 md:px-10" style="position: relative; z-index: 2;">
                    <div style="display:flex; flex-direction:column; align-items:center; text-align: center; margin-bottom: 60px;">
                        <h2 style="font-size: clamp(2rem, 4vw, 3.2rem); font-family: inherit; font-weight: 900; letter-spacing: -1px; line-height:1.1; color: white; margin: 0 0 12px 0; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">FAQs</h2>
                        <p style="color: #64748b; font-size: 16px; max-width: 580px; margin: 0 auto; line-height: 1.6;">Everything you might want to know before starting a project.</p>
                    </div>

                    <div class="faq-accordion-wrapper" style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
                        <!-- FAQ 1 -->
                        <div class="faq-item">
                            <button class="faq-trigger">
                                <span>What type of videos do you edit?</span>
                                <svg class="faq-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="faq-content">
                                <p>I create cinematic reels, commercial edits, fashion campaigns, YouTube Shorts, social media ads, and high-retention short-form content for creators and brands.</p>
                            </div>
                        </div>

                        <!-- FAQ 2 -->
                        <div class="faq-item">
                            <button class="faq-trigger">
                                <span>Can you help improve audience retention and engagement?</span>
                                <svg class="faq-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="faq-content">
                                <p>Yes. My editing style focuses on strong hooks, pacing, storytelling, sound design, and modern visuals designed to keep viewers watching longer.</p>
                            </div>
                        </div>

                        <!-- FAQ 3 -->
                        <div class="faq-item">
                            <button class="faq-trigger">
                                <span>Do you also help with content strategy and hooks?</span>
                                <svg class="faq-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="faq-content">
                                <p>Absolutely. Along with editing, I help structure content, improve hooks, and create videos that feel more engaging and performance-focused.</p>
                            </div>
                        </div>

                        <!-- FAQ 4 -->
                        <div class="faq-item">
                            <button class="faq-trigger">
                                <span>How long does delivery usually take?</span>
                                <svg class="faq-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="faq-content">
                                <p>Most short-form projects are delivered within 24–72 hours depending on the complexity and project requirements.</p>
                            </div>
                        </div>

                        <!-- FAQ 5 -->
                        <div class="faq-item">
                            <button class="faq-trigger">
                                <span>Do you offer revisions?</span>
                                <svg class="faq-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="faq-content">
                                <p>Yes. Revisions are included to ensure the final edit matches your vision, brand identity, and overall creative direction.</p>
                            </div>
                        </div>

                        <!-- FAQ 6 -->
                        <div class="faq-item">
                            <button class="faq-trigger">
                                <span>Can I hire you for long-term content editing?</span>
                                <svg class="faq-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="faq-content">
                                <p>Definitely. I work with creators, personal brands, and businesses on monthly content systems and long-term editing partnerships.</p>
                            </div>
                        </div>

                        <!-- FAQ 7 -->
                        <div class="faq-item">
                            <button class="faq-trigger">
                                <span>What software and workflow do you use?</span>
                                <svg class="faq-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="faq-content">
                                <p>I primarily use Adobe After Effects, Premiere Pro, Photoshop, and cinematic editing workflows combined with modern AI-assisted creative tools.</p>
                            </div>
                        </div>

                        <!-- FAQ 8 -->
                        <div class="faq-item">
                            <button class="faq-trigger">
                                <span>How can I start a project with you?</span>
                                <svg class="faq-chevron" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                            <div class="faq-content">
                                <p>You can contact me through Instagram, WhatsApp, or email with your project details, references, or goals and we can discuss the best approach for your content.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Replace the React testimonials section directly in-place
        reactTestimonialsSection.parentNode.replaceChild(document.createRange().createContextualFragment(testimonialsHTML), reactTestimonialsSection);

        // Slider Animation Scripting
        setTimeout(() => {
            const track = document.getElementById('testimonial-carousel-track');
            const prevBtn = document.getElementById('carousel-prev-btn');
            const nextBtn = document.getElementById('carousel-next-btn');
            const dotsContainer = document.getElementById('carousel-dots-container');
            if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

            let currentIndex = 0;
            const totalCards = testimonialData.length;
            
            const getCardsPerSlide = () => {
                if (window.innerWidth > 1024) return 3;
                if (window.innerWidth > 640) return 2;
                return 1;
            };

            const getMaxIndex = () => {
                return totalCards - getCardsPerSlide();
            };

            const renderDots = () => {
                dotsContainer.innerHTML = '';
                const maxIndex = getMaxIndex();
                for (let i = 0; i <= maxIndex; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
                    dot.style.width = i === currentIndex ? '24px' : '8px';
                    dot.style.height = '8px';
                    dot.style.borderRadius = '4px';
                    dot.style.background = i === currentIndex ? '#60a5fa' : 'rgba(255,255,255,0.15)';
                    dot.style.cursor = 'pointer';
                    dot.style.transition = 'all 0.3s ease';
                    dot.addEventListener('click', () => {
                        currentIndex = i;
                        updateCarousel();
                    });
                    dotsContainer.appendChild(dot);
                }
            };

            const updateCarousel = () => {
                const card = track.querySelector('.testimonial-card');
                if (!card) return;
                const cardWidth = card.getBoundingClientRect().width;
                const gap = 24;
                const offset = currentIndex * (cardWidth + gap);
                track.style.transform = 'translateX(-' + offset + 'px)';
                
                const dots = dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add('active');
                        dot.style.width = '24px';
                        dot.style.background = '#60a5fa';
                    } else {
                        dot.classList.remove('active');
                        dot.style.width = '8px';
                        dot.style.background = 'rgba(255,255,255,0.15)';
                    }
                });
            };

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                } else {
                    currentIndex = getMaxIndex();
                    updateCarousel();
                }
            });

            nextBtn.addEventListener('click', () => {
                const maxIndex = getMaxIndex();
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                } else {
                    currentIndex = 0;
                    updateCarousel();
                }
            });

            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const maxIndex = getMaxIndex();
                    if (currentIndex > maxIndex) {
                        currentIndex = maxIndex;
                    }
                    renderDots();
                    updateCarousel();
                }, 100);
            });

            let autoPlayInterval = null;
            let isTestimonialVisible = false;

            const startAutoPlay = () => {
                if (autoPlayInterval) clearInterval(autoPlayInterval);
                autoPlayInterval = setInterval(() => {
                    if (!isTestimonialVisible) return; // ONLY cycle when section is visible!
                    const maxIndex = getMaxIndex();
                    if (currentIndex < maxIndex) {
                        currentIndex++;
                    } else {
                        currentIndex = 0;
                    }
                    updateCarousel();
                }, 5000);
            };

            const resetAutoPlay = () => {
                if (autoPlayInterval) clearInterval(autoPlayInterval);
                startAutoPlay();
            };

            // Intersection Observer to track testimonial visibility and save CPU/GPU cycles
            const testimonialSec = document.getElementById('testimonials');
            if (testimonialSec) {
                const testimonialObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        isTestimonialVisible = entry.isIntersecting;
                    });
                }, { threshold: 0.02 });
                testimonialObserver.observe(testimonialSec);
            }

            prevBtn.addEventListener('click', resetAutoPlay);
            nextBtn.addEventListener('click', resetAutoPlay);

            startAutoPlay();

            renderDots();
            updateCarousel();

            // FAQ Accordion Interaction Logic
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const trigger = item.querySelector('.faq-trigger');
                const content = item.querySelector('.faq-content');
                if (!trigger || !content) return;

                trigger.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            const otherContent = otherItem.querySelector('.faq-content');
                            if (otherContent) {
                                otherContent.style.maxHeight = otherContent.scrollHeight + 'px';
                                otherContent.offsetHeight; // Force reflow
                                otherItem.classList.remove('active');
                                otherContent.style.maxHeight = '0px';
                            }
                        }
                    });

                    // Toggle active item
                    if (isActive) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        content.offsetHeight; // Force reflow
                        item.classList.remove('active');
                        content.style.maxHeight = '0px';
                    } else {
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            });
        }, 100);

        return true;
    };

    const injectNavbar = () => {
        const nav = document.querySelector('nav');
        if (!nav) return false;

        // Check if verified tick is already injected to avoid duplicates
        if (!nav.querySelector('.verified-tick')) {
            const brandSpan = nav.querySelector('span.text-sm, span.text-base');
            if (brandSpan) {
                const innerSpan = brandSpan.querySelector('span') || brandSpan;
                // Append the blue verified badge SVG
                const verifiedTickHTML = `
                    <svg class="verified-tick" viewBox="0 0 24 24" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-left: 5px; flex-shrink: 0; filter: drop-shadow(0 0 4px rgba(59,130,246,0.5));">
                        <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.7l-3.61.81.34 3.68L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2 3.4-1.46 3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" fill="#3b82f6"/>
                    </svg>
                `;
                innerSpan.insertAdjacentHTML('beforeend', verifiedTickHTML);
            }
        }

        // Setup scroll listener to add/remove scrolled class
        const handleScroll = () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        // Dynamic Menu Updates (Services – Portfolio – About – Testimonials – FAQs sequence)
        const updateMenu = () => {
            // 1. Desktop Menu Rebuilder
            const desktopMenu = nav.querySelector('.hidden.md\\:flex, div.hidden');
            if (desktopMenu) {
                const servicesLink = `<a href="#services" class="text-sm font-medium relative group" style="color: rgba(255, 255, 255, 0.5);">Services<span class="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300" style="background: rgb(59, 130, 246);"></span></a>`;
                const portfolioLink = `<a href="#work" class="text-sm font-medium relative group" style="color: rgba(255, 255, 255, 0.5);">Portfolio<span class="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300" style="background: rgb(59, 130, 246);"></span></a>`;
                const aboutLink = `<a href="#about" class="text-sm font-medium relative group" style="color: rgba(255, 255, 255, 0.5);">About<span class="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300" style="background: rgb(59, 130, 246);"></span></a>`;
                const testimonialsLink = `<a href="#testimonials" class="text-sm font-medium relative group" style="color: rgba(255, 255, 255, 0.5);">Testimonials<span class="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300" style="background: rgb(59, 130, 246);"></span></a>`;
                const faqsLink = `<a href="#faq" class="text-sm font-medium relative group" style="color: rgba(255, 255, 255, 0.5);">FAQs<span class="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300" style="background: rgb(59, 130, 246);"></span></a>`;
                
                const newMenuHTML = `${servicesLink}${portfolioLink}${aboutLink}${testimonialsLink}${faqsLink}`;
                
                if (desktopMenu.innerHTML !== newMenuHTML) {
                    desktopMenu.innerHTML = newMenuHTML;
                }
            }

            // 2. Mobile Menu / Overlay Links
            const mobileOverlay = document.querySelector('[class*="mobile-menu"], [class*="menu-overlay"], div[class*="Menu"]');
            if (mobileOverlay) {
                const linksContainer = mobileOverlay.querySelector('.flex.flex-col') || mobileOverlay;
                if (linksContainer) {
                    const mServices = `<a href="#services" class="block py-2 text-base font-medium text-white/70 hover:text-white">Services</a>`;
                    const mPortfolio = `<a href="#work" class="block py-2 text-base font-medium text-white/70 hover:text-white">Portfolio</a>`;
                    const mAbout = `<a href="#about" class="block py-2 text-base font-medium text-white/70 hover:text-white">About</a>`;
                    const mTestimonials = `<a href="#testimonials" class="block py-2 text-base font-medium text-white/70 hover:text-white">Testimonials</a>`;
                    const mFaqs = `<a href="#faq" class="block py-2 text-base font-medium text-white/70 hover:text-white">FAQs</a>`;
                    
                    const newMobileLinksHTML = `${mServices}${mPortfolio}${mAbout}${mTestimonials}${mFaqs}`;
                    
                    const navContainer = mobileOverlay.querySelector('nav') || mobileOverlay;
                    if (navContainer && navContainer !== mobileOverlay) {
                        if (navContainer.innerHTML !== newMobileLinksHTML) {
                            navContainer.innerHTML = newMobileLinksHTML;
                        }
                    }
                }
            }
        };

        // Run menu updates at key stages to capture final React hydration without infinite intervals.
        updateMenu();
        setTimeout(updateMenu, 200);
        setTimeout(updateMenu, 800);
        setTimeout(updateMenu, 2500);
        setTimeout(updateMenu, 6000);

        return true;
    };



    const injectFooter = () => {
        const originalFooter = document.querySelector('footer');
        if (!originalFooter) return false;

        // Check if our cinematic footer is already injected
        if (originalFooter.classList.contains('cinematic-footer')) return true;

        const footerHTML = `
            <footer class="cinematic-footer" style="position: relative; overflow: hidden; border-top: 1px solid rgba(255, 255, 255, 0.04); background: #050811; width: 100%;">
                <!-- Subtle ambient blue lighting gradient in background -->
                <div class="footer-ambient-glow" style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 600px; height: 250px; background: radial-gradient(circle, rgba(59,130,246,0.04) 0%, rgba(139,92,246,0.01) 70%, rgba(0,0,0,0) 100%); pointer-events: none; filter: blur(60px); z-index: 1;"></div>
                
                <!-- Subtle cinematic noise/particle overlay -->
                <div class="footer-noise-overlay" style="position: absolute; inset: 0; background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.012%22/%3E%3C/svg%3E'); pointer-events: none; z-index: 1; opacity: 0.7;"></div>

                <div class="max-w-5xl mx-auto px-6 md:px-10 py-12" style="position: relative; z-index: 2;">
                    <!-- Top row: logo, social links, back to top -->
                    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                        <!-- Logo with verified badge nested next to Visuals and soft glow box-shadow -->
                        <div class="flex items-center gap-2.5">
                            <div class="relative w-8 h-8 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg, rgb(59, 130, 246), rgb(6, 182, 212)); box-shadow: 0 0 20px rgba(59, 130, 246, 0.45); filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.35));">
                                <span class="text-[11px] font-black text-white relative z-10">UV</span>
                                <div class="absolute inset-0 rounded-lg" style="background: linear-gradient(135deg, rgb(59, 130, 246), rgb(6, 182, 212)); filter: blur(8px); opacity: 0.6;"></div>
                            </div>
                            <span class="text-sm font-bold text-white tracking-tight">Utkarsh <span style="color: rgb(59, 130, 246); position: relative; display: inline-flex; align-items: center; gap: 4px;">Visuals <svg class="verified-tick" viewBox="0 0 24 24" style="width: 13px; height: 13px; fill: #3b82f6; display: inline-block; filter: drop-shadow(0 0 3px rgba(59,130,246,0.6));"><path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.7l-3.61.81.34 3.68L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2 3.4-1.46 3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" fill="#3b82f6"/></svg></span></span>
                        </div>

                        <!-- Footer email link -->
                        <div class="flex items-center gap-8 footer-social-links">
                            <a href="mailto:visualsbyutk4rsh@gmail.com" class="footer-social-link" style="display: inline-flex; align-items: center; gap: 6px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                visualsbyutk4rsh@gmail.com
                            </a>
                        </div>

                        <!-- Tighter, cleaner Back to Top button -->
                        <button class="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition-all duration-300 back-to-top-btn" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" style="background: none; border: none; cursor: pointer; outline: none; padding: 0;">
                            Back to Top ↑
                        </button>
                    </div>

                    <!-- Copyright section with proper line divider and tight padding -->
                    <div class="mt-10 pt-6 text-center footer-copyright-container" style="border-top: 1px solid rgba(255, 255, 255, 0.04);">
                        <p class="text-[10px] tracking-widest" style="color: rgba(255, 255, 255, 0.22); margin: 0; font-weight: 500;">
                            © 2026 Utkarsh Visuals
                        </p>
                    </div>
                </div>
            </footer>
        `;

        // Replace footer in DOM
        originalFooter.outerHTML = footerHTML;
        return true;
    };

    const injectServices = () => {
        const servicesSection = document.getElementById('services');
        if (!servicesSection) return false;
        if (servicesSection.dataset.premiumInjected === 'true') return true;

        servicesSection.style.cssText = `
            position: relative;
            overflow: hidden;
            background: linear-gradient(180deg, #060a14 0%, #080c18 50%, #060a14 100%);
            padding: 120px 0;
            border-top: 1px solid rgba(255,255,255,0.035);
        `;
        servicesSection.dataset.premiumInjected = 'true';

        const makeCard = (floatClass, glowKey, iconSVG, psych, psychColor, title, desc) => `
            <div class="svc-card" data-glow="${glowKey}">
                <div class="svc-floater ${floatClass}">
                    <div class="svc-card-glow svc-glow-${glowKey}"></div>
                    <div class="svc-card-inner">
                        <div class="svc-icon-box svc-icon-${glowKey}">${iconSVG}</div>
                        <span class="svc-psych" style="color:${psychColor};">${psych}</span>
                        <h3 class="svc-card-title">${title}</h3>
                        <p class="svc-card-desc">${desc}</p>
                    </div>
                    <div class="svc-card-sweep"></div>
                </div>
            </div>`;

        const cards = [
            makeCard('svc-fa', 'blue',
                `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
                'Attention + Virality', '#60a5fa', 'Short-Form Editing',
                'High-retention reels and short-form content designed to stop the scroll, maximize watch time, and keep audiences engaged.'),
            makeCard('svc-fb', 'purple',
                `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`,
                'ROI + Brand Value', '#a78bfa', 'Commercial Ad Creatives',
                'Cinematic ad creatives engineered for stronger conversions, premium positioning, and modern brand storytelling.'),
            makeCard('svc-fc', 'cyan',
                `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
                'Visual Impact + Brand Presence', '#22d3ee', 'Graphic Designing',
                'Modern visual designs crafted for stronger brand identity, premium social presence, and visually engaging digital experiences.'),
            makeCard('svc-fa', 'emerald',
                `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
                'Growth + Results', '#34d399', 'Performance Marketing',
                'Scalable marketing systems focused on reach, lead generation, and measurable business growth through Tejantra.'),
            makeCard('svc-fb', 'violet',
                `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"></path></svg>`,
                'Luxury + Recognition', '#c4b5fd', 'Brand Identity & Creative Direction',
                'Visual systems and creative direction that help brands look memorable, premium, and instantly recognizable online.'),
            makeCard('svc-fc', 'royal',
                `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
                'Expertise + Long-Term Value', '#93c5fd', 'Content Strategy',
                'Strategic hooks, content structuring, and audience-focused planning designed for long-term organic growth and retention.')
        ];

        servicesSection.innerHTML = `
            <div class="svc-bg-glow" aria-hidden="true"></div>
            <div class="svc-bg-glow2" aria-hidden="true"></div>
            <div class="max-w-7xl mx-auto px-6 md:px-12" style="position:relative;z-index:2;">
                <div style="text-align:center; margin-bottom: 80px;">
                    <span class="svc-eyebrow">
                        <span class="svc-eyebrow-line"></span>
                        What I Deliver
                        <span class="svc-eyebrow-line"></span>
                    </span>
                    <h2 class="svc-heading">What I Deliver</h2>
                    <p class="svc-subheading">Creative systems engineered for attention, authority, growth, and premium digital presence.</p>
                </div>
                <div class="svc-grid">${cards.join('')}</div>
            </div>`;

        // Smooth magnetic 3D tilt via requestAnimationFrame
        setTimeout(() => {
            const svcCards = servicesSection.querySelectorAll('.svc-card');
            svcCards.forEach(card => {
                let rafId = null;
                let targetRX = 0, targetRY = 0, targetTY = 0;
                let currentRX = 0, currentRY = 0, currentTY = 0;
                let isHovering = false;

                const lerp = (a, b, t) => a + (b - a) * t;

                const animate = () => {
                    currentRX = lerp(currentRX, targetRX, 0.09);
                    currentRY = lerp(currentRY, targetRY, 0.09);
                    currentTY = lerp(currentTY, targetTY, 0.09);
                    card.style.transform = `perspective(900px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) translateY(${currentTY}px)`;
                    card.style.boxShadow = isHovering
                        ? `0 25px 50px rgba(0,0,0,0.55), 0 0 30px rgba(59,130,246,0.07)`
                        : '';
                    if (Math.abs(currentRX - targetRX) > 0.01 || Math.abs(currentRY - targetRY) > 0.01 || Math.abs(currentTY - targetTY) > 0.01) {
                        rafId = requestAnimationFrame(animate);
                    } else {
                        rafId = null;
                    }
                };

                const startAnimate = () => {
                    if (!rafId) rafId = requestAnimationFrame(animate);
                };

                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;
                    targetRX = ((y - cy) / cy) * -7;
                    targetRY = ((x - cx) / cx) * 7;
                    targetTY = -10;
                    isHovering = true;
                    startAnimate();
                });

                card.addEventListener('mouseleave', () => {
                    targetRX = 0;
                    targetRY = 0;
                    targetTY = 0;
                    isHovering = false;
                    startAnimate();
                });
            });
        }, 300);

        return true;
    };

    // Run on interval to override React when it mounts
    let galleryInjected = false;
    let testimonialsInjected = false;
    let navbarInjected = false;
    let footerInjected = false;
    let servicesInjected = false;

    const injectInterval = setInterval(() => {
        if (!galleryInjected) {
            galleryInjected = injectGallery();
        } else {
            // Failsafe: if gallery is injected but wrapper is empty, populate it
            const wrapper = document.getElementById('video-sections-wrapper');
            if (wrapper && wrapper.children.length === 0) {
                const activeBtn = document.querySelector('.filter-btn.active');
                const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
                generateVideoGrid(activeFilter);
            }
        }
        if (!testimonialsInjected) {
            testimonialsInjected = injectTestimonials();
        }
        if (!navbarInjected) {
            navbarInjected = injectNavbar();
        }
        if (!servicesInjected) {
            servicesInjected = injectServices();
        }
        if (!footerInjected) {
            footerInjected = injectFooter();
        }
        if (galleryInjected && testimonialsInjected && navbarInjected && footerInjected && servicesInjected) {
            // Check if gallery is populated before clearing interval to prevent race conditions during hydration
            const wrapper = document.getElementById('video-sections-wrapper');
            if (wrapper && wrapper.children.length > 0) {
                clearInterval(injectInterval);
            }
        }
    }, 100);

    // Stop after 15 seconds to avoid memory leaks
    setTimeout(() => clearInterval(injectInterval), 15000);

    // Continuous MutationObserver routing and hydration failsafe for Portfolio grid
    const setupGalleryObserver = () => {
        const observer = new MutationObserver(() => {
            const wrapper = document.getElementById('video-sections-wrapper');
            if (wrapper && wrapper.children.length === 0) {
                const activeBtn = document.querySelector('.filter-btn.active');
                const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
                console.log('[Portfolio] Wrapper cleared by React hydration, re-populating category:', activeFilter);
                generateVideoGrid(activeFilter);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };
    setupGalleryObserver();
});
