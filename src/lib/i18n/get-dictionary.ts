import { SupportedLocale, DEFAULT_LOCALE } from "./constants"

type Dictionary = Record<string, Record<string, string>>

const dictionaries: Record<SupportedLocale, () => Promise<Dictionary>> = {
  "ka-GE": () => import("./dictionaries/ka-GE.json").then((m) => m.default),
  "en-US": () => import("./dictionaries/en-US.json").then((m) => m.default),
  "ru-RU": () => import("./dictionaries/ru-RU.json").then((m) => m.default),
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  const key = locale as SupportedLocale
  const loader = dictionaries[key] ?? dictionaries[DEFAULT_LOCALE]
  return loader()
}
