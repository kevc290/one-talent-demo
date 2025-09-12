import { useMemo } from 'react';
import type { WidgetConfig } from '../../types/pageBuilder';
import { getWidgetDefinition } from './WidgetRegistry';

interface LayoutEngineProps {
  widgets: WidgetConfig[];
  isEditing?: boolean;
  onWidgetClick?: (widget: WidgetConfig) => void;
}

export function LayoutEngine({ widgets, isEditing = false, onWidgetClick }: LayoutEngineProps) {
  const sortedWidgets = useMemo(() => {
    // Sort widgets by position (y first, then x)
    return [...widgets].sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });
  }, [widgets]);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(48, 1fr)', // 48 columns for fine-grained control
    gap: '0.5rem', // Smaller gap for better space utilization
    width: '100%',
  };

  return (
    <div style={gridStyle} className="min-h-screen">
      {sortedWidgets.map((widget) => {
        const definition = getWidgetDefinition(widget.type);
        
        if (!definition) {
          return (
            <div
              key={widget.id}
              style={{
                gridColumn: `${widget.x + 1} / span ${widget.w}`,
                gridRow: `${widget.y + 1} / span ${widget.h}`,
              }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center"
            >
              <span className="text-red-600">Unknown widget: {widget.type}</span>
            </div>
          );
        }

        const WidgetComponent = definition.component;

        return (
          <div
            key={widget.id}
            style={{
              gridColumn: `${widget.x + 1} / span ${widget.w}`,
              gridRow: `${widget.y + 1} / span ${widget.h}`,
            }}
            className={`${isEditing ? 'cursor-pointer' : ''}`}
            onClick={() => isEditing && onWidgetClick?.(widget)}
          >
            <WidgetComponent
              {...widget.config}
              width={widget.w}
              height={widget.h}
              isEditing={isEditing}
            />
          </div>
        );
      })}
    </div>
  );
}