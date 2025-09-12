import { useState, useRef, useCallback } from 'react';
import { Settings, Trash2, Edit3, Plus } from 'lucide-react';
import type { WidgetConfig } from '../../types/pageBuilder';
import { ResizableWidget } from './ResizableWidget';
import { widgetRegistry } from './WidgetRegistry';

interface LiveEditingEngineProps {
  widgets: WidgetConfig[];
  onUpdateLayout: (widgets: WidgetConfig[]) => void;
  onRemoveWidget: (id: string) => void;
  onConfigureWidget: (widget: WidgetConfig) => void;
  showGrid?: boolean;
  isEditMode: boolean;
  onToggleEdit: () => void;
}

export function LiveEditingEngine({
  widgets,
  onUpdateLayout,
  onRemoveWidget,
  onConfigureWidget,
  showGrid = true,
  isEditMode,
  onToggleEdit
}: LiveEditingEngineProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [showAddWidget, setShowAddWidget] = useState(false);

  const handleWidgetMove = useCallback((id: string, position: { x: number; y: number }) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === id ? { ...widget, x: position.x, y: position.y } : widget
    );
    onUpdateLayout(updatedWidgets);
  }, [widgets, onUpdateLayout]);

  const handleWidgetResize = useCallback((id: string, bounds: { x: number; y: number; width: number; height: number }) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === id ? { 
        ...widget, 
        x: bounds.x, 
        y: bounds.y, 
        w: bounds.width, 
        h: bounds.height 
      } : widget
    );
    onUpdateLayout(updatedWidgets);
  }, [widgets, onUpdateLayout]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedWidget(null);
      setShowAddWidget(false);
    }
  }, []);

  const handleAddWidget = (type: string) => {
    const definition = widgetRegistry[type];
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type,
      title: definition?.name || 'New Widget',
      x: 2,
      y: 2,
      w: 12,
      h: 8,
      config: {}
    };
    
    onUpdateLayout([...widgets, newWidget]);
    setShowAddWidget(false);
  };

  // Grid pattern for background
  const GridPattern = () => {
    if (!showGrid || !isEditMode) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern
              id="live-grid-pattern"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="0.5"
                transform="scale(5)"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#live-grid-pattern)" />
        </svg>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Edit Mode Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={onToggleEdit}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
            isEditMode 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          {isEditMode ? 'Exit Edit' : 'Edit Dashboard'}
        </button>
      </div>

      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className={`relative min-h-screen overflow-hidden transition-colors ${
          isEditMode ? 'bg-gray-50' : 'bg-white'
        }`}
        onClick={handleCanvasClick}
      >
        {/* Grid Background - Only in edit mode */}
        <GridPattern />

        {/* Widgets */}
        {widgets.map((widget) => (
          isEditMode ? (
            <ResizableWidget
              key={widget.id}
              widget={widget}
              onMove={handleWidgetMove}
              onResize={handleWidgetResize}
              onRemove={onRemoveWidget}
              onConfigure={onConfigureWidget}
              isSelected={selectedWidget === widget.id}
              onSelect={setSelectedWidget}
            />
          ) : (
            <StaticWidget key={widget.id} widget={widget} />
          )
        ))}

        {/* Edit Mode Indicator and Add Widget Button */}
        {isEditMode && (
          <div className="fixed bottom-4 left-4 flex flex-col gap-3">
            {/* Add Widget Button - Now on top */}
            <button
              onClick={() => setShowAddWidget(!showAddWidget)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Widget</span>
            </button>
            
            {/* Edit Mode Indicator - Now on bottom */}
            <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">Edit Mode Active</span>
              </div>
            </div>
          </div>
        )}

        {/* Widget Selector Dropdown */}
        {showAddWidget && isEditMode && (
          <div className="fixed bottom-32 left-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[200px]">
            <h3 className="font-medium text-gray-900 mb-3">Select Widget Type</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(widgetRegistry).map(([key, definition]) => (
                <button
                  key={key}
                  onClick={() => handleAddWidget(key)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded transition-colors"
                >
                  <div className="font-medium text-gray-900">{definition.name}</div>
                  <div className="text-sm text-gray-500">{definition.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Instructions - Only in edit mode */}
        {isEditMode && (
          <div className="fixed bottom-4 right-4 bg-white bg-opacity-95 rounded-lg p-3 text-xs text-gray-600 shadow-lg max-w-sm">
            <div className="font-medium text-gray-800 mb-2">Live Editing Active:</div>
            <ul className="space-y-1">
              <li>• Click widgets to select and edit</li>
              <li>• Drag to move, resize with handles</li>
              <li>• Changes are instant and live</li>
              <li>• Click "Exit Edit" to finish</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Static widget component for view mode
function StaticWidget({ widget }: { widget: WidgetConfig }) {
  const definition = getWidgetDefinition(widget.type);
  
  if (!definition) return null;

  const WidgetComponent = definition.component;
  
  return (
    <div
      className="absolute"
      style={{
        left: widget.x * 20,
        top: widget.y * 20,
        width: widget.w * 20,
        height: widget.h * 20,
      }}
    >
      <WidgetComponent
        {...widget.config}
        width={widget.w}
        height={widget.h}
        widgetId={widget.id}
        isEditing={false}
      />
    </div>
  );
}

// Import getWidgetDefinition
import { getWidgetDefinition } from './WidgetRegistry';