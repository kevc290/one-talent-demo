import type { HubSpotContent } from '../types/pageBuilder';
import { realHubSpotService } from './realHubSpotService';
import { vercelHubSpotService } from './vercelHubSpotService';
import { localContentService } from './localContentService';

const mockHubSpotContent: HubSpotContent[] = [
  {
    id: 'hs-banner-1',
    title: 'Welcome to Your Career Journey',
    type: 'banner',
    content: 'Discover exciting opportunities and take the next step in your career with Kelly Services.',
    htmlContent: '<div class="text-center"><h2 class="text-2xl font-bold text-white mb-2">Welcome to Your Career Journey</h2><p class="text-lg text-blue-100">Discover exciting opportunities and take the next step in your career with Kelly Services.</p></div>',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop',
    ctaText: 'Explore Opportunities',
    ctaUrl: '/jobs',
    publishedDate: '2024-01-15T10:00:00Z',
    tags: ['career', 'welcome', 'banner']
  },
  {
    id: 'hs-promo-1',
    title: 'New Year, New Career',
    type: 'card',
    content: 'Make 2024 your year of professional growth. Browse our latest job openings and find your perfect match.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    ctaText: 'Browse Jobs',
    ctaUrl: '/jobs',
    publishedDate: '2024-01-01T00:00:00Z',
    tags: ['promotion', 'jobs', '2024']
  },
  {
    id: 'hs-tips-1',
    title: 'Interview Success Tips',
    type: 'blog_post',
    content: 'Master your next interview with these proven strategies from Kelly Services career experts.',
    htmlContent: '<article><h3 class="font-bold mb-2">Interview Success Tips</h3><p>Master your next interview with these proven strategies from Kelly Services career experts.</p><ul class="list-disc ml-4 mt-2"><li>Research the company thoroughly</li><li>Practice common interview questions</li><li>Prepare thoughtful questions to ask</li><li>Dress professionally and arrive early</li></ul></article>',
    author: 'Kelly Career Team',
    publishedDate: '2024-01-10T14:30:00Z',
    tags: ['interview', 'tips', 'career-advice']
  },
  {
    id: 'hs-testimonial-1',
    title: 'Success Story',
    type: 'card',
    content: '"Kelly Services helped me find my dream job in just 3 weeks. The support was incredible!" - Sarah M.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=300&fit=crop',
    publishedDate: '2024-01-08T09:15:00Z',
    tags: ['testimonial', 'success-story']
  },
  {
    id: 'hs-cta-1',
    title: 'Ready to Get Started?',
    type: 'cta',
    content: 'Join thousands of professionals who have found their perfect job through Kelly Services.',
    ctaText: 'Start Your Search',
    ctaUrl: '/jobs',
    publishedDate: '2024-01-05T16:45:00Z',
    tags: ['cta', 'call-to-action']
  },
  {
    id: 'hs-industry-update-1',
    title: 'Tech Industry Trends 2024',
    type: 'blog_post',
    content: 'Stay ahead of the curve with the latest trends shaping the technology sector this year.',
    htmlContent: '<article><h3 class="font-bold mb-2">Tech Industry Trends 2024</h3><p>Stay ahead of the curve with the latest trends shaping the technology sector this year.</p><div class="mt-3"><h4 class="font-semibold">Key Trends:</h4><ul class="list-disc ml-4"><li>AI and Machine Learning expansion</li><li>Remote work normalization</li><li>Cybersecurity focus</li><li>Green technology growth</li></ul></div></article>',
    author: 'Tech Industry Analysts',
    publishedDate: '2024-01-12T11:20:00Z',
    tags: ['technology', 'trends', 'industry-update']
  }
];

class MockHubSpotService {
  private content: HubSpotContent[] = mockHubSpotContent;

  async getContent(filters?: { type?: string; tags?: string[] }): Promise<HubSpotContent[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredContent = this.content;
    
    if (filters?.type) {
      filteredContent = filteredContent.filter(item => item.type === filters.type);
    }
    
    if (filters?.tags?.length) {
      filteredContent = filteredContent.filter(item => 
        item.tags?.some(tag => filters.tags!.includes(tag))
      );
    }
    
    return filteredContent.sort((a, b) => 
      new Date(b.publishedDate || '').getTime() - new Date(a.publishedDate || '').getTime()
    );
  }

  async getContentById(id: string): Promise<HubSpotContent | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return this.content.find(item => item.id === id) || null;
  }

  async searchContent(query: string): Promise<HubSpotContent[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const searchTerm = query.toLowerCase();
    return this.content.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.content.toLowerCase().includes(searchTerm) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Method to simulate adding new content (for future expansion)
  async createContent(content: Omit<HubSpotContent, 'id' | 'publishedDate'>): Promise<HubSpotContent> {
    const newContent: HubSpotContent = {
      ...content,
      id: `hs-custom-${Date.now()}`,
      publishedDate: new Date().toISOString()
    };
    
    this.content.unshift(newContent);
    return newContent;
  }

  // Get content types for filter options
  getContentTypes(): string[] {
    return Array.from(new Set(this.content.map(item => item.type)));
  }

  // Get all available tags
  getAllTags(): string[] {
    const allTags = this.content.flatMap(item => item.tags || []);
    return Array.from(new Set(allTags)).sort();
  }
}

// Service selection based on environment configuration
function createHubSpotService() {
  const serviceType = import.meta.env.VITE_HUBSPOT_SERVICE_TYPE || 'local';
  const hasApiKey = !!import.meta.env.VITE_HUBSPOT_API_KEY;

  switch (serviceType.toLowerCase()) {
    case 'vercel':
      // Use Vercel serverless functions (recommended for production)
      console.log('🔗 Using Vercel HubSpot Service (serverless functions)');
      return vercelHubSpotService;
      
    case 'direct':
      // Direct API calls (only works in Node.js or with CORS proxy)
      if (!hasApiKey) {
        console.warn('⚠️  Direct HubSpot service requested but no API key found - falling back to local');
        return localContentService;
      }
      console.log('🔗 Using Direct HubSpot Service (API calls)');
      return realHubSpotService;
      
    case 'mock':
      // Legacy mock data (for compatibility)
      console.log('📝 Using Mock HubSpot Service (demo data)');
      return new MockHubSpotService();
      
    case 'local':
    default:
      // Local content management (PoC version)
      return localContentService;
  }
}

export const hubspotService = createHubSpotService();