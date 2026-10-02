/**
 * Contrato do formulário de contato — compartilhado entre cliente e servidor.
 * Para integrar (CRM, e-mail, webhook), altere apenas `src/app/api/contact/route.ts`.
 */
export const interestOptions = [
  "Estratégia",
  "Branding",
  "Design",
  "Experiência",
  "Tecnologia",
  "Produto",
] as const;

export type ContactPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  interests: string[];
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(data: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  if (!data.name || data.name.trim().length < 2) errors.name = "Como podemos te chamar?";
  if (!data.email || !EMAIL_RE.test(data.email.trim())) errors.email = "Informe um e-mail válido.";
  const digits = (data.phone ?? "").replace(/\D/g, "");
  if (digits.length > 0 && (digits.length < 10 || digits.length > 13)) errors.phone = "Telefone incompleto.";
  if (!data.message || data.message.trim().length < 10)
    errors.message = "Conte um pouco mais. Algumas linhas já ajudam.";
  return errors;
}

export function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export async function submitContact(payload: ContactPayload & { website?: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: "Não conseguimos enviar agora. Tente novamente em instantes." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Sem conexão. Verifique sua internet e tente novamente." };
  }
}
