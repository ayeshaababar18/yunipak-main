/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "../AnimatedTitle";
import AnimatedBackground from "../AnimatedBackground";
import ImageWithSkeleton from "../ImageWithSkeleton";
import { trainingsData } from "../../constants/trainingsData";
import type { TrainingCourse } from "../../constants/trainingsData";

gsap.registerPlugin(ScrollTrigger);

interface EnrollmentData {
  fullName: string;
  fatherName: string;
  cnic: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phoneNumber: string;
  alternatePhone: string;
  currentAddress: string;
  city: string;
  province: string;
  highestQualification: string;
  institution: string;
  yearOfCompletion: string;
  percentage: string;
  courseId: string;
  courseTitle: string;
  coursePrice: string;
  paymentMethod: string;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  transactionId: string;
  transactionDate: string;
  transactionAmount: string;
  currentEmployment: string;
  organization: string;
  designation: string;
  hearAboutUs: string;
  referralCode: string;
  whyJoin: string;
  declaration: boolean;
  timestamp: string;
  status: string;
}

type View = "trainings" | "course-detail" | "checkout";

const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbxv3FVEPexjV4hLcAWNj6FafStyFzqzrJWzo-Zk8FJFOWkxw-mh9bxNi-ZYbwnLHyfzxg/exec';

const Trainings: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("trainings");
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [filter, setFilter] = useState<"all" | "cybersecurity" | "ai" | "web" | "digital" | "ecommerce" | "communications" | "datascience">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const studentsCountRef = useRef<HTMLSpanElement>(null);

  const [formData, setFormData] = useState<EnrollmentData>({
    fullName: "", fatherName: "", cnic: "", dateOfBirth: "", gender: "",
    email: "", phoneNumber: "", alternatePhone: "", currentAddress: "",
    city: "", province: "Punjab", highestQualification: "", institution: "",
    yearOfCompletion: "", percentage: "", courseId: "", courseTitle: "",
    coursePrice: "", paymentMethod: "bank", bankName: "N/A", bankAccountTitle: "N/A",
    bankAccountNumber: "N/A", transactionId: "", transactionDate: new Date().toISOString().split('T')[0],
    transactionAmount: "", currentEmployment: "", organization: "",
    designation: "", hearAboutUs: "", referralCode: "", whyJoin: "",
    declaration: false, timestamp: new Date().toISOString(), status: "pending",
  });

  const filteredCourses = trainingsData.filter((course) => {
    if (filter === "all") return true;
    if (filter === "cybersecurity") return course.category === "Cybersecurity";
    if (filter === "ai") return course.category === "AI" || course.category === "Data Science";
    if (filter === "web") return course.category === "Web";
    if (filter === "digital") return course.category === "Digital";
    if (filter === "ecommerce") return course.category === "E-Commerce";
    if (filter === "communications") return course.category === "Communications";
    if (filter === "datascience") return course.category === "Data Science";
    return true;
  });

  useEffect(() => {
    if (studentsCountRef.current) {
      gsap.to(studentsCountRef.current, {
        innerText: 950,
        duration: 2.5,
        snap: { innerText: 5 },
        ease: "power2.out",
      });
    }

    // Grid reveal animation
    const cards = document.querySelectorAll('.course-card-hub');
    if (cards.length > 0) {
      gsap.fromTo(cards,
        {
          y: 60,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".course-grid",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [filter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await fetch(GOOGLE_SHEETS_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitStatus({ type: 'success', message: 'Enrollment data transmitted successfully! Our tactical team will contact you soon.' });
    } catch {
      setSubmitStatus({ type: 'error', message: 'Data sync failed. Please check your connection and retry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewCourse = (course: TrainingCourse) => {
    window.scrollTo(0, 0);
    setSelectedCourse(course);
    setCurrentView("course-detail");
  };

  const handleEnroll = (course: TrainingCourse) => {
    window.scrollTo(0, 0);
    setSelectedCourse(course);
    setFormData(prev => ({
      ...prev,
      courseId: course.id,
      courseTitle: course.title,
      coursePrice: course.price || "0",
      transactionAmount: course.price || "",
    }));
    setCurrentView("checkout");
    setSubmitStatus(null);
  };

  const handleBackToHub = () => {
    window.scrollTo(0, 0);
    setCurrentView("trainings");
    setSelectedCourse(null);
    setSubmitStatus(null);
  };

  const renderTrainingsView = () => (
    <div className="trainings-view">
      <AnimatedBackground />
      {/* Background Light Orbs */}

      <div className="trainings-container">
        <div className="title-wrapper">
          <AnimatedTitle>Professional Trainings</AnimatedTitle>
          <p className="subtitle-tech">Master the technologies of the future with our industry-leading certification paths.</p>
        </div>

        <div className="filters-container">
          {["all", "cybersecurity", "ai", "web", "digital", "ecommerce", "communications"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`filter-btn-premium ${filter === cat ? "active" : ""}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('cybersecurity', 'Cyber Security')}
            </button>
          ))}
        </div>

        <div className="course-grid">
          {filteredCourses.length === 0 ? (
            <div className="no-results-premium">
              <div className="no-results-icon">🔍</div>
              <p>No sequences found in this sector. Try another protocol.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="course-card-premium"
              >
                <div className="card-inner-tech">
                  <div className="course-card-image">
                    <ImageWithSkeleton src={course.imageUrl} alt={course.title} />
                    <div className="image-overlay-tech"></div>
                    {course.isCertification && <span className="cert-badge-premium">Official Cert.</span>}
                  </div>
                  <div className="course-card-content">
                    <div className="category-label">{course.category}</div>
                    <h3 className="course-title-tech">{course.title}</h3>
                    <p className="instructor-tech">By {course.instructor}</p>
                    <div className="card-meta-tech">
                      <span>⏱ {course.duration.split('•')[0]}</span>
                      <span>📊 {course.level}</span>
                    </div>
                    <div className="card-footer-premium">
                      <span className="price-tag-tech">{course.price}</span>
                      <button onClick={() => handleViewCourse(course)} className="view-btn-tech">
                        Access <span className="arrow-tech">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderCourseDetailView = () => (
    <div className="detail-view">
      <div className="gradient-orb" style={{ top: '20%', left: '10%' }}></div>
      <div className="detail-container">
        <button onClick={handleBackToHub} className="back-btn-tech">
          <span className="icon">←</span> Back to Protocol Hub
        </button>
        <div className="detail-panel-premium">
          <div className="detail-left-premium">
            <div className="detail-image-wrapper">
              <ImageWithSkeleton src={selectedCourse?.imageUrl} alt={selectedCourse?.title} className="detail-image-tech" />
              <div className="image-glow-tech"></div>
            </div>
            <div className="detail-stats-premium">
              <div className="stat-card">
                <span className="stat-value">{selectedCourse?.duration}</span>
                <span className="stat-label">Timeline</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{selectedCourse?.level}</span>
                <span className="stat-label">Expertise</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{selectedCourse?.price}</span>
                <span className="stat-label">Investment</span>
              </div>
            </div>
          </div>
          <div className="detail-right-premium">
            <span className="detail-category-tag">{selectedCourse?.category}</span>
            <h2 className="detail-title-tech">{selectedCourse?.title}</h2>
            <p className="instructor-line-tech">Senior Architect: <span>{selectedCourse?.instructor}</span></p>
            <div className="description-box-tech">
              <p>{selectedCourse?.description}</p>
            </div>

            <div className="outcomes-tech">
              <h3>Strategic Outcomes</h3>
              <div className="outcomes-grid">
                {[
                  "Dual Certifications (Training + Internship)",
                  "Hands-on architectural implementation",
                  "Expert-led deep dive sessions",
                  "Exclusive industry ecosystem access",
                  "Lifetime resource repository"
                ].map((item, idx) => (
                  <div key={idx} className="outcome-item">
                    <span className="check">✦</span> {item}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => selectedCourse && handleEnroll(selectedCourse)} className="enroll-btn-premium">
              Initialize Enrollment <span className="btn-glow-tech"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCheckoutView = () => (
    <div className="checkout-view">
      <div className="checkout-container-premium">
        <button onClick={handleBackToHub} className="cancel-btn-tech">Aborted Session</button>
        <h2 className="checkout-title-tech">Secure <span className="text-gradient">Transaction</span> Gateway</h2>

        {submitStatus && (
          <div className={`status-banner-tech ${submitStatus.type}`}>
            <span className="icon">{submitStatus.type === 'success' ? '✓' : '⚠'}</span>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="checkout-form-premium">
          <div className="form-grid-premium">
            <div className="form-left-col">
              <section className="form-section-tech">
                <h3 className="section-header-tech">1. Payment Protocol</h3>
                <div className="payment-nodes">
                  <div 
                    className={`payment-node-card ${formData.paymentMethod === 'bank' ? 'active-node' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank' }))}
                  >
                    <h4>Bank Alfalah</h4>
                    <div className="node-details">
                      <p><span>Title:</span> YUNI (SMC-PRIVATE) LIMITED</p>
                      <p><span>Account No:</span> 0140-1010831162</p>
                      <p><span>Branch:</span> Rawalpindi</p>
                    </div>
                  </div>
                  <div 
                    className={`payment-node-card ${formData.paymentMethod === 'nayapay' ? 'active-node' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'nayapay' }))}
                  >
                    <h4>NayaPay</h4>
                    <div className="node-details">
                      <p><span>Title:</span> YUNI (SMC-PRIVATE) LIMITED</p>
                      <p><span>Account No:</span> 03185861446</p>
                      <p><span>Type:</span> Wallet / Mobile</p>
                    </div>
                  </div>
                </div>

                <div className="input-group-tech">
                  <div className="field-tech"><label>Network</label><select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} required><option value="bank">Bank Alfalah</option><option value="nayapay">NayaPay</option></select></div>
                  <div className="field-tech"><label>Hash / TXN ID</label><input type="text" name="transactionId" placeholder="Enter RefID" value={formData.transactionId} onChange={handleInputChange} required /></div>
                  <div className="field-tech"><label>Timestamp</label><input type="date" name="transactionDate" value={formData.transactionDate} onChange={handleInputChange} required /></div>
                  <div className="field-tech"><label>Total Credits</label><input type="text" name="transactionAmount" placeholder={selectedCourse?.price} value={formData.transactionAmount} onChange={handleInputChange} required /></div>
                </div>
              </section>
            </div>

            <div className="form-right-col">
              <section className="form-section-tech">
                <h3 className="section-header-tech">2. Identity Sync</h3>
                <div className="input-group-tech">
                  <div className="field-tech full"><label>Full Legal Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required /></div>
                  <div className="field-tech"><label>CNIC (Verified)</label><input type="text" name="cnic" placeholder="XXXXX-XXXXXXX-X" value={formData.cnic} onChange={handleInputChange} required /></div>
                  <div className="field-tech"><label>Birth Date</label><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required /></div>
                  <div className="field-tech"><label>Email Address</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
                  <div className="field-tech"><label>Comms (WhatsApp)</label><input type="tel" name="phoneNumber" placeholder="03XXXXXXXXX" value={formData.phoneNumber} onChange={handleInputChange} required /></div>
                </div>
              </section>

              <section className="form-section-tech">
                <h3 className="section-header-tech">3. Validation</h3>
                <div className="declaration-tech">
                  <label className="checkbox-tech">
                    <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleInputChange} required />
                    <span className="checkmark-tech"></span>
                    I confirm that the provided data is accurate and the transaction is complete.
                  </label>
                </div>
                <div className="form-actions-tech">
                  <button type="submit" className="submit-btn-premium" disabled={isSubmitting}>
                    {isSubmitting ? 'Syncing...' : 'Confirm Enrollment'}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="courses-app-premium">
      {currentView === "trainings" && renderTrainingsView()}
      {currentView === "course-detail" && renderCourseDetailView()}
      {currentView === "checkout" && renderCheckoutView()}

      <style>{`
        .courses-app-premium { 
          background: transparent; 
          min-height: 100vh; 
          font-family: 'Inter', sans-serif; 
          color: var(--text-primary); 
          position: relative; 
          z-index: 1; 
          overflow-x: hidden;
        }

        /* --- Header Section --- */
        .trainings-view { padding: 8rem 2rem 8rem; max-width: 1400px; margin: 0 auto; position: relative; }
        .title-wrapper { margin-bottom: 5rem; text-align: center; }
        .subtitle-tech { color: var(--text-secondary); font-size: 1.1rem; margin-top: 1.5rem; max-width: 600px; margin-left: auto; margin-right: auto; opacity: 0.8; text-align: center; }

        /* --- Filters --- */
        .filters-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-bottom: 5rem; }
        .filter-btn-premium { 
          background: rgba(255, 255, 255, 0.03); 
          border: 1px solid var(--border-light); 
          color: var(--text-secondary); 
          padding: 0.8rem 2rem; 
          border-radius: 12px; 
          font-weight: 600; 
          font-size: 0.9rem; 
          cursor: pointer; 
          transition: all 0.4s var(--transition-smooth); 
          backdrop-filter: blur(10px);
        }
        .filter-btn-premium:hover { border-color: var(--pk-green); color: var(--pk-green); background: rgba(0, 143, 76, 0.05); transform: translateY(-3px); }
        .filter-btn-premium.active { 
          background: var(--pk-green); 
          border-color: var(--pk-green); 
          color: var(--text-primary); 
          box-shadow: 0 10px 25px var(--pk-green-glow); 
        }

        /* --- Grid & Cards --- */
        .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 3rem; }
        
        .course-card-premium { 
          background: var(--glass-bg); 
          backdrop-filter: blur(20px); 
          border-radius: 2.5rem; 
          border: 1px solid var(--glass-border); 
          overflow: hidden; 
          transition: all 0.6s var(--transition-smooth); 
          position: relative;
        }

        .card-inner-tech {
          position: relative;
          z-index: 2;
          background: transparent;
        }

        .course-card-premium:hover { 
          transform: translateY(-15px) scale(1.02); 
          border-color: var(--pk-green); 
          box-shadow: 0 40px 80px var(--glass-shadow), 0 0 20px var(--pk-green-glow-subtle); 
        }

        .course-card-image { position: relative; height: 260px; overflow: hidden; }
        .course-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--transition-smooth); }
        .course-card-premium:hover .course-card-image img { transform: scale(1.1); }
        .image-overlay-tech { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8)); }

        .cert-badge-premium { 
          position: absolute; top: 1.5rem; right: 1.5rem; background: var(--pk-green); color: #fff; 
          padding: 0.5rem 1.2rem; border-radius: 10px; font-size: 0.75rem; font-weight: 800; 
          text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          animation: badgePulse 2s infinite alternate;
        }
        @keyframes badgePulse { from { transform: scale(1); box-shadow: 0 5px 15px rgba(0,0,0,0.3); } to { transform: scale(1.05); box-shadow: 0 8px 25px var(--pk-green-glow); } }

        .course-card-content { padding: 2.5rem; }
        .category-label { color: var(--pk-green); font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem; }
        .course-title-tech { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.75rem; line-height: 1.2; }
        .instructor-tech { color: var(--text-tertiary); font-size: 0.95rem; margin-bottom: 1.5rem; font-weight: 500; }

        .card-meta-tech { display: flex; gap: 1.5rem; color: var(--text-secondary); font-size: 0.9rem; font-weight: 600; margin-bottom: 2rem; }

        .card-footer-premium { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1.5rem; }
        .price-tag-tech { font-size: 1.5rem; font-weight: 900; background: linear-gradient(135deg, var(--pk-green-light), var(--pk-green)); -webkit-background-clip: text; background-clip: text; color: transparent; }

        .view-btn-tech { 
          background: transparent; border: none; color: var(--text-primary); font-weight: 700; cursor: pointer; 
          display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease; 
        }
        .view-btn-tech:hover { color: var(--pk-green); }
        .view-btn-tech:hover .arrow-tech { transform: translateX(8px); }
        .arrow-tech { transition: transform 0.3s ease; display: inline-block; }

        /* --- Detail View --- */
        .detail-view { padding: 8rem 2rem 8rem; }
        .back-btn-tech { 
          background: transparent; border: none; color: var(--text-secondary); font-weight: 600; 
          cursor: pointer; margin-bottom: 3rem; display: flex; align-items: center; gap: 0.8rem;
          transition: all 0.3s ease;
        }
        .back-btn-tech:hover { color: var(--pk-green); transform: translateX(-5px); }

        .detail-panel-premium { 
          display: grid; grid-template-columns: 1fr 1.2fr; gap: 5rem; 
          background: var(--glass-bg); backdrop-filter: blur(30px); border-radius: 3rem; 
          padding: 4rem; border: 1px solid var(--glass-border); 
        }

        .detail-image-wrapper { position: relative; border-radius: 2rem; overflow: hidden; height: 450px; }
        .detail-image-tech { width: 100%; height: 100%; object-fit: cover; }
        .image-glow-tech { position: absolute; inset: 0; box-shadow: inset 0 0 100px rgba(0,0,0,0.5); }

        .detail-stats-premium { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
        .stat-card { background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 1.5rem; text-align: center; border: 1px solid var(--border-light); }
        .stat-value { display: block; font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.3rem; }
        .stat-label { font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.1em; }

        .detail-category-tag { color: var(--pk-green); font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.9rem; }
        .detail-title-tech { font-size: 3.5rem; font-weight: 900; margin: 1rem 0 2rem; line-height: 1.1; }
        .instructor-line-tech { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 2rem; }
        .instructor-line-tech span { color: var(--pk-green); font-weight: 700; }

        .description-box-tech { background: rgba(0, 143, 76, 0.03); border-left: 4px solid var(--pk-green); padding: 2rem; border-radius: 0 1.5rem 1.5rem 0; margin-bottom: 3rem; }
        .description-box-tech p { font-size: 1.1rem; line-height: 1.8; color: var(--text-secondary); }

        .outcomes-tech h3 { font-size: 1.5rem; margin-bottom: 1.5rem; }
        .outcomes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 4rem; }
        .outcome-item { color: var(--text-secondary); font-size: 1rem; display: flex; align-items: center; gap: 1rem; }
        .outcome-item .check { color: var(--pk-green); font-weight: 900; }

        .enroll-btn-premium { 
          width: 100%; background: var(--pk-green); color: #fff; padding: 1.5rem; border-radius: 1.5rem; 
          font-size: 1.2rem; font-weight: 800; border: none; cursor: pointer; transition: all 0.4s var(--transition-smooth);
          position: relative; overflow: hidden;
        }
        .enroll-btn-premium:hover { transform: translateY(-5px); box-shadow: 0 20px 40px var(--pk-green-glow); background: var(--pk-green-light); }

        /* --- Checkout Styles --- */
        .checkout-view { padding: 8rem 2rem 8rem; max-width: 1200px; margin: 0 auto; }
        .checkout-title-tech { font-size: 3rem; font-weight: 900; text-align: center; margin-bottom: 4rem; text-transform: uppercase; letter-spacing: -0.02em; }
        .text-gradient { background: linear-gradient(135deg, var(--pk-green), var(--cyber-blue)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        
        .checkout-form-premium { display: flex; flex-direction: column; gap: 2rem; }
        .form-grid-premium { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
        @media (max-width: 900px) { .form-grid-premium { grid-template-columns: 1fr; } }
        
        .form-section-tech { background: var(--glass-bg); backdrop-filter: blur(20px); border-radius: 2rem; padding: 2.5rem; border: 1px solid var(--glass-border); margin-bottom: 2rem; }
        .section-header-tech { font-size: 1.2rem; font-weight: 800; color: var(--pk-green); margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem; }
        
        .payment-nodes { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; }
        .payment-node-card { background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 1.5rem; padding: 1.5rem; transition: all 0.3s ease; cursor: pointer; }
        .payment-node-card:hover { border-color: rgba(0, 230, 118, 0.5); background: rgba(255, 255, 255, 0.05); }
        .payment-node-card.active-node { border-color: var(--pk-green); background: rgba(0, 230, 118, 0.05); box-shadow: 0 10px 30px rgba(0, 230, 118, 0.1); }
        .payment-node-card h4 { color: var(--pk-green); margin-bottom: 1rem; font-weight: 800; }
        .node-details p { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        .node-details p span { color: var(--text-tertiary); font-weight: 600; }
        
        .input-group-tech { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .field-tech { display: flex; flex-direction: column; gap: 0.6rem; }
        .field-tech.full { grid-column: span 2; }
        @media (max-width: 600px) { .field-tech { grid-column: span 2 !important; } }
        
        .field-tech label { font-size: 0.8rem; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; }
        .field-tech input, .field-tech select { 
          background: var(--bg-elevated); border: 1px solid var(--border-light); 
          border-radius: 0.8rem; padding: 1rem; color: var(--text-primary); font-family: inherit;
          transition: all 0.3s ease;
        }
        .field-tech select {
          color-scheme: dark;
        }
        .field-tech select option {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }
        .field-tech input:focus, .field-tech select:focus { outline: none; border-color: var(--pk-green); background: var(--bg-elevated); }
        
        .submit-btn-premium { 
          width: 100%; background: var(--pk-green); color: #fff; padding: 1.5rem; border-radius: 1.2rem; 
          font-size: 1.1rem; font-weight: 800; border: none; cursor: pointer; transition: all 0.4s ease;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .submit-btn-premium:hover:not(:disabled) { background: var(--pk-green-light); transform: translateY(-3px); box-shadow: 0 15px 30px var(--pk-green-glow); }
        .submit-btn-premium:disabled { opacity: 0.6; cursor: not-allowed; }

        /* --- Responsive --- */
        @media (max-width: 1024px) {
          .detail-panel-premium { grid-template-columns: 1fr; gap: 3rem; padding: 2.5rem; }
          .detail-title-tech { font-size: 2.5rem; }
          .course-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .trainings-view,
          .detail-view,
          .checkout-view {
            padding: 6rem 1rem 5rem;
          }

          .filters-container {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
          }

          .filter-btn-premium {
            flex: 0 0 auto;
            padding: 0.75rem 1.1rem;
          }

          .course-grid {
            gap: 1.5rem;
          }

          .course-card-content {
            padding: 1.5rem;
          }

          .course-card-image {
            height: 200px;
          }

          .course-title-tech,
          .checkout-title-tech {
            font-size: 1.8rem;
          }

          .detail-title-tech {
            font-size: 2rem;
          }

          .detail-image-wrapper {
            height: 260px;
          }

          .detail-stats-premium,
          .outcomes-grid,
          .input-group-tech {
            grid-template-columns: 1fr;
          }

          .card-footer-premium {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .form-section-tech {
            padding: 1.5rem;
          }

          .field-tech.full {
            grid-column: span 1;
          }

          .field-tech input,
          .field-tech select,
          .submit-btn-premium,
          .enroll-btn-premium {
            border-radius: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Trainings;
