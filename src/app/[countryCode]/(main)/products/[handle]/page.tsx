import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { getServerDictionary } from "@lib/i18n/get-dictionary-server"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const dict = await getServerDictionary()
  const siteName = dict.meta?.siteName || "Bag World"
  const productTitle = product.title || ""
  const productDesc = product.description || productTitle

  return {
    title: `${productTitle} | ${siteName}`,
    description: productDesc,
    openGraph: {
      title: productTitle,
      description: productDesc,
      type: "website",
      siteName,
      images: product.thumbnail
        ? [{ url: product.thumbnail, width: 1200, height: 630, alt: productTitle }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: productTitle,
      description: productDesc,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  // Fetch current product + all product handles for prev/next navigation
  const [currentProduct, allProducts] = await Promise.all([
    listProducts({
      countryCode: params.countryCode,
      queryParams: { handle: params.handle },
    }).then(({ response }) => response.products[0]),
    listProducts({
      countryCode: params.countryCode,
      queryParams: { limit: 200, fields: "handle,title" },
    }).then(({ response }) => response.products),
  ])

  if (!currentProduct) {
    notFound()
  }

  const images = getImagesForVariant(currentProduct, selectedVariantId)

  // Find prev/next products
  const currentIndex = allProducts.findIndex((p) => p.handle === params.handle)
  const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : allProducts[allProducts.length - 1]
  const nextProduct = currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : allProducts[0]

  const siblings = {
    prev: prevProduct?.handle !== params.handle ? { handle: prevProduct.handle, title: prevProduct.title } : null,
    next: nextProduct?.handle !== params.handle ? { handle: nextProduct.handle, title: nextProduct.title } : null,
  }

  return (
    <ProductTemplate
      product={currentProduct}
      region={region}
      countryCode={params.countryCode}
      images={images}
      siblings={siblings}
    />
  )
}
