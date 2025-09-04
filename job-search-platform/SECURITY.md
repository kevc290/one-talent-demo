# Security Configuration

## Environment Variables

**⚠️ IMPORTANT: Never commit API keys or sensitive data to version control!**

### Local Development Setup

1. **Copy the example files:**
   ```bash
   cp .env.example .env
   cp .env.production.example .env.production
   cp functions/.env.example functions/.env
   ```

2. **Fill in your actual values:**
   - Replace `your-firebase-api-key-here` with your real Firebase API key
   - Replace `your-project-id` with your Firebase project ID
   - Generate a secure JWT secret for `functions/.env`

### Environment Files

- **`.env`** - Local development environment
- **`.env.production`** - Production environment (Firebase/deployment)
- **`functions/.env`** - Firebase Functions environment
- **`.env.github`** - GitHub Pages demo configuration (safe to commit)

### Demo Mode

For public demos without exposing sensitive data, use demo mode:

```bash
# In .env or .env.production
VITE_DEMO_MODE=true
```

This will use mock data and disable all API calls.

### Firebase Configuration

Your Firebase API key is safe to expose in frontend code as it's designed for client-side use, but the project itself should be properly configured with:

1. **Firebase Security Rules** - Restrict database access
2. **API Key Restrictions** - Limit HTTP referrers in Google Cloud Console
3. **Authentication** - Require user login for sensitive operations

### JWT Secret

Generate a secure JWT secret for your backend:

```bash
# Generate a random 256-bit key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Deployment Security

- **GitHub Pages**: Only use demo mode or restrict API keys by HTTP referrer
- **Firebase Functions**: Use environment variables in Firebase Functions config
- **Production**: Always use HTTPS and secure headers

## What NOT to commit:

- ❌ Real API keys
- ❌ JWT secrets  
- ❌ Database passwords
- ❌ Firebase service account keys
- ❌ Any `.env` files with real values

## What IS safe to commit:

- ✅ Example environment files (`.env.example`)
- ✅ Public configuration (like `.env.github` with placeholders)
- ✅ Documentation about environment setup