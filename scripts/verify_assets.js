// scripts/verify_assets.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Starting YUNI 2026 Asset & Data Structure Integrity Tests...');

// 1. Verify yunityData.ts contents
const yunityDataPath = path.join(rootDir, 'src/constants/yunityData.ts');
if (!fs.existsSync(yunityDataPath)) {
  console.error('❌ yunityData.ts not found!');
  process.exit(1);
}

// Read and parse gallery images list from yunityData.ts
const content = fs.readFileSync(yunityDataPath, 'utf8');
const galleryMatches = content.match(/"\/gallery\/_DSC[0-9]+\.jpg"/g);
if (!galleryMatches || galleryMatches.length === 0) {
  console.error('❌ No gallery images found in yunityData.ts!');
  process.exit(1);
}

const uniqueGalleryImages = [...new Set(galleryMatches.map(m => m.replace(/"/g, '')))];
console.log(`Found ${uniqueGalleryImages.length} gallery images in yunityData.ts.`);

// Check if each image exists in public/gallery/
let missingImages = 0;
uniqueGalleryImages.forEach(img => {
  const fullPath = path.join(rootDir, 'public', img);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing asset: ${fullPath}`);
    missingImages++;
  } else {
    // Check thumbnail too
    const thumbName = path.basename(img);
    const thumbPath = path.join(rootDir, 'public', 'gallery', 'thumbs', thumbName);
    if (!fs.existsSync(thumbPath)) {
      console.warn(`⚠️ Missing thumbnail for: ${img} (expected at public/gallery/thumbs/${thumbName})`);
    }
  }
});

// 2. Verify summerCampData.ts has 7 courses and 3 tracks each
const summerCampDataPath = path.join(rootDir, 'src/constants/summerCampData.ts');
if (!fs.existsSync(summerCampDataPath)) {
  console.error('❌ summerCampData.ts not found!');
  process.exit(1);
}

import('../src/constants/summerCampData.ts')
  .then(module => {
    const courses = module.summerCampCourses;
    if (!courses || !Array.isArray(courses)) {
      console.error('❌ summerCampCourses is not exported as an array!');
      process.exit(1);
    }
    
    if (courses.length !== 7) {
      console.error(`❌ Expected exactly 7 courses, found ${courses.length}`);
      process.exit(1);
    }
    
    console.log('✅ Found exactly 7 Summer Camp courses.');
    courses.forEach((c, idx) => {
      console.log(`   - Course ${idx + 1}: ${c.title}`);
      if (!c.subcategories || c.subcategories.length !== 3) {
        console.error(`❌ Course "${c.title}" does not have exactly 3 subcategories!`);
        process.exit(1);
      }
    });

    if (missingImages > 0) {
      console.error(`❌ Asset verification failed with ${missingImages} missing files.`);
      process.exit(1);
    }

    console.log('🎉 All asset and data structures are fully valid and integrated!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed to load or compile summerCampData.ts:', err);
    process.exit(1);
  });
