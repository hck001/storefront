"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslation } from "@lib/i18n/i18n-context"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { t } = useTranslation()

  const hasStock = product.variants?.some(
    (v) => !v.manage_inventory || (v.inventory_quantity ?? 0) > 0 || v.allow_backorder
  )

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4">
        {/* Collection link */}
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] hover:text-[#C9A84C]/80 transition-colors font-semibold"
          >
            <div className="w-5 h-[1px] bg-[#C9A84C]" />
            {product.collection.title}
          </LocalizedClientLink>
        )}

        {/* Title */}
        <h1
          className="text-3xl lg:text-4xl font-extralight text-white tracking-tight leading-tight"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        {/* Stock indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${hasStock ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
          <span className={`text-xs tracking-wider ${hasStock ? "text-emerald-400/80" : "text-red-400/80"}`}>
            {hasStock ? t("product.inStock") : t("product.outOfStock")}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p
            className="text-sm text-white/50 leading-relaxed whitespace-pre-line"
            data-testid="product-description"
          >
            {product.description}
          </p>
        )}

        {/* Quick specs */}
        {(product.material || product.origin_country) && (
          <div className="flex flex-wrap gap-3 pt-1">
            {product.material && (
              <span className="text-[10px] uppercase tracking-wider text-white/30 border border-white/10 px-3 py-1.5 rounded-full">
                {product.material}
              </span>
            )}
            {product.origin_country && (
              <span className="text-[10px] uppercase tracking-wider text-white/30 border border-white/10 px-3 py-1.5 rounded-full">
                🇮🇹 {product.origin_country}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
