import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contact";

const RESEND_URL = "https://api.resend.com/emails";
const MAX_FIELD = 4000;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] ?? ch);

const clean = (value: unknown) => (typeof value === "string" ? value.trim().slice(0, MAX_FIELD) : "");

function buildEmail(p: ContactPayload) {
  const rows: [string, string][] = [
    ["Nome", p.name],
    ["Empresa", p.company || "Não informada"],
    ["E-mail", p.email],
    ["Telefone", p.phone || "Não informado"],
    ["Interesses", p.interests.length ? p.interests.join(", ") : "Não informados"],
  ];
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "Desafio:", p.message].join("\n");
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#111">
<h2 style="margin:0 0 16px">Novo contato pelo site</h2>
<table style="border-collapse:collapse;width:100%">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top">${k}</td><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
<h3 style="margin:20px 0 6px">Desafio</h3>
<p style="white-space:pre-wrap;margin:0">${escapeHtml(p.message)}</p></div>`;
  return { text, html };
}

/**
 * Recebe o formulário e envia por e-mail via Resend.
 * Variáveis de ambiente:
 *   RESEND_API_KEY   (obrigatória) chave da conta Resend
 *   CONTACT_TO       destino (padrão: nandopandp@gmail.com)
 *   CONTACT_FROM     remetente (padrão: onboarding@resend.dev, só entrega ao dono da conta Resend;
 *                    para outros destinos, verifique um domínio e use algo como "MSATech <site@seudominio.com.br>")
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Campo isca: bots preenchem, pessoas nunca veem. Responde "ok" sem enviar.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const payload: ContactPayload = {
    name: clean(body.name),
    company: clean(body.company),
    email: clean(body.email),
    phone: clean(body.phone),
    message: clean(body.message),
    interests: Array.isArray(body.interests) ? body.interests.map(clean).filter(Boolean).slice(0, 12) : [],
  };

  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "email_not_configured" }, { status: 503 });
  }

  const { text, html } = buildEmail(payload);
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "MSATech Site <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO ?? "nandopandp@gmail.com"],
      reply_to: payload.email,
      subject: `Novo contato: ${payload.name}${payload.company ? ` (${payload.company})` : ""}`,
      text,
      html,
    }),
  }).catch(() => null);

  if (!res || !res.ok) {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
