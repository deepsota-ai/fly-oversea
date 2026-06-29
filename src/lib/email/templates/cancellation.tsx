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

interface CancellationEmailProps {
  studentName: string
  consultantName: string
  startAtCst: string
}

export function CancellationEmail({
  studentName,
  consultantName,
  startAtCst,
}: CancellationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>您的留学咨询预约已取消</Preview>
      <Body style={{ fontFamily: "sans-serif", background: "#f4f4f4" }}>
        <Container
          style={{
            maxWidth: 560,
            margin: "0 auto",
            background: "#fff",
            padding: 24,
          }}
        >
          <Heading style={{ fontSize: 22, color: "#111" }}>预约已取消</Heading>
          <Text>您好，{studentName}！</Text>
          <Text>
            很遗憾，您与顾问 <strong>{consultantName}</strong>{" "}
            原定于以下时间的咨询预约已被取消。
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
              📅 原定时间：<strong>{startAtCst}（北京时间）</strong>
            </Text>
          </Section>
          <Text style={{ color: "#555", fontSize: 13 }}>
            如有疑问，请通过微信联系我们，我们将尽快安排新的时间。
          </Text>
          <Text style={{ color: "#999", fontSize: 12, marginTop: 24 }}>
            FlyOversea 留学咨询团队
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
