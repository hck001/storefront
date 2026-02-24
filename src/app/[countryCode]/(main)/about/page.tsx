"use client"

import { useTranslation } from "@lib/i18n/i18n-context"

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAFA" }}>
      <div className="relative py-16 sm:py-20 overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #C9A84C 0%, transparent 50%)" }} />
        <div className="content-container relative z-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">{t("pages.aboutTag")}</span>
            <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">{t("pages.aboutTitle")}</h1>
        </div>
      </div>

      <div className="content-container py-14 sm:py-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium text-[#1a1a1a]">{t("pages.aboutBrand")}</h2>
            <p className="text-gray-500 text-[15px] leading-relaxed font-light">{t("pages.aboutBrandDesc")}</p>
          </div>
          <div className="h-[1px] bg-gray-100" />
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium text-[#1a1a1a]">{t("pages.aboutVision")}</h2>
            <p className="text-gray-500 text-[15px] leading-relaxed font-light">{t("pages.aboutVisionDesc")}</p>
          </div>
          <div className="h-[1px] bg-gray-100" />
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium text-[#1a1a1a]">{t("pages.aboutWhy")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
              {([
                ["aboutMaterial", "aboutMaterialDesc"],
                ["aboutHandmade", "aboutHandmadeDesc"],
                ["aboutWarranty", "aboutWarrantyDesc"],
                ["aboutFastDelivery", "aboutFastDeliveryDesc"],
              ] as const).map(([titleKey, descKey], i) => (
                <div key={i} className="p-5 border border-gray-100 bg-white">
                  <h3 className="text-sm font-semibold text-[#1a1a1a] mb-2">{t(`pages.${titleKey}`)}</h3>
                  <p className="text-gray-400 text-[13px] font-light leading-relaxed">{t(`pages.${descKey}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
