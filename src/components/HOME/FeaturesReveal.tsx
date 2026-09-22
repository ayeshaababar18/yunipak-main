// src/components/HOME/FeaturesReveal.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FeaturesReveal = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      title: 'Khudi',
      desc: 'Building inner resilience and technical self-mastery.',
      icon: '01'
    },
    {
      title: 'Economic',
      desc: 'Achieving financial sovereignty through digital mastery.',
      icon: '02'
    },
    {
      title: 'Innovation',
      desc: 'Transforming from digital consumers to global creators.',
      icon: '03'
    },
    {
      title: 'Unity',
      desc: 'Collective growth through collaborative tech ecosystems.',
      icon: '04'
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current.querySelectorAll('.feature-card-tech'),
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1.2, stagger: 0.15, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      }
    );
  }, []);

  return (
    <section className="features-tech" ref={sectionRef}>
      <style>{`
        .features-tech {
          max-width: 1200px;
          margin: 0 auto;
          padding: 8rem 1.5rem;
        }

        .features-grid-tech {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .features-grid-tech {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .features-grid-tech {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .feature-card-tech {
          padding: 3rem 2rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: var(--card-radius);
          transition: all 0.5s var(--transition-smooth);
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .feature-card-tech:hover {
          background: var(--bg-primary);
          border-color: var(--pk-green);
          transform: translateY(-10px);
          box-shadow: 0 30px 60px var(--glass-shadow);
        }

        .feature-number {
          font-family: 'Outfit', sans-serif;
          font-size: 3rem;
          font-weight: 900;
          color: var(--border-glow);
          line-height: 1;
          transition: color 0.5s ease;
        }

        .feature-card-tech:hover .feature-number {
          color: var(--pk-green);
        }

        .feature-title-tech {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .feature-desc-tech {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }
      `}</style>

      <h2 className="section-title">Our <span className="text-gradient">Core Pillars</span></h2>
      <div className="features-grid-tech">
        {features.map((f, i) => (
          <div key={i} className="feature-card-tech">
            <div className="feature-number">{f.icon}</div>
            <div>
              <h3 className="feature-title-tech">{f.title}</h3>
              <p className="feature-desc-tech">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesReveal;