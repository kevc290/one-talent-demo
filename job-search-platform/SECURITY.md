# Security Configuration

## Demo Mode (Recommended)

**✅ SAFE: This project runs in demo mode by default with no API keys required!**

### Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **The default configuration is secure:**
   ```bash
   VITE_DEMO_MODE=true  # Uses mock data, no external API calls
   ```

### Environment Files

- **`.env`** - Local development environment
- **`.env.production`** - Production deployment configuration
- **`.env.github`** - GitHub Pages demo configuration (safe to commit)

### Demo Mode

For public demos without exposing sensitive data, use demo mode:

```bash
# In .env or .env.production
VITE_DEMO_MODE=true
```

This will use mock data and disable all API calls.

### Custom Backend Configuration (Optional)

If you want to connect to a real backend instead of using demo mode:

1. **Set demo mode to false:**
   ```bash
   VITE_DEMO_MODE=false
   ```

2. **Configure your API endpoint:**
   ```bash
   VITE_API_BASE_URL=https://your-api-domain.com/api
   ```

3. **Secure your backend properly** with authentication and rate limiting

### Deployment Security

- **GitHub Pages/Static Hosting**: Demo mode is automatically secure (no API calls)
- **Custom Backend**: Implement proper authentication, rate limiting, and CORS
- **Production**: Always use HTTPS and secure headers

## What NOT to commit:

- ❌ Real API keys (if using custom backend)
- ❌ Database passwords
- ❌ Any `.env` files with sensitive values

## What IS safe to commit:

- ✅ Demo mode configuration (`VITE_DEMO_MODE=true`)
- ✅ Example environment files (`.env.example`)
- ✅ Public configuration (like `.env.github`)
- ✅ Documentation about environment setup