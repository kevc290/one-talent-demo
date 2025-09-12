import { X } from 'lucide-react';
import { getAllWidgetTypes } from './WidgetRegistry';

interface WidgetPaletteProps {
  onAddWidget: (type: string) => void;
  onClose: () => void;
}

export function WidgetPalette({ onAddWidget, onClose }: WidgetPaletteProps) {
  const widgets = getAllWidgetTypes();

  const widgetCategories = {
    'Content': widgets.filter(w => w.type.startsWith('hubspot')),
    'Dashboard': widgets.filter(w => ['saved-jobs', 'recent-applications', 'profile-overview', 'stat-card'].includes(w.type)),
    'Navigation': widgets.filter(w => w.type === 'quick-links'),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add Widget</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {Object.entries(widgetCategories).map(([category, categoryWidgets]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{category} Widgets</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categoryWidgets.map((widget) => {
                  const IconComponent = widget.icon;
                  
                  return (
                    <button
                      key={widget.type}
                      onClick={() => onAddWidget(widget.type)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100">
                          <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">{widget.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{widget.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        Size: {widget.defaultSize.w} × {widget.defaultSize.h}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}