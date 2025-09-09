#!/bin/bash

# GitHub Pages Deployment Script for JobSearchPro
set -e

echo "🚀 Starting GitHub Pages deployment for JobSearchPro..."

# Build the frontend in demo mode
echo "📦 Building frontend in demo mode..."
VITE_DEMO_MODE=true npm run build

# Deploy to GitHub Pages
echo "📄 Deploying to GitHub Pages..."
npm run deploy:demo

echo "✅ Deployment complete!"
echo "🌐 Your app will be available at: https://kevc290.github.io/one-talent-demo/"
echo "📝 Note: This deployment uses demo mode with mock data for security."