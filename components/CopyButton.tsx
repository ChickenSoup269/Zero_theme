"use client"
import { useState } from "react"
export default function CopyButton({
  text,
  label = "Copy JSON",
  copiedLabel = "Đã copy",
}: {
  text: string
  label?: string
  copiedLabel?: string
}) {
  const [ok, setOk] = useState(false)
  return (
    <button
      className="btn"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setOk(true)
        setTimeout(() => setOk(false), 1200)
      }}
    >
      {ok ? copiedLabel : label}
    </button>
  )
}
