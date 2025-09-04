# 🚀 GitHub Pages Deployment Guide for JobSearchPro

## Quick Deployment (5 minutes)

### Step 1: Create GitHub Repository

1. **Create a new repository** on GitHub (e.g., `jobsearchpro-demo`)
2. **Make it public** (required for GitHub Pages free tier)
3. **Don't initialize** with README, .gitignore, or license

### Step 2: Push Your Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: JobSearchPro demo app"

# Add GitHub remote (replace with your actual repository URL)
git remote add origin https://github.com/YOUR-USERNAME/jobsearchpro-demo.git

# Create and push to main branch
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select **"GitHub Actions"**
5. The workflow will automatically trigger

### Step 4: Wait for Deployment

- Check the **Actions** tab to see deployment progress
- First deployment takes ~2-3 minutes
- Your site will be available at: `https://YOUR-USERNAME.github.io/jobsearchpro-demo`

## 🎯 Backend Options

Since GitHub Pages only hosts static files, you have several options for the backend:

### Option A: Firebase Functions (Recommended)
```bash
# Complete the Firebase setup from earlier
npm run fb:deploy:functions

# Update .env.github with your Firebase Functions URL
VITE_API_URL=https://us-central1-YOUR-PROJECT.cloudfunctions.net/api
```

### Option B: Demo Mode (Fully Static)
Enable demo mode for a fully static experience:

```env
# In .env.github
VITE_DEMO_MODE=true
```

This will use mock data and simulate all API calls locally.

### Option C: Other Free Backend Services
- **Vercel Functions**: Deploy backend separately to Vercel
- **Netlify Functions**: Deploy backend separately to Netlify
- **Railway**: Free PostgreSQL hosting
- **Supabase**: Free PostgreSQL + API

## 🔧 Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build the app first (if needed)
npm run build
# Or if TypeScript errors occur:
npx vite build

# Then deploy to GitHub Pages
npm run gh-pages:deploy

# Or for a complete build and deploy with commit message
npm run gh-pages:deploy:demo

# This will:
# 1. Run npm run build
# 2. Push the dist folder to gh-pages branch
# 3. GitHub Pages will serve from that branch
```

## 📝 Environment Configuration

### For GitHub Pages with Firebase Backend:
Update `.env.github`:
```env
VITE_API_URL=https://us-central1-your-project.cloudfunctions.net/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### For Static Demo Mode:
```env
VITE_DEMO_MODE=true
```

## 🚀 Custom Domain (Optional)

1. **Buy a domain** (e.g., from Namecheap, Google Domains)
2. **Add CNAME file** to your repository root:
   ```
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```
3. **Configure DNS** with your domain provider:
   - Add CNAME record: `www` → `YOUR-USERNAME.github.io`
   - Add A records for apex domain:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

## 🔄 Automatic Deployments

The GitHub Action will automatically deploy when you:
- Push to `main` branch
- Merge a pull request
- Manually trigger the workflow

## 📊 Demo Data Setup

If using Firebase backend, seed data by visiting:
```
https://us-central1-YOUR-PROJECT.cloudfunctions.net/seedData
```

If using demo mode, mock data is already included.

## 🛠️ Troubleshooting

### Issue: "404 Page Not Found"
- Ensure GitHub Pages is enabled in repository settings
- Check that the Actions workflow completed successfully
- Verify the `base` path in `vite.config.ts` matches your repository name

### Issue: "Blank page after deployment"
- Check browser console for errors
- Ensure all environment variables are set correctly
- Verify the build completed successfully in GitHub Actions

### Issue: "API calls failing"
- Check that `VITE_API_URL` is correctly set
- Ensure CORS is configured on your backend
- Verify the backend is deployed and accessible

### Issue: "Routing not working"
The GitHub Action is configured for single-page apps, but if you have issues:
1. Ensure the Action uses the correct artifact upload path (`./dist`)
2. Check that routing works in the build locally: `npm run build && npm run preview`

## 🎯 Final Checklist

- [ ] Repository is public
- [ ] GitHub Pages is enabled with "GitHub Actions" source
- [ ] Workflow completed successfully (green checkmark in Actions tab)
- [ ] Environment variables are configured
- [ ] Backend is deployed (Firebase Functions or demo mode)
- [ ] Site is accessible at GitHub Pages URL
- [ ] All features work (login, job search, applications)

## 📋 Commands Summary

```bash
# Setup repository
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/jobsearchpro-demo.git
git branch -M main
git push -u origin main

# Manual deployment to GitHub Pages
npm run gh-pages:deploy          # Basic deploy
npm run gh-pages:deploy:demo     # Deploy with build and commit message

# Firebase backend deployment (if using)
npm run fb:deploy:functions

# Check your deployed site
open https://YOUR-USERNAME.github.io/jobsearchpro-demo
```

## 🌟 Demo URL Example

Your final demo will be available at:
```
https://YOUR-USERNAME.github.io/jobsearchpro-demo
```

**Features that will work:**
- ✅ Multi-brand theming
- ✅ Job browsing and search
- ✅ HubSpot demo page
- ✅ User registration/login (if backend configured)
- ✅ Job applications (if backend configured)
- ✅ Resume uploads (if backend configured)
- ✅ Responsive design
- ✅ All existing functionality

**Hosting costs:** **$0** (completely free with GitHub Pages)