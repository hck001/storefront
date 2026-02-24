"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import { useTranslation } from "@lib/i18n/i18n-context"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const { t } = useTranslation()

  const sortOptions = [
    {
      value: "created_at",
      label: t("store.sortNewest"),
    },
    {
      value: "price_asc",
      label: t("store.sortPriceLowHigh"),
    },
    {
      value: "price_desc",
      label: t("store.sortPriceHighLow"),
    },
  ]

  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterRadioGroup
      title={t("store.sortBy")}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
