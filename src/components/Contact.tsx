import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { Section, Reveal, SectionHead, buttonClass } from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";
import { sceneStore } from "../lib/sceneStore";

const getSceneSnapshot = () => sceneStore.getSnapshot();

const Contact = () => {
  const { t } = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const formOpenedAt = useRef(Date.now());
  const scene = useSyncExternalStore(sceneStore.subscribe, getSceneSnapshot, getSceneSnapshot);
  const sceneReady = scene.ready && !scene.lost;
  const [poolFallbackMounted, setPoolFallbackMounted] = useState(true);
  useEffect(() => {
    if (!sceneReady) { setPoolFallbackMounted(true); return; }
    const id = window.setTimeout(() => setPoolFallbackMounted(false), 600);
    return () => window.clearTimeout(id);
  }, [sceneReady]);
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
    `min-h-11 rounded-[4px] border bg-primary px-4 py-[13px] text-[14px] text-heading transition-colors duration-200 placeholder:text-body ${
      hasError ? "border-red-500" : "border-line focus:border-accent-400"
    }`;

  return (
    <Section id="contact" className="relative pb-40 pt-20 sm:pb-48 sm:pt-24 lg:pb-60 lg:pt-28">
      <div id="river-pool" aria-hidden="true" className="pointer-events-none absolute inset-0">
        {(!sceneReady || poolFallbackMounted) && (
          <svg
            className="absolute inset-0 h-full w-full"
            style={{ opacity: sceneReady ? 0 : 1, transition: "opacity 600ms ease-out" }}
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            fill="none"
          >
            <ellipse cx="500" cy="500" rx="560" ry="500" stroke="#2a2a40" vectorEffect="non-scaling-stroke" />
            <ellipse cx="500" cy="500" rx="400" ry="340" stroke="#2a2a40" vectorEffect="non-scaling-stroke" />
            <ellipse cx="500" cy="500" rx="240" ry="190" stroke="#a78bfa" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" />
          </svg>
        )}
      </div>
      <Reveal className="relative">
        <SectionHead index="06" label={t.contact.subhead} title={t.contact.heading} />

        <div id="contact-content" className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-x-10">
          {/* Left: introduction */}
          <div className="lg:col-span-4 lg:col-start-4">
            <p
              id="contact-intro"
              className="max-w-[40ch] text-[17px] leading-[1.65] text-body-strong"
            >
              {t.contact.intro}
            </p>
            <p className="mt-6 text-[15px] text-body-strong">
              {t.contact.preferEmail}{" "}
              <a
                href="mailto:me@lfortiz.com"
                className="inline-flex min-h-11 items-center font-semibold text-accent-300 transition-colors duration-200 hover:text-accent-200"
              >
                me@lfortiz.com
              </a>
            </p>
            <p className="mt-2.5 text-[14px] text-body">
              {t.contact.responseNote}
            </p>
          </div>

          {/* Right: contact form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            aria-describedby="contact-intro"
            className="flex flex-col gap-[18px] border border-line bg-surface p-6 sm:p-8 lg:col-span-5"
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
                className="border border-status/60 px-4 py-3 text-status"
              >
                <strong className="font-semibold">{t.contact.success.title}</strong>
                <p className="mt-1 text-sm">{t.contact.success.body}</p>
              </div>
            )}

            {submitStatus === "error" && (
              <div
                role="alert"
                className="border border-red-500/60 px-4 py-3 text-red-400"
              >
                <strong className="font-semibold">{t.contact.error.title}</strong>
                <p className="mt-1 text-sm">{t.contact.error.body}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={`${buttonClass} w-fit disabled:cursor-not-allowed disabled:opacity-60`}
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
