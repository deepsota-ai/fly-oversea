import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { getDictionary } from "@/lib/get-dictionary"

import { LandingFooter } from "@/app/[lang]/(plain-layout)/pages/landing/_components/layout/landing-footer"
import { LandingHeader } from "@/app/[lang]/(plain-layout)/pages/landing/_components/layout/landing-header"

export default async function MarketingLayout(props: {
  children: ReactNode
  params: Promise<{ lang: LocaleType }>
}) {
  const { children } = props
  const params = await props.params
  const dictionary = await getDictionary(params.lang)

  return (
    <div className="w-full min-h-screen flex flex-col">
      <LandingHeader dictionary={dictionary} />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  )
}
