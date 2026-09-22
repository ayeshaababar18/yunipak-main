const fs = require('fs');
const path = require('path');

const formsDir = path.join(__dirname, 'src/components/Careers/Forms');
const files = fs.readdirSync(formsDir).filter(f => f.endsWith('.tsx'));

const modalCode = `
      {submitStatus && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: submitStatus.type === 'success' ? '#0f1714' : '#1a0f12', border: \`1px solid \${submitStatus.type === 'success' ? '#2ecc71' : '#ff4757'}\`, borderRadius: '16px', padding: '2.5rem', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: submitStatus.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 71, 87, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: submitStatus.type === 'success' ? '#2ecc71' : '#ff4757' }}>
              {submitStatus.type === 'success' ? '✓' : '⚠'}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>{submitStatus.type === 'success' ? 'Application Submitted!' : 'Error'}</h3>
            <p style={{ margin: 0, color: '#a0aab2', lineHeight: '1.6', fontSize: '0.95rem' }}>{submitStatus.message}</p>
            <button type="button" onClick={() => { if (submitStatus.type === 'success') { onClose(); } else { setSubmitStatus(null); } }} style={{ marginTop: '1rem', padding: '0.8rem 2.5rem', backgroundColor: submitStatus.type === 'success' ? '#2ecc71' : '#ff4757', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', width: '100%', transition: 'all 0.2s', alignSelf: 'stretch' }}>
              {submitStatus.type === 'success' ? 'Close' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
`;

for (const file of files) {
  const filePath = path.join(formsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to remove the first block
  content = content.replace(/\{submitStatus && \([\s\S]*?<div className=\{'status-message-premium ' \+ submitStatus\.type\}[\s\S]*?<\/div>\s*\)\}/, modalCode.trim());

  // Regex to remove the second block completely
  content = content.replace(/\s*\{submitStatus && \([\s\S]*?<div className=\{'status-message-premium ' \+ submitStatus\.type\} style=\{\{ marginBottom: '1rem' \}\}[\s\S]*?<\/div>\s*\)\}/, '');

  fs.writeFileSync(filePath, content);
  console.log('Updated', file);
}
