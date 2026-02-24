"use client"

import { createContext, useContext, useCallback } from "react"

type Dictionary = Record<string, Record<string, string>>

type I18nContextType = {
  locale: string
  dictionary: Dictionary
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: string
  dictionary: Dictionary
  children: React.ReactNode
}) {
  const t = useCallback(
    (key: string): string => {
      const [section, field] = key.split(".")
      return dictionary[section]?.[field] ?? key
    },
    [dictionary]
  )

  return (
    <I18nContext.Provider value={{ locale, dictionary, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }
  return context
}
