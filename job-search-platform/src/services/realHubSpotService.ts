import type { HubSpotContent } from '../types/pageBuilder';

// Note: For production, you should make these API calls from your backend
// to avoid exposing your API key. This is a simplified version for POC.

interface HubSpotAPIResponse {
  results: any[];
  paging?: {
    next?: {
      after: string;
      link: string;
    };
  };
}

class RealHubSpotService {
  private apiKey: string;
  private baseUrl: string;
  private customObjectType: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_HUBSPOT_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_HUBSPOT_API_BASE_URL || 'https://api.hubapi.com';
    this.customObjectType = import.meta.env.VITE_HUBSPOT_CUSTOM_OBJECT_TYPE || '2-25634894';
    
    if (!this.apiKey && import.meta.env.VITE_USE_REAL_HUBSPOT === 'true') {
      console.warn('HubSpot API key not configured. Using mock service fallback.');
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      console.error('HubSpot API error:', response.status, response.statusText);
      throw new Error(`HubSpot API error: ${response.status}`);
    }

    return response.json();
  }

  async getContentById(widgetId: string): Promise<HubSpotContent | null> {
    try {
      // Search for content by widget_id property
      const searchPayload = {
        filterGroups: [{
          filters: [
            {
              propertyName: 'widget_id',
              operator: 'EQ',
              value: widgetId
            },
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
          'author', 'tags', 'priority', 'createdate'
        ],
        limit: 1
      };

      const response = await this.makeRequest(
        `/crm/v3/objects/${this.customObjectType}/search`,
        {
          method: 'POST',
          body: JSON.stringify(searchPayload)
        }
      );

      if (response.results && response.results.length > 0) {
        return this.mapToHubSpotContent(response.results[0]);
      }

      return null;
    } catch (error) {
      console.error('Error fetching HubSpot content by ID:', error);
      return null;
    }
  }

  async getContent(filters?: { type?: string; tags?: string[] }): Promise<HubSpotContent[]> {
    try {
      const filterList: any[] = [
        {
          propertyName: 'is_active',
          operator: 'EQ',
          value: 'true'
        }
      ];

      if (filters?.type) {
        filterList.push({
          propertyName: 'widget_type',
          operator: 'EQ',
          value: filters.type
        });
      }

      const searchPayload = {
        filterGroups: [{
          filters: filterList
        }],
        properties: [
          'widget_id', 'widget_type', 'title', 'content',
          'html_content', 'cta_text', 'cta_url', 'image_url',
          'author', 'tags', 'priority', 'createdate'
        ],
        sorts: [{
          propertyName: 'priority',
          direction: 'DESCENDING'
        }],
        limit: 100
      };

      const response = await this.makeRequest(
        `/crm/v3/objects/${this.customObjectType}/search`,
        {
          method: 'POST',
          body: JSON.stringify(searchPayload)
        }
      );

      if (response.results) {
        let results = response.results.map((result: any) => this.mapToHubSpotContent(result));
        
        // Filter by tags if provided
        if (filters?.tags && filters.tags.length > 0) {
          results = results.filter(content => 
            content.tags?.some(tag => filters.tags!.includes(tag))
          );
        }

        return results;
      }

      return [];
    } catch (error) {
      console.error('Error fetching HubSpot content:', error);
      return [];
    }
  }

  private mapToHubSpotContent(hubspotObject: any): HubSpotContent {
    const props = hubspotObject.properties || {};
    
    return {
      id: props.widget_id || hubspotObject.id,
      type: (props.widget_type || 'card') as HubSpotContent['type'],
      title: props.title || '',
      content: props.content || '',
      htmlContent: props.html_content || undefined,
      imageUrl: props.image_url || undefined,
      ctaText: props.cta_text || undefined,
      ctaUrl: props.cta_url || undefined,
      author: props.author || undefined,
      publishedDate: props.createdate || undefined,
      tags: props.tags ? props.tags.split(',').map((t: string) => t.trim()) : []
    };
  }

  async searchContent(query: string): Promise<HubSpotContent[]> {
    try {
      // For search, we'll get all active content and filter client-side
      // HubSpot's search API has limitations for custom objects
      const allContent = await this.getContent();
      
      const lowercaseQuery = query.toLowerCase();
      return allContent.filter(content => 
        content.title.toLowerCase().includes(lowercaseQuery) ||
        content.content?.toLowerCase().includes(lowercaseQuery) ||
        content.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Error searching HubSpot content:', error);
      return [];
    }
  }

  // Alternative method using HubDB (if you prefer using HubDB tables instead of custom objects)
  async getContentFromHubDB(tableId: string, widgetId?: string): Promise<HubSpotContent[]> {
    try {
      let endpoint = `/cms/v3/hubdb/tables/${tableId}/rows`;
      
      if (widgetId) {
        endpoint += `?widget_id=${widgetId}`;
      }

      const response = await this.makeRequest(endpoint);

      if (response.results) {
        return response.results.map((row: any) => ({
          id: row.values.widget_id || row.id,
          type: row.values.widget_type || 'card',
          title: row.values.title || '',
          content: row.values.content || '',
          htmlContent: row.values.html_content,
          imageUrl: row.values.image_url,
          ctaText: row.values.cta_text,
          ctaUrl: row.values.cta_url,
          author: row.values.author,
          publishedDate: row.values.publish_date,
          tags: row.values.tags ? row.values.tags.split(',').map((t: string) => t.trim()) : []
        }));
      }

      return [];
    } catch (error) {
      console.error('Error fetching content from HubDB:', error);
      return [];
    }
  }

  // Method to test connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/crm/v3/objects/contacts?limit=1');
      console.log('HubSpot connection successful');
      return true;
    } catch (error) {
      console.error('HubSpot connection failed:', error);
      return false;
    }
  }
}

export const realHubSpotService = new RealHubSpotService();