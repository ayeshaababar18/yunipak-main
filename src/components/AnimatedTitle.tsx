import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTitleProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const AnimatedTitle = ({ title, subtitle, children, className }: AnimatedTitleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
    });

    tl.to(title, {
      backgroundSize: "100% 100%",
      duration: 1,
      ease: "none",
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="title-wrapper" ref={containerRef} style={{ textAlign: 'center', margin: '0 auto 2rem' }}>
      <style>{`
        .scroll-fill-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(3rem, 7vw, 5rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 0.5rem;
          display: inline-block;
          
          /* Background Clip Fill Effect */
          color: rgba(148, 163, 184, 0.1); /* Very faint base color */
          background: linear-gradient(
            to right, 
            var(--pk-green) 0%, 
            var(--pk-green-bright) 50%, 
            var(--pk-green) 100%
          ) no-repeat;
          background-size: 0% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          transition: background-size 0.1s linear;
          
          /* Premium glow on the text itself */
          filter: drop-shadow(0 0 1px rgba(16, 185, 129, 0.3));
        }

        .scroll-fill-subtitle {
          display: block;
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--text-secondary);
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-top: 1rem;
          opacity: 0.8;
          font-family: 'Inter', sans-serif;
        }

        @media (max-width: 768px) {
          .scroll-fill-title {
            font-size: 3rem;
          }
        }
      `}</style>
      <h1 ref={titleRef} className={`scroll-fill-title ${className || ''}`}>
        {children || title}
      </h1>
      {subtitle && <span className="scroll-fill-subtitle">{subtitle}</span>}
    </div>
  );
};

export default AnimatedTitle;
