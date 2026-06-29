import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface ReminderEmailProps {
  studentName: string
  consultantName: string
  startAtCst: string
  zoomUrl: string | null
}

export function ReminderEmail({
  studentName,
  consultantName,
  startAtCst,
  zoomUrl,
}: ReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>明日提醒：您有一个留学咨询预约</Preview>
      <Body style={{ fontFamily: "sans-serif", background: "#f4f4f4" }}>
        <Container
          style={{
            maxWidth: 560,
            margin: "0 auto",
            background: "#fff",
            padding: 24,
          }}
        >
          <Heading style={{ fontSize: 22, color: "#111" }}>预约提醒</Heading>
          <Text>您好，{studentName}！</Text>
          <Text>
            提醒您：您明天与顾问 <strong>{consultantName}</strong>{" "}
            的留学咨询即将开始。
          </Text>
          <Section
            style={{
              background: "#f9f9f9",
              padding: 16,
              borderRadius: 8,
              margin: "16px 0",
            }}
          >
            <Text style={{ margin: 0 }}>
              📅 时间：<strong>{startAtCst}（北京时间）</strong>
            </Text>
            {zoomUrl && (
              <Text style={{ margin: "8px 0 0" }}>
                🎥 会议链接：<a href={zoomUrl}>{zoomUrl}</a>
              </Text>
            )}
          </Section>
          <Text style={{ color: "#555", fontSize: 13 }}>
            请提前5分钟准备好，期待与您交流！
          </Text>
          <Text style={{ color: "#999", fontSize: 12, marginTop: 24 }}>
            FlyOversea 留学咨询团队
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
