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

export default async function Nav() {
  const [regions, currentLocale, collectionsData] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    getLocale(),
    listCollections({ fields: "id,handle,title", limit: 10 }),
  ])

  const collections = (collectionsData?.collections || []).map((c) => ({
    id: c.id,
    handle: c.handle || "",
    title: c.title || "",
  }))

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative mx-auto overflow-visible" style={{ backgroundColor: "rgba(5,5,5,0.95)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}>
        {/* Top accent line */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

        <nav className="content-container flex items-center justify-between w-full h-16 sm:h-[72px]">
          {/* Left - Logo + Mobile menu */}
          <div className="flex items-center gap-6 h-full flex-shrink-0">
            <div className="lg:hidden h-full">
              <SideMenu regions={regions} currentLocale={currentLocale} />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center"
              data-testid="nav-store-link"
            >
              <img src="/logo.svg" alt="Bags" className="h-10 sm:h-12 w-auto" />
            </LocalizedClientLink>
          </div>

          {/* Center - Mega Menu (desktop) */}
          <MegaMenu collections={collections} />

          {/* Right - Actions */}
          <div className="flex items-center gap-2 sm:gap-3 h-full flex-shrink-0 overflow-visible">
            {/* Search */}
            <InstantSearch />

            {/* Language Switcher */}
            <NavLanguageSelect currentLocale={currentLocale} />

            {/* Divider */}
            <div className="hidden sm:block w-[1px] h-5 bg-white/[0.08]" />

            {/* Account */}
            <NavAccountLink />

            {/* Divider */}
            <div className="hidden sm:block w-[1px] h-5 bg-white/[0.08]" />

            {/* Cart */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center gap-2.5 px-3 py-2 rounded-full text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinejoin="round" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" />
                  </svg>
                  <span className="text-[12px] tracking-[0.05em] font-medium">Cart (0)</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        {/* Bottom border */}
        <div className="h-[1px] bg-white/[0.04]" />
      </header>
    </div>
  )
}
