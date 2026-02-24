import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
  siblings?: {
    prev: { handle: string; title: string } | null
    next: { handle: string; title: string } | null
  }
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
  siblings,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-4 pb-3">
        <nav className="flex items-center gap-2 text-[11px] tracking-wider">
          <LocalizedClientLink href="/" className="text-white/30 hover:text-[#C9A84C] transition-colors uppercase">
            Home
          </LocalizedClientLink>
          <span className="text-white/10">/</span>
          <LocalizedClientLink href="/store" className="text-white/30 hover:text-[#C9A84C] transition-colors uppercase">
            Shop
          </LocalizedClientLink>
          {product.collection && (
            <>
              <span className="text-white/10">/</span>
              <LocalizedClientLink
                href={`/collections/${product.collection.handle}`}
                className="text-white/30 hover:text-[#C9A84C] transition-colors uppercase"
              >
                {product.collection.title}
              </LocalizedClientLink>
            </>
          )}
          <span className="text-white/10">/</span>
          <span className="text-white/50">{product.title}</span>
        </nav>
      </div>

      {/* Main product area — edge-to-edge on desktop */}
      <div data-testid="product-container">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[55%] xl:w-[58%] bg-[#111]">
            <ImageGallery images={images} />
          </div>

          {/* Right: Product info — sticky, scrollable, subtle bg difference */}
          <div className="w-full lg:w-[45%] xl:w-[42%] border-l border-white/[0.04]">
            <div className="lg:sticky lg:top-[74px] lg:h-[calc(100vh-74px)] lg:overflow-y-auto no-scrollbar">
              <div className="px-5 sm:px-8 lg:px-10 xl:px-14 py-6 lg:py-10 flex flex-col gap-7">

                {/* Prev / Next product navigation */}
                {siblings && (siblings.prev || siblings.next) && (
                  <div className="flex items-center justify-between text-[11px] tracking-wider">
                    {siblings.prev ? (
                      <LocalizedClientLink
                        href={`/products/${siblings.prev.handle}`}
                        className="text-white/25 hover:text-[#C9A84C] transition-colors uppercase flex items-center gap-1.5"
                        title={siblings.prev.title}
                      >
                        <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M10 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Prev
                      </LocalizedClientLink>
                    ) : <span />}
                    {siblings.next ? (
                      <LocalizedClientLink
                        href={`/products/${siblings.next.handle}`}
                        className="text-white/25 hover:text-[#C9A84C] transition-colors uppercase flex items-center gap-1.5"
                        title={siblings.next.title}
                      >
                        Next
                        <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </LocalizedClientLink>
                    ) : <span />}
                  </div>
                )}

                <ProductInfo product={product} />

                <div className="h-[1px] bg-white/[0.06]" />

                {/* Actions */}
                <Suspense
                  fallback={
                    <ProductActions
                      disabled={true}
                      product={product}
                      region={region}
                    />
                  }
                >
                  <ProductActionsWrapper id={product.id} region={region} />
                </Suspense>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: "M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1m8-1a1 1 0 0 1-1 1H9m4-1V8a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l3.414 3.414a1 1 0 0 1 .293.707V16a1 1 0 0 1-1 1h-1m-6-1a1 1 0 0 0 1 1h1M5 17a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m6 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0", label: "Free Shipping" },
                    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "2 Year Warranty" },
                    { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15", label: "14 Day Returns" },
                  ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 py-3 border border-white/[0.06] hover:border-[#C9A84C]/20 transition-colors">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d={badge.icon} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[8px] uppercase tracking-wider text-white/35 text-center leading-tight">{badge.label}</span>
                    </div>
                  ))}
                </div>

                <div className="h-[1px] bg-white/[0.06]" />

                <ProductTabs product={product} />

                {/* Share */}
                <div className="flex items-center gap-4 pt-1 pb-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/25">Share</span>
                  <div className="flex gap-2">
                    {["facebook", "twitter", "pinterest"].map((social) => (
                      <button key={social} className="w-8 h-8 flex items-center justify-center text-white/20 hover:text-[#C9A84C] border border-white/[0.06] hover:border-[#C9A84C]/30 transition-all">
                        {social === "facebook" && (
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        )}
                        {social === "twitter" && (
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        )}
                        {social === "pinterest" && (
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" /></svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="border-t border-white/[0.04]">
        <div className="content-container py-16" data-testid="related-products-container">
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate
