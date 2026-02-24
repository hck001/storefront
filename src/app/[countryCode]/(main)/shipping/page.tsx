"use client"

import { useTranslation } from "@lib/i18n/i18n-context"

export default function ShippingPage() {
  const { t } = useTranslation()

  const sections = [
    ["shippingTime", "shippingTimeDesc"],
    ["shippingCost", "shippingCostDesc"],
    ["shippingPackaging", "shippingPackagingDesc"],
    ["shippingTracking", "shippingTrackingDesc"],
  ] as const

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAFA" }}>
      <div className="relative py-16 sm:py-20 overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #C9A84C 0%, transparent 50%)" }} />
        <div className="content-container relative z-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">{t("pages.shippingTag")}</span>
            <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">{t("pages.shippingTitle")}</h1>
        </div>
      </div>

      <div className="content-container py-14 sm:py-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          {sections.map(([titleKey, descKey], i) => (
            <div key={i} className="flex flex-col gap-3">
              <h2 className="text-lg font-medium text-[#1a1a1a]">{t(`pages.${titleKey}`)}</h2>
              <p className="text-gray-500 text-[15px] leading-relaxed font-light">{t(`pages.${descKey}`)}</p>
              {i < sections.length - 1 && <div className="h-[1px] bg-gray-100 mt-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
