import type { Metadata } from "next"

import Aoscompo from "@/utils/aos"
import Footer from "@/app/components/Layout/Footer"
import Header from "@/app/components/Layout/Header"
import ScrollToTop from "@/app/components/ScrollToTop"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://geni-links.com",
  ),
  title: {
    default: "Geni Links",
    template: "%s · Geni Links",
  },
  description: "面向中国学生及家庭的留学、签证与成长指导服务。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  const themeAssets = `
    :root {
      --banner-url: url("${basePath}/images/banner/background.png");
      --newsletter-url: url("${basePath}/images/newsletter/hands.svg");
    }
  `

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <style>{themeAssets}</style>
        <Aoscompo>
          <Header />
          {children}
          <Footer />
        </Aoscompo>
        <ScrollToTop />
      </body>
    </html>
  )
}
