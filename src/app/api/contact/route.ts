import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Email destino principal y de respaldo
const PRIMARY_EMAIL = process.env.CONTACT_TARGET_EMAIL || 'lbolanoa1@unicartagena.edu.co';
const FALLBACK_EMAIL = 'jankmortal@gmail.com';

export async function POST(req: Request) {
  try {
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY no esta configurada en las variables de entorno.');
      return NextResponse.json(
        { error: 'Servicio de correo no configurado en el servidor.' },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { name, email, company, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (nombre, correo o mensaje).' },
        { status: 400 },
      );
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff; color: #18181b;">
        <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #10b981; font-size: 22px;">Nuevo mensaje desde tu Portafolio Web</h2>
          <p style="margin: 4px 0 0; color: #71717a; font-size: 14px;">Has recibido una nueva consulta de un cliente o reclutador.</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #71717a; font-size: 13px; font-weight: bold; width: 120px;">Nombre:</td>
            <td style="padding: 8px 0; color: #18181b; font-size: 15px; font-weight: 600;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a; font-size: 13px; font-weight: bold;">Correo:</td>
            <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${escapeHtml(email)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a; font-size: 13px; font-weight: bold;">Empresa:</td>
            <td style="padding: 8px 0; color: #18181b; font-size: 15px;">${escapeHtml(company || 'No especificada')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #71717a; font-size: 13px; font-weight: bold;">Presupuesto:</td>
            <td style="padding: 8px 0; color: #18181b; font-size: 15px;">${escapeHtml(budget || 'A discutir')}</td>
          </tr>
        </table>

        <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-weight: bold; font-size: 13px; color: #52525b;">Mensaje:</p>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #27272a;">${escapeHtml(message)}</p>
        </div>

        <div style="border-top: 1px solid #e4e4e7; padding-top: 16px; font-size: 12px; color: #a1a1aa; text-align: center;">
          Enviado automáticamente desde Leider Darío Portfolio · <a href="mailto:${escapeHtml(email)}" style="color: #10b981; font-weight: bold;">Responder a ${escapeHtml(name)}</a>
        </div>
      </div>
    `;

    // Intentar primero enviar al correo institucional
    let resendRes = await sendResendEmail({
      to: PRIMARY_EMAIL,
      replyTo: email,
      subject: `[Portafolio] Mensaje de ${name} (${company || 'Contacto Web'})`,
      html: htmlContent,
    });

    // Si Resend da 403 (porque la cuenta de Resend solo permite enviar a jankmortal@gmail.com en sandbox)
    if (!resendRes.ok) {
      const errData = await resendRes.json().catch(() => ({}));
      console.warn('Resend fallo con destinatario primario:', errData);

      // Reintentar con el correo del propietario de la cuenta de Resend
      resendRes = await sendResendEmail({
        to: FALLBACK_EMAIL,
        replyTo: email,
        subject: `[Portafolio] Mensaje de ${name} (${company || 'Contacto Web'})`,
        html: htmlContent,
      });

      if (!resendRes.ok) {
        const fallbackErr = await resendRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: 'Error al enviar por Resend', details: fallbackErr },
          { status: 500 },
        );
      }

      return NextResponse.json({
        ok: true,
        deliveredTo: FALLBACK_EMAIL,
        note: 'Entregado a jankmortal@gmail.com debido a restricciones de sandbox de Resend para cuentas no verificadas.',
      });
    }

    return NextResponse.json({ ok: true, deliveredTo: PRIMARY_EMAIL });
  } catch (err: unknown) {
    console.error('Error en /api/contact:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el contacto.' },
      { status: 500 },
    );
  }
}

async function sendResendEmail({
  to,
  replyTo,
  subject,
  html,
}: {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
}) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portafolio Leider <onboarding@resend.dev>',
      to: [to],
      reply_to: replyTo,
      subject,
      html,
    }),
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
