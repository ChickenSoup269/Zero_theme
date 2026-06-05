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
      <section className="upload-stub-panel">
        <div>
          <p className="theme-modal-kicker">
            {lang === "vi" ? "Kết nối sau" : "Server-ready"}
          </p>
          <h2>{lang === "vi" ? "Khu đăng theme giả lập" : "Mock theme uploader"}</h2>
          <p>
            {lang === "vi"
              ? "Các nút này chưa upload thật, nhưng đã tách sẵn action để sau này nối API lưu ảnh và JSON."
              : "These buttons do not upload yet, but their actions are separated for a later image and JSON API."}
          </p>
        </div>
        <div className="upload-actions">
          <button className="btn primary" data-action="upload-image" type="button">
            {lang === "vi" ? "Đăng ảnh preview" : "Upload preview image"}
          </button>
          <button className="btn ghost" data-action="upload-json" type="button">
            {lang === "vi" ? "Đăng file JSON" : "Upload JSON file"}
          </button>
          <button className="btn ghost" data-action="upload-apply-code" type="button">
            {lang === "vi" ? "Đăng mã áp" : "Upload apply code"}
          </button>
        </div>
      </section>
      <section className="docs-note-panel">
        <strong>{lang === "vi" ? "Ghi chú thử nghiệm" : "Experimental note"}</strong>
        <p>
          {lang === "vi"
            ? "Website hiện đang là bản thử nghiệm, nên khu đăng ảnh/JSON chỉ là chức năng trang trí và chưa có server chính thức. Bạn có thể dùng tạm các nền có sẵn; nếu muốn đăng thật vui lòng liên hệ dev:"
            : "This website is currently experimental, so the image/JSON upload area is decorative and does not have an official server yet. Please use the available themes for now; to publish real themes, contact the developer:"}
        </p>
        <a
          className="btn ghost"
          href="https://www.facebook.com/tran.phuoc.thien.522405/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Facebook dev
        </a>
      </section>
      <pre className="code">{code}</pre>
      <CopyButton
        text={code}
        label={lang === "vi" ? "Copy schema" : "Copy schema"}
        copiedLabel={lang === "vi" ? "Đã copy" : "Copied"}
      />
    </main>
  )
}
