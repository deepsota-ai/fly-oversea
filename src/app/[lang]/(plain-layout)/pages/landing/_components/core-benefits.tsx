import { CoreBenefitsList } from "./core-benefits-list"

export function CoreBenefits() {
  return (
    <section id="benefits" className="container grid gap-8">
      <div className="text-center mx-auto space-y-1.5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          我们的核心优势
        </h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          专业团队、全程陪伴、精准定位——让每一步申请都有迹可循，让您的留学之路走得更稳、更远。
        </p>
      </div>
      <CoreBenefitsList />
    </section>
  )
}
