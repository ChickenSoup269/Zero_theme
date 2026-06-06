export type ThemeType = "wallpaper" | "code" | "mixed" | "liveWallpaper"

export type ThemeItem = {
  id: string
  title: string
  description?: string
  author?: string
  authorUrl?: string
  type: ThemeType
  tags: string[]
  previewImage?: string
  downloadUrl?: string
  voteUrl?: string
  favoriteCount?: number
  json: boolean
  code?: string
  applyCode?: string
  theme: Record<string, unknown>
}

export type LanguagePack = {
  code: string
  name: string
  labels: Record<string, string>
}
