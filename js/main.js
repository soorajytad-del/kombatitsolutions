// 0. Preloader
// 0. Preloader (First Time Only)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        if (!sessionStorage.getItem('kombatVisited')) {
            // Force it to stay visible long enough for animation to play
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);  // Match CSS transition transform duration
            }, 2600); 
            sessionStorage.setItem('kombatVisited', 'true');
        } else {
            // Hide immediately if already visited in this session
            preloader.style.display = 'none';
        }
    }
});

// 0.5 Dark Theme Configuration
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');

    function syncIcon(theme) {
        if(theme === 'dark') {
            if(darkIcon) darkIcon.style.display = 'none';
            if(lightIcon) lightIcon.style.display = 'inline-block';
        } else {
            if(darkIcon) darkIcon.style.display = 'inline-block';
            if(lightIcon) lightIcon.style.display = 'none';
        }
    }
    
    // Sync UI with current theme state loaded via head script
    syncIcon(document.documentElement.getAttribute('data-theme') || 'light');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('kombatTheme', targetTheme);
            syncIcon(targetTheme);

            // Play a synthetic futuristic UI beep
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    const ctx = new AudioCtx();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    
                    osc.type = 'sine';
                    // Higher pitch for Light (800hz), Lower pitch for Dark (300hz)
                    const freq = targetTheme === 'light' ? 800 : 300;
                    osc.frequency.setValueAtTime(freq, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + 0.1);
                    
                    gain.gain.setValueAtTime(0.1, ctx.currentTime); // Low volume so it's pleasant
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                    
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.1);
                }
            } catch(e) {}
        });
    }

    // 0.6 Navigation Beep Sound
    const playNavBeep = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                const ctx = new AudioCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                // Very quick, crisp tech-click
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1200, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
                
                gain.gain.setValueAtTime(0.04, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.05);
            }
        } catch(e) {}
    };

    const soundItems = document.querySelectorAll('.nav-links a, .btn');
    soundItems.forEach(item => {
        item.addEventListener('click', () => {
            // Check if playNavBeep exists before calling
            if (typeof playNavBeep === 'function') playNavBeep();
        });
    });

    // 0.7 Client Logo Hover Sound
    const playHoverBeep = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                const ctx = new AudioCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                // Very short, high-pitched tech "tick"
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1500, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.03);
                
                gain.gain.setValueAtTime(0.02, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
                
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.03);
            }
        } catch(e) {}
    };

    const clientLogos = document.querySelectorAll('.client-logo-img');
    clientLogos.forEach(logo => {
        logo.addEventListener('mouseenter', playHoverBeep);
    });

    // 0.8 Parallax Hero
    const heroBg = document.querySelector('.hero-bg img');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if(heroBg && scrolled < window.innerHeight) {
            // Apply a smooth vertical translate for a beautiful depth effect
            heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // 1. Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // 3. Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Reset Hero Animations on Scroll (to repeat when re-entering)
    const heroTextBox = document.querySelector('.hero-text-box');
    if (heroTextBox) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('hero-animate');
                } else {
                    // Remove to reset animation for next entry
                    entry.target.classList.remove('hero-animate');
                }
            });
        }, { threshold: 0.1 });
        heroObserver.observe(heroTextBox);
    }

    // 4. Active Link Switching on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // 5. Cookie Consent Logic
    const cookiePopup = document.getElementById('cookie-popup');
    const btnAccept = document.getElementById('accept-cookies');
    const btnDecline = document.getElementById('decline-cookies');

    if (cookiePopup) {
        if (!localStorage.getItem('kombatCookieConsent')) {
            // Wait slightly for smooth load, then slide up banner
            setTimeout(() => {
                cookiePopup.classList.add('show');
            }, 1800);
        }

        const closePopup = (choice) => {
            localStorage.setItem('kombatCookieConsent', choice);
            cookiePopup.classList.remove('show');
        };

        if(btnAccept) btnAccept.addEventListener('click', () => closePopup('accepted'));
        if(btnDecline) btnDecline.addEventListener('click', () => closePopup('declined'));
    }

    // 6. Quick Tools FAB Logic
    const fabWrapper = document.getElementById('fab-wrapper');
    const fabMain = document.getElementById('fab-main');
    const btnTop = document.getElementById('btn-top-scroll');
    const btnDown = document.getElementById('btn-down-scroll');
    const btnCart = document.getElementById('btn-cart');
    const btnRefresh = document.getElementById('btn-refresh');

    if (fabWrapper && fabMain) {
        // Show/Hide wrapper on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                fabWrapper.classList.add('visible');
            } else {
                fabWrapper.classList.remove('visible');
                fabWrapper.classList.remove('open'); // Close menu if user scrolls back up
            }
        });

        // Toggle Expand with Sound effect
        fabMain.addEventListener('click', () => {
            fabWrapper.classList.toggle('open');
            if (typeof playNavBeep === 'function') playNavBeep();
        });

        // Tool: Back to Top
        if(btnTop) {
            btnTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                fabWrapper.classList.remove('open');
            });
        }

        // Tool: Scroll to Bottom
        if(btnDown) {
            btnDown.addEventListener('click', () => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                fabWrapper.classList.remove('open');
                if (typeof playNavBeep === 'function') playNavBeep();
            });
        }

        // Tool: Refresh Page
        if(btnRefresh) {
            btnRefresh.addEventListener('click', () => {
                location.reload();
            });
        }

        // Tool: Cart (Placeholder)
        if(btnCart) {
            btnCart.addEventListener('click', () => {
                alert("Cart feature is currently under development. Please check back soon!");
                fabWrapper.classList.remove('open');
            });
        }
    }

    // 7. Contact Form Submit Logic
    const contactForm = document.querySelector('.contact-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('show');
        });
    }

    if (contactForm) {
        let contactCaptchaCode = '';
        const contactCaptchaModal = document.getElementById('contact-captcha-modal');
        const contactCaptchaDisplay = document.getElementById('contact-captcha-display');
        const contactCaptchaInput = document.getElementById('contact-captcha-input');
        const refreshBtn = document.getElementById('refresh-contact-captcha');
        const verifyBtn = document.getElementById('verify-contact-captcha');
        const cancelBtn = document.getElementById('cancel-contact-captcha');

        const generateContactCaptcha = () => {
            const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
            let code = '';
            for(let i=0; i<4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
            contactCaptchaCode = code;
            if(contactCaptchaDisplay) contactCaptchaDisplay.innerText = code;
            if(contactCaptchaInput) contactCaptchaInput.value = '';
        };

        if(refreshBtn) refreshBtn.addEventListener('click', generateContactCaptcha);
        if(cancelBtn) cancelBtn.addEventListener('click', () => {
            contactCaptchaModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            generateContactCaptcha();
            if(contactCaptchaModal) {
                contactCaptchaModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
            if (typeof playNavBeep === 'function') playNavBeep();
        });

        if(verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                const inputCode = contactCaptchaInput.value.toUpperCase();
                if(inputCode !== contactCaptchaCode) {
                    if(typeof playNavBeep === 'function') playNavBeep();
                    contactCaptchaInput.style.borderColor = '#ff4757';
                    contactCaptchaInput.style.boxShadow = '0 0 10px rgba(255, 71, 87, 0.2)';
                    setTimeout(() => {
                        contactCaptchaInput.style.borderColor = 'var(--border-color)';
                        contactCaptchaInput.style.boxShadow = 'none';
                    }, 1000);
                    generateContactCaptcha();
                    return;
                }

                contactCaptchaModal.classList.remove('show');
                document.body.style.overflow = 'auto';

                const name = document.getElementById('name').value.toUpperCase();
                const email = document.getElementById('email').value.toLowerCase();
                const message = document.getElementById('message').value;

                const btnSubmit = contactForm.querySelector('.btn-submit');
                const originalText = btnSubmit.innerHTML;
                btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Request...';
                btnSubmit.disabled = true;

                setTimeout(() => {
                    btnSubmit.innerHTML = '<i class="fas fa-check"></i> Request Verified';
                    
                    // Construct WhatsApp Message
                    const orderId = Math.floor(100000 + Math.random() * 900000); // Unique request ID
                    let waMsg = `*KOMBAT IT SOLUTIONS - Service Request [#${orderId}]*\n`;
                    waMsg += `------------------------------------------------\n`;
                    waMsg += `• *Client:* ${name}\n`;
                    waMsg += `• *Email:* ${email}\n`;
                    waMsg += `------------------------------------------------\n`;
                    waMsg += `*Message:* \n${message}\n\n`;
                    waMsg += `_Request verified via Secure-Gate._`;

                    const encodedMsg = encodeURIComponent(waMsg);
                    window.open(`https://wa.me/917025064441?text=${encodedMsg}`, '_blank');

                    setTimeout(() => {
                        if (successModal) {
                            document.getElementById('modal-title').innerText = "Request Sent Successfully!";
                            document.getElementById('modal-desc').innerText = "Your verified inquiry has been transmitted to our corporate WhatsApp team. An account manager will respond shortly.";
                            successModal.classList.add('show');
                            if (typeof playNavBeep === 'function') playNavBeep();
                        }
                        contactForm.reset();
                        btnSubmit.innerHTML = originalText;
                        btnSubmit.disabled = false;
                    }, 500);
                }, 1000);
            });
        }
    }

    // 8. Automatically update the "Last Updated" date on the careers page
    const lastUpdatedEl = document.getElementById('last-updated-date');
    if (lastUpdatedEl) {
        // Fetch the last modified date of the current document
        const lastMod = new Date(document.lastModified);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        lastUpdatedEl.textContent = lastMod.toLocaleDateString('en-IN', options);
    }

    // 9. Google Rating Modal Trigger (40 seconds after entry)
    const ratingModal = document.getElementById('rating-modal');
    const closeRatingBtn = document.getElementById('close-rating-modal');
    const ratingCountdown = document.getElementById('rating-countdown');
    const ratingTimerWrapper = document.getElementById('rating-countdown-wrapper');

    const triggerRatingCountdown = () => {
        let timeLeft = 7;
        const progressRing = document.getElementById('countdown-progress');
        const circumference = 113.1; // 2 * PI * 18

        const interval = setInterval(() => {
            timeLeft--;
            if(ratingCountdown) ratingCountdown.innerText = timeLeft;
            
            // Update Progress Ring
            if (progressRing) {
                const offset = circumference - (timeLeft / 7) * circumference;
                progressRing.style.strokeDashoffset = offset;
            }

            if(timeLeft <= 0) {
                clearInterval(interval);
                if(ratingTimerWrapper) ratingTimerWrapper.style.display = 'none';
                if(closeRatingBtn) closeRatingBtn.style.display = 'block';
            }
        }, 1000);
    };

    if (ratingModal && !sessionStorage.getItem('kombatRatingShown')) {
        setTimeout(() => {
            const activeModal = document.querySelector('.custom-modal.show');
            if(!activeModal) {
                ratingModal.classList.add('show');
                sessionStorage.setItem('kombatRatingShown', 'true');
                triggerRatingCountdown();
                if (typeof playNavBeep === 'function') playNavBeep();
            } else {
                const checkLater = setInterval(() => {
                    if(!document.querySelector('.custom-modal.show')) {
                        ratingModal.classList.add('show');
                        sessionStorage.setItem('kombatRatingShown', 'true');
                        triggerRatingCountdown();
                        if (typeof playNavBeep === 'function') playNavBeep();
                        clearInterval(checkLater);
                    }
                }, 30000);
            }
        }, 40000); // 40s delay

        if(closeRatingBtn) {
            closeRatingBtn.addEventListener('click', () => {
                ratingModal.classList.remove('show');
            });
        }
    }
});
