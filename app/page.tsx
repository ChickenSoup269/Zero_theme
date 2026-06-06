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
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="links">
            <Link className="btn" href="/themes">
              {t.openGallery}
            </Link>
            <Link className="btn" href="/docs">
              {t.docs}
            </Link>
          </div>
        </div>
        <div className="panel">
          <h2>{t.flow}</h2>
          <p>
            {t.flowText.split("\n").map((line, index) => (
              <span key={line}>
                {line}
                {index < t.flowText.split("\n").length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
          <Link className="btn vote" href="/themes">
            {t.voteAll}
          </Link>
        </div>
      </section>
      <section className="home-summary-strip">
        <div>
          <strong>{themes.length}</strong>
          <span>{lang === "vi" ? "theme đang có" : "themes available"}</span>
        </div>
        <div>
          <strong>JSON / Code</strong>
          <span>{lang === "vi" ? "tải file hoặc copy mã áp" : "download files or copy apply code"}</span>
        </div>
        <div>
          <strong>Live Wallpaper</strong>
          <span>{lang === "vi" ? "sẵn cấu trúc để mở rộng" : "ready for expansion"}</span>
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
                style={preview ? { backgroundImage: `url(${preview})` } : undefined}
              >
                <span className="rank-badge">Top {index + 1}</span>
                <span className="home-top-type">
                  {formatTagLabel(theme.type, lang)}
                </span>
                <strong>{theme.title}</strong>
                {theme.author ? (
                  <em>
                    {t.authorLabel}: {theme.author}
                  </em>
                ) : null}
                {theme.description ? <span>{theme.description}</span> : null}
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
