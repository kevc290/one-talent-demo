#!/bin/bash

# Firebase Deployment Script for JobSearchPro
set -e

echo "🚀 Starting Firebase deployment for JobSearchPro..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ You are not logged in to Firebase. Please login first:"
    echo "firebase login"
    exit 1
fi

# Build the frontend
echo "📦 Building frontend..."
npm run build

# Deploy to Firebase
echo "🔥 Deploying to Firebase..."
firebase deploy

# Get the deployed URL
PROJECT_ID=$(firebase use | grep -o "Active Project: [^[:space:]]*" | cut -d' ' -f3)
if [ ! -z "$PROJECT_ID" ]; then
    echo "✅ Deployment complete!"
    echo "🌐 Your app is available at: https://$PROJECT_ID.web.app"
    echo "🔧 API endpoints are available at: https://us-central1-$PROJECT_ID.cloudfunctions.net/api"
    echo ""
    echo "📝 Next steps:"
    echo "1. Update your .env.production file with the correct API URL"
    echo "2. Visit your Firebase Console to configure authentication"
    echo "3. Seed initial data by visiting: https://us-central1-$PROJECT_ID.cloudfunctions.net/seedData"
else
    echo "✅ Deployment complete! Check your Firebase Console for the URL."
fi