import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block h-full">
      <div
        data-testid="product-wrapper"
        className="flex flex-col h-full bg-white transition-all duration-500 overflow-hidden"
      >
        <div className="relative overflow-hidden aspect-[4/5]">
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/5" />
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-110">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
              className="!p-0 !bg-transparent !shadow-none !rounded-none"
            />
          </div>
          {isFeatured && (
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-[#C9A84C] text-[#0a0a0a] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1">
                ლუქსი დეტალი
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow pt-6 pb-2">
          <div className="flex flex-col gap-1 items-start">
            <Text
              className="text-sm font-medium tracking-tight text-[#1a1a1a] group-hover:text-[#C9A84C] transition-colors duration-300"
              data-testid="product-title"
            >
              {product.title}
            </Text>
            <div className="flex items-center gap-x-2">
              {cheapestPrice && (
                <div className="text-gray-500 font-light">
                  <PreviewPrice price={cheapestPrice} />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 w-0 group-hover:w-full h-[1px] bg-[#C9A84C] transition-all duration-500" />
        </div>
      </div>
    </LocalizedClientLink>
  )
}
