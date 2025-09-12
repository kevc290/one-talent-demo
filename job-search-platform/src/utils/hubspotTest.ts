/**
 * Simple utility to test which HubSpot service is being used
 * This helps verify the environment-based service switching
 */

import { hubspotService } from '../services/mockHubSpotService';

export async function testHubSpotService() {
  console.log('🔍 Testing HubSpot Service Configuration...');
  
  const useReal = import.meta.env.VITE_USE_REAL_HUBSPOT === 'true';
  const hasApiKey = !!import.meta.env.VITE_HUBSPOT_API_KEY;
  
  console.log(`Environment: VITE_USE_REAL_HUBSPOT = ${import.meta.env.VITE_USE_REAL_HUBSPOT}`);
  console.log(`API Key configured: ${hasApiKey}`);
  
  if (useReal && hasApiKey) {
    console.log('✅ Using Real HubSpot API Service');
  } else {
    console.log('📝 Using Mock HubSpot Service');
    if (useReal && !hasApiKey) {
      console.log('⚠️  Real HubSpot requested but no API key found - falling back to mock');
    }
  }
  
  // Test basic functionality
  try {
    const banner = await hubspotService.getContentById('hs-banner-1');
    console.log(`Service test: ${banner ? 'SUCCESS' : 'FAILED'} - Retrieved banner content`);
    
    if (banner) {
      console.log(`Banner title: "${banner.title}"`);
      console.log(`Content source: ${useReal && hasApiKey ? 'HubSpot API' : 'Mock Data'}`);
    }
  } catch (error) {
    console.error('Service test FAILED:', error);
  }
}