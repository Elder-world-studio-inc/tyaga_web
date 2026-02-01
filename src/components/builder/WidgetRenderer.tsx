import React from 'react';
import { WidgetInstance } from './types';

interface WidgetRendererProps {
  widget: WidgetInstance;
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  switch (widget.type) {
    case 'stat-card':
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-4 mt-auto">
             <div className="h-2 flex-1 bg-surface/20 rounded-full overflow-hidden">
                <div className="h-full w-[70%] bg-primary shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" />
             </div>
             <span className="text-sm text-primary-glow">70%</span>
          </div>
        </div>
      );
    case 'list-feed':
      return (
        <div className="h-full flex flex-col justify-center space-y-2">
           <div className="flex items-center justify-between text-sm text-text-muted">
              <span>Item 1</span>
              <span className="text-green-400">Active</span>
           </div>
           <div className="flex items-center justify-between text-sm text-text-muted">
              <span>Item 2</span>
              <span className="text-yellow-400">Pending</span>
           </div>
        </div>
      );
    case 'text-block':
        return (
            <div className="h-full text-text-muted text-sm overflow-y-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
        )
    default:
      return (
        <div className="h-full flex items-center justify-center text-text-muted/50 text-xs">
          {widget.type} content
        </div>
      );
  }
}
