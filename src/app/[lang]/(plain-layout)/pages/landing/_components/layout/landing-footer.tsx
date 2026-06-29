import Link from "next/link"

import { footerNavigationData } from "../../_data/footer-navigation"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-sidebar-border">
      <div className="container flex flex-wrap justify-between gap-6 py-8 md:px-6">
        <section className="max-w-xs w-full space-y-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-black text-foreground hover:text-primary/90 mb-4"
          >
            <span className="text-primary">飞越</span>
            <span>留学</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            专注留学申请全程辅导，已帮助数百名学生成功进入美英顶尖院校。
          </p>
          <p className="text-sm text-muted-foreground">微信：flyoversea_edu</p>
        </section>
        {footerNavigationData.map((nav) => (
          <nav key={nav.title}>
            <ul className="w-28 grid gap-2">
              <h3 className="font-semibold leading-none tracking-tight mb-1">
                {nav.title}
              </h3>
              {nav.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "inline h-fit p-0 text-sm text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-sidebar-border">
        <div className="container flex justify-between items-center p-4 md:px-6">
          <p className="text-xs text-muted-foreground">
            © {currentYear} 飞越留学 · 版权所有
          </p>
          <p className="text-xs text-muted-foreground">
            留学申请 · 一对一咨询服务
          </p>
        </div>
      </div>
    </footer>
  )
}
