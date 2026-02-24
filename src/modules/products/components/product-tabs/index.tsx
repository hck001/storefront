"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "@lib/i18n/i18n-context"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [openTab, setOpenTab] = useState<string | null>(null)
  const { t } = useTranslation()

  const toggle = (tab: string) => {
    setOpenTab(openTab === tab ? null : tab)
  }

  const tabs = [
    {
      key: "description",
      label: t("productTabs.description"),
      content: (
        <div className="text-sm text-white/60 leading-relaxed space-y-3">
          {product.description && <p>{product.description}</p>}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {product.material && (
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider">{t("product.material")}</span>
                <p className="text-white/70 mt-1">{product.material}</p>
              </div>
            )}
            {product.origin_country && (
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider">{t("product.origin")}</span>
                <p className="text-white/70 mt-1">{product.origin_country}</p>
              </div>
            )}
            {product.weight && (
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider">{t("product.weight")}</span>
                <p className="text-white/70 mt-1">{product.weight} {t("product.weightUnit")}</p>
              </div>
            )}
            {product.length && product.width && product.height && (
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider">{t("product.dimensions")}</span>
                <p className="text-white/70 mt-1">{product.length} × {product.width} × {product.height} {t("product.dimensionUnit")}</p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "shipping",
      label: t("productTabs.shippingAndReturns"),
      content: (
        <div className="text-sm text-white/60 leading-relaxed space-y-4">
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1m8-1a1 1 0 0 1-1 1H9m4-1V8a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l3.414 3.414a1 1 0 0 1 .293.707V16a1 1 0 0 1-1 1h-1m-6-1a1 1 0 0 0 1 1h1M5 17a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m6 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="text-white/80 font-medium">{t("productTabs.fastShipping")}</p>
              <p>{t("productTabs.fastShippingDesc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16 15v-1a4 4 0 0 0-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="text-white/80 font-medium">{t("productTabs.easyReturns")}</p>
              <p>{t("productTabs.easyReturnsDesc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#C9A84C] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="text-white/80 font-medium">{t("productTabs.qualityGuarantee")}</p>
              <p>{t("productTabs.qualityGuaranteeDesc")}</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="w-full border-t border-white/10">
      {tabs.map((tab) => (
        <div key={tab.key} className="border-b border-white/10">
          <button
            onClick={() => toggle(tab.key)}
            className="w-full flex items-center justify-between py-4 text-sm font-medium text-white/80 hover:text-[#C9A84C] transition-colors"
          >
            {tab.label}
            <svg
              viewBox="0 0 16 16"
              className={`w-4 h-4 transition-transform duration-300 ${openTab === tab.key ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openTab === tab.key ? "max-h-[500px] pb-6" : "max-h-0"
            }`}
          >
            {tab.content}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductTabs
