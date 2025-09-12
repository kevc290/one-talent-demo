import { useState, useRef, useCallback, useEffect } from 'react';
import { Settings, Trash2, Move } from 'lucide-react';
import type { WidgetConfig } from '../../types/pageBuilder';
import { getWidgetDefinition } from './WidgetRegistry';

interface ResizableWidgetProps {
  widget: WidgetConfig;
  onResize: (id: string, bounds: { x: number; y: number; width: number; height: number }) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onRemove: (id: string) => void;
  onConfigure: (widget: WidgetConfig) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

export function ResizableWidget({
  widget,
  onResize,
  onMove,
  onRemove,
  onConfigure,
  isSelected,
  onSelect
}: ResizableWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, widgetX: 0, widgetY: 0 });
  const [resizeStart, setResizeStart] = useState({ 
    x: 0, y: 0, 
    width: 0, height: 0, 
    widgetX: 0, widgetY: 0 
  });

  // Convert grid coordinates to pixel coordinates (approximate)
  const pixelX = widget.x * 20; // Rough conversion from grid to pixels
  const pixelY = widget.y * 20;
  const pixelWidth = widget.w * 20;
  const pixelHeight = widget.h * 20;

  const definition = getWidgetDefinition(widget.type);
  if (!definition) return null;

  const WidgetComponent = definition.component;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.draggable === 'true') {
      e.preventDefault();
      e.stopPropagation();
      onSelect(widget.id);
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        widgetX: pixelX,
        widgetY: pixelY
      });
    }
  }, [widget.id, pixelX, pixelY, onSelect]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(widget.id);
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: pixelWidth,
      height: pixelHeight,
      widgetX: pixelX,
      widgetY: pixelY
    });
  }, [widget.id, pixelX, pixelY, pixelWidth, pixelHeight, onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      const newX = Math.max(0, dragStart.widgetX + deltaX);
      const newY = Math.max(0, dragStart.widgetY + deltaY);
      
      onMove(widget.id, { x: Math.round(newX / 20), y: Math.round(newY / 20) });
    } else if (isResizing && resizeHandle) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newX = resizeStart.widgetX;
      let newY = resizeStart.widgetY;
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;

      // Handle different resize directions
      if (resizeHandle.includes('w')) {
        newX = resizeStart.widgetX + deltaX;
        newWidth = resizeStart.width - deltaX;
      }
      if (resizeHandle.includes('e')) {
        newWidth = resizeStart.width + deltaX;
      }
      if (resizeHandle.includes('n')) {
        newY = resizeStart.widgetY + deltaY;
        newHeight = resizeStart.height - deltaY;
      }
      if (resizeHandle.includes('s')) {
        newHeight = resizeStart.height + deltaY;
      }

      // Minimum size constraints
      newWidth = Math.max(100, newWidth);
      newHeight = Math.max(40, newHeight);
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      onResize(widget.id, {
        x: Math.round(newX / 20),
        y: Math.round(newY / 20),
        width: Math.round(newWidth / 20),
        height: Math.round(newHeight / 20)
      });
    }
  }, [isDragging, isResizing, resizeHandle, dragStart, resizeStart, widget.id, onMove, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const renderResizeHandles = () => {
    if (!isSelected) return null;

    const handles: { handle: ResizeHandle; className: string; cursor: string }[] = [
      { handle: 'nw', className: 'top-0 left-0 -translate-x-1 -translate-y-1', cursor: 'nw-resize' },
      { handle: 'ne', className: 'top-0 right-0 translate-x-1 -translate-y-1', cursor: 'ne-resize' },
      { handle: 'sw', className: 'bottom-0 left-0 -translate-x-1 translate-y-1', cursor: 'sw-resize' },
      { handle: 'se', className: 'bottom-0 right-0 translate-x-1 translate-y-1', cursor: 'se-resize' },
      { handle: 'n', className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1', cursor: 'n-resize' },
      { handle: 's', className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1', cursor: 's-resize' },
      { handle: 'w', className: 'top-1/2 left-0 -translate-x-1 -translate-y-1/2', cursor: 'w-resize' },
      { handle: 'e', className: 'top-1/2 right-0 translate-x-1 -translate-y-1/2', cursor: 'e-resize' },
    ];

    return (
      <>
        {handles.map(({ handle, className, cursor }) => (
          <div
            key={handle}
            className={`absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-sm shadow-md ${className}`}
            style={{ cursor }}
            onMouseDown={(e) => handleResizeMouseDown(e, handle)}
          />
        ))}
      </>
    );
  };

  return (
    <div
      ref={widgetRef}
      className={`absolute select-none group ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${isDragging || isResizing ? 'z-50' : 'z-10'}`}
      style={{
        left: pixelX,
        top: pixelY,
        width: pixelWidth,
        height: pixelHeight,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onClick={() => onSelect(widget.id)}
    >
      {/* Widget Content */}
      <div className="w-full h-full pointer-events-none">
        <WidgetComponent
          {...widget.config}
          width={widget.w}
          height={widget.h}
          widgetId={widget.id}
          isEditing={false} // Show real content, not editing overlay
        />
      </div>

      {/* Selection Border */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 pointer-events-none" />
      )}

      {/* Resize Handles */}
      {renderResizeHandles()}

      {/* Widget Controls */}
      {isSelected && (
        <div className="absolute -top-8 left-0 flex gap-1 bg-white rounded shadow-lg border p-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfigure(widget);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Configure widget"
          >
            <Settings className="w-3 h-3 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(widget.id);
            }}
            className="p-1 hover:bg-red-50 rounded"
            title="Remove widget"
          >
            <Trash2 className="w-3 h-3 text-red-600" />
          </button>
          <div className="w-px bg-gray-300 mx-1" />
          <div 
            className="p-1 cursor-grab active:cursor-grabbing"
            data-draggable="true"
            title="Drag to move"
          >
            <Move className="w-3 h-3 text-gray-600" />
          </div>
        </div>
      )}

      {/* Widget Type Badge */}
      {isSelected && (
        <div className="absolute -bottom-6 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          {definition.name} ({pixelWidth}×{pixelHeight})
        </div>
      )}
    </div>
  );
}