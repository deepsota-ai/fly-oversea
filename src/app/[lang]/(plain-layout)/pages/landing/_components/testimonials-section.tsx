import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const TESTIMONIALS = [
  {
    name: "李同学",
    school: "Columbia University MS CS",
    quote:
      "顾问帮我从选校到文书全程规划，最终拿到哥大和NYU双录取！强烈推荐给所有想去美国读研的同学。",
    tags: ["美国", "CS硕士"],
  },
  {
    name: "王同学",
    school: "UCL MSc Finance",
    quote:
      "申请英国金融项目竞争非常激烈，顾问精准分析了我的背景劣势并帮我扬长避短，最终成功拿到UCL录取。",
    tags: ["英国", "金融硕士"],
  },
  {
    name: "赵同学",
    school: "MIT PhD Materials Science",
    quote:
      "PhD申请过程中，顾问帮我联系了对口导师，并指导我如何展示科研成果。整个过程专业高效，非常感谢！",
    tags: ["美国", "PhD"],
  },
  {
    name: "陈同学",
    school: "University of Edinburgh MSc Data Science",
    quote:
      "第一次了解留学申请流程完全不懂，顾问耐心解答所有问题，从IELTS备考到网申填写都给了很大帮助。",
    tags: ["英国", "数据科学"],
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="container grid gap-8">
      <div className="text-center mx-auto space-y-1.5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          学员成功案例
        </h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          听听他们的亲身经历——从迷茫到拿到梦校录取，我们一路相伴。
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {TESTIMONIALS.map((t) => (
          <Card key={t.name}>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-primary">{t.school}</p>
                </div>
                <div className="flex gap-1">
                  {t.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
