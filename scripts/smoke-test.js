const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'server.js',
  'apps/storefront/index.html',
  'apps/storefront/storefront.js',
  'apps/brand/index.html',
  'apps/influencer/index.html',
  'apps/admin/index.html',
  'public/assets/js/api.js',
  'public/assets/js/motion.js',
  'public/assets/css/shared.css',
  'Dockerfile',
  '.env.example'
];

let ok = true;
for (const file of requiredFiles) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) {
    console.error(`Missing required file: ${file}`);
    ok = false;
  }
}

const storefront = fs.readFileSync(path.join(process.cwd(), 'apps/storefront/index.html'), 'utf8');
if (!storefront.includes('gsap.min.js') || !storefront.includes('ScrollTrigger.min.js')) {
  console.error('Storefront missing required GSAP/ScrollTrigger script includes.');
  ok = false;
}

if (!ok) process.exit(1);
console.log('Smoke test passed. Required files and motion includes found.');
