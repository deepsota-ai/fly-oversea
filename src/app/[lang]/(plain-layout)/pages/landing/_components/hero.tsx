import Link from "next/link"
import { ArrowRight, GraduationCap } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function Hero({ lang }: { lang: string }) {
  return (
    <section className="container space-y-10">
      <div className="grid place-items-center text-center gap-y-6">
        <div className="flex items-center gap-x-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4 text-primary" />
          专注留学申请，助力名校梦想
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight max-w-2xl">
          一对一留学咨询
          <br />
          <span className="text-primary">专业规划，精准申请</span>
        </h1>
        <p className="max-w-prose w-full text-lg text-muted-foreground">
          我们提供专业的留学申请全程辅导，从选校定位到文书润色，帮助您成功进入心仪大学。
          已累计帮助数百名学生拿到美国、英国顶尖院校录取。
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${lang}/pages/book`}
            className={buttonVariants({ size: "lg" })}
          >
            免费预约咨询
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="#contact-us"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            微信联系我们
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          预约免费 · 20分钟深度咨询 · 即刻获得专业建议
        </p>
      </div>
    </section>
  )
}
