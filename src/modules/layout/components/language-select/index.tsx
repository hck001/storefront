"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import ReactCountryFlag from "react-country-flag"
import { updateLocale } from "@lib/data/locale-actions"

type LanguageSelectProps = {
  currentLocale: string
  variant?: "dropdown" | "inline"
}

const LANGUAGES = [
  { code: "ka-GE", flag: "GE", label: "GE" },
  { code: "en-US", flag: "GB", label: "EN" },
  { code: "ru-RU", flag: "RU", label: "RU" },
] as const

const LanguageSelect = ({ currentLocale, variant = "dropdown" }: LanguageSelectProps) => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  const current = LANGUAGES.find((l) => l.code === currentLocale) || LANGUAGES[0]

  useEffect(() => {
    if (variant !== "dropdown") return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [variant])

  const handleChange = (code: string) => {
    if (code === currentLocale || isPending) return
    setOpen(false)
    startTransition(async () => {
      await updateLocale(code)
      // Hard reload to ensure all server components re-render with new locale
      window.location.reload()
    })
  }

  // Inline variant — horizontal buttons, used in mobile side menu
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        {LANGUAGES.map((lang) => {
          const isActive = currentLocale === lang.code
          return (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-white/[0.12] text-white ring-1 ring-[#C9A84C]/40"
                  : "text-white/50 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {/* @ts-ignore */}
              <ReactCountryFlag
                svg
                countryCode={lang.flag}
                style={{ width: "18px", height: "18px", borderRadius: "2px" }}
              />
              <span className="text-[12px] tracking-wider font-medium">
                {isPending ? "..." : lang.label}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  // Dropdown variant — used in desktop nav
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
        aria-label="Change language"
      >
        {/* @ts-ignore */}
        <ReactCountryFlag
          svg
          countryCode={current.flag}
          style={{ width: "16px", height: "16px", borderRadius: "2px" }}
        />
        <span className="text-[11px] tracking-wider font-medium">
          {isPending ? "..." : current.label}
        </span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-1 py-1 rounded-lg overflow-hidden z-[100]"
          style={{
            backgroundColor: "rgba(10,10,10,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            minWidth: "120px",
          }}
        >
          {LANGUAGES.map((lang) => {
            const isActive = currentLocale === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => handleChange(lang.code)}
                className={`flex items-center gap-2 w-full px-3 py-2 text-left transition-colors duration-150 ${
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {/* @ts-ignore */}
                <ReactCountryFlag
                  svg
                  countryCode={lang.flag}
                  style={{ width: "16px", height: "16px", borderRadius: "2px" }}
                />
                <span className="text-[12px] tracking-wide font-medium">
                  {lang.label}
                </span>
                {isActive && (
                  <svg className="w-3 h-3 ml-auto text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LanguageSelect
