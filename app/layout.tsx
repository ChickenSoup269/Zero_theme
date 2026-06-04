import "./globals.css"
import type { Metadata } from "next"
import SiteChrome from "@/components/SiteChrome"

export const metadata: Metadata = {
  title: "Zero Theme Gallery",
  description: "Next.js JSON theme gallery",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" data-theme="dark" suppressHydrationWarning>
      <body>
        <SiteChrome />
        {children}
      </body>
    </html>
  )
}
