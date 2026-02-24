import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { getServerDictionary } from "@lib/i18n/get-dictionary-server"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  const dict = await getServerDictionary()

  return (
    <div className="py-10">
      <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-5">
        <Text className="text-2xl font-light tracking-tight text-[#1a1a1a]">
          {collection.title}
        </Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          {dict.home?.allProducts || "View All"} →
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {pricedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}
