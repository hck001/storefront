"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslation } from "@lib/i18n/i18n-context"

export default function NavAccountLink() {
  const { t } = useTranslation()

  return (
    <LocalizedClientLink
      href="/account"
      className="hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-full text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
      data-testid="nav-account-link"
    >
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
      <span className="text-[12px] tracking-[0.05em] font-medium">{t("nav.account")}</span>
    </LocalizedClientLink>
  )
}
