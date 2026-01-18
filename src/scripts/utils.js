/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/**
 * DOM Query Helpers
 */
const DOM = {
    select: (selector) => document.querySelector(selector),
    selectAll: (selector) => document.querySelectorAll(selector),
    create: (tag, classes = '') => {
        const el = document.createElement(tag);
        if (classes) el.className = classes;
        return el;
    },
    append: (parent, child) => parent.appendChild(child),
    prepend: (parent, child) => parent.prepend(child),
    remove: (el) => el.remove(),
    addClass: (el, cls) => el.classList.add(cls),
    removeClass: (el, cls) => el.classList.remove(cls),
    toggleClass: (el, cls) => el.classList.toggle(cls),
    hasClass: (el, cls) => el.classList.contains(cls),
};

/**
 * Event Helpers
 */
const Events = {
    on: (el, event, handler) => el.addEventListener(event, handler),
    off: (el, event, handler) => el.removeEventListener(event, handler),
    emit: (el, eventName, detail = {}) => {
        el.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true }));
    },
    delegate: (parent, event, selector, handler) => {
        parent.addEventListener(event, (e) => {
            if (e.target.matches(selector)) {
                handler.call(e.target, e);
            }
        });
    },
};

/**
 * Notification System
 */
class Notification {
    static show(message, type = 'info', duration = 3000) {
        const notification = DOM.create('div', `notification notification--${type}`);
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
            background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    static success(message, duration) {
        this.show(message, 'success', duration);
    }

    static error(message, duration) {
        this.show(message, 'error', duration);
    }

    static info(message, duration) {
        this.show(message, 'info', duration);
    }
}

/**
 * LocalStorage Helper
 */
const Storage = {
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    get: (key) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    remove: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear(),
};

/**
 * API Helper
 */
class API {
    static async fetch(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            Notification.error('Failed to load data');
            throw error;
        }
    }

    static get(url, options) {
        return this.fetch(url, { method: 'GET', ...options });
    }

    static post(url, data, options) {
        return this.fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        });
    }
}

/**
 * Scroll Utilities
 */
const Scroll = {
    to: (element, offset = 0) => {
        const top = element.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    },
    toTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
};

/**
 * Intersection Observer Helper
 */
class IntersectionObserverHelper {
    static observe(selector, callback, options = {}) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px',
            ...options,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    callback(entry);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        DOM.selectAll(selector).forEach((el) => observer.observe(el));
        return observer;
    }

    static observeOnce(selector, className = 'animate-fadeIn') {
        return this.observe(selector, (entry) => {
            DOM.addClass(entry.target, className);
        });
    }
}

/**
 * Debounce Helper
 */
const debounce = (func, delay = 300) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

/**
 * Throttle Helper
 */
const throttle = (func, delay = 300) => {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            func.apply(this, args);
            lastCall = now;
        }
    };
};

// Make utilities globally available
window.DOM = DOM;
window.Events = Events;
window.Notification = Notification;
window.Storage = Storage;
window.API = API;
window.Scroll = Scroll;
window.IntersectionObserverHelper = IntersectionObserverHelper;
window.debounce = debounce;
window.throttle = throttle;