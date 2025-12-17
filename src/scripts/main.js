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
        
        // Load and render initial view
        await this.loadView(this.currentView);
        
        // Load and render footer
        await this.loadComponent('#footer-container', 'src/components/footer.html');
        
        // Setup event listeners
        this.setupEventListeners();
        
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
     * Load and render a view
     */
    async loadView(viewName) {
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

        // Navigation links
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

        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
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
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach((b) => b.classList.remove('filter-btn--active'));
                btn.classList.add('filter-btn--active');

                // Filter projects
                projectCards.forEach((card) => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.classList.add('animate-fadeIn');
                        }, 10);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('animate-fadeIn');
                    }
                });
            });
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
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});