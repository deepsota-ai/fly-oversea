import Link from "next/link"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import { FaqsList } from "./faqs-list"

export function Faqs() {
  return (
    <section id="faqs" className="container grid gap-8 md:grid-cols-3">
      <div className="text-center mx-auto space-y-1.5 md:text-start">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          常见问题
        </h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          整理了申请同学最常问的问题。如有更多疑问，欢迎{" "}
          <Link
            href="#contact-us"
            className={cn(
              buttonVariants({ variant: "link" }),
              "inline h-fit p-0"
            )}
          >
            直接联系我们
          </Link>
          。
        </p>
      </div>
      <FaqsList />
    </section>
  )
}
