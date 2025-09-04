# Firebase Deployment Guide for JobSearchPro

## Overview
This guide will help you deploy the JobSearchPro application to Firebase, including both frontend (React) and backend (Node.js/Express) components.

## Firebase Services Required

1. **Firebase Hosting** - For the React frontend
2. **Cloud Functions** - For the Node.js/Express backend API
3. **Firestore** - To replace PostgreSQL (or use Cloud SQL for PostgreSQL)
4. **Firebase Authentication** (optional) - For user authentication
5. **Cloud Storage** (optional) - For resume file storage

## Prerequisites

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Create a Firebase project at https://console.firebase.google.com

3. Login to Firebase:
```bash
firebase login
```

## Step 1: Initialize Firebase in Your Project

Run from the root of job-search-platform:
```bash
firebase init
```

Select the following services:
- Functions (for backend API)
- Hosting (for frontend)
- Firestore (for database)
- Storage (for file uploads)

## Step 2: Backend Migration to Cloud Functions

### Option A: Convert Express App to Cloud Functions (Recommended)

1. Create a new file `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Import your existing routes
import authRoutes from './routes/auth';
import jobsRoutes from './routes/jobs';
import applicationsRoutes from './routes/applications';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);

// Export the Express app as a Cloud Function
export const api = functions.https.onRequest(app);
```

2. Update `functions/package.json`:
```json
{
  "name": "functions",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^11.8.0",
    "firebase-functions": "^4.3.1",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^5.12.0",
    "@typescript-eslint/parser": "^5.12.0",
    "typescript": "^4.9.0"
  },
  "private": true
}
```

### Option B: Use Cloud Run (For minimal changes to existing Node.js app)

If you want to keep your Node.js app mostly unchanged, you can deploy it to Cloud Run instead.

## Step 3: Database Migration

### From PostgreSQL to Firestore

1. Create migration script `migrate-to-firestore.js`:

```javascript
const admin = require('firebase-admin');
const { Pool } = require('pg');

admin.initializeApp();
const db = admin.firestore();

// Your PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrateUsers() {
  const { rows } = await pool.query('SELECT * FROM users');
  const batch = db.batch();
  
  rows.forEach(user => {
    const docRef = db.collection('users').doc(user.id);
    batch.set(docRef, {
      ...user,
      createdAt: admin.firestore.Timestamp.fromDate(new Date(user.created_at))
    });
  });
  
  await batch.commit();
  console.log('Users migrated');
}

async function migrateJobs() {
  const { rows } = await pool.query('SELECT * FROM jobs');
  const batch = db.batch();
  
  rows.forEach(job => {
    const docRef = db.collection('jobs').doc(job.id);
    batch.set(docRef, {
      ...job,
      postedDate: admin.firestore.Timestamp.fromDate(new Date(job.posted_date))
    });
  });
  
  await batch.commit();
  console.log('Jobs migrated');
}

// Run migrations
async function migrate() {
  await migrateUsers();
  await migrateJobs();
  // Add more migrations as needed
  process.exit(0);
}

migrate().catch(console.error);
```

## Step 4: Update Frontend Configuration

1. Create `.env.production` file:
```env
VITE_API_URL=https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

2. Update `src/services/api.ts` to use the Firebase Functions URL:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/your-project/us-central1/api';
```

## Step 5: Firebase Configuration Files

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18",
    "ignore": [
      "node_modules",
      ".git",
      "firebase-debug.log",
      "firebase-debug.*.log"
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### firestore.rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for jobs
    match /jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Applications - users can read/write their own
    match /applications/{applicationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // Saved jobs
    match /savedJobs/{savedJobId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### storage.rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload their own resumes
    match /resumes/{userId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 6: Build and Deploy

1. Build the frontend:
```bash
npm run build
# Or if TypeScript errors occur:
npx vite build
```

2. Install and build the functions:
```bash
cd functions
npm install
npm install --save-dev @types/bcryptjs  # Required type definitions
npm run build
cd ..
```

3. Deploy everything:
```bash
firebase deploy
# Or use the npm scripts:
npm run fb:deploy:functions  # Deploy functions only
```

Or deploy individually:
```bash
firebase deploy --only hosting  # Frontend only
firebase deploy --only functions  # Backend only
firebase deploy --only firestore  # Database rules
firebase deploy --only storage   # Storage rules
```

## Step 7: Environment Variables for Cloud Functions

Set environment variables for Cloud Functions:
```bash
firebase functions:config:set jwt.secret="your-jwt-secret"
firebase functions:config:set admin.email="admin@example.com"
firebase functions:config:set admin.password="admin-password"
```

## Alternative: Keep PostgreSQL with Cloud SQL

If you want to keep PostgreSQL:

1. Create a Cloud SQL PostgreSQL instance in Google Cloud Console
2. Configure Cloud Functions to connect to Cloud SQL:

```typescript
// In your Cloud Function
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
});
```

3. Set the environment variables:
```bash
firebase functions:config:set database.user="postgres"
firebase functions:config:set database.password="your-password"
firebase functions:config:set database.name="jobsearch"
firebase functions:config:set database.connection_name="project:region:instance"
```

## Testing Locally

Use Firebase Emulators to test locally:
```bash
firebase emulators:start
```

This will start:
- Hosting emulator (localhost:5000)
- Functions emulator (localhost:5001)
- Firestore emulator (localhost:8080)
- Auth emulator (localhost:9099)
- Storage emulator (localhost:9199)

## Cost Considerations

- **Cloud Functions**: Pay per invocation and compute time
- **Firestore**: Pay per read/write/delete operations and storage
- **Hosting**: Free tier includes 10GB storage and 360MB/day bandwidth
- **Cloud SQL** (if used): Starts at ~$7/month for the smallest instance

For a demo/temporary deployment, stay within free tier limits:
- Firestore: 50K reads, 20K writes, 20K deletes per day
- Cloud Functions: 125K invocations, 40K GB-seconds per month
- Hosting: 10GB storage, 360MB/day transfer

## Quick Start Commands

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase in your project
firebase init

# 4. Build frontend
npm run build

# 5. Deploy
firebase deploy

# Your app will be available at:
# https://YOUR-PROJECT-ID.web.app
```

## Troubleshooting

1. **CORS Issues**: Make sure to configure CORS in your Cloud Functions
2. **API URL Mismatch**: Update all API calls to use the Cloud Functions URL
3. **Authentication**: Ensure JWT tokens are properly validated in Cloud Functions
4. **File Uploads**: Use Firebase Storage instead of local file system

## Next Steps

1. Set up CI/CD with GitHub Actions for automatic deployments
2. Configure custom domain in Firebase Hosting
3. Set up monitoring and logging in Google Cloud Console
4. Implement proper error tracking (e.g., Sentry)
5. Set up backup strategies for Firestore

## Support

For issues specific to this deployment:
1. Check Firebase Console logs
2. Use `firebase functions:log` to view function logs
3. Test with Firebase Emulators first
4. Ensure all environment variables are set correctly