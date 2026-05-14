import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, clinic, phone, email } = body

  if (!name || !clinic || !phone || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, clinic, phone, email, source: 'landing' }),
    })
  }

  return NextResponse.json({ ok: true })
}
