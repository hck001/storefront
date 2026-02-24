import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Hero banner */}
      <div className="relative py-16 sm:py-20 overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #C9A84C 0%, transparent 50%)" }} />
        <div className="content-container relative z-10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">კოლექცია</span>
              <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">
              {collection.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-container py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-[240px] flex-shrink-0">
            <RefinementList sortBy={sort} />
          </aside>
          <div className="flex-1">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={collection.products?.length}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                collectionId={collection.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
