"use client"

import { useTranslation } from "@lib/i18n/i18n-context"

export default function StoreHeader() {
  const { t } = useTranslation()

  return (
    <div className="relative py-16 sm:py-20 overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #C9A84C 0%, transparent 50%)" }} />
      <div className="content-container relative z-10">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">{t("store.collection")}</span>
            <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white" data-testid="store-page-title">
            {t("store.allProducts")}
          </h1>
          <p className="text-white/40 text-sm font-light max-w-md">
            {t("store.allProductsDesc")}
          </p>
        </div>
      </div>
    </div>
  )
}
