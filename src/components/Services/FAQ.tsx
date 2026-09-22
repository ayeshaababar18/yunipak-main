'use client';

import { useState, useRef } from 'react';
import AnimatedTitle from '../AnimatedTitle';

const faqs = [
  {
    question: "What is the difference between Online, Hybrid, and On-Site?",
    answer: "Online is fully remote via our Learning Management System (LMS). Hybrid combines online learning with occasional in-person sessions at NASTP. On-Site is fully in-person at our Islamabad campus with direct access to instructors and facilities."
  },
  {
    question: "Do I get a certificate upon completion?",
    answer: "Yes! All students receive Dual Certifications upon successfully completing their training and assessments: a Training Certification and an Internship Certification. Many of our certifications are also accredited and recognized by leading industry partners."
  },
  {
    question: "What are the payment methods accepted?",
    answer: "We accept bank transfers to Meezan Bank, Easypaisa, and JazzCash. Detailed payment instructions are provided during the checkout process. EMI options are also available for select trainings."
  },
  {
    question: "Can I get a refund if I change my mind?",
    answer: "Yes, we offer a 7-day refund window after the training start date, provided you have completed less than 20% of the training content. Refund requests must be submitted in writing to support@yunipakistan.com."
  },
  {
    question: "Are there any prerequisites for the trainings?",
    answer: "Prerequisites vary by training. Beginner-level trainings require no prior experience. Intermediate trainings recommend basic understanding of the subject. Advanced trainings require prior knowledge or completion of prerequisite trainings. Check individual training pages for specific requirements."
  },
  {
    question: "How long will I have access to the training materials?",
    answer: "You receive lifetime access to all training materials, video lectures, and resources after enrollment. This includes future updates to the training content at no additional cost."
  },
  {
    question: "Do you offer job placement assistance?",
    answer: "Yes, we provide career support including resume reviews, interview preparation, and connections to our hiring partner network. Our graduates have been placed at leading tech companies across Pakistan."
  },
  {
    question: "Can I take multiple trainings simultaneously?",
    answer: "Yes, you can enroll in multiple trainings. However, we recommend managing your workload carefully. Contact our academic advisors for a personalized learning plan if you plan to take more than two trainings at once."
  },
  {
    question: "What technical requirements do I need for online trainings?",
    answer: "You need a reliable internet connection (minimum 10 Mbps), a laptop or desktop computer (8GB RAM recommended), a webcam for proctored exams, and Zoom installed for live sessions. Specific software requirements are listed on each training page."
  },
  {
    question: "Do you offer group discounts for organizations?",
    answer: "Yes, we offer corporate packages and group discounts for teams of 5 or more. Contact our corporate sales team at corporate@yunipakistan.com for customized quotes."
  },
  {
    question: "What is the class schedule like?",
    answer: "Classes are typically held in evening slots (6 PM - 9 PM) on weekdays and weekend batches are available on Saturday and Sunday. Specific schedules vary by training and are shared upon enrollment."
  },
  {
    question: "Are instructors industry professionals?",
    answer: "Absolutely. All our instructors are experienced industry practitioners with 5+ years of hands-on experience in their respective fields. They bring real-world projects and case studies to the classroom."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const rafId = useRef<number | null>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafId.current) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
    const y = ((e.clientY - rect.top) / card.clientHeight) * 100;

    rafId.current = requestAnimationFrame(() => {
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
      rafId.current = null;
    });
  };

  return (
    <>
      <section className="faq-premium-section">
        {/* Background Light Orbs */}
        <div className="gradient-orb" style={{ top: '20%', left: '10%' }}></div>
        <div className="gradient-orb" style={{ bottom: '20%', right: '10%', background: 'radial-gradient(circle, var(--pk-green-bright) 0%, transparent 70%)' }}></div>

        <div className="faq-container-premium">
          <div className="title-wrapper">
            <AnimatedTitle>Frequented Queries.</AnimatedTitle>
            <p className="faq-subtitle-premium">Everything you need to know about our tactical operations.</p>
          </div>

          <div className="faq-grid-premium">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item-premium card-glow-border ${openIndex === index ? 'open' : ''}`}
                onMouseMove={handleMouseMove}
              >
                <div className="faq-item-inner">
                  <button
                    className="faq-question-premium"
                    onClick={() => toggle(index)}
                  >
                    <span className="question-text">{faq.question}</span>
                    <span className={`faq-icon-premium ${openIndex === index ? 'open' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </span>
                  </button>
                  <div className={`faq-answer-premium ${openIndex === index ? 'open' : ''}`}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .faq-premium-section {
          min-height: 100vh;
          padding: 8rem 2rem 8rem;
          position: relative;
          z-index: 1;
          overflow: hidden;
          background: transparent;
        }

        .faq-container-premium {
          max-width: 80rem;
          margin: 0 auto;
        }

        .faq-header-premium {
          text-align: center;
          margin-bottom: 6rem;
        }

        .faq-subtitle-premium {
          color: var(--text-secondary);
          font-size: 1.2rem;
          margin-top: 1.5rem;
          opacity: 0.8;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .faq-grid-premium {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        @media (max-width: 1024px) {
          .faq-grid-premium {
            grid-template-columns: 1fr;
          }
        }

        .faq-item-premium {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 2rem;
          transition: all 0.5s var(--transition-smooth);
          height: fit-content;
          will-change: backdrop-filter, transform;
        }

        [data-perf="low"] .faq-item-premium {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          background: var(--glass-bg-heavy);
        }

        .faq-item-inner {
          padding: 1.5rem 2rem;
          background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(12, 98, 56, 0.05) 0%, transparent 70%);
        }

        .faq-item-premium:hover {
          transform: translateY(-5px);
          border-color: var(--pk-green);
          box-shadow: 0 30px 60px var(--glass-shadow);
        }

        .faq-item-premium.open {
          border-color: var(--pk-green);
          background: rgba(12, 98, 56, 0.03);
          box-shadow: 0 0 40px var(--pk-green-glow);
        }

        .faq-question-premium {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: none;
          outline: none;
          padding: 1rem 0;
          cursor: pointer;
          color: var(--text-primary);
          text-align: left;
        }

        .faq-question-premium:focus,
        .faq-question-premium:focus-visible {
          outline: none;
          border: none;
          box-shadow: none;
        }

        .question-text {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.4;
        }

        .faq-icon-premium {
          width: 3rem;
          height: 3rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--pk-green);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .faq-icon-premium.open {
          background: var(--pk-green);
          color: #fff;
          transform: rotate(45deg);
          box-shadow: 0 0 20px var(--pk-green-glow);
        }

        .faq-answer-premium {
          max-height: 0;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }

        .faq-answer-premium.open {
          max-height: 500px;
          opacity: 1;
          padding: 1rem 0 1.5rem;
        }

        .faq-answer-premium p {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1rem;
          margin: 0;
        }
      `}</style>
    </>
  );
}