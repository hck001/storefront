"use client"

import { useTranslation } from "@lib/i18n/i18n-context"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Collection = { id: string; handle?: string; title?: string }

export default function CollectionsPageContent({
  collections,
}: {
  collections: Collection[]
}) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="py-16 sm:py-20">
        <div className="content-container">
          <div className="flex flex-col items-center text-center gap-4 mb-14">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-10 bg-[#C9A84C]" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold">
                {t("home.collections")}
              </span>
              <div className="h-[1px] w-10 bg-[#C9A84C]" />
            </div>
            <Text className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white">
              {t("home.ourCollections")}
            </Text>
          </div>

          {collections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <LocalizedClientLink
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="group relative flex flex-col items-center justify-center gap-4 py-16 border border-white/[0.06] hover:border-[#C9A84C]/30 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.05]"
                >
                  <span className="text-lg font-light text-white/70 group-hover:text-white transition-colors tracking-wide">
                    {collection.title}
                  </span>
                  <div className="w-0 group-hover:w-8 h-[1px] bg-[#C9A84C] transition-all duration-500" />
                </LocalizedClientLink>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-sm">{t("common.loading")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
