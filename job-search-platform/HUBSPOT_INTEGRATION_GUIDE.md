# HubSpot Integration Guide for Kelly Dashboard

## 🎯 Quick Start Summary

**What You Need:** A free HubSpot account with Super Admin access  
**Authentication Method:** Private Apps (still supported in 2024)  
**Time to Complete:** ~30 minutes  
**Result:** Marketing team can update dashboard content from HubSpot  

---

## 📋 2024 Update: HubSpot Authentication Status

**Private Apps Status:** ✅ **Still fully supported** and recommended for single-account integrations  
**Developer Projects:** New unified interface (opt-in), but still uses Private Apps underneath  
**API Keys:** ❌ Deprecated in November 2022  

**For Your Dashboard:** Private Apps are perfect because:
- ✅ Single HubSpot account integration
- ✅ Simple setup (no OAuth complexity)
- ✅ Non-expiring access tokens
- ✅ Sufficient API limits for dashboard use

---

## Table of Contents
1. [HubSpot Account Setup](#hubspot-account-setup)
2. [Creating Custom Objects & Properties](#creating-custom-objects--properties)
3. [Setting Up Content in HubSpot](#setting-up-content-in-hubspot)
4. [API Configuration](#api-configuration)
5. [Code Integration](#code-integration)
6. [Testing & Validation](#testing--validation)
7. [Demo Preparation](#demo-preparation)

---

## 1. HubSpot Account Setup

### Step 1.1: Access Your HubSpot Account
1. Log in to your HubSpot account at [app.hubspot.com](https://app.hubspot.com)
2. Navigate to **Settings** (gear icon in top navigation)

### Step 1.2: Create a Private App for API Access

**Important:** You must be a **Super Admin** to create private apps.

1. In HubSpot, go to **Settings** (gear icon) → **Integrations** → **Private Apps**
2. Click **"Create private app"**
3. On the **Basic Info** tab:
   - **App name:** "Kelly Dashboard Integration"
   - **Description:** "Custom integration for Kelly Services dashboard widgets and content management"
   - **Logo:** Optional - upload Kelly Services logo

### Step 1.3: Configure API Permissions (Scopes)

Click the **Scopes** tab and enable these permissions:

#### Required CRM Permissions:
- ✅ `crm.objects.custom.read` - Read custom objects (for widget content)
- ✅ `crm.objects.custom.write` - Write custom objects (if you want to create content via API)
- ✅ `crm.schemas.custom.read` - Read custom object schemas

#### Optional Content Permissions (for future expansion):
- ✅ `content` - Read CMS content
- ✅ `files` - Access to HubSpot files/images

#### For Testing Connection:
- ✅ `crm.objects.contacts.read` - Read contacts (used by testConnection method)

### Step 1.4: Generate Access Token

1. After configuring scopes, click **"Create app"**
2. Go to the **Auth** tab
3. Copy your **Access Token** (starts with `pat-na1-...`)
4. ⚠️ **Important:** Save this token securely - it won't be shown again!

**Token Details:**
- Non-expiring (unlike OAuth tokens)
- Account-specific
- Rate limited: 250,000 calls/day (Free/Starter) or 500,000 calls/day (Pro/Enterprise)

---

## 2. Creating Custom Objects & Properties

### Step 2.1: Create a Custom Object for Dashboard Content

1. Go to **Settings** → **Objects** → **Custom Objects**
2. Click **Create custom object**
3. Name: "Dashboard Widget Content"
4. Singular: "Widget Content"
5. Plural: "Widget Contents"

### Step 2.2: Define Properties for Widget Content

Create these properties for your custom object:

| Property Name | Type | Description | Internal Name |
|--------------|------|-------------|---------------|
| Widget ID | Single-line text | Unique identifier for widget | `widget_id` |
| Widget Type | Dropdown | Type of widget (banner, card, cta) | `widget_type` |
| Title | Single-line text | Widget title | `title` |
| Content | Multi-line text | Main content text | `content` |
| HTML Content | Multi-line text | Rich HTML content | `html_content` |
| CTA Text | Single-line text | Call-to-action button text | `cta_text` |
| CTA URL | Single-line text | Call-to-action URL | `cta_url` |
| Image URL | Single-line text | Featured image URL | `image_url` |
| Author | Single-line text | Content author | `author` |
| Tags | Multiple checkboxes | Content tags | `tags` |
| Active | Toggle | Is content active? | `is_active` |
| Priority | Number | Display priority (1-10) | `priority` |
| Start Date | Date picker | When to start showing | `start_date` |
| End Date | Date picker | When to stop showing | `end_date` |

### Step 2.3: Dropdown Options for Widget Type
- banner
- card
- blog_post
- cta
- testimonial
- announcement

---

## 3. Setting Up Content in HubSpot

### Step 3.1: Create Widget Content Records

Navigate to **Contacts** → **Dashboard Widget Content** (your custom object)

#### Banner Widget Example:
```
Widget ID: hs-banner-1
Widget Type: banner
Title: Welcome to Your Career Journey
Content: Discover exciting opportunities and take the next step in your career with Kelly Services.
CTA Text: Explore Opportunities
CTA URL: /jobs
Image URL: [Upload to HubSpot Files]
Active: Yes
Priority: 10
Tags: career, welcome, banner
```

#### Promotional Card Example:
```
Widget ID: hs-promo-1
Widget Type: card
Title: New Year, New Career
Content: Make 2024 your year of professional growth. Browse our latest job openings.
CTA Text: Browse Jobs
CTA URL: /jobs
Image URL: [Upload to HubSpot Files]
Active: Yes
Priority: 8
Tags: promotion, jobs, 2024
```

#### Blog Post Example:
```
Widget ID: hs-tips-1
Widget Type: blog_post
Title: Interview Success Tips
Content: Master your next interview with these proven strategies...
Author: Kelly Career Team
Active: Yes
Priority: 7
Tags: interview, tips, career-advice
```

### Step 3.2: Upload Images to HubSpot Files

1. Go to **Marketing** → **Files and Templates** → **Files**
2. Upload banner and card images
3. Copy the public URL for each image
4. Update the Image URL field in your content records

---

## 4. API Configuration

### Step 4.1: Environment Variables

Create/update `.env` file in your project:

```env
# HubSpot Configuration
VITE_HUBSPOT_API_KEY=pat-na1-xxxxxxxxxxxxxxxxxxxxx
VITE_HUBSPOT_PORTAL_ID=YOUR_PORTAL_ID
VITE_HUBSPOT_API_BASE_URL=https://api.hubapi.com
VITE_USE_REAL_HUBSPOT=true

# Custom Object Configuration
VITE_HUBSPOT_CUSTOM_OBJECT_ID=dashboard_widget_content
```

### Step 4.2: Find Your Portal ID

1. In HubSpot, go to **Settings** → **Account & Billing**
2. Find your **Hub ID** (Portal ID)
3. Add it to your environment variables

---

## 5. Code Integration

### Step 5.1: Install HubSpot Client Library

```bash
npm install @hubspot/api-client
```

### Step 5.2: Create Real HubSpot Service

Create `src/services/realHubSpotService.ts`:

```typescript
import { Client } from '@hubspot/api-client';
import type { HubSpotContent } from '../types/pageBuilder';

class RealHubSpotService {
  private client: Client;
  private customObjectType = 'dashboard_widget_content';

  constructor() {
    const apiKey = import.meta.env.VITE_HUBSPOT_API_KEY;
    if (!apiKey) {
      throw new Error('HubSpot API key not configured');
    }
    
    this.client = new Client({ accessToken: apiKey });
  }

  async getContentById(widgetId: string): Promise<HubSpotContent | null> {
    try {
      // Search for content by widget_id property
      const searchResponse = await this.client.crm.objects.searchApi.doSearch(
        this.customObjectType,
        {
          filterGroups: [{
            filters: [{
              propertyName: 'widget_id',
              operator: 'EQ',
              value: widgetId
            }, {
              propertyName: 'is_active',
              operator: 'EQ',
              value: 'true'
            }]
          }],
          properties: [
            'widget_id', 'widget_type', 'title', 'content', 
            'html_content', 'cta_text', 'cta_url', 'image_url',
            'author', 'tags', 'priority'
          ],
          limit: 1
        }
      );

      if (searchResponse.results.length === 0) {
        return null;
      }

      const result = searchResponse.results[0];
      return this.mapToHubSpotContent(result);
    } catch (error) {
      console.error('Error fetching HubSpot content:', error);
      return null;
    }
  }

  async getContent(filters?: { type?: string; tags?: string[] }): Promise<HubSpotContent[]> {
    try {
      const filterGroups: any[] = [{
        filters: [{
          propertyName: 'is_active',
          operator: 'EQ',
          value: 'true'
        }]
      }];

      if (filters?.type) {
        filterGroups[0].filters.push({
          propertyName: 'widget_type',
          operator: 'EQ',
          value: filters.type
        });
      }

      const searchResponse = await this.client.crm.objects.searchApi.doSearch(
        this.customObjectType,
        {
          filterGroups,
          properties: [
            'widget_id', 'widget_type', 'title', 'content',
            'html_content', 'cta_text', 'cta_url', 'image_url',
            'author', 'tags', 'priority'
          ],
          sorts: [{
            propertyName: 'priority',
            direction: 'DESCENDING'
          }],
          limit: 100
        }
      );

      return searchResponse.results.map(result => this.mapToHubSpotContent(result));
    } catch (error) {
      console.error('Error fetching HubSpot content:', error);
      return [];
    }
  }

  private mapToHubSpotContent(hubspotObject: any): HubSpotContent {
    const props = hubspotObject.properties;
    
    return {
      id: props.widget_id || hubspotObject.id,
      type: props.widget_type as HubSpotContent['type'],
      title: props.title || '',
      content: props.content || '',
      htmlContent: props.html_content,
      imageUrl: props.image_url,
      ctaText: props.cta_text,
      ctaUrl: props.cta_url,
      author: props.author,
      publishedDate: props.createdate,
      tags: props.tags ? props.tags.split(',').map((t: string) => t.trim()) : []
    };
  }

  async searchContent(query: string): Promise<HubSpotContent[]> {
    try {
      const searchResponse = await this.client.crm.objects.searchApi.doSearch(
        this.customObjectType,
        {
          filterGroups: [{
            filters: [
              {
                propertyName: 'is_active',
                operator: 'EQ',
                value: 'true'
              }
            ]
          }],
          properties: [
            'widget_id', 'widget_type', 'title', 'content',
            'html_content', 'cta_text', 'cta_url', 'image_url',
            'author', 'tags', 'priority'
          ],
          query: query,
          limit: 50
        }
      );

      return searchResponse.results.map(result => this.mapToHubSpotContent(result));
    } catch (error) {
      console.error('Error searching HubSpot content:', error);
      return [];
    }
  }
}

export const realHubSpotService = new RealHubSpotService();
```

### Step 5.3: Update mockHubSpotService.ts

```typescript
import { realHubSpotService } from './realHubSpotService';
import type { HubSpotContent } from '../types/pageBuilder';

// ... keep existing mock content ...

// Conditionally export real or mock service
const useRealHubSpot = import.meta.env.VITE_USE_REAL_HUBSPOT === 'true';

export const hubspotService = useRealHubSpot 
  ? realHubSpotService 
  : new MockHubSpotService();
```

---

## 6. Testing & Validation

### Step 6.1: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your HubSpot credentials:
   ```env
   VITE_USE_REAL_HUBSPOT=true
   VITE_HUBSPOT_API_KEY=pat-na1-your-actual-token-here
   VITE_HUBSPOT_PORTAL_ID=your-portal-id-here
   VITE_HUBSPOT_CUSTOM_OBJECT_TYPE=your-custom-object-id-here
   ```

### Step 6.2: Test API Connection

Run the comprehensive test script:
```bash
node testHubSpot.js
```

This script will:
- ✅ Check environment variables are configured
- ✅ Test HubSpot API connectivity 
- ✅ List available content in your HubSpot account
- ✅ Verify specific widget IDs needed by the dashboard
- ✅ Test content filtering and search functionality
- 📋 Provide troubleshooting guidance for any issues

### Step 6.3: Verify in Dashboard

1. Start your development server: `npm run dev`
2. Navigate to the dashboard
3. Check browser console for any errors
4. Verify widgets load with HubSpot content

### Step 6.4: Check Network Tab

1. Open Chrome DevTools → Network tab
2. Filter by "hubapi.com"
3. Verify API calls are being made
4. Check response data matches your HubSpot content

### Step 6.5: Toggle Between Mock and Real Data

You can easily switch between mock and real HubSpot data:

**Use Mock Data (default):**
```env
VITE_USE_REAL_HUBSPOT=false
```

**Use Real HubSpot API:**
```env
VITE_USE_REAL_HUBSPOT=true
VITE_HUBSPOT_API_KEY=pat-na1-your-token-here
```

Restart your development server after changing environment variables.

---

## 7. Demo Preparation

### Step 7.1: Live Update Demo

1. **Before Demo**: Have HubSpot open in one tab, dashboard in another
2. **During Demo**: 
   - Show current dashboard content
   - Edit content in HubSpot (e.g., change banner title)
   - Save in HubSpot
   - Refresh dashboard to show updated content
   - Emphasize: "Marketing team can update without developer help"

### Step 7.2: Content Scheduling Demo

1. Set up content with future start dates
2. Show how content automatically appears when scheduled
3. Demonstrate end dates for time-limited promotions

### Step 7.3: A/B Testing Scenario

1. Create two versions of banner content
2. Use priority field to control which shows
3. Explain how marketing can test different messages

### Step 7.4: Key Talking Points

- **No Developer Required**: Marketing teams have full control
- **Real-time Updates**: Changes appear immediately after cache refresh
- **Content Governance**: Approval workflows in HubSpot
- **Analytics Integration**: Track engagement through HubSpot
- **Scalability**: Easy to add new widget types
- **Personalization Ready**: Can target content by user segments

---

## Troubleshooting

### Common Issues & Solutions

**Issue**: 401 Unauthorized Error
- **Solution**: Check API key is correct and has proper scopes

**Issue**: Content not appearing
- **Solution**: Verify "is_active" is set to true in HubSpot

**Issue**: CORS errors
- **Solution**: API calls must be made from backend (not directly from browser)

**Issue**: Rate limiting
- **Solution**: HubSpot allows 100 requests/10 seconds. Implement caching.

---

## Security Best Practices

1. **Never expose API key in frontend code**
   - Use backend proxy for API calls
   - Or use serverless functions

2. **Implement caching**
   - Cache responses for 5-10 minutes
   - Reduces API calls and improves performance

3. **Validate content**
   - Sanitize HTML content before rendering
   - Validate URLs for CTAs

4. **Use environment variables**
   - Never commit API keys to git
   - Use `.env.example` with dummy values

---

## Next Steps

1. **Set up webhook notifications** for instant updates
2. **Implement content preview** in dashboard edit mode
3. **Add analytics tracking** for widget interactions
4. **Create content templates** in HubSpot for consistency
5. **Set up staging environment** for content testing

---

## Support Resources

- [HubSpot API Documentation](https://developers.hubspot.com/docs/api/overview)
- [Custom Objects Guide](https://knowledge.hubspot.com/crm-setup/create-custom-objects)
- [Private Apps Documentation](https://developers.hubspot.com/docs/api/private-apps)
- [API Rate Limits](https://developers.hubspot.com/docs/api/usage-details)

---

## Demo Script Example

```
"Let me show you how our marketing team can update dashboard content without any developer involvement.

[Open HubSpot]
Here in HubSpot, we have our dashboard widget content. Let's say we want to update our welcome banner for a special promotion.

[Edit banner content]
I'll change the title to 'Limited Time: 20% Off Premium Job Postings' and update the CTA to 'Get Discount'.

[Save and switch to dashboard]
Now, when I refresh our dashboard... [refresh] ...you can see the new promotion is live immediately.

This means our marketing team can:
- Run seasonal campaigns
- Test different messages
- Schedule content in advance
- Track engagement

All without submitting a ticket to IT or waiting for a developer."
```