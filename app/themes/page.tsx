"use client"

import themesRaw from "@/data/themes.json"
import { normalizeThemes } from "@/lib/theme-utils"
import ThemeExplorer from "@/components/ThemeExplorer"
import { TEXT } from "@/lib/i18n"
import { useSiteLanguage } from "@/lib/use-site-language"

export default function ThemesPage() {
  const lang = useSiteLanguage()
  const t = TEXT[lang]
  const themes = normalizeThemes(themesRaw)
  return (
    <main className="container">
      <h1>{t.galleryTitle}</h1>
      <p className="lead">{t.gallerySubtitle}</p>
      <ThemeExplorer themes={themes} />
    </main>
  )
}
