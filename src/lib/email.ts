/**
 * Resend wrapper — used for WPBS partner access emails (dispatch 008).
 * Subject/body may reference Winter Park Benefit Shop; never surface that string on public marketing routes.
 */
export async function sendEmail(opts: { to: string; subject: string; body: string }): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY not configured");
  }
  const from = process.env.RESEND_FROM ?? "PriceScout <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      text: opts.body,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend error ${res.status}: ${detail}`);
  }
}
