import React from 'react';
import { WIDGET_REGISTRY, WidgetType } from './types';
import { GripVertical } from 'lucide-react';

export function WidgetPalette() {
  const handleDragStart = (e: React.DragEvent, type: WidgetType) => {
    e.dataTransfer.setData('widgetType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-64 bg-surface/5 border-l border-text-main/10 p-4 flex flex-col h-full overflow-y-auto">
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
        Widgets
      </h3>
      <div className="space-y-3">
        {WIDGET_REGISTRY.map((widget) => (
          <div
            key={widget.type}
            draggable
            onDragStart={(e) => handleDragStart(e, widget.type)}
            className="flex items-center gap-3 p-3 rounded-xl bg-surface/10 border border-text-main/10 cursor-grab hover:bg-surface/20 active:cursor-grabbing transition-all hover:border-primary/50 group"
          >
            <div className="p-2 rounded-lg bg-background text-primary group-hover:text-primary-glow">
              {widget.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-text-main">{widget.label}</div>
              <div className="text-xs text-text-muted">
                {widget.defaultSize.w}x{widget.defaultSize.h} Units
              </div>
            </div>
            <GripVertical size={16} className="text-text-muted/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
