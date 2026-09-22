

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper: split text into span elements for character animation
  const splitTextIntoSpans = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return [];
    const text = element.innerText;
    const chars = text.split('');
    element.innerHTML = '';
    const spans = chars.map((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre';
      element.appendChild(span);
      return span;
    });
    return spans;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const huluChars = splitTextIntoSpans('hulu-text');
      const originalsChars = splitTextIntoSpans('originals-text');

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      tl.from(["#top-gradient", "#bottom-gradient"], 0.7, {
        ease: "power3.inOut",
        filter: "blur(0px)",
        opacity: 0,
      })
        .from(
          "#green-filter",
          0.8,
          { opacity: 0, scale: 3 },
          "-=50%"
        )
        .to("#green-filter", 0.25, { opacity: 0, scale: 3 })
        .to(
          ["#top-gradient", "#bottom-gradient"],
          0.3,
          { filter: "blur(0px)", opacity: 0 },
          "-=100%"
        )
        .set("#logo", { opacity: 1 })
        .from(
          huluChars,
          0.2,
          {
            ease: "back",
            filter: "blur(0.3em)",
            opacity: 0,
            scale: 1.5,
            stagger: 0.02,
          },
          "<"
        )
        .from(
          originalsChars,
          0.2,
          {
            delay: 0.25,
            filter: "blur(0.3em)",
            opacity: 0,
            scale: 0.5,
            stagger: 0.02,
            xPercent: -25,
          },
          "<"
        )
        .from(
          "#logo-border",
          0.4,
          { ease: "power3.out", opacity: 0, scale: 0.75 },
          "-=100%"
        )
        .from(
          "#logo-border-inner",
          0.4,
          { ease: "power3.out", scale: 0.75 },
          "-=100%"
        )
        .to("#logo", 1.5, { scale: 1.1 }, "-=20%")
        .to(
          ["#logo-border", "#logo-border-inner"],
          1.5,
          { ease: "power3.out", scale: 1.1 },
          "-=100%"
        )
        .to("#logo-border", 1.25, { ease: "power4.in", scale: 8 }, "-=50%")
        .to(
          "#logo-border-inner",
          0.5,
          { ease: "power4.in", scale: 8 },
          "-=60%"
        )
        .to("#logo", 0.25, { opacity: 0, scale: 1.2 }, "-=50%");
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="intro-overlay">
      <style>{`
        .intro-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgb(10, 10, 10);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 9999;
        }

        .intro-overlay .absolute-centered {
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .intro-overlay .jakarta-sans-font {
          font-family: "Plus Jakarta Sans", sans-serif;
          font-weight: 700;
        }

        .intro-overlay .zen-dots-font {
          font-family: "Outfit", sans-serif;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .intro-overlay #green-filter {
          background: radial-gradient(rgba(12, 98, 56, 0.05), rgba(12, 98, 56, 0.4) 80%);
          height: 100%;
          left: 0px;
          position: absolute;
          top: 0px;
          width: 100%;
          z-index: 1;
        }

        .intro-overlay .gradient {
          filter: blur(3em);
          height: 80px;
          left: -5%;
          position: absolute;
          width: 110%;
        }

        .intro-overlay #top-gradient {
          background: linear-gradient(
            to right,
            rgba(12, 98, 56, 0.75) 0% 10%,
            transparent 10% 20%,
            rgba(212, 175, 55, 0.5) 20% 50%,
            rgba(12, 98, 56, 0.5) 50% 70%,
            rgba(212, 175, 55, 0.75) 70%
          );
          top: -50px;
        }

        .intro-overlay #bottom-gradient {
          background: linear-gradient(
            to right,
            rgba(12, 98, 56, 0.75) 0% 10%,
            transparent 10% 30%,
            rgba(12, 98, 56, 0.5) 30% 50%,
            transparent 50% 70%,
            rgba(212, 175, 55, 0.5) 70% 80%,
            transparent 80%
          );
          bottom: -50px;
        }

        .intro-overlay #logo-wrapper {
          align-items: center;
          display: flex;
          height: 100vh;
          justify-content: center;
          width: 100vw;
          /* Removed scale transform to keep font sizes consistent */
        }

        .intro-overlay #logo {
          opacity: 0;
          position: relative;
          z-index: 2;
        }

        .intro-overlay #logo-border {
          background-color: #d4af37;
          border-radius: 2.25em;
          height: 160%;
          width: 140%;
          z-index: 1;
        }

        .intro-overlay #logo-border-inner {
          background-color: rgb(10, 10, 10);
          border-radius: 2em;
          height: calc(160% - 0.5em);
          width: calc(140% - 0.5em);
          z-index: 2;
        }

        .intro-overlay #logo-text {
          position: relative;
          z-index: 3;
          text-align: center;
        }

        .intro-overlay #hulu-text {
          color: #d4af37;
          /* Use clamp to keep size readable on all devices */
          font-size: clamp(4rem, 15vw, 8rem);
          line-height: 1.2;
          white-space: nowrap;
        }

        .intro-overlay #originals-text {
          color: white;
          /* Fixed size that doesn't scale too small */
          font-size: clamp(1.8rem, 6vw, 3rem);
          letter-spacing: 0.12em;
          white-space: nowrap;
        }

        /* Ensure fonts stay crisp on all screens */
        .intro-overlay #hulu-text span,
        .intro-overlay #originals-text span {
          display: inline-block;
          white-space: pre;
          transform: translateZ(0); /* improves rendering */
        }

        /* Small screens: keep font sizes readable without scaling container */
        @media (max-width: 600px) {
          .intro-overlay #hulu-text {
            font-size: 4.5rem; /* fallback if clamp not supported */
          }
          .intro-overlay #originals-text {
            font-size: 2rem;
          }
        }

        /* For very small devices, slightly reduce but still readable */
        @media (max-width: 380px) {
          .intro-overlay #hulu-text {
            font-size: 3.8rem;
          }
          .intro-overlay #originals-text {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <div id="green-filter"></div>
      <div id="top-gradient" className="gradient"></div>
      <div id="bottom-gradient" className="gradient"></div>
      <div id="logo-wrapper">
        <div id="logo">
          <div id="logo-border" className="absolute-centered"></div>
          <div id="logo-border-inner" className="absolute-centered"></div>
          <div id="logo-text">
            <div id="hulu-text" className="zen-dots-font">yuni</div>
            <br />
            <div id="originals-text" className="jakarta-sans-font">PAKISTAN</div>
          </div>
        </div>
      </div>
    </div>
  );
}