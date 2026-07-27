import fs from "fs"
import path from "path"

const root = process.cwd()
const dataFile = path.join(root, "data", "themes.json")
const outputDir = path.join(root, "data", "themes")

if (!fs.existsSync(dataFile)) {
  console.error("Không tìm thấy data/themes.json")
  process.exit(1)
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const raw = JSON.parse(fs.readFileSync(dataFile, "utf8"))
const themes = Array.isArray(raw) ? raw : raw.themes || []

for (const file of fs.readdirSync(outputDir)) {
  if (file.endsWith(".json") && file !== "index.ts") {
    fs.unlinkSync(path.join(outputDir, file))
  }
}

for (const theme of themes) {
  if (!theme?.id) continue
  const safeName = String(theme.id)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  const filePath = path.join(outputDir, `${safeName}.json`)
  fs.writeFileSync(filePath, JSON.stringify(theme, null, 2) + "\n", "utf8")
}

const imports = fs
  .readdirSync(outputDir)
  .filter((name) => name.endsWith(".json") && name !== "index.ts")
  .sort()
  .map((name) => {
    const base = path.basename(name, ".json")
    const importName = base.replace(/[^a-zA-Z0-9]+(.)/g, (_, char) =>
      char.toUpperCase(),
    )
    return `import ${importName} from "./${name}"`
  })

const content = `import { normalizeThemes } from "@/lib/theme-utils"
import type { ThemeItem } from "@/lib/types"
${imports.join("\n")}

const themeEntries: ThemeItem[] = [
${imports
  .map((line) => {
    const name = line.match(/import\s+(\w+)/)?.[1]
    return `  ...normalizeThemes(${name}),`
  })
  .join("\n")}
]

export function loadThemesFromFolders(): ThemeItem[] {
  return themeEntries
    .map((entry) => ({
      ...entry,
      previewImage: entry.previewImage || "/themes/default-preview.svg",
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
}
`

fs.writeFileSync(path.join(outputDir, "index.ts"), content, "utf8")
console.log(`Đã tách ${themes.length} theme ra ${outputDir}`)
