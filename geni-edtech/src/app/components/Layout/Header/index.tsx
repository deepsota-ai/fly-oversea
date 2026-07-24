"use client"

import Link from "next/link"
import { useState } from "react"

const links = [
  ["留学申请", "/study-abroad"],
  ["签证服务", "/visa"],
  ["学生案例", "/cases"],
  ["我们团队", "/consultants"],
  ["联系我们", "/contact"],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">G</span>
          <span>Geni Links<small>际联教育</small></span>
        </Link>
        <nav className={open ? "main-nav is-open" : "main-nav"}>
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="nav-login" href="/signin">登录</Link>
          <Link className="button button-small" href="/book">免费咨询</Link>
        </nav>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="打开导航">
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
