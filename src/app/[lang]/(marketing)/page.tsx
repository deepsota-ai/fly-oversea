import type { LocaleType } from "@/types"

import { ConsultantsSection } from "@/app/[lang]/(plain-layout)/pages/landing/_components/consultants-section"
import { ContactUs } from "@/app/[lang]/(plain-layout)/pages/landing/_components/contact-us"
import { CoreBenefits } from "@/app/[lang]/(plain-layout)/pages/landing/_components/core-benefits"
import { CoreFeatures } from "@/app/[lang]/(plain-layout)/pages/landing/_components/core-features"
import { Faqs } from "@/app/[lang]/(plain-layout)/pages/landing/_components/faqs"
import { Hero } from "@/app/[lang]/(plain-layout)/pages/landing/_components/hero"
import { TestimonialsSection } from "@/app/[lang]/(plain-layout)/pages/landing/_components/testimonials-section"

export default async function HomePage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params

  return (
    <div className="py-8 space-y-10 sm:py-12 sm:space-y-14 lg:py-16 lg:space-y-16 bg-muted/40">
      <Hero lang={params.lang} />
      <CoreBenefits />
      <CoreFeatures />
      <ConsultantsSection />
      <TestimonialsSection />
      <Faqs />
      <ContactUs />
    </div>
  )
}
