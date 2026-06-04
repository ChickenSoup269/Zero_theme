"use client"

import CopyButton from "@/components/CopyButton"
import { TEXT } from "@/lib/i18n"
import { useSiteLanguage } from "@/lib/use-site-language"
const schema = {
  themes: [
    {
      id: "unique-id",
      title: "Tên theme",
      description: "Mô tả ngắn",
      type: "wallpaper | liveWallpaper | code | mixed",
      tags: ["hình nền", "thiên nhiên", "cyberpunk"],
      previewImage: "https://.../cover.jpg",
      downloadUrl: "/examples/theme.json",
      theme: {
        source: "zero-startpage",
        version: 2,
        settings: { accentColor: "#1ba766", background: "https://..." },
        bookmarks: { groups: [] },
      },
    },
  ],
}
export default function DocsPage() {
  const lang = useSiteLanguage()
  const t = TEXT[lang]
  const code = JSON.stringify(schema, null, 2)
  return (
    <main className="container">
      <h1>{t.docs}</h1>
      <p style={{ color: "var(--muted)" }}>
        {lang === "vi"
          ? "Bạn có thể đăng file JSON theo mẫu này để user tải về. App cũng đọc được file export dạng single object giống Zero Startpage."
          : "You can publish JSON files in this format for users to download. The app also supports single-object exports like Zero Startpage."}
      </p>
      <pre className="code">{code}</pre>
      <CopyButton
        text={code}
        label={lang === "vi" ? "Copy schema" : "Copy schema"}
        copiedLabel={lang === "vi" ? "Đã copy" : "Copied"}
      />
    </main>
  )
}
