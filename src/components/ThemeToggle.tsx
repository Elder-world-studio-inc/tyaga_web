import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function ThemeToggle() {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "p-3 rounded-xl transition-all",
          isOpen 
            ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--color-primary),0.2)]" 
            : "text-text-muted hover:text-text-main hover:bg-surface/10"
        )}
        title="Change Theme"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="absolute left-full top-0 ml-2 w-48 py-2 rounded-xl border border-white/10 glass-panel shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
            Select Theme
          </div>
          {availableThemes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setIsOpen(false);
              }}
              className={twMerge(
                "w-full flex items-center justify-between px-4 py-2 text-sm transition-colors",
                theme === t.id
                  ? "bg-primary/20 text-text-main"
                  : "text-text-muted hover:bg-surface/10 hover:text-text-main"
              )}
            >
              <span>{t.name}</span>
              {theme === t.id && <Check size={16} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
