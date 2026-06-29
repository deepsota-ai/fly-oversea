import { Card } from "@/components/ui/card"
import { ContactUsForm } from "./contact-us-form"
import { ContactUsInfo } from "./contact-us-info"

export function ContactUs() {
  return (
    <section
      id="contact-us"
      className="container grid gap-4 md:grid-cols-3 md:gap-8"
    >
      <div className="space-y-8 md:space-y-4">
        <div className="text-center space-y-1.5 md:text-start">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            联系我们
          </h2>
          <p className="max-w-prose mx-auto text-sm text-muted-foreground">
            有疑问或想进一步了解？填写表单或扫描微信二维码直接联系顾问。
          </p>
        </div>
        <ContactUsInfo />
        <Card className="flex flex-col items-center gap-2 p-4 w-fit mx-auto md:mx-0">
          <div className="h-32 w-32 bg-muted flex items-center justify-center rounded border text-center p-2">
            <p className="text-xs text-muted-foreground leading-tight">
              微信二维码
              <br />
              （即将上线）
            </p>
          </div>
          <p className="text-xs text-muted-foreground">扫码添加微信</p>
        </Card>
      </div>
      <ContactUsForm />
    </section>
  )
}
