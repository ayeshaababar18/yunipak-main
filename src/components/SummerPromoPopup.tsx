import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles, ShieldCheck, Send, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const SummerPromoPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbxv3FVEPexjV4hLcAWNj6FafStyFzqzrJWzo-Zk8FJFOWkxw-mh9bxNi-ZYbwnLHyfzxg/exec';
  const COUPON_CODE = '';

  useEffect(() => {
    // Show popup after 1.5 seconds if not dismissed during current session
    const isDismissed = sessionStorage.getItem('promo-popup-dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('promo-popup-dismissed', 'true');
  };

  const handleAction = (path: string) => {
    handleDismiss();
    navigate(path);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const submitData = new URLSearchParams();
      submitData.append('formType', 'newsletter');
      submitData.append('email', email);
      submitData.append('phone', phone);
      submitData.append('couponCode', COUPON_CODE);
      submitData.append('timestamp', new Date().toISOString());

      await fetch(GOOGLE_SHEETS_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: submitData,
      });

      setIsSubscribed(true);
        
        // Party popper animation confetti (dual burst)
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          // since particles fall down, animate a bit higher than they would
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    } catch (error: any) {
      console.error('Newsletter error:', error);
      setErrorMsg(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          /* backdrop-filter: blur(12px); Removed for perf */
          z-index: 5000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.5s ease;
        }

        .popup-card {
          width: 100%;
          max-width: 850px;
          background: var(--bg-primary);
          border-radius: 28px;
          position: relative;
          overflow: hidden;
          padding: 3rem 2.5rem 2.5rem 2.5rem;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .popup-card::before {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          background: linear-gradient(135deg, var(--pk-green), transparent, var(--pk-green-light));
          z-index: -1;
          border-radius: 30px;
          opacity: 0.3;
        }

        .popup-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: var(--text-secondary);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .popup-close-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          transform: rotate(90deg);
        }

        .popup-split-container {
          display: flex;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .popup-column {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .popup-column:first-child::after {
          content: '';
          position: absolute;
          right: -1.5rem;
          top: 5%;
          bottom: 5%;
          width: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .column-content {
          text-align: left;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .popup-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(12, 98, 56, 0.08);
          color: var(--pk-green);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 1.2rem;
          align-self: flex-start;
          border: 1px solid rgba(12, 98, 56, 0.15);
        }

        .popup-badge.blue-badge {
          background: rgba(0, 145, 234, 0.08);
          color: #0091ea;
          border-color: rgba(0, 145, 234, 0.15);
        }

        .badge-pulse {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
          animation: pulse 1.5s infinite;
        }

        .column-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          line-height: 1.2;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .column-title.prominent {
          font-size: 2.2rem;
          color: var(--pk-green);
        }

        .column-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          min-height: 70px;
        }

        .highlights-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-bottom: 2rem;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .highlight-item svg {
          flex-shrink: 0;
        }

        .column-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--pk-green) 0%, var(--pk-green-light) 100%);
          color: #000;
          border: none;
          padding: 1.1rem;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 10px 20px rgba(12, 98, 56, 0.15);
        }

        .column-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(12, 98, 56, 0.25);
        }

        .popup-footer-text {
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-tertiary);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.2rem;
          margin-top: 1rem;
        }

        .popup-scroll-container {
          width: 100%;
          height: 100%;
        }

        /* Form styling inside popup */
        .popup-form {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-top: auto;
          width: 100%;
        }

        .popup-field {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0 1rem;
          transition: all 0.3s ease;
        }

        .popup-field:focus-within {
          border-color: #0091ea;
          box-shadow: 0 0 0 3px rgba(0, 145, 234, 0.15);
        }

        .popup-field-icon {
          color: rgba(255, 255, 255, 0.35);
          font-size: 0.85rem;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .popup-field input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 0.8rem 0;
          color: var(--text-primary, #fff);
          font-size: 0.9rem;
          font-family: inherit;
        }

        .popup-field input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .popup-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #0091ea 0%, #00b0ff 100%);
          color: #fff;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 10px 20px rgba(0, 145, 234, 0.15);
        }

        .popup-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(0, 145, 234, 0.25);
        }

        .popup-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .popup-error-msg {
          color: #ff4757;
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: -0.2rem;
          margin-bottom: 0.2rem;
          text-align: left;
        }

        /* Congrats Notification Card */
        .congrats-notification-card {
          background: rgba(12, 98, 56, 0.04);
          border: 1px solid rgba(12, 98, 56, 0.2);
          border-radius: 16px;
          padding: 1.2rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          text-align: left;
          box-shadow: 0 10px 30px rgba(12, 98, 56, 0.05), inset 0 0 15px rgba(12, 98, 56, 0.02);
          margin-top: 1rem;
          animation: slideInUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .congrats-icon-wrap {
          background: rgba(12, 98, 56, 0.1);
          border: 1px solid rgba(12, 98, 56, 0.3);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--pk-green-light, #d4af37);
          flex-shrink: 0;
          box-shadow: 0 0 12px rgba(12, 98, 56, 0.1);
        }

        .congrats-text-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          flex: 1;
        }

        .congrats-title {
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
        }

        .congrats-message {
          font-size: 0.85rem;
          color: #a0aab2;
          margin: 0;
          line-height: 1.4;
        }

        .congrats-subtext {
          font-size: 0.75rem;
          color: var(--text-tertiary, rgba(255,255,255,0.35));
          margin: 0;
          line-height: 1.4;
        }

        .congrats-coupon {
          align-self: flex-start;
          background: rgba(12, 98, 56, 0.1);
          border: 1px dashed rgba(212, 175, 55, 0.4);
          color: var(--pk-green-light, #d4af37);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: 800;
          margin-top: 0.5rem;
          letter-spacing: 0.05em;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 768px) {
          .popup-card {
            max-width: 500px;
            padding: 0;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          .popup-scroll-container {
            overflow-y: auto;
            padding: 3rem 1.5rem 1.5rem 1.5rem;
            width: 100%;
          }
          .popup-close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.15);
            z-index: 1000;
            margin: 0;
          }
          .popup-close-btn:hover {
            background: rgba(255, 255, 255, 0.25);
          }
          .popup-split-container {
            flex-direction: column;
            gap: 2.5rem;
          }
          .popup-column:first-child::after {
            display: none;
          }
          .column-content {
            text-align: center;
            align-items: center;
          }
          .popup-badge {
            margin-bottom: 1rem;
            align-self: center;
          }
          .column-title {
            font-size: 1.6rem;
          }
          .column-title.prominent {
            font-size: 1.8rem;
          }
          .column-desc {
            min-height: auto;
            font-size: 0.85rem;
          }
          .highlights-list {
            align-items: center;
            margin-bottom: 1.5rem;
          }
        }

        @media (max-width: 420px) {
          .popup-card {
            padding: 0;
            border-radius: 20px;
            max-height: 88vh;
          }
          .popup-scroll-container {
            padding: 2.5rem 1rem 1.2rem 1rem;
          }
          .popup-close-btn {
            width: 36px;
            height: 36px;
            top: 0.8rem;
            right: 0.8rem;
          }
          .column-title {
            font-size: 1.3rem;
          }
          .column-title.prominent {
            font-size: 1.5rem;
          }
          .column-desc {
            font-size: 0.8rem;
          }
          .highlight-item {
            font-size: 0.78rem;
          }
          .column-btn {
            padding: 0.9rem;
            font-size: 0.82rem;
            border-radius: 12px;
          }
          .popup-footer-text {
            font-size: 0.72rem;
          }
        }
      `}</style>

      <div className="popup-card">
        <button className="popup-close-btn" onClick={handleDismiss} title="Dismiss">
          <X size={20} />
        </button>

        <div className="popup-scroll-container">
          <div className="popup-split-container">
            {/* Column 1: Summer Camp 2026 */}
            <div className="popup-column">
              <div className="column-content">
                <div className="popup-badge">
                  <div className="badge-pulse"></div>
                  ☀️ Registrations Open!
                </div>
                <h3 className="column-title prominent">YUNI Summer Camp 2026</h3>
                <p className="column-desc">
                  Join our premium IT & soft skills programs. 7 specialized tracks designed for career growth and hands-on learning at NASTP.
                </p>
                <div className="highlights-list">
                  <div className="highlight-item">
                    <Sparkles size={18} color="var(--pk-green)" />
                    <span>7 Specialized Tracks & Certifications</span>
                  </div>
                  <div className="highlight-item">
                    <ShieldCheck size={18} color="var(--pk-green)" />
                    <span>PSEB Certified Industry Programs</span>
                  </div>
                  <div className="highlight-item">
                    <Award size={18} color="var(--pk-green)" />
                    <span>Interactive Real-World Projects</span>
                  </div>
                </div>
              </div>
              <button className="column-btn" onClick={() => handleAction('/summer-camp')}>
                Register Now <ArrowRight size={18} />
              </button>
            </div>

            {/* Column 2: Newsletter */}
            <div className="popup-column">
              <div className="column-content">
                <div className="popup-badge blue-badge">
                  <div className="badge-pulse"></div>
                  📢 Newsletter
                </div>
                <h3 className="column-title">Welcome to YUNIVERSE</h3>
                
                {isSubscribed ? (
                  <div className="congrats-notification-card">
                    <div className="congrats-icon-wrap">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="congrats-text-wrap">
                      <h4 className="congrats-title">Subscription Active! 🥳</h4>
                      <p className="congrats-message">
                        Thank you for joining the YUNIVERSE newsletter.
                      </p>
                      <p className="congrats-subtext">
                        We will send you updates on new programs, events, and resources.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="column-desc" style={{ color: 'var(--pk-green-light)', fontWeight: 800, marginBottom: '0.5rem', minHeight: 'auto' }}>
                      Join the YUNIVERSE Community!
                    </p>
                    <p className="column-desc" style={{ fontSize: '0.82rem', minHeight: 'auto', marginBottom: '1.2rem', color: 'var(--text-secondary)' }}>
                      Subscribe to our newsletter to receive exclusive updates, curriculum announcements, and insights.
                    </p>
                    
                    <form className="popup-form" onSubmit={handleSubscribe}>
                      <div className="popup-field">
                        <span className="popup-field-icon">✉️</span>
                        <input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="popup-field">
                        <span className="popup-field-icon">📱</span>
                        <input
                          type="tel"
                          placeholder="WhatsApp (e.g., 03123456789)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      {errorMsg && <div className="popup-error-msg">{errorMsg}</div>}
                      <button type="submit" className="popup-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Subscribing...' : (
                          <>Subscribe <Send size={16} /></>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="popup-footer-text">
            Empowering the Youth through Modern Skills & Tech Education at NASTP Rawalpindi
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummerPromoPopup;
