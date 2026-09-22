import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const excelFilePath = './certificates/new details.xlsx';
const outputFilePath = './api/data/students.json';

function convert() {
  try {
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Map the data to a standard format
    const students = data.map(row => ({
      refNo: String(row['Ref#'] || '').trim(),
      name: String(row['Name'] || '').trim(),
      phone: String(row['Phone #'] || '').trim()
    })).filter(s => s.refNo && s.phone);

    fs.writeFileSync(outputFilePath, JSON.stringify(students, null, 2));
    console.log(`Successfully converted ${students.length} student records.`);
  } catch (error) {
    console.error('Error converting Excel to JSON:', error);
    process.exit(1);
  }
}

convert();
