import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { getServerDictionary } from "@lib/i18n/get-dictionary-server"

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getServerDictionary()
  const title = dict.meta?.storeTitle || "Shop"
  const description = dict.meta?.storeDesc || ""
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

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
