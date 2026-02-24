import { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

async function fetchFromMedusa(path: string) {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      headers: { "x-publishable-api-key": API_KEY },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  // Static pages
  entries.push(
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/store`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  )

  // Products
  const productsData = await fetchFromMedusa("/store/products?limit=100&fields=handle,updated_at")
  if (productsData?.products) {
    for (const product of productsData.products) {
      if (product.handle) {
        entries.push({
          url: `${BASE_URL}/products/${product.handle}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.8,
        })
      }
    }
  }

  // Categories
  const categoriesData = await fetchFromMedusa("/store/product-categories?limit=100&fields=handle,updated_at")
  if (categoriesData?.product_categories) {
    for (const cat of categoriesData.product_categories) {
      if (cat.handle) {
        entries.push({
          url: `${BASE_URL}/categories/${cat.handle}`,
          lastModified: cat.updated_at ? new Date(cat.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      }
    }
  }

  // Collections
  const collectionsData = await fetchFromMedusa("/store/collections?limit=100&fields=handle,updated_at")
  if (collectionsData?.collections) {
    for (const col of collectionsData.collections) {
      if (col.handle) {
        entries.push({
          url: `${BASE_URL}/collections/${col.handle}`,
          lastModified: col.updated_at ? new Date(col.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      }
    }
  }

  return entries
}
