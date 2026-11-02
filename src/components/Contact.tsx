import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import {
  Section,
  Reveal,
  SectionHead,
  Eyebrow,
  buttonClass,
  ArrowRight,
  ArrowUpRight,
} from "./ui/primitives";
import { useLocale } from "../i18n/LocaleContext";
import { useGuatemalaTime } from "../hooks/useGuatemalaTime";
import { sceneStore } from "../lib/sceneStore";

const getSceneSnapshot = () => sceneStore.getSnapshot();

const Contact = () => {
  const { t } = useLocale();
  const time = useGuatemalaTime();
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

  const fieldClass = (hasError: boolean, leading = "leading-[1.4]") =>
    `mt-2 block w-full rounded-md border bg-primary px-3.5 py-3 text-[15px] ${leading} text-heading transition-colors duration-200 placeholder:text-caption focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent-400 ${
      hasError ? "border-red-500" : "border-control focus:border-accent-400"
    }`;

  const labelClass = "block text-label font-medium text-body-strong";
  const errorClass = "mt-2 block text-small text-red-400";
  const rowClass =
    "group flex items-center justify-between border-t border-line py-3.5 text-copy font-medium text-heading transition-colors duration-200 hover:text-accent-300";

  return (
    <Section id="contact" className="relative pt-20 sm:pt-24 lg:pt-28">
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

      <SectionHead label={t.contact.subhead} title={t.contact.heading} />

      <Reveal className="relative mt-12">
        <div id="contact-content">
          {/* Direct line: the closing call to action */}
          <div>
            <Eyebrow>{t.contact.directLabel}</Eyebrow>
            <a
              href="mailto:me@lfortiz.com"
              className="group mt-3 inline-flex items-center gap-4 whitespace-nowrap border-b border-line pb-2.5 font-display text-display-mailto font-medium text-heading transition-colors duration-200 hover:text-accent-300"
            >
              me@lfortiz.com
              <ArrowRight className="h-[0.6em] w-[0.6em] shrink-0" />
            </a>
          </div>

          <div className="mt-14 flex flex-col gap-14 lg:flex-row lg:items-start">
            {/* Left: intro, elsewhere, local time */}
            <div className="min-w-0 lg:flex-1">
              <p id="contact-intro" className="max-w-[36ch] text-lead text-body-strong">
                {t.contact.intro}
              </p>

              <div className="mt-8">
                <Eyebrow>{t.contact.elsewhereLabel}</Eyebrow>
                <ul className="mt-3 flex flex-col">
                  <li>
                    <a
                      href="https://github.com/chutluis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={rowClass}
                    >
                      <span>GitHub</span>
                      <ArrowUpRight />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/luis-ortiz-3b5454195/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={rowClass}
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight />
                    </a>
                  </li>
                  <li>
                    <a
                      href="/resume.pdf"
                      download="Luis_Ortiz_Resume.pdf"
                      className={`${rowClass} border-b`}
                    >
                      <span>{t.contact.resumeLink}</span>
                      <ArrowUpRight />
                    </a>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Eyebrow>{t.contact.localTimeLabel}</Eyebrow>
                <p className="mt-2 font-mono text-[15px] tabular-nums text-body-strong">
                  {time} GMT−6
                </p>
              </div>
            </div>

            {/* Right: contact form */}
            <div className="min-w-0 rounded-xl border border-line bg-surface p-6 sm:p-7 lg:flex-[1.2]">
              <Eyebrow>{t.contact.formLabel}</Eyebrow>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                aria-describedby="contact-intro"
                className="mt-4 flex flex-col gap-5"
              >
                <label htmlFor="contact-name" className="block">
                  <span className={labelClass}>{t.contact.nameLabel}</span>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t.contact.namePlaceholder}
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={fieldClass(Boolean(errors.name))}
                  />
                  {errors.name && (
                    <span id="name-error" role="alert" className={errorClass}>
                      {errors.name}
                    </span>
                  )}
                </label>

                <label htmlFor="contact-email" className="block">
                  <span className={labelClass}>{t.contact.emailLabel}</span>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t.contact.emailPlaceholder}
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={fieldClass(Boolean(errors.email))}
                  />
                  {errors.email && (
                    <span id="email-error" role="alert" className={errorClass}>
                      {errors.email}
                    </span>
                  )}
                </label>

                <label htmlFor="contact-message" className="block">
                  <span className={labelClass}>{t.contact.messageLabel}</span>
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
                    className={`${fieldClass(Boolean(errors.message), "leading-[1.5]")} resize-y`}
                  />
                  {errors.message && (
                    <span id="message-error" role="alert" className={errorClass}>
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
                    className="rounded-xl border border-status/60 px-4 py-3 text-status"
                  >
                    <strong className="font-medium">{t.contact.success.title}</strong>
                    <p className="mt-1 text-small">{t.contact.success.body}</p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/60 px-4 py-3 text-red-400"
                  >
                    <strong className="font-medium">{t.contact.error.title}</strong>
                    <p className="mt-1 text-small">{t.contact.error.body}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className={`${buttonClass} w-fit disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {loading ? t.contact.sending : t.contact.send}
                  <ArrowRight />
                </button>
              </form>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Open water: anchors the reflected constellation (SceneLayer measures it). */}
      <div id="contact-reflection" aria-hidden="true" className="h-[240px] sm:h-[300px] lg:h-[380px]" />
    </Section>
  );
};

export default Contact;
