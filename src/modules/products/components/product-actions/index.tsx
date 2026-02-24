"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"
import { isSimpleProduct } from "@lib/util/product"
import { useTranslation } from "@lib/i18n/i18n-context"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({ product, disabled }: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null
    if (params.get("v_id") === value) return
    if (value) { params.set("v_id", value) } else { params.delete("v_id") }
    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    if (selectedVariant?.manage_inventory && (selectedVariant?.inventory_quantity || 0) > 0) return true
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return
    setIsAdding(true)
    for (let i = 0; i < quantity; i++) {
      await addToCart({ variantId: selectedVariant.id, quantity: 1, countryCode })
    }
    setIsAdding(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <div className="flex flex-col gap-y-5" ref={actionsRef}>
        {/* Options */}
        {(product.variants?.length ?? 0) > 1 && !isSimpleProduct(product) && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={!!disabled || isAdding}
                />
              </div>
            ))}
          </div>
        )}

        {/* Price */}
        <ProductPrice product={product} variant={selectedVariant} />

        {/* Quantity + Add to cart */}
        <div className="flex gap-3">
          {/* Quantity selector */}
          <div className="flex items-center border border-white/15 rounded">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              disabled={quantity <= 1}
            >
              <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10" strokeLinecap="round" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm text-white font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v10M3 8h10" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant}
            className="flex-1 h-12 flex items-center justify-center gap-2 text-xs tracking-[0.2em] font-bold uppercase transition-all duration-300 hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: added ? "#22c55e" : "#C9A84C", color: "#0a0a0a" }}
            data-testid="add-product-button"
          >
            {isAdding ? (
              <span className="inline-block w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
            ) : added ? (
              <>
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("product.addedToCart")}
              </>
            ) : !selectedVariant ? (
              t("product.select")
            ) : !inStock || !isValidVariant ? (
              t("product.outOfStock")
            ) : (
              <>
                <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h2l1.5 9h8L18 6H6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="8.5" cy="16" r="1.5" fill="currentColor" />
                  <circle cx="14.5" cy="16" r="1.5" fill="currentColor" />
                </svg>
                {t("product.addToCart")}
              </>
            )}
          </button>
        </div>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          added={added}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />

        {/* Toast notification for mobile */}
        <div
          className={`lg:hidden fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out ${
            added ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[#22c55e] text-[#0a0a0a]">
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8l4 4 6-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">{t("product.addedToCart")}</span>
          </div>
        </div>
      </div>
    </>
  )
}
