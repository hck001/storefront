import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Hero banner */}
      <div className="relative py-16 sm:py-20 overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #C9A84C 0%, transparent 50%)" }} />
        <div className="content-container relative z-10">
          <div className="flex flex-col items-center text-center gap-4">
            {/* Breadcrumb */}
            {parents.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                {parents.reverse().map((parent) => (
                  <span key={parent.id} className="flex items-center gap-2">
                    <LocalizedClientLink
                      className="text-white/40 hover:text-[#C9A84C] transition-colors text-[12px] tracking-wide"
                      href={`/categories/${parent.handle}`}
                    >
                      {parent.name}
                    </LocalizedClientLink>
                    <span className="text-white/20">/</span>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">Category</span>
              <div className="h-[1px] w-8 bg-[#C9A84C]/40" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white" data-testid="category-page-title">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-white/40 text-sm font-light max-w-lg">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-container py-10 sm:py-14" data-testid="category-container">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-[240px] flex-shrink-0">
            <RefinementList sortBy={sort} data-testid="sort-by-container" />

            {/* Subcategories */}
            {category.category_children && category.category_children.length > 0 && (
              <div className="mt-6 bg-white border border-gray-100 p-6">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a1a1a] flex items-center gap-3 mb-5">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  Subcategories
                </span>
                <ul className="flex flex-col gap-2">
                  {category.category_children.map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/categories/${c.handle}`}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg text-[13px] text-gray-500 hover:text-[#1a1a1a] hover:bg-gray-50 transition-all duration-200"
                      >
                        <span className="text-[#C9A84C]/60">→</span>
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={category.products?.length ?? 8}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
