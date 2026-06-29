import {
  BookOpen,
  FileText,
  Globe,
  MessageSquare,
  Search,
  Video,
} from "lucide-react"

import type { CoreFeatureType } from "../types"

export const coreFeaturesData: CoreFeatureType[] = [
  {
    title: "选校定位",
    description:
      "基于您的GPA、标化、背景和目标，精准定位最适合的院校和专业，制定冲刺/匹配/保底梯度名单。",
    icon: Search,
    className: "md:col-span-2",
  },
  {
    title: "文书指导",
    description:
      "从文书主题策划到逐字打磨，帮助您呈现最真实、最打动人的故事，脱颖而出。",
    icon: FileText,
    className: "",
  },
  {
    title: "面试培训",
    description:
      "针对各院校面试风格进行模拟训练，让您在关键时刻自信表达，留下深刻印象。",
    icon: Video,
    className: "",
  },
  {
    title: "签证辅助",
    description:
      "录取后的签证材料准备、DS-160填写、面签模拟，确保顺利赴美英留学。",
    icon: Globe,
    className: "",
  },
  {
    title: "标化备考规划",
    description:
      "TOEFL、IELTS、GRE、GMAT备考计划制定，结合目标院校要求推荐最优备考路径。",
    icon: BookOpen,
    className: "",
  },
  {
    title: "全程沟通支持",
    description:
      "微信一对一跟进，随时答疑解惑，从申请季开始到录取确认全程陪伴。",
    icon: MessageSquare,
    className: "",
  },
]
