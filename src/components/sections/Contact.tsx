"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { formatPhone, interestOptions, submitContact, validateContact, type ContactErrors, type ContactPayload } from "@/lib/contact";
import { site } from "@/content/site";
import { useReveal } from "@/hooks/useReveal";
import { Button } from "@/components/ui/Button";
import { FinalCta } from "./FinalCta";

type Status = "idle" | "sending" | "success" | "error";

const EMPTY: ContactPayload = { name: "", company: "", email: "", phone: "", message: "", interests: [] };

const NEXT_STEPS = [
  { title: "Lemos com atenção", text: "Cada mensagem é lida por alguém do time, não por um robô de triagem." },
  { title: "Conversa de imersão", text: "Um papo para entender contexto, objetivos e o que está em jogo." },
  { title: "Proposta sob medida", text: "Um caminho desenhado para o seu desafio, não um pacote pronto." },
];

type FieldProps = {
  name: keyof Omit<ContactPayload, "interests">;
  label: string;
  value: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  className?: string;
};

function Field({ name, label, value, error, onChange, type = "text", required, multiline, autoComplete, inputMode, className }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    value,
    onChange,
    required,
    autoComplete,
    placeholder: " ",
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    className:
      "peer block w-full resize-none border-b border-fg/20 bg-transparent pb-3 pt-7 text-lg text-fg outline-none transition-colors duration-500 focus:border-fg/40 aria-[invalid=true]:border-orange/70",
  };
  return (
    <div className={className}>
      <div className="relative">
        {multiline ? <textarea {...shared} rows={4} /> : <input {...shared} type={type} inputMode={inputMode} />}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-0 top-7 origin-left text-lg text-fg/45 transition-all duration-500 ease-[var(--ease-out-expo)] peer-focus:top-0 peer-focus:text-[0.6875rem] peer-focus:tracking-[0.16em] peer-focus:text-orange peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[0.6875rem] peer-[:not(:placeholder-shown)]:tracking-[0.16em] peer-focus:uppercase peer-[:not(:placeholder-shown)]:uppercase"
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
        <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-orange transition-transform duration-700 ease-[var(--ease-out-expo)] peer-focus:scale-x-100" />
      </div>
      {error && (
        <p id={errorId} className="t-micro mt-2 text-orange">
          {error}
        </p>
      )}
    </div>
  );
}

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [data, setData] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  const update = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: name === "phone" ? formatPhone(value) : value }));
    if (errors[name as keyof ContactErrors]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const toggleInterest = (interest: string) =>
    setData((d) => ({
      ...d,
      interests: d.interests.includes(interest) ? d.interests.filter((i) => i !== interest) : [...d.interests, interest],
    }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validateContact(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    const result = await submitContact(data);
    if (result.ok) {
      setStatus("success");
      setData(EMPTY);
      requestAnimationFrame(() => successRef.current?.focus());
    } else {
      setStatus("error");
      setServerError(result.error);
    }
  };

  return (
    <section ref={rootRef} id="contato" aria-labelledby="contact-title" className="relative bg-ink">
      <FinalCta />

      <div id="contato-form" className="container-x scroll-mt-20 pb-32 pt-12 md:pb-40">
        <div className="grid gap-16 border-t border-line pt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="contact-title" data-split className="t-h2 max-w-[11ch]">
              Conte o seu desafio.
            </h2>
            <p data-reveal className="t-lead mt-6 max-w-[26rem] text-fg/55">
              Não precisa estar tudo definido. Dar forma ao que ainda é ideia também é o nosso trabalho.
            </p>

            <ol className="mt-14 space-y-8">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title} data-reveal className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="t-micro pt-1.5 text-orange">0{i + 1}</span>
                  <span>
                    <span className="block font-semibold tracking-[-0.01em]">{step.title}</span>
                    <span className="mt-1 block text-[0.9375rem] leading-relaxed text-fg/50">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            {(site.contact.email || site.contact.phone) && (
              <div data-reveal className="mt-14 space-y-2 border-t border-line pt-8">
                {site.contact.email && (
                  <a href={`mailto:${site.contact.email}`} className="link-underline block text-lg">
                    {site.contact.email}
                  </a>
                )}
                {site.contact.phone && <p className="text-lg text-fg/70">{site.contact.phone}</p>}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {status === "success" ? (
              <div ref={successRef} tabIndex={-1} role="status" className="flex min-h-[420px] flex-col justify-center outline-none">
                <span aria-hidden="true" className="relative mb-10 block size-14">
                  <span className="absolute left-0 top-0 size-7 animate-[fade-in_0.6s_var(--ease-out-expo)] bg-orange" />
                  <span className="absolute bottom-0 right-0 size-7 animate-[fade-in_0.6s_0.2s_var(--ease-out-expo)_both] bg-orange" />
                </span>
                <p className="t-h3">Recebemos sua mensagem.</p>
                <p className="t-lead mt-4 max-w-[28rem] text-fg/55">Obrigado por compartilhar o seu desafio. Em breve alguém do nosso time entra em contato.</p>
                <button type="button" onClick={() => setStatus("idle")} className="link-underline t-micro mt-10 self-start text-fg/60">
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={submit} aria-describedby="form-note" className="grid gap-x-8 gap-y-10 md:grid-cols-2" data-reveal>
                <Field name="name" label="Nome" value={data.name} onChange={update} error={errors.name} required autoComplete="name" />
                <Field name="company" label="Empresa" value={data.company} onChange={update} autoComplete="organization" />
                <Field name="email" label="E-mail" type="email" inputMode="email" value={data.email} onChange={update} error={errors.email} required autoComplete="email" />
                <Field name="phone" label="Telefone" type="tel" inputMode="tel" value={data.phone} onChange={update} error={errors.phone} autoComplete="tel" />

                <fieldset className="md:col-span-2">
                  <legend className="t-micro mb-4 text-fg/45">No que podemos ajudar? (opcional)</legend>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((opt) => {
                      const checked = data.interests.includes(opt);
                      return (
                        <label key={opt} className={cn("relative cursor-pointer select-none rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-orange", checked ? "border-orange bg-orange text-ink" : "border-fg/20 text-fg/70 hover:border-fg/50 hover:text-fg")}>
                          <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleInterest(opt)} />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <Field name="message" label="Conte um pouco sobre seu desafio" value={data.message} onChange={update} error={errors.message} required multiline className="md:col-span-2" />

                <div className="flex flex-col-reverse items-start gap-6 md:col-span-2 md:flex-row md:items-center md:justify-between">
                  <p id="form-note" className="t-micro max-w-[22rem] leading-relaxed text-fg/35">
                    Campos com * são obrigatórios. Usamos seus dados apenas para responder ao contato.
                  </p>
                  <Button type="submit" size="lg" cursor="talk" disabled={status === "sending"}>
                    {status === "sending" ? "Enviando…" : "Quero conversar"}
                  </Button>
                </div>
                {status === "error" && (
                  <p role="alert" className="text-sm text-orange md:col-span-2">
                    {serverError}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
