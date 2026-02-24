import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listCollections } from "@lib/data/collections"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import InstantSearch from "@modules/layout/components/instant-search"
import MegaMenu from "@modules/layout/components/mega-menu"
import NavLanguageSelect from "@modules/layout/components/nav-language-select"
import NavAccountLink from "@modules/layout/components/nav-actions"
import { getServerDictionary } from "@lib/i18n/get-dictionary-server"

export default async function Nav() {
  const [regions, currentLocale, collectionsData, dict] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    getLocale(),
    listCollections({ fields: "id,handle,title", limit: 10 }),
    getServerDictionary(),
  ])

  const collections = (collectionsData?.collections || []).map((c) => ({
    id: c.id,
    handle: c.handle || "",
    title: c.title || "",
  }))

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative mx-auto overflow-visible" style={{ backgroundColor: "rgba(5,5,5,0.97)" }}>
        <div className="absolute inset-0 pointer-events-none -z-10" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }} />

        {/* ── Top Bar ── */}
        <div className="bg-[#1a1a1a] border-b border-white/[0.06]">
          <div className="content-container flex items-center justify-between py-1.5 h-8 gap-2">
            <div className="flex items-center gap-4 text-white/80 text-[11px] sm:text-[12px] font-medium flex-shrink-0">
              <NavLanguageSelect currentLocale={currentLocale} />
            </div>
            <div className="text-white/60 text-[10px] sm:text-[11.5px] font-medium text-right tracking-wide truncate max-w-[70%] sm:max-w-none">
              {dict?.nav?.freeShippingPromo || "Free shipping on orders over 500 GEL"}
            </div>
          </div>
        </div>

        {/* Top accent line */}
        <div className="h-[1px] bg-gradient-to-r from-[#C9A84C]/20 via-[#C9A84C]/40 to-[#C9A84C]/20" />

        {/* ── Row 1: Logo + Search + Actions ── */}
        <nav className="content-container flex items-center justify-between w-full h-14 sm:h-16 gap-2 sm:gap-4">

          {/* Left - Hamburger + Logo */}
          <div className="flex items-center gap-2 sm:gap-3 h-full flex-shrink-0">
            <div className="flex h-full items-center lg:hidden">
              <SideMenu regions={regions} currentLocale={currentLocale} />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center"
              data-testid="nav-store-link"
            >
              <img src="/logo.svg" alt="Bags" className="h-9 sm:h-11 w-auto" />
            </LocalizedClientLink>
          </div>

          {/* Center - Search (desktop) */}
          <div className="hidden lg:flex flex-1 justify-center px-4 md:px-8">
            <div className="w-full max-w-[600px]">
              <InstantSearch />
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-1 sm:gap-3 h-full flex-shrink-0 overflow-visible">
            {/* Account */}
            <NavAccountLink />

            {/* Cart */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="relative flex items-center gap-2 px-2 py-2 text-white/70 hover:text-white transition-all duration-300"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <span className="relative inline-flex">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinejoin="round" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" />
                    </svg>
                    <span className="absolute -top-1.5 -right-1.5 bg-[#C9A84C] text-black text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-0.5">0</span>
                  </span>
                  <span className="hidden sm:inline text-[12px] tracking-[0.05em] font-medium">Cart</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        {/* Mobile Search Row */}
        <div className="lg:hidden content-container w-full pb-3 border-b border-white/[0.06] mt-[-4px]">
          <InstantSearch />
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-[1px] bg-white/[0.06]" />

        {/* ── Row 2: Mega Menu (desktop) ── */}
        <div className="hidden lg:block">
          <MegaMenu collections={collections} />
        </div>

        {/* Bottom border */}
        <div className="h-[1px] bg-white/[0.04]" />
      </header>
    </div>
  )
}
