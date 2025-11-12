import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import styles from "../styles";
import { EarthCanvas } from "./canvas";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [mountCanvas, setMountCanvas] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Force remount when coming into view to recover from WebGL context loss
            setMountCanvas(false);
            setTimeout(() => setMountCanvas(true), 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitStatus('idle');
    
    emailjs.send(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      {
        from_name: form.name,
        to_name: "Luis",
        from_email: form.email,
        to_email: import.meta.env.VITE_TO_EMAIL,
        message: form.message,
      },
      import.meta.env.VITE_PKEY
    ).then(()=>{
      setLoading(false);
      setSubmitStatus('success');
      setForm({
        name: "",
        email: "",
        message: "",
      });
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    },(error)=>{
      setLoading(false);
      setSubmitStatus('error');
      console.error('Email send error:', error);
      // Auto-hide error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    })
  };

  return (
    <section ref={sectionRef} id="contact" className={`${styles.styles.padding} max-w-7xl mx-auto relative z-0`}>
      <span className='hash-span'>&nbsp;</span>
      <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
        <div className="flex-0.75 bg-black-100 p-8 rounded-2xl border border-blue-900/50 shadow-blue-glow">
          <p className={`${styles.styles.sectionSubText}`}>Get in touch</p>
          <h3 className={`${styles.styles.sectionHeadText}`}>Contact.</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-8"
          >
            <label htmlFor="contact-name" className="flex flex-col ">
              <span className="text-white font-medium mb-4">
                Your Name <span className="text-red-400" aria-label="required">*</span>
              </span>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="What's your name?"
                required
                aria-required="true"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border ${
                  errors.name ? 'border-red-500' : 'border-blue-900/50'
                } focus:border-blue-500 transition-colors duration-300 font-medium`}
              />
              {errors.name && (
                <span id="name-error" role="alert" className="text-red-400 text-sm mt-2">
                  {errors.name}
                </span>
              )}
            </label>
            
            <label htmlFor="contact-email" className="flex flex-col ">
              <span className="text-white font-medium mb-4">
                Your Email <span className="text-red-400" aria-label="required">*</span>
              </span>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="What's your email?"
                required
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border ${
                  errors.email ? 'border-red-500' : 'border-blue-900/50'
                } focus:border-blue-500 transition-colors duration-300 font-medium`}
              />
              {errors.email && (
                <span id="email-error" role="alert" className="text-red-400 text-sm mt-2">
                  {errors.email}
                </span>
              )}
            </label>
            
            <label htmlFor="contact-message" className="flex flex-col ">
              <span className="text-white font-medium mb-4">
                Your Message <span className="text-red-400" aria-label="required">*</span>
              </span>
              <textarea
                id="contact-message"
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What do you want to say?"
                required
                aria-required="true"
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border ${
                  errors.message ? 'border-red-500' : 'border-blue-900/50'
                } focus:border-blue-500 transition-colors duration-300 font-medium`}
              />
              {errors.message && (
                <span id="message-error" role="alert" className="text-red-400 text-sm mt-2">
                  {errors.message}
                </span>
              )}
            </label>
            
            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div role="alert" className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
                <strong className="font-bold">Success!</strong>
                <p className="text-sm mt-1">Thank you for your message. I'll get back to you soon!</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div role="alert" className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                <strong className="font-bold">Error!</strong>
                <p className="text-sm mt-1">Something went wrong. Please try again or contact me directly.</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed py-3 px-8 outline-none w-fit text-white font-bold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
              aria-busy={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
        <div className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]">
          {/* Always render, but remount on visibility to recover from context loss */}
          {mountCanvas && <EarthCanvas key={Date.now()} />}
        </div>
      </div>
    </section>
  );
};

export default Contact;
