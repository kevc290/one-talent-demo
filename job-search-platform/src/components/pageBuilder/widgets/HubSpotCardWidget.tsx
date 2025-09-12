import { useState, useEffect } from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { localContentService } from '../../../services/localContentService';
import { widgetMappingService } from '../../../services/widgetMappingService';
import { useTheme } from '../../../contexts/ThemeContext';
import type { HubSpotContent } from '../../../types/pageBuilder';

interface ContentCardWidgetProps {
  contentId?: string;
  hubspotId?: string; // Backward compatibility
  isEditing?: boolean;
  width?: number;
  height?: number;
  widgetId?: string; // Widget ID for dynamic content mapping
}

export function HubSpotCardWidget({ contentId, hubspotId, isEditing = false, width = 12, height = 8, widgetId }: ContentCardWidgetProps) {
  const [content, setContent] = useState<HubSpotContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentBrand } = useTheme();

  // Determine layout based on widget size
  const isCompact = width < 12;
  const isVeryCompact = width < 8;
  const isTall = height >= 10;
  const isVeryTall = height >= 12;
  const isWide = width >= 16;

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
        setContent({
          id: 'placeholder',
          title: 'Content Card',
          type: 'card',
          content: 'Select content to display in this card',
        });
        setLoading(false);
        return;
      }

      try {
        const data = await localContentService.getContentById(finalContentId);
        setContent(data);
      } catch (error) {
        console.error('Failed to load content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentId, hubspotId, widgetId]);

  if (loading) {
    const padding = isVeryCompact ? 'p-3' : isCompact ? 'p-4' : 'p-6';
    return (
      <div className={`bg-white rounded-lg shadow-sm ${padding} animate-pulse h-full`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (!content) {
    const padding = isVeryCompact ? 'p-3' : isCompact ? 'p-4' : 'p-6';
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg ${padding} h-full flex items-center justify-center`}>
        <span className={`text-red-600 ${isVeryCompact ? 'text-sm' : ''}`}>Failed to load content</span>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate responsive sizes
  const padding = isVeryCompact ? 'p-3' : isCompact ? 'p-4' : 'p-6';
  const titleSize = isVeryCompact ? 'text-sm' : isCompact ? 'text-base' : 'text-lg';
  const contentSize = isVeryCompact ? 'text-xs' : 'text-sm';
  const showImage = !isVeryCompact && content.imageUrl;
  const showMetadata = !isVeryCompact;
  const showTags = width >= 10 && content.tags && content.tags.length > 0;
  const maxTagsToShow = isWide ? 5 : isCompact ? 2 : 3;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative h-full flex flex-col">
      {showImage && (
        <div className={`${isTall ? 'aspect-video' : 'h-20'} overflow-hidden flex-shrink-0`}>
          <img 
            src={content.imageUrl} 
            alt={content.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className={`${padding} flex-1 flex flex-col`}>
        <h3 className={`${titleSize} font-semibold text-gray-900 mb-2 line-clamp-2`}>{content.title}</h3>
        
        <div className="flex-1 flex flex-col">
          {content.htmlContent ? (
            <div 
              dangerouslySetInnerHTML={{ __html: content.htmlContent }}
              className={`text-gray-600 ${contentSize} mb-4 prose prose-sm max-w-none flex-1`}
            />
          ) : (
            <p className={`text-gray-600 ${contentSize} mb-4 ${isTall ? 'line-clamp-5' : 'line-clamp-3'} flex-1`}>{content.content}</p>
          )}
          
          {showMetadata && (content.publishedDate || content.author) && (
            <div className={`flex items-center ${isCompact ? 'justify-center' : 'justify-between'} text-xs text-gray-500 mb-4`}>
              {content.publishedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(content.publishedDate)}
                </div>
              )}
              {content.author && !isVeryCompact && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {content.author}
                </div>
              )}
            </div>
          )}

          {showTags && (
            <div className="flex flex-wrap gap-1 mb-4">
              {content.tags.slice(0, maxTagsToShow).map((tag) => (
                <span 
                  key={tag}
                  className={`px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full ${isVeryCompact ? 'text-xs px-1 py-0.5' : ''}`}
                >
                  {tag}
                </span>
              ))}
              {content.tags.length > maxTagsToShow && (
                <span className="px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-full">
                  +{content.tags.length - maxTagsToShow}
                </span>
              )}
            </div>
          )}
          
          {content.ctaText && content.ctaUrl && (
            <button 
              className={`w-full text-white rounded-lg transition-colors inline-flex items-center justify-center gap-2 font-medium mt-auto ${
                currentBrand.id === 'kelly' ? 'bg-green-600 hover:bg-green-700' :
                currentBrand.colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 
                currentBrand.colors.primary === 'purple' ? 'bg-purple-600 hover:bg-purple-700' : 
                currentBrand.colors.primary === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700' :
                'bg-gray-600 hover:bg-gray-700'
              } ${isVeryCompact ? 'py-1 px-2 text-xs' : 'py-2 px-4 text-sm'}`}
              onClick={() => !isEditing && window.open(content.ctaUrl, '_self')}
              disabled={isEditing}
            >
              {isVeryCompact ? 'View' : content.ctaText}
              {!isVeryCompact && <ExternalLink className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
      
      {isEditing && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <span className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-medium">
            Content Card Widget
          </span>
        </div>
      )}
    </div>
  );
}