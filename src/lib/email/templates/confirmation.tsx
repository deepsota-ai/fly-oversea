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

interface ConfirmationEmailProps {
  studentName: string
  consultantName: string
  startAtCst: string
  durationMin: number
  zoomUrl: string | null
}

export function ConfirmationEmail({
  studentName,
  consultantName,
  startAtCst,
  durationMin,
  zoomUrl,
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>您的留学咨询预约已确认</Preview>
      <Body style={{ fontFamily: "sans-serif", background: "#f4f4f4" }}>
        <Container
          style={{
            maxWidth: 560,
            margin: "0 auto",
            background: "#fff",
            padding: 24,
          }}
        >
          <Heading style={{ fontSize: 22, color: "#111" }}>预约确认</Heading>
          <Text>您好，{studentName}！</Text>
          <Text>
            您已成功预约与顾问 <strong>{consultantName}</strong> 的留学咨询。
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
              📅 日期时间：<strong>{startAtCst}（北京时间）</strong>
            </Text>
            <Text style={{ margin: "8px 0 0" }}>
              ⏱ 时长：{durationMin} 分钟
            </Text>
            {zoomUrl && (
              <Text style={{ margin: "8px 0 0" }}>
                🎥 会议链接：<a href={zoomUrl}>{zoomUrl}</a>
              </Text>
            )}
            {!zoomUrl && (
              <Text style={{ margin: "8px 0 0", color: "#888" }}>
                Zoom 会议链接将稍后单独发送，请稍候。
              </Text>
            )}
          </Section>
          <Text style={{ color: "#555", fontSize: 13 }}>
            如需调整或取消，请通过微信联系我们。
          </Text>
          <Text style={{ color: "#555", fontSize: 13 }}>期待与您的交流！</Text>
          <Text style={{ color: "#999", fontSize: 12, marginTop: 24 }}>
            FlyOversea 留学咨询团队
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
