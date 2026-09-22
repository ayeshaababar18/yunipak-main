import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedTitle from '../components/AnimatedTitle';

type TabType = 'privacy' | 'terms';

interface LegalProps {
  defaultTab?: TabType;
}

const Legal: React.FC<LegalProps> = ({ defaultTab }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Set tab based on prop, path, or default to privacy
  const [activeTab, setActiveTab] = useState<TabType>('privacy');

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    } else if (location.pathname.includes('terms')) {
      setActiveTab('terms');
    } else {
      setActiveTab('privacy');
    }
  }, [location.pathname, defaultTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Smoothly update the URL without refreshing page
    navigate(tab === 'terms' ? '/terms' : '/privacy', { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="legal-section">
      <AnimatedBackground />
      
      <div className="legal-container">
        <div className="legal-header">
          <AnimatedTitle>
            {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
          </AnimatedTitle>
          <p className="legal-subtitle">
            YUNI Pakistan Collective • National Aerospace Science & Technology Park (NASTP)
          </p>
        </div>

        {/* Tab Controls */}
        <div className="legal-tabs-wrapper">
          <div className="legal-tabs-container glass-panel">
            <button 
              className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => handleTabChange('privacy')}
            >
              Privacy Policy
            </button>
            <button 
              className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => handleTabChange('terms')}
            >
              Terms of Service
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="legal-content-card glass-panel card-glow-border">
          <div className="legal-content-inner">
            {activeTab === 'privacy' ? (
              <div className="legal-text-content">
                <div className="last-updated">Last Updated: June 8, 2026</div>
                
                <h2>1. Introduction</h2>
                <p>
                  Welcome to YUNI Pakistan ("YUNI", "we", "us", or "our"). Operating from our state-of-the-art facility at the National Aerospace Science & Technology Park (NASTP), Islamabad, we are committed to protecting the privacy and security of our students, applicants, ambassadors, partners, and web visitors.
                </p>
                <p>
                  This Privacy Policy describes how we collect, use, process, and disclose your personal information in connection with your access to and use of the YUNI platform, websites, portals, learning programs, and recruitment activities.
                </p>

                <h2>2. Information We Collect</h2>
                <p>
                  We collect information that you provide directly to us when using our services. This includes:
                </p>
                <ul>
                  <li><strong>Personal Identification:</strong> Full name, National Identity Card (CNIC) number, date of birth, and gender.</li>
                  <li><strong>Contact Details:</strong> Email address, mobile/telephone number, permanent address, and current address.</li>
                  <li><strong>Academic Records:</strong> Highest level of education, degree majors, university or institute name, graduation year, and GPA/academic standing.</li>
                  <li><strong>Professional Status:</strong> Current employment, years of experience, primary technical stack, and resume/portfolio links.</li>
                  <li><strong>Ambassador & Community Profiles:</strong> Campus organization info, social media handles, and campus leadership details.</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>
                  YUNI utilizes the gathered data to deliver the high-caliber educational and career placements promised by our initiatives:
                </p>
                <ul>
                  <li>Processing applications for internships, talent accelerators, and campus ambassador roles.</li>
                  <li>Managing and administering registration, verified certificate generation, and performance records.</li>
                  <li>Maintaining communications regarding updates, course schedules, career outreach, and community events.</li>
                  <li>Enabling secure system log entries to audit and secure our network and databases inside NASTP.</li>
                  <li>Analyzing aggregated user behavior to build better UX flows, custom toolstacks, and responsive curricula.</li>
                </ul>

                <h2>4. Data Custody and Security</h2>
                <p>
                  We employ rigorous physical, organizational, and technological safeguards to shield your personal data from unauthorized access, loss, manipulation, or disclosure. All digital repositories are encrypted at rest and in transit using TLS/SSL protocols. 
                </p>
                <p>
                  Access to sensitive data (such as CNIC numbers or grade sheets) is strictly locked down using role-based access controls (RBAC) and restricted only to verified personnel managing recruitment and academic registries.
                </p>

                <h2>5. Third-Party Service Providers</h2>
                <p>
                  We do not sell, rent, or trade your personal data to commercial entities. We only share information with validated service providers under non-disclosure obligations:
                </p>
                <ul>
                  <li>Cloud storage, hosting, and computing platforms (e.g. Firebase, Vercel, Google Sheets APIs).</li>
                  <li>Partner aerospace and IT companies situated at NASTP for direct hiring matching (only after your explicit consent).</li>
                </ul>

                <h2>6. Your Rights and Preferences</h2>
                <p>
                  As a user or applicant of YUNI Pakistan, you retain complete authority over your information. You have the right to request:
                </p>
                <ul>
                  <li>Access to, rectification of, or complete deletion of your personal records.</li>
                  <li>Restricting or objecting to processing for ambassador or passive newsletter communication.</li>
                  <li>Withdrawal of consent given during form submissions.</li>
                </ul>
                <p>
                  To exercise these rights, please email us directly at <a href="mailto:legal@yunipakistan.com">legal@yunipakistan.com</a> with the subject line <em>"Privacy Rights request"</em>.
                </p>

                <h2>7. Contacting the Legal Desk</h2>
                <p>
                  If you have questions, feedback, or concerns regarding this policy, please address your queries to:
                </p>
                <div className="address-box">
                  <strong>YUNI Pakistan — Legal & Privacy Operations</strong><br />
                  National Aerospace Science & Technology Park (NASTP)<br />
                  Alpha Techno Valley, Islamabad, Pakistan<br />
                  Email: <a href="mailto:legal@yunipakistan.com">legal@yunipakistan.com</a>
                </div>
              </div>
            ) : (
              <div className="legal-text-content">
                <div className="last-updated">Last Updated: June 8, 2026</div>

                <h2>1. Agreement to Terms</h2>
                <p>
                  By accessing, browsing, registering for, or using the platforms, courses, bootcamps, portals, and physical lab facilities provided by YUNI Pakistan at NASTP, you explicitly agree to be bound by these Terms of Service. If you do not agree, you must cease all utilization of our systems immediately.
                </p>

                <h2>2. Program Participation and Code of Conduct</h2>
                <p>
                  YUNI Pakistan is dedicated to cultivating a world-class environment of integrity, technical brilliance, and respect. Participants in all training programs, workshops, and ambassador programs agree to:
                </p>
                <ul>
                  <li>Uphold complete academic honesty. Copying code, plagiarizing coursework, or submitting fake projects will result in immediate termination of certification and access without appeal.</li>
                  <li>Refrain from any activities that damage, disrupt, or gain unauthorized access to YUNI's host systems, hardware, networks, or the computational infrastructure of NASTP.</li>
                  <li>Treat fellow learners, mentors, and program directors with professional respect in both digital workspaces and onsite physical zones.</li>
                </ul>

                <h2>3. Intellectual Property (IP)</h2>
                <p>
                  All curriculum materials, video content, codebases, custom UI templates, animations, logos, graphics, and proprietary training structures displayed on our platforms are the exclusive property of YUNI Pakistan and its technical partners. 
                </p>
                <p>
                  You are granted a personal, non-transferable, revocable license to access materials solely for your own educational progress. You may not distribute, reproduce, sell, or repackage any YUNI curriculum under any circumstances.
                </p>

                <h2>4. Certificate Verification and Issuance</h2>
                <p>
                  YUNI certificates are prestigious credentials issued to verify a student's completion of our rigorous programs.
                </p>
                <ul>
                  <li>Certificates will only be issued upon meeting the passing threshold of the respective course modules, projects, and final evaluations.</li>
                  <li>YUNI reserves the right to cancel, revoke, or flag any certificate if plagiarism, credential sharing, or fraudulent behavior is detected after issuance.</li>
                  <li>Public verification pages are provided "as-is" for employers to verify student credentials securely.</li>
                </ul>

                <h2>5. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, YUNI Pakistan, its directors, employees, and NASTP partners shall not be held liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                </p>
                <p>
                  While we work to ensure 100% uptime for our coding environments and learning management portals, services are provided on an "as-available" and "as-is" basis.
                </p>

                <h2>6. Termination of Access</h2>
                <p>
                  We reserve the right, without liability, to suspend, terminate, or restrict your access to any part of our physical or digital ecosystem if we determine that you have violated these Terms of Service, committed academic theft, or engaged in unlawful activity.
                </p>

                <h2>7. Governing Law and Jurisdiction</h2>
                <p>
                  These Terms of Service, along with any disputes arising from your relationship with YUNI Pakistan, shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan, without regard to conflict of law principles. Any legal actions must be filed in the courts of Islamabad, Pakistan.
                </p>

                <h2>8. Modifications to Terms</h2>
                <p>
                  We periodically update our curriculum, protocols, and policies. YUNI reserves the right to modify these Terms of Service at any time. We will indicate revisions by modifying the "Last Updated" date at the top of this document. Continued use of our platforms indicates active consent to all revisions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="legal-footer">
          <button onClick={() => navigate('/')} className="btn-tech btn-tech-outline">
            ← Return to Home
          </button>
        </div>
      </div>

      <style>{`
        .legal-section {
          min-height: 100vh;
          background: transparent;
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
          padding-top: 8rem;
          padding-bottom: 8rem;
          position: relative;
          z-index: 1;
        }

        .legal-container {
          max-width: 52rem;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .legal-header {
          text-align: center;
        }

        .legal-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-top: -1rem;
          opacity: 0.8;
        }

        /* --- Tabs Styling --- */
        .legal-tabs-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .legal-tabs-container {
          display: flex;
          padding: 0.4rem;
          border-radius: 99px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          gap: 0.25rem;
        }

        .legal-tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.8rem 2rem;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.4s var(--transition-smooth);
        }

        .legal-tab-btn:hover {
          color: var(--text-primary);
        }

        .legal-tab-btn.active {
          background: var(--pk-green);
          color: #ffffff;
          box-shadow: 0 10px 20px var(--pk-green-glow);
        }

        /* --- Card Styling --- */
        .legal-content-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 2rem;
          border: 1px solid var(--glass-border);
        }

        .legal-content-inner {
          padding: 4rem;
        }

        .legal-text-content {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .last-updated {
          font-size: 0.85rem;
          color: var(--text-tertiary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1rem;
        }

        .legal-text-content h2 {
          color: var(--text-primary);
          font-size: 1.6rem;
          font-weight: 800;
          margin-top: 3rem;
          margin-bottom: 1.2rem;
          font-family: 'Outfit', sans-serif;
        }

        .legal-text-content h2:first-of-type {
          margin-top: 0;
        }

        .legal-text-content p {
          margin-bottom: 1.5rem;
        }

        .legal-text-content ul {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
        }

        .legal-text-content li {
          margin-bottom: 0.75rem;
        }

        .legal-text-content strong {
          color: var(--text-primary);
        }

        .legal-text-content a {
          color: var(--pk-green);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .legal-text-content a:hover {
          color: var(--pk-green-light);
          text-decoration: underline;
        }

        .address-box {
          background: rgba(12, 98, 56, 0.05);
          border: 1px solid rgba(12, 98, 56, 0.1);
          padding: 2rem;
          border-radius: 1.5rem;
          margin-top: 2rem;
          font-size: 1rem;
          line-height: 1.6;
        }

        .legal-footer {
          display: flex;
          justify-content: center;
        }

        /* --- Responsive design --- */
        @media (max-width: 768px) {
          .legal-section {
            padding-top: 6rem;
            padding-bottom: 5rem;
          }

          .legal-container {
            gap: 2rem;
          }

          .legal-content-inner {
            padding: 2rem 1.5rem;
          }

          .legal-text-content {
            font-size: 0.95rem;
          }

          .legal-text-content h2 {
            font-size: 1.35rem;
            margin-top: 2rem;
          }

          .legal-tab-btn {
            padding: 0.6rem 1.25rem;
            font-size: 0.85rem;
          }

          .address-box {
            padding: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Legal;
