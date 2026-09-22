// src/components/HOME/TextEffect.tsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextEffectItem {
  mainText: string;
  spanText: string;
  link?: string;
  isExternal?: boolean;
}

const TextEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  const textItems: TextEffectItem[] = [
    { mainText: "YUNI PAKISTAN", spanText: "AWAKENING YOUTH" },
    { mainText: "KNOWLEDGE AS POWER", spanText: "ECONOMIC FREEDOM" },
    { mainText: "UNITY FAITH DISCIPLINE", spanText: "JINNAH'S PILLARS" },
    { mainText: "AWAKENING KHUDI", spanText: "IQBAL'S VISION" },
    { mainText: "JOIN THE MISSION", spanText: "CAREERS", link: "/careers" }
  ];

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('resize', refresh);
    
    textRefs.current.forEach((text) => {
      if (text) {
        gsap.set(text, { backgroundSize: '0% 100%' });
        gsap.to(text, {
          backgroundSize: '100% 100%',
          ease: 'none',
          scrollTrigger: {
            trigger: text,
            start: 'top 95%',
            end: 'bottom 5%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    const refreshST = () => ScrollTrigger.refresh();
    window.addEventListener('load', refreshST);
    
    return () => {
      window.removeEventListener('resize', refresh);
      window.removeEventListener('load', refreshST);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleTouchStart = (_e: React.TouchEvent, index: number) => {
    if (window.innerWidth > 768) return;
    const textEl = textRefs.current[index];
    if (textEl && !textEl.classList.contains('active-touch')) {
      textRefs.current.forEach(el => el?.classList.remove('active-touch'));
      textEl.classList.add('active-touch');
    }
  };

  const handleDocumentTap = () => {
    textRefs.current.forEach(el => el?.classList.remove('active-touch'));
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentTap);
    return () => document.removeEventListener('click', handleDocumentTap);
  }, []);

  return (
    <>
      <style>{`
        .text-effect-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding: 5% 10%;
          gap: 0.5rem;
        }

        .text {
          font-size: 6vw;
          letter-spacing: -.01em;
          line-height: 1.2;
          margin: 0;
          width: 100%;
          color: rgba(100, 116, 139, 0.2);
          background: linear-gradient(to right, var(--text-primary), var(--text-primary)) no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          background-clip: text;
          background-size: 0% 100%;
          border-bottom: 1px solid #2a5a2a;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          position: relative;
          cursor: pointer;
          padding: 0.25rem 0;
        }

        .text span {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: var(--pk-green-light);
          color: var(--bg-primary);
          clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
          transform-origin: center;
          transition: clip-path 0.4s cubic-bezier(.1, .5, .5, 1);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          pointer-events: none;
          top: 0;
          left: 0;
          padding-left: 0;
          font-size: inherit;
          letter-spacing: inherit;
          line-height: inherit;
          font-weight: inherit;
        }

        .text span a,
        .text span .nav-link {
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          font-size: inherit;
          letter-spacing: inherit;
          line-height: inherit;
          font-weight: inherit;
        }

        .text:hover span {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        }

        .text.active-touch span {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        }

        .text.has-link {
          cursor: pointer;
        }

        .text.has-link span {
          pointer-events: auto;
        }

        .text a,
        .text .nav-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          height: 100%;
          font-size: inherit;
          letter-spacing: inherit;
          line-height: inherit;
          font-weight: inherit;
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .text-effect-container {
            padding: 6% 8%;
            gap: 0.75rem;
          }
          .text {
            font-size: 7vw;
          }
        }

        @media (max-width: 767px) {
          .text-effect-container {
            padding: 10% 6%;
            min-height: 80vh;
            gap: 1rem;
          }
          .text {
            font-size: 9vw;
            line-height: 1.3;
            padding: 0.5rem 0;
          }
          .text a,
          .text .nav-link {
            padding: 0.5rem 0;
          }
          .text:hover span {
            clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
          }
        }

        @media (max-width: 480px) {
          .text-effect-container {
            padding: 12% 5%;
          }
          .text {
            font-size: 11vw;
          }
        }

        @media (max-width: 767px) and (orientation: landscape) {
          .text-effect-container {
            min-height: auto;
            padding: 5% 6%;
          }
          .text {
            font-size: 7vw;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .text span {
            transition: none;
          }
          .text {
            transition: none;
          }
          .text:hover span {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
          }
        }
      `}</style>

      <div className="text-effect-container" ref={containerRef}>
        {textItems.map((item, index) => (
          <h1
            key={index}
            className={`text ${item.link ? 'has-link' : ''}`}
            ref={(el) => { textRefs.current[index] = el; }}
            onTouchStart={(e) => handleTouchStart(e, index)}
          >
            {item.mainText}
            <span>
              {item.link ? (
                item.link.startsWith('http') ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.spanText}
                  </a>
                ) : (
                  <Link to={item.link} className="nav-link">
                    {item.spanText}
                  </Link>
                )
              ) : (
                item.spanText
              )}
            </span>
          </h1>
        ))}
      </div>
    </>
  );
};

export default TextEffect;