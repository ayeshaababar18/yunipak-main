

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/HOME/Hero';
import FeaturesReveal from '../components/HOME/FeaturesReveal';
import NationalAnalysis from '../components/HOME/NationalAnalysis';
import CTA from '../components/HOME/CTA';
import TextEffect from '../components/HOME/TextEffect';
import FAQ from '../components/Services/FAQ';
import AnimatedTitle from '../components/AnimatedTitle';
import AnimatedBackground from '../components/AnimatedBackground';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stats cards animation
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.querySelectorAll('.stat-item'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' }
        }
      );
    }

    // Partners animation
    if (partnersRef.current) {
      gsap.fromTo(
        partnersRef.current.querySelectorAll('.partner-card, .certificate-card'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.2, ease: 'power4.out',
          scrollTrigger: { trigger: partnersRef.current, start: 'top 85%' }
        }
      );
    }

    // Team animation
    if (teamRef.current) {
      gsap.fromTo(
        teamRef.current.querySelectorAll('.mesh-card'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.2, ease: 'power4.out',
          scrollTrigger: { trigger: teamRef.current, start: 'top 85%' }
        }
      );
    }

    // Testimonials animation
    if (testimonialsRef.current) {
      gsap.fromTo(
        testimonialsRef.current.querySelectorAll('.testimonial-card'),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1, stagger: 0.2, ease: 'power4.out',
          scrollTrigger: { trigger: testimonialsRef.current, start: 'top 85%' }
        }
      );
    }
  }, []);

  const team = [
    {
      name: 'Abdul Moiz',
      role: 'Founder',
      image: '/images/moiz.jpeg',
      desc: 'Driving the macro-vision of YUNI to build an unparalleled educational empire.'
    }
  ];

  const testimonials = [
    { name: 'Ahmed R.', course: 'Cybersecurity', text: 'The program at NASTP completely changed my trajectory. Landed a job immediately.', letter: 'A' },
    { name: 'Fatima S.', course: 'Amazon Mastery', text: 'The YUNI ecosystem is incredible. We launched a real product during our professional training.', letter: 'F' },
    { name: 'Usman K.', course: 'Prompt Engineering', text: 'The YUNI LMS is smoother than my university. The gamification kept me hooked.', letter: 'U' }
  ];

  return (
    <div className="home-container">
      <style>{`
        .home-container {
          background-color: transparent;
          transition: background-color 0.4s ease;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 8rem 1.5rem;
        }

        /* Stats Design */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-item {
          padding: 3rem 1.5rem;
          text-align: center;
          border-radius: var(--card-radius);
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          transition: all 0.4s var(--transition-smooth);
        }

        .stat-item:hover {
          background: var(--bg-primary);
          border-color: var(--pk-green);
          transform: translateY(-10px);
          box-shadow: 0 20px 40px var(--glass-shadow);
        }

        .stat-number {
          font-size: 3.5rem;
          font-weight: 900;
          color: var(--pk-green);
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        /* Team Design */
        .team-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .team-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .team-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 1.5rem;
          margin-bottom: 2rem;
          filter: grayscale(100%);
          transition: filter 0.5s ease;
        }

        .mesh-card:hover .team-image {
          filter: grayscale(0%);
        }

        .team-role {
          color: var(--pk-green);
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          margin-bottom: 0.5rem;
        }

        .team-name {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        /* Testimonials Design */
        .testimonial-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .testimonial-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .testimonial-card {
          padding: 3rem;
          background: var(--bg-tertiary);
          border-radius: var(--card-radius);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          border: 1px solid transparent;
          transition: all 0.4s ease;
        }

        .testimonial-card:hover {
          background: var(--bg-primary);
          border-color: var(--pk-green);
          transform: translateY(-5px);
        }

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--pk-green);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .quote {
          font-size: 1.1rem;
          font-style: italic;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .partners-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-top: 3rem;
        }
        @media (min-width: 768px) {
          .partners-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .partner-card {
          padding: 2rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--card-radius);
          text-align: center;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .partner-card:hover {
          border-color: var(--pk-green);
          background: var(--bg-primary);
          box-shadow: 0 10px 30px var(--glass-shadow);
        }

        .partner-logo {
          max-width: 160px;
          height: auto;
          mix-blend-mode: multiply;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        [data-theme="dark"] .partner-logo {
          mix-blend-mode: normal;
          background: #ffffff;
          padding: 1.2rem;
          border-radius: 1.5rem;
          box-shadow: 0 0 30px rgba(12, 98, 56, 0.15);
        }

        .certificate-card {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 3rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--card-radius);
          align-items: center;
          text-align: center;
        }

        @media (min-width: 1024px) {
          .certificate-card {
            flex-direction: row;
            text-align: left;
            align-items: center;
            justify-content: space-between;
          }
        }

        .certificate-img {
          max-width: 100%;
          border-radius: 12px;
          border: 4px solid var(--border-light);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        @media (min-width: 1024px) {
          .certificate-img {
            max-width: 50%;
          }
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 5rem 1rem;
          }

          .stats-grid,
          .testimonial-grid,
          .partners-grid {
            grid-template-columns: 1fr;
          }

          .stat-item,
          .testimonial-card,
          .partner-card,
          .certificate-card {
            padding: 1.5rem;
          }

          .team-image {
            height: 280px;
          }

          .team-name {
            font-size: 2rem;
          }

          .certificate-card {
            text-align: left;
          }

          .certificate-card img {
            width: 100%;
          }

          .certificate-card h2 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>

      <AnimatedBackground />
      <Hero />

      <section className="section-container" ref={statsRef}>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">5K+</div>
            <div className="stat-label">Trained</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Trainings</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Success</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </section>

      <FeaturesReveal />

      <NationalAnalysis />

      <section className="section-container" ref={teamRef}>
        <AnimatedTitle className="section-title">The Core</AnimatedTitle>
        <div className="team-grid">
          {team.map((member, i) => (
            <div key={i} className="mesh-card">
              <img src={member.image} alt={member.name} className="team-image" />
              <div className="team-role">{member.role}</div>
              <div className="team-name">{member.name}</div>
              <p className="team-desc" style={{ color: 'var(--text-secondary)' }}>{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container" ref={testimonialsRef}>
        <AnimatedTitle className="section-title">Voices of Success</AnimatedTitle>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="quote">"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="avatar">{t.letter}</div>
                <div>
                  <div style={{ fontWeight: 800 }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{t.course}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container" ref={partnersRef}>
        <AnimatedTitle className="section-title">Partners & Registrations</AnimatedTitle>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto' }}>
          We are officially partnered and registered with top industry and government entities to ensure our trainings meet the highest standards.
        </p>
        <div className="partners-grid">
          <div className="partner-card">
            <img src="/images/nastp.png" alt="NASTP" className="partner-logo" />
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Official Registration Partner</p>
          </div>
          <div className="partner-card">
            <div style={{ fontSize: '3rem' }}>🎓</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Dual Certification</h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Graduates receive both a Training Certification and an Internship Certification.</p>
          </div>

          <div className="certificate-card">
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                PSEB Certified Training Provider
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                YUNI Pakistan is officially registered with the Pakistan Software Export Board (PSEB). Our training programs are aligned with national standards, providing you with credentials recognized by top tech companies nationwide.
              </p>
              <ul style={{ color: 'var(--text-secondary)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.8rem', listStyle: 'none', padding: 0 }}>
                <li>✓ Official Government Recognition</li>
                <li>✓ Industry-Validated Curriculum</li>
                <li>✓ Dual Certification Path (Training + Internship)</li>
              </ul>
            </div>
            <img src="/images/pseb-certificate.png" alt="PSEB Certificate" className="certificate-img" />
          </div>
        </div>
      </section>

      <FAQ />

      <div style={{ padding: '8rem 0' }}>
        <TextEffect />
      </div>

      <CTA />
    </div>
  );
}