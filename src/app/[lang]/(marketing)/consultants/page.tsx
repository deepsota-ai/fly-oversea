import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { LocaleType } from "@/types"

import { buttonVariants } from "@/components/ui/button"
import { ConsultantsSection } from "@/app/[lang]/(plain-layout)/pages/landing/_components/consultants-section"

export default async function ConsultantsPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params

  return (
    <div className="py-8 space-y-10 sm:py-12 sm:space-y-14 lg:py-16 lg:space-y-16 bg-muted/40">
      <ConsultantsSection />
      <section className="container text-center space-y-4">
        <p className="text-muted-foreground">选好顾问了？马上预约免费咨询！</p>
        <Link
          href={`/${params.lang}/pages/book`}
          className={buttonVariants({ size: "lg" })}
        >
          免费预约咨询
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
