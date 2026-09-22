// src/components/HOME/Hero.tsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export default function Hero() {
  const navigate = useNavigate();
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.8, force3D: true } });
    tl.fromTo('.hero-title-main', { y: 150, opacity: 0, skewY: 10 }, { y: 0, opacity: 1, skewY: 0, delay: 0.3 })
      .fromTo('.hero-title-accent', { y: 80, opacity: 0 }, { y: 0, opacity: 1 }, '-=1.4')
      .fromTo(subRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1 }, '-=1.2')
      .fromTo(btnsRef.current?.children || [], { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.15 }, '-=1');
  }, []);

  return (
    <section className="hero">
      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2rem 1.5rem;
          background: var(--bg-primary);
        }

        .hero-mesh-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          background: radial-gradient(circle at 20% 30%, rgba(12, 98, 56, 0.12) 0%, transparent 60%),
                      radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.08) 0%, transparent 65%),
                      var(--bg-primary);
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(130px);
          opacity: 0.22;
          animation: floatOrb 25s infinite alternate ease-in-out;
          pointer-events: none;
          will-change: transform;
        }

        .hero-orb-1 {
          width: 500px;
          height: 500px;
          background: var(--pk-green);
          top: -10%;
          left: -10%;
          animation-duration: 25s;
        }

        .hero-orb-2 {
          width: 400px;
          height: 400px;
          background: var(--pk-green-light);
          bottom: 5%;
          right: 5%;
          animation-duration: 30s;
          animation-delay: -7s;
        }

        .hero-orb-3 {
          width: 350px;
          height: 350px;
          background: var(--pk-green);
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-duration: 35s;
          animation-delay: -15s;
        }

        @keyframes floatOrb {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(60px, 30px) scale(1.1);
          }
          100% {
            transform: translate(-30px, 60px) scale(0.95);
          }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 80%, var(--bg-primary) 100%);
          z-index: 1;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 1300px;
          width: 100%;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        @media (min-width: 1024px) {
          .hero-content {
            padding-left: 10%;
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 0.6rem 1.8rem;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          border-radius: 100px;
          color: var(--pk-green-light);
          font-weight: 800;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          box-shadow: 0 4px 20px var(--glass-shadow);
        }

        .hero-title {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .hero-title-main {
          font-size: clamp(3.5rem, 12vw, 8.5rem);
          font-weight: 800;
          color: var(--text-primary);
          line-height: 0.95;
          letter-spacing: -0.04em;
          margin-bottom: 0.25rem;
        }

        .hero-title-accent {
          font-size: clamp(2rem, 8vw, 5rem);
          font-weight: 400;
          color: var(--pk-green-light);
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.02em;
          opacity: 0.95;
        }

        .hero-sub {
          max-width: 550px;
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.6;
          font-weight: 400;
        }

        .hero-btns {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
      `}</style>

      <div className="hero-mesh-bg">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
      </div>

      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <div>
          <div className="hero-badge">
            <span style={{ width: 8, height: 8, background: 'var(--pk-green-light)', borderRadius: '50%', boxShadow: '0 0 10px var(--pk-green-light)' }}></span>
            Rebuilding the 21st-Century Shaheen
          </div>
        </div>

        <h1 className="hero-title">
          <span className="hero-title-main">Awaken</span>
          <span className="hero-title-accent">Your Potential.</span>
        </h1>

        <p className="hero-sub" ref={subRef}>
          Yuni Pakistan is dedicated to transforming theoretical knowledge into 
          real-world economic power. Join the national tech fellowship to discover 
          your purpose, develop modern capabilities, and build a self-reliant digital Pakistan.
        </p>

        <div className="hero-btns" ref={btnsRef}>
          <button className="btn-tech btn-tech-primary" onClick={() => navigate('/summer-camp')}>
            Explore Summer Camp
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <button className="btn-tech btn-tech-outline" onClick={() => navigate('/contact')}>
            Contact Admissions
          </button>
        </div>
      </div>
    </section>
  );
}