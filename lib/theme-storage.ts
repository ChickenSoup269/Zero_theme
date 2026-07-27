import { promises as fs } from "fs"
import path from "path"
import { normalizeThemes } from "./theme-utils"
import type { ThemeItem, ThemeType } from "./types"

const THEMES_DIR = path.join(process.cwd(), "data", "themes")
const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "admin-uploads")

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "theme"
  )
}

function normalizeThemeId(value?: string) {
  return slugify(value || "theme")
}

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
}

function isThemeFile(name: string) {
  return name.endsWith(".json") && name !== "index.ts"
}

export async function listThemes(): Promise<ThemeItem[]> {
  const entries = await fs.readdir(THEMES_DIR, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && isThemeFile(entry.name))
    .map((entry) => entry.name)
    .sort()

  const themes: ThemeItem[] = []

  for (const file of files) {
    try {
      const raw = await fs.readFile(path.join(THEMES_DIR, file), "utf8")
      const parsed = JSON.parse(raw)
      themes.push(...normalizeThemes(parsed))
    } catch {
      // Ignore invalid files
    }
  }

  return themes.sort((a, b) => a.title.localeCompare(b.title))
}

export async function saveTheme(
  input: Partial<ThemeItem> & { id?: string },
  imageFile?: File | null,
): Promise<ThemeItem> {
  const id = normalizeThemeId(input.id || input.title || "theme")
  let previewImage =
    typeof input.previewImage === "string" ? input.previewImage : undefined

  if (imageFile) {
    await ensureUploadDir()
    const ext = path.extname(imageFile.name || ".png") || ".png"
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    const filePath = path.join(UPLOAD_DIR, fileName)
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    await fs.writeFile(filePath, buffer)
    previewImage = `/images/admin-uploads/${fileName}`
  }

  const themeData: ThemeItem = {
    id,
    title: input.title || id,
    description: input.description || "",
    author: input.author || "",
    authorUrl: input.authorUrl || "",
    type: (input.type || "wallpaper") as ThemeType,
    tags: Array.isArray(input.tags) ? input.tags : [],
    previewImage,
    downloadUrl: input.downloadUrl,
    voteUrl: input.voteUrl,
    favoriteCount: Number(input.favoriteCount || 0),
    json: input.json !== false,
    code: input.code,
    applyCode: input.applyCode,
    theme: input.theme ?? {},
  }

  const filePath = path.join(THEMES_DIR, `${id}.json`)
  await fs.writeFile(
    filePath,
    JSON.stringify(themeData, null, 2) + "\n",
    "utf8",
  )

  return themeData
}

export async function deleteTheme(id: string) {
  const filePath = path.join(THEMES_DIR, `${normalizeThemeId(id)}.json`)
  await fs.rm(filePath, { force: true })
}
