import { Metadata } from "next"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getServerDictionary } from "@lib/i18n/get-dictionary-server"
import CollectionsPageContent from "@modules/collections/templates/collections-page-content"

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getServerDictionary()
  const title = dict.meta?.collectionsTitle || "Collections"
  const description = dict.meta?.collectionsDesc || ""
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: dict.meta?.siteName || "Bag World",
    },
  }
}

export default async function CollectionsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    return null
  }

  const { collections } = await listCollections({
    fields: "id,handle,title",
  })

  return <CollectionsPageContent collections={collections || []} />
}
