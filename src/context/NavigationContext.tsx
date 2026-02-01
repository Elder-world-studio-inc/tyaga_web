import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ViewType = 'dashboard' | 'orchestrator' | 'agent-view' | 'settings';

export interface ViewState {
  id: string; // unique identifier for the view (e.g., 'home', 'marketing', 'agent-123')
  type: ViewType;
  title: string;
  data?: any; // For passing params like agentId
}

interface NavigationContextType {
  currentView: ViewState;
  navigateTo: (view: Partial<ViewState> & { id: string }) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const DEFAULT_VIEW: ViewState = {
  id: 'home',
  type: 'dashboard',
  title: 'Home',
};

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<ViewState[]>([DEFAULT_VIEW]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentView = history[currentIndex];

  const navigateTo = (view: Partial<ViewState> & { id: string }) => {
    const newView: ViewState = {
      type: 'dashboard', // default
      title: view.id.charAt(0).toUpperCase() + view.id.slice(1), // default title
      ...view,
    };

    // If navigating to the same view, do nothing (or maybe update data?)
    if (newView.id === currentView.id && JSON.stringify(newView.data) === JSON.stringify(currentView.data)) {
        return;
    }

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newView);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const canGoBack = currentIndex > 0;

  return (
    <NavigationContext.Provider value={{ currentView, navigateTo, goBack, canGoBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
