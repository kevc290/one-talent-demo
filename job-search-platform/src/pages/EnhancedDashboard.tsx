import { useState, useEffect } from 'react';
import { Settings, Edit3, Plus, Trash2, Database, Save, RotateCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { LiveEditingEngine } from '../components/pageBuilder/LiveEditingEngine';
import { layoutService } from '../services/layoutService';
import { jobsService } from '../services/jobsService';
import { applicationsService } from '../services/applicationsService';
import { jobs } from '../data/jobs';
import type { PageLayout } from '../types/pageBuilder';

export function EnhancedDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { currentBrand } = useTheme();
  const [currentLayout, setCurrentLayout] = useState<PageLayout | null>(null);
  const [liveEditMode, setLiveEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableLayouts, setAvailableLayouts] = useState<PageLayout[]>([]);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!isAuthenticated || !user || authLoading) {
        return;
      }

      try {
        setIsLoading(true);
        
        // Load user's preferred layout
        const preferredLayoutId = layoutService.getUserPreferredLayout();
        console.log('Loading preferred layout:', preferredLayoutId);
        
        const layout = await layoutService.getLayout(preferredLayoutId);
        console.log('Loaded layout:', layout?.name, 'with', layout?.widgets.length, 'widgets');
        
        if (layout) {
          setCurrentLayout(layout);
        }
        
        // Load available layouts for selection
        const layouts = await layoutService.getAllLayouts();
        console.log('Available layouts:', layouts.map(l => `${l.name} (${l.id})`));
        setAvailableLayouts(layouts);
        
      } catch (error) {
        console.error('Failed to load dashboard layout:', error);
        // Fallback to default layout
        const defaultLayout = await layoutService.getLayout('default-dashboard');
        if (defaultLayout) {
          setCurrentLayout(defaultLayout);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [user, isAuthenticated, authLoading]);

  const handleSaveLayout = async (layout: PageLayout) => {
    try {
      await layoutService.saveLayout(layout);
      setCurrentLayout(layout);
      
      // Update preferred layout
      layoutService.setUserPreferredLayout(layout.id);
      
      // Refresh available layouts
      const layouts = await layoutService.getAllLayouts();
      setAvailableLayouts(layouts);
      
    } catch (error) {
      console.error('Failed to save layout:', error);
      alert('Failed to save layout. Please try again.');
    }
  };

  const handleLayoutChange = async (layoutId: string) => {
    try {
      const layout = await layoutService.getLayout(layoutId);
      if (layout) {
        setCurrentLayout(layout);
        layoutService.setUserPreferredLayout(layoutId);
      }
      setShowLayoutSelector(false);
    } catch (error) {
      console.error('Failed to change layout:', error);
    }
  };

  const createNewLayout = async () => {
    try {
      const name = prompt('Enter a name for the new layout:');
      if (!name) return;
      
      const newLayout = await layoutService.createLayout(name, currentLayout?.id);
      setCurrentLayout(newLayout);
      layoutService.setUserPreferredLayout(newLayout.id);
      
      // Refresh available layouts
      const layouts = await layoutService.getAllLayouts();
      setAvailableLayouts(layouts);
      
      // Enable live edit mode for the new layout
      setLiveEditMode(true);
    } catch (error) {
      console.error('Failed to create layout:', error);
      alert('Failed to create new layout. Please try again.');
    }
  };

  const resetLayouts = () => {
    if (confirm('Reset all layouts and clear cache? This will reload the page.')) {
      localStorage.removeItem('dashboard-layouts');
      localStorage.removeItem('preferred-dashboard-layout');
      window.location.reload();
    }
  };

  const deleteLayout = async (layoutId: string, layoutName: string) => {
    // Prevent deletion of default layout only
    if (layoutId === 'default-dashboard') {
      alert('Cannot delete the default dashboard layout');
      return;
    }

    if (confirm(`Delete layout "${layoutName}"? This cannot be undone.`)) {
      try {
        await layoutService.deleteLayout(layoutId);
        
        // Refresh available layouts
        const layouts = await layoutService.getAllLayouts();
        setAvailableLayouts(layouts);
        
        // If we're deleting the current layout, switch to default
        if (currentLayout?.id === layoutId) {
          const defaultLayout = await layoutService.getLayout('default-dashboard');
          if (defaultLayout) {
            setCurrentLayout(defaultLayout);
            layoutService.setUserPreferredLayout('default-dashboard');
          }
        }
        
        console.log(`✅ Deleted layout: ${layoutName}`);
      } catch (error) {
        console.error('Failed to delete layout:', error);
        alert('Failed to delete layout: ' + error.message);
      }
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard' }
  ];

  // Function to populate sample data for widgets
  const populateSampleData = async () => {
    if (!user) return;
    
    try {
      // Add some saved jobs
      const currentSavedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      if (currentSavedJobs.length === 0) {
        // Save first 3 jobs
        const jobsToSave = jobs.slice(0, 3).map(job => job.id);
        localStorage.setItem('savedJobs', JSON.stringify(jobsToSave));
        console.log('Added 3 saved jobs');
      }
      
      // Add some applications
      const userApplicationsKey = `userApplications_${user.id}`;
      const currentApplications = JSON.parse(localStorage.getItem(userApplicationsKey) || '[]');
      
      if (currentApplications.length === 0) {
        const sampleApplications = [
          {
            id: '1',
            jobId: jobs[0].id,
            jobTitle: jobs[0].title,
            company: jobs[0].company,
            location: jobs[0].location,
            type: jobs[0].type,
            status: 'reviewed' as const,
            appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            coverLetter: 'I am very interested in this position...',
            notes: 'Waiting for response'
          },
          {
            id: '2',
            jobId: jobs[1].id,
            jobTitle: jobs[1].title,
            company: jobs[1].company,
            location: jobs[1].location,
            type: jobs[1].type,
            status: 'interview' as const,
            appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            coverLetter: 'With my experience in...',
            notes: 'Interview scheduled for next week'
          },
          {
            id: '3',
            jobId: jobs[2].id,
            jobTitle: jobs[2].title,
            company: jobs[2].company,
            location: jobs[2].location,
            type: jobs[2].type,
            status: 'pending' as const,
            appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            coverLetter: 'I believe my skills align perfectly...',
            notes: 'Just applied'
          }
        ];
        
        localStorage.setItem(userApplicationsKey, JSON.stringify(sampleApplications));
        console.log('Added 3 sample applications');
      }
      
      alert('Sample data added! The page will reload to show the data.');
      window.location.reload();
    } catch (error) {
      console.error('Failed to add sample data:', error);
      alert('Failed to add sample data. Please try again.');
    }
  };

  // Function to save current layout as the new default template
  const saveAsDefaultTemplate = async () => {
    if (!currentLayout) return;
    
    try {
      if (confirm('Save the current layout as the new default template? This will become the layout that loads for all users by default.')) {
        // Store the current layout as a template
        const templateKey = 'default-layout-template';
        const templateLayout = {
          ...currentLayout,
          id: 'default-dashboard',
          name: 'Default Dashboard',
          lastUpdated: new Date().toISOString(),
          isTemplate: true
        };
        
        // Save to localStorage as a template
        localStorage.setItem(templateKey, JSON.stringify(templateLayout));
        
        // Also update the code by showing the layout structure
        console.log('=== LAYOUT TEMPLATE TO UPDATE IN CODE ===');
        console.log('Copy this to layoutService.ts createCompatibleLayout() method:');
        console.log(JSON.stringify(templateLayout.widgets, null, 6));
        console.log('=== END LAYOUT TEMPLATE ===');
        
        alert(`Layout saved as default template! 
        
The layout structure has been logged to the console. To make this permanent:
1. Open the browser console (F12)
2. Copy the widget array that was logged
3. Replace the widgets array in src/services/layoutService.ts in the createCompatibleLayout() method
        
For now, this will be used as the default when the cache is cleared.`);
      }
    } catch (error) {
      console.error('Failed to save layout template:', error);
      alert('Failed to save layout template. Please try again.');
    }
  };

  // Function to restore the saved template
  const restoreSavedTemplate = async () => {
    try {
      const savedTemplate = localStorage.getItem('default-layout-template');
      if (!savedTemplate) {
        alert('No saved template found. Please save a template first using "Save as Default".');
        return;
      }

      if (confirm('Restore the saved layout template? This will overwrite your current layout positions.')) {
        const template = JSON.parse(savedTemplate);
        const restoredLayout = {
          ...template,
          id: currentLayout?.id || 'default-dashboard',
          lastUpdated: new Date().toISOString()
        };
        
        await layoutService.saveLayout(restoredLayout);
        
        // Reload the layout using the existing pattern
        setCurrentLayout(restoredLayout);
        layoutService.setUserPreferredLayout(restoredLayout.id);
        
        alert('Layout restored from saved template!');
      }
    } catch (error) {
      console.error('Failed to restore template:', error);
      alert('Failed to restore template. Please try again.');
    }
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <Breadcrumb items={breadcrumbItems} />
            <div className="mt-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="text-gray-600">
                Track your job applications and discover new opportunities
              </p>
            </div>
          </div>

          {/* Dashboard Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Add Sample Data Button */}
            <button
              onClick={populateSampleData}
              className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap"
              title="Add sample data for testing widgets"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Add Sample Data</span>
              <span className="sm:hidden">Sample</span>
            </button>
            
            {/* Save as Default Template Button */}
            <button
              onClick={saveAsDefaultTemplate}
              className="flex items-center gap-1.5 bg-blue-100 border border-blue-300 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-blue-800 text-sm whitespace-nowrap"
              title="Save current layout as default template"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save as Default</span>
              <span className="sm:hidden">Save</span>
            </button>
            
            {/* Restore Template Button */}
            <button
              onClick={restoreSavedTemplate}
              className="flex items-center gap-1.5 bg-orange-100 border border-orange-300 px-3 py-2 rounded-lg hover:bg-orange-200 transition-colors text-orange-800 text-sm whitespace-nowrap"
              title="Restore saved layout template"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Restore</span>
              <span className="sm:hidden">↻</span>
            </button>
            
            {/* Clear Template Button */}
            <button
              onClick={() => {
                if (confirm('Clear the saved template and use the updated code template? This will reload the page.')) {
                  localStorage.removeItem('default-layout-template');
                  window.location.reload();
                }
              }}
              className="flex items-center gap-1.5 bg-red-100 border border-red-300 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors text-red-800 text-sm whitespace-nowrap"
              title="Clear saved template and use code template"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Template</span>
              <span className="sm:hidden">Clear</span>
            </button>
            
            {/* Layout Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLayoutSelector(!showLayoutSelector)}
                className="flex items-center gap-1.5 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Layout: {currentLayout?.name || 'Default'}</span>
                <span className="md:hidden">Layout</span>
              </button>
              
              {showLayoutSelector && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900">Choose Layout</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {availableLayouts.map((layout) => {
                      const isProtected = layout.id === 'default-dashboard';
                      return (
                        <div
                          key={layout.id}
                          className={`group flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors ${
                            currentLayout?.id === layout.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <button
                            onClick={() => handleLayoutChange(layout.id)}
                            className={`flex-1 text-left ${
                              currentLayout?.id === layout.id ? 'text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <div className="font-medium flex items-center gap-2">
                              {layout.name}
                              {isProtected && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              Modified {new Date(layout.lastUpdated).toLocaleDateString()}
                            </div>
                          </button>
                          
                          {/* Delete button - only hide for default layout */}
                          {!isProtected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLayout(layout.id, layout.name);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                              title={`Delete ${layout.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 border-t border-gray-200 space-y-2">
                    <button
                      onClick={createNewLayout}
                      className="w-full flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Layout
                    </button>
                    {availableLayouts.filter(l => l.id !== 'default-dashboard').length <= 1 && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        💡 Tip: All layouts except Default Dashboard can be deleted (🗑️) on hover
                      </div>
                    )}
                    <button
                      onClick={resetLayouts}
                      className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Reset Layouts
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live Edit Button */}
            <button
              onClick={async () => {
                if (liveEditMode && currentLayout) {
                  // Save the layout when exiting edit mode
                  await layoutService.saveLayout(currentLayout);
                  layoutService.setUserPreferredLayout(currentLayout.id);
                }
                setLiveEditMode(!liveEditMode);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                liveEditMode
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : currentBrand.id === 'kelly' ? 'bg-green-600 text-white hover:bg-green-700' :
                    currentBrand.colors.primary === 'blue' ? 'bg-blue-600 text-white hover:bg-blue-700' : 
                    currentBrand.colors.primary === 'purple' ? 'bg-purple-600 text-white hover:bg-purple-700' : 
                    currentBrand.colors.primary === 'emerald' ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                    'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">{liveEditMode ? 'Exit Edit' : 'Edit Dashboard'}</span>
              <span className="sm:hidden">{liveEditMode ? 'Exit' : 'Edit'}</span>
            </button>
          </div>
        </div>

        {/* Render Dashboard Layout */}
        {currentLayout ? (
          <LiveEditingEngine
            widgets={currentLayout.widgets}
            onUpdateLayout={(widgets) => {
              const updatedLayout = { ...currentLayout, widgets };
              setCurrentLayout(updatedLayout);
              // Auto-save changes in live edit mode
              layoutService.saveLayout(updatedLayout);
            }}
            onRemoveWidget={(id) => {
              const updatedLayout = {
                ...currentLayout,
                widgets: currentLayout.widgets.filter(w => w.id !== id)
              };
              setCurrentLayout(updatedLayout);
              layoutService.saveLayout(updatedLayout);
            }}
            onConfigureWidget={(widget) => {
              console.log('Configure widget:', widget.id);
              // TODO: Open configuration panel
            }}
            showGrid={true}
            isEditMode={liveEditMode}
            onToggleEdit={async () => {
              if (liveEditMode && currentLayout) {
                // Save the layout when exiting edit mode
                await layoutService.saveLayout(currentLayout);
                layoutService.setUserPreferredLayout(currentLayout.id);
              }
              setLiveEditMode(!liveEditMode);
            }}
          />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No layout found
            </h3>
            <p className="text-gray-600 mb-4">
              Something went wrong loading your dashboard layout.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Dashboard
            </button>
          </div>
        )}

        {/* Click outside to close layout selector */}
        {showLayoutSelector && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowLayoutSelector(false)}
          />
        )}
      </div>
    </div>
  );
}