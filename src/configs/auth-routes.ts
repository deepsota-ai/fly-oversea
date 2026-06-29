import type { RouteType } from "@/types"

export const routeMap = new Map<string, RouteType>([
  ["/sign-in", { type: "guest" }],
  ["/register", { type: "guest" }],
  ["/forgot-password", { type: "guest" }],
  ["/verify-email", { type: "guest" }],
  ["/new-password", { type: "guest" }],
  ["/", { type: "public" }],
  ["/docs", { type: "public" }],
  // Marketing pages (root-level routes, no login required)
  ["/consultants", { type: "public" }],
  ["/cases", { type: "public" }],
  ["/faq", { type: "public" }],
  // /pages/book is public; /pages/appointments and /pages/account require auth
  [
    "/pages",
    { type: "public", exceptions: ["/pages/appointments", "/pages/account"] },
  ],
])
