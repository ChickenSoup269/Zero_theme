"use client"

import CopyButton from "@/components/CopyButton"
import { TEXT } from "@/lib/i18n"
import { useSiteLanguage } from "@/lib/use-site-language"

const viPack = {
  code: "vi-custom",
  name: "Tiếng Việt custom",
  labels: {
    searchPlaceholder: "Tìm theme, tag hoặc hiệu ứng...",
    copyJson: "Copy JSON",
    downloadJson: "Tải JSON",
    wallpaper: "Hình nền",
    codeBackground: "Code nền",
    cyberpunk: "Cyberpunk",
    nature: "Thiên nhiên",
  },
}

export default function CustomLanguagePage() {
  const lang = useSiteLanguage()
  const t = TEXT[lang]
  const code = JSON.stringify(viPack, null, 2)
  return (
    <main className="container">
      <h1>{t.customLanguage}</h1>
      <p style={{ color: "var(--muted)" }}>
        {lang === "vi"
          ? "Trang riêng để bạn quản lý language pack. Sau này có thể lưu nhiều file trong data/languages.json hoặc fetch từ CMS/GitHub raw JSON."
          : "A dedicated page for managing language packs. Later you can store multiple files in data/languages.json or fetch them from a CMS/GitHub raw JSON."}
      </p>
      <div className="split">
        <div className="panel">
          <h2>
            {lang === "vi" ? "Language pack mẫu" : "Sample language pack"}
          </h2>
          <pre className="code">{code}</pre>
          <CopyButton
            text={code}
            label={lang === "vi" ? "Copy language JSON" : "Copy language JSON"}
            copiedLabel={lang === "vi" ? "Đã copy" : "Copied"}
          />
        </div>
        <div className="panel">
          <h2>{lang === "vi" ? "Gợi ý key" : "Recommended keys"}</h2>
          <p>
            {lang === "vi"
              ? "Dùng key ổn định như copyJson, wallpaper, codeBackground. UI chỉ render label theo key, không hard-code chữ trong từng card."
              : "Use stable keys like copyJson, wallpaper, and codeBackground. The UI should render labels from keys instead of hard-coding strings inside each card."}
          </p>
        </div>
      </div>
    </main>
  )
}
