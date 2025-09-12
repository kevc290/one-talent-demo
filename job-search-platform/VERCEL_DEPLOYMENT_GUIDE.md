# Vercel Deployment Guide

This guide will help you deploy your Kelly job search platform to Vercel with full HubSpot integration support.

## Why Vercel Over GitHub Pages?

**GitHub Pages Limitations:**
- ❌ No environment variables support
- ❌ CORS issues with HubSpot API calls
- ❌ Would expose API keys in client bundle
- ❌ Static hosting only - no serverless functions

**Vercel Advantages:**
- ✅ Full environment variables support
- ✅ Serverless functions for secure API proxying
- ✅ Zero-config React/Vite deployment
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS and global CDN

## Quick Migration Steps

### 1. Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Grant Vercel access to your repositories

### 2. Import Your Project

1. Click **"New Project"** in Vercel dashboard
2. Select your GitHub repository: `one-talent-demo/job-search-platform`
3. Vercel will auto-detect it's a Vite project
4. Click **"Deploy"**

### 3. Configure Environment Variables

After deployment, add these environment variables in Vercel:

1. Go to **Project Settings** → **Environment Variables**
2. Add these variables:

```
VITE_HUBSPOT_SERVICE_TYPE = vercel
VITE_HUBSPOT_API_KEY = pat-na1-your-actual-hubspot-token
VITE_HUBSPOT_PORTAL_ID = your-portal-id
VITE_HUBSPOT_API_BASE_URL = https://api.hubapi.com
VITE_HUBSPOT_CUSTOM_OBJECT_TYPE = your-custom-object-id
```

### 4. Redeploy

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Your site will now have HubSpot integration enabled!

## Configuration Options

### Service Types

Set `VITE_HUBSPOT_SERVICE_TYPE` to one of:

**`vercel` (Recommended for Production)**
- Uses secure serverless functions
- API keys stay on server-side
- No CORS issues
- Best security and performance

**`mock` (Default for Development)**
- Uses demo data
- No API calls required
- Safe for testing and demos

**`direct` (Not recommended for browsers)**
- Direct API calls from client
- Will fail due to CORS in browsers
- Only works in Node.js environments

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_HUBSPOT_SERVICE_TYPE` | Yes | Service type: 'vercel', 'mock', or 'direct' |
| `VITE_HUBSPOT_API_KEY` | Yes* | HubSpot Private App token (pat-na1-...) |
| `VITE_HUBSPOT_PORTAL_ID` | No | Your HubSpot Portal ID |
| `VITE_HUBSPOT_API_BASE_URL` | No | HubSpot API base URL (defaults to official URL) |
| `VITE_HUBSPOT_CUSTOM_OBJECT_TYPE` | No | Custom object type ID for widgets |

*Required only when using 'vercel' or 'direct' service types

## Serverless Function Details

The `/api/hubspot.js` function handles:
- ✅ Secure API key storage (server-side only)
- ✅ CORS headers for frontend access
- ✅ Error handling and validation
- ✅ Request/response transformation
- ✅ Rate limiting protection

## Testing Your Deployment

### 1. Check Service Type

Open browser console on your deployed site. You should see:
```
🔗 Using Vercel HubSpot Service (serverless functions)
```

### 2. Test API Endpoints

Manually test your serverless function:
```bash
curl -X POST https://your-site.vercel.app/api/hubspot \
  -H "Content-Type: application/json" \
  -d '{"action": "testConnection"}'
```

Expected response:
```json
{"success": true, "message": "HubSpot connection successful"}
```

### 3. Verify Dashboard Widgets

1. Navigate to the dashboard
2. Check that HubSpot widgets load (not showing "Loading..." indefinitely)
3. Verify content matches your HubSpot setup
4. Check browser Network tab for successful API calls to `/api/hubspot`

## Troubleshooting

### Common Issues

**"HubSpot API key not configured" Error**
- Check environment variables are set in Vercel
- Redeploy after adding environment variables
- Ensure `VITE_HUBSPOT_SERVICE_TYPE=vercel`

**Widgets Show Mock Data Instead of HubSpot Content**
- Verify `VITE_HUBSPOT_SERVICE_TYPE=vercel` in environment variables
- Check browser console for service type confirmation
- Ensure API key is valid and has proper scopes

**CORS Errors**
- Should not happen with Vercel setup
- If it does, check the serverless function is deployed correctly
- Verify `/api/hubspot` endpoint is accessible

**500 Internal Server Error**
- Check Vercel function logs in dashboard
- Verify HubSpot API key is valid
- Ensure custom object type ID is correct

### Debugging Steps

1. **Check Vercel Function Logs:**
   - Go to Vercel dashboard → Functions tab
   - Click on `/api/hubspot` function
   - Review execution logs

2. **Verify Environment Variables:**
   - Project Settings → Environment Variables
   - Ensure all required variables are set
   - Check for typos in variable names

3. **Test HubSpot Connection:**
   ```bash
   curl -X POST https://your-site.vercel.app/api/hubspot \
     -H "Content-Type: application/json" \
     -d '{"action": "testConnection"}'
   ```

## Performance Considerations

- **Cold Starts:** First API call after inactivity may be slower (~1-2 seconds)
- **Caching:** Consider implementing caching for frequently accessed content
- **Rate Limits:** HubSpot allows 100 requests per 10 seconds (handled automatically)

## Security Benefits

✅ **API Keys Protected:** Never exposed to frontend users  
✅ **HTTPS Only:** All communications encrypted  
✅ **Request Validation:** Serverless function validates all inputs  
✅ **CORS Configured:** Only your domain can access the API  
✅ **Error Handling:** Detailed errors logged server-side, safe errors returned to client  

## Cost Estimation

**Vercel Free Tier Limits:**
- 100GB bandwidth per month
- 100 serverless function executions per day
- Unlimited static file serving

**Typical Usage for Demo/PoC:**
- Dashboard page loads: ~10 API calls
- Expected monthly usage: Well under free limits
- Cost: **$0/month** for demo purposes

## Next Steps After Deployment

1. **Custom Domain:** Add your own domain in Vercel settings
2. **Analytics:** Enable Vercel Analytics for usage tracking
3. **Monitoring:** Set up alerts for function errors
4. **Content Management:** Train your marketing team on HubSpot content updates
5. **Staging Environment:** Create separate Vercel project for testing

---

## Quick Commands Reference

```bash
# Deploy to Vercel (if using Vercel CLI)
npx vercel --prod

# Test local serverless function
npx vercel dev

# Check deployment status
npx vercel ls

# View function logs
npx vercel logs your-deployment-url
```

Your Kelly job search platform is now ready for production with secure HubSpot integration! 🚀