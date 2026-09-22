import React, { useState } from "react";
import { type Position, GOOGLE_SHEETS_API } from "../Careers";

interface AmbassadorFormData {
  // Section 1: Personal Information
  fullName: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  email: string;
  phoneNumber: string;
  linkedinProfile: string;

  // Section 2: Academic & Professional Background
  university: string;
  degreeProgram: string;
  cgpa: string;
  currentRole: string;

  // Section 3: Your Connection to Yuni
  hearAboutUs: string;
  usedPlatform: string;
  platformExperience: string;

  // Section 4: Why You Want to Be an Ambassador
  motivation: string;
  changeDesired: string;
  uniqueSkills: string;

  // Section 5: Ambassador Activities
  activities: string[];
  dedicatedHours: string;
  availabilityDuration: string;

  // Section 6: Portfolio & Presence
  socialHandle: string;
  socialReach: string;
  portfolioUrl: string;

  // Section 7: Commitment & Agreement
  declaration: boolean;
  timestamp: string;
  status: string;
}

interface Props {
  position: Position;
  onClose: () => void;
}

const AmbassadorForm: React.FC<Props> = ({ position, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<AmbassadorFormData>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    email: "",
    phoneNumber: "",
    linkedinProfile: "",
    university: "",
    degreeProgram: "",
    cgpa: "",
    currentRole: "",
    hearAboutUs: "",
    usedPlatform: "",
    platformExperience: "",
    motivation: "",
    changeDesired: "",
    uniqueSkills: "",
    activities: [],
    dedicatedHours: "",
    availabilityDuration: "",
    socialHandle: "",
    socialReach: "",
    portfolioUrl: "",
    declaration: false,
    timestamp: new Date().toISOString(),
    status: "pending",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'declaration') {
        setFormData(prev => ({ ...prev, declaration: checked }));
      } else {
        // Handle activities array
        setFormData(prev => {
          if (checked) {
            return { ...prev, activities: [...prev.activities, value] };
          } else {
            return { ...prev, activities: prev.activities.filter(act => act !== value) };
          }
        });
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.university) {
      setSubmitStatus({ type: 'error', message: 'Please fill all required fields (*)' });
      return;
    }

    if (!formData.declaration) {
      setSubmitStatus({ type: 'error', message: 'Please accept the declaration' });
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
      submitData.append('formType', 'ambassador');
      submitData.append('positionId', position.id);
      submitData.append('positionTitle', position.title);
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'activities') {
          submitData.append(key, (value as string[]).join(', '));
        } else {
          submitData.append(key, String(value));
        }
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
          message: 'Thank you for applying! Our team will review your application and reach out within 5-7 business days. In the meantime, explore Yuni\'s courses and stay connected with us on LinkedIn.'
        });

        setTimeout(() => {
          onClose();
        }, 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({ type: 'error', message: 'Error submitting application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="form-header-premium">
        <span className="protocol-label">Ambassador Program</span>
        <h2 className="form-title-premium">Join the Yuni Ambassador Program</h2>
        <p className="careers-subtitle-premium" style={{ fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'left', marginLeft: 0 }}>
          Represent Pakistan's AI-powered growth ecosystem at your campus or community. As a Yuni Ambassador, you'll lead learning, inspire peers, and unlock exclusive opportunities — all while growing your own career.
        </p>
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
        {/* Section 1: Personal Information */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">01</span>
            <h3>Personal Information</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Enter full name" />
            </div>

            <div className="form-field-premium">
              <label>Date of Birth *</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-field-premium">
              <label>City / Location *</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="e.g. Lahore" />
            </div>

            <div className="form-field-premium">
              <label>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="email@address.com" />
            </div>

            <div className="form-field-premium">
              <label>Phone Number *</label>
              <input type="tel" name="phoneNumber" placeholder="03XXXXXXXXX" value={formData.phoneNumber} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium">
              <label>LinkedIn Profile URL (optional)</label>
              <input type="url" name="linkedinProfile" placeholder="https://linkedin.com/in/username" value={formData.linkedinProfile} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Section 2: Academic & Professional Background */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">02</span>
            <h3>Academic Background</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>Current Institution / University *</label>
              <input type="text" name="university" value={formData.university} onChange={handleInputChange} required placeholder="e.g. NUST" />
            </div>

            <div className="form-field-premium">
              <label>Degree Program & Year of Study *</label>
              <input type="text" name="degreeProgram" value={formData.degreeProgram} onChange={handleInputChange} required placeholder="BS CS, 3rd Year" />
            </div>

            <div className="form-field-premium">
              <label>CGPA / Academic Standing (optional)</label>
              <input type="text" name="cgpa" placeholder="e.g. 3.5" value={formData.cgpa} onChange={handleInputChange} />
            </div>

            <div className="form-field-premium">
              <label>Current Employment or Role (if any)</label>
              <input type="text" name="currentRole" placeholder="e.g. Graphic Designer Intern" value={formData.currentRole} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Section 3: Connection */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">03</span>
            <h3>Connection to Yuni</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>How did you hear about Yuni? *</label>
              <select name="hearAboutUs" value={formData.hearAboutUs} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="Social media">Social media</option>
                <option value="Friend">Friend</option>
                <option value="University">University</option>
                <option value="Event">Event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field-premium">
              <label>Have you used any Yuni platform features/courses? *</label>
              <select name="usedPlatform" value={formData.usedPlatform} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {formData.usedPlatform === 'Yes' && (
            <div className="form-field-premium full-width" style={{ marginTop: '1.5rem' }}>
              <label>Which ones, and what was your experience? *</label>
              <textarea name="platformExperience" rows={2} value={formData.platformExperience} onChange={handleInputChange} required placeholder="Details..."></textarea>
            </div>
          )}
        </div>

        {/* Section 4: Motivation */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">04</span>
            <h3>Why You Want to Be an Ambassador</h3>
          </div>
          <div className="form-field-premium full-width">
            <label>Why do you want to represent Yuni Pakistan? (150–250 words) *</label>
            <p className="form-help-text" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Tell us what excites you about Yuni's mission and why you'd be a strong voice for AI-powered learning in your community.</p>
            <textarea name="motivation" rows={4} value={formData.motivation} onChange={handleInputChange} required></textarea>
          </div>

          <div className="form-field-premium full-width" style={{ marginTop: '1.5rem' }}>
            <label>What change do you want to create at your campus/city? (100–200 words) *</label>
            <p className="form-help-text" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Describe a problem you see around you — lack of skills, limited opportunities, awareness gaps — and how you'd address it as an ambassador.</p>
            <textarea name="changeDesired" rows={4} value={formData.changeDesired} onChange={handleInputChange} required></textarea>
          </div>

          <div className="form-field-premium full-width" style={{ marginTop: '1.5rem' }}>
            <label>What unique skills or networks do you bring? (100–150 words) *</label>
            <p className="form-help-text" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Examples: public speaking, social media following, student council role, tech club leadership, content creation, event management.</p>
            <textarea name="uniqueSkills" rows={3} value={formData.uniqueSkills} onChange={handleInputChange} required></textarea>
          </div>
        </div>

        {/* Section 5: Ambassador Activities */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">05</span>
            <h3>Ambassador Activities</h3>
          </div>
          
          <div className="form-field-premium full-width">
            <label>Which activities are you willing to commit to? (Select all that apply) *</label>
            <div className="checkbox-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
              {[
                "Organizing workshops or awareness sessions",
                "Representing Yuni at campus fairs and events",
                "Creating social media content about Yuni",
                "Recruiting students for Yuni courses or internships",
                "Hosting peer learning circles or study groups",
                "Providing feedback on Yuni's platform and programs"
              ].map(activity => (
                <label key={activity} className="checkbox-container-premium" style={{ margin: 0, paddingLeft: '2rem' }}>
                  <input type="checkbox" name="activities" value={activity} checked={formData.activities.includes(activity)} onChange={handleInputChange} />
                  <span className="checkmark" style={{ width: '18px', height: '18px', top: '1px' }}></span>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{activity}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="form-grid-premium" style={{ marginTop: '1.5rem' }}>
            <div className="form-field-premium">
              <label>How many hours per week can you dedicate? *</label>
              <select name="dedicatedHours" value={formData.dedicatedHours} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="1–5 hrs">1–5 hrs</option>
                <option value="5–10 hrs">5–10 hrs</option>
                <option value="10+ hrs">10+ hrs</option>
              </select>
            </div>

            <div className="form-field-premium">
              <label>How long are you available for this role? *</label>
              <select name="availabilityDuration" value={formData.availabilityDuration} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 6: Portfolio & Presence */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">06</span>
            <h3>Portfolio & Presence</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>Instagram/TikTok/YouTube handle (optional)</label>
              <input type="text" name="socialHandle" placeholder="@username" value={formData.socialHandle} onChange={handleInputChange} />
            </div>

            <div className="form-field-premium">
              <label>Estimated social media following (optional)</label>
              <input type="text" name="socialReach" placeholder="e.g. 5,000" value={formData.socialReach} onChange={handleInputChange} />
            </div>
          </div>

          <div className="form-field-premium full-width" style={{ marginTop: '1.5rem' }}>
            <label>Link to any relevant work (optional)</label>
            <p className="form-help-text" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>Event you organized, content you created, article you wrote</p>
            <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInputChange} placeholder="https://..." />
          </div>
        </div>

        {/* Section 7: Declaration */}
        <div className="form-section-premium declaration-wrapper-premium">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>• I confirm that the information provided is accurate and truthful.</p>
            <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>• I understand that the Ambassador role is voluntary/partially incentivized and not a full-time paid employment.</p>
            <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>• I agree to uphold Yuni Pakistan's values of integrity, inclusion, and continuous growth.</p>
            <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>• I consent to Yuni using my name and submitted content for promotional purposes.</p>
          </div>

          <label className="checkbox-container-premium">
            <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleInputChange} required />
            <span className="checkmark"></span>
            <p>I agree to the terms above.</p>
          </label>
        </div>


        <div className="form-actions-premium">
          <button type="button" className="cancel-btn-premium" onClick={onClose}>Cancel</button>
          <button type="submit" className="submit-btn-premium" disabled={isSubmitting}>
            <span className="btn-text">{isSubmitting ? 'Submitting...' : 'Apply to Become an Ambassador →'}</span>
            <div className="btn-glow"></div>
          </button>
        </div>
      </form>
    </>
  );
};

export default AmbassadorForm;
