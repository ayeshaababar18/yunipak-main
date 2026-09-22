export default function AnimatedBackground() {
  return (
    <div className="liquid-bg-container">
      <div className="liquid-background">
        <div className="liquid-container">
          <div className="liquid-orb orb-1"></div>
          <div className="liquid-orb orb-2"></div>
          <div className="liquid-orb orb-3"></div>
          <div className="liquid-orb orb-4"></div>
        </div>
      </div>
      
      <style>{`
        .liquid-bg-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -5;
          background: var(--bg-primary);
          overflow: hidden;
          pointer-events: none;
        }

        .liquid-orb {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60vw;
          height: 60vw;
          margin-left: -30vw;
          margin-top: -30vw;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          mix-blend-mode: var(--orb-blend-mode);
          pointer-events: none;
          will-change: transform;
        }

        .orb-1 {
          background: radial-gradient(circle at 50% 50%, var(--bg-primary) 0%, #000 100%);
          width: 70vw;
          height: 70vw;
          opacity: 0.3;
          animation: orbFloat1 25s infinite alternate ease-in-out;
        }

        .orb-2 {
          background: radial-gradient(circle, var(--pk-green) 0%, transparent 70%);
          width: 50vw;
          height: 50vw;
          opacity: 0.2;
          animation: orbFloat2 30s infinite alternate ease-in-out;
          animation-delay: -5s;
        }

        .orb-3 {
          background: radial-gradient(circle, #004d40 0%, transparent 70%);
          width: 80vw;
          height: 80vw;
          opacity: 0.15;
          animation: orbFloat3 35s infinite alternate ease-in-out;
          animation-delay: -10s;
        }

        .orb-4 {
          background: radial-gradient(circle, var(--pk-green-light) 0%, transparent 70%);
          width: 40vw;
          height: 40vw;
          opacity: 0.1;
          animation: orbFloat4 20s infinite alternate ease-in-out;
          animation-delay: -15s;
        }

        @keyframes orbFloat1 {
          0% { transform: translate3d(-10%, -10%, 0); }
          50% { transform: translate3d(10%, 10%, 0); }
          100% { transform: translate3d(-10%, 15%, 0); }
        }

        @keyframes orbFloat2 {
          0% { transform: translate3d(15%, 5%, 0); }
          50% { transform: translate3d(-5%, 15%, 0); }
          100% { transform: translate3d(10%, -10%, 0); }
        }

        @keyframes orbFloat3 {
          0% { transform: translate3d(-15%, 10%, 0); }
          50% { transform: translate3d(10%, -15%, 0); }
          100% { transform: translate3d(5%, 10%, 0); }
        }

        @keyframes orbFloat4 {
          0% { transform: translate3d(10%, -10%, 0); }
          50% { transform: translate3d(-10%, -5%, 0); }
          100% { transform: translate3d(5%, 15%, 0); }
        }

        @media (max-width: 768px) {
          .liquid-orb {
            width: 100vw;
            height: 100vw;
            margin-left: -50vw;
            margin-top: -50vw;
            filter: blur(40px);
          }
        }

        [data-perf="low"] .liquid-orb,
        [data-webgl="false"] .liquid-orb {
          filter: blur(40px);
          opacity: 0.2;
          will-change: auto; /* Reduce compositor pressure */
        }

        [data-webgl="false"] .liquid-orb {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
