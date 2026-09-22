import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "../AnimatedTitle";
import AnimatedBackground from "../AnimatedBackground";

import JobApplicationForm from "./Forms/JobApplicationForm";
import InternshipForm from "./Forms/InternshipForm";
import AmbassadorForm from "./Forms/AmbassadorForm";

gsap.registerPlugin(ScrollTrigger);

export interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  category: 'job' | 'internship' | 'ambassador';
}

export const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbyTe6E2mhnznORt6dvWy9G_7KwCAnQbIx7a5Xp6hTHB1dtpaYrdl5PBrXpjJE_t7D2U/exec';

const positions: Position[] = [
  {
    id: "pos-2",
    title: "Internship Programs",
    department: "Talent Development",
    location: "NASTP or Remote",
    type: "Internship",
    description: "Gain real-world experience inside Pakistan's fastest-growing AI and edtech startup.",
    category: "internship"
  },
  {
    id: "pos-3",
    title: "Yuni Ambassador Program",
    department: "Community",
    location: "Nationwide (Universities)",
    type: "Community Leader",
    description: "Represent Pakistan's AI-powered growth ecosystem at your campus or community.",
    category: "ambassador"
  }
];

const Careers: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  useEffect(() => {
    const items = document.querySelectorAll('.position-panel, .position-card-premium');
    if (items.length > 0) {
      gsap.fromTo(items, 
        { 
          x: -50, 
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".positions-grid-premium",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  const handleApply = (position: Position) => {
    setSelectedPosition(position);
    setShowForm(true);
  };

  return (
    <section className="careers-premium-section">
      <AnimatedBackground />

      <div className="careers-container-premium">
        <div className="title-wrapper">
          <AnimatedTitle>Forge The Future.</AnimatedTitle>
          <p className="careers-subtitle-premium">
            Join our elite squad at NASTP. We don't just hire employees; we recruit visionaries.
          </p>
        </div>

        <div className="positions-grid-premium">
          {positions.map((position) => (
            <div 
              key={position.id} 
              className="position-card-premium card-glow-border"
            >
              <div className="position-card-inner">
                <div className="position-meta-top">
                  <span className="location-tag">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {position.location}
                  </span>
                  <span className="type-tag">{position.type}</span>
                </div>
                
                <h3 className="position-title-premium">{position.title}</h3>
                <div className="department-tag">{position.department}</div>
                
                <p className="position-desc-premium">{position.description}</p>
                
                <div className="position-footer-premium">
                  <button
                    onClick={() => handleApply(position)}
                    className="apply-btn-premium"
                  >
                    <span>Initiate Application</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-cta-premium card-glow-border">
          <div className="cta-content">
            <h2 className="cta-title">Passive Recruitment Active</h2>
            <p className="cta-text">
              Don't see your specific designation? Our talent pool is always open for exceptional minds.
            </p>
            <a href="mailto:careers@yunipakistan.com" className="cta-link-premium">
              Transmit CV / Portfolio <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      {showForm && selectedPosition && (
        <div className="modal-overlay-premium" onClick={() => setShowForm(false)}>
          <div className="modal-content-premium" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-premium" onClick={() => setShowForm(false)}>×</button>

            {selectedPosition.category === 'job' && <JobApplicationForm position={selectedPosition} onClose={() => setShowForm(false)} />}
            {selectedPosition.category === 'internship' && <InternshipForm position={selectedPosition} onClose={() => setShowForm(false)} />}
            {selectedPosition.category === 'ambassador' && <AmbassadorForm position={selectedPosition} onClose={() => setShowForm(false)} />}
          </div>
        </div>
      )}

      <style>{`
        .careers-premium-section {
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

        .careers-container-premium {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .careers-subtitle-premium {
          color: var(--text-secondary);
          font-size: 1.15rem;
          margin-top: 1.5rem;
          opacity: 0.8;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.7;
          text-align: center;
        }

        /* --- Grid --- */
        .positions-grid-premium {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 2.5rem;
          margin-top: 5rem;
          margin-bottom: 5rem;
        }

        /* --- Cards --- */
        .position-card-premium {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 2.5rem;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          transition: all 0.6s var(--transition-smooth);
        }

        .position-card-inner {
          padding: 3rem;
          position: relative;
          z-index: 2;
          background: transparent;
        }

        .position-card-premium:hover {
          transform: translateY(-12px);
          border-color: var(--pk-green);
          box-shadow: 0 40px 80px var(--glass-shadow);
        }

        .position-meta-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .location-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .type-tag {
          background: rgba(12, 98, 56, 0.1);
          color: var(--pk-green);
          padding: 0.4rem 1rem;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid rgba(12, 98, 56, 0.2);
        }

        .position-title-premium {
          font-size: 1.75rem;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .department-tag {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--pk-green);
          margin-bottom: 1.5rem;
          opacity: 0.8;
        }

        .position-desc-premium {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 1rem;
          margin-bottom: 2.5rem;
          flex-grow: 1;
        }

        .apply-btn-premium {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          padding: 1.2rem;
          border-radius: 1.5rem;
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.4s var(--transition-smooth);
        }

        .apply-btn-premium:hover {
          background: var(--pk-green);
          border-color: var(--pk-green);
          color: #fff;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px var(--pk-green-glow);
        }

        /* --- Bottom CTA --- */
        .bottom-cta-premium {
          margin-top: 6rem;
          background: var(--glass-bg);
          backdrop-filter: blur(25px);
          border-radius: 3rem;
          padding: 4rem;
          text-align: center;
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
        }

        .cta-title { font-size: 2.5rem; font-weight: 900; margin-bottom: 1.5rem; }
        .cta-text { color: var(--text-secondary); font-size: 1.1rem; max-width: 600px; margin: 0 auto 2.5rem; line-height: 1.7; }
        .cta-link-premium {
          display: inline-flex; align-items: center; gap: 1rem; color: var(--pk-green);
          font-size: 1.2rem; font-weight: 900; text-decoration: none; transition: all 0.3s ease;
        }
        .cta-link-premium:hover { transform: translateX(10px); color: var(--pk-green-light); }

        /* --- Modal --- */
        .modal-overlay-premium {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(15px);
          z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem;
        }

        .modal-content-premium {
          background: var(--bg-elevated); border: 1px solid var(--pk-green); border-radius: 3rem;
          width: 100%; max-width: 950px; max-height: 90vh; overflow-y: auto; padding: 4rem;
          position: relative; box-shadow: 0 0 100px rgba(12, 98, 56, 0.1);
        }

        .modal-close-premium {
          position: absolute; top: 2rem; right: 2rem; background: none; border: none;
          color: var(--text-tertiary); font-size: 2.5rem; cursor: pointer; transition: color 0.3s;
        }
        .modal-close-premium:hover { color: var(--text-primary); }

        .form-header-premium { margin-bottom: 4rem; }
        .protocol-label { 
          color: var(--pk-green); font-size: 0.75rem; font-weight: 900; 
          text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 1rem; display: block;
        }
        .form-title-premium { font-size: 2.5rem; font-weight: 900; margin: 0; line-height: 1.1; }

        .form-section-premium { margin-bottom: 4rem; }
        .section-title-wrapper { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; }
        .section-number { 
          font-size: 1.5rem; font-weight: 900; color: transparent; 
          -webkit-text-stroke: 1px var(--pk-green); font-family: 'Outfit';
        }
        .section-title-wrapper h3 { font-size: 1.3rem; font-weight: 800; margin: 0; color: var(--text-primary); }

        .form-grid-premium { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .form-field-premium { display: flex; flex-direction: column; gap: 0.8rem; }
        .form-field-premium label { font-size: 0.85rem; font-weight: 700; color: var(--text-tertiary); }
        .form-field-premium input, .form-field-premium select, .form-field-premium textarea {
          background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-light); 
          padding: 1.2rem; border-radius: 1.2rem; color: var(--text-primary); font-size: 1rem; 
          transition: all 0.3s; width: 100%;
        }
        .form-field-premium input:focus { border-color: var(--pk-green); box-shadow: 0 0 20px var(--pk-green-glow); outline: none; }
        .full-width { grid-column: span 2; }

        .declaration-wrapper-premium { padding: 2rem; background: rgba(12, 98, 56, 0.05); border-radius: 1.5rem; border: 1px solid rgba(12, 98, 56, 0.1); }
        .checkbox-container-premium { display: flex; align-items: flex-start; gap: 1.5rem; cursor: pointer; }
        .checkbox-container-premium p { font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary); margin: 0; }

        .form-actions-premium { display: flex; justify-content: flex-end; gap: 2rem; margin-top: 4rem; }
        .cancel-btn-premium { background: none; border: none; color: var(--text-tertiary); font-weight: 700; cursor: pointer; font-size: 1rem; }
        .submit-btn-premium { 
          background: var(--pk-green); color: #fff; padding: 1.5rem 4rem; border-radius: 1.5rem; 
          border: none; font-weight: 900; cursor: pointer; transition: all 0.3s;
          box-shadow: 0 10px 30px var(--pk-green-glow); font-size: 1.1rem;
        }
        .submit-btn-premium:hover { transform: translateY(-5px); box-shadow: 0 20px 50px var(--pk-green-glow); }

        @media (max-width: 1024px) {
          .form-grid-premium { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
          .modal-content-premium { padding: 2rem; }
        }

        @media (max-width: 768px) {
          .careers-premium-section {
            padding-top: 6rem;
            padding-bottom: 5rem;
          }

          .careers-container-premium {
            padding: 0 1rem;
          }

          .positions-grid-premium {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-top: 3rem;
            margin-bottom: 3rem;
          }

          .position-card-inner,
          .bottom-cta-premium,
          .modal-content-premium {
            padding: 1.5rem;
          }

          .position-meta-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .cta-title {
            font-size: 1.8rem;
          }

          .cta-text {
            font-size: 1rem;
          }

          .form-grid-premium {
            gap: 1rem;
          }

          .form-actions-premium {
            flex-direction: column;
            align-items: stretch;
          }

          .submit-btn-premium,
          .cancel-btn-premium {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default Careers;
