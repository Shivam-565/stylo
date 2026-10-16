const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

// Copy static HTML files
const htmlFiles = ['index.html', 'about.html', 'how-it-works.html', 'blank.html', 'about-stylo.html'];
htmlFiles.forEach(file => {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(dist, file));
  }
});

// Copy static directories
const dirs = ['css', 'assets', 'js'];
dirs.forEach(dir => {
  const src = path.join(__dirname, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(dist, dir), { recursive: true });
  }
});

console.log('STYLO: Static build generated successfully in /dist');
