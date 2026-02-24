"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "@lib/i18n/i18n-context"

type SearchProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants: { calculated_price?: { calculated_amount?: number; currency_code?: string } }[]
}

export default function InstantSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { t } = useTranslation()
  const [results, setResults] = useState<SearchProduct[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>(null)

  const search = useCallback(async (q: string) => {
    if (q.length === 0) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setResults(data.products || [])
      }
    } catch {
      setResults([])
    }
    setLoading(false)
  }, [])

  const handleInput = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(value), 200)
  }

  const handleOpen = () => {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleClose = () => {
    setOpen(false)
    setQuery("")
    setResults([])
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    if (open) document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  const formatPrice = (product: SearchProduct) => {
    const v = product.variants?.[0]?.calculated_price
    if (!v?.calculated_amount) return null
    return `${v.calculated_amount} ${(v.currency_code || "").toUpperCase()}`
  }

  return (
    <>
      {/* Trigger — full-width search bar style */}
      <button
        onClick={handleOpen}
        className="flex items-center justify-between w-full max-w-full h-[40px] border border-[#C9A84C]/30 rounded bg-transparent overflow-hidden group hover:border-[#C9A84C]/60 transition-colors"
        aria-label="Search"
      >
        <span className="text-white/40 text-[13px] pl-4 text-left flex-1">{t("nav.searchPlaceholder") || "Search..."}</span>
        <div className="w-[50px] h-full bg-[#C9A84C] flex items-center justify-center transition-colors">
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-black" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="6" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </div>
      </button>

      {/* Search panel — opens BELOW header as a dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/50"
            onClick={handleClose}
            style={{ animation: "fadeIn 0.2s ease-out" }}
          />

          <div
            className="fixed left-0 right-0 z-[100] top-[66px] sm:top-[74px]"
            style={{ animation: "searchDropDown 0.3s cubic-bezier(0.16,1,0.3,1)" }}
          >
            <div style={{ backgroundColor: "rgba(10,10,10,0.98)", backdropFilter: "blur(24px)" }}>
              <div className="content-container">
                <div className="flex items-center gap-4 h-16 sm:h-[72px]">
                  <svg viewBox="0 0 20 20" className="w-5 h-5 text-[#C9A84C] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="8.5" cy="8.5" r="6" />
                    <path d="M13 13l4.5 4.5" strokeLinecap="round" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleInput(e.target.value)}
                    placeholder={t("nav.searchPlaceholder") || "What are you looking for?"}
                    className="flex-1 bg-transparent text-white text-base sm:text-lg font-light outline-none placeholder-white/25 tracking-wide"
                  />
                  <button
                    onClick={handleClose}
                    className="flex items-center gap-2 text-white/30 hover:text-white transition-colors"
                  >
                    <span className="hidden sm:inline text-[10px] uppercase tracking-[0.15em] font-medium border border-white/10 rounded px-2 py-0.5">ESC</span>
                    <svg viewBox="0 0 16 16" className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.06]" />

              {query.length > 0 && (
                <div className="content-container max-h-[50vh] overflow-y-auto no-scrollbar">
                  {loading && (
                    <div className="py-10 text-center">
                      <div className="inline-block w-5 h-5 border-2 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" />
                    </div>
                  )}

                  {!loading && results.length === 0 && (
                    <div className="py-10 text-center">
                      <p className="text-white/30 text-sm">Nothing found</p>
                      <p className="text-white/15 text-xs mt-1">&ldquo;{query}&rdquo;</p>
                    </div>
                  )}

                  {!loading && results.length > 0 && (
                    <div className="py-4">
                      <div className="mb-3 px-1">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold">
                          {results.length} results
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                        {results.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.handle}`}
                            onClick={handleClose}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
                          >
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0 border border-white/[0.06]">
                              {product.thumbnail ? (
                                <Image
                                  src={product.thumbnail}
                                  alt={product.title}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg viewBox="0 0 24 24" className="w-6 h-6 opacity-20" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                                    <path d="M8 10 C8 4, 16 4, 16 10" />
                                    <rect x="4" y="10" width="16" height="11" rx="2" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate group-hover:text-[#C9A84C] transition-colors">
                                {product.title}
                              </p>
                              {formatPrice(product) && (
                                <p className="text-[#C9A84C]/70 text-xs mt-0.5 font-light">{formatPrice(product)}</p>
                              )}
                            </div>
                            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-white/10 group-hover:text-[#C9A84C] transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        ))}
                      </div>

                      <Link
                        href={`/store?q=${encodeURIComponent(query)}`}
                        onClick={handleClose}
                        className="flex items-center justify-center gap-2 mt-4 py-3 text-[11px] uppercase tracking-[0.15em] font-semibold text-[#C9A84C] hover:text-[#d4b65e] border-t border-white/[0.06] transition-colors"
                      >
                        View All Results
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-[1px] bg-white/[0.04]" />
          </div>
        </>
      )}
    </>
  )
}
