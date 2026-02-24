"use client"

import { useTranslation } from "@lib/i18n/i18n-context"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function HomeClientSections() {
  const { t } = useTranslation()

  return (
    <>
      {/* Why Us */}
      <section className="py-24" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="content-container">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="h-[1px] w-10 bg-[#C9A84C]" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">
                {t("home.ourDifference")}
              </span>
              <div className="h-[1px] w-10 bg-[#C9A84C]" />
            </div>
            <Text className="text-4xl lg:text-5xl font-extralight tracking-tight text-white">
              {t("home.whyBagWorld")}
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                    <path d="M24 4L4 14v20l20 10 20-10V14L24 4z" stroke="#C9A84C" strokeWidth="1.5" />
                    <path d="M4 14l20 10 20-10" stroke="#C9A84C" strokeWidth="1.5" />
                    <path d="M24 44V24" stroke="#C9A84C" strokeWidth="1.5" />
                  </svg>
                ),
                title: t("home.premiumMaterials"),
                desc: t("home.premiumMaterialsDesc"),
              },
              {
                icon: (
                  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="#C9A84C" strokeWidth="1.5" />
                    <path d="M16 24c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="#C9A84C" strokeWidth="1.5" />
                    <circle cx="24" cy="24" r="3" fill="#C9A84C" />
                  </svg>
                ),
                title: t("home.masterCraftsmanship"),
                desc: t("home.masterCraftsmanshipDesc"),
              },
              {
                icon: (
                  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                    <path d="M12 28l8 8 16-20" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="4" y="4" width="40" height="40" rx="8" stroke="#C9A84C" strokeWidth="1.5" />
                  </svg>
                ),
                title: t("home.qualityGuarantee"),
                desc: t("home.qualityGuaranteeDesc"),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-10 border border-white/5 hover:border-[#C9A84C]/30 transition-all duration-500 group"
              >
                <div className="mb-6 opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.icon}
                </div>
                <h3 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-20 text-center"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)",
        }}
      >
        <div className="content-container">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#C9A84C] font-bold">
              {t("home.specialOffers")}
            </span>
            <Text className="text-3xl lg:text-4xl font-extralight text-white tracking-tight">
              {t("home.firstPurchaseOffer")}
              <span className="text-[#C9A84C] font-semibold italic">{t("home.firstPurchaseDiscount")}</span>
              {t("home.firstPurchaseEnd")}
            </Text>
            <p className="text-gray-500 text-sm font-light">
              {t("home.firstPurchaseDesc")}
            </p>
            <LocalizedClientLink href="/store">
              <button
                className="mt-4 px-14 py-4 text-xs tracking-[0.2em] font-bold uppercase transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "#C9A84C",
                  color: "#0a0a0a",
                }}
              >
                {t("home.startShopping")}
              </button>
            </LocalizedClientLink>
          </div>
        </div>
      </section>
    </>
  )
}
