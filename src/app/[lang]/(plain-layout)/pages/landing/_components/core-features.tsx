import { CoreFeaturesList } from "./core-features-list"

export function CoreFeatures() {
  return (
    <section id="features" className="container grid gap-8">
      <div className="text-center mx-auto space-y-1.5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          服务内容
        </h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          从背景提升到拿到录取，我们覆盖留学申请全流程，每个环节专业把关。
        </p>
      </div>
      <CoreFeaturesList />
    </section>
  )
}
