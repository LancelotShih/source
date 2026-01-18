/* ========================================
   MAIN APPLICATION SETUP
   ======================================== */

/**
 * Initialize the application
 * Load components, set up navigation, and render initial view
 */

class App {
    constructor() {
        this.currentView = 'home';
        this.routes = {
            home: 'src/views/home.html',
            projects: 'src/views/projects.html',
            about: 'src/views/about.html',
            // Project descriptions
            'project-FinanceManager': 'src/views/projectDescriptions/FinanceManager.html',
            'project-PowerSupplyControlBoard': 'src/views/projectDescriptions/PowerSupplyControlBoard.html',
            'project-ARMapsNavigator': 'src/views/projectDescriptions/ARMapsNavigator.html',
            'project-WordleSolver': 'src/views/projectDescriptions/WordleSolver.html',
            'project-SSBDemodulator': 'src/views/projectDescriptions/SSBdemodulator.html',
            'project-WakeUpJoe': 'src/views/projectDescriptions/WakeUpJoe.html',
            'project-BingPong': 'src/views/projectDescriptions/BingPong.html',
            'project-FarmingRover': 'src/views/projectDescriptions/FarmingRover.html',
            'project-SyntheticDataGen': 'src/views/projectDescriptions/SyntheticDataGen.html',
            'project-BBShield': 'src/views/projectDescriptions/BBShield.html',
            'project-DigitalThermometer': 'src/views/projectDescriptions/DigitalThermometer.html',
            'project-WaferDefectDetection': 'src/views/projectDescriptions/WaferDefectDetection.html',
            'project-DataCleanRoom': 'src/views/projectDescriptions/DataCleanRoom.html',
            'project-SolarCar': 'src/views/projectDescriptions/SolarCar.html',
            'project-PrivateTutoring': 'src/views/projectDescriptions/PrivateTutoring.html',
            'project-HomeServer': 'src/views/projectDescriptions/HomeServer.html',
            // Placeholder routes for other projects (create these files when ready)
            'project-ecommerce': 'src/views/projectDescriptions/ecommerce.html',
            'project-taskmanager': 'src/views/projectDescriptions/taskmanager.html',
            'project-designsystem': 'src/views/projectDescriptions/designsystem.html',
            'project-fitnesstracker': 'src/views/projectDescriptions/fitnesstracker.html',
            'project-analytics': 'src/views/projectDescriptions/analytics.html',
            'project-socialmedia': 'src/views/projectDescriptions/socialmedia.html',
            'project-brandidentity': 'src/views/projectDescriptions/brandidentity.html',
            'project-weather': 'src/views/projectDescriptions/weather.html',
        };
        this.init();
    }

    async init() {
        // Load and render navbar
        await this.loadComponent('#navbar-container', 'src/components/navbar.html');
        
        // Determine initial view from URL hash
        const initialView = this.getViewFromHash() || 'home';
        
        // Load and render initial view (don't push to history on first load)
        await this.loadView(initialView, false);
        
        // Load and render footer
        await this.loadComponent('#footer-container', 'src/components/footer.html');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Listen for browser back/forward button
        window.addEventListener('popstate', (e) => {
            const view = e.state?.view || this.getViewFromHash() || 'home';
            this.loadView(view, false);
        });
        
        // Initialize utilities
        this.initializeObservers();
    }

    /**
     * Load HTML component and inject into container
     */
    async loadComponent(containerId, filePath) {
        try {
            const response = await fetch(filePath);
            const html = await response.text();
            const container = document.querySelector(containerId);
            if (container) {
                container.innerHTML = html;
            }
        } catch (error) {
            console.error(`Failed to load component: ${filePath}`, error);
        }
    }

    /**
     * Get view name from URL hash
     */
    getViewFromHash() {
        const hash = window.location.hash.slice(1); // Remove the '#'
        if (hash && this.routes[hash]) {
            return hash;
        }
        return null;
    }

    /**
     * Load and render a view
     * @param {string} viewName - The name of the view to load
     * @param {boolean} pushHistory - Whether to push to browser history (default: true)
     */
    async loadView(viewName, pushHistory = true) {
        const filePath = this.routes[viewName];
        if (!filePath) {
            console.error(`View not found: ${viewName}`);
            return;
        }

        try {
            const response = await fetch(filePath);
            const html = await response.text();
            const mainContent = document.querySelector('#main-content');
            if (mainContent) {
                mainContent.innerHTML = html;
                this.currentView = viewName;
                
                // Update browser history and URL
                if (pushHistory) {
                    const url = viewName === 'home' ? '#' : `#${viewName}`;
                    history.pushState({ view: viewName }, '', url);
                }
                
                // Trigger view-specific initialization
                this.initializeView(viewName);
            }
        } catch (error) {
            console.error(`Failed to load view: ${viewName}`, error);
        }
    }

    /**
     * Initialize view-specific functionality
     */
    initializeView(viewName) {
        if (viewName === 'projects') {
            this.initializeProjectsView();
        }
        
        if (viewName === 'about') {
            this.initializeAboutView();
        }
        
        if (viewName === 'home') {
            this.initializeHomeView();
        }
        
        // Update active navigation link
        this.updateActiveNavLink(viewName);
        
        // Re-initialize observers for new content
        this.initializeObservers();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Mobile menu toggle
        const navToggle = document.querySelector('.navbar__toggle');
        const navMenu = document.querySelector('.navbar__menu');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Navigation links (navbar)
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                const navName = e.target.getAttribute('data-view') || 'home';
                this.loadView(navName);
                
                // Close mobile menu
                if (navToggle) navToggle.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
            }
        });

        // Handle all view links (buttons and anchors with data-view attribute)
        // This enables SPA navigation while allowing middle-click to open in new tab
        document.addEventListener('click', (e) => {
            const viewLink = e.target.closest('[data-view]');
            if (viewLink && !e.target.matches('.nav-link')) {
                // Only intercept left-clicks (not middle-click or ctrl+click)
                if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    const viewName = viewLink.getAttribute('data-view');
                    this.loadView(viewName);
                }
            }
        });

        // Smooth scroll for anchor links (only for in-page anchors, not view navigation)
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]') && !e.target.hasAttribute('data-view')) {
                const href = e.target.getAttribute('href');
                if (href === '#') return;
                
                // Check if it's an in-page anchor (element exists on page)
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });

        // Navbar shadow on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 10) {
                    navbar.style.boxShadow = 'var(--shadow-md)';
                } else {
                    navbar.style.boxShadow = 'var(--shadow-sm)';
                }
            }
        });
    }

    /**
     * Initialize projects view functionality
     */
    initializeProjectsView() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const grid = document.querySelector('.grid--projects');
        const projectCards = Array.from(document.querySelectorAll('.project-card'));

        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach((b) => b.classList.remove('filter-btn--active'));
                btn.classList.add('filter-btn--active');

                // Filter and reflow projects
                const visibleCards = projectCards.filter((card) => {
                    const categories = card.getAttribute('data-category').split(' ');
                    return filter === 'all' || categories.includes(filter);
                });

                // Clear the grid
                grid.innerHTML = '';

                // Reinsert visible cards to force recalculation
                visibleCards.forEach((card) => {
                    const clonedCard = card.cloneNode(true);
                    clonedCard.classList.add('animate-fadeIn');
                    grid.appendChild(clonedCard);
                });
            });
        });

        // Initialize parallax effect for projects page (slight delay to ensure DOM is ready)
        setTimeout(() => {
            this.initializeParallax();
        }, 50);
    }

    /**
     * Initialize about view functionality
     */
    initializeAboutView() {
        // The timeline script in about.html will execute, but we need to ensure
        // the functions are called after the DOM is ready
        setTimeout(() => {
            if (typeof renderTimeline === 'function' && typeof timelineEvents !== 'undefined') {
                renderTimeline(timelineEvents);
                setupFilterButtons();
            }
        }, 100);

        // Initialize parallax title effect
        this.initializeAboutParallax();
    }

    /**
     * Initialize parallax effects for about page
     */
    initializeAboutParallax() {
        const title = document.getElementById('parallax-title');
        const subtitle = document.querySelector('.about-hero__subtitle');
        const aboutHero = document.querySelector('.about-hero');
        
        if (!title || !aboutHero) return;

        const initialFontSize = parseFloat(getComputedStyle(title).fontSize);
        const minFontSize = initialFontSize * 0.4; // Shrink to 40% of original
        const heroHeight = aboutHero.offsetHeight;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const scrollProgress = Math.min(scrollY / (heroHeight * 0.8), 1);
            
            // Calculate new font size
            const newFontSize = initialFontSize - (scrollProgress * (initialFontSize - minFontSize));
            title.style.fontSize = `${newFontSize}px`;
            
            // Move title up slightly as you scroll
            const translateY = scrollProgress * -50;
            title.style.transform = `translateY(${translateY}px)`;
            
            // Fade out subtitle
            if (subtitle) {
                subtitle.style.opacity = 1 - scrollProgress;
            }
        };

        // Throttle scroll for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initialize parallax for stars
        this.initializeParallax();
    }

    /**
     * Initialize home view functionality
     */
    initializeHomeView() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                };

                console.log('Form submitted with data:', formData);

                // Basic validation
                if (!formData.name || !formData.email || !formData.message) {
                    Notification.error('Please fill in all fields');
                    return;
                }

                // Character limit validation
                if (formData.message.length > 500) {
                    Notification.error('Message must be 500 characters or less');
                    return;
                }

                const btn = contactForm.querySelector('button[type="submit"]');
                btn.textContent = 'Sending...';
                btn.disabled = true;

                // Check if EmailJS and sendContactEmail are available
                if (typeof window.sendContactEmail !== 'function') {
                    console.error('sendContactEmail function not found');
                    Notification.error('Email service not ready. Please try again.');
                    btn.textContent = 'Send Message';
                    btn.disabled = false;
                    return;
                }

                // Send email using EmailJS with timeout
                const emailPromise = window.sendContactEmail(formData);
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request timed out')), 10000)
                );

                Promise.race([emailPromise, timeoutPromise])
                    .then((response) => {
                        console.log('Email sent successfully:', response);
                        Notification.success('Message sent successfully!');
                        contactForm.reset();
                        btn.textContent = 'Sent!';
                        btn.disabled = false;
                        setTimeout(() => {
                            btn.textContent = 'Send Message';
                        }, 2000);
                    })
                    .catch((error) => {
                        console.error('Email sending failed:', error);
                        Notification.error('Failed to send message. Please try again.');
                        btn.textContent = 'Send Message';
                        btn.disabled = false;
                    });
            });
        }

        // Initialize parallax effect
        this.initializeParallax();
    }

    /**
     * Initialize mouse parallax effect for hero section
     */
    initializeParallax() {
        // Select all stars and constellation lines
        const parallaxElements = document.querySelectorAll('.star, .constellation-lines');
        
        if (parallaxElements.length === 0) return;

        // Store center position and current transforms
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Track mouse and scroll offsets separately
        let mouseOffsets = new Map();
        let scrollOffset = 0;

        const updateTransforms = () => {
            parallaxElements.forEach((el) => {
                const mouseOffset = mouseOffsets.get(el) || { x: 0, y: 0 };
                const speed = parseFloat(el.dataset.speed) || 0.02;
                const scrollY = scrollOffset * speed * 20;
                
                // Combine mouse and scroll transforms
                el.style.transform = `translate(${mouseOffset.x}px, ${mouseOffset.y + scrollY}px)`;
            });
        };

        const handleMouseMove = (e) => {
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            parallaxElements.forEach((el) => {
                const speed = parseFloat(el.dataset.speed) || 0.02;
                // Subtle movement multiplier
                const x = mouseX * speed * 2;
                const y = mouseY * speed * 2;
                
                mouseOffsets.set(el, { x, y });
            });
            
            updateTransforms();
        };

        const handleScroll = () => {
            scrollOffset = window.scrollY;
            updateTransforms();
        };

        // Throttle the mousemove event for performance
        let mouseTicking = false;
        document.addEventListener('mousemove', (e) => {
            if (!mouseTicking) {
                window.requestAnimationFrame(() => {
                    handleMouseMove(e);
                    mouseTicking = false;
                });
                mouseTicking = true;
            }
        });

        // Throttle scroll event for performance
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        });

        // Reset mouse offset on mouse leave (but keep scroll)
        document.addEventListener('mouseleave', () => {
            parallaxElements.forEach((el) => {
                mouseOffsets.set(el, { x: 0, y: 0 });
            });
            updateTransforms();
        });
    }

    /**
     * Initialize scroll animations
     */
    initializeObservers() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeIn');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe cards and other elements
        document.querySelectorAll('.project-card, .stat-card, .skill-tag').forEach((el) => {
            observer.observe(el);
        });
    }

    /**
     * Update active navigation link
     */
    updateActiveNavLink(viewName) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            const linkView = link.getAttribute('data-view') || 'home';
            if (linkView === viewName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Open gallery modal with image
     */
    openGalleryModal(imageSrc, imageTitle) {
        let modal = document.getElementById('gallery-modal');
        
        // Create modal if it doesn't exist
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'gallery-modal';
            modal.className = 'gallery-modal';
            modal.innerHTML = `
                <div class="gallery-modal__backdrop" onclick="app.closeGalleryModal()"></div>
                <div class="gallery-modal__content">
                    <button class="gallery-modal__close" onclick="app.closeGalleryModal()">✕</button>
                    <button class="gallery-modal__nav gallery-modal__nav--prev" onclick="app.navigateGallery(-1)" style="display: none;">❮</button>
                    <img id="gallery-modal-img" src="" alt="" class="gallery-modal__image">
                    <button class="gallery-modal__nav gallery-modal__nav--next" onclick="app.navigateGallery(1)" style="display: none;">❯</button>
                    <p id="gallery-modal-title" class="gallery-modal__title"></p>
                    <p id="gallery-modal-counter" class="gallery-modal__counter" style="display: none;"></p>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (modal.classList.contains('active')) {
                    if (e.key === 'ArrowLeft') app.navigateGallery(-1);
                    if (e.key === 'ArrowRight') app.navigateGallery(1);
                    if (e.key === 'Escape') app.closeGalleryModal();
                }
            });
        }
        
        // Store current gallery context
        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        
        // Normalize the clicked image source for comparison (decode URL and get filename)
        const clickedFilename = decodeURIComponent(imageSrc.split('/').pop());
        
        const currentIndex = galleryItems.findIndex(item => {
            const itemSrc = item.querySelector('img').src;
            const itemFilename = decodeURIComponent(itemSrc.split('/').pop());
            return itemFilename === clickedFilename;
        });
        
        this.galleryState = {
            items: galleryItems.map(item => ({
                src: item.querySelector('img').src,
                title: item.querySelector('img').alt
            })),
            currentIndex: currentIndex >= 0 ? currentIndex : 0
        };
        
        // Update modal display using the passed imageSrc and imageTitle for accuracy
        const modalImg = document.getElementById('gallery-modal-img');
        const modalTitle = document.getElementById('gallery-modal-title');
        modalImg.src = imageSrc;
        modalImg.alt = imageTitle;
        modalTitle.textContent = imageTitle;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Update gallery modal with current image
     */
    updateGalleryModal() {
        const state = this.galleryState;
        const currentItem = state.items[state.currentIndex];
        
        document.getElementById('gallery-modal-img').src = currentItem.src;
        document.getElementById('gallery-modal-img').alt = currentItem.title;
        document.getElementById('gallery-modal-title').textContent = currentItem.title;
        
        // Update counter
        if (state.items.length > 1) {
            document.getElementById('gallery-modal-counter').textContent = 
                `${state.currentIndex + 1} / ${state.items.length}`;
            document.getElementById('gallery-modal-counter').style.display = 'block';
            document.querySelector('.gallery-modal__nav--prev').style.display = 'block';
            document.querySelector('.gallery-modal__nav--next').style.display = 'block';
        }
    }

    /**
     * Navigate through gallery images
     */
    navigateGallery(direction) {
        if (!this.galleryState) return;
        
        const totalItems = this.galleryState.items.length;
        this.galleryState.currentIndex = (this.galleryState.currentIndex + direction + totalItems) % totalItems;
        
        this.updateGalleryModal();
    }

    /**
     * Close gallery modal
     */
    closeGalleryModal() {
        const modal = document.getElementById('gallery-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});