'use client';

import { useEffect, useState } from 'react';
import { Lang, TEXT } from '@/lib/i18n';

type ThemeMode = 'light' | 'dark';

export default function SiteControls() {
  const [lang, setLang] = useState<Lang>('vi');
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [primary, setPrimary] = useState('#22c55e');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('zero-lang') as Lang) || 'vi';
    const savedMode = (localStorage.getItem('zero-theme-mode') as ThemeMode) || 'dark';
    const savedPrimary = localStorage.getItem('zero-primary-color') || '#22c55e';
    setLang(savedLang === 'en' ? 'en' : 'vi');
    setMode(savedMode === 'light' ? 'light' : 'dark');
    setPrimary(savedPrimary);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty('--primary', primary);
    localStorage.setItem('zero-primary-color', primary);
  }, [primary, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    localStorage.setItem('zero-lang', lang);
    window.dispatchEvent(new CustomEvent('zero-lang-change', { detail: lang }));
  }, [lang, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.theme = mode;
    localStorage.setItem('zero-theme-mode', mode);
  }, [mode, mounted]);

  if (!mounted) return <div className="site-controls-placeholder" />;

  const t = TEXT[lang];

  const presets = [
    { name: 'Green', color: '#22c55e' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Purple', color: '#a855f7' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Pink', color: '#ec4899' },
  ];

  return (
    <div className="site-controls" aria-label="site controls">
      <div className="control-group accent-picker">
        {presets.map((p) => (
          <button
            key={p.color}
            className={`control-btn dot ${primary === p.color ? 'active' : ''}`}
            onClick={() => setPrimary(p.color)}
            style={{ '--dot-color': p.color } as any}
            title={p.name}
          />
        ))}
        <div className="custom-color-wrapper">
          <input
            type="color"
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
            title="Custom color"
          />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </div>
      </div>

      <div className="control-group">
        <button 
          type="button"
          className={`control-btn ${lang === 'vi' ? 'active' : ''}`}
          onClick={() => setLang('vi')}
          title="Tiếng Việt"
        >
          VN
        </button>
        <button 
          type="button"
          className={`control-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => setLang('en')}
          title="English"
        >
          EN
        </button>
      </div>

      <div className="control-group">
        <button 
          type="button"
          className={`control-btn ${mode === 'dark' ? 'active' : ''}`}
          onClick={() => setMode('dark')}
          title={t.dark}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
        <button 
          type="button"
          className={`control-btn ${mode === 'light' ? 'active' : ''}`}
          onClick={() => setMode('light')}
          title={t.light}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>
      </div>
    </div>
  );
}
