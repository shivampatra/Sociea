// ============================================
// SOCIEA - MAIN JAVASCRIPT FILE
// IN-MEMORY STATE MANAGEMENT (NO localStorage)
// ============================================

'use strict';

// ============================================
// APPLICATION STATE
// ============================================
const appState = {
    theme: 'day',
    isMobile: window.innerWidth <= 768,
    isMenuOpen: false,
    isWhatsAppFormOpen: false,
    scrollPosition: 0
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Phone validation
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

/**
 * Show error message
 * @param {string} inputId - Input element ID
 * @param {string} errorId - Error message element ID
 * @param {string} message - Error message text
 */
function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input && error) {
        input.classList.add('error');
        error.textContent = message;
        error.classList.add('show');
        input.setAttribute('aria-invalid', 'true');
    }
}

/**
 * Hide error message
 * @param {string} inputId - Input element ID
 * @param {string} errorId - Error message element ID
 */
function hideError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input && error) {
        input.classList.remove('error');
        error.classList.remove('show');
        input.setAttribute('aria-invalid', 'false');
    }
}

/**
 * Smooth scroll to element
 * @param {string} targetId - Target element ID
 */
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// CUSTOM CURSOR GLOW EFFECT
// ============================================
function initCursorGlow() {
    try {
        const cursorGlow = document.getElementById('cursorGlow');
        
        if (!cursorGlow || appState.isMobile) {
            return;
        }

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let animationFrameId = null;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth animation for cursor glow
        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.15;
            cursorY += dy * 0.15;
            
            cursorGlow.style.left = cursorX + 'px';
            cursorGlow.style.top = cursorY + 'px';
            
            animationFrameId = requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Expand glow on click
        document.addEventListener('mousedown', () => {
            cursorGlow.classList.add('clicking');
        });

        document.addEventListener('mouseup', () => {
            cursorGlow.classList.remove('clicking');
        });

        // Hide cursor glow when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '0.6';
        });

        console.log('✓ Cursor glow initialized');
    } catch (error) {
        console.error('Cursor glow error:', error);
    }
}

// ============================================
// THEME TOGGLE (DAY/NIGHT MODE)
// ============================================
function initThemeToggle() {
    try {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.querySelector('.theme-toggle-icon');
        const body = document.body;

        if (!themeToggle || !themeIcon) {
            console.warn('Theme toggle elements not found');
            return;
        }

        themeToggle.addEventListener('click', () => {
            try {
                body.classList.toggle('night-mode');
                appState.theme = body.classList.contains('night-mode') ? 'night' : 'day';
                
                themeIcon.textContent = appState.theme === 'night' ? '🌙' : '☀️';
                
                // Update ARIA label
                themeToggle.setAttribute('aria-label', 
                    appState.theme === 'night' ? 'Switch to day mode' : 'Switch to night mode'
                );

                console.log(`Theme switched to: ${appState.theme}`);
            } catch (error) {
                console.error('Theme toggle error:', error);
            }
        });

        console.log('✓ Theme toggle initialized');
    } catch (error) {
        console.error('Theme initialization error:', error);
    }
}

// ============================================
// SCROLL EFFECTS (THROTTLED)
// ============================================
function initScrollEffects() {
    try {
        const header = document.getElementById('header');
        
        if (!header) {
            console.warn('Header element not found');
            return;
        }

        const handleScroll = throttle(() => {
            try {
                appState.scrollPosition = window.scrollY;
                
                if (appState.scrollPosition > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            } catch (error) {
                console.error('Scroll handler error:', error);
            }
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        console.log('✓ Scroll effects initialized');
    } catch (error) {
        console.error('Scroll effect error:', error);
    }
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    try {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!mobileMenuToggle || !navMenu) {
            console.warn('Mobile menu elements not found');
            return;
        }

        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            try {
                appState.isMenuOpen = !appState.isMenuOpen;
                
                mobileMenuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Update ARIA attributes
                mobileMenuToggle.setAttribute('aria-expanded', appState.isMenuOpen);
                navMenu.setAttribute('aria-hidden', !appState.isMenuOpen);
                
                // Prevent body scroll when menu is open
                if (appState.isMenuOpen) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }

                console.log(`Mobile menu: ${appState.isMenuOpen ? 'opened' : 'closed'}`);
            } catch (error) {
                console.error('Mobile menu toggle error:', error);
            }
        });

        console.log('✓ Mobile menu initialized');
    } catch (error) {
        console.error('Mobile menu initialization error:', error);
    }
}

// ============================================
// MOBILE DROPDOWN TOGGLE
// ============================================
function initMobileDropdowns() {
    try {
        if (!appState.isMobile) return;

        const dropdowns = document.querySelectorAll('.dropdown, .sub-dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            if (!link) return;

            // Clone to remove existing listeners
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', (e) => {
                try {
                    const hasSubmenu = dropdown.querySelector('.dropdown-menu, .sub-dropdown-menu');
                    
                    if (hasSubmenu) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                        
                        // Update ARIA
                        const isExpanded = dropdown.classList.contains('active');
                        newLink.setAttribute('aria-expanded', isExpanded);
                    }
                } catch (error) {
                    console.error('Dropdown toggle error:', error);
                }
            });
        });

        console.log('✓ Mobile dropdowns initialized');
    } catch (error) {
        console.error('Mobile dropdown error:', error);
    }
}

// ============================================
// WINDOW RESIZE HANDLER (DEBOUNCED)
// ============================================
function initResizeHandler() {
    try {
        const handleResize = debounce(() => {
            try {
                const wasMobile = appState.isMobile;
                appState.isMobile = window.innerWidth <= 768;
                
                // Close mobile menu when switching to desktop
                if (wasMobile && !appState.isMobile && appState.isMenuOpen) {
                    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                    const navMenu = document.getElementById('navMenu');
                    
                    if (mobileMenuToggle && navMenu) {
                        mobileMenuToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        appState.isMenuOpen = false;
                        
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        navMenu.setAttribute('aria-hidden', 'true');
                        document.body.style.overflow = '';
                    }
                }
                
                // Reinitialize mobile dropdowns if needed
                if (!wasMobile && appState.isMobile) {
                    initMobileDropdowns();
                }

                console.log(`Resize: isMobile = ${appState.isMobile}`);
            } catch (error) {
                console.error('Resize handler error:', error);
            }
        }, 200);

        window.addEventListener('resize', handleResize);
        
        console.log('✓ Resize handler initialized');
    } catch (error) {
        console.error('Resize handler initialization error:', error);
    }
}

// ============================================
// CLOSE MENU ON OUTSIDE CLICK
// ============================================
function initOutsideClickHandler() {
    try {
        document.addEventListener('click', (e) => {
            try {
                const header = document.getElementById('header');
                const navMenu = document.getElementById('navMenu');
                const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                const whatsappForm = document.getElementById('whatsapp-form-container');
                
                // Close mobile menu
                if (header && navMenu && mobileMenuToggle) {
                    if (!header.contains(e.target) && navMenu.classList.contains('active')) {
                        mobileMenuToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        appState.isMenuOpen = false;
                        
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        navMenu.setAttribute('aria-hidden', 'true');
                        document.body.style.overflow = '';
                    }
                }
                
                // Close WhatsApp form
                if (whatsappForm && appState.isWhatsAppFormOpen) {
                    const whatsappButton = document.getElementById('whatsapp-button');
                    if (!whatsappForm.contains(e.target) && !whatsappButton.contains(e.target)) {
                        whatsappForm.style.display = 'none';
                        whatsappForm.setAttribute('aria-hidden', 'true');
                        appState.isWhatsAppFormOpen = false;
                    }
                }
            } catch (error) {
                console.error('Outside click handler error:', error);
            }
        });
        
        console.log('✓ Outside click handler initialized');
    } catch (error) {
        console.error('Outside click initialization error:', error);
    }
}

// ============================================
// WHATSAPP FUNCTIONALITY
// ============================================
function initWhatsApp() {
    try {
        const whatsappBtn = document.getElementById('whatsapp-button');
        const formContainer = document.getElementById('whatsapp-form-container');
        const closeForm = document.getElementById('close-form');
        const sendBtn = document.getElementById('sendWhatsApp');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');

        // Open form
        if (whatsappBtn && formContainer) {
            whatsappBtn.addEventListener('click', () => {
                try {
                    formContainer.style.display = 'block';
                    formContainer.setAttribute('aria-hidden', 'false');
                    appState.isWhatsAppFormOpen = true;
                    
                    // Focus first input
                    const nameInput = document.getElementById('name');
                    if (nameInput) {
                        setTimeout(() => nameInput.focus(), 100);
                    }
                    
                    console.log('WhatsApp form opened');
                } catch (error) {
                    console.error('WhatsApp form open error:', error);
                }
            });
        }

        // Close form
        if (closeForm && formContainer) {
            closeForm.addEventListener('click', () => {
                try {
                    formContainer.style.display = 'none';
                    formContainer.setAttribute('aria-hidden', 'true');
                    appState.isWhatsAppFormOpen = false;
                    
                    console.log('WhatsApp form closed');
                } catch (error) {
                    console.error('WhatsApp form close error:', error);
                }
            });
        }

        // Real-time email validation
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                const email = emailInput.value.trim();
                if (email && !isValidEmail(email)) {
                    showError('email', 'email-error', 'Please enter a valid email address');
                } else {
                    hideError('email', 'email-error');
                }
            });
            
            emailInput.addEventListener('input', () => {
                if (emailInput.classList.contains('error')) {
                    hideError('email', 'email-error');
                }
            });
        }

        // Real-time phone validation
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                const phone = phoneInput.value.trim();
                if (phone && !isValidPhone(phone)) {
                    showError('phone', 'phone-error', 'Please enter a valid phone number (min 10 digits)');
                } else {
                    hideError('phone', 'phone-error');
                }
            });
            
            phoneInput.addEventListener('input', () => {
                if (phoneInput.classList.contains('error')) {
                    hideError('phone', 'phone-error');
                }
            });
        }

        // Send message
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                try {
                    const phoneNumber = "+918280498167";
                    const name = document.getElementById('name').value.trim();
                    const email = document.getElementById('email').value.trim();
                    const phone = document.getElementById('phone').value.trim();
                    const message = document.getElementById('message').value.trim();

                    // Clear previous errors
                    hideError('email', 'email-error');
                    hideError('phone', 'phone-error');
                    hideError('message', 'message-error');

                    let hasError = false;

                    // Validate message (required)
                    if (!message) {
                        showError('message', 'message-error', 'Please enter a message');
                        hasError = true;
                    }

                    // Validate email if provided
                    if (email && !isValidEmail(email)) {
                        showError('email', 'email-error', 'Please enter a valid email address');
                        hasError = true;
                    }

                    // Validate phone if provided
                    if (phone && !isValidPhone(phone)) {
                        showError('phone', 'phone-error', 'Please enter a valid phone number (min 10 digits)');
                        hasError = true;
                    }

                    if (hasError) {
                        console.log('Form validation failed');
                        return;
                    }

                    // Build message
                    const finalMessage = `Hello, my name is ${name || 'Anonymous'}.${email ? '\nEmail: ' + email : ''}${phone ? '\nPhone: ' + phone : ''}\nMessage: ${message}`;
                    const encodedMessage = encodeURIComponent(finalMessage);
                    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

                    // Open WhatsApp
                    window.open(whatsappURL, '_blank');
                    
                    // Clear form
                    document.getElementById('name').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('phone').value = '';
                    document.getElementById('message').value = '';
                    
                    // Close form
                    if (formContainer) {
                        formContainer.style.display = 'none';
                        formContainer.setAttribute('aria-hidden', 'true');
                        appState.isWhatsAppFormOpen = false;
                    }
                    
                    console.log('WhatsApp message sent successfully');
                } catch (error) {
                    console.error('WhatsApp send error:', error);
                    alert('An error occurred while opening WhatsApp. Please try again.');
                }
            });
        }

        console.log('✓ WhatsApp functionality initialized');
    } catch (error) {
        console.error('WhatsApp functionality error:', error);
    }
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignore empty href or just "#"
                if (!href || href === '#') {
                    e.preventDefault();
                    return;
                }
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (appState.isMenuOpen) {
                        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                        const navMenu = document.getElementById('navMenu');
                        
                        if (mobileMenuToggle && navMenu) {
                            mobileMenuToggle.classList.remove('active');
                            navMenu.classList.remove('active');
                            appState.isMenuOpen = false;
                            
                            mobileMenuToggle.setAttribute('aria-expanded', 'false');
                            navMenu.setAttribute('aria-hidden', 'true');
                            document.body.style.overflow = '';
                        }
                    }
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        console.log('✓ Smooth scroll initialized');
    } catch (error) {
        console.error('Smooth scroll error:', error);
    }
}

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================
function initKeyboardAccessibility() {
    try {
        document.addEventListener('keydown', (e) => {
            try {
                // ESC key to close WhatsApp form
                if (e.key === 'Escape' && appState.isWhatsAppFormOpen) {
                    const formContainer = document.getElementById('whatsapp-form-container');
                    
                    if (formContainer) {
                        formContainer.style.display = 'none';
                        formContainer.setAttribute('aria-hidden', 'true');
                        appState.isWhatsAppFormOpen = false;
                        console.log('WhatsApp form closed via ESC key');
                    }
                }
                
                // ESC key to close mobile menu
                if (e.key === 'Escape' && appState.isMenuOpen) {
                    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                    const navMenu = document.getElementById('navMenu');
                    
                    if (mobileMenuToggle && navMenu) {
                        mobileMenuToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        appState.isMenuOpen = false;
                        
                        mobileMenuToggle.setAttribute('aria-expanded', 'false');
                        navMenu.setAttribute('aria-hidden', 'true');
                        document.body.style.overflow = '';
                        console.log('Mobile menu closed via ESC key');
                    }
                }
            } catch (error) {
                console.error('Keyboard handler error:', error);
            }
        });
        
        console.log('✓ Keyboard accessibility initialized');
    } catch (error) {
        console.error('Keyboard accessibility error:', error);
    }
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
function initIntersectionObserver() {
    try {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe animated elements
        const animatedElements = document.querySelectorAll('.content-card, .feature-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        console.log('✓ Intersection observer initialized');
    } catch (error) {
        console.error('Intersection observer error:', error);
    }
}

// ============================================
// INITIALIZE ALL MODULES
// ============================================
function initializeApp() {
    console.log('🚀 Initializing Sociea application...');
    console.log('Initial state:', appState);

    // Initialize all modules
    initCursorGlow();
    initThemeToggle();
    initScrollEffects();
    initMobileMenu();
    initMobileDropdowns();
    initResizeHandler();
    initOutsideClickHandler();
    initWhatsApp();
    initSmoothScroll();
    initKeyboardAccessibility();
    initIntersectionObserver();

    console.log('✅ Sociea application initialized successfully');
}

// ============================================
// DOM CONTENT LOADED EVENT
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ============================================
// EXPORT STATE FOR DEBUGGING (OPTIONAL)
// ============================================
window.SocieaApp = {
    state: appState,
    version: '1.0.0'
};


// ============================================
// CONTACT REPLY
// ============================================
 
// Close button functionality
        document.querySelector('.close-btn').addEventListener('click', function() {
            window.history.back();
        });

        // Form submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for contacting us! We will get back to you soon.');
            this.reset();
        });