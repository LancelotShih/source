# Lancelot Shih - Portfolio Website

A modern, scalable, and fully responsive portfolio website built with vanilla HTML, CSS, and JavaScript. This project uses a component-based architecture for easy maintenance and extensibility.

## 📁 Project Structure

```
source/
├── index.html                 # Entry point
├── package.json              # Project metadata
├── assets/
│   └── images/              # All images and media files
├── src/
│   ├── components/          # Reusable HTML components
│   │   ├── navbar.html
│   │   └── footer.html
│   ├── views/               # Page views (loaded dynamically)
│   │   ├── home.html
│   │   ├── projects.html
│   │   └── about.html
│   ├── styles/              # CSS stylesheets
│   │   ├── variables.css    # Design system variables
│   │   ├── globals.css      # Global styles and resets
│   │   ├── components/      # Component-specific styles
│   │   │   ├── navbar.css
│   │   │   ├── hero.css
│   │   │   ├── cards.css
│   │   │   └── forms.css
│   │   └── layout/          # Layout and grid styles
│   │       ├── grid.css
│   │       └── responsive.css
│   ├── scripts/             # JavaScript files
│   │   ├── utils.js         # Utility functions and helpers
│   │   ├── main.js          # Main app initialization
│   │   └── app.js           # App configuration and services
│   └── data/                # Static data files
│       └── projects.json    # Project data
└── public/
    └── assets/              # Public assets folder
```

## 🚀 Getting Started

### Installation

1. **Clone or download the project**
2. **Open `index.html` in a browser** - No build process needed!

That's it! The portfolio is ready to use.

## 🎨 Design System

### CSS Variables

All design decisions are centralized in `src/styles/variables.css`. Modify colors, spacing, typography, and more from one place:

```css
:root {
  --color-primary: #6366f1;
  --color-secondary: #ec4899;
  --spacing-md: 1rem;
  --font-size-lg: 1.125rem;
  /* ... more variables ... */
}
```

### Utility Classes

Use predefined utility classes for quick styling:

```html
<div class="text-center mt-2 mb-4">
  <p class="text-primary text-semibold">Hello World</p>
</div>
```

Available utilities:
- **Text**: `text-center`, `text-muted`, `text-primary`, `text-bold`, etc.
- **Spacing**: `mt-1`, `mb-2`, `p-3`, `gap-2`, etc.
- **Flex**: `flex`, `flex-center`, `flex-between`, etc.
- **States**: `hidden`, `visible`, `opacity-50`, etc.

## 🧩 Components

### Adding New Components

1. Create a new HTML file in `src/components/`
2. Use BEM naming convention for classes
3. Load it in `main.js` within the `init()` method:

```javascript
await this.loadComponent('#container-id', 'src/components/my-component.html');
```

### Component Example

```html
<!-- src/components/my-component.html -->
<div class="my-component">
  <h2 class="my-component__title">Title</h2>
  <p class="my-component__description">Description</p>
</div>
```

## 📄 Views

### Creating a New View

1. Create an HTML file in `src/views/`
2. Add it to the routes in `main.js`:

```javascript
this.routes = {
  home: 'src/views/home.html',
  projects: 'src/views/projects.html',
  about: 'src/views/about.html',
  blog: 'src/views/blog.html', // New route
};
```

3. Update the navigation in `navbar.html`:

```html
<li><a href="#" class="nav-link" data-view="blog" onclick="return false;">Blog</a></li>
```

4. Navigation will automatically load the view when clicked.

## 🎯 Customization Guide

### Change Brand Colors

Edit `src/styles/variables.css`:

```css
--color-primary: #YOUR_COLOR;
--color-secondary: #YOUR_COLOR;
```

### Update Personal Information

Edit the content in view files:
- `src/views/home.html` - Hero and about sections
- `src/views/about.html` - Biography and experience
- `src/components/navbar.html` - Navigation text

### Add Your Images

Replace placeholder images in `assets/images/` and update references:

```html
<img src="assets/images/your-image.png" alt="Description">
```

### Modify Social Links

Edit `src/scripts/app.js`:

```javascript
social: {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  email: 'your-email@example.com',
}
```

## 🛠️ Services

### FormHandler

Validate and submit contact forms:

```javascript
const formData = { name: 'John', email: 'john@example.com', message: 'Hi' };
const validation = App.FormHandler.validateForm(formData);

if (validation.isValid) {
  // Submit form
}
```

### ProjectService

Manage projects data:

```javascript
const projects = await App.ProjectService.fetchProjects();
const webProjects = App.ProjectService.filterProjectsByCategory(projects, 'web');
```

### ThemeService

Handle dark mode:

```javascript
App.ThemeService.toggleDarkMode();
App.ThemeService.setDarkMode(true);
```

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:

- **Desktop**: Default styling
- **Tablets** (≤ 768px): Adjusted layouts and font sizes
- **Mobile** (≤ 480px): Optimized for small screens

## 🔧 JavaScript Utilities

### DOM Helpers

```javascript
DOM.select('.className')           // querySelector
DOM.selectAll('.className')        // querySelectorAll
DOM.create('div', 'class-name')   // createElement
DOM.addClass(element, 'class')    // classList.add
```

### Events

```javascript
Events.on(element, 'click', handler)
Events.delegate(parent, 'click', '.selector', handler)
Events.emit(element, 'customEvent', { data: 'value' })
```

### Notifications

```javascript
Notification.success('Success message!')
Notification.error('Error message!')
Notification.info('Info message!')
```

### API Calls

```javascript
const data = await API.get('https://api.example.com/data');
const response = await API.post('https://api.example.com/data', { name: 'John' });
```

### Scroll Utilities

```javascript
Scroll.to(element)                 // Smooth scroll to element
Scroll.toTop()                     // Scroll to top
Scroll.isInViewport(element)       // Check if element is visible
```

## 🎨 Grid System

Use responsive grid classes:

```html
<div class="grid grid--2col">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<div class="grid grid--3col">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

<div class="grid grid--projects">
  <!-- Auto-responsive project cards -->
</div>
```

## 📊 Working with Project Data

Projects are stored in `src/data/projects.json`. Modify this file to update your projects:

```json
{
  "id": 1,
  "title": "My Project",
  "category": "web",
  "description": "Project description",
  "image": "assets/images/project.png",
  "tags": ["React", "Node.js"],
  "link": "#"
}
```

To dynamically load and display projects in views:

```javascript
const projects = await App.ProjectService.fetchProjects();
const filtered = App.ProjectService.filterProjectsByCategory(projects, 'web');
```

## 🔐 Best Practices

1. **BEM Naming**: Use Block Element Modifier for CSS classes
2. **Component Isolation**: Keep styles scoped to components
3. **DRY Principle**: Reuse components and utilities
4. **Semantic HTML**: Use proper HTML tags for accessibility
5. **Mobile First**: Design for mobile, enhance for larger screens
6. **Performance**: Use lazy loading and minimize re-renders
7. **Documentation**: Comment complex code and document functions

## 📚 CSS File Organization

- **variables.css**: Design tokens (colors, spacing, typography)
- **globals.css**: Global resets, base styles, utilities
- **components/**: Component-specific styles (one file per component)
- **layout/**: Grid systems, sections, responsive rules

## 🚀 Deployment

### GitHub Pages

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Your portfolio is live!

### Netlify / Vercel

1. Connect your GitHub repository
2. Auto-deploy on every push
3. Get custom domain and SSL for free

### Traditional Hosting

1. Upload all files to your web server
2. Ensure `index.html` is the root file
3. No build process needed!

## 🎓 Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## 📝 Notes

- No build process or dependencies required
- All CSS variables are easily customizable
- Easily extendable with new components and views
- SEO-friendly with semantic HTML
- Accessible and keyboard navigable
- Fast loading and optimized for performance

## 👨‍💻 Support

For questions or improvements, refer to the code comments and documentation within each file.

---

**Built with ❤️ by Lancelot Shih**