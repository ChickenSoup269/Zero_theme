import { ThemeItem, ThemeType } from "./types"

export const TYPE_LABEL: Record<ThemeType, string> = {
  wallpaper: "Hình nền",
  code: "Code nền",
  mixed: "Mix",
}

export function stableStringify(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export function formatTagLabel(tag: string, lang: "vi" | "en" = "vi") {
  const key = tag.trim().toLowerCase()
  const map: Record<string, { vi: string; en: string }> = {
    "hình nền": { vi: "Hình nền", en: "Wallpaper" },
    "code nền": { vi: "Code nền", en: "Code Theme" },
    "thiên nhiên": { vi: "Thiên nhiên", en: "Nature" },
    cyberpunk: { vi: "Cyberpunk", en: "Cyberpunk" },
    ngầu: { vi: "Ngầu", en: "Cool" },
    wallpaper: { vi: "Wallpaper", en: "Wallpaper" },
    code: { vi: "Code", en: "Code" },
    mixed: { vi: "Mix", en: "Mixed" },
  }
  if (map[key]) return map[key][lang]
  return tag
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function getPreviewImage(item: ThemeItem) {
  const settings = (item.theme as any)?.settings ?? item.theme ?? {}
  return (
    item.previewImage || settings.background || settings.mediaOrbImageUrl || ""
  )
}

export function normalizeThemes(raw: unknown): ThemeItem[] {
  if (Array.isArray(raw))
    return raw.map(normalizeTheme).filter(Boolean) as ThemeItem[]
  if (raw && typeof raw === "object") {
    const data = raw as any
    if (Array.isArray(data.themes))
      return data.themes.map(normalizeTheme).filter(Boolean)
    return [normalizeTheme(data)].filter(Boolean) as ThemeItem[]
  }
  return []
}

function normalizeTheme(value: any, index = 0): ThemeItem | null {
  if (!value || typeof value !== "object") return null
  const settings =
    value.settings ?? value.theme?.settings ?? value.theme ?? value
  const userBackgrounds = Array.isArray(settings.userBackgrounds)
    ? settings.userBackgrounds
    : []
  const hasImage = Boolean(
    value.previewImage ||
    settings.background ||
    settings.mediaOrbImageUrl ||
    userBackgrounds.length,
  )
  const hasCodeEffect =
    Boolean(settings.effect && settings.effect !== "none") ||
    Object.keys(settings).some((k) => /hacker|grid|crt|code|scan/i.test(k))
  const type: ThemeType =
    value.type ??
    (hasImage && hasCodeEffect ? "mixed" : hasCodeEffect ? "code" : "wallpaper")
  const tags = Array.from(
    new Set([
      ...(value.tags ?? []),
      type === "wallpaper" ? "hình nền" : type === "code" ? "code nền" : "mix",
    ]),
  )
  return {
    id: value.id ?? settings.activeBgUid ?? `theme-${index + 1}`,
    title:
      value.title ?? value.name ?? settings.pageTitle ?? `Theme ${index + 1}`,
    description:
      value.description ??
      `Import tự động từ JSON, giữ nguyên thứ tự và cấu trúc settings/bookmarks nếu có.`,
    type,
    tags,
    previewImage:
      value.previewImage ??
      settings.background ??
      settings.mediaOrbImageUrl ??
      userBackgrounds[0]?.url,
    downloadUrl: value.downloadUrl,
    voteUrl: value.voteUrl ?? value.googleFormUrl ?? value.formUrl,
    favoriteCount: Number.isFinite(
      Number(value.favoriteCount ?? value.likes ?? value.stars),
    )
      ? Number(value.favoriteCount ?? value.likes ?? value.stars)
      : 0,
    theme: value.theme ?? value,
  }
}
