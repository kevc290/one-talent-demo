import type { PageLayout } from '../types/pageBuilder';

class LayoutService {
  private storageKey = 'dashboard-layouts';
  private deletedLayoutsKey = 'deleted-dashboard-layouts';

  // Create layout that matches the original dashboard design
  private createCompatibleLayout(): PageLayout {
    // First check if user has saved a custom default template
    try {
      const savedTemplate = localStorage.getItem('default-layout-template');
      if (savedTemplate) {
        const template = JSON.parse(savedTemplate);
        console.log('Using saved layout template');
        return {
          ...template,
          lastUpdated: new Date().toISOString()
        };
      }
    } catch (error) {
      console.warn('Failed to load saved template, using hardcoded default');
    }
    
    // Fallback to hardcoded default
    return {
      id: 'default-dashboard',
      name: 'Default Dashboard',
      lastUpdated: new Date().toISOString(),
      widgets: [
        {
              "id": "stats-saved-jobs",
              "type": "stat-card",
              "title": "Saved Jobs Stats",
              "x": 0,
              "y": 0,
              "w": 15,
              "h": 4,
              "config": {
                    "title": "Saved Jobs",
                    "value": "12",
                    "icon": "heart",
                    "color": "blue"
              }
        },
        {
              "id": "stats-applications",
              "type": "stat-card",
              "title": "Applications Stats",
              "x": 16,
              "y": 0,
              "w": 15,
              "h": 4,
              "config": {
                    "title": "Applications",
                    "value": "8",
                    "icon": "file",
                    "color": "green"
              }
        },
        {
              "id": "stats-profile-views",
              "type": "stat-card",
              "title": "Profile Views Stats",
              "x": 32,
              "y": 0,
              "w": 16,
              "h": 4,
              "config": {
                    "title": "Profile Views",
                    "value": "24",
                    "icon": "user",
                    "color": "purple"
              }
        },
        {
              "id": "welcome-banner",
              "type": "hubspot-banner",
              "title": "Banner",
              "x": 0,
              "y": 5,
              "w": 48,
              "h": 6,
              "config": {}
        },
        {
              "id": "recent-applications-widget",
              "type": "recent-applications",
              "title": "Recent Applications",
              "x": 0,
              "y": 12,
              "w": 31,
              "h": 19,
              "config": {}
        },
        {
              "id": "profile-overview-widget",
              "type": "profile-overview",
              "title": "Profile Overview",
              "x": 32,
              "y": 12,
              "w": 16,
              "h": 13,
              "config": {}
        },
        {
              "id": "saved-jobs-widget",
              "type": "saved-jobs",
              "title": "Saved Jobs",
              "x": 0,
              "y": 32,
              "w": 31,
              "h": 19,
              "config": {}
        },
        {
              "id": "quick-links-widget",
              "type": "quick-links",
              "title": "Quick Links",
              "x": 51,
              "y": 4,
              "w": 9,
              "h": 31,
              "config": {
                    "title": "Quick Links"
              }
        },
        {
              "id": "hubspot-promo",
              "type": "hubspot-card",
              "title": "Promotional Content",
              "x": 32,
              "y": 26,
              "w": 16,
              "h": 8,
              "config": {}
        }
  ]
    };
  }

  // Alternative layout - stacked stats on left, banner on right
  private alternativeLayout: PageLayout = {
    id: 'stacked-layout',
    name: 'Stacked Stats Layout',
    lastUpdated: new Date().toISOString(),
    widgets: [
      // Stats Cards - Stacked vertically on the left (columns 0-11)
      {
        id: 'stats-saved-jobs',
        type: 'stat-card',
        title: 'Saved Jobs Stats',
        x: 0,
        y: 0,
        w: 12,
        h: 4,
        config: {
          title: 'Saved Jobs',
          value: '12',
          icon: 'heart',
          color: 'blue'
        }
      },
      {
        id: 'stats-applications',
        type: 'stat-card', 
        title: 'Applications Stats',
        x: 0,
        y: 4,
        w: 12,
        h: 4,
        config: {
          title: 'Applications',
          value: '8',
          icon: 'file',
          color: 'green'
        }
      },
      {
        id: 'stats-profile-views',
        type: 'stat-card',
        title: 'Profile Views Stats',
        x: 0,
        y: 8,
        w: 12,
        h: 4,
        config: {
          title: 'Profile Views',
          value: '24',
          icon: 'user',
          color: 'purple'
        }
      },
      // Content Banner - Taking remaining space on the right (columns 12-47)
      {
        id: 'welcome-banner',
        type: 'hubspot-banner',
        title: 'Banner',
        x: 12,
        y: 0,
        w: 36, // Rest of the width
        h: 12, // Same height as the 3 stacked stat cards
        config: {}
      },
      // Main Content Row - Full width
      {
        id: 'recent-applications-widget',
        type: 'recent-applications',
        title: 'Recent Applications',
        x: 0,
        y: 12,
        w: 32, // 2/3 width
        h: 12,
        config: {}
      },
      {
        id: 'profile-overview-widget',
        type: 'profile-overview',
        title: 'Profile Overview',
        x: 32,
        y: 12,
        w: 16, // 1/3 width
        h: 10,
        config: {}
      },
      // Second Content Row
      {
        id: 'saved-jobs-widget',
        type: 'saved-jobs',
        title: 'Saved Jobs',
        x: 0,
        y: 24,
        w: 32, // 2/3 width
        h: 12,
        config: {}
      },
      {
        id: 'quick-links-widget',
        type: 'quick-links',
        title: 'Quick Links',
        x: 32,
        y: 22,
        w: 16, // 1/3 width
        h: 8,
        config: {
          title: 'Quick Links'
        }
      },
      // Content Cards
      {
        id: 'hubspot-promo',
        type: 'hubspot-card',
        title: 'Promotional Content',
        x: 32,
        y: 30,
        w: 16,
        h: 8,
        config: {}
      }
    ]
  };

  // Use the compatible layout as default
  private get defaultLayout(): PageLayout {
    return this.createCompatibleLayout();
  }

  // Get layouts from localStorage
  private getStoredLayouts(): Record<string, PageLayout> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load stored layouts:', error);
      return {};
    }
  }

  // Save layouts to localStorage
  private saveLayouts(layouts: Record<string, PageLayout>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(layouts));
    } catch (error) {
      console.error('Failed to save layouts:', error);
    }
  }

  // Get deleted layouts from localStorage
  private getDeletedLayouts(): Set<string> {
    try {
      const deleted = localStorage.getItem(this.deletedLayoutsKey);
      return new Set(deleted ? JSON.parse(deleted) : []);
    } catch (error) {
      console.error('Failed to load deleted layouts:', error);
      return new Set();
    }
  }

  // Save deleted layouts to localStorage
  private saveDeletedLayouts(deletedIds: Set<string>): void {
    try {
      localStorage.setItem(this.deletedLayoutsKey, JSON.stringify([...deletedIds]));
    } catch (error) {
      console.error('Failed to save deleted layouts:', error);
    }
  }

  // Get a specific layout by ID
  async getLayout(layoutId: string): Promise<PageLayout | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const layouts = this.getStoredLayouts();
    
    // Check if there's a saved version of this layout first
    if (layouts[layoutId]) {
      return layouts[layoutId];
    }
    
    // Handle special layout IDs only if no saved version exists
    if (layoutId === 'default-dashboard') {
      return this.defaultLayout;
    }
    
    if (layoutId === 'stacked-layout') {
      return this.alternativeLayout;
    }
    
    // Return default if not found
    return this.defaultLayout;
  }

  // Save a layout
  async saveLayout(layout: PageLayout): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const layouts = this.getStoredLayouts();
    layouts[layout.id] = {
      ...layout,
      lastUpdated: new Date().toISOString()
    };
    
    this.saveLayouts(layouts);
  }

  // Get all available layouts
  async getAllLayouts(): Promise<PageLayout[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const layouts = this.getStoredLayouts();
    const deletedIds = this.getDeletedLayouts();
    
    // Start with built-in layouts, but exclude deleted ones
    const builtInLayouts = [];
    if (!deletedIds.has('default-dashboard')) {
      builtInLayouts.push(this.defaultLayout);
    }
    if (!deletedIds.has('stacked-layout')) {
      builtInLayouts.push(this.alternativeLayout);
    }
    
    const allLayouts = [...builtInLayouts, ...Object.values(layouts)];
    
    // Remove duplicates and sort by lastUpdated
    const uniqueLayouts = allLayouts.reduce((acc, layout) => {
      if (!acc.find(l => l.id === layout.id)) {
        acc.push(layout);
      }
      return acc;
    }, [] as PageLayout[]);
    
    return uniqueLayouts.sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  }

  // Create a new layout
  async createLayout(name: string, basedOn?: string): Promise<PageLayout> {
    const baseLayout = basedOn ? await this.getLayout(basedOn) : this.defaultLayout;
    
    const newLayout: PageLayout = {
      id: `layout-${Date.now()}`,
      name,
      lastUpdated: new Date().toISOString(),
      widgets: baseLayout ? [...baseLayout.widgets] : []
    };
    
    await this.saveLayout(newLayout);
    return newLayout;
  }

  // Delete a layout
  async deleteLayout(layoutId: string): Promise<void> {
    if (layoutId === 'default-dashboard') {
      throw new Error('Cannot delete default dashboard layout');
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Handle built-in layouts by marking them as deleted
    if (layoutId === 'stacked-layout') {
      const deletedIds = this.getDeletedLayouts();
      deletedIds.add(layoutId);
      this.saveDeletedLayouts(deletedIds);
    } else {
      // Handle custom layouts by removing from storage
      const layouts = this.getStoredLayouts();
      delete layouts[layoutId];
      this.saveLayouts(layouts);
    }
  }

  // Reset to default layout
  async resetToDefault(): Promise<PageLayout> {
    return this.defaultLayout;
  }

  // Get current user's preferred layout ID
  getUserPreferredLayout(): string {
    return localStorage.getItem('preferred-dashboard-layout') || 'default-dashboard';
  }

  // Set user's preferred layout
  setUserPreferredLayout(layoutId: string): void {
    localStorage.setItem('preferred-dashboard-layout', layoutId);
  }
}

export const layoutService = new LayoutService();