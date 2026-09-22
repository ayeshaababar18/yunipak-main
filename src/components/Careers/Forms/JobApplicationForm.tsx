import React, { useState } from "react";
import { type Position, GOOGLE_SHEETS_API } from "../Careers";

interface FormData {
  fullName: string;
  cnic: string;
  dateOfBirth: string;
  gender: string;
  fatherName: string;
  phoneNumber: string;
  alternatePhone: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
  city: string;
  province: string;

  positionId: string;
  positionTitle: string;
  experience: string;
  currentSalary: string;
  expectedSalary: string;
  noticePeriod: string;
  isCurrentlyEmployed: string;

  highestDegree: string;
  university: string;
  yearOfCompletion: string;
  cgpa: string;

  technicalSkills: string;
  certifications: string;
  languagesSpoken: string;

  referenceName: string;
  referenceContact: string;
  referenceRelation: string;

  linkedinProfile: string;
  portfolioUrl: string;
  hearAboutUs: string;
  additionalInfo: string;

  declaration: boolean;
  timestamp: string;
  status: string;
}

interface Props {
  position: Position;
  onClose: () => void;
}

const JobApplicationForm: React.FC<Props> = ({ position, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    cnic: "",
    dateOfBirth: "",
    gender: "",
    fatherName: "",
    phoneNumber: "",
    alternatePhone: "",
    email: "",
    currentAddress: "",
    permanentAddress: "",
    city: "",
    province: "Punjab",
    positionId: position.id,
    positionTitle: position.title,
    experience: "",
    currentSalary: "",
    expectedSalary: "",
    noticePeriod: "",
    isCurrentlyEmployed: "",
    highestDegree: "",
    university: "",
    yearOfCompletion: "",
    cgpa: "",
    technicalSkills: "",
    certifications: "",
    languagesSpoken: "",
    referenceName: "",
    referenceContact: "",
    referenceRelation: "",
    linkedinProfile: "",
    portfolioUrl: "",
    hearAboutUs: "",
    additionalInfo: "",
    declaration: false,
    timestamp: new Date().toISOString(),
    status: "pending",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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

    try {
      const submitData = new URLSearchParams();
      // append formType for the backend to route to the correct sheet
      submitData.append('formType', 'job');
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
            message: 'Application submitted successfully for ' + position.title + '! We will contact you within 5-7 business days.'
          });

        setTimeout(() => {
          onClose();
        }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({ type: 'error', message: 'Error submitting application. Please try again or email us directly at careers@yunipakistan.com' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="form-header-premium">
        <span className="protocol-label">Job Application</span>
        <h2 className="form-title-premium">Apply for {position.title}</h2>
        <div className="form-progress-bar"></div>
      </div>



      {submitStatus && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: submitStatus.type === 'success' ? '#0f1714' : '#1a0f12', border: `1px solid ${submitStatus.type === 'success' ? '#2ecc71' : '#ff4757'}`, borderRadius: '16px', padding: '2.5rem', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: submitStatus.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 71, 87, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: submitStatus.type === 'success' ? '#2ecc71' : '#ff4757' }}>
              {submitStatus.type === 'success' ? '✓' : '⚠'}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>{submitStatus.type === 'success' ? 'Application Submitted!' : 'Action Required'}</h3>
            <p style={{ margin: 0, color: '#a0aab2', lineHeight: '1.6', fontSize: '0.95rem' }}>{submitStatus.message}</p>
            <button type="button" onClick={() => { if (submitStatus.type === 'success') { onClose(); } else { setSubmitStatus(null); } }} style={{ marginTop: '1rem', padding: '0.8rem 2.5rem', backgroundColor: submitStatus.type === 'success' ? '#2ecc71' : '#ff4757', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', width: '100%', transition: 'all 0.2s', alignSelf: 'stretch' }}>
              {submitStatus.type === 'success' ? 'Close' : 'Try Again'}
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} onInvalid={(e) => { e.preventDefault(); setSubmitStatus({ type: "error", message: "Please fill out all required fields correctly." }); }} className="application-form-premium">
        {/* Personal Information Section */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">01</span>
            <h3>Personal Profile</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>Legal Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Enter full name" />
            </div>

            <div className="form-field-premium">
              <label>National ID (CNIC) *</label>
              <input type="text" name="cnic" placeholder="XXXXX-XXXXXXX-X" value={formData.cnic} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium">
              <label>Father's Designation *</label>
              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} required placeholder="Father's name" />
            </div>

            <div className="form-field-premium">
              <label>Date of Birth *</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium">
              <label>Gender Identification *</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field-premium">
              <label>Primary Comms (Phone) *</label>
              <input type="tel" name="phoneNumber" placeholder="03XXXXXXXXX" value={formData.phoneNumber} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium">
              <label>Digital Mail (Email) *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="email@address.com" />
            </div>

            <div className="form-field-premium">
              <label>Current Location (City) *</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="e.g. Islamabad" />
            </div>
          </div>

          <div className="form-field-premium full-width" style={{ marginTop: '1.5rem' }}>
            <label>Residential Coordinates (Address) *</label>
            <textarea name="currentAddress" rows={2} value={formData.currentAddress} onChange={handleInputChange} required placeholder="Current street address..."></textarea>
          </div>
        </div>

        {/* Professional Information */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">02</span>
            <h3>Professional Status</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>Service Duration *</label>
              <select name="experience" value={formData.experience} onChange={handleInputChange} required>
                <option value="">Select Level</option>
                <option value="Fresher">Entry Level (0 Exp)</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="6-8 years">6-8 years</option>
                <option value="9+ years">Senior (9+ years)</option>
              </select>
            </div>

            <div className="form-field-premium">
              <label>Expected Compensation (PKR/mo) *</label>
              <input type="text" name="expectedSalary" placeholder="e.g. 150,000" value={formData.expectedSalary} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium">
              <label>Redeployment Window (Notice) *</label>
              <select name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} required>
                <option value="">Select Duration</option>
                <option value="Immediate">Instant Availability</option>
                <option value="15 days">15 Days</option>
                <option value="1 month">30 Days</option>
                <option value="2 months">60 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">03</span>
            <h3>Technical Stack</h3>
          </div>
          <div className="form-field-premium full-width">
            <label>Core Technologies * (comma-separated)</label>
            <textarea name="technicalSkills" rows={3} placeholder="e.g. React, Node.js, GSAP, Python, Cybersecurity..." value={formData.technicalSkills} onChange={handleInputChange} required></textarea>
          </div>

          <div className="form-grid-premium" style={{ marginTop: '1.5rem' }}>
            <div className="form-field-premium">
              <label>LinkedIn Identity</label>
              <input type="url" name="linkedinProfile" placeholder="https://linkedin.com/in/username" value={formData.linkedinProfile} onChange={handleInputChange} />
            </div>

            <div className="form-field-premium">
              <label>Portfolio / Git Link</label>
              <input type="url" name="portfolioUrl" placeholder="https://github.com/username" value={formData.portfolioUrl} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Declaration */}
        <div className="form-section-premium declaration-wrapper-premium">
          <label className="checkbox-container-premium">
            <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleInputChange} required />
            <span className="checkmark"></span>
            <p>I confirm that all submitted details are authentic. I authorize YUNI Pakistan to perform necessary background and reference checks.</p>
          </label>
        </div>


        <div className="form-actions-premium">
          <button type="button" className="cancel-btn-premium" onClick={onClose}>Cancel</button>
          <button type="submit" className="submit-btn-premium" disabled={isSubmitting}>
            <span className="btn-text">{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
            <div className="btn-glow"></div>
          </button>
        </div>
      </form>
    </>
  );
};

export default JobApplicationForm;
