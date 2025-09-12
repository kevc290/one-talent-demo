/**
 * Vercel Serverless Function for HubSpot API Proxy
 * 
 * This function securely proxies requests to HubSpot API
 * without exposing API keys to the frontend.
 */

export default async function handler(req, res) {
  // Enable CORS for your frontend domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET and POST methods
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get environment variables
  const {
    VITE_HUBSPOT_API_KEY,
    VITE_HUBSPOT_API_BASE_URL = 'https://api.hubapi.com',
    VITE_HUBSPOT_CUSTOM_OBJECT_TYPE = '2-25634894'
  } = process.env;

  if (!VITE_HUBSPOT_API_KEY) {
    return res.status(500).json({ 
      error: 'HubSpot API key not configured',
      details: 'Set VITE_HUBSPOT_API_KEY environment variable in Vercel'
    });
  }

  try {
    const { action, widgetId, filters, query } = req.method === 'GET' ? req.query : req.body;

    let hubspotUrl;
    let requestOptions = {
      headers: {
        'Authorization': `Bearer ${VITE_HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    switch (action) {
      case 'getContentById':
        if (!widgetId) {
          return res.status(400).json({ error: 'widgetId is required' });
        }
        
        hubspotUrl = `${VITE_HUBSPOT_API_BASE_URL}/crm/v3/objects/${VITE_HUBSPOT_CUSTOM_OBJECT_TYPE}/search`;
        requestOptions.method = 'POST';
        requestOptions.body = JSON.stringify({
          filterGroups: [{
            filters: [
              { propertyName: 'widget_id', operator: 'EQ', value: widgetId },
              { propertyName: 'is_active', operator: 'EQ', value: 'true' }
            ]
          }],
          properties: [
            'widget_id', 'widget_type', 'title', 'content', 
            'html_content', 'cta_text', 'cta_url', 'image_url',
            'author', 'tags', 'priority', 'createdate'
          ],
          limit: 1
        });
        break;

      case 'getContent':
        const filterList = [{ propertyName: 'is_active', operator: 'EQ', value: 'true' }];
        
        if (filters?.type) {
          filterList.push({ propertyName: 'widget_type', operator: 'EQ', value: filters.type });
        }

        hubspotUrl = `${VITE_HUBSPOT_API_BASE_URL}/crm/v3/objects/${VITE_HUBSPOT_CUSTOM_OBJECT_TYPE}/search`;
        requestOptions.method = 'POST';
        requestOptions.body = JSON.stringify({
          filterGroups: [{ filters: filterList }],
          properties: [
            'widget_id', 'widget_type', 'title', 'content',
            'html_content', 'cta_text', 'cta_url', 'image_url',
            'author', 'tags', 'priority', 'createdate'
          ],
          sorts: [{ propertyName: 'priority', direction: 'DESCENDING' }],
          limit: 100
        });
        break;

      case 'searchContent':
        if (!query) {
          return res.status(400).json({ error: 'query is required for search' });
        }
        
        hubspotUrl = `${VITE_HUBSPOT_API_BASE_URL}/crm/v3/objects/${VITE_HUBSPOT_CUSTOM_OBJECT_TYPE}/search`;
        requestOptions.method = 'POST';
        requestOptions.body = JSON.stringify({
          filterGroups: [{
            filters: [{ propertyName: 'is_active', operator: 'EQ', value: 'true' }]
          }],
          properties: [
            'widget_id', 'widget_type', 'title', 'content',
            'html_content', 'cta_text', 'cta_url', 'image_url',
            'author', 'tags', 'priority', 'createdate'
          ],
          query: query,
          limit: 50
        });
        break;

      case 'testConnection':
        hubspotUrl = `${VITE_HUBSPOT_API_BASE_URL}/crm/v3/objects/contacts?limit=1`;
        requestOptions.method = 'GET';
        break;

      default:
        return res.status(400).json({ error: 'Invalid action specified' });
    }

    // Make request to HubSpot API
    const hubspotResponse = await fetch(hubspotUrl, requestOptions);
    
    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error('HubSpot API Error:', hubspotResponse.status, errorText);
      
      return res.status(hubspotResponse.status).json({
        error: `HubSpot API Error: ${hubspotResponse.status}`,
        details: errorText
      });
    }

    const data = await hubspotResponse.json();

    // Transform response based on action
    switch (action) {
      case 'getContentById':
        if (data.results && data.results.length > 0) {
          res.json({ result: mapHubSpotObject(data.results[0]) });
        } else {
          res.json({ result: null });
        }
        break;
        
      case 'getContent':
        if (data.results) {
          let results = data.results.map(mapHubSpotObject);
          
          // Filter by tags if provided
          if (filters?.tags && filters.tags.length > 0) {
            results = results.filter(content => 
              content.tags?.some(tag => filters.tags.includes(tag))
            );
          }
          
          res.json({ results });
        } else {
          res.json({ results: [] });
        }
        break;
        
      case 'searchContent':
        if (data.results) {
          res.json({ results: data.results.map(mapHubSpotObject) });
        } else {
          res.json({ results: [] });
        }
        break;
        
      case 'testConnection':
        res.json({ success: true, message: 'HubSpot connection successful' });
        break;
        
      default:
        res.json(data);
    }

  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}

// Helper function to map HubSpot object to our content format
function mapHubSpotObject(hubspotObject) {
  const props = hubspotObject.properties || {};
  
  return {
    id: props.widget_id || hubspotObject.id,
    type: props.widget_type || 'card',
    title: props.title || '',
    content: props.content || '',
    htmlContent: props.html_content || undefined,
    imageUrl: props.image_url || undefined,
    ctaText: props.cta_text || undefined,
    ctaUrl: props.cta_url || undefined,
    author: props.author || undefined,
    publishedDate: props.createdate || undefined,
    tags: props.tags ? props.tags.split(',').map(t => t.trim()) : []
  };
}