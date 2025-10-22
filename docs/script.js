// Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    mobileMenu.classList.add('hidden');
                }
            });
        });

        // Scroll Reveal Animation
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });

        // Testimonials Animation
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        let currentTestimonial = 0;

        function showTestimonials() {
            testimonialCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('active');
                }, index * 200);
            });
        }

        const testimonialObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    showTestimonials();
                    testimonialObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const testimonialSection = document.querySelector('#testimonials');
        if (testimonialSection) {
            testimonialObserver.observe(testimonialSection);
        }

        // Header Scroll Effect
        let lastScroll = 0;
        const header = document.querySelector('header');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
            }

            lastScroll = currentScroll;
        });

        // Form Validation and Submission
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const inputs = e.target.querySelectorAll('input, textarea, select');
                let isValid = true;

                inputs.forEach(input => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        isValid = false;
                        input.classList.add('border-red-500');
                    } else {
                        input.classList.remove('border-red-500');
                    }
                });

                if (isValid) {
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'fixed top-24 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fadeInUp';
                    successMsg.textContent = 'Thank you! We will contact you soon.';
                    document.body.appendChild(successMsg);
                    
                    setTimeout(() => {
                        successMsg.remove();
                    }, 4000);
                    
                    e.target.reset();
                } else {
                    // Show error message
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'fixed top-24 right-6 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fadeInUp';
                    errorMsg.textContent = 'Please fill in all required fields.';
                    document.body.appendChild(errorMsg);
                    
                    setTimeout(() => {
                        errorMsg.remove();
                    }, 4000);
                }
            });
        }

        // Pricing Button Handlers
        document.querySelectorAll('#pricing button').forEach(button => {
            button.addEventListener('click', () => {
                const planName = button.closest('.bg-white').querySelector('h3').textContent;
                const contactSection = document.querySelector('#contact');
                contactSection.scrollIntoView({ behavior: 'smooth' });
                
                // Pre-fill service in contact form
                setTimeout(() => {
                    const serviceSelect = document.querySelector('#contact select');
                    if (serviceSelect) {
                        serviceSelect.value = 'Social Media Management';
                    }
                }, 500);
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });

        // Loading Animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });

        // Animate hero section on load
        window.addEventListener('load', () => {
            const heroElements = document.querySelectorAll('#home .animate-fadeInUp');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                }, index * 200);
            });
        });

        // Add parallax effect to floating shapes
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.animate-float');
            
            parallaxElements.forEach((el, index) => {
                const speed = 0.1 + (index * 0.05);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Portfolio hover effects enhancement
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // Counter animation for statistics (if needed in future)
        function animateValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                element.textContent = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        // Add typing effect to hero tagline (optional enhancement)
        const heroTitle = document.querySelector('#home h1');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            let i = 0;
            
            setTimeout(() => {
                const typeWriter = () => {
                    if (i < text.length) {
                        heroTitle.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 50);
                    }
                };
                typeWriter();
            }, 300);
        }

        // Add scroll progress indicator
        const scrollProgress = document.createElement('div');
        scrollProgress.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 z-50 transition-all duration-300';
        scrollProgress.style.width = '0%';
        document.body.appendChild(scrollProgress);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        });

        // Add active state to navigation based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('text-purple-600');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('text-purple-600');
                }
            });
        });