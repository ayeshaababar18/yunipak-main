import React, { useState } from "react";
import { type Position, GOOGLE_SHEETS_API } from "../Careers";

interface InternshipFormData {
  // Section 1: Personal Information
  fullName: string;
  dateOfBirth: string;
  gender: string;
  city: string;
  email: string;
  phoneNumber: string;
  linkedinProfile: string;

  // Section 2: Academic Background
  university: string;
  degreeProgram: string;
  yearOfStudy: string;
  cgpa: string;

  // Section 3: Internship Preferences
  internshipTrack: string;
  preferredDuration: string;
  startDate: string;

  // Section 4: Skills & Experience
  relevantSkills: string;
  completedCourses: string;
  courseDetails: string;
  priorExperience: string;
  experienceDetails: string;

  // Section 5: Portfolio & Work Samples
  portfolioUrl: string;
  cvFileBase64: string;
  cvFileName: string;
  cvMimeType: string;
  sampleWorkBase64: string;
  sampleWorkFileName: string;
  sampleWorkMimeType: string;

  // Section 6: Availability & Logistics
  weeklyAvailability: string;
  hasOwnDevice: string;
  commuteNastp: string;

  // Section 8: References (Optional)
  referenceName: string;
  referenceRelation: string;
  referenceContact: string;

  // Section 9: Declaration
  declaration: boolean;
  timestamp: string;
  status: string;
}

interface Props {
  position: Position;
  onClose: () => void;
}

const InternshipForm: React.FC<Props> = ({ position, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<InternshipFormData>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    email: "",
    phoneNumber: "",
    linkedinProfile: "",
    university: "",
    degreeProgram: "",
    yearOfStudy: "",
    cgpa: "",
    internshipTrack: "",
    preferredDuration: "",
    startDate: "",
    relevantSkills: "",
    completedCourses: "",
    courseDetails: "",
    priorExperience: "",
    experienceDetails: "",
    portfolioUrl: "",
    cvFileBase64: "",
    cvFileName: "",
    cvMimeType: "",
    sampleWorkBase64: "",
    sampleWorkFileName: "",
    sampleWorkMimeType: "",
    weeklyAvailability: "",
    hasOwnDevice: "",
    commuteNastp: "",
    referenceName: "",
    referenceRelation: "",
    referenceContact: "",
    declaration: false,
    timestamp: new Date().toISOString(),
    status: "pending",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'cv' | 'sampleWork') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSubmitStatus({ type: 'error', message: 'File size should not exceed 5MB' });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      
      setFormData(prev => ({
        ...prev,
        [fileType === 'cv' ? 'cvFileBase64' : 'sampleWorkBase64']: base64String,
        [fileType === 'cv' ? 'cvFileName' : 'sampleWorkFileName']: file.name,
        [fileType === 'cv' ? 'cvMimeType' : 'sampleWorkMimeType']: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.internshipTrack || !formData.cvFileBase64) {
      setSubmitStatus({ type: 'error', message: 'Please fill all required fields and upload your CV (*)' });
      return;
    }

    if (!formData.declaration) {
      setSubmitStatus({ type: 'error', message: 'Please accept the declaration' });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new URLSearchParams();
      submitData.append('formType', 'internship');
      submitData.append('positionId', position.id);
      submitData.append('positionTitle', position.title);
      
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
          message: 'Your application has been received! Our hiring team reviews applications on a rolling basis. Shortlisted candidates will be contacted within 7-10 business days.'
        });

        setTimeout(() => {
          onClose();
        }, 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({ type: 'error', message: 'Error submitting application. Please try again. If uploading large files, they might exceed limits.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="form-header-premium">
        <span className="protocol-label">Internship Program</span>
        <h2 className="form-title-premium">Apply for a Yuni Pakistan Internship</h2>
        <p className="careers-subtitle-premium" style={{ fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'left', marginLeft: 0 }}>
          Gain real-world experience inside Pakistan's fastest-growing AI and edtech startup. Work on live projects, get mentored by industry professionals, and build the skills that matter most in today's job market.
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
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
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
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium">
              <label>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium">
              <label>Phone Number *</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium full-width">
              <label>LinkedIn Profile URL (optional)</label>
              <input type="url" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleInputChange} placeholder="https://linkedin.com/..." />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Background */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">02</span>
            <h3>Academic Background</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>Current Institution / University *</label>
              <input type="text" name="university" value={formData.university} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium">
              <label>Degree Program *</label>
              <input type="text" name="degreeProgram" value={formData.degreeProgram} onChange={handleInputChange} required />
            </div>

            <div className="form-field-premium">
              <label>Year of Study *</label>
              <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="Graduate">Graduate</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>

            <div className="form-field-premium">
              <label>CGPA (optional)</label>
              <input type="text" name="cgpa" value={formData.cgpa} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Section 3: Internship Preferences */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">03</span>
            <h3>Internship Preferences</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>Which internship track are you applying for? *</label>
              <select name="internshipTrack" value={formData.internshipTrack} onChange={handleInputChange} required>
                <option value="">Select Track</option>
                <option value="Digital Marketing & SEO">Digital Marketing & SEO</option>
                <option value="Content Creation & Copywriting">Content Creation & Copywriting</option>
                <option value="Social Media Management">Social Media Management</option>
                <option value="Graphic Design & Visual Content">Graphic Design & Visual Content</option>
                <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                <option value="Cybersecurity & Ethical Hacking">Cybersecurity & Ethical Hacking</option>
                <option value="Web Development">Web Development</option>
                <option value="Business Development & Partnerships">Business Development & Partnerships</option>
                <option value="Research & Data Analysis">Research & Data Analysis</option>
                <option value="Operations & Project Management">Operations & Project Management</option>
              </select>
            </div>

            <div className="form-field-premium">
              <label>Preferred duration *</label>
              <select name="preferredDuration" value={formData.preferredDuration} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
              </select>
            </div>

            <div className="form-field-premium">
              <label>When can you start? *</label>
              <select name="startDate" value={formData.startDate} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="Immediate">Immediate</option>
                <option value="Within 2 weeks">Within 2 weeks</option>
                <option value="Specific date">Specific date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Skills & Experience */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">04</span>
            <h3>Skills & Experience</h3>
          </div>
          <div className="form-field-premium full-width">
            <label>Relevant skills you possess *</label>
            <p className="form-help-text" style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>List tools, software, languages, platforms (e.g. Canva, Python, Google Ads)</p>
            <textarea name="relevantSkills" rows={2} value={formData.relevantSkills} onChange={handleInputChange} required></textarea>
          </div>

          <div className="form-grid-premium" style={{ marginTop: '1.5rem' }}>
            <div className="form-field-premium">
              <label>Have you completed related courses? *</label>
              <select name="completedCourses" value={formData.completedCourses} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            {formData.completedCourses === 'Yes' && (
              <div className="form-field-premium">
                <label>Please list them *</label>
                <input type="text" name="courseDetails" value={formData.courseDetails} onChange={handleInputChange} required={formData.completedCourses === 'Yes'} />
              </div>
            )}

            <div className="form-field-premium">
              <label>Any prior internship/work experience? *</label>
              <select name="priorExperience" value={formData.priorExperience} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          
          {formData.priorExperience === 'Yes' && (
            <div className="form-field-premium full-width" style={{ marginTop: '1.5rem' }}>
              <label>Details (Company, role, duration, key responsibilities) *</label>
              <textarea name="experienceDetails" rows={2} value={formData.experienceDetails} onChange={handleInputChange} required={formData.priorExperience === 'Yes'}></textarea>
            </div>
          )}
        </div>

        {/* Section 5: Portfolio & Work Samples */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">05</span>
            <h3>Portfolio & Work Samples</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>Personal website / portfolio link (optional)</label>
              <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInputChange} placeholder="https://..." />
            </div>

            <div className="form-field-premium">
              <label>Upload CV (PDF/Image, max 5MB) *</label>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileUpload(e, 'cv')} required />
            </div>

            <div className="form-field-premium">
              <label>Sample work upload (optional, max 5MB, or provide link above)</label>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg,.zip" onChange={(e) => handleFileUpload(e, 'sampleWork')} />
            </div>
          </div>
        </div>

        {/* Section 6: Availability & Logistics */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">06</span>
            <h3>Availability & Logistics</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>Hours per week available? *</label>
              <select name="weeklyAvailability" value={formData.weeklyAvailability} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="Part-time: 20 hrs">Part-time: 20 hrs</option>
                <option value="Full-time: 40 hrs">Full-time: 40 hrs</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div className="form-field-premium">
              <label>Own laptop/device for remote work? *</label>
              <select name="hasOwnDevice" value={formData.hasOwnDevice} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="form-field-premium">
              <label>Able to commute to NASTP Rawalpindi? *</label>
              <select name="commuteNastp" value={formData.commuteNastp} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Depends on schedule">Depends on schedule</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 8: References */}
        <div className="form-section-premium">
          <div className="section-title-wrapper">
            <span className="section-number">08</span>
            <h3>References (Optional)</h3>
          </div>
          <div className="form-grid-premium">
            <div className="form-field-premium">
              <label>Reference Name</label>
              <input type="text" name="referenceName" value={formData.referenceName} onChange={handleInputChange} />
            </div>

            <div className="form-field-premium">
              <label>Relationship to Applicant</label>
              <input type="text" name="referenceRelation" value={formData.referenceRelation} onChange={handleInputChange} />
            </div>

            <div className="form-field-premium">
              <label>Contact Email or Phone</label>
              <input type="text" name="referenceContact" value={formData.referenceContact} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        {/* Section 9: Declaration */}
        <div className="form-section-premium declaration-wrapper-premium">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>• I confirm that all information provided is accurate.</p>
            <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>• I understand this is an internship and may be unpaid or stipend-based.</p>
            <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>• I agree to maintain confidentiality regarding Yuni's internal operations and proprietary content.</p>
            <p style={{ fontSize: '0.9rem', color: '#aaa', margin: 0 }}>• I consent to Yuni Pakistan retaining my data for recruitment purposes.</p>
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
            <span className="btn-text">{isSubmitting ? 'Submitting...' : 'Submit My Application →'}</span>
            <div className="btn-glow"></div>
          </button>
        </div>
      </form>
    </>
  );
};

export default InternshipForm;
