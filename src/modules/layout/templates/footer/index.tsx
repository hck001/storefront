import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import FooterContent from "./footer-content"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  const safeCollections = (collections || []).map((c) => ({
    id: c.id,
    handle: c.handle || "",
    title: c.title || "",
  }))

  const safeCategories = (productCategories || []).map((c) => ({
    id: c.id,
    handle: c.handle || "",
    name: c.name || "",
    parent_category: c.parent_category,
  }))

  return (
    <FooterContent
      collections={safeCollections}
      productCategories={safeCategories}
    />
  )
}
