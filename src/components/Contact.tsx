import { useState, useRef } from "react";
import { Section, Reveal, Eyebrow } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";

const Contact = () => {
  const { t } = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const formOpenedAt = useRef(Date.now());
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  };

  const validateForm = () => {
    const newErrors = { name: "", email: "", message: "" };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = t.contact.validation.nameRequired;
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = t.contact.validation.emailRequired;
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t.contact.validation.emailInvalid;
      isValid = false;
    }

    if (!form.message.trim()) {
      newErrors.message = t.contact.validation.messageRequired;
      isValid = false;
    } else if (form.message.trim().length < 10) {
      newErrors.message = t.contact.validation.messageMin;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;

    if (!endpoint) {
      setSubmitStatus("error");
      return;
    }

    setLoading(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          company: form.company,
          openedAt: formOpenedAt.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`Contact request failed with ${response.status}`);
      }

      setSubmitStatus("success");
      setForm({ name: "", email: "", message: "", company: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (hasError: boolean) =>
    `rounded-lg border bg-primary px-4 py-[13px] text-[14px] text-heading outline-none transition-colors duration-200 placeholder:text-body ${
      hasError ? "border-red-500" : "border-line focus:border-accent-400"
    }`;

  return (
    <Section id="contact" className="pb-[90px] pt-[72px]">
      <Reveal>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Left: pitch */}
          <div>
            <Eyebrow>{t.contact.subhead}</Eyebrow>
            <h2 className="mt-3 font-display text-[32px] font-bold tracking-[-0.02em] text-heading sm:text-[40px] lg:text-[44px]">
              {t.contact.heading}
            </h2>
            <p
              id="contact-intro"
              className="mt-[18px] max-w-[440px] text-[15px] leading-[1.7] text-body"
            >
              {t.contact.intro}
            </p>
            <p className="mt-6 text-[15px] text-body-strong">
              {t.contact.preferEmail}{" "}
              <a
                href="mailto:me@lfortiz.com"
                className="font-semibold text-accent-300 transition-colors duration-200 hover:text-accent-200"
              >
                me@lfortiz.com
              </a>
            </p>
            <p className="mt-2.5 text-[14px] text-body">
              {t.contact.responseNote}
            </p>
          </div>

          {/* Right: form card */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            aria-describedby="contact-intro"
            className="flex flex-col gap-[18px] rounded-2xl border border-line bg-surface p-8"
          >
            <label htmlFor="contact-name" className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-heading">
                {t.contact.nameLabel}
              </span>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t.contact.namePlaceholder}
                required
                aria-required="true"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={fieldClass(Boolean(errors.name))}
              />
              {errors.name && (
                <span id="name-error" role="alert" className="text-sm text-red-400">
                  {errors.name}
                </span>
              )}
            </label>

            <label htmlFor="contact-email" className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-heading">
                {t.contact.emailLabel}
              </span>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t.contact.emailPlaceholder}
                required
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={fieldClass(Boolean(errors.email))}
              />
              {errors.email && (
                <span id="email-error" role="alert" className="text-sm text-red-400">
                  {errors.email}
                </span>
              )}
            </label>

            <label htmlFor="contact-message" className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-heading">
                {t.contact.messageLabel}
              </span>
              <textarea
                id="contact-message"
                rows={5}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={t.contact.messagePlaceholder}
                required
                aria-required="true"
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={`${fieldClass(Boolean(errors.message))} resize-y`}
              />
              {errors.message && (
                <span id="message-error" role="alert" className="text-sm text-red-400">
                  {errors.message}
                </span>
              )}
            </label>

            {/* Honeypot — off-screen, ignored by humans */}
            <label
              className="absolute -left-[10000px] h-px w-px overflow-hidden"
              aria-hidden="true"
            >
              Company
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                autoComplete="off"
                tabIndex={-1}
              />
            </label>

            {submitStatus === "success" && (
              <div
                role="alert"
                className="rounded-lg border border-status/60 bg-status/10 px-4 py-3 text-status"
              >
                <strong className="font-semibold">{t.contact.success.title}</strong>
                <p className="mt-1 text-sm">{t.contact.success.body}</p>
              </div>
            )}

            {submitStatus === "error" && (
              <div
                role="alert"
                className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-red-400"
              >
                <strong className="font-semibold">{t.contact.error.title}</strong>
                <p className="mt-1 text-sm">{t.contact.error.body}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-fit rounded-[10px] bg-accent-500 px-[26px] py-[13px] text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t.contact.sending : t.contact.send}
            </button>
          </form>
        </div>
      </Reveal>
    </Section>
  );
};

export default Contact;
