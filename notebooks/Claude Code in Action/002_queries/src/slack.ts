const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL ?? "";

export interface SlackMessage {
  channel: string;
  text: string;
}

export async function sendSlackMessage(message: SlackMessage): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    throw new Error("SLACK_WEBHOOK_URL environment variable is not set");
  }

  const response = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      channel: message.channel,
      text: message.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Slack API error ${response.status}: ${body}`);
  }
}

export async function sendOrderAlert(
  orderNumber: string,
  customerName: string,
  phone: string,
  daysPending: number,
): Promise<void> {
  const text =
    `*Overdue Pending Order Alert*\n` +
    `Order *${orderNumber}* has been pending for *${Math.floor(daysPending)} days*.\n` +
    `Customer: ${customerName} | Phone: ${phone ?? "N/A"}\n` +
    `Please follow up immediately.`;

  await sendSlackMessage({ channel: "#order-alerts", text });
}
