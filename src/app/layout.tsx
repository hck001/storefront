import { getLocale } from "@lib/data/locale-actions"
import { DEFAULT_LOCALE } from "@lib/i18n/constants"
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import Script from "next/script"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "ჩანთების სამყარო | Bag World",
  description: "ხელნაკეთი, პრემიუმ ტყავის ჩანთები. Handcrafted premium leather bags.",
  openGraph: {
    type: "website",
    siteName: "Bag World | ჩანთების სამყარო",
    locale: "ka_GE",
    alternateLocale: ["en_US", "ru_RU"],
  },
  twitter: {
    card: "summary_large_image",
  },
}

const localeToLang: Record<string, string> = {
  "ka-GE": "ka",
  "en-US": "en",
  "ru-RU": "ru",
}

export default async function RootLayout(props: {
  children: React.ReactNode
}) {
  const locale = (await getLocale()) ?? DEFAULT_LOCALE
  const lang = localeToLang[locale] ?? "ka"

  return (
    <html lang={lang} data-mode="light" suppressHydrationWarning>
      <head>
        <Script
          id="remove-ext-attrs"
          strategy="beforeInteractive"
        >{`
          new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
              if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                m.target.removeAttribute('bis_skin_checked');
              }
            });
          }).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['bis_skin_checked'],
            subtree: true
          });
        `}</Script>
      </head>
      <body suppressHydrationWarning>
        <main className="relative overflow-x-hidden">{props.children}</main>
      </body>
    </html>
  )
}
