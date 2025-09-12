import { useState, useRef, useCallback } from 'react';
import type { WidgetConfig } from '../../types/pageBuilder';
import { ResizableWidget } from './ResizableWidget';

interface CanvasLayoutEngineProps {
  widgets: WidgetConfig[];
  onUpdateLayout: (widgets: WidgetConfig[]) => void;
  onRemoveWidget: (id: string) => void;
  onConfigureWidget: (widget: WidgetConfig) => void;
  showGrid?: boolean;
}

export function CanvasLayoutEngine({
  widgets,
  onUpdateLayout,
  onRemoveWidget,
  onConfigureWidget,
  showGrid = true
}: CanvasLayoutEngineProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

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
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedWidget && (e.key === 'Delete' || e.key === 'Backspace')) {
      onRemoveWidget(selectedWidget);
      setSelectedWidget(null);
    }
  }, [selectedWidget, onRemoveWidget]);

  // Add keyboard event listener
  useState(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  // Grid pattern for background
  const GridPattern = () => {
    if (!showGrid) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern
              id="grid-pattern"
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
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className="relative bg-gray-50 min-h-screen overflow-hidden"
        style={{
          minHeight: '100vh',
          background: showGrid ? '#fafafa' : '#ffffff'
        }}
        onClick={handleCanvasClick}
      >
        {/* Grid Background */}
        <GridPattern />

        {/* Widgets */}
        {widgets.map((widget) => (
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
        ))}

        {/* Canvas Info */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm text-gray-600 shadow-sm">
          <div className="font-medium text-gray-900 mb-1">Canvas Dashboard</div>
          <div>{widgets.length} widget{widgets.length !== 1 ? 's' : ''}</div>
          {selectedWidget && (
            <div className="text-blue-600 mt-1">
              Selected: {widgets.find(w => w.id === selectedWidget)?.title}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-xs text-gray-500 shadow-sm max-w-sm">
          <div className="font-medium text-gray-700 mb-2">How to use:</div>
          <ul className="space-y-1">
            <li>• Click widgets to select them</li>
            <li>• Drag widgets to move them</li>
            <li>• Use corner/edge handles to resize</li>
            <li>• Press Delete to remove selected widget</li>
            <li>• Click empty space to deselect</li>
          </ul>
        </div>
      </div>
    </div>
  );
}