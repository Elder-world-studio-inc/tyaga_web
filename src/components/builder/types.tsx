import React from 'react';
import { BarChart, Activity, Calendar, List, PieChart, Type } from 'lucide-react';

export type WidgetType = 'stat-card' | 'chart-bar' | 'chart-pie' | 'list-feed' | 'text-block';

export interface WidgetDefinition {
  type: WidgetType;
  label: string;
  icon: React.ReactNode;
  defaultSize: { w: number; h: number }; // In grid units (e.g., 1x1, 2x1)
}

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  title: string;
  data?: any;
}

export const WIDGET_REGISTRY: WidgetDefinition[] = [
  {
    type: 'stat-card',
    label: 'Stat Card',
    icon: <Activity size={20} />,
    defaultSize: { w: 1, h: 1 }
  },
  {
    type: 'chart-bar',
    label: 'Bar Chart',
    icon: <BarChart size={20} />,
    defaultSize: { w: 2, h: 2 }
  },
  {
    type: 'chart-pie',
    label: 'Pie Chart',
    icon: <PieChart size={20} />,
    defaultSize: { w: 1, h: 2 }
  },
  {
    type: 'list-feed',
    label: 'Activity Feed',
    icon: <List size={20} />,
    defaultSize: { w: 1, h: 2 }
  },
  {
    type: 'text-block',
    label: 'Text Block',
    icon: <Type size={20} />,
    defaultSize: { w: 2, h: 1 }
  }
];
