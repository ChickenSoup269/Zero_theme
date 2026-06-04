"use client"

import { useEffect, useState } from "react"
import { Lang } from "./i18n"

export function useSiteLanguage() {
  const [lang, setLang] = useState<Lang>("vi")

  useEffect(() => {
    const savedLang = (localStorage.getItem("zero-lang") as Lang) || "vi"
    setLang(savedLang === "en" ? "en" : "vi")

    const onLang = (event: Event) => {
      const detail = (event as CustomEvent).detail
      if (detail === "en" || detail === "vi") setLang(detail)
    }

    window.addEventListener("zero-lang-change", onLang)
    return () => window.removeEventListener("zero-lang-change", onLang)
  }, [])

  return lang
}
