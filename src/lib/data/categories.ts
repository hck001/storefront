import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  // First, get category IDs from products (filtered by publishable key / sales channel)
  const { products } = await sdk.client.fetch<{
    products: { categories?: { id: string }[] }[]
  }>("/store/products", {
    query: {
      fields: "categories.id",
      limit: 200,
    },
    next,
    cache: "force-cache",
  })

  const validCategoryIds = new Set<string>()
  products?.forEach((p) => {
    p.categories?.forEach((c) => validCategoryIds.add(c.id))
  })

  if (validCategoryIds.size === 0) {
    return []
  }

  // Then fetch full category data, filtered to only those with products in this sales channel
  const { product_categories } = await sdk.client.fetch<{
    product_categories: HttpTypes.StoreProductCategory[]
  }>("/store/product-categories", {
    query: {
      fields:
        "*category_children, *products, *parent_category, *parent_category.parent_category",
      id: [...validCategoryIds],
      limit,
      ...query,
    },
    next,
    cache: "force-cache",
  })

  return product_categories
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
