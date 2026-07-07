import type { Lead } from './lead.js'

const CRM_URL = 'https://core.digitalweave.tech/crm'

function field(label: string, value: string): { type: 'mrkdwn'; text: string } {
  const safe = value.trim() || '—'
  return { type: 'mrkdwn', text: `*${label}:*\n${safe}` }
}

async function notifySlack(lead: Lead): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL?.trim()
  if (!webhookUrl) return

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `New website lead: ${lead.name}`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: 'New website lead', emoji: true },
        },
        {
          type: 'section',
          fields: [
            field('Name', lead.name),
            field('Email', lead.email),
            field('Company', lead.company),
            field('Service', lead.service),
          ],
        },
        {
          type: 'section',
          text: field('Message', lead.message),
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Marketing opt-in:* ${lead.marketingOptIn ? 'Yes' : 'No'} · *ID:* ${lead.id}`,
            },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Open CRM' },
              url: CRM_URL,
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Slack notification failed (${response.status}): ${detail}`)
  }
}

/** Post a Slack alert for a new website lead. Never blocks saving the lead. */
export async function notifyNewWebsiteLead(lead: Lead): Promise<void> {
  if (!process.env.SLACK_WEBHOOK_URL?.trim()) {
    console.warn('SLACK_WEBHOOK_URL is not set — skipping Slack lead notification.')
    return
  }

  try {
    await notifySlack(lead)
  } catch (error) {
    console.error('Slack lead notification failed:', error)
  }
}
