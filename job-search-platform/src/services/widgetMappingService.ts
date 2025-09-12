import { layoutService } from './layoutService';

export interface WidgetMapping {
  widgetId: string;
  contentId: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface LayoutWidget {
  id: string;
  type: string;
  title: string;
  layoutId: string;
  layoutName: string;
  currentContentId?: string;
}

class WidgetMappingService {
  private storageKey = 'widget-content-mappings';

  // Get all widget mappings from localStorage
  private getMappings(): Record<string, WidgetMapping> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load widget mappings:', error);
      return {};
    }
  }

  // Save widget mappings to localStorage
  private saveMappings(mappings: Record<string, WidgetMapping>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(mappings));
    } catch (error) {
      console.error('Failed to save widget mappings:', error);
    }
  }

  // Get all widgets from all layouts that support content
  async getAllContentWidgets(): Promise<LayoutWidget[]> {
    const layouts = await layoutService.getAllLayouts();
    const mappings = this.getMappings();
    const contentWidgets: LayoutWidget[] = [];

    // Import the local content service to validate content exists
    const { localContentService } = await import('../services/localContentService');
    const allContent = await localContentService.getContent();
    const validContentIds = new Set(allContent.map(c => c.id));

    // Define which widget types can display content
    const contentSupportedTypes = [
      'hubspot-banner', 
      'hubspot-card',
      'stat-card',
      'quick-links',
      'saved-jobs',
      'recent-applications',
      'profile-overview'
    ];

    layouts.forEach(layout => {
      layout.widgets.forEach(widget => {
        // Include ALL widgets that can potentially display content
        if (contentSupportedTypes.includes(widget.type)) {
          const mapping = mappings[widget.id];
          // Check for contentId first, then fall back to hubspotId for backward compatibility
          const configContentId = widget.config?.contentId || widget.config?.hubspotId;
          
          // Use mapping first, then config, but validate the content exists
          let currentContentId = mapping?.contentId || configContentId;
          
          // Only keep the contentId if it actually exists in the content library
          if (currentContentId && !validContentIds.has(currentContentId)) {
            console.warn(`Widget ${widget.id} references non-existent content ${currentContentId}`);
            currentContentId = undefined;
          }
          
          // Include ALL content-supported widgets - show them all for management
          contentWidgets.push({
            id: widget.id,
            type: widget.type,
            title: widget.title,
            layoutId: layout.id,
            layoutName: layout.name,
            currentContentId: currentContentId
          });
        }
      });
    });

    return contentWidgets;
  }

  // Assign content to a widget
  async assignContentToWidget(widgetId: string, contentId: string, updatedBy: string = 'Admin'): Promise<void> {
    const mappings = this.getMappings();
    
    mappings[widgetId] = {
      widgetId,
      contentId,
      lastUpdated: new Date().toISOString(),
      updatedBy
    };
    
    this.saveMappings(mappings);
    
    // Update the layout service to use the new content ID
    await this.updateLayoutWidgetContent(widgetId, contentId);
  }

  // Remove content assignment from a widget
  async removeContentFromWidget(widgetId: string): Promise<void> {
    console.log(`Removing content mapping for widget: ${widgetId}`);
    
    // Remove from mappings
    const mappings = this.getMappings();
    const hadMapping = mappings[widgetId] !== undefined;
    delete mappings[widgetId];
    this.saveMappings(mappings);
    
    console.log(`Mapping removed: ${hadMapping ? 'yes' : 'no'}`);
    
    // Reset layout widget to default content
    await this.updateLayoutWidgetContent(widgetId, null);
    
    console.log(`Widget ${widgetId} content removal completed`);
  }

  // Update the layout service with new content assignment
  private async updateLayoutWidgetContent(widgetId: string, contentId: string | null): Promise<void> {
    console.log(`Updating layout widget content for ${widgetId}, contentId: ${contentId}`);
    
    // Get the user's preferred layout first to ensure we're updating the current one
    const preferredLayoutId = layoutService.getUserPreferredLayout();
    console.log(`Preferred layout ID: ${preferredLayoutId}`);
    
    const currentLayout = await layoutService.getLayout(preferredLayoutId);
    
    if (!currentLayout) {
      console.warn('No current layout found, skipping widget content update');
      return;
    }
    
    console.log(`Current layout: ${currentLayout.id} with ${currentLayout.widgets.length} widgets`);
    
    // Check if the widget exists in the current layout
    const widget = currentLayout.widgets.find(w => w.id === widgetId);
    if (!widget) {
      console.warn(`Widget ${widgetId} not found in current layout ${currentLayout.id}`);
      console.log('Available widgets:', currentLayout.widgets.map(w => w.id));
      return;
    }
    
    console.log(`Found widget ${widgetId} in layout, current config:`, widget.config);
    
    // Update only the current layout to preserve positions
    const updatedWidgets = currentLayout.widgets.map(widget => {
      if (widget.id === widgetId) {
        // Remove both hubspotId and contentId when contentId is null
        if (contentId === null) {
          const { hubspotId, contentId: oldContentId, ...restConfig } = widget.config || {};
          return {
            ...widget,
            config: restConfig
          };
        } else {
          // Add contentId when assigning
          return {
            ...widget,
            config: {
              ...widget.config,
              contentId: contentId,
              // Remove hubspotId if it exists
              hubspotId: undefined
            }
          };
        }
      }
      return widget;
    });
    
    const updatedLayout = {
      ...currentLayout,
      widgets: updatedWidgets,
      lastUpdated: new Date().toISOString()
    };
    
    await layoutService.saveLayout(updatedLayout);
    console.log(`Updated widget ${widgetId} content in layout ${currentLayout.id}`);
  }

  // Get content assignment for a specific widget
  getWidgetContentAssignment(widgetId: string): WidgetMapping | null {
    const mappings = this.getMappings();
    return mappings[widgetId] || null;
  }

  // Get all content assignments
  getAllContentAssignments(): WidgetMapping[] {
    const mappings = this.getMappings();
    return Object.values(mappings);
  }
}

export const widgetMappingService = new WidgetMappingService();