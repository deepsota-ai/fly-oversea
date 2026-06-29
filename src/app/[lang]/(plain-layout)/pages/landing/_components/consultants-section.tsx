import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const CONSULTANTS = [
  {
    name: "张明",
    photoUrl: null,
    bio: "美国TOP30硕士，5年留学申请经验，擅长理工科和商科申请。曾帮助数十名学生成功获得MIT、斯坦福、哥伦比亚大学等录取。",
    specialisations: ["美国", "英国", "硕士", "PhD"],
  },
]

export function ConsultantsSection() {
  return (
    <section id="consultants" className="container grid gap-8">
      <div className="text-center mx-auto space-y-1.5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          我们的顾问团队
        </h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          每位顾问均有海外顶尖院校背景，深刻理解招生标准，全程陪伴您的申请之路。
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CONSULTANTS.map((c) => (
          <Card key={c.name} className="text-center">
            <CardHeader className="items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                {c.photoUrl ? (
                  <Image
                    src={c.photoUrl}
                    alt={c.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground">
                    {c.name[0]}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{c.name}</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground text-left">{c.bio}</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {c.specialisations.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
