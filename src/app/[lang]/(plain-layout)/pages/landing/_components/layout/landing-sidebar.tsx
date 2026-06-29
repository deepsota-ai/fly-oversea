"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { GraduationCap, LogIn, PanelLeft } from "lucide-react"

import type { LocaleType } from "@/types"

import { headerNavigationData } from "../../_data/header-navigation"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { isActivePathname } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function LandingSidebar({ fullPathname }: { fullPathname: string }) {
  const { openMobile, setOpenMobile, isMobile } = useSidebar()
  const params = useParams()

  const locale = params.lang as LocaleType

  if (!isMobile) return

  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetTrigger asChild>
        <Button
          data-sidebar="trigger"
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(!openMobile)}
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Sidebar</SheetTitle>
          <SidebarHeader>
            <Link
              href={`/${locale}`}
              className="w-fit flex items-center gap-1.5 text-foreground font-black p-2 pb-0 mb-2 hover:text-primary/90"
              onClick={() => isMobile && setOpenMobile(!openMobile)}
            >
              <span className="text-primary">飞越</span>
              <span>留学</span>
            </Link>
            <Link
              href={ensureLocalizedPathname("/pages/book", locale)}
              className={buttonVariants({ size: "lg" })}
              onClick={() => isMobile && setOpenMobile(!openMobile)}
            >
              <GraduationCap className="me-2 h-4 w-4" />
              <span>免费预约咨询</span>
            </Link>
            <Link
              href={ensureLocalizedPathname("/sign-in", locale)}
              className={buttonVariants({ variant: "outline", size: "sm" })}
              onClick={() => isMobile && setOpenMobile(!openMobile)}
            >
              <LogIn className="me-2 h-4 w-4" />
              <span>登录</span>
            </Link>
          </SidebarHeader>
        </SheetHeader>
        <ScrollArea className="p-2">
          <SidebarContent>
            <SidebarMenu>
              {headerNavigationData.map((nav) => {
                const fullHref = `/${locale}${nav.href}`
                const isActive = isActivePathname(fullHref, fullPathname, true)
                return (
                  <SidebarMenuItem key={nav.label}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setOpenMobile(!openMobile)}
                      asChild
                    >
                      <Link href={fullHref}>
                        <span>{nav.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
