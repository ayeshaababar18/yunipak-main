/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "../AnimatedTitle";
import AnimatedBackground from "../AnimatedBackground";
import { summerCampCourses } from "../../constants/summerCampData";
import type { SummerCampCourse, SubCategory } from "../../constants/summerCampData";
import ImageWithSkeleton from "../ImageWithSkeleton";
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
  courseTitle: string; // Will store "Course Title - Subcategory"
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

const getDiscountedPrice = (priceStr: string) => {
  const numeric = parseInt(priceStr.replace(/[^\d]/g, ''), 10);
  if (isNaN(numeric)) return { original: priceStr, discounted: priceStr, numericVal: priceStr };
  return {
    original: priceStr,
    discounted: priceStr,
    numericVal: String(numeric)
  };
};

const SummerCamp: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("trainings");
  const [selectedCourse, setSelectedCourse] = useState<SummerCampCourse | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const studentsCountRef = useRef<HTMLSpanElement>(null);

  const [formData, setFormData] = useState<EnrollmentData>({
    fullName: "", fatherName: "", cnic: "", dateOfBirth: "", gender: "",
    email: "", phoneNumber: "", alternatePhone: "", currentAddress: "",
    city: "", province: "", highestQualification: "", institution: "",
    yearOfCompletion: "", percentage: "", courseId: "", courseTitle: "",
    coursePrice: "", paymentMethod: "bank", bankName: "N/A", bankAccountTitle: "N/A",
    bankAccountNumber: "N/A", transactionId: "", transactionDate: new Date().toISOString().split('T')[0],
    transactionAmount: "", currentEmployment: "", organization: "",
    designation: "", hearAboutUs: "", referralCode: "", whyJoin: "",
    declaration: false, timestamp: new Date().toISOString(), status: "pending",
  });

  const filteredCourses = summerCampCourses.filter((course) => {
    if (filter === "all") return true;
    return course.category.toLowerCase().replace(/\s+/g, '-') === filter;
  });

  useEffect(() => {
    if (studentsCountRef.current) {
      gsap.to(studentsCountRef.current, {
        innerText: 1250,
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

    const subCards = document.querySelectorAll('.module-card-premium, .subcategory-card-premium');
    if (subCards.length > 0) {
      gsap.fromTo(subCards,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".modular-curriculum-container, .subcategories-grid-container",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [filter, currentView]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
      
      // If paymentMethod changes, automatically fill correct bank details
      if (name === 'paymentMethod') {
        if (value === 'bank') {
          updated.bankName = 'Bank Alfalah';
          updated.bankAccountTitle = 'YUNI (SMC-PRIVATE) LIMITED';
          updated.bankAccountNumber = '0140-1010831162';
        } else if (value === 'nayapay') {
          updated.bankName = 'NayaPay Wallet';
          updated.bankAccountTitle = 'YUNI (SMC-PRIVATE) LIMITED';
          updated.bankAccountNumber = '03185861446';
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.cnic || !formData.email || !formData.phoneNumber) {
      setSubmitStatus({ type: 'error', message: 'Please fill all required fields (*)' });
      return;
    }

    if (!formData.declaration) {
      setSubmitStatus({ type: 'error', message: 'Please accept the declaration' });
      return;
    }

    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    if (!cnicRegex.test(formData.cnic)) {
      setSubmitStatus({ type: 'error', message: 'Please enter valid CNIC format (XXXXX-XXXXXXX-X)' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({ type: 'error', message: 'Please enter valid email address' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const submitData = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, String(value));
      });

      await fetch(GOOGLE_SHEETS_API, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: submitData,
      });

      setSubmitStatus({
        type: 'success',
        message: 'Your request for course registration has been successfully submitted. Our admissions counselor will contact you via WhatsApp within 24 hours to confirm your details and payment.'
      });
      
      // Reset form data on success
      setFormData({
        fullName: "", fatherName: "", cnic: "", dateOfBirth: "", gender: "",
        email: "", phoneNumber: "", alternatePhone: "", currentAddress: "",
        city: "", province: "", highestQualification: "", institution: "",
        yearOfCompletion: "", percentage: "", courseId: "", courseTitle: "",
        coursePrice: "", paymentMethod: "bank", bankName: "N/A", bankAccountTitle: "N/A",
        bankAccountNumber: "N/A", transactionId: "", transactionDate: new Date().toISOString().split('T')[0],
        transactionAmount: "", currentEmployment: "", organization: "",
        designation: "", hearAboutUs: "", referralCode: "", whyJoin: "",
        declaration: false, timestamp: new Date().toISOString(), status: "pending",
      });
    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Enrollment submission failed. Please check your internet connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewCourse = (course: SummerCampCourse) => {
    window.scrollTo(0, 0);
    setSelectedCourse(course);
    setSelectedSubcategory(course.subcategories[0]); // Default to first subcategory/module
    setCurrentView("course-detail");
  };

  const handleEnroll = (course: SummerCampCourse, subcat: SubCategory) => {
    window.scrollTo(0, 0);
    setSelectedCourse(course);
    setSelectedSubcategory(subcat);
    
    const { discounted, numericVal } = getDiscountedPrice(course.price);
    
    setFormData(prev => ({
      ...prev,
      courseId: course.id,
      courseTitle: `${course.title} - ${subcat.title}`,
      coursePrice: discounted,
      transactionAmount: numericVal, // Default to price numeric value
      paymentMethod: 'bank',
      bankName: 'Bank Alfalah',
      bankAccountTitle: 'YUNI (SMC-PRIVATE) LIMITED',
      bankAccountNumber: '0140-1010831162',
    }));
    setCurrentView("checkout");
    setSubmitStatus(null);
  };

  const handleBackToHub = () => {
    window.scrollTo(0, 0);
    setCurrentView("trainings");
    setSelectedCourse(null);
    setSelectedSubcategory(null);
    setSubmitStatus(null);
  };

  const renderTrainingsView = () => (
    <div className="trainings-view">
      <AnimatedBackground />

      <div className="trainings-container">
        <div className="title-wrapper">
          <AnimatedTitle>YUNI Summer Camp 2026</AnimatedTitle>
          <p className="subtitle-tech">Empower your summer. Learn future-proof skills from industry professionals with hands-on projects.</p>
          <div className="camp-badge-container">
            <span className="camp-tag"><i className="fa-solid fa-calendar-days"></i> Starts June 2026</span>
            <span className="camp-tag"><i className="fa-solid fa-graduation-cap"></i> Ages 12 - 25+</span>
            <span className="camp-tag"><i className="fa-solid fa-award"></i> Project Certificates</span>
          </div>
        </div>

        <div className="filters-container">
          {[
            { id: "all", label: "All Programs" },
            { id: "ai", label: "AI" },
            { id: "cybersecurity", label: "Cybersecurity" },
            { id: "english", label: "English Language" },
            { id: "digital-marketing", label: "Digital Marketing" },
            { id: "web-development", label: "Web Dev" },
            { id: "art-&-design", label: "Art & Design" },
            { id: "soft-skills", label: "Soft Skills" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`filter-btn-premium ${filter === cat.id ? "active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="course-grid">
          {filteredCourses.length === 0 ? (
            <div className="no-results-premium">
              <div className="no-results-icon">🔍</div>
              <p>No programs found. Select another category path.</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="course-card-premium course-card-hub"
              >
                <div className="card-inner-tech">
                  <div className="course-card-image">
                    <ImageWithSkeleton src={course.imageUrl} alt={course.title} />
                    <div className="image-overlay-tech"></div>
                    <span className="duration-badge"><i className="fa-solid fa-clock"></i> {course.duration}</span>
                  </div>
                  <div className="course-card-content">
                    <div className="card-header-meta">
                      <span className="category-label"><i className={`fa-solid ${course.icon}`}></i> {course.category}</span>
                      <span className="level-badge">{course.level}</span>
                    </div>
                    <h3 className="course-title-tech">{course.title}</h3>
                    <p className="course-desc-brief">{course.description}</p>
                    
                    <div className="subcategory-preview-list">
                      <span className="preview-title">Includes 3 specialized focus options:</span>
                      <div className="preview-badges">
                        {course.subcategories.map((sub, i) => (
                          <span key={i} className="preview-badge">{sub.title.split(':')[0]}</span>
                        ))}
                      </div>
                    </div>

                    <div className="card-footer-premium">
                      <div className="price-container">
                        {(() => {
                          const { discounted } = getDiscountedPrice(course.price);
                          return (
                            <span className="price-tag-tech">
                              {discounted}
                            </span>
                          );
                        })()}
                        <span className="price-sub-label">{course.priceLabel}</span>
                      </div>
                      <button onClick={() => handleViewCourse(course)} className="view-btn-tech">
                        View Details <span className="arrow-tech">→</span>
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

  const renderCourseDetailView = () => {
    if (!selectedCourse) return null;

    return (
      <div className="detail-view">
        <div className="detail-container">
          <button onClick={handleBackToHub} className="back-btn-tech">
            <span className="icon">←</span> Back to Camp Catalog
          </button>
          
          <div className="detail-hero-panel">
            <div className="detail-hero-info">
              <span className="detail-category-tag"><i className={`fa-solid ${selectedCourse.icon}`}></i> {selectedCourse.category}</span>
              <h2 className="detail-title-tech">{selectedCourse.title}</h2>
              <p className="detail-description-main">{selectedCourse.description}</p>
              
              <div className="detail-meta-horizontal">
                <div className="meta-item-tech">
                  <span className="meta-icon"><i className="fa-solid fa-calendar"></i></span>
                  <div className="meta-text">
                    <span className="meta-val">{selectedCourse.duration}</span>
                    <span className="meta-lbl">Duration</span>
                  </div>
                </div>
                <div className="meta-item-tech">
                  <span className="meta-icon"><i className="fa-solid fa-graduation-cap"></i></span>
                  <div className="meta-text">
                    <span className="meta-val">{selectedCourse.level}</span>
                    <span className="meta-lbl">Skill Level</span>
                  </div>
                </div>
                <div className="meta-item-tech">
                  <span className="meta-icon"><i className="fa-solid fa-chalkboard-user"></i></span>
                  <div className="meta-text">
                    <span className="meta-val">{selectedCourse.sessions}</span>
                    <span className="meta-lbl">Schedule</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="detail-hero-image-wrapper">
              <ImageWithSkeleton src={selectedCourse.imageUrl} alt={selectedCourse.title} className="detail-hero-img" />
              <div className="detail-hero-img-glow"></div>
            </div>
          </div>

          {/* Conditional Layout: Soft Skills Modular Course */}
          {selectedCourse.isModular ? (
            <div className="modular-curriculum-container">
              <h3 className="section-title-premium"><i className="fa-solid fa-layer-group"></i> Program Structure & Modules</h3>
              <p className="section-subtitle-premium">This 8-week comprehensive course consists of 3 consecutive modules. Select a module to enroll.</p>
              
              <div className="modules-vertical-list">
                {selectedCourse.subcategories.map((sub, idx) => (
                  <div key={idx} className="module-card-premium">
                    <div className="module-header-premium">
                      <div className="module-title-wrap">
                        <span className="module-number">0{idx + 1}</span>
                        <h4 className="module-title-text">{sub.title}</h4>
                      </div>
                      <div className="module-price-badge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem', height: 'auto' }}>
                        {(() => {
                          const { discounted } = getDiscountedPrice(selectedCourse.price);
                          return (
                            <span style={{ fontWeight: 'bold' }}>{discounted}</span>
                          );
                        })()}
                      </div>
                    </div>
                    
                    <div className="module-body-premium">
                      <div className="module-col">
                        <h5><i className="fa-solid fa-book-open"></i> Key Concepts & Syllabus</h5>
                        <ul className="module-topics-list">
                          {sub.topics.map((t, i) => (
                            <li key={i}><span className="bullet">✦</span> {t}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="module-col">
                        <h5><i className="fa-solid fa-trophy"></i> Practical Deliverable / Milestone</h5>
                        <ul className="module-skills-list">
                          {sub.skills.map((s, i) => (
                            <li key={i}><span className="bullet">✓</span> {s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="module-actions-premium">
                      <button onClick={() => handleEnroll(selectedCourse, sub)} className="module-enroll-btn">
                        Enroll Now <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Subcategory Cards Grid for standard courses */
            <div className="subcategories-grid-container">
              <h3 className="section-title-premium"><i className="fa-solid fa-magnifying-glass-chart"></i> Select Your Specialization Track</h3>
              <p className="section-subtitle-premium">Choose one of the specialized 6-week tracks below to start. Each track is focused on hands-on practical learning.</p>
              
              <div className="subcategories-grid-premium">
                {selectedCourse.subcategories.map((sub, idx) => (
                  <div key={idx} className="subcategory-card-premium">
                    <div className="sub-card-header">
                      <h4 className="sub-title-text">{sub.title}</h4>
                      <span className="sub-price-badge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem', height: 'auto' }}>
                        {(() => {
                          const { discounted } = getDiscountedPrice(selectedCourse.price);
                          return (
                            <span>{discounted}</span>
                          );
                        })()}
                      </span>
                    </div>
                    
                    <div className="sub-card-body">
                      <div className="sub-topics-section">
                        <h5>Syllabus Overview</h5>
                        <ul>
                          {sub.topics.map((topic, i) => (
                            <li key={i}><span className="bullet">✦</span> {topic}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="sub-skills-section">
                        <h5>Skills You Will Build</h5>
                        <div className="skills-tags-wrap">
                          {sub.skills.map((skill, i) => (
                            <span key={i} className="skill-tag-item"><i className="fa-solid fa-check"></i> {skill}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button onClick={() => handleEnroll(selectedCourse, sub)} className="sub-enroll-btn">
                      Enroll in This Track <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCheckoutView = () => {
    if (!selectedCourse || !selectedSubcategory) return null;

    return (
      <div className="checkout-view">
        <div className="checkout-container-premium">
          <button onClick={() => setCurrentView("course-detail")} className="cancel-btn-tech">
            <i className="fa-solid fa-arrow-left"></i> Back to Detail View
          </button>
          
          <h2 className="checkout-title-tech">Admission <span className="text-gradient">Portal</span></h2>
          <p className="checkout-subtitle-tech">YUNI Summer Camp 2026 Registration Desk</p>

          <div className="selected-track-summary-box">
            <div className="summary-left">
              <span className="summary-course-lbl">Selected Course & Specialization:</span>
              <h4 className="summary-course-title">{selectedCourse.title}</h4>
              <p className="summary-subcat-title"><i className="fa-solid fa-square-check"></i> {selectedSubcategory.title}</p>
            </div>
            <div className="summary-right">
              <span className="summary-price-lbl">Tuition Fee:</span>
              {(() => {
                const { discounted } = getDiscountedPrice(selectedCourse.price);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span className="summary-price-val" style={{ color: 'var(--pk-green-light)', fontWeight: 900 }}>
                      {discounted}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>

          {submitStatus && (
            <div className="registration-modal-overlay">
              <div className={`registration-modal-content ${submitStatus.type === 'error' ? 'error' : ''}`}>
                <div className="registration-modal-icon-wrapper">
                  <div className="registration-modal-icon-glow"></div>
                  <div className="registration-modal-icon">
                    {submitStatus.type === 'success' ? '✓' : '⚠'}
                  </div>
                </div>
                <h3 className="registration-modal-title">
                  {submitStatus.type === 'success' ? 'Registration Request Sent!' : 'Action Required'}
                </h3>
                <p className="registration-modal-message">
                  {submitStatus.message}
                </p>
                <button 
                  type="button" 
                  className="registration-modal-btn" 
                  onClick={() => { 
                    if (submitStatus.type === 'success') { 
                      handleBackToHub(); 
                    } else { 
                      setSubmitStatus(null); 
                    } 
                  }}
                >
                  {submitStatus.type === 'success' ? 'Return to Trainings' : 'Try Again'}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="checkout-form-premium">
            <div className="form-grid-premium">
              <div className="form-left-col">
                <section className="form-section-tech">
                  <h3 className="section-header-tech"><i className="fa-solid fa-credit-card"></i> 1. Payment Methods</h3>
                  <p className="payment-instructions-text">Please transfer the fee to one of the official accounts below and enter payment details.</p>
                  
                  <div className="payment-nodes">
                    <div 
                      className={`payment-node-card ${formData.paymentMethod === 'bank' ? 'active-node' : ''}`}
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        paymentMethod: 'bank',
                        bankName: 'Bank Alfalah',
                        bankAccountTitle: 'YUNI (SMC-PRIVATE) LIMITED',
                        bankAccountNumber: '0140-1010831162'
                      }))}
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
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        paymentMethod: 'nayapay',
                        bankName: 'NayaPay Wallet',
                        bankAccountTitle: 'YUNI (SMC-PRIVATE) LIMITED',
                        bankAccountNumber: '03185861446'
                      }))}
                    >
                      <h4>NayaPay Wallet</h4>
                      <div className="node-details">
                        <p><span>Title:</span> YUNI (SMC-PRIVATE) LIMITED</p>
                        <p><span>Account No:</span> 03185861446</p>
                        <p><span>Type:</span> Business Wallet</p>
                      </div>
                    </div>
                  </div>

                  <div className="input-group-tech">
                    <div className="field-tech">
                      <label>Payment Mode</label>
                      <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} required>
                        <option value="bank">Bank Alfalah</option>
                        <option value="nayapay">NayaPay</option>
                      </select>
                    </div>
                    <div className="field-tech">
                      <label>Transaction ID / Ref ID</label>
                      <input type="text" name="transactionId" placeholder="TRX123456789" value={formData.transactionId} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech">
                      <label>Transfer Date</label>
                      <input type="date" name="transactionDate" value={formData.transactionDate} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech">
                      <label>Transferred Amount (PKR)</label>
                      <input type="text" name="transactionAmount" value={formData.transactionAmount} onChange={handleInputChange} required />
                    </div>
                  </div>
                </section>

                <section className="form-section-tech">
                  <h3 className="section-header-tech"><i className="fa-solid fa-graduation-cap"></i> 3. Academic & Professional Info</h3>
                  <p className="payment-instructions-text">Provide your educational background and current status.</p>
                  
                  <div className="input-group-tech">
                    <div className="field-tech">
                      <label>Highest Qualification</label>
                      <input type="text" name="highestQualification" placeholder="e.g., Bachelor's, Matric, Intermediate" value={formData.highestQualification} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech">
                      <label>Institution Name</label>
                      <input type="text" name="institution" placeholder="School, College or University" value={formData.institution} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech">
                      <label>Year of Completion</label>
                      <input type="text" name="yearOfCompletion" placeholder="e.g., 2024, 2026" value={formData.yearOfCompletion} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech">
                      <label>Percentage / CGPA</label>
                      <input type="text" name="percentage" placeholder="e.g., 85%, 3.7 CGPA" value={formData.percentage} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech full">
                      <label>Employment Status</label>
                      <select name="currentEmployment" value={formData.currentEmployment} onChange={handleInputChange} required>
                        <option value="">Select Employment Status</option>
                        <option value="Student">Student</option>
                        <option value="Employed">Employed Full-time</option>
                        <option value="Freelancer">Freelancer</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="field-tech">
                      <label>Organization / Employer</label>
                      <input type="text" name="organization" placeholder="e.g., Company, School Name" value={formData.organization} onChange={handleInputChange} />
                    </div>
                    <div className="field-tech">
                      <label>Designation / Job Title</label>
                      <input type="text" name="designation" placeholder="e.g., Software Engineer, Student" value={formData.designation} onChange={handleInputChange} />
                    </div>
                  </div>
                </section>
              </div>

              <div className="form-right-col">
                <section className="form-section-tech">
                  <h3 className="section-header-tech"><i className="fa-solid fa-user-check"></i> 2. Student Information</h3>
                  <p className="payment-instructions-text">Provide your contact info. Class details will be sent here.</p>
                  
                  <div className="input-group-tech">
                    <div className="field-tech full">
                      <label>Student Full Name</label>
                      <input type="text" name="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech full">
                      <label>Father's Name</label>
                      <input type="text" name="fatherName" placeholder="Enter father's name" value={formData.fatherName} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech">
                      <label>CNIC / B-Form Number</label>
                      <input type="text" name="cnic" placeholder="e.g., 37405-1234567-9" value={formData.cnic} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech">
                      <label>Date of Birth</label>
                      <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech full">
                      <label>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="field-tech">
                      <label>Email Address</label>
                      <input type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech">
                      <label>WhatsApp Number</label>
                      <input type="tel" name="phoneNumber" placeholder="e.g., 03123456789" value={formData.phoneNumber} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech full">
                      <label>Alternate Phone Number</label>
                      <input type="tel" name="alternatePhone" placeholder="e.g., 03123456789 (Optional)" value={formData.alternatePhone} onChange={handleInputChange} />
                    </div>
                    <div className="field-tech full">
                      <label>Current Address</label>
                      <input type="text" name="currentAddress" placeholder="Enter street address, house no, etc." value={formData.currentAddress} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech">
                      <label>City of Residence</label>
                      <input type="text" name="city" placeholder="e.g., Islamabad, Rawalpindi" value={formData.city} onChange={handleInputChange} required />
                    </div>
                    <div className="field-tech">
                      <label>Province</label>
                      <select name="province" value={formData.province} onChange={handleInputChange} required>
                        <option value="">Select Province</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                        <option value="Azad Kashmir">Azad Kashmir</option>
                        <option value="Islamabad Capital Territory">Islamabad</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="form-section-tech">
                  <h3 className="section-header-tech"><i className="fa-solid fa-circle-info"></i> 4. Additional Details</h3>
                  
                  <div className="input-group-tech">
                    <div className="field-tech">
                      <label>How did you hear about us?</label>
                      <select name="hearAboutUs" value={formData.hearAboutUs} onChange={handleInputChange} required>
                        <option value="">Select Option</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Friends/Family">Friends / Family</option>
                        <option value="Search Engine">Search Engine</option>
                        <option value="Flyer/Poster">Flyer / Poster</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="field-tech">
                      <label>Referral / Coupon Code</label>
                      <input type="text" name="referralCode" placeholder="Optional" value={formData.referralCode} onChange={handleInputChange} />
                    </div>
                    <div className="field-tech full">
                      <label>Why do you want to join this course?</label>
                      <textarea name="whyJoin" rows={3} placeholder="Tell us briefly about your goals..." value={formData.whyJoin} onChange={handleInputChange} required style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '0.8rem',
                        padding: '1rem',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        transition: 'all 0.3s ease',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                        outline: 'none'
                      }} />
                    </div>
                  </div>
                </section>

                <section className="form-section-tech">
                  <h3 className="section-header-tech"><i className="fa-solid fa-shield-halved"></i> 5. Complete Registration</h3>
                  <div className="declaration-tech">
                    <label className="checkbox-tech">
                      <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleInputChange} required />
                      <span className="checkmark-tech"></span>
                      I verify that I have transferred the course fee and the details entered above are accurate.
                    </label>
                  </div>
                  <div className="form-actions-tech">
                    <button type="submit" className="submit-btn-premium" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={`courses-app-premium ${submitStatus ? 'modal-open' : ''}`}>
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

        .courses-app-premium.modal-open {
          z-index: 1001;
        }

        /* --- Header Section --- */
        .trainings-view { padding: 8rem 2rem 8rem; max-width: 1400px; margin: 0 auto; position: relative; }
        .title-wrapper { margin-bottom: 5rem; text-align: center; }
        .subtitle-tech { color: var(--text-secondary); font-size: 1.15rem; margin-top: 1.5rem; max-width: 700px; margin-left: auto; margin-right: auto; opacity: 0.85; text-align: center; line-height: 1.6; }
        
        .camp-badge-container {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .camp-tag {
          background: rgba(0, 143, 76, 0.1);
          border: 1px solid rgba(0, 143, 76, 0.3);
          color: var(--pk-green-light);
          padding: 0.6rem 1.2rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

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
          display: flex;
          flex-direction: column;
        }

        .card-inner-tech {
          position: relative;
          z-index: 2;
          background: transparent;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .course-card-premium:hover { 
          transform: translateY(-15px) scale(1.02); 
          border-color: var(--pk-green); 
          box-shadow: 0 40px 80px var(--glass-shadow), 0 0 20px var(--pk-green-glow-subtle); 
        }

        .course-card-image { position: relative; height: 240px; overflow: hidden; }
        .course-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--transition-smooth); }
        .course-card-premium:hover .course-card-image img { transform: scale(1.1); }
        .image-overlay-tech { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85)); }

        .duration-badge {
          position: absolute;
          bottom: 1.2rem;
          left: 1.5rem;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
          color: #fff;
          padding: 0.4rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .course-card-content { padding: 2.2rem; display: flex; flex-direction: column; flex-grow: 1; }
        .card-header-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .category-label { color: var(--pk-green-light); font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; }
        .level-badge { background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); font-size: 0.75rem; padding: 0.3rem 0.8rem; border-radius: 6px; font-weight: 600; }
        
        .course-title-tech { font-size: 1.65rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.8rem; line-height: 1.25; }
        .course-desc-brief { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.8rem; opacity: 0.85; }

        .subcategory-preview-list {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          padding: 1.2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          margin-top: auto;
        }
        .preview-title { display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 0.8rem; }
        .preview-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .preview-badge {
          background: rgba(255,255,255,0.04);
          color: var(--text-primary);
          font-size: 0.75rem;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card-footer-premium { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 1.5rem; margin-top: auto; }
        .price-container { display: flex; flex-direction: column; }
        .price-tag-tech { font-size: 1.6rem; font-weight: 900; color: var(--pk-green-light); line-height: 1; }
        .price-sub-label { font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.2rem; font-weight: 600; }

        .view-btn-tech { 
          background: transparent; border: none; color: var(--text-primary); font-weight: 700; cursor: pointer; 
          display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease; 
        }
        .view-btn-tech:hover { color: var(--pk-green-light); }
        .view-btn-tech:hover .arrow-tech { transform: translateX(8px); }
        .arrow-tech { transition: transform 0.3s ease; display: inline-block; }

        /* --- Detail View --- */
        .detail-view { padding: 8rem 2rem 8rem; max-width: 1300px; margin: 0 auto; }
        .back-btn-tech { 
          background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); color: var(--text-secondary); font-weight: 600; 
          cursor: pointer; margin-bottom: 3rem; display: flex; align-items: center; gap: 0.8rem;
          padding: 0.8rem 1.6rem; border-radius: 12px; transition: all 0.3s ease;
        }
        .back-btn-tech:hover { color: var(--pk-green-light); border-color: var(--pk-green); transform: translateX(-5px); background: rgba(0, 143, 76, 0.05); }

        .detail-hero-panel {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          background: var(--glass-bg);
          backdrop-filter: blur(30px);
          border-radius: 3rem;
          padding: 4rem;
          border: 1px solid var(--glass-border);
          margin-bottom: 4rem;
          align-items: center;
        }

        .detail-hero-info { display: flex; flex-direction: column; }
        .detail-category-tag { color: var(--pk-green-light); font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.9rem; margin-bottom: 1.5rem; }
        .detail-title-tech { font-size: 3.2rem; font-weight: 900; margin-bottom: 1.5rem; line-height: 1.15; color: var(--text-primary); }
        .detail-description-main { font-size: 1.15rem; line-height: 1.75; color: var(--text-secondary); margin-bottom: 3rem; opacity: 0.9; }

        .detail-meta-horizontal { display: flex; gap: 2.5rem; flex-wrap: wrap; }
        .meta-item-tech { display: flex; align-items: center; gap: 1rem; }
        .meta-icon {
          width: 50px;
          height: 50px;
          background: rgba(0, 143, 76, 0.08);
          border: 1px solid rgba(0, 143, 76, 0.2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--pk-green-light);
          font-size: 1.2rem;
        }
        .meta-text { display: flex; flex-direction: column; }
        .meta-val { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); }
        .meta-lbl { font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase; font-weight: 600; }

        .detail-hero-image-wrapper { position: relative; border-radius: 2.2rem; overflow: hidden; height: 380px; }
        .detail-hero-img { width: 100%; height: 100%; object-fit: cover; }
        .detail-hero-img-glow { position: absolute; inset: 0; box-shadow: inset 0 0 60px rgba(0,0,0,0.4); }

        .section-title-premium { font-size: 2rem; font-weight: 900; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.8rem; }
        .section-subtitle-premium { color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 3rem; opacity: 0.8; }

        /* --- Subcategories standard view --- */
        .subcategories-grid-premium {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2.5rem;
        }

        .subcategory-card-premium {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 2.2rem;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          transition: all 0.4s var(--transition-smooth);
        }
        .subcategory-card-premium:hover {
          border-color: var(--pk-green);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px var(--glass-shadow);
        }

        .sub-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
          gap: 1rem;
        }
        .sub-title-text { font-size: 1.35rem; font-weight: 800; color: var(--text-primary); line-height: 1.3; }
        .sub-price-badge {
          background: var(--pk-green);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 800;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          white-space: nowrap;
          box-shadow: 0 4px 10px var(--pk-green-glow-subtle);
        }

        .sub-card-body { display: flex; flex-direction: column; gap: 2rem; flex-grow: 1; }
        
        .sub-topics-section h5, .sub-skills-section h5 {
          font-size: 0.85rem; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.05em;
        }
        .sub-topics-section ul { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
        .sub-topics-section ul li { font-size: 0.95rem; color: var(--text-secondary); display: flex; gap: 0.6rem; align-items: flex-start; }
        .sub-topics-section .bullet { color: var(--pk-green-light); font-weight: bold; }

        .skills-tags-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .skill-tag-item {
          background: rgba(0, 143, 76, 0.05);
          border: 1px solid rgba(0, 143, 76, 0.15);
          color: var(--text-secondary);
          font-size: 0.82rem;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .skill-tag-item i { color: var(--pk-green-light); font-size: 0.75rem; }

        .sub-enroll-btn {
          width: 100%;
          background: transparent;
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          padding: 1.2rem;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
        }
        .subcategory-card-premium:hover .sub-enroll-btn {
          background: var(--pk-green);
          border-color: var(--pk-green);
          box-shadow: 0 10px 20px var(--pk-green-glow-subtle);
        }
        .sub-enroll-btn:hover { transform: translateY(-2px); }

        /* --- Modular Course view (Soft Skills) --- */
        .modules-vertical-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .module-card-premium {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 2.5rem;
          padding: 3rem;
          transition: all 0.4s ease;
        }
        .module-card-premium:hover { border-color: var(--pk-green); }
        
        .module-header-premium {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
        }
        .module-title-wrap { display: flex; align-items: center; gap: 1.5rem; }
        .module-number {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--pk-green-light);
          background: rgba(0, 143, 76, 0.1);
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
        }
        .module-title-text { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); }
        .module-price-badge {
          background: rgba(0, 143, 76, 0.1);
          border: 1px solid rgba(0, 143, 76, 0.3);
          color: var(--pk-green-light);
          padding: 0.5rem 1.2rem;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.95rem;
        }

        .module-body-premium {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        .module-col h5 { font-size: 0.9rem; font-weight: 800; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; }
        .module-topics-list, .module-skills-list { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; }
        .module-topics-list li, .module-skills-list li { font-size: 1rem; color: var(--text-secondary); line-height: 1.6; display: flex; gap: 0.8rem; align-items: flex-start; }
        .module-topics-list .bullet { color: var(--pk-green-light); }
        .module-skills-list .bullet { color: var(--pk-green-light, #d4af37); }

        .module-actions-premium {
          margin-top: 2.5rem;
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--border-light);
          padding-top: 2rem;
        }
        .module-enroll-btn {
          background: var(--pk-green);
          color: #fff;
          border: none;
          padding: 1.1rem 2.5rem;
          border-radius: 16px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          box-shadow: 0 10px 20px var(--pk-green-glow-subtle);
        }
        .module-enroll-btn:hover { background: var(--pk-green-light); transform: translateY(-2px); box-shadow: 0 15px 30px var(--pk-green-glow); }

        /* --- Checkout View --- */
        .checkout-view { padding: 8rem 2rem 8rem; max-width: 1200px; margin: 0 auto; }
        .cancel-btn-tech {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cancel-btn-tech:hover { color: var(--text-primary); border-color: var(--text-secondary); background: rgba(255,255,255,0.05); }

        .checkout-title-tech { font-size: 2.8rem; font-weight: 900; text-align: center; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: -0.02em; }
        .checkout-subtitle-tech { color: var(--text-secondary); text-align: center; font-size: 1.05rem; margin-bottom: 3.5rem; opacity: 0.75; font-weight: 500; }
        .text-gradient { background: linear-gradient(135deg, var(--pk-green-light), var(--pk-green)); -webkit-background-clip: text; background-clip: text; color: transparent; }

        .selected-track-summary-box {
          background: rgba(0, 143, 76, 0.05);
          border: 1px solid rgba(0, 143, 76, 0.2);
          border-radius: 2rem;
          padding: 2rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4rem;
          gap: 2rem;
        }
        .summary-left { display: flex; flex-direction: column; }
        .summary-course-lbl, .summary-price-lbl { font-size: 0.8rem; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .summary-course-title { font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.3rem; }
        .summary-subcat-title { font-size: 1.05rem; color: var(--pk-green-light); font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
        .summary-right { display: flex; flex-direction: column; align-items: flex-end; }
        .summary-price-val { font-size: 2rem; font-weight: 900; color: var(--pk-green-light); }

        .checkout-form-premium { display: flex; flex-direction: column; gap: 2rem; }
        .form-grid-premium { display: grid; grid-template-columns: 1.1fr 1fr; gap: 3.5rem; }
        
        .form-section-tech { background: var(--glass-bg); backdrop-filter: blur(20px); border-radius: 2.2rem; padding: 2.8rem; border: 1px solid var(--glass-border); margin-bottom: 2rem; }
        .section-header-tech { font-size: 1.15rem; font-weight: 800; color: var(--pk-green-light); margin-bottom: 1.8rem; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid var(--border-light); padding-bottom: 0.8rem; display: flex; align-items: center; gap: 0.6rem; }
        .payment-instructions-text { font-size: 0.9rem; color: var(--text-secondary); opacity: 0.8; margin-bottom: 2rem; line-height: 1.5; }

        .payment-nodes { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2.5rem; }
        .payment-node-card { background: rgba(255,255,255,0.02); border: 1px solid var(--border-light); border-radius: 1.5rem; padding: 1.5rem; transition: all 0.3s ease; cursor: pointer; }
        .payment-node-card:hover { border-color: rgba(12, 98, 56, 0.4); background: rgba(255, 255, 255, 0.04); }
        .payment-node-card.active-node { border-color: var(--pk-green); background: rgba(0, 143, 76, 0.05); box-shadow: 0 10px 30px rgba(0, 143, 76, 0.08); }
        .payment-node-card h4 { color: var(--pk-green-light); margin-bottom: 0.8rem; font-weight: 800; font-size: 1.1rem; }
        .node-details p { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.4rem; display: flex; justify-content: space-between; }
        .node-details p span { color: var(--text-tertiary); font-weight: 600; }
        
        .input-group-tech { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .field-tech { display: flex; flex-direction: column; gap: 0.6rem; }
        .field-tech.full { grid-column: span 2; }
        
        .field-tech label { font-size: 0.78rem; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.03em; }
        .field-tech input, .field-tech select { 
          background: var(--bg-elevated); border: 1px solid var(--border-light); 
          border-radius: 0.8rem; padding: 1rem; color: var(--text-primary); font-family: inherit;
          transition: all 0.3s ease; font-size: 0.95rem;
        }
        .field-tech select { color-scheme: dark; }
        .field-tech select option { background: var(--bg-elevated); color: var(--text-primary); }
        .field-tech input:focus, .field-tech select:focus { outline: none; border-color: var(--pk-green); background: var(--bg-elevated); }
        .field-tech input::placeholder { color: var(--text-tertiary); opacity: 0.6; }

        .declaration-tech { margin-bottom: 2rem; }
        .checkbox-tech { display: flex; gap: 0.8rem; cursor: pointer; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; align-items: flex-start; }
        .checkbox-tech input { display: none; }
        .checkmark-tech {
          width: 18px;
          height: 18px;
          border: 1px solid var(--border-light);
          border-radius: 4px;
          display: inline-block;
          position: relative;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.2s ease;
        }
        .checkbox-tech input:checked + .checkmark-tech {
          background: var(--pk-green);
          border-color: var(--pk-green);
        }
        .checkbox-tech input:checked + .checkmark-tech::after {
          content: '✓';
          position: absolute;
          top: -2px;
          left: 4px;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 900;
        }

        .submit-btn-premium { 
          width: 100%; background: var(--pk-green); color: #fff; padding: 1.4rem; border-radius: 1.2rem; 
          font-size: 1.1rem; font-weight: 800; border: none; cursor: pointer; transition: all 0.4s ease;
          text-transform: uppercase; letter-spacing: 0.08em;
          box-shadow: 0 8px 20px var(--pk-green-glow-subtle);
        }
        .submit-btn-premium:hover:not(:disabled) { background: var(--pk-green-light); transform: translateY(-3px); box-shadow: 0 15px 30px var(--pk-green-glow); }
        .submit-btn-premium:disabled { opacity: 0.6; cursor: not-allowed; }

        .status-banner-tech {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1.2rem;
          padding: 1.5rem 2rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 2.5rem;
          font-size: 1rem;
          line-height: 1.6;
        }
        .status-banner-tech.success {
          background: rgba(0, 143, 76, 0.08);
          border: 1px solid rgba(0, 143, 76, 0.3);
          color: var(--pk-green-light);
        }
        .status-banner-tech.error {
          background: rgba(244, 67, 54, 0.08);
          border: 1px solid rgba(244, 67, 54, 0.3);
          color: #ff5252;
        }
        .status-banner-tech .icon { font-size: 1.3rem; font-weight: 900; }

        /* --- Responsive Design --- */
        @media (max-width: 1100px) {
          .detail-hero-panel { grid-template-columns: 1fr; gap: 3rem; padding: 3rem; }
          .detail-hero-image-wrapper { height: 320px; }
          .form-grid-premium { grid-template-columns: 1fr; gap: 2rem; }
          .selected-track-summary-box { flex-direction: column; align-items: flex-start; padding: 2rem; gap: 1.5rem; }
          .summary-right { align-items: flex-start; }
        }

        @media (max-width: 768px) {
          .trainings-view, .detail-view, .checkout-view { padding: 6rem 1.2rem 5rem; }
          .title-wrapper { margin-bottom: 3.5rem; }
          .detail-title-tech { font-size: 2.2rem; }
          .detail-description-main { font-size: 1.05rem; margin-bottom: 2rem; }
          .detail-meta-horizontal { gap: 1.5rem; }
          .section-title-premium { font-size: 1.6rem; }
          .subcategories-grid-premium { grid-template-columns: 1fr; }
          .module-card-premium { padding: 2rem; }
          .module-title-text { font-size: 1.25rem; }
          .module-body-premium { grid-template-columns: 1fr; gap: 2rem; }
          .checkout-title-tech { font-size: 2rem; }
          .filters-container {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
          }
          .filter-btn-premium { flex: 0 0 auto; padding: 0.75rem 1.2rem; font-size: 0.85rem; }
          .course-grid { grid-template-columns: 1fr; gap: 2rem; }
          .payment-nodes { grid-template-columns: 1fr; }

          /* Checkout form mobile fixes */
          .input-group-tech { grid-template-columns: 1fr; gap: 1.2rem; }
          .field-tech.full { grid-column: span 1; }
          .form-section-tech { padding: 1.8rem 1.4rem; border-radius: 1.5rem; }
          .section-header-tech { font-size: 1rem; margin-bottom: 1.2rem; }
          .selected-track-summary-box { padding: 1.5rem; border-radius: 1.2rem; }
          .summary-course-title { font-size: 1.25rem; }
          .summary-price-val { font-size: 1.5rem; }
          .checkout-subtitle-tech { font-size: 0.92rem; margin-bottom: 2.5rem; }
          .cancel-btn-tech { margin-bottom: 1.5rem; }
          .module-header-premium { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .module-actions-premium { justify-content: stretch; }
          .module-enroll-btn { width: 100%; justify-content: center; }

          /* Modal mobile fixes */
          .registration-modal-overlay { padding: 24px 16px; }
          .registration-modal-content { padding: 2rem 1.5rem; border-radius: 18px; gap: 1.2rem; }
          .registration-modal-icon { width: 70px; height: 70px; font-size: 2.2rem; }
          .registration-modal-icon-glow { width: 80px; height: 80px; }
          .registration-modal-title { font-size: 1.4rem; }
          .registration-modal-message { font-size: 0.88rem; }
          .registration-modal-btn { padding: 0.9rem 2rem; font-size: 0.95rem; border-radius: 12px; }
        }

        @media (max-width: 480px) {
          .trainings-view, .detail-view, .checkout-view { padding: 5rem 0.8rem 4rem; }
          .checkout-title-tech { font-size: 1.5rem; letter-spacing: -0.01em; }
          .checkout-subtitle-tech { font-size: 0.85rem; margin-bottom: 2rem; }
          .form-section-tech { padding: 1.2rem 1rem; border-radius: 1.2rem; margin-bottom: 1.2rem; }
          .section-header-tech { font-size: 0.88rem; padding-bottom: 0.6rem; margin-bottom: 1rem; gap: 0.4rem; }
          .payment-instructions-text { font-size: 0.82rem; margin-bottom: 1.2rem; }
          .payment-node-card { padding: 1rem; border-radius: 1rem; }
          .payment-node-card h4 { font-size: 0.95rem; margin-bottom: 0.5rem; }
          .node-details p { font-size: 0.78rem; }
          .field-tech label { font-size: 0.72rem; }
          .field-tech input, .field-tech select { padding: 0.8rem; font-size: 0.88rem; border-radius: 0.6rem; }
          .selected-track-summary-box { padding: 1.2rem; gap: 1rem; border-radius: 1rem; margin-bottom: 2.5rem; }
          .summary-course-lbl, .summary-price-lbl { font-size: 0.7rem; }
          .summary-course-title { font-size: 1.1rem; }
          .summary-subcat-title { font-size: 0.9rem; }
          .summary-price-val { font-size: 1.3rem; }
          .checkbox-tech { font-size: 0.8rem; gap: 0.6rem; }
          .submit-btn-premium { padding: 1.1rem; font-size: 0.95rem; border-radius: 1rem; }
          .cancel-btn-tech { font-size: 0.78rem; padding: 0.5rem 1rem; }
          .detail-hero-panel { padding: 2rem 1.2rem; border-radius: 1.5rem; gap: 2rem; margin-bottom: 2.5rem; }
          .detail-title-tech { font-size: 1.7rem; }
          .detail-description-main { font-size: 0.92rem; margin-bottom: 1.5rem; }
          .detail-hero-image-wrapper { height: 220px; border-radius: 1.2rem; }
          .detail-meta-horizontal { gap: 1rem; }
          .meta-icon { width: 40px; height: 40px; font-size: 1rem; border-radius: 10px; }
          .meta-val { font-size: 0.9rem; }
          .section-title-premium { font-size: 1.3rem; }
          .section-subtitle-premium { font-size: 0.9rem; margin-bottom: 2rem; }
          .subcategory-card-premium { padding: 1.5rem; border-radius: 1.5rem; }
          .sub-title-text { font-size: 1.1rem; }
          .module-card-premium { padding: 1.5rem; border-radius: 1.5rem; }
          .module-number { width: 40px; height: 40px; font-size: 1.3rem; border-radius: 10px; }
          .module-title-text { font-size: 1.1rem; }
          .course-card-premium { border-radius: 1.5rem; }
          .course-card-content { padding: 1.5rem; }
          .course-title-tech { font-size: 1.35rem; }

          /* Modal small screen */
          .registration-modal-overlay { padding: 24px 12px; }
          .registration-modal-content { padding: 1.5rem 1.2rem; border-radius: 16px; gap: 1rem; max-width: 100%; }
          .registration-modal-icon { width: 60px; height: 60px; font-size: 1.8rem; }
          .registration-modal-icon-glow { width: 70px; height: 70px; }
          .registration-modal-title { font-size: 1.2rem; }
          .registration-modal-message { font-size: 0.82rem; line-height: 1.5; }
          .registration-modal-btn { padding: 0.8rem 1.5rem; font-size: 0.88rem; }
        }

        /* --- Premium Registration Modal --- */
        .registration-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 999999;
          padding: 40px 20px;
          backdrop-filter: blur(8px);
          animation: fadeInModal 0.4s ease forwards;
          overflow-y: auto;
        }
        
        .registration-modal-content {
          background: linear-gradient(135deg, #0d1310 0%, #050706 100%);
          border: 1px solid rgba(12, 98, 56, 0.25);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(12, 98, 56, 0.05);
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.8rem;
          position: relative;
          overflow: hidden;
          animation: scaleInModal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          margin: auto;
        }
        
        .registration-modal-content.error {
          background: linear-gradient(135deg, #1a0f12 0%, #0a0507 100%);
          border-color: rgba(255, 71, 87, 0.25);
          box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255, 71, 87, 0.05);
        }
        
        .registration-modal-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        
        .registration-modal-icon-glow {
          position: absolute;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(12, 98, 56, 0.2) 0%, transparent 70%);
          animation: pulseGlow 2s infinite ease-in-out;
        }
        
        .registration-modal-content.error .registration-modal-icon-glow {
          background: radial-gradient(circle, rgba(255, 71, 87, 0.2) 0%, transparent 70%);
        }
        
        .registration-modal-icon {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(12, 98, 56, 0.06);
          border: 1px solid rgba(12, 98, 56, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.8rem;
          color: var(--pk-green-light);
          z-index: 2;
          box-shadow: inset 0 0 20px rgba(12, 98, 56, 0.1);
        }
        
        .registration-modal-content.error .registration-modal-icon {
          background: rgba(255, 71, 87, 0.06);
          border-color: rgba(255, 71, 87, 0.3);
          color: #ff4757;
          box-shadow: inset 0 0 20px rgba(255, 71, 87, 0.1);
        }
        
        .registration-modal-title {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #fff;
        }
        
        .registration-modal-message {
          margin: 0;
          color: #a0aab2;
          line-height: 1.7;
          font-size: 0.98rem;
        }
        
        .registration-modal-btn {
          margin-top: 1rem;
          padding: 1.1rem 2.5rem;
          background: var(--pk-green);
          color: #fff;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 700;
          font-size: 1.05rem;
          width: 100%;
          transition: all 0.3s ease;
          align-self: stretch;
          box-shadow: 0 10px 20px rgba(0, 143, 76, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .registration-modal-btn:hover {
          background: var(--pk-green-light);
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(12, 98, 56, 0.35);
        }
        
        .registration-modal-content.error .registration-modal-btn {
          background: #ff4757;
          box-shadow: 0 10px 20px rgba(255, 71, 87, 0.2);
        }
        
        .registration-modal-content.error .registration-modal-btn:hover {
          background: #ff6b81;
          box-shadow: 0 15px 30px rgba(255, 71, 87, 0.35);
        }
        
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleInModal {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulseGlow {
          0%, 100% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SummerCamp;