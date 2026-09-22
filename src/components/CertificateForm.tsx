import React, { useState } from 'react';
import { Download, Loader2, CheckCircle2, AlertCircle, Layers } from 'lucide-react';

const WORKSHOPS = [
  { id: 'ai', name: 'Artificial Intelligence', template: '/certificates/Artificial Intelligence.png' },
  { id: 'cyber', name: 'Cyber Security', template: '/certificates/Cyber Security.png' },
  { id: 'languages', name: 'Languages', template: '/certificates/Languages.png' },
  { id: 'marketing', name: 'Softskills and Digital Marketing', template: '/certificates/Softskills and Digital Marketing.png' },
  { id: 'web', name: 'Web Development', template: '/certificates/Web Development.png' },
];

const CertificateForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    refNo: '',
    phone: '',
    workshops: [WORKSHOPS[0].id],
    declaration: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    setError(null);
    setSuccess(false);
  };

  const handleWorkshopChange = (index: number, value: string) => {
    const newWorkshops = [...formData.workshops];
    // Prevent duplicate selections
    if (newWorkshops.includes(value) && newWorkshops.indexOf(value) !== index) {
      setError('You have already selected this workshop.');
      return;
    }
    newWorkshops[index] = value;
    setFormData(prev => ({ ...prev, workshops: newWorkshops }));
    setSuccess(false);
  };

  const addWorkshop = () => {
    if (formData.workshops.length < 3) {
      // Find the first workshop that hasn't been selected yet
      const availableWorkshop = WORKSHOPS.find(w => !formData.workshops.includes(w.id));
      if (availableWorkshop) {
        setFormData(prev => ({
          ...prev,
          workshops: [...prev.workshops, availableWorkshop.id]
        }));
      }
    }
  };

  const removeWorkshop = (index: number) => {
    if (formData.workshops.length > 1) {
      const newWorkshops = formData.workshops.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, workshops: newWorkshops }));
    }
  };

  const generateCertificate = async (studentName: string, refNo: string, workshopName: string, templatePath: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = templatePath;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = '#1a365d';
        ctx.textAlign = 'left';
        
        // Student Name (Left Aligned - Nudged further left)
        ctx.font = 'bold 140px "Segoe UI", Arial, sans-serif';
        ctx.fillText(studentName.toUpperCase(), 250, 1200);

        // Reference Number (Bottom Left)
        ctx.fillStyle = '#a0aec0';
        ctx.font = '30px "Segoe UI", Arial, sans-serif';
        ctx.fillText(`Certificate ID: ${refNo}`, 200, canvas.height - 150);

        const link = document.createElement('a');
        link.download = `Certificate_${studentName.replace(/\s+/g, '_')}_${workshopName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Cleanup to ensure multiple downloads work properly
        canvas.remove();
        resolve();
      };

      img.onerror = () => reject(new Error('Failed to load certificate template'));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration) {
      setError('Please confirm the declaration to proceed.');
      return;
    }

    // Immediate global lockout check
    if (localStorage.getItem('yuni_limit_lock') === 'true') {
      setError('Certificate limit reached for this device. You cannot download more than 3 certificates.');
      return;
    }

    // Robust fingerprinting for tracking
    const getFingerprint = () => {
      const data = [
        navigator.userAgent,
        navigator.language,
        window.screen.width + 'x' + window.screen.height,
        new Date().getTimezoneOffset(),
        // Add more static markers if needed
      ].join('|');
      // Simple hash function for the fingerprint
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(36);
    };

    const fingerprint = getFingerprint();
    const localDownloadsKey = `yuni_protocol_v2_${fingerprint}`;
    const localDownloads = JSON.parse(localStorage.getItem(localDownloadsKey) || '[]');
    
    // Check both by fingerprint and by Reference Number (multi-layered protection)
    const refNoKey = `yuni_ref_${formData.refNo.toUpperCase()}`;
    const refDownloads = JSON.parse(localStorage.getItem(refNoKey) || '[]');
    
    // Merge the two for the check
    const combinedDownloads = [...new Set([...localDownloads, ...refDownloads])];
    const uniqueNewWorkshops = formData.workshops.filter(w => !combinedDownloads.includes(w));
    
    if (combinedDownloads.length + uniqueNewWorkshops.length > 3) {
      const remaining = 3 - combinedDownloads.length;
      setError(remaining <= 0 
        ? 'You have already reached the 3-certificate download limit for this student/device.' 
        : `You can only download ${remaining} more certificate(s). Total allowed: 3.`
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/verify-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refNo: formData.refNo,
          name: formData.name,
          phone: formData.phone,
          workshops: formData.workshops
        }),
      });

      const result = await response.json();

      if (response.ok && result.valid) {
        // Generate all selected certificates sequentially
        for (const workshopId of formData.workshops) {
          const workshop = WORKSHOPS.find(w => w.id === workshopId);
          if (workshop) {
            await generateCertificate(result.student.name, result.student.refNo, workshop.name, workshop.template);
          }
        }
        
        // Update local storage tracking (multi-layered)
        const updatedDownloads = [...new Set([...combinedDownloads, ...formData.workshops])];
        localStorage.setItem(localDownloadsKey, JSON.stringify(updatedDownloads));
        localStorage.setItem(refNoKey, JSON.stringify(updatedDownloads));
        
        // Also set a global "fingerprint lockout" if they have 3
        if (updatedDownloads.length >= 3) {
          localStorage.setItem('yuni_limit_lock', 'true');
        }
        
        setSuccess(true);
      } else {
        setError(result.error || 'Verification failed. Please check your details.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="certificate-form-protocol max-w-2xl mx-auto">
      <style>{`
        .certificate-form-protocol { 
          width: 100%; 
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        .protocol-section { 
          background: var(--glass-bg); 
          backdrop-filter: blur(20px); 
          border: 1px solid var(--glass-border); 
          border-radius: 2rem; 
          padding: 3rem; 
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .field-protocol input, 
        .field-protocol select { 
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          background: rgba(255, 255, 255, 0.03); 
          border: 1px solid var(--border-light); 
          border-radius: 1rem; 
          padding: 1.1rem; 
          color: var(--text-primary); 
          font-family: inherit; 
          font-size: 0.95rem; 
          transition: all 0.3s ease; 
        }
        @media (max-width: 640px) {
          .protocol-section { 
            padding: 1.5rem 1rem; 
            border-radius: 1.5rem;
          }
          .input-group-protocol { 
            grid-template-columns: 1fr; 
            gap: 1rem; 
            width: 100%;
          }
          .field-protocol.full { 
            grid-column: span 1; 
          }
          .protocol-header {
            font-size: 0.85rem;
            margin-bottom: 1.25rem;
          }
          .protocol-submit-btn {
            padding: 1rem;
            font-size: 0.85rem;
            border-radius: 1rem;
            width: 100%;
          }
          .field-protocol input, .field-protocol select {
            padding: 0.85rem;
            font-size: 0.9rem;
          }
          .workshop-row {
            gap: 0.5rem;
            width: 100%;
          }
          .remove-workshop {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
          }
        }
        .protocol-header { font-size: 1.1rem; font-weight: 800; color: var(--pk-green); margin-bottom: 2rem; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem; }
        .input-group-protocol { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .field-protocol { display: flex; flex-direction: column; gap: 0.6rem; }
        .field-protocol.full { grid-column: span 2; }
        .field-protocol label { font-size: 0.75rem; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.1em; margin-left: 0.5rem; }
        .field-protocol input, .field-protocol select { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-light); border-radius: 1rem; padding: 1.1rem; color: var(--text-primary); font-family: inherit; font-size: 0.95rem; transition: all 0.3s ease; }
        .field-protocol input:focus, .field-protocol select:focus { outline: none; border-color: var(--pk-green); background: rgba(255, 255, 255, 0.06); box-shadow: 0 0 15px rgba(12, 98, 56, 0.1); }
        .workshop-row { position: relative; display: flex; align-items: flex-end; gap: 1rem; width: 100%; }
        .remove-workshop { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; border-radius: 0.75rem; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; margin-bottom: 2px; }
        .remove-workshop:hover { background: rgba(239, 68, 68, 0.2); transform: scale(1.05); }
        .add-workshop-btn { background: rgba(12, 98, 56, 0.05); border: 1px dashed var(--pk-green); color: var(--pk-green); border-radius: 1rem; padding: 0.8rem; width: 100%; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-top: 1rem; text-transform: uppercase; letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .add-workshop-btn:hover { background: rgba(12, 98, 56, 0.1); transform: translateY(-2px); }
        .declaration-protocol { margin-top: 2rem; padding: 1.5rem; background: rgba(255, 255, 255, 0.02); border-radius: 1.25rem; border: 1px dashed var(--border-light); }
        .checkbox-protocol { display: flex; align-items: flex-start; gap: 1rem; cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }
        .checkbox-protocol input { width: 1.25rem; height: 1.25rem; accent-color: var(--pk-green); margin-top: 0.1rem; cursor: pointer; }
        .protocol-submit-btn { width: 100%; background: var(--pk-green); color: #fff; padding: 1.4rem; border-radius: 1.25rem; font-size: 1rem; font-weight: 800; border: none; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); text-transform: uppercase; letter-spacing: 0.15em; display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-top: 2rem; box-shadow: 0 10px 20px rgba(12, 98, 56, 0.15); }
        .protocol-submit-btn:hover:not(:disabled) { background: var(--pk-green-light); transform: translateY(-4px); box-shadow: 0 20px 40px var(--pk-green-glow); }
        .protocol-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
        .status-msg-protocol { margin-top: 1.5rem; padding: 1.25rem; border-radius: 1.25rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; animation: slideUp 0.4s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .status-msg-protocol.error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; }
        .status-msg-protocol.success { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); color: #4ade80; }
      `}</style>

      <form onSubmit={handleSubmit} className="protocol-section">
        <h3 className="protocol-header">CERTIFICATE VERIFICATION PROTOCOL</h3>
        <div className="input-group-protocol">
          <div className="field-protocol full">
            <label>FULL LEGAL NAME</label>
            <input type="text" name="name" placeholder="EXACTLY AS REGISTERED" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="field-protocol">
            <label>REFERENCE NO</label>
            <input type="text" name="refNo" placeholder="YUNI-XXXXX" value={formData.refNo} onChange={handleChange} required />
          </div>
          <div className="field-protocol">
            <label>PASSCODE (PHONE)</label>
            <input type="text" name="phone" placeholder="03XXXXXXXXX" value={formData.phone} onChange={handleChange} required />
          </div>
          
          <div className="field-protocol full space-y-4">
            <label>WORKSHOP(S) PROTOCOL (MAX 3)</label>
            {formData.workshops.map((workshopId, index) => (
              <div key={index} className="workshop-row">
                <select 
                  className="flex-grow"
                  value={workshopId} 
                  onChange={(e) => handleWorkshopChange(index, e.target.value)} 
                  required
                >
                  {WORKSHOPS.map(w => (
                    <option key={w.id} value={w.id} className="bg-slate-900 text-white">
                      {w.name}
                    </option>
                  ))}
                </select>
                {formData.workshops.length > 1 && (
                  <button type="button" className="remove-workshop" onClick={() => removeWorkshop(index)}>
                    &times;
                  </button>
                )}
              </div>
            ))}
            
            {formData.workshops.length < 3 && (
              <button type="button" className="add-workshop-btn" onClick={addWorkshop}>
                <Layers size={16} /> Add Another Workshop
              </button>
            )}
          </div>
        </div>

        <div className="declaration-protocol">
          <label className="checkbox-protocol">
            <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleChange} required />
            <span>I confirm that the credentials provided are accurate and I am the authorized recipient of this certification.</span>
          </label>
        </div>

        {error && (
          <div className="status-msg-protocol error">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="status-msg-protocol success">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Validation Complete. {formData.workshops.length} Certificate(s) Generated.
          </div>
        )}

        <button type="submit" className="protocol-submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              SYNCING...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              VERIFY AND DOWNLOAD
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CertificateForm;
