import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { localContentService } from '../../../services/localContentService';
import { widgetMappingService } from '../../../services/widgetMappingService';
import type { HubSpotContent } from '../../../types/pageBuilder';

interface ContentBannerWidgetProps {
  contentId?: string;
  hubspotId?: string; // Backward compatibility
  isEditing?: boolean;
  width?: number; // Grid columns (out of 48)
  height?: number; // Grid rows
  widgetId?: string; // Widget ID for dynamic content mapping
}

export function HubSpotBannerWidget({ contentId, hubspotId, isEditing = false, width = 32, height = 3, widgetId }: ContentBannerWidgetProps) {
  const [content, setContent] = useState<HubSpotContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      // Use contentId first, fall back to hubspotId for backward compatibility
      let finalContentId = contentId || hubspotId;
      
      // Check for dynamic content assignment if widgetId is provided
      if (widgetId) {
        const assignment = widgetMappingService.getWidgetContentAssignment(widgetId);
        if (assignment) {
          finalContentId = assignment.contentId;
        }
      }
      
      if (!finalContentId) {
        // Show placeholder content
        setContent({
          id: 'placeholder',
          title: 'Content Banner',
          type: 'banner',
          content: 'Select content to display here',
          ctaText: 'Configure Content'
        });
        setLoading(false);
        return;
      }

      try {
        const data = await localContentService.getContentById(finalContentId);
        if (data) {
          setContent(data);
        } else {
          // Content not found (was deleted), show placeholder
          console.warn(`Content ${finalContentId} not found - it may have been deleted`);
          setContent({
            id: 'placeholder',
            title: 'Content Not Found',
            type: 'banner',
            content: `The content with ID "${finalContentId}" was not found. Please assign new content.`,
            ctaText: 'Assign Content'
          });
        }
      } catch (error) {
        console.error('Failed to load content:', error);
        // Show error placeholder
        setContent({
          id: 'placeholder',
          title: 'Error Loading Content',
          type: 'banner',
          content: 'Failed to load content. Please check the content library.',
          ctaText: 'Refresh'
        });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentId, hubspotId, widgetId]);

  if (loading) {
    return (
      <div className="h-32 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Loading banner...</span>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="h-32 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
        <span className="text-red-600">Failed to load banner content</span>
      </div>
    );
  }

  // Determine layout based on widget dimensions
  const isCompact = width < 20; // Less than ~40% of full width
  const isNarrow = width < 16; // Very narrow layout
  
  return (
    <div 
      className="relative rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white h-full"
      style={{
        backgroundImage: content.imageUrl ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: isCompact ? '4rem' : '4rem'
      }}
    >
      <div className={`${isCompact ? 'p-4' : 'p-6'} relative z-10 h-full flex flex-col justify-center`}>
        {content.htmlContent ? (
          <div 
            dangerouslySetInnerHTML={{ __html: content.htmlContent }}
            className="space-y-2"
          />
        ) : (
          <>
            <h2 className={`${isCompact ? 'text-md' : 'text-lg'} ${isCompact ? 'pt-0' : 'pt-2'} font-bold mb-2 ${isNarrow ? 'line-clamp-2' : ''}`}>
              {content.title}
            </h2>
            {!isNarrow && (
              <p className={`${isCompact ? 'text-xs' : 'text-sm'} opacity-90 mb-4 ${isCompact ? 'line-clamp-2' : ''}`}>
                {content.content}
              </p>
            )}
          </>
        )}
        
        {content.ctaText && content.ctaUrl && !isNarrow && (
          <button 
            className={`bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2 ${
              isCompact ? 'text-sm' : ''
            } self-start`}
            onClick={() => !isEditing && window.open(content.ctaUrl, '_self')}
            disabled={isEditing}
          >
            {content.ctaText}
            <ExternalLink className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
          </button>
        )}
      </div>
      
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <span className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-medium">
            Content Banner ({width}×{height})
          </span>
        </div>
      )}
    </div>
  );
}