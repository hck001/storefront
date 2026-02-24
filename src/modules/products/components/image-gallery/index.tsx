"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useRef, useState, useEffect, useCallback } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = imageRefs.current.findIndex((ref) => ref === entry.target)
            if (idx !== -1) {
              setActiveIndex(idx)
              thumbRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "nearest" })
            }
          }
        })
      },
      { threshold: 0.5 }
    )
    imageRefs.current.forEach((ref) => { if (ref) observer.observe(ref) })
    return () => observer.disconnect()
  }, [images])

  const scrollToImage = (index: number) => {
    isScrollingRef.current = true
    setActiveIndex(index)
    imageRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" })
    setTimeout(() => { isScrollingRef.current = false }, 600)
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }
  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ""
  }
  const nextImage = useCallback(() => {
    setLightboxIndex((p) => (p + 1) % images.length)
  }, [images.length])
  const prevImage = useCallback(() => {
    setLightboxIndex((p) => (p - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [lightboxOpen, nextImage, prevImage])

  const hasThumbs = images.length > 1

  return (
    <>
      {/* ===== DESKTOP ===== */}
      <div className="hidden md:flex h-full">
        {/* Thumbnail strip */}
        {hasThumbs && (
          <div className="w-[80px] flex-shrink-0 border-r border-white/[0.04] overflow-y-auto no-scrollbar bg-[#0d0d0d]">
            <div className="flex flex-col gap-[2px] p-2 sticky top-0">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  ref={(el) => { thumbRefs.current[index] = el }}
                  onClick={() => scrollToImage(index)}
                  className="relative flex-shrink-0 transition-all duration-300"
                >
                  <div className={`relative w-full aspect-[4/5] overflow-hidden transition-all duration-300 ${
                    activeIndex === index
                      ? "ring-2 ring-[#C9A84C] ring-offset-1 ring-offset-[#0d0d0d] opacity-100"
                      : "opacity-35 hover:opacity-60 grayscale hover:grayscale-0"
                  }`}>
                    {image.url && (
                      <Image src={image.url} alt="" fill sizes="76px" className="object-cover" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main images — stacked vertically, scroll to browse */}
        <div className="flex-1 flex flex-col">
          {images.map((image, index) => (
            <div
              key={image.id}
              ref={(el) => { imageRefs.current[index] = el }}
              className="relative w-full cursor-zoom-in group"
              style={{ minHeight: images.length === 1 ? "calc(100vh - 120px)" : "auto", aspectRatio: images.length === 1 ? undefined : "3/4" }}
              onClick={() => openLightbox(index)}
            >
              {image.url && (
                <Image
                  src={image.url}
                  priority={index <= 1}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              )}
              {/* Hover zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/40 backdrop-blur-sm rounded-full p-3">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              {/* Image counter badge */}
              {hasThumbs && (
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white/60 text-[10px] tracking-wider px-3 py-1">
                  {index + 1} / {images.length}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== MOBILE ===== */}
      <div className="md:hidden">
        <div className="relative overflow-x-auto snap-x snap-mandatory flex no-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
          {images.map((image, index) => (
            <div
              key={image.id}
              className="snap-center flex-shrink-0 w-full relative bg-[#111]"
              style={{ aspectRatio: "3/4" }}
              onClick={() => openLightbox(index)}
            >
              {image.url && (
                <Image
                  src={image.url}
                  priority={index === 0}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>
        {hasThumbs && (
          <div className="flex justify-center gap-1.5 py-4 bg-[#0a0a0a]">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  activeIndex === index ? "w-6 bg-[#C9A84C]" : "w-[3px] bg-white/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== LIGHTBOX ===== */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-6 right-6 z-10 text-white/50 hover:text-white transition-colors p-2">
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
            </svg>
          </button>
          <div className="absolute top-6 left-6 text-white/30 text-sm tracking-wider font-light">
            {lightboxIndex + 1} / {images.length}
          </div>
          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); prevImage() }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/30 hover:text-white border border-white/10 hover:border-white/25 transition-all">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <div className="relative max-w-[85vw] max-h-[85vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            {images[lightboxIndex]?.url && (
              <Image src={images[lightboxIndex].url} alt="" fill sizes="85vw" className="object-contain" priority />
            )}
          </div>
          {images.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); nextImage() }} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-white/30 hover:text-white border border-white/10 hover:border-white/25 transition-all">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }} className={`relative w-14 h-14 overflow-hidden border transition-all duration-300 ${lightboxIndex === i ? "border-[#C9A84C] opacity-100" : "border-transparent opacity-30 hover:opacity-60"}`}>
                  {img.url && <Image src={img.url} alt="" fill sizes="56px" className="object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ImageGallery
