import type { WidgetConfig } from '../../types/pageBuilder';
import { getWidgetDefinition } from './WidgetRegistry';

interface PixelLayoutEngineProps {
  widgets: WidgetConfig[];
  isEditing?: boolean;
  onWidgetClick?: (widget: WidgetConfig) => void;
}

export function PixelLayoutEngine({ widgets, isEditing = false, onWidgetClick }: PixelLayoutEngineProps) {
  
  return (
    <div className="relative bg-gray-50 min-h-screen overflow-hidden">
      {widgets.map((widget) => {
        const definition = getWidgetDefinition(widget.type);
        
        if (!definition) {
          return (
            <div
              key={widget.id}
              className="absolute bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center"
              style={{
                left: widget.x * 20,
                top: widget.y * 20,
                width: widget.w * 20,
                height: widget.h * 20,
              }}
            >
              <span className="text-red-600">Unknown widget: {widget.type}</span>
            </div>
          );
        }

        const WidgetComponent = definition.component;
        
        // Convert grid coordinates to pixel coordinates
        const pixelX = widget.x * 20;
        const pixelY = widget.y * 20;
        const pixelWidth = widget.w * 20;
        const pixelHeight = widget.h * 20;

        return (
          <div
            key={widget.id}
            className={`absolute ${isEditing ? 'cursor-pointer' : ''}`}
            style={{
              left: pixelX,
              top: pixelY,
              width: pixelWidth,
              height: pixelHeight,
            }}
            onClick={() => isEditing && onWidgetClick?.(widget)}
          >
            <WidgetComponent
              {...widget.config}
              width={widget.w}
              height={widget.h}
              isEditing={false} // Always show real content in preview
            />
          </div>
        );
      })}
    </div>
  );
}