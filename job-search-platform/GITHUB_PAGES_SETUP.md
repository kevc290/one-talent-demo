# GitHub Pages Deployment Guide

## 🚀 Option 1: Frontend Only (Recommended for Demo)

### Quick Setup (10 minutes):

1. **Create GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```

2. **Install GitHub Pages Deployment Tool:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add Deploy Script to package.json:**
   ```json
   {
     "scripts": {
       "fb:deploy:functions": "firebase deploy --only functions",
       "gh-pages:predeploy": "npm run build",
       "gh-pages:deploy": "gh-pages -d dist",
       "gh-pages:deploy:demo": "npm run build && gh-pages -d dist -m 'Deploy JobSearchPro demo'"
     },
     "homepage": "https://YOUR-USERNAME.github.io/YOUR-REPO-NAME"
   }
   ```

4. **Deploy to GitHub Pages:**
   ```bash
   npm run gh-pages:deploy:demo
   ```

5. **Enable GitHub Pages in Repository Settings:**
   - Go to Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` / `root`

### For Backend: Use Firebase Functions (Free)
Keep your backend on Firebase Functions (free tier) and point the frontend to it:

**Update `.env.production`:**
```env
VITE_API_URL=https://us-central1-YOUR-FIREBASE-PROJECT.cloudfunctions.net/api
```

## 🔧 Option 2: Full-Stack with GitHub Actions + Firebase

### Setup CI/CD Pipeline:

1. **Create `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to GitHub Pages and Firebase

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build frontend
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
    
    - name: Install Firebase CLI
      run: npm install -g firebase-tools
    
    - name: Deploy Functions to Firebase
      run: firebase deploy --only functions
      env:
        FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

2. **Add Firebase Token to GitHub Secrets:**
   ```bash
   firebase login:ci
   # Copy the token and add it to GitHub Secrets as FIREBASE_TOKEN
   ```

## 🎯 Option 3: Static Demo (No Backend)

Convert to a static demo with mock data:

1. **Create Mock API Service:**

```typescript
// src/services/mockApi.ts
export const mockApiService = {
  async getJobs() {
    return {
      success: true,
      data: {
        data: mockJobs,
        total: mockJobs.length,
        page: 1,
        totalPages: 1
      }
    };
  },
  
  async getJobById(id: string) {
    const job = mockJobs.find(j => j.id === id);
    return {
      success: true,
      data: job
    };
  },
  
  async submitApplication(data: any) {
    // Simulate success
    return {
      success: true,
      data: { id: Date.now().toString(), appliedDate: new Date().toISOString() }
    };
  }
};
```

2. **Update Environment Detection:**
```typescript
// src/services/api.ts
const isGitHubPages = window.location.hostname.includes('github.io');
const apiService = isGitHubPages ? mockApiService : realApiService;
```

## 📝 Current Repository Setup:

Based on your current setup, here's what I recommend:

### 1. Quick GitHub Pages Deploy (5 minutes):
```bash
# Add deployment script
npm install --save-dev gh-pages

# Add to package.json scripts:
"fb:deploy:functions": "firebase deploy --only functions",
"gh-pages:predeploy": "npm run build",
"gh-pages:deploy": "gh-pages -d dist",
"gh-pages:deploy:demo": "npm run build && gh-pages -d dist -m 'Deploy JobSearchPro demo'",
"homepage": "https://YOUR-USERNAME.github.io/jobsearchpro-demo"

# Deploy
npm run gh-pages:deploy:demo
```

### 2. Backend Options:
- **Firebase Functions** (Free, recommended)
- **Vercel Functions** (Free)
- **Netlify Functions** (Free)
- **Railway** (Free tier available)

### 3. Environment Configuration:
```bash
# For GitHub Pages
VITE_API_URL=https://us-central1-jobsearchpro-demo.cloudfunctions.net/api

# Or for static demo
VITE_DEMO_MODE=true
```

## 🚀 Recommended Approach:

**For a demo site, I recommend:**

1. **Frontend**: GitHub Pages (free, fast)
2. **Backend**: Firebase Functions (free tier)
3. **Database**: Firestore (free tier)

This gives you:
- ✅ Free hosting
- ✅ Custom domain support
- ✅ HTTPS automatically
- ✅ Fast global CDN
- ✅ Full backend functionality
- ✅ Easy to share and demo

## 🔧 Setup Commands:

```bash
# 1. Setup GitHub Pages deployment
npm install --save-dev gh-pages

# 2. Deploy frontend to GitHub Pages
npm run gh-pages:deploy:demo

# 3. Deploy backend to Firebase
npm run fb:deploy:functions

# 4. Your demo will be live at:
# Frontend: https://YOUR-USERNAME.github.io/YOUR-REPO-NAME
# Backend: https://us-central1-PROJECT-ID.cloudfunctions.net/api
```

Would you like me to set this up for your current repository?