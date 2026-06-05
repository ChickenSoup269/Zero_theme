"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import SiteControls from "./SiteControls"
import { TEXT } from "@/lib/i18n"
import { useSiteLanguage } from "@/lib/use-site-language"

export default function SiteChrome() {
  const lang = useSiteLanguage()
  const t = TEXT[lang]
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [
    { href: "/themes", label: t.openGallery },
    { href: "/docs", label: t.docs },
  ]

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <nav className={`nav ${menuOpen ? "menu-open" : ""}`}>
        <Link className="brand" href="/">
          Zero Theme Gallery
        </Link>
        <button
          className="mobile-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="links" id="site-menu">
          {navItems.map((item) => (
            <Link
              aria-current={isActive(item.href) ? "page" : undefined}
              className={isActive(item.href) ? "active" : ""}
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <SiteControls />
      </nav>
      <footer className="footer">{t.footer}</footer>
    </>
  )
}
