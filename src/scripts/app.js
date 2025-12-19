/* ========================================
   APPLICATION CONFIGURATION
   ======================================== */

/**
 * Application configuration and constants
 */

const AppConfig = {
    // App metadata
    name: 'Lancelot Shih Portfolio',
    version: '1.0.0',
    author: 'Lancelot Shih',

    // API endpoints (update with your backend)
    api: {
        baseUrl: 'https://api.example.com',
        endpoints: {
            projects: '/api/projects',
            contact: '/api/contact',
            skills: '/api/skills',
        },
    },

    // Feature flags
    features: {
        darkMode: true,
        animations: true,
        lazyLoading: true,
    },

    // Social media links
    social: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        email: 'your-email@example.com',
    },
};

/**
 * Form Handler Service
 */
class FormHandler {
    static async submitContact(formData) {
        try {
            const response = await fetch(AppConfig.api.baseUrl + AppConfig.api.endpoints.contact, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            return await response.json();
        } catch (error) {
            console.error('Form submission error:', error);
            throw error;
        }
    }

    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validateForm(formData) {
        const errors = {};

        if (!formData.name || formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!this.validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.message || formData.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    }
}

/**
 * Project Data Service
 */
class ProjectService {
    static async fetchProjects() {
        try {
            const response = await fetch('src/data/projects.json');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            return [];
        }
    }

    static filterProjectsByCategory(projects, category) {
        if (category === 'all') return projects;
        return projects.filter((project) => project.category === category);
    }

    static searchProjects(projects, query) {
        return projects.filter((project) =>
            project.title.toLowerCase().includes(query.toLowerCase()) ||
            project.description.toLowerCase().includes(query.toLowerCase())
        );
    }
}

/**
 * Navigation Service
 */
class NavigationService {
    static generateNavLinks() {
        return [
            { label: 'Home', view: 'home', href: '#home' },
            { label: 'Projects', view: 'projects', href: '#projects' },
            { label: 'About', view: 'about', href: '#about' },
        ];
    }

    static getActiveView() {
        return localStorage.getItem('activeView') || 'home';
    }

    static setActiveView(view) {
        localStorage.setItem('activeView', view);
    }
}

/**
 * Theme Service (for dark mode support)
 */
class ThemeService {
    static isDarkMode() {
        return localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    static setDarkMode(isDark) {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    static toggleDarkMode() {
        this.setDarkMode(!this.isDarkMode());
    }
}

/**
 * Initialize and export services
 */
window.App = {
    config: AppConfig,
    FormHandler,
    ProjectService,
    NavigationService,
    ThemeService,
};

/**
 * Initialize EmailJS
 */
function initializeEmailJS() {
    // Initialize EmailJS with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init("3sYq7fYAJpqhy558a");
        console.log('EmailJS initialized successfully');
    } else {
        console.error('EmailJS library not loaded - check network or ad blockers');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeEmailJS);

/**
 * Global utility functions
 */
function copyEmail() {
    const email = 'shihlancelot@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        const emailButton = document.querySelector('button[onclick="copyEmail()"]');
        if (emailButton) {
            const originalText = emailButton.textContent;
            emailButton.textContent = '📧 Email Copied!';
            setTimeout(() => {
                emailButton.textContent = originalText;
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy email:', err);
    });
}

/**
 * Send contact form email
 */
function sendContactEmail(formData) {
    // Your EmailJS credentials
    const PUBLIC_KEY = "3sYq7fYAJpqhy558a";
    const SERVICE_ID = "service_4qq82mv";
    const TEMPLATE_ID = "template_k6s51et";
    
    // Match all template variables expected by your EmailJS template
    const templateParams = {
        title: "New Contact Form Submission",
        name: formData.name,
        from_name: formData.name,
        from_email: formData.email,
        email: formData.email,
        to_email: "shihlancelot@gmail.com",
        message: formData.message,
    };

    console.log('Sending email with params:', templateParams);
    console.log('Using Service ID:', SERVICE_ID, 'Template ID:', TEMPLATE_ID);
    
    // Check if emailjs is available
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded');
        return Promise.reject(new Error('EmailJS not loaded'));
    }

    // Send email using EmailJS
    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then((response) => {
            console.log('EmailJS success response:', response);
            return response;
        })
        .catch((error) => {
            console.error('EmailJS error:', error);
            throw error;
        });
}

// Make functions globally available
window.sendContactEmail = sendContactEmail;
window.copyEmail = copyEmail;