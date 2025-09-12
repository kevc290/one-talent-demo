#!/usr/bin/env node

/**
 * HubSpot Integration Test Script
 * 
 * This script tests the HubSpot API connection and validates
 * that your custom objects and content are set up correctly.
 * 
 * Usage:
 *   1. Make sure your .env file has the HubSpot configuration
 *   2. Run: node testHubSpot.js
 */

import { config } from 'dotenv';
import { realHubSpotService } from './src/services/realHubSpotService.js';

// Load environment variables
config();

const TEST_WIDGET_IDS = [
  'hs-banner-1',
  'hs-promo-1', 
  'hs-tips-1',
  'hs-testimonial-1',
  'hs-cta-1'
];

async function testHubSpotConnection() {
  console.log('🚀 Testing HubSpot Integration...\n');
  
  // Check environment variables
  const requiredEnvVars = [
    'VITE_HUBSPOT_API_KEY',
    'VITE_HUBSPOT_API_BASE_URL',
    'VITE_USE_REAL_HUBSPOT'
  ];
  
  console.log('📋 Environment Variables Check:');
  let envVarsValid = true;
  
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    const status = value ? '✅' : '❌';
    console.log(`  ${status} ${envVar}: ${value ? (envVar.includes('API_KEY') ? value.substring(0, 10) + '...' : value) : 'NOT SET'}`);
    if (!value) envVarsValid = false;
  }
  
  if (!envVarsValid) {
    console.log('\n❌ Missing required environment variables. Please check your .env file.\n');
    return;
  }
  
  if (process.env.VITE_USE_REAL_HUBSPOT !== 'true') {
    console.log('\n⚠️  VITE_USE_REAL_HUBSPOT is not set to "true". The service will use mock data.\n');
    console.log('To test real HubSpot API, set VITE_USE_REAL_HUBSPOT=true in your .env file.\n');
    return;
  }
  
  console.log('\n🔗 Testing HubSpot API Connection...\n');
  
  try {
    // Test basic connection
    console.log('1. Testing basic API connection...');
    const isConnected = await realHubSpotService.testConnection();
    
    if (!isConnected) {
      console.log('❌ Failed to connect to HubSpot API');
      console.log('   Check your API key and network connection');
      return;
    }
    
    console.log('✅ Successfully connected to HubSpot API\n');
    
    // Test fetching all content
    console.log('2. Testing content retrieval...');
    const allContent = await realHubSpotService.getContent();
    console.log(`✅ Retrieved ${allContent.length} content items from HubSpot\n`);
    
    if (allContent.length === 0) {
      console.log('⚠️  No content found. Make sure you have created widget content in your HubSpot custom object.');
      console.log('   Refer to the HUBSPOT_INTEGRATION_GUIDE.md for setup instructions.\n');
      return;
    }
    
    // Show available content
    console.log('📄 Available Content:');
    allContent.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.title} (ID: ${item.id}, Type: ${item.type})`);
    });
    console.log('');
    
    // Test specific widget IDs that the dashboard expects
    console.log('3. Testing specific dashboard widget IDs...');
    
    for (const widgetId of TEST_WIDGET_IDS) {
      try {
        const content = await realHubSpotService.getContentById(widgetId);
        const status = content ? '✅' : '⚠️ ';
        const message = content ? `Found: "${content.title}"` : 'Not found - create this in HubSpot';
        console.log(`  ${status} ${widgetId}: ${message}`);
      } catch (error) {
        console.log(`  ❌ ${widgetId}: Error - ${error.message}`);
      }
    }
    
    console.log('\n4. Testing content filtering...');
    
    // Test filtering by type
    const banners = await realHubSpotService.getContent({ type: 'banner' });
    console.log(`✅ Found ${banners.length} banner(s)`);
    
    const cards = await realHubSpotService.getContent({ type: 'card' });
    console.log(`✅ Found ${cards.length} card(s)`);
    
    // Test search functionality
    console.log('\n5. Testing search functionality...');
    const searchResults = await realHubSpotService.searchContent('career');
    console.log(`✅ Search for "career" returned ${searchResults.length} result(s)`);
    
    console.log('\n🎉 HubSpot integration test completed successfully!');
    console.log('\n📌 Next Steps:');
    console.log('1. If any widget IDs show "Not found", create them in HubSpot');
    console.log('2. Start your development server: npm run dev');
    console.log('3. Check the dashboard to see HubSpot content loading');
    console.log('4. Edit content in HubSpot and refresh the dashboard to see changes');
    
  } catch (error) {
    console.log(`❌ Test failed with error: ${error.message}`);
    console.log('\n🔍 Common Issues:');
    console.log('- Invalid API key (should start with "pat-na1-")');
    console.log('- Incorrect custom object type ID');
    console.log('- Missing required API scopes in HubSpot Private App');
    console.log('- Network connectivity issues');
    console.log('\nRefer to HUBSPOT_INTEGRATION_GUIDE.md for troubleshooting steps.');
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Test interrupted by user');
  process.exit(0);
});

// Run the test
testHubSpotConnection().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});