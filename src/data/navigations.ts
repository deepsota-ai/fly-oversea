import type { NavigationType } from "@/types"

export const navigationsData: NavigationType[] = [
  {
    title: "留学咨询平台",
    items: [
      {
        title: "首页",
        href: "/pages/landing",
        iconName: "House",
      },
      {
        title: "预约管理",
        href: "/pages/appointments",
        iconName: "CalendarCheck",
      },
      {
        title: "集成设置",
        href: "/pages/account/settings/integrations",
        iconName: "Plug",
      },
      {
        title: "账号设置",
        href: "/pages/account/settings",
        iconName: "UserCog",
      },
    ],
  },
]
