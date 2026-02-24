import { Metadata } from "next"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { getServerDictionary } from "@lib/i18n/get-dictionary-server"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import ProductPreview from "@modules/products/components/product-preview"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HomeClientSections from "@modules/home/templates/home-client-sections"

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getServerDictionary()
  const title = `${dict.meta?.siteName} | ${dict.meta?.siteDesc?.split(".")[0]}`
  const description = dict.meta?.siteDesc || ""

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: dict.meta?.siteName || "Bag World",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const dict = await getServerDictionary()

  const [{ collections }, productCategories, productsData] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    listCategories(),
    listProducts({
      regionId: region.id,
      queryParams: { limit: 20, fields: "*variants.calculated_price" },
    }),
  ])

  const products = productsData.response.products

  const heroProducts = (products || [])
    .filter((p) => p.thumbnail)
    .slice(0, 6)
    .map((p) => {
      const variant = p.variants?.[0]
      const calcPrice = variant?.calculated_price
      let price: string | undefined
      if (calcPrice?.calculated_amount != null) {
        const amount = calcPrice.calculated_amount
        const code = calcPrice.currency_code?.toUpperCase() || ""
        price = `${amount} ${code}`
      }
      return {
        id: p.id,
        title: p.title || "",
        handle: p.handle || "",
        thumbnail: p.thumbnail,
        description: p.description,
        price,
      }
    })

  const categories = (productCategories || []).filter((c: any) => !c.parent_category)

  return (
    <>
      <Hero products={heroProducts} />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20" style={{ backgroundColor: "#0a0a0a" }}>
          <div className="content-container">
            <div className="flex flex-col items-center text-center gap-4 mb-14">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-10 bg-[#C9A84C]" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">
                  {dict.home?.categories}
                </span>
                <div className="h-[1px] w-10 bg-[#C9A84C]" />
              </div>
              <Text className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white">
                {dict.home?.chooseCategory}
              </Text>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((category: any) => (
                <LocalizedClientLink
                  key={category.id}
                  href={`/categories/${category.handle}`}
                  className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 py-10 sm:py-14 border border-white/[0.06] hover:border-[#C9A84C]/30 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.05]"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "radial-gradient(circle at center, rgba(201,168,76,0.06) 0%, transparent 70%)" }} />
                  <CategoryIcon handle={category.handle} />
                  <span className="text-xs sm:text-sm font-medium text-white/70 group-hover:text-white transition-colors tracking-wide text-center relative z-10">
                    {category.name}
                  </span>
                  <div className="w-0 group-hover:w-6 h-[1px] bg-[#C9A84C] transition-all duration-500" />
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="py-20" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="content-container">
          <div className="flex items-end justify-between mb-14">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-10 bg-[#C9A84C]" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">
                  {dict.home?.shop}
                </span>
              </div>
              <Text className="text-4xl lg:text-5xl font-extralight tracking-tight text-[#1a1a1a]">
                {dict.home?.featuredProducts}
              </Text>
              <p className="text-sm text-gray-400 font-light max-w-md">
                {dict.home?.featuredProductsDesc}
              </p>
            </div>
            <LocalizedClientLink
              href="/store"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:text-[#C9A84C] transition-colors group"
            >
              {dict.home?.allProducts}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </LocalizedClientLink>
          </div>

          {products && products.length > 0 ? (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product) => (
                <li key={product.id}>
                  <ProductPreview product={product} region={region} isFeatured />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-20" fill="none">
                  <path d="M25 30 C25 15, 55 15, 55 30" stroke="#C9A84C" strokeWidth="2" />
                  <rect x="15" y="30" width="50" height="35" rx="4" stroke="#C9A84C" strokeWidth="2" />
                </svg>
                <p className="text-gray-400 text-sm">{dict.common?.loading}</p>
              </div>
            </div>
          )}

          <div className="mt-12 text-center sm:hidden">
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#C9A84C] border border-[#C9A84C] px-8 py-3"
            >
              {dict.home?.viewAllProducts}
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      {/* Collections */}
      {collections && collections.length > 0 && (
        <section className="py-20 bg-white">
          <div className="content-container">
            <div className="flex items-end justify-between mb-14">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-10 bg-[#C9A84C]" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">
                    {dict.home?.collections}
                  </span>
                </div>
                <Text className="text-4xl lg:text-5xl font-extralight tracking-tight text-[#1a1a1a]">
                  {dict.home?.ourCollections}
                </Text>
              </div>
            </div>
            <ul className="flex flex-col">
              <FeaturedProducts collections={collections} region={region} />
            </ul>
          </div>
        </section>
      )}

      {/* Why Us + CTA — client component for translations */}
      <HomeClientSections />
    </>
  )
}

function CategoryIcon({ handle }: { handle: string }) {
  return (
    <svg viewBox="0 0 48 48" className="w-8 h-8 text-[#C9A84C]/70 group-hover:text-[#C9A84C] transition-all duration-500 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.2">
      {handle === "tote-bags" && (
        <>
          <path d="M14 20h20v18a2 2 0 01-2 18H16a2 2 0 01-2-2V20z" strokeLinejoin="round" />
          <path d="M18 20v-4a6 6 0 1112 0v4" strokeLinecap="round" />
        </>
      )}
      {handle === "crossbody-bags" && (
        <>
          <rect x="10" y="18" width="28" height="20" rx="3" strokeLinejoin="round" />
          <path d="M10 26h28" />
          <path d="M38 22c4-6 4-14-2-16" strokeLinecap="round" />
        </>
      )}
      {handle === "clutch-bags" && (
        <>
          <rect x="8" y="16" width="32" height="18" rx="3" strokeLinejoin="round" />
          <path d="M8 24h32" />
          <circle cx="24" cy="28" r="2" />
        </>
      )}
      {handle === "shoulder-bags" && (
        <>
          <path d="M12 22h24v16a2 2 0 01-2 2H14a2 2 0 01-2-2V22z" strokeLinejoin="round" />
          <path d="M12 26c-6-2-6-12 0-14" strokeLinecap="round" />
          <path d="M20 28h8" strokeLinecap="round" />
        </>
      )}
      {handle === "backpacks" && (
        <>
          <rect x="12" y="10" width="24" height="28" rx="4" strokeLinejoin="round" />
          <path d="M18 10v-2a6 6 0 1112 0v2" strokeLinecap="round" />
          <rect x="18" y="24" width="12" height="8" rx="1" />
        </>
      )}
      {!["tote-bags", "crossbody-bags", "clutch-bags", "shoulder-bags", "backpacks"].includes(handle) && (
        <>
          <path d="M14 20h20v18a2 2 0 01-2 2H16a2 2 0 01-2-2V20z" strokeLinejoin="round" />
          <path d="M18 20v-4a6 6 0 1112 0v4" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}
