import { useState, useRef } from "react";
import styles from "../styles";
import { EarthCanvas } from "./canvas";
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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
    // Clear submit status when user modifies form
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };
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
      setSubmitStatus('error');
      return;
    }

    setLoading(true);
    setSubmitStatus('idle');

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

      setSubmitStatus('success');
      setForm({
        name: "",
        email: "",
        message: "",
        company: "",
      });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={`${styles.styles.padding} max-w-7xl mx-auto relative z-0`}>
      <span className='hash-span'>&nbsp;</span>
      <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
        <div className="flex-0.75 gradient-border bg-surface/70 p-8 rounded-2xl backdrop-blur-xl shadow-accent-glow">
          <p className={`${styles.styles.sectionSubText}`}>{t.contact.subhead}</p>
          <h3 className={`${styles.styles.sectionHeadText}`}>{t.contact.heading}</h3>
          <p id="contact-intro" className="mt-4 max-w-xl text-[15px] leading-relaxed text-body">
            {t.contact.intro}
          </p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            aria-describedby="contact-intro"
            className="mt-12 flex flex-col gap-8"
          >
            <label htmlFor="contact-name" className="flex flex-col ">
              <span className="text-heading font-medium mb-4">
                {t.contact.nameLabel} <span className="text-red-400" aria-label={t.contact.required}>*</span>
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
                className={`bg-bg-2/70 py-4 px-6 placeholder:text-body text-heading rounded-lg outline-none border ${
                  errors.name ? 'border-red-500' : 'border-line'
                } focus:border-accent-400 transition-colors duration-300 font-medium`}
              />
              {errors.name && (
                <span id="name-error" role="alert" className="text-red-400 text-sm mt-2">
                  {errors.name}
                </span>
              )}
            </label>
            
            <label htmlFor="contact-email" className="flex flex-col ">
              <span className="text-heading font-medium mb-4">
                {t.contact.emailLabel} <span className="text-red-400" aria-label={t.contact.required}>*</span>
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
                className={`bg-bg-2/70 py-4 px-6 placeholder:text-body text-heading rounded-lg outline-none border ${
                  errors.email ? 'border-red-500' : 'border-line'
                } focus:border-accent-400 transition-colors duration-300 font-medium`}
              />
              {errors.email && (
                <span id="email-error" role="alert" className="text-red-400 text-sm mt-2">
                  {errors.email}
                </span>
              )}
            </label>
            
            <label htmlFor="contact-message" className="flex flex-col ">
              <span className="text-heading font-medium mb-4">
                {t.contact.messageLabel} <span className="text-red-400" aria-label={t.contact.required}>*</span>
              </span>
              <textarea
                id="contact-message"
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={t.contact.messagePlaceholder}
                required
                aria-required="true"
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={`bg-bg-2/70 py-4 px-6 placeholder:text-body text-heading rounded-lg outline-none border ${
                  errors.message ? 'border-red-500' : 'border-line'
                } focus:border-accent-400 transition-colors duration-300 font-medium`}
              />
              {errors.message && (
                <span id="message-error" role="alert" className="text-red-400 text-sm mt-2">
                  {errors.message}
                </span>
              )}
            </label>

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
            
            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div role="alert" className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
                <strong className="font-bold">{t.contact.success.title}</strong>
                <p className="text-sm mt-1">{t.contact.success.body}</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div role="alert" className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                <strong className="font-bold">{t.contact.error.title}</strong>
                <p className="text-sm mt-1">{t.contact.error.body}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-accent-600 to-cyan-600 hover:shadow-cyan-glow disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed py-3 px-8 outline-none w-fit text-white font-bold shadow-accent-glow rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent-400"
              aria-busy={loading}
              data-cursor="hover"
            >
              {loading ? t.contact.sending : t.contact.send}
            </button>
            <p className="-mt-3 text-sm text-body">
              {t.contact.preferEmail}{" "}
              <a
                href="mailto:me@lfortiz.com"
                className="text-cyan-300 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-surface"
              >
                me@lfortiz.com
              </a>
            </p>
          </form>
        </div>
        <div className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]">
          <EarthCanvas />
        </div>
      </div>
    </section>
  );
};

export default Contact;
