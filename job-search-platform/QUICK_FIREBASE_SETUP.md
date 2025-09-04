# Quick Firebase Setup Guide

## 🚀 Fast Track to Firebase Deployment

### 1. Prerequisites (5 minutes)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login
```

### 2. Create Firebase Project (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it something like "jobsearchpro-demo"
4. Enable Google Analytics (optional)
5. Wait for project creation

### 3. Initialize Firebase in Your Project (3 minutes)

**Note: Configuration files are already created!** You have:
- ✅ firebase.json
- ✅ firestore.rules  
- ✅ storage.rules
- ✅ functions/src/index.ts (backend API)

```bash
# From the job-search-platform directory
firebase init

# Select these services:
# ✅ Functions: Configure and deploy Cloud Functions
# ✅ Firestore: Deploy rules and create indexes for Firestore
# ✅ Hosting: Configure and deploy Firebase Hosting sites
# ✅ Storage: Deploy Cloud Storage security rules

# Choose your project from the list
# Use existing public directory: dist
# Configure as single-page app: Yes
# Set up automatic builds and deploys with GitHub: No
# Functions language: TypeScript
# Use ESLint: Yes
# Install dependencies: Yes
```

### 4. Configure Environment (2 minutes)

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" → Web app
4. Register app (name: "JobSearchPro")
5. Copy the config values

Update `.env.production`:
```env
VITE_API_URL=https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api
VITE_FIREBASE_API_KEY=your-api-key-from-console
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 5. Set JWT Secret (1 minute)

```bash
firebase functions:config:set jwt.secret="your-super-secret-jwt-key-change-this"
```

### 6. Deploy (5 minutes)

```bash
# Option A: Use npm scripts
npm run build  # Build frontend (or use: npx vite build)
npm run fb:deploy:functions  # Deploy backend to Firebase

# Option B: Deploy everything at once
firebase deploy

# Option C: Use the deployment script (if executable)
./deploy.sh
```

### 7. Seed Initial Data (1 minute)

After deployment, visit:
```
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/seedData
```

### 8. Test Your Deployment

Your app will be available at:
```
https://YOUR-PROJECT-ID.web.app
```

API endpoints will be at:
```
https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api
```

## 🔧 Common Issues & Solutions

### Issue: "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### Issue: "Not logged in"
```bash
firebase login
```

### Issue: "Functions deployment failed" 
```bash
cd functions
npm install
npm install --save-dev @types/bcryptjs  # Add missing types
npm run build  # Verify build works
cd ..
firebase deploy --only functions
```

### Issue: "Functions TypeScript build errors"
- The TypeScript configuration has been relaxed to allow building
- If errors persist, check functions/tsconfig.json has `"noImplicitReturns": false`

### Issue: "API calls failing"
- Check your `.env.production` file has the correct API URL
- Ensure CORS is enabled in Cloud Functions
- Check Firebase Console > Functions logs for errors

### Issue: "Database permission denied"
- Check `firestore.rules` is deployed: `firebase deploy --only firestore:rules`
- Verify authentication is working

## 🎯 Quick Test Checklist

- [ ] App loads at Firebase Hosting URL
- [ ] Can view jobs without login
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can apply for jobs
- [ ] Can save jobs
- [ ] HubSpot demo page works

## 💰 Cost Estimate for Demo

**Free Tier Limits (per month):**
- Cloud Functions: 125K invocations
- Firestore: 50K reads, 20K writes
- Hosting: 10GB storage, 360MB/day transfer
- Authentication: Unlimited

**Estimated demo cost:** $0 (stays within free limits)

## 🚀 Going Live Tips

1. **Custom Domain:** Firebase Hosting supports custom domains
2. **SSL:** Automatic HTTPS with Firebase Hosting
3. **Performance:** Enable gzip compression (automatic)
4. **Monitoring:** Enable Firebase Performance Monitoring
5. **Analytics:** Enable Firebase Analytics
6. **Backup:** Set up automated Firestore exports

## 📞 Need Help?

1. Check [Firebase Documentation](https://firebase.google.com/docs)
2. Look at Firebase Console logs
3. Use `firebase functions:log` for function debugging
4. Test locally with `firebase emulators:start`

---

**Total Setup Time: ~20 minutes**
**Deployment Time: ~5 minutes**
**Demo Ready: ✅**