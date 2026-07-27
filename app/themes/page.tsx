"use client"

import { normalizeThemes } from "@/lib/theme-utils"
import ThemeExplorer from "@/components/ThemeExplorer"
import { TEXT } from "@/lib/i18n"
import { useSiteLanguage } from "@/lib/use-site-language"
import { loadThemesFromFolders } from "@/data/themes/index"

export default function ThemesPage() {
  const lang = useSiteLanguage()
  const t = TEXT[lang]
  const themes = normalizeThemes(loadThemesFromFolders())
  return (
    <main className="container">
      <h1>{t.galleryTitle}</h1>
      <p className="lead">{t.gallerySubtitle}</p>
      <ThemeExplorer themes={themes} />
    </main>
  )
}
