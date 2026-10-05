'use client';

import { useState, useEffect } from 'react';
import { Settings, ZoomIn, ZoomOut, Eye, Type, Minus, X } from 'lucide-react';
import Button from './ui/Button';
import { cn } from '@/lib/utils';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  increaseSpacing: boolean;
  dyslexiaFont: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  reduceMotion: false,
  increaseSpacing: false,
  dyslexiaFont: false,
};

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${settings.fontSize}%`;
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('reduce-motion', settings.reduceMotion);
    root.classList.toggle('increase-spacing', settings.increaseSpacing);
    root.classList.toggle('dyslexia-font', settings.dyslexiaFont);
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  const update = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) =>
    setSettings((p) => ({ ...p, [key]: value }));

  return (
    <>
      {/* Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        aria-label="Open accessibility settings"
        title="Accessibility Settings"
      >
        <Settings className="w-5 h-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} aria-hidden="true" />

          <div className="relative w-full sm:max-w-md max-h-[80vh] overflow-y-auto glass-strong rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fade-in-up">
            {/* Header */}
            <div className="sticky top-0 glass-strong flex items-center justify-between p-5 border-b border-white/20 rounded-t-3xl">
              <h2 id="accessibility-title" className="text-lg font-bold text-slate-800">
                Accessibility
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-indigo-50/50 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Font Size */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3">Text Size</h3>
                <div className="flex items-center justify-between bg-white/40 rounded-2xl p-2">
                  <button onClick={() => settings.fontSize > 80 && update('fontSize', settings.fontSize - 10)}
                    disabled={settings.fontSize <= 80}
                    className="p-2.5 rounded-xl hover:bg-white/60 disabled:opacity-40 transition-colors"
                    aria-label="Decrease text size">
                    <ZoomOut className="w-5 h-5 text-slate-600" />
                  </button>
                  <span className="text-sm font-bold text-slate-700" aria-live="polite">{settings.fontSize}%</span>
                  <button onClick={() => settings.fontSize < 150 && update('fontSize', settings.fontSize + 10)}
                    disabled={settings.fontSize >= 150}
                    className="p-2.5 rounded-xl hover:bg-white/60 disabled:opacity-40 transition-colors"
                    aria-label="Increase text size">
                    <ZoomIn className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-bold text-slate-700">Display Options</h3>
                <Toggle label="High Contrast" desc="Better visibility" icon={<Eye className="w-5 h-5" />}
                  checked={settings.highContrast} onChange={(c) => update('highContrast', c)} />
                <Toggle label="Reduce Motion" desc="Less animation" icon={<Minus className="w-5 h-5" />}
                  checked={settings.reduceMotion} onChange={(c) => update('reduceMotion', c)} />
                <Toggle label="Increase Spacing" desc="More room between elements" icon={<Type className="w-5 h-5" />}
                  checked={settings.increaseSpacing} onChange={(c) => update('increaseSpacing', c)} />
                <Toggle label="Dyslexia Font" desc="Easier reading" icon={<Type className="w-5 h-5" />}
                  checked={settings.dyslexiaFont} onChange={(c) => update('dyslexiaFont', c)} />
              </div>

              <div className="pt-4 border-t border-white/20">
                <Button variant="outline" onClick={() => setSettings(defaultSettings)} className="w-full">
                  Reset to Default
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Toggle({ label, desc, icon, checked, onChange }: {
  label: string; desc: string; icon: React.ReactNode; checked: boolean; onChange: (c: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-2xl bg-white/30 hover:bg-white/50 cursor-pointer transition-colors">
      <div className="text-slate-400">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className={cn('w-11 h-6 rounded-full transition-colors', checked ? 'bg-gradient-to-r from-indigo-500 to-cyan-500' : 'bg-slate-300')} />
        <div className={cn('absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', checked && 'translate-x-5')} />
      </div>
    </label>
  );
}
