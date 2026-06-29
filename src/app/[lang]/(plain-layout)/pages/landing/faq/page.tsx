import type { LocaleType } from "@/types"

import { ContactUs } from "../_components/contact-us"
import { Faqs } from "../_components/faqs"

export default async function FaqPage(_props: {
  params: Promise<{ lang: LocaleType }>
}) {
  return (
    <div className="py-16 space-y-16 bg-muted/40">
      <section className="container text-center space-y-1.5">
        <h1 className="text-4xl font-semibold">常见问题</h1>
        <p className="text-muted-foreground text-sm">
          解答您在留学申请路上最常遇到的疑问
        </p>
      </section>
      <Faqs />
      <ContactUs />
    </div>
  )
}
