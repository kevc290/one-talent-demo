import type { HubSpotContent } from '../types/pageBuilder';

/**
 * Vercel-optimized HubSpot Service
 * 
 * This service uses Vercel serverless functions to securely 
 * access HubSpot API without exposing API keys to the frontend.
 */

class VercelHubSpotService {
  private baseUrl: string;

  constructor() {
    // Use current domain for API calls in production, localhost for dev
    this.baseUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/api/hubspot`
      : '/api/hubspot';
  }

  private async makeRequest(action: string, params: Record<string, any> = {}): Promise<any> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...params })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.error || response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`HubSpot API request failed (${action}):`, error);
      throw error;
    }
  }

  async getContentById(widgetId: string): Promise<HubSpotContent | null> {
    try {
      const response = await this.makeRequest('getContentById', { widgetId });
      return response.result;
    } catch (error) {
      console.error('Error fetching HubSpot content by ID:', error);
      return null;
    }
  }

  async getContent(filters?: { type?: string; tags?: string[] }): Promise<HubSpotContent[]> {
    try {
      const response = await this.makeRequest('getContent', { filters });
      return response.results || [];
    } catch (error) {
      console.error('Error fetching HubSpot content:', error);
      return [];
    }
  }

  async searchContent(query: string): Promise<HubSpotContent[]> {
    try {
      const response = await this.makeRequest('searchContent', { query });
      return response.results || [];
    } catch (error) {
      console.error('Error searching HubSpot content:', error);
      return [];
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('testConnection');
      return response.success === true;
    } catch (error) {
      console.error('HubSpot connection test failed:', error);
      return false;
    }
  }
}

export const vercelHubSpotService = new VercelHubSpotService();