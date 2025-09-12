import { useState, useEffect } from 'react';
import { 
  Edit3, 
  Eye, 
  Save, 
  X, 
  Plus, 
  Settings as SettingsIcon,
  Undo,
  Redo
} from 'lucide-react';
import type { WidgetConfig, PageLayout, PageBuilderMode } from '../../types/pageBuilder';
import { DragDropLayoutEngine } from './DragDropLayoutEngine';
import { CanvasLayoutEngine } from './CanvasLayoutEngine';
import { LayoutEngine } from './LayoutEngine';
import { PixelLayoutEngine } from './PixelLayoutEngine';
import { WidgetPalette } from './WidgetPalette';
import { WidgetConfigPanel } from './WidgetConfigPanel';
import { GridToggle } from './GridOverlay';
import { getAllWidgetTypes } from './WidgetRegistry';

interface PageBuilderProps {
  layout: PageLayout;
  onSave: (layout: PageLayout) => void;
  onCancel?: () => void;
}

export function PageBuilder({ layout, onSave, onCancel }: PageBuilderProps) {
  const [mode, setMode] = useState<PageBuilderMode>({
    isEditing: true,
    showPreview: false
  });
  const [useCanvasMode, setUseCanvasMode] = useState(true);
  
  const [currentLayout, setCurrentLayout] = useState<PageLayout>(layout);
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null);
  const [showWidgetPalette, setShowWidgetPalette] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<PageLayout[]>([layout]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Save to history when layout changes
  const addToHistory = (newLayout: PageLayout) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...newLayout, lastUpdated: new Date().toISOString() });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevLayout = history[historyIndex - 1];
      setCurrentLayout(prevLayout);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextLayout = history[historyIndex + 1];
      setCurrentLayout(nextLayout);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const toggleMode = () => {
    setMode(prev => ({ ...prev, showPreview: !prev.showPreview }));
  };

  const addWidget = (widgetType: string) => {
    const widgetDefinition = getAllWidgetTypes().find(w => w.type === widgetType);
    if (!widgetDefinition) return;

    // Find an available position in the grid
    const findAvailablePosition = () => {
      if (useCanvasMode) {
        // In canvas mode, just place widgets at increasing offsets
        const offsetX = (currentLayout.widgets.length % 6) * 5;
        const offsetY = Math.floor(currentLayout.widgets.length / 6) * 5;
        return { x: offsetX, y: offsetY };
      }
      
      const occupiedPositions = new Set<string>();
      currentLayout.widgets.forEach(widget => {
        for (let y = widget.y; y < widget.y + widget.h; y++) {
          for (let x = widget.x; x < widget.x + widget.w; x++) {
            occupiedPositions.add(`${x}-${y}`);
          }
        }
      });

      // Find first available position that can fit the widget
      for (let y = 0; y < 100; y++) { // More rows for flexibility
        for (let x = 0; x <= 48 - widgetDefinition.defaultSize.w; x++) { // 48-column grid
          let canPlace = true;
          for (let dy = 0; dy < widgetDefinition.defaultSize.h; dy++) {
            for (let dx = 0; dx < widgetDefinition.defaultSize.w; dx++) {
              if (occupiedPositions.has(`${x + dx}-${y + dy}`)) {
                canPlace = false;
                break;
              }
            }
            if (!canPlace) break;
          }
          if (canPlace) return { x, y };
        }
      }
      return { x: 0, y: 0 }; // Fallback
    };

    const position = findAvailablePosition();
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: widgetDefinition.name,
      x: position.x,
      y: position.y,
      w: widgetDefinition.defaultSize.w,
      h: widgetDefinition.defaultSize.h,
      minW: widgetDefinition.minSize?.w,
      minH: widgetDefinition.minSize?.h,
      maxW: widgetDefinition.maxSize?.w,
      maxH: widgetDefinition.maxSize?.h,
      config: {}
    };

    const updatedLayout = {
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget]
    };

    setCurrentLayout(updatedLayout);
    addToHistory(updatedLayout);
    setShowWidgetPalette(false);
  };

  const removeWidget = (widgetId: string) => {
    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.filter(widget => widget.id !== widgetId)
    };

    setCurrentLayout(updatedLayout);
    addToHistory(updatedLayout);
    
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null);
      setShowConfigPanel(false);
    }
  };

  const updateLayout = (widgets: WidgetConfig[]) => {
    const updatedLayout = {
      ...currentLayout,
      widgets
    };

    setCurrentLayout(updatedLayout);
    addToHistory(updatedLayout);
  };

  const configureWidget = (widget: WidgetConfig) => {
    setSelectedWidget(widget);
    setShowConfigPanel(true);
  };

  const updateWidgetConfig = (widgetId: string, config: Record<string, any>) => {
    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, config } : widget
      )
    };

    setCurrentLayout(updatedLayout);
    addToHistory(updatedLayout);
  };

  const handleSave = () => {
    const finalLayout = {
      ...currentLayout,
      lastUpdated: new Date().toISOString()
    };
    onSave(finalLayout);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Page Builder</h1>
          <span className="text-sm text-gray-500">Editing: {currentLayout.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* History Controls */}
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="w-5 h-5" />
          </button>
          
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="w-5 h-5" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          {/* Canvas Mode Toggle */}
          <button
            onClick={() => setUseCanvasMode(!useCanvasMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              useCanvasMode 
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {useCanvasMode ? 'Canvas Mode' : 'Grid Mode'}
          </button>

          {/* Grid Toggle */}
          <GridToggle 
            onToggle={() => setShowGrid(!showGrid)}
            isVisible={showGrid}
          />
          
          {/* Add Widget */}
          <button
            onClick={() => setShowWidgetPalette(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Widget
          </button>
          
          {/* Preview Toggle */}
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {mode.showPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {mode.showPreview ? 'Edit' : 'Preview'}
          </button>
          
          {/* Save/Cancel */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-6">
          {mode.showPreview ? (
            useCanvasMode ? (
              <PixelLayoutEngine 
                widgets={currentLayout.widgets}
                isEditing={false}
              />
            ) : (
              <LayoutEngine 
                widgets={currentLayout.widgets}
                isEditing={false}
              />
            )
          ) : useCanvasMode ? (
            <CanvasLayoutEngine
              widgets={currentLayout.widgets}
              onUpdateLayout={updateLayout}
              onRemoveWidget={removeWidget}
              onConfigureWidget={configureWidget}
              showGrid={showGrid}
            />
          ) : (
            <DragDropLayoutEngine
              widgets={currentLayout.widgets}
              onUpdateLayout={updateLayout}
              onRemoveWidget={removeWidget}
              onConfigureWidget={configureWidget}
              showGrid={showGrid}
            />
          )}
        </div>
      </div>

      {/* Widget Palette Modal */}
      {showWidgetPalette && (
        <WidgetPalette
          onAddWidget={addWidget}
          onClose={() => setShowWidgetPalette(false)}
        />
      )}

      {/* Widget Configuration Panel */}
      {showConfigPanel && selectedWidget && (
        <WidgetConfigPanel
          widget={selectedWidget}
          onUpdateConfig={updateWidgetConfig}
          onClose={() => {
            setShowConfigPanel(false);
            setSelectedWidget(null);
          }}
        />
      )}
    </div>
  );
}