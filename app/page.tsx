"use client"

import Link from "next/link"
import themesRaw from "@/data/themes.json"
import { normalizeThemes } from "@/lib/theme-utils"
import ThemeCard from "@/components/ThemeCard"
import { TEXT } from "@/lib/i18n"
import { useSiteLanguage } from "@/lib/use-site-language"

export default function Home() {
  const lang = useSiteLanguage()
  const t = TEXT[lang]
  const themes = normalizeThemes(themesRaw).slice(0, 2)
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
      <h2 style={{ marginTop: 48 }}>{t.featured}</h2>
      <div className="grid">
        {themes.map((theme) => (
          <ThemeCard key={theme.id} item={theme} lang={lang} />
        ))}
      </div>
    </main>
  )
}
