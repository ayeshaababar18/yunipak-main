import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import AnimatedBackground from "../AnimatedBackground";
import { galleryImages } from "../../constants/yunityData";
import ImageWithSkeleton from "../ImageWithSkeleton";

const Gallery: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const cards = document.querySelectorAll(".memory-card");
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          scale: 0.5,
          y: 40,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: "back.out(1.7)",
        }
      );
    }
  }, []);

  return (
    <section className="events-premium-section">
      <AnimatedBackground />
      <div className="yunity-gallery-view animate-fade-in-up">
        <div className="gallery-container-premium">
          <button onClick={() => navigate("/events")} className="back-btn-tech">
            <span className="arrow">←</span> BACK TO INTEL
          </button>

          <header className="gallery-header-premium">
            <span className="blog-category-badge-premium" style={{ background: "var(--pk-green)" }}>
              <span className="badge-icon">📷</span>
              <span className="badge-text">Interactive Showcase</span>
            </span>
            <h1 className="gallery-title-premium">
              YUNI-TY 2026 : <span className="text-gradient">Memory Cloud</span>
            </h1>
            <p className="gallery-subtitle-premium">
              An interactive, high-fidelity visual archive. Hover over the floating frames to bring key moments into sharp focus, clearing the lens depth-of-field and enlarging the memory.
            </p>
          </header>

          {/* Interactive Gallery Cloud */}
          <div className="gallery-cloud-viewport" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
            <div className="cloud-ambient-glow"></div>
            {galleryImages.map((photo) => {
              const randomRot =
                photo.id === "g1"
                  ? 4
                  : photo.id === "g2"
                  ? -3
                  : photo.id === "g3"
                  ? 5
                  : photo.id === "g4"
                  ? -6
                  : photo.id === "g5"
                  ? 2
                  : photo.id === "g6"
                  ? -4
                  : photo.id === "g7"
                  ? 6
                  : photo.id === "g8"
                  ? -2
                  : 3;
              return (
                <div
                  key={photo.id}
                  className={`memory-card size-${photo.size}`}
                  style={
                    {
                      left: `${photo.x}%`,
                      top: `${photo.y}%`,
                      transform: `rotate(${randomRot}deg)`,
                      "--card-rotation": `${randomRot}deg`,
                    } as React.CSSProperties
                  }
                >
                  <div className="card-inner">
                    <ImageWithSkeleton src={photo.src} alt={photo.alt} loading="lazy" />
                    <div className="vignette"></div>
                    <div className="scanlines"></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="gallery-footer-actions">
            <button onClick={() => navigate("/blog")} className="back-btn-tech" style={{ margin: "0 auto" }}>
              READ THE STORY <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .events-premium-section {
          min-height: 100vh;
          background: transparent;
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
          padding-top: 100px;
          position: relative;
        }

        .yunity-gallery-view {
          padding: 2rem 0;
          color: var(--text-primary);
        }

        .gallery-container-premium {
          max-width: 90rem;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 10;
        }

        .back-btn-tech {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          padding: 0.8rem 1.6rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 3rem;
        }

        .back-btn-tech:hover {
          border-color: var(--pk-green);
          color: var(--pk-green);
          background: rgba(12, 98, 56, 0.05);
          transform: translateX(-4px);
        }

        .gallery-header-premium {
          text-align: center;
          margin-top: 2rem;
          margin-bottom: 3rem;
        }

        .blog-category-badge-premium {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #000;
        }

        .gallery-title-premium {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .gallery-subtitle-premium {
          color: var(--text-secondary);
          font-size: 1.15rem;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .gallery-cloud-viewport {
          position: relative;
          width: 100%;
          height: 80vh;
          min-height: 600px;
          background: rgba(255, 255, 255, 0.01);
          overflow: hidden;
          border-radius: 2rem;
          border: 1px solid var(--glass-border);
          margin: 3rem 0;
        }

        .cloud-ambient-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .memory-card {
          position: absolute;
          transition: z-index 0s, filter 0.5s ease, opacity 0.5s ease;
          z-index: 2;
          cursor: pointer;
        }

        .memory-card.size-sm { width: 140px; height: 100px; }
        .memory-card.size-md { width: 220px; height: 160px; }
        .memory-card.size-lg { width: 320px; height: 220px; }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          background: rgba(255, 255, 255, 0.02);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
        }

        .memory-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(40%) contrast(1.1) brightness(0.85);
          transition: filter 0.5s ease, transform 0.8s ease;
        }

        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, transparent 50%, rgba(0,0,0,0.6) 100%);
          pointer-events: none;
        }

        .scanlines {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.12) 50%), 
                      linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 3px, 3px 100%;
          pointer-events: none;
          opacity: 0.45;
        }

        /* Hover focal mechanics */
        .gallery-cloud-viewport:hover .memory-card {
          filter: blur(2px) grayscale(80%) brightness(0.6);
          opacity: 0.4;
        }

        .gallery-cloud-viewport .memory-card:hover {
          z-index: 50;
          filter: blur(0px) grayscale(0%) brightness(1.1);
          opacity: 1;
        }

        .gallery-cloud-viewport .memory-card:hover .card-inner {
          transform: scale(1.18) rotate(0deg) translateY(-10px);
          border-color: var(--pk-green-light, #d4af37);
          box-shadow: 0 20px 45px rgba(212, 175, 55, 0.25);
        }

        .gallery-cloud-viewport .memory-card:hover img {
          transform: scale(1.05);
        }

        .gallery-footer-actions {
          display: flex;
          justify-content: center;
          margin-top: 4rem;
          gap: 2rem;
        }

        /* Responsive memory cloud behavior */
        @media (max-width: 768px) {
          .gallery-cloud-viewport {
            height: auto;
            min-height: auto;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            padding: 1.5rem;
          }
          .memory-card {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 1.5 !important;
            transform: none !important;
          }
          .gallery-cloud-viewport:hover .memory-card {
            filter: none !important;
            opacity: 1 !important;
          }
          .gallery-cloud-viewport .memory-card:hover .card-inner {
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Gallery;
