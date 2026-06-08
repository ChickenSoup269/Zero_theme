"use client"

import { useState } from "react"
import { ThemeItem } from "@/lib/types"
import { Lang, TEXT } from "@/lib/i18n"
import {
  formatTagLabel,
  getApplyCode,
  getPreviewImage,
  stableStringify,
  TYPE_LABEL,
} from "@/lib/theme-utils"
import { countDownload } from "@/lib/firebase-votes"

type Props = {
  item: ThemeItem
  lang?: Lang
  rank?: number
  liked?: boolean
  liveLikes?: number
  downloads?: number
  viewMode?: "split" | "compact" | "mini"
  onToggleFavorite?: (item: ThemeItem) => void
  onRequestPreview?: (item: ThemeItem) => void
  onRequestDownload?: (item: ThemeItem) => void
  onShare?: (item: ThemeItem) => void
  isFirebaseMode?: boolean
}

export default function ThemeCard({
  item,
  lang = "vi",
  rank,
  liked = false,
  liveLikes,
  downloads,
  viewMode = "split",
  onToggleFavorite,
  onRequestPreview,
  onRequestDownload,
  onShare,
  isFirebaseMode = false,
}: Props) {
  const t = TEXT[lang]
  const img = getPreviewImage(item)
  const safeLikes = Number.isFinite(Number(liveLikes)) ? Number(liveLikes) : 0
  const safeDownloads = Number.isFinite(Number(downloads))
    ? Number(downloads)
    : 0
  const json = stableStringify(item.theme)
  const applyCode = getApplyCode(item)
  const [copiedCode, setCopiedCode] = useState(false)

  async function downloadTheme() {
    const blob = new Blob([json], { type: "application/json;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${item.id || "zero-theme"}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    await countDownload(item).catch(() => {})
  }

  function handlePreview() {
    if (onRequestPreview) {
      onRequestPreview(item)
      return
    }

    if (img) {
      window.open(img, "_blank", "noopener,noreferrer")
    }
  }

  async function handleDownload() {
    if (!item.json) {
      await navigator.clipboard.writeText(applyCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 1400)
      return
    }

    if (onRequestDownload) {
      onRequestDownload(item)
      return
    }

    await downloadTheme()
  }

  async function handleShare() {
    if (onShare) {
      onShare(item)
      return
    }

    const shareText = `${item.title}${item.description ? ` - ${item.description}` : ""}`
    const shareUrl = typeof window !== "undefined" ? window.location.href : ""

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: shareUrl,
        })
        return
      } catch {
        return
      }
    }

    await navigator.clipboard
      ?.writeText([item.title, shareUrl].filter(Boolean).join("\n"))
      .catch(() => {})
  }

  return (
    <article
      className={`theme-card theme-card-horizontal theme-card-${viewMode} group relative overflow-hidden rounded-[24px] items-stretch transition-all duration-200 ease-in-out hover:-translate-y-1 bg-white border border-[#0f172a1f] shadow-[0_16px_48px_rgba(71,85,105,0.16)] dark:bg-[#0b1020] dark:border-white/15 dark:shadow-[0_24px_64px_rgba(0,0,0,0.35)] hover:border-[var(--accent)]`}
      data-type={item.type}
      data-tags={item.tags.join(",")}
    >
      <button
        className={`star-btn absolute top-4 right-4 z-10 flex items-center gap-2 border rounded-full py-2 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[10px] cursor-pointer font-black transition-all duration-200
          ${
            liked
              ? "bg-gradient-to-br from-[#facc15] to-[#fb923c] text-[#111827] border-[#fde68a]"
              : "bg-[#ffffffe8] text-[#0f172a] border-[#0f172a22] dark:bg-[#020617cc] dark:text-white dark:border-white/33"
          }`}
        onClick={() => onToggleFavorite?.(item)}
        aria-label={liked ? t.likedAria : t.likeAria}
        title={isFirebaseMode ? t.firebaseLikeTitle : t.likeTitle}
      >
        <span
          className={`text-[16px] transition-colors duration-200
          ${
            liked
              ? "text-[#111827] drop-shadow-none"
              : "text-[#475569] dark:text-[#cbd5e1] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          }`}
        >
          ★
        </span>
        <span className="min-w-[1.5ch]">
          {safeLikes.toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}
        </span>
      </button>

      {rank && rank <= 3 && safeLikes > 0 ? (
        <div
          className={`absolute left-4 top-4 z-[5] !py-2 px-4 rounded-full font-black tracking-wider text-white shadow-[0_16px_24px_rgba(0,0,0,0.3)]
    ${rank === 1 ? "bg-gradient-to-br from-[#fbbf24] to-[#f97316]" : ""}
    ${rank === 2 ? "bg-gradient-to-br from-[#94a3b8] to-[#64748b]" : ""}
    ${rank === 3 ? "bg-gradient-to-br from-[#d97706] to-[#b45309]" : ""}
  `}
          style={{ height: "fit-content", lineHeight: "1" }} // Thêm style này để ép độ cao
        >
          Top {rank}
        </div>
      ) : null}

      <button
        className="theme-card-preview min-h-[240px] h-full relative overflow-hidden isolate cursor-pointer text-left p-0 border-0 bg-transparent"
        type="button"
        onClick={handlePreview}
        aria-label={t.viewFullscreen}
      >
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.96] z-[4] py-2 px-4 rounded-full bg-[#ffffffea] text-[#0f172a] font-black tracking-tight opacity-0 group-hover:opacity-100 group-hover:-translate-y-1/2 group-hover:scale-100 transition-all duration-250 ease-in-out shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
          {t.openPreview}
        </span>
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[450ms] ease-out group-hover:scale-[1.06] bg-gradient-to-br from-[#111827] to-[#334155]"
          style={img ? { backgroundImage: `url(${img})` } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/85 z-[2]" />
        <div className="absolute left-4 right-4 bottom-4 z-[3] text-white [text-shadow:0_2px_18px_rgba(0,0,0,1)] flex flex-col gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full py-2 px-3 font-extrabold text-[12px] [text-shadow:none] w-fit
            ${item.type === "code" ? "bg-[#67e8f9] text-[#042f2e]" : ""}
            ${item.type === "wallpaper" ? "bg-[#bbf7d0] text-[#052e16]" : ""}
            ${item.type === "liveWallpaper" ? "bg-[#fcd34d] text-[#78350f]" : ""}
            ${item.type === "mixed" ? "bg-[#ddd6fe] text-[#2e1065]" : ""}
            ${item.type !== "code" && item.type !== "wallpaper" && item.type !== "mixed" ? "bg-[#ffffffed] text-[#0f172a]" : ""}
          `}
          >
            {lang === "vi" ? TYPE_LABEL[item.type] : item.type}
          </span>
          <p className="m-0 text-[#e2e8f0] text-[12px] leading-tight tracking-[0.14em] uppercase font-black">
            {t.openPreview}
          </p>
        </div>
      </button>

      <div className="theme-card-body flex-1 min-w-0 p-8 flex flex-col justify-start gap-6 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="flex flex-col gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="m-0 text-[26px] leading-[1.1] tracking-[-0.04em] text-[#0f172a] dark:text-white font-black">
              {item.title}
            </h3>
            {item.author ? (
              <p className="theme-author-line mt-1">
                {t.authorLabel}:{" "}
                {item.authorUrl ? (
                  <a
                    href={item.authorUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="font-bold hover:underline"
                  >
                    {item.author}
                  </a>
                ) : (
                  <span className="font-bold">{item.author}</span>
                )}
              </p>
            ) : null}
            <p className="mt-3 mb-0 text-[15px] leading-relaxed text-[#475569] dark:text-[#cbd5e1] line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>

        <div className="theme-card-metrics grid grid-cols-2 gap-4">
          <span className="flex flex-col gap-1 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
            <strong className="text-xl font-black text-[#0f172a] dark:text-white leading-none">
              {safeLikes.toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}
            </strong>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              {t.voteCount}
            </span>
          </span>
          <span className="flex flex-col gap-1 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
            <strong className="text-xl font-black text-[#0f172a] dark:text-white leading-none">
              {safeDownloads.toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}
            </strong>
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              {t.downloadCount}
            </span>
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {item.tags.map((tag) => (
            <span
              className="text-[12px] font-bold rounded-full py-1.5 px-4 border
                bg-slate-100 border-slate-200 text-slate-600
                dark:bg-white/5 dark:border-white/10 dark:text-slate-300"
              key={tag}
            >
              #{formatTagLabel(tag, lang)}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
          <button
            className="btn primary py-3 px-6 rounded-2xl inline-flex items-center justify-center gap-2 cursor-pointer font-black text-[14px] bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 transition-transform active:scale-95"
            onClick={handleDownload}
          >
            {item.json ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            )}
            {item.json
              ? t.downloadJson
              : copiedCode
                ? t.codeCopied
                : t.copyApplyCode}
          </button>
          <button
            className="btn ghost py-3 px-6 rounded-2xl inline-flex items-center justify-center gap-2 cursor-pointer font-bold text-[14px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-white/10"
            onClick={handleShare}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            {t.shareTheme}
          </button>
        </div>
      </div>
    </article>
  )
}
