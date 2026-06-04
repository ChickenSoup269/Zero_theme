"use client"

import { useEffect, useMemo, useState } from "react"
import ThemeCard from "./ThemeCard"
import { ThemeItem, ThemeType } from "@/lib/types"
import { Lang, TEXT } from "@/lib/i18n"
import {
  getLocalVotedIds,
  isFirebaseConfigured,
  listenThemeVotes,
  voteTheme,
  countDownload,
} from "@/lib/firebase-votes"
import {
  formatTagLabel,
  getPreviewImage,
  stableStringify,
} from "@/lib/theme-utils"

type LikeState = Record<string, { liked: boolean; bonus: number }>

const STORAGE_KEY = "zero-theme-gallery-likes-v3"

export default function ThemeExplorer({ themes }: { themes: ThemeItem[] }) {
  const [q, setQ] = useState("")
  const [type, setType] = useState<"all" | ThemeType>("all")
  const [tag, setTag] = useState("all")
  const [sort, setSort] = useState<"popular" | "newest" | "az">("popular")
  const [likes, setLikes] = useState<LikeState>({})
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({})
  const [message, setMessage] = useState("")
  const [lang, setLang] = useState<Lang>("vi")
  const [activeItem, setActiveItem] = useState<ThemeItem | null>(null)
  const [downloadTarget, setDownloadTarget] = useState<ThemeItem | null>(null)
  const [actionMessage, setActionMessage] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setLikes(JSON.parse(raw))
      const voted = getLocalVotedIds()
      if (Object.keys(voted).length) {
        setLikes((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.keys(voted).map((id) => [id, { liked: true, bonus: 0 }]),
          ),
        }))
      }
      const savedLang = localStorage.getItem("zero-lang")
      if (savedLang === "en" || savedLang === "vi") setLang(savedLang)
    } catch {}

    const onLang = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (detail === "en" || detail === "vi") setLang(detail)
    }
    window.addEventListener("zero-lang-change", onLang)
    return () => window.removeEventListener("zero-lang-change", onLang)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likes))
  }, [likes])

  useEffect(() => {
    const unsubscribe = listenThemeVotes(setVoteCounts)
    return unsubscribe
  }, [])

  const t = TEXT[lang]
  const tags = useMemo(
    () => Array.from(new Set(themes.flatMap((item) => item.tags))).sort(),
    [themes],
  )
  const activePreview = activeItem ? getPreviewImage(activeItem) : ""

  function countOf(item: ThemeItem) {
    if (isFirebaseConfigured)
      return Math.max(0, Number(voteCounts[item.id] ?? 0))
    return Math.max(0, likes[item.id]?.bonus ?? 0)
  }

  async function downloadTheme(item: ThemeItem) {
    const blob = new Blob([stableStringify(item.theme)], {
      type: "application/json;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${item.id || "zero-theme"}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    await countDownload(item).catch(() => {})
    setActionMessage(`${item.title}: ${t.confirmDownloadCta}`)
  }

  async function toggleFavorite(item: ThemeItem) {
    setMessage("")

    if (isFirebaseConfigured) {
      try {
        await voteTheme(item)
        setLikes((prev) => ({ ...prev, [item.id]: { liked: true, bonus: 0 } }))
        setMessage(t.voteSaved)
      } catch (error) {
        const fallback = error instanceof Error ? error.message : t.voteError
        setMessage(fallback)
      }
      return
    }

    setLikes((prev) => {
      const current = prev[item.id] ?? { liked: false, bonus: 0 }
      const nextLiked = !current.liked
      return {
        ...prev,
        [item.id]: {
          liked: nextLiked,
          bonus: nextLiked ? 1 : 0,
        },
      }
    })
  }

  const list = themes
    .filter((item) => {
      const hay =
        `${item.title} ${item.description ?? ""} ${item.tags.join(" ")}`.toLowerCase()
      return (
        (type === "all" || item.type === type) &&
        (tag === "all" || item.tags.includes(tag)) &&
        hay.includes(q.toLowerCase())
      )
    })
    .sort((a, b) => {
      if (sort === "popular") return countOf(b) - countOf(a)
      if (sort === "az") return a.title.localeCompare(b.title)
      return themes.indexOf(a) - themes.indexOf(b)
    })

  const totalLikes = themes.reduce((sum, item) => sum + countOf(item), 0)
  const top = [...themes].sort((a, b) => countOf(b) - countOf(a))[0]

  async function handleShare(item: ThemeItem) {
    const previewUrl = getPreviewImage(item)
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/themes?theme=${encodeURIComponent(item.id)}`
        : previewUrl
    const payload = {
      title: item.title,
      text: `${item.title}${item.description ? ` - ${item.description}` : ""}`,
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(payload)
        setActionMessage(t.shareCopied)
        return
      }

      await navigator.clipboard.writeText(
        [item.title, shareUrl].filter(Boolean).join("\n"),
      )
      setActionMessage(t.shareCopied)
    } catch {
      await navigator.clipboard
        .writeText([item.title, shareUrl].filter(Boolean).join("\n"))
        .catch(() => {})
      setActionMessage(t.shareUnavailable)
    }
  }

  return (
    <>
      <section className="vote-panel">
        <div>
          <h2>{isFirebaseConfigured ? t.firebaseVotesTitle : t.voteAll}</h2>
          <p>{isFirebaseConfigured ? t.firebaseVotesHint : t.voteHint}</p>
          {message ? <p className="vote-message">{message}</p> : null}
          {actionMessage ? (
            <p className="vote-message">{actionMessage}</p>
          ) : null}
        </div>
        {!isFirebaseConfigured ? (
          <span className="firebase-warning">{t.firebaseMissing}</span>
        ) : null}
      </section>

      <section className="stats-strip">
        <div>
          <strong>{themes.length}</strong>
          <span>{t.themes}</span>
        </div>
        <div>
          <strong>
            {totalLikes.toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}
          </strong>
          <span>{isFirebaseConfigured ? t.realVotes : t.localLikes}</span>
        </div>
        <div>
          <strong>{top && countOf(top) > 0 ? top.title : t.none}</strong>
          <span>{isFirebaseConfigured ? t.topReal : t.topLocal}</span>
        </div>
      </section>

      <div className="toolbar marketplace-toolbar">
        <input
          className="field search-field"
          placeholder={t.search}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="field"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        >
          <option value="all">{t.allTypes}</option>
          <option value="wallpaper">{t.wallpaper}</option>
          <option value="code">{t.code}</option>
          <option value="mixed">{t.mixed}</option>
        </select>
        <select
          className="field"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="all">{t.allTags}</option>
          {tags.map((tagName) => (
            <option key={tagName} value={tagName}>
              {formatTagLabel(tagName, lang)}
            </option>
          ))}
        </select>
        <select
          className="field"
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
        >
          <option value="popular">
            {isFirebaseConfigured ? t.topReal : t.sortLocal}
          </option>
          <option value="newest">{t.sortJson}</option>
          <option value="az">A → Z</option>
        </select>
      </div>

      <div className="grid marketplace-grid">
        {list.map((item, index) => (
          <ThemeCard
            key={item.id}
            item={item}
            lang={lang}
            rank={sort === "popular" ? index + 1 : undefined}
            liked={Boolean(likes[item.id]?.liked)}
            liveLikes={countOf(item)}
            onToggleFavorite={toggleFavorite}
            onRequestPreview={setActiveItem}
            onRequestDownload={setDownloadTarget}
            onShare={handleShare}
            isFirebaseMode={isFirebaseConfigured}
          />
        ))}
      </div>

      {activeItem || downloadTarget ? (
        <div
          className="theme-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem ? activeItem.title : downloadTarget?.title}
          onClick={() => {
            setActiveItem(null)
            setDownloadTarget(null)
          }}
        >
          <div
            className="theme-modal"
            onClick={(event) => event.stopPropagation()}
          >
            {activeItem ? (
              <>
                <div
                  className="theme-modal-visual"
                  style={
                    activePreview
                      ? { backgroundImage: `url(${activePreview})` }
                      : undefined
                  }
                />
                <div className="theme-modal-body">
                  <div className="theme-modal-head">
                    <div>
                      <p className="theme-modal-kicker">
                        {formatTagLabel(activeItem.type, lang)}
                      </p>
                      <h3>{activeItem.title}</h3>
                    </div>
                    <button
                      className="btn ghost"
                      onClick={() => setActiveItem(null)}
                    >
                      {t.cancel}
                    </button>
                  </div>
                  <p className="lead">{activeItem.description}</p>
                  <div className="tag-row">
                    {activeItem.tags.map((tagName) => (
                      <span key={tagName} className="tag">
                        #{formatTagLabel(tagName, lang)}
                      </span>
                    ))}
                  </div>
                  <div className="action-row">
                    <button
                      className="btn primary"
                      onClick={() => {
                        setDownloadTarget(activeItem)
                        setActiveItem(null)
                      }}
                    >
                      {t.downloadJson}
                    </button>
                    <button
                      className="btn ghost"
                      onClick={() => handleShare(activeItem)}
                    >
                      {t.shareTheme}
                    </button>
                    <button
                      className="btn ghost"
                      onClick={() => setActiveItem(null)}
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              </>
            ) : downloadTarget ? (
              <div className="theme-modal-body download-modal-body">
                <div className="theme-modal-head">
                  <div>
                    <p className="theme-modal-kicker">
                      {t.confirmDownloadTitle}
                    </p>
                    <h3>{downloadTarget.title}</h3>
                  </div>
                  <button
                    className="btn ghost"
                    onClick={() => setDownloadTarget(null)}
                  >
                    {t.cancel}
                  </button>
                </div>
                <p className="lead">{t.confirmDownloadBody}</p>
                <div className="theme-modal-actions">
                  <button
                    className="btn primary"
                    onClick={async () => {
                      await downloadTheme(downloadTarget)
                      setDownloadTarget(null)
                    }}
                  >
                    {t.confirmDownloadCta}
                  </button>
                  <button
                    className="btn ghost"
                    onClick={() => setDownloadTarget(null)}
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
