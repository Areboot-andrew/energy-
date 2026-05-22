const tw = require('tailwindcss/package.json');
console.log('Tailwind version:', tw.version);
try {
  const pcs = require('@tailwindcss/postcss/package.json');
  console.log('PostCSS plugin version:', pcs.version);
} catch(e) {
  console.log('PostCSS plugin not found:', e.message);
}
// Check if tailwind.config.js is supported
try {
  const twConfig = require('./tailwind.config.js');
  console.log('tailwind.config.js loaded OK, has theme:', !!twConfig.theme);
} catch(e) {
  console.log('Error loading tailwind.config.js:', e.message);
}
