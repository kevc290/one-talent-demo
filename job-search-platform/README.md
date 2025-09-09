# JobSearchPro - Job Search Platform Demo

A modern, multi-brand job search platform built with React, TypeScript, and Vite, featuring real-time search, user authentication, and embeddable widgets.

## 🚀 Features

- **Multi-brand theming** - Switch between different brand identities
- **Real-time job search** - Search and filter jobs with instant results
- **User authentication** - Login, registration, and profile management
- **Resume parsing** - Upload and parse PDF/DOCX resumes
- **Embeddable widgets** - Third-party website integration
- **Demo mode** - Full functionality with mock data
- **Responsive design** - Works on all devices

## 🛡️ Security

**ℹ️ Note: This project runs in demo mode by default using mock data - no API keys required!**

For production deployments with real backends, see [SECURITY.md](./SECURITY.md) for proper configuration.

## 🏗️ Quick Start

### 1. Clone and Install
```bash
git clone [repository-url]
cd job-search-platform
npm install
```

### 2. Configure Environment
```bash
# Copy example environment files
cp .env.example .env
cp .env.production.example .env.production
cp functions/.env.example functions/.env

# Edit the files and add your actual API keys
```

### 3. Demo Mode (Recommended for testing)
```bash
# Add to your .env file
VITE_DEMO_MODE=true
```

### 4. Start Development
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/            # React contexts (Auth, Theme)
├── data/               # Mock data and types
├── embeds/             # Embeddable widget components
├── pages/              # Page components
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
└── utils/              # Helper utilities

functions/              # Firebase Functions (backend)
public/                 # Static assets
├── embed.js           # Embeddable widget script
└── videos/            # Demo videos
```

## 🎨 Brand Themes

The platform supports multiple brand identities:

- **JobSearch Pro** (Blue) - Professional corporate theme
- **Career Hub** (Purple) - Modern startup theme  
- **Talent Finder** (Green) - Fresh and energetic theme

## 🔧 Environment Configuration

### Local Development (.env)
```bash
VITE_DEMO_MODE=true
VITE_API_BASE_URL=http://localhost:3001/api  # Only needed if using custom backend
```

### Production (.env.production)
```bash
VITE_DEMO_MODE=true  # Recommended for static deployments
# VITE_API_BASE_URL=https://your-api-domain.com/api  # Only if you have a backend
```

### Demo Mode
```bash
VITE_DEMO_MODE=true  # Uses mock data, no API calls
```

## 📦 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks


### GitHub Pages
- `npm run gh-pages:deploy` - Deploy to GitHub Pages
- `npm run gh-pages:deploy:demo` - Deploy in demo mode

## 🔗 Embeddable Widgets

The platform provides embeddable widgets for third-party integration:

```html
<!-- Add to any website -->
<script src="https://your-domain.com/embed.js"></script>
<div data-jobsearch-widget="search" data-theme="modern"></div>
```

**Widget Types:**
- `search` - Full job search with filters
- `listings` - Compact job listings
- `login` - User authentication form

## 🚀 Deployment

### GitHub Pages
```bash
npm run deploy:demo
```

### Custom Deployment
Build the project and serve the `dist` folder:
```bash
npm run build
# Upload dist/ to your hosting provider
```

## 🧪 Testing

The platform includes comprehensive testing for POC demonstrations:

- **Authentication flows** - Login, registration, profile management
- **Job search functionality** - Search, filtering, saved jobs
- **Application process** - Resume upload, job applications
- **Multi-brand theming** - Theme switching and consistency
- **Responsive design** - Mobile and desktop compatibility

## 📱 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Follow the security guidelines in [SECURITY.md](./SECURITY.md)
2. Never commit API keys or sensitive data
3. Use demo mode for public demonstrations
4. Test across all brand themes
5. Ensure responsive design works

## 📄 License

This project is for demonstration purposes. See LICENSE file for details.

## 🔒 Security Notes

- All environment files with real API keys are gitignored
- Use `.env.example` files as templates
- Enable demo mode for public deployments
- Configure Firebase security rules properly
- Restrict API keys by HTTP referrer in production

For detailed security setup, see [SECURITY.md](./SECURITY.md).