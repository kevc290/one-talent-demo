import type { HubSpotContent } from '../types/pageBuilder';
import widgetContentData from '../data/widgetContent.json';

/**
 * Local Content Management Service
 * 
 * This service manages content locally for PoC purposes.
 * In production, this would be replaced with your CMS integration
 * (HubSpot, Contentful, Strapi, etc.)
 */

interface ContentData {
  widgets: Array<{
    id: string;
    type: string;
    title: string;
    content: string;
    htmlContent?: string;
    imageUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
    author?: string;
    isActive: boolean;
    priority: number;
    publishedDate: string;
    tags: string[];
    lastUpdated: string;
    updatedBy: string;
  }>;
  metadata: {
    version: string;
    lastUpdated: string;
    description: string;
    note: string;
  };
}

class LocalContentService {
  private contentData: ContentData;
  
  constructor() {
    this.contentData = widgetContentData as ContentData;
    console.log('📁 Using Local Content Service (PoC version)');
    console.log(`📊 Loaded ${this.contentData.widgets.length} widget(s) from local data`);
  }

  async getContent(filters?: { type?: string; tags?: string[] }): Promise<HubSpotContent[]> {
    // Simulate API delay for realistic demo
    await new Promise(resolve => setTimeout(resolve, 150));
    
    let widgets = this.contentData.widgets.filter(widget => widget.isActive);
    
    // Filter by type
    if (filters?.type) {
      widgets = widgets.filter(widget => widget.type === filters.type);
    }
    
    // Filter by tags
    if (filters?.tags?.length) {
      widgets = widgets.filter(widget => 
        widget.tags.some(tag => filters.tags!.includes(tag))
      );
    }
    
    // Sort by priority (highest first)
    widgets.sort((a, b) => b.priority - a.priority);
    
    return widgets.map(widget => this.mapToHubSpotContent(widget));
  }

  async getContentById(id: string): Promise<HubSpotContent | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const widget = this.contentData.widgets.find(w => 
      w.id === id && w.isActive
    );
    
    if (!widget) {
      console.warn(`⚠️ Widget not found: ${id}`);
      return null;
    }
    
    return this.mapToHubSpotContent(widget);
  }

  async searchContent(query: string): Promise<HubSpotContent[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const searchTerm = query.toLowerCase();
    const widgets = this.contentData.widgets.filter(widget => 
      widget.isActive && (
        widget.title.toLowerCase().includes(searchTerm) ||
        widget.content.toLowerCase().includes(searchTerm) ||
        widget.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        widget.author?.toLowerCase().includes(searchTerm)
      )
    );
    
    // Sort by priority
    widgets.sort((a, b) => b.priority - a.priority);
    
    return widgets.map(widget => this.mapToHubSpotContent(widget));
  }

  private mapToHubSpotContent(widget: any): HubSpotContent {
    return {
      id: widget.id,
      type: widget.type as HubSpotContent['type'],
      title: widget.title,
      content: widget.content,
      htmlContent: widget.htmlContent,
      imageUrl: widget.imageUrl,
      ctaText: widget.ctaText,
      ctaUrl: widget.ctaUrl,
      author: widget.author,
      publishedDate: widget.publishedDate,
      tags: widget.tags
    };
  }

  // Content management methods (for future admin interface)
  
  async updateContent(id: string, updates: Partial<HubSpotContent>): Promise<boolean> {
    console.log(`📝 Content update requested for ${id}:`, updates);
    console.log('ℹ️  In production, this would update your CMS');
    
    // In a real implementation, this would:
    // 1. Update the content in your CMS/database
    // 2. Trigger cache invalidation
    // 3. Send webhooks/notifications
    
    return true;
  }

  async createContent(content: Omit<HubSpotContent, 'id' | 'publishedDate'>): Promise<HubSpotContent> {
    console.log('✨ Content creation requested:', content);
    
    const newId = `local-${Date.now()}`;
    const now = new Date().toISOString();
    
    // Create the new content object
    const newContent: HubSpotContent = {
      ...content,
      id: newId,
      publishedDate: now
    };
    
    // Add to the in-memory data
    const newWidget = {
      id: newId,
      type: content.type,
      title: content.title,
      content: content.content,
      htmlContent: content.htmlContent,
      imageUrl: content.imageUrl,
      ctaText: content.ctaText,
      ctaUrl: content.ctaUrl,
      author: content.author || 'Content Admin',
      isActive: true,
      priority: 5, // Default priority for new content
      publishedDate: now,
      tags: content.tags || [],
      lastUpdated: now,
      updatedBy: content.author || 'Content Admin'
    };
    
    this.contentData.widgets.push(newWidget);
    this.contentData.metadata.lastUpdated = now;
    
    console.log(`✅ Content "${content.title}" created with ID: ${newId}`);
    console.log('ℹ️  In production, this would create content in your CMS');
    
    return newContent;
  }

  async deleteContent(id: string): Promise<boolean> {
    console.log(`🗑️ Content deletion requested for ${id}`);
    console.log('ℹ️  In production, this would delete from your CMS');
    return true;
  }

  // Metadata and statistics
  
  getContentStats() {
    const widgets = this.contentData.widgets;
    const activeWidgets = widgets.filter(w => w.isActive);
    
    return {
      total: widgets.length,
      active: activeWidgets.length,
      inactive: widgets.length - activeWidgets.length,
      types: Array.from(new Set(activeWidgets.map(w => w.type))),
      lastUpdated: this.contentData.metadata.lastUpdated,
      version: this.contentData.metadata.version
    };
  }

  getAvailableTypes(): string[] {
    return Array.from(new Set(
      this.contentData.widgets
        .filter(w => w.isActive)
        .map(w => w.type)
    ));
  }

  getAvailableTags(): string[] {
    const allTags = this.contentData.widgets
      .filter(w => w.isActive)
      .flatMap(w => w.tags);
    
    return Array.from(new Set(allTags)).sort();
  }
}

export const localContentService = new LocalContentService();