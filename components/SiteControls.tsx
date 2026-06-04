'use client';

import { useEffect, useState } from 'react';
import { Lang, TEXT } from '@/lib/i18n';

type ThemeMode = 'light' | 'dark';

export default function SiteControls() {
  const [lang, setLang] = useState<Lang>('vi');
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const savedLang = (localStorage.getItem('zero-lang') as Lang) || 'vi';
    const savedMode = (localStorage.getItem('zero-theme-mode') as ThemeMode) || 'dark';
    setLang(savedLang === 'en' ? 'en' : 'vi');
    setMode(savedMode === 'light' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    localStorage.setItem('zero-lang', lang);
    window.dispatchEvent(new CustomEvent('zero-lang-change', { detail: lang }));
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem('zero-theme-mode', mode);
  }, [mode]);

  const t = TEXT[lang];

  return (
    <div className="site-controls" aria-label="site controls">
      <label>
        <span>{t.language}</span>
        <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </label>
      <label>
        <span>{t.appearance}</span>
        <select value={mode} onChange={(e) => setMode(e.target.value as ThemeMode)}>
          <option value="dark">{t.dark}</option>
          <option value="light">{t.light}</option>
        </select>
      </label>
    </div>
  );
}
