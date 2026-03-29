async function sendEmail(payload) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, org, type, challenge, lang } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const from = process.env.FROM_EMAIL || 'Granit <onboarding@resend.dev>';

  // ── 1. Notification interne à l'équipe ──────────────────────────────────
  try {
    await sendEmail({
      from,
      to: process.env.TEAM_EMAIL,
      subject: `Nouvelle demande de démo — ${name} (${org || 'structure non renseignée'})`,
      html: notificationEmail({ name, email, phone, org, type, challenge }),
    });
  } catch (e) {
    console.error('Notification email failed:', e);
    return res.status(500).json({ error: 'Failed to send notification' });
  }

  // ── 2. Confirmation au prospect ──────────────────────────────────────────
  try {
    await sendEmail({
      from,
      to: email,
      subject: lang === 'en' ? 'Your Granit demo is confirmed ✓' : 'Votre démo Granit est confirmée ✓',
      html: confirmationEmail(name, lang),
    });
  } catch (e) {
    // Non-blocking : la demande est enregistrée même si la confirmation échoue
    console.error('Confirmation email failed:', e);
  }

  return res.status(200).json({ ok: true });
}

function notificationEmail({ name, email, phone, org, type, challenge }) {
  const row = (label, value) => value
    ? `<tr><td style="padding:8px 0;font-size:13px;font-weight:600;color:#374151;white-space:nowrap;padding-right:24px;vertical-align:top">${label}</td><td style="padding:8px 0;font-size:13px;color:#111">${value}</td></tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:white;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">
        <tr><td style="padding:28px 40px;border-bottom:1px solid #f3f4f6">
          <table cellpadding="0" cellspacing="0"><tr>
            <td><div style="width:28px;height:28px;background:#111;border-radius:7px;color:white;font-size:13px;font-weight:700;text-align:center;line-height:28px">G</div></td>
            <td style="padding-left:8px;font-weight:600;font-size:16px;color:#111;vertical-align:middle">Granit</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:32px 40px">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em">Nouvelle demande de démo</p>
          <h1 style="margin:0 0 24px;font-size:22px;font-weight:500;color:#111">${name}</h1>
          <table cellpadding="0" cellspacing="0" style="border-top:1px solid #f3f4f6;width:100%">
            ${row('Email', `<a href="mailto:${email}" style="color:#111">${email}</a>`)}
            ${row('Téléphone', phone)}
            ${row('Structure', org)}
            ${row('Type', type)}
            ${row('Défi', challenge)}
          </table>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #f3f4f6">
          <p style="margin:0;font-size:12px;color:#9ca3af">${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })} — Granit</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function confirmationEmail(name, lang) {
  const isEn = lang === 'en';

  const heading = isEn ? `We got it, ${name}!` : `C'est noté, ${name}&nbsp;!`;
  const intro = isEn
    ? `We've received your demo request. Our team is preparing a personalized demo on your real workflows — and will contact you <strong style="color:#111">within 24h</strong> with your time slot.`
    : `Nous avons bien reçu votre demande de démo. Notre équipe prépare une démonstration personnalisée sur vos vrais flux — et vous contactera <strong style="color:#111">sous 24h</strong> avec votre créneau.`;
  const expectTitle = isEn ? 'What to expect:' : 'Ce qui vous attend :';
  const bullet1 = isEn ? '15 minutes, no slides' : '15 minutes, pas de slides';
  const bullet2 = isEn ? 'Granit in action on your real workflows' : 'Granit en action sur vos vrais flux';
  const bullet3 = isEn ? 'A concrete automation plan at the end' : `Un plan d'automatisation concret à la fin`;
  const questions = isEn ? 'Questions? Reply directly to this email.' : 'Des questions ? Répondez directement à cet email.';
  const footer = isEn ? '© 2025 Granit — Your teams care. Granit handles the rest.' : '© 2025 Granit — Vos équipes soignent. Granit gère le reste.';
  const htmlLang = isEn ? 'en' : 'fr';

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:white;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">
        <tr><td style="padding:28px 40px;border-bottom:1px solid #f3f4f6">
          <table cellpadding="0" cellspacing="0"><tr>
            <td><div style="width:28px;height:28px;background:#111;border-radius:7px;color:white;font-size:13px;font-weight:700;text-align:center;line-height:28px">G</div></td>
            <td style="padding-left:8px;font-weight:600;font-size:16px;color:#111;vertical-align:middle">Granit</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:32px 40px">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:400;color:#111;line-height:1.2">${heading}</h1>
          <p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.65">${intro}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:24px">
            <tr><td style="padding:20px 24px">
              <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#111">${expectTitle}</p>
              <p style="margin:0 0 6px;font-size:13px;color:#6b7280">✓&nbsp; ${bullet1}</p>
              <p style="margin:0 0 6px;font-size:13px;color:#6b7280">✓&nbsp; ${bullet2}</p>
              <p style="margin:0;font-size:13px;color:#6b7280">✓&nbsp; ${bullet3}</p>
            </td></tr>
          </table>
          <p style="margin:0;font-size:13px;color:#9ca3af">${questions}</p>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #f3f4f6">
          <p style="margin:0;font-size:12px;color:#9ca3af">${footer}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
