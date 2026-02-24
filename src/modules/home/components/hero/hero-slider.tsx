"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "@lib/i18n/i18n-context"

type HeroProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  description: string | null
  price?: string
}

export default function HeroSlider({ products }: { products: HeroProduct[] }) {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const DURATION = 6000
  const [textKey, setTextKey] = useState(0)
  const { t } = useTranslation()

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || index === current) return
      setIsAnimating(true)
      setCurrent(index)
      setTextKey((k) => k + 1)
      setProgress(0)
      setTimeout(() => setIsAnimating(false), 900)
    },
    [isAnimating, current]
  )

  const goNext = useCallback(() => {
    goTo((current + 1) % products.length)
  }, [current, products.length, goTo])

  const goPrev = useCallback(() => {
    goTo((current - 1 + products.length) % products.length)
  }, [current, products.length, goTo])

  useEffect(() => {
    if (products.length <= 1) return
    const interval = 30
    let elapsed = 0
    progressRef.current = setInterval(() => {
      elapsed += interval
      setProgress(Math.min((elapsed / DURATION) * 100, 100))
      if (elapsed >= DURATION) {
        goNext()
        elapsed = 0
      }
    }, interval)
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [current, products.length, goNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev()
    }
  }

  if (!products.length) return null
  const product = products[current]

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ height: "calc(100svh - 73px)", backgroundColor: "#050505" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background images — all pre-rendered */}
      {products.map((p, i) => (
        <div
          key={p.id}
          className="absolute inset-0 transition-all duration-[1.2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1)" : "scale(1.08)",
            zIndex: i === current ? 1 : 0,
          }}
        >
          {p.thumbnail && (
            <Image
              src={p.thumbnail}
              alt={p.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
            />
          )}
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 z-[2] bg-black/50" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-end">
        <div className="content-container w-full pb-24 sm:pb-28">
          <div className="max-w-2xl" key={textKey}>
            {/* Tag */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 border border-[#C9A84C]/30 bg-[#C9A84C]/[0.08]"
              style={{ animation: "fadeSlideUp 0.6s ease-out" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] font-medium">
                {t("home.newCollection")}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-[clamp(2rem,6vw,4.5rem)] font-extralight leading-[1.05] tracking-[-0.02em] text-white mb-5"
              style={{ animation: "fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
            >
              {product.title}
            </h1>

            {/* Description */}
            <p
              className="text-white/50 text-sm sm:text-[15px] font-light leading-relaxed max-w-lg mb-8"
              style={{ animation: "fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
            >
              {product.description || t("home.defaultProductDesc")}
            </p>

            {/* Price + CTA */}
            <div
              className="flex flex-wrap items-center gap-5"
              style={{ animation: "fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}
            >
              {product.price && (
                <span className="text-white text-2xl sm:text-3xl font-light tracking-tight">
                  {product.price}
                </span>
              )}
              <Link
                href={`/products/${product.handle}`}
                className="group inline-flex items-center gap-3 bg-white text-[#0a0a0a] px-7 sm:px-9 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-[0.12em] uppercase font-semibold hover:bg-[#C9A84C] hover:text-black transition-all duration-300"
              >
                {t("home.viewDetails")}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/store"
                className="inline-flex items-center text-white/50 text-[11px] sm:text-xs tracking-[0.1em] uppercase font-medium hover:text-white transition-colors duration-300 border-b border-white/20 hover:border-white/50 pb-0.5"
              >
                {t("home.allProducts")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators — right side vertical */}
      <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col items-center gap-3">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative flex items-center justify-center"
            aria-label={`Slide ${i + 1}`}
          >
            <div
              className={`w-[3px] rounded-full transition-all duration-500 ${
                i === current ? "h-10 bg-[#C9A84C]" : "h-4 bg-white/20 group-hover:bg-white/40"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Bottom bar — mobile dots + counter */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Progress line */}
        <div className="h-[2px] bg-white/[0.06]">
          <div
            className="h-full bg-[#C9A84C]/70"
            style={{ width: `${progress}%`, transition: "none" }}
          />
        </div>

        <div className="content-container py-4 flex items-center justify-between">
          {/* Counter */}
          <div className="flex items-center gap-3">
            <span className="text-white font-light text-sm tabular-nums">
              {String(current + 1).padStart(2, "0")}
            </span>
            <div className="w-6 h-[1px] bg-white/20" />
            <span className="text-white/25 font-light text-sm tabular-nums">
              {String(products.length).padStart(2, "0")}
            </span>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white border border-white/10 hover:border-white/25 transition-all duration-300"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white border border-white/10 hover:border-white/25 transition-all duration-300"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
