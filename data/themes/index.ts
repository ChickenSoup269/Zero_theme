import { normalizeThemes } from "@/lib/theme-utils"
import type { ThemeItem } from "@/lib/types"
import wallpaper01 from "./wallpaper-01.json"
import wallpaper02 from "./wallpaper-02.json"
import wallpaper03 from "./wallpaper-03.json"
import wallpaper04 from "./wallpaper-04.json"
import wallpaper05 from "./wallpaper-05.json"
import wallpaper06 from "./wallpaper-06.json"
import wallpaper07 from "./wallpaper-07.json"
import wallpaper08 from "./wallpaper-08.json"
import wallpaper09 from "./wallpaper-09.json"
import wallpaper10 from "./wallpaper-10.json"
import waveSvg01 from "./wave-svg-01.json"
import waveSvg02 from "./wave-svg-02.json"

const themeEntries: ThemeItem[] = [
  ...normalizeThemes(wallpaper01),
  ...normalizeThemes(wallpaper02),
  ...normalizeThemes(wallpaper03),
  ...normalizeThemes(wallpaper04),
  ...normalizeThemes(wallpaper05),
  ...normalizeThemes(wallpaper06),
  ...normalizeThemes(wallpaper07),
  ...normalizeThemes(wallpaper08),
  ...normalizeThemes(wallpaper09),
  ...normalizeThemes(wallpaper10),
  ...normalizeThemes(waveSvg01),
  ...normalizeThemes(waveSvg02),
]

export function loadThemesFromFolders(): ThemeItem[] {
  return themeEntries
    .map((entry) => ({
      ...entry,
      previewImage: entry.previewImage || "/themes/default-preview.svg",
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}
