"use client"

import LanguageSelect from "@modules/layout/components/language-select"
import { DEFAULT_LOCALE } from "@lib/i18n/constants"

type NavLanguageSelectProps = {
  currentLocale: string | null
}

const NavLanguageSelect = ({ currentLocale }: NavLanguageSelectProps) => {
  return (
    <div className="hidden sm:flex items-center">
      <LanguageSelect currentLocale={currentLocale || DEFAULT_LOCALE} />
    </div>
  )
}

export default NavLanguageSelect
