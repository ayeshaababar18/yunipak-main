import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import CertificateForm from '../components/CertificateForm';
import AnimatedTitle from '../components/AnimatedTitle';

const Certificates: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-transparent">
      <style>{`
        .certificates-view { 
          padding: 8rem 1rem 6rem; 
          width: 100%;
          max-width: 1200px; 
          margin: 0 auto; 
          position: relative; 
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .title-wrapper { 
          margin-bottom: 3rem; 
          text-align: center; 
          width: 100%;
          padding: 0 1rem;
        }

        @media (max-width: 768px) {
          .certificates-view {
            padding: 6rem 0.75rem 4rem;
          }
          .subtitle-tech {
            font-size: 0.95rem;
            padding: 0 0.5rem;
            margin-top: 1rem;
          }
        }

        .subtitle-tech { 
          color: var(--text-secondary); 
          font-size: 1.1rem; 
          margin-top: 1.5rem; 
          max-width: 700px; 
          margin-left: auto; 
          margin-right: auto; 
          opacity: 0.8; 
          text-align: center; 
          line-height: 1.6;
        }

        .protocol-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(12, 98, 56, 0.1);
          border: 1px solid rgba(12, 98, 56, 0.2);
          border-radius: 100px;
          color: var(--pk-green);
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 2rem;
        }

        .form-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
        }
      `}</style>

      <AnimatedBackground />
      
      <main className="certificates-view flex-grow">
        <div className="title-wrapper">
          <div className="protocol-badge">Secure Certificate Access</div>
          <AnimatedTitle>Validate Your Excellence</AnimatedTitle>
          <p className="subtitle-tech">
            Securely access and download your official YUNI Pakistan certifications. 
            Our digital credentials follow industry-standard verification protocols for global recognition.
          </p>
        </div>

        <div className="form-wrapper">
          <CertificateForm />
        </div>
      </main>
    </div>
  );
};

export default Certificates;
