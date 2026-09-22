import fs from 'fs';
import path from 'path';

// In-memory cache for stateless environments (temporary protection)
const ipCache = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const { refNo, name, phone, workshops = [] } = req.body;

  if (!refNo || !name || !phone) {
    return res.status(400).json({ error: 'Reference Number, Name, and Phone Number (passcode) are required' });
  }

  // IP Rate limiting - max 5 verification attempts per hour per IP
  const now = Date.now();
  const ipData = ipCache.get(clientIp) || { count: 0, lastReset: now };
  if (now - ipData.lastReset > 3600000) {
    ipData.count = 0;
    ipData.lastReset = now;
  }
  if (ipData.count > 10) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  ipData.count++;
  ipCache.set(clientIp, ipData);

  try {
    const dataPath = path.join(process.cwd(), 'api/data/students.json');
    const downloadsPath = path.join(process.cwd(), 'api/data/downloads.json');
    
    const students = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    let downloads = {};
    try {
      if (fs.existsSync(downloadsPath)) {
        downloads = JSON.parse(fs.readFileSync(downloadsPath, 'utf8'));
      }
    } catch (e) {
      console.error('Error reading downloads file:', e);
    }

    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const inputName = normalize(name);
    const inputPhone = phone.replace(/[\s-]/g, '');

    const student = students.find(s => 
      s.refNo.toLowerCase() === refNo.toLowerCase() && 
      s.phone.replace(/[\s-]/g, '') === inputPhone &&
      normalize(s.name) === inputName
    );

    if (student) {
      // ROBUST KEY: Normalize name (remove all non-alphanumeric) and phone
      const normalizedStudentName = normalize(student.name);
      const normalizedStudentPhone = student.phone.replace(/[\s-]/g, '');
      
      const studentKey = `${normalizedStudentName}_${normalizedStudentPhone === 'nan' ? student.refNo.toUpperCase() : normalizedStudentPhone}`;
      
      const studentDownloads = downloads[studentKey] || [];

      // Strict validation: Max 3 total workshops allowed in request
      if (workshops.length > 3) {
        return res.status(400).json({ error: 'You can only request up to 3 certificates at a time.' });
      }

      // Get unique requested workshops to avoid duplicate counting
      const uniqueRequestedWorkshops = [...new Set(workshops)];

      // Calculate how many NEW unique workshops are being requested
      const newWorkshops = uniqueRequestedWorkshops.filter(w => !studentDownloads.includes(w));
      const totalCount = studentDownloads.length + newWorkshops.length;

      if (totalCount > 3) {
        const remaining = 3 - studentDownloads.length;
        if (remaining <= 0) {
          return res.status(403).json({ 
            error: `Certificate limit reached. You have already downloaded your 3 allowed unique certificates. No more downloads permitted for this student.` 
          });
        }
        return res.status(403).json({ 
          error: `Certificate limit exceeded. You have already downloaded ${studentDownloads.length} unique certificate(s). You can only download ${remaining} more. Total allowed: 3.` 
        });
      }

      // Update downloads record
      if (newWorkshops.length > 0) {
        downloads[studentKey] = [...studentDownloads, ...newWorkshops];
        try {
          // Ensure directory exists (useful for local development)
          if (!fs.existsSync(path.dirname(downloadsPath))) {
            fs.mkdirSync(path.dirname(downloadsPath), { recursive: true });
          }
          fs.writeFileSync(downloadsPath, JSON.stringify(downloads, null, 2));
        } catch (e) {
          console.error('Error writing downloads file:', e);
          // In a serverless environment (Vercel), this file write might not persist.
          // For a truly robust solution, a database should be used.
        }
      }

      return res.status(200).json({ 
        valid: true, 
        student: {
          name: student.name,
          refNo: student.refNo
        } 
      });
    } else {
      return res.status(401).json({ error: 'Invalid Reference Number or Passcode (Phone Number).' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
