# STYLO – AI Personal Stylist

A high-fidelity recreation of the **STYLO** luxury digital styling platform ([vashusingh177.wixsite.com/stylo](https://vashusingh177.wixsite.com/stylo)). Built with semantic HTML5, pure Vanilla CSS3, modern ES6+ JavaScript, and a built-in zero-cost **Computer Vision & Wardrobe Styling Algorithm**.

---

## 🌟 Architecture & Features

### 1. Computer Vision & Color Analysis Engine (Client-Side, 100% Free)
- **HTML5 Canvas Pixel Sampler**: Off-screen canvas samples RGB values from dropped/uploaded garments in 0ms with zero API cost.
- **Fashion Palette Mapper**: Converts sampled RGB values to HSL color space and matches them to curated editorial shades (`Camel / Desert Sand`, `Dusty Rose / Blush`, `Emerald / Deep Forest`, `Midnight Navy`, `Charcoal Onyx`, `Crisp White / Ecru`, `Burnt Terracotta`).
- **Silhouette & Texture Inference**: Classifies garments by aspect ratio and luminance variance into `Outerwear`, `Tailored Blazer`, `Top / Knitwear`, `Skirt / Dress`, `Trousers`, and `Footwear / Bag` with attributes like `Accordion Pleats`, `Longline Drape`, `Structured Shoulders`.
- **Laser-Scanned Interactive Cards**: Interactive cards feature a scanning laser animation, image thumbnails, color swatches, editable category selectors, and removal controls.

### 2. Live Wardrobe Synergy & Context Auto-Suggestion
- **Wardrobe Synergy Meter**: Real-time progress bar computing capsule completeness and palette cohesion (45% $\rightarrow$ 99%).
- **AI Smart Context Recommendation**: Analyzes collective wardrobe pieces to recommend the optimal Occasion, Weather, Personal Style, and Comfort preference.
- **Auto-Fill Button (`✨ Auto-Fill Suggested Context`)**: Instantly syncs the recommended parameters to all form filters with glowing highlight feedback.

### 3. Editorial Lookbook Generator & "1 Item, 5 Looks"
- **User Garment Integration**: Embeds the user's actual uploaded anchor piece into the Lookbook.
- **1 Item, 5 Looks Versatility Guide**: Generates 5 versatile outfit formulas based on the homepage concept (Corporate Meeting, Client Luncheon, Gallery Opening, Travel Luxe, Smart Casual).
- **Budget-Matched Missing Piece**: Dynamically suggests a complementing missing item within the user's budget range slider (e.g., *$95 Sculptural Brass Wave Ear Cuffs*).
- **Working Slide-In Cart Drawer**: One-click **`+ Add to Cart`** button adds suggested pieces to the side drawer, updates the quantity badge, calculates subtotals, and supports checkout.

### 4. Pages & Routes
- **`index.html`** (`/`): Editorial Hero, 3-card features grid, Bento versatility section (architectural studio room, trench coat model, pleats texture, empty frame), dark luxury footer with social bar.
- **`how-it-works.html`** (`/how-it-works` / `/blank`): Intake styling form, 3-step numbered workflow, expandable Style Inquiries & FAQs accordions, and the Wardrobe Studio dropzone with instant test presets (`+ Camel Trench`, `+ Pleated Silk`, `+ Tailored Blazer`).
- **`about.html`** (`/about` / `/about-stylo`): Brand vision narrative, panoramic AI scanning banner, "Why We Created STYLO", 6-card capability grid, stylist photo, and 4 trust pillars.
- **Interactive Modals**: Sign Up, Log In with tab switcher and password toggles, Slide-Out Shopping Cart Drawer, and Lookbook Result Modal.

---

## 🚀 Running Locally

Launch the project with the included zero-dependency server:

```bash
# Using npm
npm start
# or
npm run dev

# Or directly with Node
node server.js
```

Then open your browser at **`http://localhost:5050`**.

---

## 🔌 Backend API Endpoints

The included `server.js` provides both clean URL routing and JSON API endpoints:

- `POST /api/generate-styling`:
  - **Body**: `{ "occasion": "Work", "weather": "Autumn", "style": "Quiet Luxury", "budget": 350, "garments": [...] }`
  - **Response**: Returns the complete fashion synergy calculation, 5-looks versatility formula, and budget-matched missing piece recommendation.
  - **Zero Cost**: Runs deterministically with zero latency. Optional Gemini Vision integration enabled if `GEMINI_API_KEY` is provided in environment variables.

---

## 📁 Clean Directory Structure

```
aryansite/
├── assets/                     # High-resolution original images & icons
│   ├── logo.png                # Brand vector/raster mark
│   ├── hero-couple.png         # Editorial hero visual
│   ├── step1-upload.png        # Step 01 illustration
│   ├── step2-analyze.png       # Step 02 illustration
│   ├── step3-outfits.png       # Step 03 illustration
│   ├── versatility-trench.jpg  # Architectural studio backdrop
│   ├── get-look-pleats.jpg     # Trench coat model (1 Item, 5 Looks)
│   ├── fabric-texture.jpg      # Pleated silk texture (Get the Look)
│   ├── about-banner.jpg        # Panoramic AI scanning banner
│   ├── about-credibility.jpg   # Stylist credibility visual
│   ├── icon-sparkle.jpg        # What We Do icon
│   ├── icon-hanger.jpg         # Total Analysis icon
│   └── icon-circle.jpg         # Our Mission icon
├── css/
│   └── style.css               # Editorial design system, typography & micro-interactions
├── js/
│   └── main.js                 # Computer vision, styling matrix, modals & cart state
├── docs/
│   └── screenshots/            # Verification screenshots of desktop & mobile UI
├── index.html                  # Homepage
├── how-it-works.html           # How It Works & Wardrobe Studio page
├── blank.html                  # Wix alias redirect to /how-it-works
├── about.html                  # About STYLO page
├── about-stylo.html            # Wix alias redirect to /about
├── server.js                   # Node dev server with clean routing & /api endpoints
├── package.json                # Project configuration & npm scripts
├── .gitignore                  # Git ignore rules
└── README.md                   # Complete documentation
```

---

## 🎨 Design System
- **Typography**: `Instrument Serif` (editorial display) & `Inter` (geometric sans-serif) via Google Fonts.
- **Accents**: Electric Cyan (`#00CED1`, glow `rgba(0, 206, 209, 0.4)`), warm taupe studio backgrounds (`#ded6cb`), dark carbon footer (`#000000`).
- **Responsive**: Fluid layouts for mobile (375px+), tablet (768px), and high-resolution desktop viewports.
