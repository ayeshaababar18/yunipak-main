// src/components/HOME/CTA.tsx
import { useNavigate } from 'react-router-dom';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta-tech">
      <style>{`
        .cta-tech {
          max-width: 1200px;
          margin: 4rem auto 8rem;
          padding: 0 1.5rem;
        }

        .cta-box {
          position: relative;
          background: var(--pk-green-dark);
          background: linear-gradient(135deg, var(--pk-green-dark) 0%, #001a0a 100%);
          border-radius: var(--card-radius);
          padding: 5rem 3rem;
          overflow: hidden;
          text-align: center;
          color: #ffffff;
          box-shadow: 0 40px 100px rgba(0, 143, 76, 0.2);
        }

        [data-theme="light"] .cta-box {
          background: linear-gradient(135deg, var(--pk-green) 0%, var(--pk-green-dark) 100%);
        }

        .cta-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(12, 98, 56, 0.1) 0%, transparent 70%);
          animation: ctaPulse 10s ease-in-out infinite;
        }

        @keyframes ctaPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        .cta-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .cta-title-tech {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }

        .cta-sub-tech {
          max-width: 600px;
          font-size: 1.1rem;
          opacity: 0.8;
          line-height: 1.6;
        }

        .btn-cta {
          background: #ffffff;
          color: var(--pk-green-dark);
          padding: 1.2rem 3rem;
          border-radius: 100px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.4s var(--transition-smooth);
        }

        .btn-cta:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          background: var(--pk-green-light);
          color: #ffffff;
        }

        .cta-decor {
          position: absolute;
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: 15rem;
          opacity: 0.05;
          pointer-events: none;
          line-height: 1;
          user-select: none;
        }

        .cta-decor-1 { top: -2rem; left: -2rem; }
        .cta-decor-2 { bottom: -2rem; right: -2rem; }
      `}</style>

      <div className="cta-box">
        <div className="cta-decor cta-decor-1">YUNI</div>
        <div className="cta-decor cta-decor-2">2026</div>

        <div className="cta-content">
          <h2 className="cta-title-tech">Shape the Future <br/> of <span style={{color: 'var(--pk-green-light)'}}>Pakistan.</span></h2>
          <p className="cta-sub-tech">
            Discover your purpose, unleash your potential, and work with discipline for a 
            greater collective future. Apply now to join Yuni Pakistan.
          </p>
          <button className="btn-cta" onClick={() => navigate('/contact')}>
            Apply Now
          </button>
        </div>
      </div>
    </section>
  );
}