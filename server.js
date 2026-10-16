const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5050;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// Explicit static asset paths for @vercel/nft AST tracing
// Each literal string instructs Vercel's bundler to include the asset in the Serverless Lambda package.
const STATIC_REGISTRY = {
  '/index.html': path.join(__dirname, 'index.html'),
  '/about.html': path.join(__dirname, 'about.html'),
  '/how-it-works.html': path.join(__dirname, 'how-it-works.html'),
  '/blank.html': path.join(__dirname, 'blank.html'),
  '/about-stylo.html': path.join(__dirname, 'about-stylo.html'),
  '/css/style.css': path.join(__dirname, 'css/style.css'),
  '/js/main.js': path.join(__dirname, 'js/main.js'),
  '/assets/logo.png': path.join(__dirname, 'assets/logo.png'),
  '/assets/hero-couple.png': path.join(__dirname, 'assets/hero-couple.png'),
  '/assets/about-banner.jpg': path.join(__dirname, 'assets/about-banner.jpg'),
  '/assets/about-credibility.jpg': path.join(__dirname, 'assets/about-credibility.jpg'),
  '/assets/fabric-texture.jpg': path.join(__dirname, 'assets/fabric-texture.jpg'),
  '/assets/get-look-pleats.jpg': path.join(__dirname, 'assets/get-look-pleats.jpg'),
  '/assets/icon-circle.jpg': path.join(__dirname, 'assets/icon-circle.jpg'),
  '/assets/icon-hanger.jpg': path.join(__dirname, 'assets/icon-hanger.jpg'),
  '/assets/icon-sparkle.jpg': path.join(__dirname, 'assets/icon-sparkle.jpg'),
  '/assets/step1-upload.png': path.join(__dirname, 'assets/step1-upload.png'),
  '/assets/step2-analyze.png': path.join(__dirname, 'assets/step2-analyze.png'),
  '/assets/step3-outfits.png': path.join(__dirname, 'assets/step3-outfits.png'),
  '/assets/versatility-trench.jpg': path.join(__dirname, 'assets/versatility-trench.jpg')
};

// Deterministic fashion styling knowledge matrix (100% free, zero-latency fallback)
const FASHION_MATRIX = {
  'Work': {
    title: 'Architectural Tailored Capsule',
    archetype: 'Modern Executive & Boardroom',
    synergy: 98,
    advice: 'Camel and sand neutrals ground sharp tailoring, creating effortless authority without rigidity.',
    looks: [
      { num: '01', name: 'Corporate Meeting', formula: 'Core tailored coat + crisp poplin shirt + pleated wide-leg trousers + chunky loafers.' },
      { num: '02', name: 'Client Luncheon', formula: 'Coat draped open + ribbed merino turtleneck + tailored cigarette pants + kitten heels.' },
      { num: '03', name: 'Gallery Opening / After 6', formula: 'Cinched with contrast leather belt + monochrome slip dress + sculptural ear cuffs.' },
      { num: '04', name: 'Travel / Commute', formula: 'Unstructured wrap + cashmere knit hoodie + tailored track trousers + clean leather sneakers.' },
      { num: '05', name: 'Smart Casual Friday', formula: 'Coat layered over high-gauge crewneck + straight-leg raw selvedge denim + Chelsea boots.' }
    ],
    missingPiece: {
      name: 'Pleated High-Rise Crepe Trousers',
      price: 165.00,
      img: 'assets/get-look-pleats.jpg',
      reason: 'Elongates the silhouette and balances the proportions of your outerwear.'
    }
  },
  'Casual': {
    title: 'Off-Duty Minimalist Capsule',
    archetype: 'Elevated Weekend Ease',
    synergy: 96,
    advice: 'Combines structural outerwear with relaxed base layers for elevated weekend movement.',
    looks: [
      { num: '01', name: 'Saturday Coffee & Market', formula: 'Draped trench + heavyweight white tee + relaxed tapered chinos + minimal sneakers.' },
      { num: '02', name: 'Boutique Shopping', formula: 'Buttoned trench with collar up + crossbody saddle bag + raw denim + suede mules.' },
      { num: '03', name: 'Sunday Brunch', formula: 'Layered over soft oversized knit + midi pleated skirt + retro runner sneakers.' },
      { num: '04', name: 'Museum Visit', formula: 'Belted trench + dark mock-neck knit + tailored relaxed wool trousers + leather tote.' },
      { num: '05', name: 'Evening Walk', formula: 'Loose drape + cashmere ribbed scarf + tailored joggers + combat boots.' }
    ],
    missingPiece: {
      name: 'Heavyweight Poplin Boy-Shirt',
      price: 110.00,
      img: 'assets/fabric-texture.jpg',
      reason: 'Crisp poplin creates a striking tactile contrast against wool and trench textures.'
    }
  },
  'Gala': {
    title: 'Monochromatic Modern Evening',
    archetype: 'High-Impact Sculptural Grace',
    synergy: 99,
    advice: 'Fluid accordion pleats and luminous tones catch evening lighting with breathtaking presence.',
    looks: [
      { num: '01', name: 'Black-Tie Gala', formula: 'Floor-length accordion gown + sculptural gold cuff + satin evening minaudière + minimal stiletto.' },
      { num: '02', name: 'Opera / Symphony Opening', formula: 'Layered with a tailored tuxedo cape + architectural pearl ear cuffs + pointed pumps.' },
      { num: '03', name: 'Cocktail Vernissage', formula: 'Pleated separate skirt + silk organza blouse + geometric clutch + architectural mules.' },
      { num: '04', name: 'Private Dinner Party', formula: 'Draped cashmere wrap + minimal silk camisole + wide pleated palazzo pants + drop earrings.' },
      { num: '05', name: 'Charity Benefit', formula: 'Cinched metallic leather waist wrap + sleek chignon hair styling + evening trench drape.' }
    ],
    missingPiece: {
      name: 'Sculptural Brass Wave Ear Cuffs',
      price: 95.00,
      img: 'assets/fabric-texture.jpg',
      reason: 'Brings luminous focus to the neckline and elevates evening folds.'
    }
  }
};

function handleRequest(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. API Endpoint: /api/generate-styling
  if (req.method === 'POST' && pathname === '/api/generate-styling') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const occasion = payload.occasion || 'Work';
        const weather = payload.weather || 'Sunny';
        const style = payload.style || 'Minimalist';
        const budget = Number(payload.budget) || 350;
        const garments = payload.garments || [];

        const template = FASHION_MATRIX[occasion] || FASHION_MATRIX['Work'];

        let adjustedSynergy = template.synergy;
        if (garments.length > 0) {
          adjustedSynergy = Math.min(99, 90 + garments.length * 3);
        }

        let missingPiece = { ...template.missingPiece };
        if (missingPiece.price > budget * 0.7) {
          missingPiece.price = Math.round(budget * 0.45);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'success',
          engine: 'STYLO Fashion Intelligence Engine v2.4 (Free Algorithmic Mode)',
          result: {
            title: template.title,
            archetype: template.archetype,
            occasion,
            weather,
            style,
            budget,
            synergy: adjustedSynergy,
            advice: template.advice,
            looks: template.looks,
            missingPiece,
            detectedCount: garments.length
          }
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: err.message }));
      }
    });
    return;
  }

  // 2. Static File Serving with URL aliases
  let reqPath = pathname;
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  if (reqPath === '/blank') reqPath = '/how-it-works.html';
  if (reqPath === '/about-stylo') reqPath = '/about.html';

  // Direct lookup in statically traced registry
  let targetFile = STATIC_REGISTRY[reqPath];

  // Fallback checks for clean URLs and subdirectories
  if (!targetFile) {
    if (STATIC_REGISTRY[reqPath + '.html']) {
      targetFile = STATIC_REGISTRY[reqPath + '.html'];
    } else {
      const cleanPath = reqPath.replace(/^\//, '');
      const candidates = [
        path.join(process.cwd(), cleanPath),
        path.join(__dirname, cleanPath),
        path.join(process.cwd(), 'dist', cleanPath),
        path.join(__dirname, 'dist', cleanPath)
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
          targetFile = cand;
          break;
        }
      }
    }
  }

  if (!targetFile || !fs.existsSync(targetFile)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 Not Found</h1><p><a href="/">Return to Home</a></p>');
    return;
  }

  const ext = path.extname(targetFile).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(targetFile, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error: ' + err.code);
    } else {
      // Set appropriate cache headers for static assets
      if (ext === '.css' || ext === '.js' || ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

// Export request listener function for Vercel Serverless Function runtime
module.exports = handleRequest;

// Start local HTTP server only when executed standalone
if (require.main === module) {
  const server = http.createServer(handleRequest);
  server.listen(PORT, () => {
    console.log(`STYLO server running on http://localhost:${PORT}`);
  });
}
