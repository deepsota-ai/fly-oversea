"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const DEGREE_OPTIONS = ["本科", "硕士", "博士", "语言学校"]
const COUNTRY_OPTIONS = ["美国", "英国", "加拿大", "澳大利亚", "其他"]

const FormSchema = z.object({
  name: z.string().min(1, "请填写姓名"),
  wechatId: z.string().min(1, "请填写微信号"),
  email: z.string().email("请填写有效的邮箱地址"),
  institution: z.string().min(1, "请填写当前学校"),
  major: z.string().min(1, "请填写当前专业"),
  gpa: z.coerce.number().positive("GPA必须为正数"),
  gpaScale: z.coerce.number().positive("GPA满分必须为正数"),
  graduationYear: z.coerce.number().int().min(2024, "毕业年份不能早于2024"),
  targetCountries: z.array(z.string()).min(1, "请至少选择一个目标国家"),
  targetDegree: z.string().min(1, "请选择目标学位"),
  testScores: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof FormSchema>

export function StepBackgroundForm({
  onNext,
}: {
  onNext: (leadId: string) => void
}) {
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null)
  const [existingApptId, setExistingApptId] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      wechatId: "",
      email: "",
      institution: "",
      major: "",
      gpa: 0,
      gpaScale: 4.0,
      graduationYear: new Date().getFullYear() + 1,
      targetCountries: [],
      targetDegree: "",
      testScores: "",
      notes: "",
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: FormValues) {
    const payload = {
      ...values,
      testScores: values.testScores
        ? parseTestScores(values.testScores)
        : undefined,
    }

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) return

    if (data.exists && data.appointmentId) {
      setExistingApptId(data.appointmentId)
      return
    }

    if (data.exists && data.leadId) {
      setPendingLeadId(data.leadId)
      setMergeDialogOpen(true)
      return
    }

    onNext(data.leadId)
  }

  function parseTestScores(raw: string): Record<string, number> | undefined {
    const result: Record<string, number> = {}
    const parts = raw.split(/[,;，；]/)
    for (const part of parts) {
      const [k, v] = part.split(/:：/).map((s) => s.trim())
      if (k && v && !isNaN(Number(v))) result[k] = Number(v)
    }
    return Object.keys(result).length ? result : undefined
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>第一步：填写背景信息</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 sm:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="王小明" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wechatId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>微信号 *</FormLabel>
                    <FormControl>
                      <Input placeholder="wxid_abc123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>邮箱 *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="student@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>当前学校 *</FormLabel>
                    <FormControl>
                      <Input placeholder="北京大学" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>当前专业 *</FormLabel>
                    <FormControl>
                      <Input placeholder="计算机科学" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="3.8"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gpaScale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA 满分 *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="4.0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="graduationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>预计毕业年份 *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetDegree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>目标学位 *</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="">请选择</option>
                        {DEGREE_OPTIONS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetCountries"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>目标国家（可多选）*</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-3">
                        {COUNTRY_OPTIONS.map((country) => (
                          <label
                            key={country}
                            className="flex items-center gap-1.5 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={field.value.includes(country)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, country])
                                } else {
                                  field.onChange(
                                    field.value.filter((c) => c !== country)
                                  )
                                }
                              }}
                            />
                            {country}
                          </label>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testScores"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>
                      标化成绩（选填，如：TOEFL:105, GRE:320）
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="TOEFL:105, GRE:320" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>其他备注（选填）</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="希望申请CS方向，有科研经历..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "提交中..." : "下一步：选择顾问"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Existing appointment dialog */}
      {existingApptId && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>您已有预约记录</AlertDialogTitle>
              <AlertDialogDescription>
                您的邮箱已有一个确认的预约。请查看预约确认邮件或通过微信联系我们获取详情。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setExistingApptId(null)}>
                好的
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Merge dialog */}
      <AlertDialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>我们已有您的信息</AlertDialogTitle>
            <AlertDialogDescription>
              是否更新您的背景信息并继续预约？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingLeadId) onNext(pendingLeadId)
                setMergeDialogOpen(false)
              }}
            >
              更新并继续
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
