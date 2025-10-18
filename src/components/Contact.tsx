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
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false)
      alert('Thank you, I will get back to you!')
      setForm({
        name: "",
        email: "",
        message: "",
      })
    },(error)=>{
      setLoading(false)
      console.log(error)
      alert('something went wrong....')
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
            <label className="flex flex-col ">
              <span className="text-white font-medium mb-4">Your Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="What's your name?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border border-blue-900/50 focus:border-blue-500 transition-colors duration-300 font-medium"
              />
            </label>
            <label className="flex flex-col ">
              <span className="text-white font-medium mb-4">Your Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="What's your email?"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border border-blue-900/50 focus:border-blue-500 transition-colors duration-300 font-medium"
              />
            </label>
            <label className="flex flex-col ">
              <span className="text-white font-medium mb-4">Your Message</span>
              <textarea
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What do you want to say"
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outlined-none border border-blue-900/50 focus:border-blue-500 transition-colors duration-300 font-medium"
              />
            </label>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 py-3 px-8 outline-none w-fit text-white font-bold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 rounded-xl transition-all duration-300"
            >
              {loading ? "sending" : "Send"}
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
