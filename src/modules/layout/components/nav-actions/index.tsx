"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslation } from "@lib/i18n/i18n-context"

export default function NavAccountLink() {
  const { t } = useTranslation()

  return (
    <LocalizedClientLink
      href="/account"
      className="flex items-center gap-2 px-2 py-2 text-white/70 hover:text-white transition-all duration-300"
      data-testid="nav-account-link"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
      <span className="hidden sm:inline text-[12px] tracking-[0.05em] font-medium">{t("nav.account")}</span>
    </LocalizedClientLink>
  )
}
