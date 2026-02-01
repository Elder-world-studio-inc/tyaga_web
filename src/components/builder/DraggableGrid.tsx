import React from 'react';
import { WidgetInstance, WIDGET_REGISTRY } from './types';
import { WidgetRenderer } from './WidgetRenderer';
import { X, GripHorizontal } from 'lucide-react';
import { clsx } from 'clsx';

interface DraggableGridProps {
  widgets: WidgetInstance[];
  isEditMode: boolean;
  onAddWidget: (type: string) => void;
  onRemoveWidget: (id: string) => void;
}

export function DraggableGrid({ widgets, isEditMode, onAddWidget, onRemoveWidget }: DraggableGridProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData('widgetType');
    if (widgetType) {
      onAddWidget(widgetType);
    }
  };

  return (
    <div 
      className={clsx(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px] transition-all rounded-2xl",
        isEditMode && "border-2 border-dashed border-text-main/20 bg-surface/5 p-6"
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {widgets.map((widget) => {
        const def = WIDGET_REGISTRY.find(w => w.type === widget.type);
        const colSpan = def?.defaultSize.w === 2 ? 'md:col-span-2' : 'col-span-1';
        const rowSpan = def?.defaultSize.h === 2 ? 'row-span-2' : 'row-span-1';

        return (
          <div
            key={widget.id}
            className={clsx(
              "glass-panel rounded-2xl p-6 relative group transition-all duration-200",
              colSpan,
              rowSpan,
              isEditMode ? "border-primary/30 hover:border-primary cursor-grab active:cursor-grabbing" : "hover:bg-surface/10"
            )}
            draggable={isEditMode}
          >
            <div className="flex justify-between items-start mb-4">
               <h3 className="text-lg font-medium text-text-main">{widget.title}</h3>
               {isEditMode && (
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     onRemoveWidget(widget.id);
                   }}
                   className="p-1 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                 >
                   <X size={14} />
                 </button>
               )}
            </div>
            
            <div className="flex-1 min-h-[100px]">
                <WidgetRenderer widget={widget} />
            </div>

            {isEditMode && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-text-muted/20">
                    <GripHorizontal size={20} />
                </div>
            )}
          </div>
        );
      })}
      
      {isEditMode && widgets.length === 0 && (
        <div className="col-span-full h-64 flex flex-col items-center justify-center text-text-muted border-2 border-dashed border-text-main/10 rounded-xl">
          <p>Drag widgets here from the palette</p>
        </div>
      )}
    </div>
  );
}
