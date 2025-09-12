import { useState, useEffect } from 'react';
import { Edit, Eye, EyeOff, Plus, Save, X, BarChart3, Calendar, User, Link2, Settings } from 'lucide-react';
import { localContentService } from '../services/localContentService';
import { widgetMappingService, type LayoutWidget, type WidgetMapping } from '../services/widgetMappingService';
import { layoutService } from '../services/layoutService';
import type { HubSpotContent } from '../types/pageBuilder';

interface ContentStats {
  total: number;
  active: number;
  inactive: number;
  types: string[];
  lastUpdated: string;
  version: string;
}

export default function ContentAdmin() {
  const [activeTab, setActiveTab] = useState<'content' | 'widgets'>('content');
  const [content, setContent] = useState<HubSpotContent[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HubSpotContent>>({});
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Widget management state
  const [widgets, setWidgets] = useState<LayoutWidget[]>([]);
  const [widgetMappings, setWidgetMappings] = useState<WidgetMapping[]>([]);
  const [assigningWidget, setAssigningWidget] = useState<string | null>(null);
  
  // Add content state
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [newContentForm, setNewContentForm] = useState({
    title: '',
    type: 'card' as HubSpotContent['type'],
    content: '',
    imageUrl: '',
    ctaText: '',
    ctaUrl: '',
    tags: ''
  });

  useEffect(() => {
    loadContent();
    loadStats();
    loadWidgets();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const allContent = await localContentService.getContent();
      setContent(allContent);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    const contentStats = localContentService.getContentStats();
    setStats(contentStats);
  };

  const loadWidgets = async () => {
    try {
      const allWidgets = await widgetMappingService.getAllContentWidgets();
      setWidgets(allWidgets);
      
      const mappings = widgetMappingService.getAllContentAssignments();
      setWidgetMappings(mappings);
    } catch (error) {
      console.error('Error loading widgets:', error);
    }
  };

  const startEdit = (item: HubSpotContent) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;
    
    try {
      await localContentService.updateContent(editingId, editForm);
      setEditingId(null);
      setEditForm({});
      // In a real implementation, we would reload the data
      console.log('✅ Content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      banner: 'bg-blue-100 text-blue-800',
      card: 'bg-green-100 text-green-800',
      blog_post: 'bg-purple-100 text-purple-800',
      cta: 'bg-orange-100 text-orange-800',
      testimonial: 'bg-pink-100 text-pink-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleAssignContent = async (widgetId: string, contentId: string) => {
    try {
      await widgetMappingService.assignContentToWidget(widgetId, contentId, 'Marketing Admin');
      setAssigningWidget(null);
      loadWidgets(); // Refresh the widget list
    } catch (error) {
      console.error('Error assigning content:', error);
    }
  };

  const handleRemoveContent = async (widgetId: string) => {
    try {
      console.log(`Removing content from widget: ${widgetId}`);
      
      // Use the improved widget mapping service method
      await widgetMappingService.removeContentFromWidget(widgetId);
      
      console.log('Content removal completed successfully');
      
      // Force a small delay to ensure all updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Reload widgets to reflect changes - force refresh
      await loadWidgets();
      
      console.log('Widget list refreshed after content removal');
      
    } catch (error) {
      console.error('Error removing content:', error);
      alert('Failed to remove content. Please try again or refresh the page.');
    }
  };

  const getWidgetTypeColor = (type: string) => {
    const colors = {
      'hubspot-banner': 'bg-blue-100 text-blue-800',
      'hubspot-card': 'bg-green-100 text-green-800', 
      'content-banner': 'bg-blue-100 text-blue-800',
      'content-card': 'bg-green-100 text-green-800',
      'stat-card': 'bg-purple-100 text-purple-800',
      'quick-links': 'bg-orange-100 text-orange-800',
      'saved-jobs': 'bg-pink-100 text-pink-800',
      'recent-applications': 'bg-indigo-100 text-indigo-800',
      'profile-overview': 'bg-teal-100 text-teal-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  
  const getWidgetTypeDisplayName = (type: string) => {
    const displayNames = {
      'hubspot-banner': 'content-banner',
      'hubspot-card': 'content-card',
      'content-banner': 'content-banner',
      'content-card': 'content-card',
      'stat-card': 'stat-card',
      'quick-links': 'quick-links',
      'saved-jobs': 'saved-jobs',
      'recent-applications': 'recent-applications',
      'profile-overview': 'profile-overview'
    };
    return displayNames[type as keyof typeof displayNames] || type;
  };

  const resetNewContentForm = () => {
    setNewContentForm({
      title: '',
      type: 'card',
      content: '',
      imageUrl: '',
      ctaText: '',
      ctaUrl: '',
      tags: ''
    });
  };

  const handleAddContent = async () => {
    if (!newContentForm.title.trim() || !newContentForm.content.trim()) {
      alert('Please fill in at least the title and content fields.');
      return;
    }

    try {
      const tagsArray = newContentForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const newContent: Omit<HubSpotContent, 'id' | 'publishedDate'> = {
        title: newContentForm.title,
        type: newContentForm.type,
        content: newContentForm.content,
        imageUrl: newContentForm.imageUrl || undefined,
        ctaText: newContentForm.ctaText || undefined,
        ctaUrl: newContentForm.ctaUrl || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        author: 'Content Admin'
      };

      await localContentService.createContent(newContent);
      
      // Refresh content list
      await loadContent();
      loadStats();
      
      // Close modal and reset form
      setShowAddContentModal(false);
      resetNewContentForm();
      
      console.log('✅ New content created successfully');
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Failed to create content. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage dashboard widget content • PoC Version
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowAddContentModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Content Library
              </div>
            </button>
            <button
              onClick={() => setActiveTab('widgets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'widgets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Widget Management
              </div>
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'content' && (
          <>
            {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Content</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Eye className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <EyeOff className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Inactive</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.inactive}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Version</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.version}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Widget Content
              </h3>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">Show inactive</span>
                </label>
              </div>
            </div>
          </div>

          <ul className="divide-y divide-gray-200">
            {content.map((item) => (
              <li key={item.id} className="px-4 py-4 sm:px-6">
                {editingId === item.id ? (
                  // Edit form
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Editing Content</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEdit}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm(prev => ({...prev, title: e.target.value}))}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CTA Text</label>
                        <input
                          type="text"
                          value={editForm.ctaText || ''}
                          onChange={(e) => setEditForm(prev => ({...prev, ctaText: e.target.value}))}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Content</label>
                      <textarea
                        value={editForm.content || ''}
                        onChange={(e) => setEditForm(prev => ({...prev, content: e.target.value}))}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  // Display view
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </h4>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.content}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                        {item.author && (
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {item.author}
                          </span>
                        )}
                        <span>ID: {item.id}</span>
                        {item.tags && item.tags.length > 0 && (
                          <span>Tags: {item.tags.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

            {/* PoC Notice */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Proof of Concept Version
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      This is a demonstration of content management functionality. In production, this would be integrated with your preferred CMS (HubSpot, Contentful, Strapi, etc.) and include features like:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Real-time content updates</li>
                      <li>User roles and permissions</li>
                      <li>Content approval workflows</li>
                      <li>Scheduling and publishing</li>
                      <li>Version history and rollbacks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'widgets' && (
          <>
            {/* Widget Management Section */}
            <div className="mb-8">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Dashboard Widget Content Assignment
                    </h3>
                    <button
                      onClick={async () => {
                        if (confirm('This will clear all broken content references. Continue?')) {
                          // Clear all widgets with invalid content
                          const allWidgets = await widgetMappingService.getAllContentWidgets();
                          for (const widget of allWidgets) {
                            if (widget.currentContentId) {
                              const contentExists = content.some(c => c.id === widget.currentContentId);
                              if (!contentExists) {
                                console.log(`Clearing broken reference for widget ${widget.id}`);
                                await handleRemoveContent(widget.id);
                              }
                            }
                          }
                          alert('Broken content references cleared. Please refresh the page.');
                          window.location.reload();
                        }
                      }}
                      className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                    >
                      Clear Broken References
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Link content from your content library to dashboard widgets. Changes are applied immediately to all layouts.
                  </p>
                  

                  {/* Content Type Compatibility Guide */}
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium mb-2">Content Type Guide:</p>
                    <div className="text-sm text-green-700 space-y-1">
                      <p><strong>Content Banner widgets</strong> work best with: Banner, Call to Action (CTA) content</p>
                      <p><strong>Content Card widgets</strong> work best with: Card, Blog Post, Text, Image content</p>
                      <p className="text-xs text-green-600 mt-2">💡 All content types are compatible with both widgets, but the above combinations provide optimal display.</p>
                    </div>
                  </div>
                  
                  {widgets.length === 0 ? (
                    <div className="text-center py-12">
                      <Settings className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No content widgets found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Content widgets will appear here when they are added to layouts.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {widgets.map((widget) => (
                        <div key={`${widget.layoutId}-${widget.id}`} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWidgetTypeColor(widget.type)}`}>
                                  {getWidgetTypeDisplayName(widget.type)}
                                </span>
                                <h4 className="text-lg font-medium text-gray-900">{widget.title}</h4>
                              </div>
                              
                              <div className="text-sm text-gray-600 mb-3">
                                <span className="font-medium">Layout:</span> {widget.layoutName}
                                <span className="mx-2">•</span>
                                <span className="font-medium">Widget ID:</span> {widget.id}
                              </div>
                              
                              {widget.currentContentId ? (
                                <div className="mb-4">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Link2 className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium text-green-700">Currently linked to:</span>
                                  </div>
                                  {(() => {
                                    const linkedContent = content.find(c => c.id === widget.currentContentId);
                                    return linkedContent ? (
                                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <h5 className="font-medium text-green-900">{linkedContent.title}</h5>
                                            <p className="text-sm text-green-700 mt-1">{linkedContent.content}</p>
                                            <p className="text-xs text-green-600 mt-1">Content ID: {linkedContent.id}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <p className="text-sm text-red-700">Content not found (ID: {widget.currentContentId})</p>
                                      </div>
                                    );
                                  })()}
                                </div>
                              ) : (
                                <div className="mb-4">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                                    <span className="text-sm font-medium text-gray-500">No content assigned</span>
                                  </div>
                                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                                    <p className="text-sm text-gray-600">This widget will display default content until content is assigned.</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-6 flex flex-col space-y-2">
                              <button
                                onClick={() => setAssigningWidget(assigningWidget === widget.id ? null : widget.id)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <Link2 className="w-4 h-4 mr-2" />
                                {assigningWidget === widget.id ? 'Cancel' : 'Assign Content'}
                              </button>
                              
                              {widget.currentContentId && (
                                <button
                                  onClick={() => handleRemoveContent(widget.id)}
                                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Content Assignment Dropdown */}
                          {assigningWidget === widget.id && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                              <h5 className="text-sm font-medium text-gray-900 mb-3">Select content to assign:</h5>
                              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                                {content.map((contentItem) => (
                                  <button
                                    key={`${widget.id}-${contentItem.id}`}
                                    onClick={() => handleAssignContent(widget.id, contentItem.id)}
                                    className="text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(contentItem.type)}`}>
                                            {contentItem.type}
                                          </span>
                                          <h6 className="font-medium text-gray-900">{contentItem.title}</h6>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2">{contentItem.content}</p>
                                        <p className="text-xs text-gray-500 mt-1">ID: {contentItem.id}</p>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Widget Management PoC Notice */}
            <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Settings className="h-5 w-5 text-purple-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-purple-800">
                    Dynamic Content Assignment
                  </h3>
                  <div className="mt-2 text-sm text-purple-700">
                    <p>
                      This widget management system allows marketing teams to dynamically assign content without developer involvement. Features include:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Real-time widget content assignment</li>
                      <li>Content preview before assignment</li>
                      <li>Layout-aware widget management</li>
                      <li>Instant updates across all users</li>
                      <li>Content tracking and assignment history</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Add Content Modal */}
        {showAddContentModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddContentModal(false);
                resetNewContentForm();
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Content</h2>
                  <button
                    onClick={() => {
                      setShowAddContentModal(false);
                      resetNewContentForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAddContent(); }}>
                  <div className="grid grid-cols-1 gap-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={newContentForm.title}
                        onChange={(e) => setNewContentForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter content title"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Type *
                      </label>
                      <select
                        value={newContentForm.type}
                        onChange={(e) => setNewContentForm(prev => ({ ...prev, type: e.target.value as HubSpotContent['type'] }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="card">Card</option>
                        <option value="banner">Banner</option>
                        <option value="blog_post">Blog Post</option>
                        <option value="cta">Call to Action</option>
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                      </select>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content *
                      </label>
                      <textarea
                        value={newContentForm.content}
                        onChange={(e) => setNewContentForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter the main content text"
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL (optional)
                      </label>
                      <input
                        type="url"
                        value={newContentForm.imageUrl}
                        onChange={(e) => setNewContentForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* CTA Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Call-to-Action Text
                        </label>
                        <input
                          type="text"
                          value={newContentForm.ctaText}
                          onChange={(e) => setNewContentForm(prev => ({ ...prev, ctaText: e.target.value }))}
                          placeholder="Learn More"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Call-to-Action URL
                        </label>
                        <input
                          type="url"
                          value={newContentForm.ctaUrl}
                          onChange={(e) => setNewContentForm(prev => ({ ...prev, ctaUrl: e.target.value }))}
                          placeholder="/page-url or https://external.com"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newContentForm.tags}
                        onChange={(e) => setNewContentForm(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="marketing, promotion, featured"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter tags separated by commas to help organize and filter content
                      </p>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddContentModal(false);
                        resetNewContentForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create Content
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}