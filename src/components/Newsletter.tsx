import React, { useState } from 'react';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbxv3FVEPexjV4hLcAWNj6FafStyFzqzrJWzo-Zk8FJFOWkxw-mh9bxNi-ZYbwnLHyfzxg/exec';

const COUPON_CODE = '';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    if (!phone || phone.length < 10) {
      setStatus({ type: 'error', message: 'Please enter a valid phone number.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

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

      setStatus({
          type: 'success',
          message: `Thank you for subscribing! 🥳\n\nYou have successfully joined the YUNIVERSE newsletter.`
        });

        // Party popper animation confetti (dual burst)
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999999 };

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        setEmail('');
        setPhone('');
    } catch (error: any) {
      console.error('Newsletter error:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="newsletter-section">
      <style>{`
        .newsletter-section {
          position: relative;
          padding: 5rem 2rem;
          overflow: hidden;
        }

        .newsletter-container {
          max-width: 900px;
          margin: 0 auto;
          background: var(--glass-bg, rgba(255,255,255,0.03));
          backdrop-filter: blur(25px);
          border: 1px solid var(--glass-border, rgba(255,255,255,0.06));
          border-radius: 2.5rem;
          padding: 4rem 3.5rem;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .newsletter-container::before {
          content: '';
          position: absolute;
          top: -60%;
          right: -30%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(0, 143, 76, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .newsletter-container::after {
          content: '';
          position: absolute;
          bottom: -40%;
          left: -20%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(12, 98, 56, 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .newsletter-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .newsletter-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(12, 98, 56, 0.08);
          border: 1px solid rgba(12, 98, 56, 0.2);
          color: var(--pk-green-light, #d4af37);
          padding: 0.4rem 1.2rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
        }

        .newsletter-badge-dot {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
          animation: nlPulse 1.5s infinite;
        }

        .newsletter-title {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--text-primary, #fff);
          margin-bottom: 0.8rem;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .newsletter-title-accent {
          background: linear-gradient(135deg, var(--pk-green-light, #d4af37), var(--pk-green, #0c6238));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .newsletter-desc {
          color: var(--text-secondary, #a0aab2);
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 560px;
          margin: 0 auto 2.5rem;
          opacity: 0.85;
        }

        .newsletter-coupon-teaser {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(12, 98, 56, 0.06);
          border: 1px dashed rgba(212, 175, 55, 0.3);
          padding: 0.7rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2.5rem;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--pk-green-light, #d4af37);
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .newsletter-field {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: var(--bg-elevated, rgba(255,255,255,0.04));
          border: 1px solid var(--border-light, rgba(255,255,255,0.08));
          border-radius: 14px;
          padding: 0 1.2rem;
          transition: all 0.3s ease;
        }

        .newsletter-field:focus-within {
          border-color: var(--pk-green, #0c6238);
          box-shadow: 0 0 0 3px rgba(12, 98, 56, 0.08);
        }

        .newsletter-field-icon {
          color: var(--text-tertiary, rgba(255,255,255,0.35));
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .newsletter-field input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 1.1rem 0;
          color: var(--text-primary, #fff);
          font-size: 0.95rem;
          font-family: inherit;
        }

        .newsletter-field input::placeholder {
          color: var(--text-tertiary, rgba(255,255,255,0.35));
          opacity: 0.7;
        }

        .newsletter-submit-btn {
          width: 100%;
          background: var(--pk-green, #0c6238);
          color: #fff;
          border: none;
          padding: 1.2rem;
          border-radius: 14px;
          font-size: 1rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          box-shadow: 0 8px 20px rgba(12, 98, 56, 0.2);
          margin-top: 0.5rem;
        }

        .newsletter-submit-btn:hover:not(:disabled) {
          background: var(--pk-green-light, #d4af37);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(212, 175, 55, 0.3);
        }

        .newsletter-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .newsletter-privacy {
          font-size: 0.75rem;
          color: var(--text-tertiary, rgba(255,255,255,0.35));
          margin-top: 0.8rem;
          line-height: 1.5;
        }

        /* --- Newsletter Modal Overlay --- */
        .newsletter-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          padding: 20px;
          backdrop-filter: blur(8px);
          animation: nlFadeIn 0.4s ease forwards;
        }

        .newsletter-modal-card {
          background: linear-gradient(135deg, #0d1310 0%, #050706 100%);
          border: 1px solid rgba(12, 98, 56, 0.25);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 460px;
          width: 100%;
          text-align: center;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(12, 98, 56, 0.05);
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          position: relative;
          overflow: hidden;
          animation: nlScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .newsletter-modal-card.error-modal {
          background: linear-gradient(135deg, #1a0f12 0%, #0a0507 100%);
          border-color: rgba(255, 71, 87, 0.25);
          box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255, 71, 87, 0.05);
        }

        .newsletter-modal-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .newsletter-modal-glow {
          position: absolute;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(12, 98, 56, 0.2) 0%, transparent 70%);
          animation: nlPulse 2s infinite ease-in-out;
        }

        .error-modal .newsletter-modal-glow {
          background: radial-gradient(circle, rgba(255, 71, 87, 0.2) 0%, transparent 70%);
        }

        .newsletter-modal-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(12, 98, 56, 0.06);
          border: 1px solid rgba(12, 98, 56, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: inset 0 0 20px rgba(12, 98, 56, 0.1);
          color: var(--pk-green-light, #d4af37);
        }

        .error-modal .newsletter-modal-icon {
          background: rgba(255, 71, 87, 0.06);
          border-color: rgba(255, 71, 87, 0.3);
          color: #ff4757;
        }

        .newsletter-modal-title {
          margin: 0;
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
        }

        .newsletter-modal-message {
          margin: 0;
          color: #a0aab2;
          line-height: 1.7;
          font-size: 0.95rem;
          white-space: pre-line;
        }

        .newsletter-coupon-display {
          background: rgba(12, 98, 56, 0.08);
          border: 2px dashed rgba(212, 175, 55, 0.4);
          border-radius: 14px;
          padding: 1.2rem 2rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--pk-green-light, #d4af37);
          letter-spacing: 0.08em;
          font-family: 'Outfit', monospace;
        }

        .newsletter-modal-btn {
          margin-top: 0.5rem;
          padding: 1rem 2.5rem;
          background: var(--pk-green, #0c6238);
          color: #fff;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          width: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(12, 98, 56, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .newsletter-modal-btn:hover {
          background: var(--pk-green-light, #d4af37);
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(12, 98, 56, 0.35);
        }

        .error-modal .newsletter-modal-btn {
          background: #ff4757;
          box-shadow: 0 10px 20px rgba(255, 71, 87, 0.2);
        }

        .error-modal .newsletter-modal-btn:hover {
          background: #ff6b81;
        }

        @keyframes nlFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes nlScaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes nlPulse {
          0%, 100% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        @media (max-width: 768px) {
          .newsletter-section { padding: 3.5rem 1.2rem; }
          .newsletter-container { padding: 2.5rem 1.8rem; border-radius: 1.8rem; }
          .newsletter-title { font-size: 2rem; }
          .newsletter-desc { font-size: 0.92rem; margin-bottom: 2rem; }
          .newsletter-modal-card { padding: 2rem 1.5rem; border-radius: 18px; }
          .newsletter-modal-title { font-size: 1.3rem; }
          .newsletter-coupon-display { font-size: 1.1rem; padding: 1rem 1.5rem; }
        }

        @media (max-width: 480px) {
          .newsletter-section { padding: 2.5rem 0.8rem; }
          .newsletter-container { padding: 2rem 1.2rem; border-radius: 1.4rem; }
          .newsletter-title { font-size: 1.6rem; }
          .newsletter-desc { font-size: 0.85rem; margin-bottom: 1.5rem; }
          .newsletter-coupon-teaser { font-size: 0.78rem; padding: 0.5rem 1rem; }
          .newsletter-field input { font-size: 0.88rem; padding: 0.9rem 0; }
          .newsletter-field { padding: 0 1rem; border-radius: 12px; }
          .newsletter-submit-btn { padding: 1rem; font-size: 0.9rem; border-radius: 12px; }
          .newsletter-modal-card { padding: 1.5rem 1.2rem; border-radius: 16px; max-width: 100%; }
          .newsletter-modal-icon { width: 60px; height: 60px; }
          .newsletter-modal-glow { width: 70px; height: 70px; }
          .newsletter-modal-title { font-size: 1.15rem; }
          .newsletter-modal-message { font-size: 0.82rem; }
          .newsletter-coupon-display { font-size: 0.95rem; padding: 0.8rem 1rem; gap: 0.5rem; }
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
          width: 100%;
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
          background: rgba(0, 143, 76, 0.1);
          border: 1px dashed rgba(12, 98, 56, 0.4);
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
      `}</style>

      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-badge">
            <div className="newsletter-badge-dot"></div>
            Yuniverse
          </div>

          <h2 className="newsletter-title">
            Welcome to <span className="newsletter-title-accent">YUNIVERSE</span>
          </h2>

          <p className="newsletter-desc" style={{ color: 'var(--pk-green-light)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.8rem' }}>
            Join the YUNIVERSE Community!
          </p>

          <p className="newsletter-desc" style={{ marginTop: 0 }}>
            Subscribe to our newsletter to receive exclusive updates, curriculum announcements, and insights.
          </p>

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-field">
              <span className="newsletter-field-icon">✉️</span>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="newsletter-field">
              <span className="newsletter-field-icon">📱</span>
              <input
                type="tel"
                placeholder="WhatsApp number (e.g., 03123456789)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="newsletter-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : (
                <>Subscribe <Send size={18} /></>
              )}
            </button>
          </form>

          <p className="newsletter-privacy">
            🔒 We respect your privacy. Unsubscribe at any time. No spam, ever.
          </p>
        </div>
      </div>

      {/* Confirmation / Error Modal */}
      {status && (
        <div className="newsletter-modal-overlay">
          <div className={`newsletter-modal-card ${status.type === 'error' ? 'error-modal' : ''}`}>
            <div className="newsletter-modal-icon-wrap">
              <div className="newsletter-modal-glow"></div>
              <div className="newsletter-modal-icon">
                {status.type === 'success' ? <CheckCircle size={36} /> : <AlertTriangle size={36} />}
              </div>
            </div>

            <h3 className="newsletter-modal-title">
              {status.type === 'success' ? 'Welcome to YUNIVERSE' : 'Oops!'}
            </h3>

            {status.type === 'success' ? (
              <div className="congrats-notification-card">
                <div className="congrats-icon-wrap">
                  <CheckCircle size={24} />
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
              <p className="newsletter-modal-message">{status.message}</p>
            )}

            <button
              type="button"
              className="newsletter-modal-btn"
              onClick={() => setStatus(null)}
            >
              {status.type === 'success' ? 'Got It!' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Newsletter;
