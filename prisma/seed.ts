import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10)

  await db.consultant.upsert({
    where: { email: "consultant@test.com" },
    update: {},
    create: {
      name: "张明",
      email: "consultant@test.com",
      passwordHash,
      bio: "美国TOP30硕士，5年留学申请经验，擅长理工科和商科申请。",
      specialisations: JSON.stringify(["美国", "英国", "硕士", "PhD"]),
      bookingWindowJson: JSON.stringify({
        days: [1, 2, 3, 4, 5],
        startHour: 10,
        endHour: 18,
      }),
    },
  })

  console.log("Seeded consultant: consultant@test.com / password123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
