"use client"

import { useState, useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslation } from "@lib/i18n/i18n-context"

type NavItem = {
  nameKey: string
  href: string
  highlight?: boolean
  children?: { nameKey: string; href: string }[]
}

type MegaMenuProps = {
  collections?: { id: string; handle: string; title: string }[]
}

const navItems: NavItem[] = [
  { nameKey: "nav.shop", href: "/store" },
  {
    nameKey: "nav.bags",
    href: "/categories/tote-bags",
    children: [
      { nameKey: "nav.toteBags", href: "/categories/tote-bags" },
      { nameKey: "nav.crossbody", href: "/categories/crossbody-bags" },
      { nameKey: "nav.clutch", href: "/categories/clutch-bags" },
      { nameKey: "nav.shoulderBags", href: "/categories/shoulder-bags" },
      { nameKey: "nav.backpacks", href: "/categories/backpacks" },
    ],
  },
  { nameKey: "nav.crossbody", href: "/categories/crossbody-bags" },
  { nameKey: "nav.clutch", href: "/categories/clutch-bags" },
  { nameKey: "nav.backpacks", href: "/categories/backpacks" },
]

export default function MegaMenu({ collections }: MegaMenuProps) {
  const { t } = useTranslation()
  const [active, setActive] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActive(key)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setActive(null), 150)
  }

  const activeItem = navItems.find((item) => item.nameKey === active)
  const showMega = activeItem?.children && activeItem.children.length > 0

  return (
    <div className="hidden lg:flex items-center h-full" onMouseLeave={handleLeave}>
      <div className="flex items-center h-full">
        {navItems.map((item) => (
          <div
            key={item.nameKey}
            className="h-full"
            onMouseEnter={() => handleEnter(item.nameKey)}
          >
            <LocalizedClientLink
              href={item.href}
              className={`relative px-4 xl:px-5 h-full flex items-center text-[13px] xl:text-[14px] tracking-[0.06em] uppercase font-semibold transition-all duration-200 ${
                item.highlight
                  ? "text-[#e74c3c] hover:text-[#ff6b5b]"
                  : active === item.nameKey
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {t(item.nameKey)}
              {active === item.nameKey && !item.highlight && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-3/4 bg-[#C9A84C]" />
              )}
            </LocalizedClientLink>
          </div>
        ))}
      </div>

      {/* Mega dropdown */}
      {showMega && activeItem?.children && (
        <div
          className="absolute top-full left-0 right-0 z-50"
          onMouseEnter={() => handleEnter(activeItem.nameKey)}
          onMouseLeave={handleLeave}
          style={{ animation: "megaIn 0.25s ease-out" }}
        >
          <div style={{ backgroundColor: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)" }}>
            <div className="content-container py-10">
              <div className="flex gap-16">
                {/* Categories + Collections */}
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold mb-6 block">
                    {t("nav.categories")}
                  </span>
                  <div className="grid grid-cols-3 gap-x-12 gap-y-4">
                    {activeItem.children.map((child) => (
                      <LocalizedClientLink
                        key={child.nameKey}
                        href={child.href}
                        className="text-white/50 text-[14px] font-medium uppercase tracking-[0.05em] hover:text-white transition-colors duration-200 py-1"
                        onClick={() => setActive(null)}
                      >
                        {t(child.nameKey)}
                      </LocalizedClientLink>
                    ))}
                  </div>

                  {/* Collections */}
                  {collections && collections.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/[0.06]">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold mb-4 block">
                        {t("footer.collections")}
                      </span>
                      <div className="grid grid-cols-3 gap-x-12 gap-y-3">
                        {collections.map((col) => (
                          <LocalizedClientLink
                            key={col.id}
                            href={`/collections/${col.handle}`}
                            className="text-white/50 text-[13px] font-medium tracking-[0.03em] hover:text-white transition-colors duration-200 py-1"
                            onClick={() => setActive(null)}
                          >
                            {col.title}
                          </LocalizedClientLink>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-white/[0.06]">
                    <LocalizedClientLink
                      href="/store"
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#C9A84C] font-semibold hover:text-[#d4b65e] transition-colors"
                      onClick={() => setActive(null)}
                    >
                      {t("nav.viewAllProducts")}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </LocalizedClientLink>
                  </div>
                </div>

                {/* Featured image */}
                <div className="w-[280px] h-[220px] relative rounded-lg overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-white text-xs font-medium uppercase tracking-wider">{t("nav.newCollection")}</span>
                  </div>
                  <div className="w-full h-full bg-[#1a1a1a]" />
                </div>
              </div>
            </div>
          </div>
          <div className="h-[1px] bg-white/[0.04]" />
        </div>
      )}
    </div>
  )
}
