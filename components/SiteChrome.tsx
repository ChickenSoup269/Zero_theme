"use client"

import Link from "next/link"
import SiteControls from "./SiteControls"
import { TEXT } from "@/lib/i18n"
import { useSiteLanguage } from "@/lib/use-site-language"

export default function SiteChrome() {
  const lang = useSiteLanguage()
  const t = TEXT[lang]

  return (
    <>
      <nav className="nav">
        <Link className="brand" href="/">
          Zero Theme Gallery
        </Link>
        <div className="links">
          <Link href="/themes">{t.openGallery}</Link>
          <Link href="/custom-language">{t.customLanguage}</Link>
          <Link href="/docs">{t.docs}</Link>
        </div>
        <SiteControls />
      </nav>
      <footer className="footer">{t.footer}</footer>
    </>
  )
}
