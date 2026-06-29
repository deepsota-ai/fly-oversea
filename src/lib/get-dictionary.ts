// More info: https://nextjs.org/docs/app/building-your-application/routing/internationalization#localization
import "server-only"

import type { LocaleType } from "@/types"

const dictionaries = {
  zh: () =>
    import("@/data/dictionaries/zh.json").then((module) => module.default),
}

export async function getDictionary(locale: LocaleType) {
  return dictionaries[locale]()
}

export type DictionaryType = Awaited<ReturnType<typeof getDictionary>>
