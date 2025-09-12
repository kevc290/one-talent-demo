import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import type { WidgetConfig } from '../../types/pageBuilder';
import { localContentService } from '../../services/localContentService';
import type { HubSpotContent } from '../../types/pageBuilder';

interface WidgetConfigPanelProps {
  widget: WidgetConfig;
  onUpdateConfig: (widgetId: string, config: Record<string, any>) => void;
  onClose: () => void;
}

export function WidgetConfigPanel({ widget, onUpdateConfig, onClose }: WidgetConfigPanelProps) {
  const [config, setConfig] = useState(widget.config || {});
  const [availableContent, setAvailableContent] = useState<HubSpotContent[]>([]);
  const [contentSearch, setContentSearch] = useState('');
  const [contentLoading, setContentLoading] = useState(false);

  // Load content if this is a content widget
  useEffect(() => {
    if (widget.type.startsWith('hubspot')) {
      loadContent();
    }
  }, [widget.type]);

  const loadContent = async () => {
    setContentLoading(true);
    try {
      const content = await localContentService.getContent();
      setAvailableContent(content);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const searchContent = async () => {
    if (!contentSearch.trim()) {
      loadContent();
      return;
    }

    setContentLoading(true);
    try {
      const content = await localContentService.searchContent(contentSearch);
      setAvailableContent(content);
    } catch (error) {
      console.error('Failed to search content:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const handleSave = () => {
    onUpdateConfig(widget.id, config);
    onClose();
  };

  const renderContentConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Content
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={contentSearch}
            onChange={(e) => setContentSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchContent()}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
            placeholder="Search content..."
          />
          <button
            onClick={searchContent}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selected Content
        </label>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          {contentLoading ? (
            <div className="p-4 text-center text-gray-500">Loading content...</div>
          ) : availableContent.length > 0 ? (
            <div className="space-y-2 p-2">
              {availableContent.map((content) => (
                <button
                  key={content.id}
                  onClick={() => setConfig({ ...config, contentId: content.id })}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    config.contentId === content.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{content.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{content.content}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {content.type}
                    </span>
                    {content.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No content found</div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStatCardConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={config.title || ''}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter title"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Value
        </label>
        <input
          type="text"
          value={config.value || ''}
          onChange={(e) => setConfig({ ...config, value: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter value"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Icon
        </label>
        <select
          value={config.icon || 'trending'}
          onChange={(e) => setConfig({ ...config, icon: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="heart">Heart</option>
          <option value="file">File</option>
          <option value="user">User</option>
          <option value="briefcase">Briefcase</option>
          <option value="trending">Trending</option>
          <option value="clock">Clock</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <select
          value={config.color || 'blue'}
          onChange={(e) => setConfig({ ...config, color: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="purple">Purple</option>
          <option value="orange">Orange</option>
          <option value="red">Red</option>
        </select>
      </div>
    </div>
  );

  const renderQuickLinksConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={config.title || 'Quick Links'}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter title"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Links (JSON format)
        </label>
        <textarea
          value={JSON.stringify(config.links || [], null, 2)}
          onChange={(e) => {
            try {
              const links = JSON.parse(e.target.value);
              setConfig({ ...config, links });
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
          rows={8}
          placeholder={`[
  {
    "label": "Browse Jobs",
    "href": "/jobs",
    "icon": "briefcase"
  }
]`}
        />
      </div>
    </div>
  );

  const renderGenericConfig = () => (
    <div className="text-center py-8 text-gray-500">
      <p>This widget doesn't have configurable options.</p>
    </div>
  );

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Configure Widget</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-1">{widget.title}</h3>
          <p className="text-sm text-gray-600">Type: {widget.type}</p>
        </div>

        {widget.type.startsWith('hubspot') && renderContentConfig()}
        {widget.type === 'stat-card' && renderStatCardConfig()}
        {widget.type === 'quick-links' && renderQuickLinksConfig()}
        {!widget.type.startsWith('hubspot') && 
         widget.type !== 'stat-card' && 
         widget.type !== 'quick-links' && renderGenericConfig()}
      </div>

      <div className="border-t p-6 flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}