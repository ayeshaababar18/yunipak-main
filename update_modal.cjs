const fs = require('fs');

const files = [
  'src/components/Careers/Forms/JobApplicationForm.tsx',
  'src/components/Careers/Forms/AmbassadorForm.tsx',
  'src/components/Careers/Forms/InternshipForm.tsx'
];

const modalCode = `
      {submitStatus && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: submitStatus.type === 'success' ? '#0f1714' : '#1a0f12', border: \`1px solid \${submitStatus.type === 'success' ? '#2ecc71' : '#ff4757'}\`, borderRadius: '16px', padding: '2.5rem', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
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
`;

for (const file of files) {
  let lines = fs.readFileSync(file, 'utf8').split('\n');
  let output = [];
  let inStatusBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('{submitStatus && (')) {
      inStatusBlock = true;
      continue;
    }
    
    if (inStatusBlock) {
      if (line.trim() === ')}' && lines[i-1].includes('</div>')) {
        inStatusBlock = false;
      }
      continue;
    }
    
    output.push(line);
  }
  
  // Insert the modal block exactly before the <form
  const newContent = [];
  for (let i = 0; i < output.length; i++) {
    if (output[i].includes('<form onSubmit')) {
      newContent.push(modalCode);
    }
    newContent.push(output[i]);
  }
  
  fs.writeFileSync(file, newContent.join('\n'));
}
