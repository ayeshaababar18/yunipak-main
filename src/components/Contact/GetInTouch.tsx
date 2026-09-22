import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "../AnimatedTitle";
import AnimatedBackground from "../AnimatedBackground";

gsap.registerPlugin(ScrollTrigger);



// Social Media SVG Icons
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const Logo = () => (
  <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#0c6238" />
    <text x="20" y="27" fontSize="18" fontWeight="bold" fill="#000" textAnchor="middle" fontFamily="Inter, sans-serif">Y</text>
  </svg>
);

const GetInTouch: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    agree: false,
  });

  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({
    type: 'idle',
    message: '',
  });

  // Validation helpers
  const validateName = (value: string): boolean => /^[A-Za-z\s\-']{0,50}$/.test(value);
  const validatePhone = (value: string): boolean => /^\d{0,15}$/.test(value);
  const validateEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 100;
  const validateSubject = (value: string): boolean => value.length <= 200;
  const validateMessage = (value: string): boolean => value.length <= 1000;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!validateName(value)) return;
        break;
      case 'phone':
        if (!validatePhone(value)) return;
        break;
      case 'subject':
        if (!validateSubject(value)) return;
        break;
      case 'message':
        if (!validateMessage(value)) return;
        break;
      default:
        break;
    }
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !validateName(formData.firstName)) {
      setStatus({ type: 'error', message: 'First name must contain only letters, spaces, hyphens or apostrophes (max 50 characters).' });
      return;
    }
    if (!formData.lastName || !validateName(formData.lastName)) {
      setStatus({ type: 'error', message: 'Last name must contain only letters, spaces, hyphens or apostrophes (max 50 characters).' });
      return;
    }
    if (!formData.email || !validateEmail(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address (max 100 characters).' });
      return;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      setStatus({ type: 'error', message: 'Phone number must contain only digits (max 15).' });
      return;
    }
    if (formData.subject && !validateSubject(formData.subject)) {
      setStatus({ type: 'error', message: 'Subject must not exceed 200 characters.' });
      return;
    }
    if (!formData.message || !validateMessage(formData.message)) {
      setStatus({ type: 'error', message: 'Message must not exceed 1000 characters.' });
      return;
    }
    if (!formData.agree) {
      setStatus({ type: 'error', message: 'You must agree to the Privacy Policy.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Sending message...' });

    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          agree: false,
        });
      } else {
        setStatus({ type: 'error', message: `${data.error || 'Something went wrong. Please try again.'}` });
      }
    } catch (error) {
      console.error('Network error:', error);
      setStatus({ type: 'error', message: 'Network error – please check your connection and try again.' });
    }
  };

  useEffect(() => {
    // Entrance animation
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    tl.fromTo(".contact-info", 
      { x: -50, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 1.2 }
    ).fromTo(".contact-form",
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2 },
      "-=0.8"
    );

    // Mouse spotlight effect for cards
    const cards = document.querySelectorAll(".contact-info, .contact-form");
    const handleMouseMove = (e: MouseEvent) => {
      cards.forEach(card => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <section className="contact-premium-section">
        <AnimatedBackground />
        {/* Background Light Orbs */}

        <div className="contact-container-premium">
          <div className="title-wrapper">
            <AnimatedTitle>Establish Contact.</AnimatedTitle>
            <p className="contact-subtitle-premium">
              Ready to initiate a breakthrough? Reach out to our nerve center at NASTP.
            </p>
          </div>

          <div className="contact-layout-premium">
            {/* Left: Contact Info */}
            <div className="contact-info-panel card-glow-border">
              <div className="info-panel-inner">
                <div className="brand-header-premium">
                  <Logo />
                  <span className="brand-text-premium">YUNI Intelligence</span>
                </div>
                
                <div className="info-grid-premium">
                  <div className="info-item-premium">
                    <span className="info-label-premium">Headquarters</span>
                    <p className="info-value-premium">NASTP (National Aerospace Science & Technology Park), Islamabad</p>
                  </div>

                  <div className="info-item-premium">
                    <span className="info-label-premium">Secure Line</span>
                    <p className="info-value-premium">
                      <a href="tel:+923215615401">+92 321 5615401</a>
                    </p>
                  </div>

                  <div className="info-item-premium">
                    <span className="info-label-premium">Digital Drop</span>
                    <p className="info-value-premium">
                      <a href="mailto:Info@yunipakistan.com">Info@yunipakistan.com</a>
                    </p>
                  </div>

                  <div className="info-item-premium">
                    <span className="info-label-premium">Social Nodes</span>
                    <div className="social-nodes-premium">
                      <a href="https://www.instagram.com/yunipakistan" target="_blank" rel="noreferrer noopener" className="social-node" aria-label="Instagram"><InstagramIcon /></a>
                      <a href="https://www.linkedin.com/company/yuni-edtech/" target="_blank" rel="noreferrer noopener" className="social-node" aria-label="LinkedIn"><LinkedInIcon /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-form-panel card-glow-border">
              <div className="form-panel-inner">
                <form onSubmit={handleSubmit} className="premium-form">
                  <div className="form-row-premium">
                    <div className="form-field-premium">
                      <label>First Designation *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
                    </div>
                    <div className="form-field-premium">
                      <label>Surname *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" required />
                    </div>
                  </div>

                  <div className="form-field-premium">
                    <label>Digital Mail *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@address.com" required />
                  </div>

                  <div className="form-field-premium">
                    <label>Inquiry Subject</label>
                    <select name="subject" value={formData.subject} onChange={handleChange}>
                      <option value="">Select Domain</option>
                      <option value="trainings">Educational Trainings</option>
                      <option value="cybersecurity">Cybersecurity Intel</option>
                      <option value="partnership">Strategic Partnership</option>
                      <option value="other">General Inquiry</option>
                    </select>
                  </div>

                  <div className="form-field-premium">
                    <label>Transmission Content *</label>
                    <textarea name="message" rows={5} value={formData.message} onChange={handleChange} placeholder="Describe your objective..." required></textarea>
                  </div>

                  <div className="form-consent-premium">
                    <label className="checkbox-container-premium">
                      <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} required />
                      <span className="checkmark"></span>
                      <p>I agree to the <a href="/privacy-policy">Privacy Protocol</a>.</p>
                    </label>
                  </div>

                  {status.type !== 'idle' && (
                    <div className={`status-banner-premium ${status.type}`}>
                      {status.message}
                    </div>
                  )}

                  <button type="submit" className="submit-btn-premium" disabled={status.type === 'loading'}>
                    <span className="btn-text">{status.type === 'loading' ? 'Transmitting...' : 'Send Transmission'}</span>
                    <div className="btn-glow"></div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-premium-section {
          min-height: 100vh;
          background: transparent;
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
          padding-top: 8rem;
          padding-bottom: 8rem;
          position: relative;
          z-index: 1;
          overflow-x: hidden;
        }

        .contact-container-premium {
          max-width: 85rem;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .contact-subtitle-premium {
          color: var(--text-secondary);
          font-size: 1.15rem;
          margin-top: 1.5rem;
          opacity: 0.8;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.7;
          text-align: center;
        }

        .contact-layout-premium {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 4rem;
          margin-top: 6rem;
          width: 100%;
        }

        /* --- Panels --- */
        .contact-info-panel, .contact-form-panel {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 3rem;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          transition: all 0.6s var(--transition-smooth);
        }

        .info-panel-inner, .form-panel-inner {
          padding: 4rem;
          position: relative;
          z-index: 2;
          height: 100%;
          background: transparent;
        }

        .contact-info-panel:hover, .contact-form-panel:hover {
          transform: translateY(-10px);
          border-color: var(--pk-green);
          box-shadow: 0 40px 80px var(--glass-shadow);
        }

        /* --- Info Content --- */
        .brand-header-premium {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .brand-text-premium {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--pk-green);
          letter-spacing: -0.02em;
        }

        .info-grid-premium { display: flex; flex-direction: column; gap: 3rem; }
        .info-item-premium { display: flex; flex-direction: column; gap: 0.8rem; }
        .info-label-premium { font-size: 0.75rem; font-weight: 900; color: var(--pk-green); text-transform: uppercase; letter-spacing: 0.2em; }
        .info-value-premium { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6; margin: 0; font-weight: 600; }
        .info-value-premium a { color: inherit; text-decoration: none; transition: color 0.3s; }
        .info-value-premium a:hover { color: var(--pk-green); }

        .social-nodes-premium { display: flex; gap: 1.5rem; margin-top: 1rem; }
        .social-node { color: var(--pk-green); transition: all 0.3s; opacity: 0.7; }
        .social-node:hover { transform: translateY(-5px) scale(1.2); opacity: 1; color: var(--pk-green-bright); }

        /* --- Form Content --- */
        .premium-form { display: flex; flex-direction: column; gap: 2rem; }
        .form-row-premium { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .form-field-premium { display: flex; flex-direction: column; gap: 0.8rem; }
        .form-field-premium label { font-size: 0.85rem; font-weight: 700; color: var(--text-tertiary); }
        .form-field-premium input, .form-field-premium select, .form-field-premium textarea {
          background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-light); 
          padding: 1.2rem; border-radius: 1.2rem; color: var(--text-primary); font-size: 1rem; 
          transition: all 0.3s; width: 100%;
        }
        .form-field-premium input:focus, .form-field-premium select:focus, .form-field-premium textarea:focus {
          border-color: var(--pk-green); box-shadow: 0 0 20px var(--pk-green-glow); outline: none; background: rgba(12, 98, 56, 0.05);
        }

        .form-field-premium select option {
          background-color: var(--bg-elevated);
          color: var(--text-primary);
        }

        .form-consent-premium { margin-top: 1rem; }
        .checkbox-container-premium { display: flex; align-items: center; gap: 1.5rem; cursor: pointer; }
        .checkbox-container-premium p { font-size: 0.9rem; color: var(--text-tertiary); margin: 0; }
        .checkbox-container-premium a { color: var(--pk-green); text-decoration: none; font-weight: 800; }

        .status-banner-premium { padding: 1.2rem; border-radius: 1rem; font-size: 0.9rem; font-weight: 700; text-align: center; }
        .status-banner-premium.success { background: rgba(12, 98, 56, 0.1); border: 1px solid var(--pk-green); color: var(--pk-green); }
        .status-banner-premium.error { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; }

        .submit-btn-premium { 
          background: var(--pk-green); color: #fff; padding: 1.5rem; border-radius: 1.5rem; 
          border: none; font-weight: 900; cursor: pointer; transition: all 0.3s;
          box-shadow: 0 10px 30px var(--pk-green-glow); font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.1em;
        }
        .submit-btn-premium:hover:not(:disabled) { transform: translateY(-5px); box-shadow: 0 20px 50px var(--pk-green-glow); }

        @media (max-width: 1024px) {
          .contact-layout-premium { grid-template-columns: 1fr; }
          .info-panel-inner, .form-panel-inner { padding: 2.5rem; }
        }

        @media (max-width: 640px) {
          .contact-premium-section {
            padding-top: 6rem;
            padding-bottom: 5rem;
          }

          .contact-container-premium {
            padding: 0 1rem;
          }

          .title-wrapper {
            margin-bottom: 2rem;
          }

          .contact-layout-premium {
            gap: 1.5rem;
            margin-top: 3rem;
          }

          .contact-info-panel,
          .contact-form-panel {
            border-radius: 1.5rem;
          }

          .info-panel-inner,
          .form-panel-inner {
            padding: 1.5rem;
          }

          .brand-header-premium {
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .brand-text-premium {
            font-size: 1.35rem;
          }

          .info-grid-premium {
            gap: 1.5rem;
          }

          .social-nodes-premium {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .form-row-premium { grid-template-columns: 1fr; }
          .checkbox-container-premium {
            gap: 0.9rem;
            align-items: flex-start;
          }

          .submit-btn-premium {
            padding: 1.1rem;
            border-radius: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default GetInTouch;