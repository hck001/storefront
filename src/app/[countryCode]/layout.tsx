import { getLocale } from "@lib/data/locale-actions"
import { DEFAULT_LOCALE } from "@lib/i18n/constants"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { I18nProvider } from "@lib/i18n/i18n-context"

export default async function CountryCodeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = (await getLocale()) ?? DEFAULT_LOCALE
  const dictionary = await getDictionary(locale)

  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      {children}
    </I18nProvider>
  )
}
