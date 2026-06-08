"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import themesRaw from "@/data/themes.json"
import { formatTagLabel, getPreviewImage, normalizeThemes } from "@/lib/theme-utils"
import { TEXT } from "@/lib/i18n"
import { useSiteLanguage } from "@/lib/use-site-language"
import {
  getLocalVotedIds,
  isFirebaseConfigured,
  listenThemeStats,
  ThemeStats,
} from "@/lib/firebase-votes"

export default function Home() {
  const lang = useSiteLanguage()
  const t = TEXT[lang]
  const themes = useMemo(() => normalizeThemes(themesRaw), [])
  const [themeStats, setThemeStats] = useState<ThemeStats>({})
  const [localVotes, setLocalVotes] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setLocalVotes(getLocalVotedIds())
    const unsubscribe = listenThemeStats(setThemeStats)
    return unsubscribe
  }, [])

  function voteCount(themeId: string) {
    if (isFirebaseConfigured) return Number(themeStats[themeId]?.votes ?? 0)
    return localVotes[themeId] ? 1 : 0
  }

  const topThemes = themes
    .map((theme, index) => ({ theme, index, votes: voteCount(theme.id) }))
    .sort(
      (a, b) =>
        b.votes - a.votes ||
        Number(b.theme.favoriteCount ?? 0) - Number(a.theme.favoriteCount ?? 0) ||
        a.index - b.index,
    )
    .slice(0, 3)
  return (
    <main className="container">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-decor">
            <img src="/images/svg_wave/wave1.png" alt="" className="wave wave-1" />
            <img src="/images/svg_wave/wave2.png" alt="" className="wave wave-2" />
          </div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="links">
            <Link className="btn primary big" href="/themes">
              {t.openGallery}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>
            <Link className="btn ghost big" href="/docs">
              {t.docs}
            </Link>
          </div>
        </div>
        <div className="panel">
          <div className="theme-modal-kicker">{lang === "vi" ? "Bắt đầu ngay" : "Get Started"}</div>
          <h2>{t.flow}</h2>
          <p>
            {t.flowText.split("\n").map((line, index) => (
              <span key={line} style={{ display: 'block', marginBottom: '8px' }}>
                <strong style={{ color: 'var(--accent)', marginRight: '8px' }}>{index + 1}.</strong>
                {line.replace(/^\d+\.\s*/, '')}
              </span>
            ))}
          </p>
          <Link className="btn vote" href="/themes" style={{ width: '100%' }}>
            {t.voteAll}
          </Link>
        </div>
      </section>

      <section className="home-summary-strip">
        <div>
          <div className="icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <strong>{themes.length}</strong>
          <span>{lang === "vi" ? "theme đang có sẵn trong kho" : "themes available in the gallery"}</span>
        </div>
        <div>
          <div className="icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <strong>JSON / Code</strong>
          <span>{lang === "vi" ? "tải file JSON hoặc copy mã áp nhanh" : "download JSON files or copy apply code"}</span>
        </div>
        <div>
          <div className="icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
          </div>
          <strong>Live Wallpaper</strong>
          <span>{lang === "vi" ? "hỗ trợ video và hình nền động" : "video and live wallpaper support"}</span>
        </div>
      </section>

      <section className="home-top-section">
        <div className="section-heading">
          <div>
            <p className="theme-modal-kicker">
              {lang === "vi" ? "Bảng xếp hạng" : "Ranking"}
            </p>
            <h2>{t.featured}</h2>
          </div>
          <Link className="btn ghost" href="/themes">
            {t.openGallery}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="home-top-grid">
          {topThemes.map(({ theme }, index) => {
            const preview = getPreviewImage(theme)
            return (
              <Link
                className={`home-top-card rank-${index + 1}`}
                href="/themes"
                key={theme.id}
              >
                <div className="card-bg">
                  {preview ? (
                    <img src={preview} alt="" loading="lazy" />
                  ) : (
                    <div className="placeholder-bg" />
                  )}
                </div>
                <div className="card-overlay" />
                <div className="card-content">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: 'auto' }}>
                    <span className="rank-badge">Top {index + 1}</span>
                    <span className="home-top-type">
                      {formatTagLabel(theme.type, lang)}
                    </span>
                  </div>
                  <strong>{theme.title}</strong>
                  {theme.author ? (
                    <em>
                      {t.authorLabel}: {theme.author}
                    </em>
                  ) : null}
                  {theme.description ? <span>{theme.description}</span> : null}
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
