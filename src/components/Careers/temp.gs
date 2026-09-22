// Google Apps Script for Career Applications (Jobs, Internships, Ambassadors)

const FOLDER_NAME = 'Yuni_Application_Files';

function doPost(e) {
  try {
    const data = e.parameter;
    const formType = data.formType || 'job';
    
    // Handle File Uploads for Internships
    let cvFileUrl = "";
    let sampleWorkUrl = "";
    
    if (formType === 'internship') {
      if (data.cvFileBase64) {
        cvFileUrl = saveFileToDrive(data.cvFileBase64, data.cvFileName || 'CV', data.cvMimeType);
      }
      if (data.sampleWorkBase64) {
        sampleWorkUrl = saveFileToDrive(data.sampleWorkBase64, data.sampleWorkFileName || 'SampleWork', data.sampleWorkMimeType);
      }
    }
    
    const sheetData = getOrCreateDynamicSheet(formType, data);
    const sheet = sheetData.sheet;
    const keys = sheetData.keys;
    
    const lastRow = sheet.getLastRow();
    const serialNo = lastRow === 0 ? 1 : lastRow;
    
    const rowData = [serialNo, new Date().toLocaleString()];
    
    // Populate row based on headers
    keys.forEach(key => {
      if (key === 'cvFileUrl') {
        rowData.push(cvFileUrl);
      } else if (key === 'sampleWorkUrl') {
        rowData.push(sampleWorkUrl);
      } else {
        rowData.push(data[key] || "");
      }
    });
    
    sheet.appendRow(rowData);
    
    try {
      sendConfirmationEmail(data, formType);
    } catch(emailError) {
      console.log("Email error: " + emailError);
    }
    
    return createJSONResponse({ success: true, message: "Application submitted successfully", serialNo: serialNo });
    
  } catch (error) {
    return createJSONResponse({ success: false, error: error.toString() });
  }
}

function saveFileToDrive(base64Data, filename, mimeType) {
  try {
    // 1. Get or Create Folder
    let folder;
    const folders = DriveApp.getFoldersByName(FOLDER_NAME);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(FOLDER_NAME);
    }
    
    // 2. Decode & Save
    const decodedBytes = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decodedBytes, mimeType || 'application/octet-stream', filename);
    const file = folder.createFile(blob);
    
    return file.getUrl();
  } catch(e) {
    console.log("Drive upload error: " + e);
    return "Error uploading file";
  }
}

function getOrCreateDynamicSheet(formType, data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheetName = formType === 'internship' ? 'InternshipApplications' : 
                  formType === 'ambassador' ? 'AmbassadorApplications' : 'JobApplications';
                  
  let sheet = ss.getSheetByName(sheetName);
  
  // Filter out the large Base64 payload keys
  let keys = Object.keys(data).filter(function(k) {
    return !k.includes('Base64') && !k.includes('MimeType') && !k.includes('FileName');
  });
  
  if (formType === 'internship') {
    keys.push('cvFileUrl', 'sampleWorkUrl');
  }
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    const headers = ["Sr. No", "Application Date"].concat(keys);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange("1:1").setFontWeight("bold").setBackground("#0ae448").setFontColor("#000000");
    sheet.setFrozenRows(1);
  } else {
    // If sheet exists, ensure we have the correct keys mapped to existing headers
    const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    keys = existingHeaders.slice(2); // Skip Sr. No and Date
  }
  
  return { sheet: sheet, keys: keys };
}

function createJSONResponse(data) {
  const response = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  if (response.setHeaders) {
    response.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
  }
  return response;
}

function doOptions() {
  const response = ContentService.createTextOutput("");
  if (response.setHeaders) {
    response.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
  }
  return response;
}

function sendConfirmationEmail(data, formType) {
  if (!data.email) return;
  
  const subject = "Application Received - " + (data.positionTitle || "Position") + " | YUNI Education";
  
  let detailsHtml = "";
  if (formType === 'job') {
    detailsHtml = "<p><strong>Position:</strong> " + escapeHtml(data.positionTitle) + "</p><p><strong>Expected Salary:</strong> " + escapeHtml(data.expectedSalary) + "</p>";
  } else if (formType === 'internship') {
    detailsHtml = "<p><strong>Internship Track:</strong> " + escapeHtml(data.internshipTrack) + "</p><p><strong>Preferred Duration:</strong> " + escapeHtml(data.preferredDuration) + "</p>";
  } else if (formType === 'ambassador') {
    detailsHtml = "<p><strong>Role:</strong> Ambassador</p><p><strong>University:</strong> " + escapeHtml(data.university) + "</p>";
  }
  
  const htmlBody = "" +
    "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;\">" +
      "<div style=\"background: #000; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;\">" +
        "<h1 style=\"color: #0ae448; margin: 0;\">YUNI Education</h1>" +
      "</div>" +
      "<div style=\"background: #fff; padding: 30px; border-radius: 0 0 10px 10px;\">" +
        "<h2 style=\"color: #000;\">Application Received ✅</h2>" +
        "<p>Dear <strong>" + escapeHtml(data.fullName) + "</strong>,</p>" +
        "<p>Thank you for applying to YUNI Education.</p>" +
        "<div style=\"background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;\">" +
          detailsHtml +
        "</div>" +
        "<p>Our team will review your application within 5-7 business days.</p>" +
      "</div>" +
    "</div>";
  
  const textBody = "Dear " + data.fullName + ", your application for " + (data.positionTitle || "Yuni") + " has been received. Our team will review it within 5-7 business days.";
  
  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: htmlBody,
    body: textBody,
    name: "YUNI Education - Careers"
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
