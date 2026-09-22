// src/components/HOME/NationalAnalysis.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function NationalAnalysis() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.analysis-card');
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section className="national-analysis-section" ref={containerRef}>
      <style>{`
        .national-analysis-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 6rem 1.5rem;
          position: relative;
          z-index: 10;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-subtitle-premium {
          font-family: 'Outfit', sans-serif;
          color: var(--pk-green-light);
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          display: block;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }

        @media (min-width: 1024px) {
          .analysis-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .analysis-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--card-radius);
          padding: 3.5rem 2.5rem;
          transition: all 0.5s var(--transition-smooth);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
          overflow: hidden;
        }

        .analysis-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--pk-green), var(--pk-green-light));
          opacity: 0.8;
        }

        .analysis-card:hover {
          transform: translateY(-8px);
          border-color: var(--pk-green-light);
          box-shadow: 0 30px 60px var(--glass-shadow);
          background: var(--bg-primary);
        }

        .card-header-icon {
          font-size: 2.5rem;
          line-height: 1;
        }

        .card-title-text {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .card-lead-p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .analysis-points-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          list-style: none;
          padding: 0;
        }

        .analysis-point-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .point-marker {
          background: var(--pk-green-glow-subtle);
          border: 1px solid var(--pk-green);
          color: var(--pk-green-light);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        [data-theme="dark"] .point-marker {
          background: rgba(212, 175, 55, 0.08);
          border-color: var(--pk-green-light);
        }

        .point-title {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .point-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .highlight-accent {
          color: var(--pk-green);
          font-weight: 700;
        }

        [data-theme="dark"] .highlight-accent {
          color: var(--pk-green-light);
        }
      `}</style>

      <div className="section-header">
        <span className="section-subtitle-premium">National Context & Strategy</span>
        <h2 className="section-title">Bridging The <span className="text-gradient">National Capability Gap</span></h2>
      </div>

      <div className="analysis-grid">
        {/* National Analysis Card */}
        <div className="analysis-card">
          <div>
            <div className="card-header-icon">🇵🇰</div>
            <h3 className="card-title-text">National Analysis</h3>
            <p className="card-lead-p">
              Pakistan possesses one of the world's youngest populations, yet faces critical systemic challenges 
              in translating intellectual potential into economic self-reliance.
            </p>
          </div>

          <ul className="analysis-points-list">
            <li className="analysis-point-item">
              <span className="point-marker">1</span>
              <div>
                <h4 className="point-title">Shift to Local Architecting</h4>
                <p className="point-desc">
                  For decades, the local tech ecosystem has operated as simple digital consumers or basic task executors. 
                  Pakistan lacks creators who <span className="highlight-accent">architect and build</span> world-class digital systems from the ground up.
                </p>
              </div>
            </li>

            <li className="analysis-point-item">
              <span className="point-marker">2</span>
              <div>
                <h4 className="point-title">Degrees Without Competency</h4>
                <p className="point-desc">
                  Traditional academic systems focus heavily on theoretical textbooks. Students graduate with formal degrees 
                  but possess little to <span className="highlight-accent">zero hands-on capability</span> to meet global industrial standards.
                </p>
              </div>
            </li>

            <li className="analysis-point-item">
              <span className="point-marker">3</span>
              <div>
                <h4 className="point-title">Sovereignty and Innovation</h4>
                <p className="point-desc">
                  To achieve financial independence, the nation's youth must transition from dependent job seekers to 
                  self-reliant innovators, directly linking Pakistan to the high-value global digital economy.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Skills Gap Card */}
        <div className="analysis-card">
          <div>
            <div className="card-header-icon">📉</div>
            <h3 className="card-title-text">The Skills Gap Breakdown</h3>
            <p className="card-lead-p">
              The modern workforce faces severe deficiencies across technical, analytical, and professional spheres 
              that restrict career growth and international competitiveness.
            </p>
          </div>

          <ul className="analysis-points-list">
            <li className="analysis-point-item">
              <span className="point-marker">A</span>
              <div>
                <h4 className="point-title">Curriculum-Industry Misalignment</h4>
                <p className="point-desc">
                  The primary bottleneck is the lack of project-based, practical training. Students are rarely exposed to 
                  production-level software development, modern deployment pipelines, or professional version control.
                </p>
              </div>
            </li>

            <li className="analysis-point-item">
              <span className="point-marker">B</span>
              <div>
                <h4 className="point-title">Deficit in Critical Tech Tools</h4>
                <p className="point-desc">
                  Workforce capabilities are severely lacking in high-demand domains like <span className="highlight-accent">Artificial Intelligence, Cloud Computing, and Enterprise Architecture</span>, leaving graduates under-equipped.
                </p>
              </div>
            </li>

            <li className="analysis-point-item">
              <span className="point-marker">C</span>
              <div>
                <h4 className="point-title">Soft Skills & Communication Crisis</h4>
                <p className="point-desc">
                  Technical brilliance alone is insufficient. Gaps in professional English communication, structured debate, 
                  critical thinking, and ethical leadership prevent Pakistani talent from leading global teams.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
