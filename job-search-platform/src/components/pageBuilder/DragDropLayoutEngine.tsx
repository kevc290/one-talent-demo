import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Settings } from 'lucide-react';
import type { WidgetConfig } from '../../types/pageBuilder';
import { getWidgetDefinition } from './WidgetRegistry';
import { GridOverlay } from './GridOverlay';

interface SortableWidgetProps {
  widget: WidgetConfig;
  onRemove: (id: string) => void;
  onConfigure: (widget: WidgetConfig) => void;
}

function SortableWidget({ widget, onRemove, onConfigure }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const definition = getWidgetDefinition(widget.type);
  
  if (!definition) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center"
      >
        <span className="text-red-600">Unknown widget: {widget.type}</span>
      </div>
    );
  }

  const WidgetComponent = definition.component;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        gridColumn: `span ${widget.w}`,
        minHeight: `${widget.h * 4}rem`,
      }}
      className="relative group"
      {...attributes}
      {...listeners}
    >
      <WidgetComponent
        {...widget.config}
        isEditing={true}
      />
      
      {/* Widget Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfigure(widget);
          }}
          className="bg-white shadow-lg rounded p-1 hover:bg-gray-50"
          title="Configure widget"
        >
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(widget.id);
          }}
          className="bg-white shadow-lg rounded p-1 hover:bg-red-50"
          title="Remove widget"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}

interface DragDropLayoutEngineProps {
  widgets: WidgetConfig[];
  onUpdateLayout: (widgets: WidgetConfig[]) => void;
  onRemoveWidget: (id: string) => void;
  onConfigureWidget: (widget: WidgetConfig) => void;
  showGrid?: boolean;
}

export function DragDropLayoutEngine({ 
  widgets, 
  onUpdateLayout, 
  onRemoveWidget,
  onConfigureWidget,
  showGrid = true
}: DragDropLayoutEngineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((widget) => widget.id === active.id);
      const newIndex = widgets.findIndex((widget) => widget.id === over.id);
      
      const newWidgets = [...widgets];
      const [movedWidget] = newWidgets.splice(oldIndex, 1);
      newWidgets.splice(newIndex, 0, movedWidget);
      
      onUpdateLayout(newWidgets);
    }
    
    setActiveId(null);
  };

  const activeWidget = widgets.find((widget) => widget.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative">
        <div className="grid gap-2 min-h-screen" style={{ gridTemplateColumns: 'repeat(48, 1fr)' }}>
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            {widgets.map((widget) => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                onRemove={onRemoveWidget}
                onConfigure={onConfigureWidget}
              />
            ))}
          </SortableContext>
        </div>
        
        {/* Grid Overlay */}
        {showGrid && (
          <GridOverlay columns={48} rows={50} show={true} />
        )}
      </div>

      <DragOverlay>
        {activeWidget && (
          <div className="opacity-80">
            {(() => {
              const definition = getWidgetDefinition(activeWidget.type);
              if (!definition) return <div>Unknown widget</div>;
              const WidgetComponent = definition.component;
              return <WidgetComponent {...activeWidget.config} width={activeWidget.w} height={activeWidget.h} isEditing={true} />;
            })()}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}