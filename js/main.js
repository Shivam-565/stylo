/* ==========================================================================
   STYLO - Master Interactive Logic (Header, Modals, Cart, AI Generator)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initModals();
  initSideCart();
  initAccordions();
  initStylingGenerator();
  initWardrobeDropzone();
  initLookbookModal();
});

/* ==========================================================================
   1. NAVIGATION & HEADER
   ========================================================================== */
function initNavigation() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const currentPath = window.location.pathname;

  if (hamburgerBtn && mobileNavDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mobileNavDrawer.classList.toggle('open');
      document.body.style.overflow = mobileNavDrawer.classList.contains('open') ? 'hidden' : '';
    });

    // Close on mobile link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileNavDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Highlight current page in nav
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/'))))) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   2. AUTH MODALS (SIGN UP & LOG IN)
   ========================================================================== */
function initModals() {
  const modalOverlay = document.getElementById('authModalOverlay');
  const signupModal = document.getElementById('signupModal');
  const loginModal = document.getElementById('loginModal');
  const openAuthBtns = document.querySelectorAll('.open-auth-modal, .action-btn-auth');
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  const switchToLoginBtns = document.querySelectorAll('.switch-to-login');
  const switchToSignupBtns = document.querySelectorAll('.switch-to-signup');

  function openModal(type = 'signup') {
    if (!modalOverlay) return;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (type === 'signup') {
      signupModal?.style.setProperty('display', 'block');
      loginModal?.style.setProperty('display', 'none');
    } else {
      signupModal?.style.setProperty('display', 'none');
      loginModal?.style.setProperty('display', 'block');
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openAuthBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.authType || 'signup');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeCart();
      closeLookbook();
    }
  });

  switchToLoginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('login');
    });
  });

  switchToSignupBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('signup');
    });
  });

  // Toggle password visibility
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input && input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
      } else if (input) {
        input.type = 'password';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      }
    });
  });

  // Handle Form Submissions
  const signupForm = document.getElementById('signupForm');
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail')?.value;
    showToast(`Welcome to STYLO! Account created for ${email}`);
    closeModal();
  });

  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    showToast(`Welcome back, ${email}!`);
    closeModal();
  });

  // Social Auth Handlers
  document.querySelectorAll('.social-auth-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.innerText.includes('Google') ? 'Google' : 'Facebook';
      showToast(`Connecting with ${provider}...`);
      setTimeout(() => {
        showToast(`Successfully authenticated via ${provider}!`);
        closeModal();
      }, 900);
    });
  });
}

/* ==========================================================================
   3. SIDE CART DRAWER & STATE
   ========================================================================== */
let cartItems = [];

function initSideCart() {
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartDrawerOverlay');
  const cartCloseBtn = document.getElementById('cartCloseBtn');

  window.openCart = function() {
    cartOverlay?.classList.add('open');
    cartDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCart();
  };

  window.closeCart = function() {
    cartOverlay?.classList.remove('open');
    cartDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  };

  cartBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.openCart();
  });

  cartCloseBtn?.addEventListener('click', window.closeCart);
  cartOverlay?.addEventListener('click', window.closeCart);

  // Initial render
  renderCart();
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  if (badge) {
    badge.innerText = totalQty;
    badge.classList.add('bump');
    setTimeout(() => badge.classList.remove('bump'), 300);
  }
}

function renderCart() {
  const cartBody = document.getElementById('cartBody');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartFooter = document.getElementById('cartFooter');
  const cartCountHeader = document.getElementById('cartCountHeader');
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (cartCountHeader) {
    cartCountHeader.innerText = `Cart (${totalQty} items)`;
  }

  updateCartBadge();

  if (!cartBody) return;

  if (cartItems.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-cart-state">
        <p class="empty-cart-text">Your cart is empty.</p>
        <button type="button" class="btn-primary" onclick="addSampleItem();" style="margin-top: 1rem;">
          Add Suggested Piece
        </button>
      </div>
    `;
    if (cartFooter) cartFooter.style.display = 'none';
  } else {
    let subtotal = 0;
    let html = '<div class="cart-items-list">';
    cartItems.forEach((item, index) => {
      subtotal += item.price * item.qty;
      html += `
        <div class="cart-item-card">
          <img src="${item.img}" alt="${item.title}" class="cart-item-thumb" />
          <div class="cart-item-info">
            <span class="cart-item-name">${item.title}</span>
            <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button type="button" class="qty-btn" onclick="updateItemQty(${index}, -1)">−</button>
                <span class="qty-value">${item.qty}</span>
                <button type="button" class="qty-btn" onclick="updateItemQty(${index}, 1)">+</button>
              </div>
              <button type="button" class="remove-item-btn" onclick="removeCartItem(${index})">Remove</button>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    cartBody.innerHTML = html;

    if (cartSubtotal) {
      cartSubtotal.innerText = `$${subtotal.toFixed(2)}`;
    }
    if (cartFooter) {
      cartFooter.style.display = 'block';
    }
  }
}

window.addSampleItem = function() {
  cartItems.push({
    title: 'Minimalist Camel Trench Coat',
    price: 185.00,
    qty: 1,
    img: 'assets/get-look-pleats.jpg'
  });
  showToast('Added "Minimalist Camel Trench Coat" to cart!');
  renderCart();
};

window.updateItemQty = function(index, delta) {
  if (cartItems[index]) {
    cartItems[index].qty += delta;
    if (cartItems[index].qty <= 0) {
      cartItems.splice(index, 1);
      showToast('Item removed from cart.');
    }
    renderCart();
  }
};

window.removeCartItem = function(index) {
  if (cartItems[index]) {
    const title = cartItems[index].title;
    cartItems.splice(index, 1);
    showToast(`Removed "${title}" from cart.`);
    renderCart();
  }
};

window.handleCheckout = function() {
  showToast('Proceeding to secure checkout...');
  setTimeout(() => {
    alert('Thank you for shopping with STYLO! Order placed successfully.');
    cartItems = [];
    renderCart();
    window.closeCart();
  }, 800);
};

/* ==========================================================================
   4. ACCORDIONS (STYLE INQUIRIES & FAQS)
   ========================================================================== */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      // Close sibling items if wanted, or allow multiple
      item.classList.toggle('active', !isOpen);
    });
  });
}

/* ==========================================================================
   5. AI STYLING INTAKE & GENERATOR
   ========================================================================== */
function initStylingGenerator() {
  const form1 = document.getElementById('quickStyleForm');
  const form2 = document.getElementById('studioStyleForm');

  form1?.addEventListener('submit', (e) => {
    e.preventDefault();
    const occasion = form1.querySelector('input[name="occasion"]:checked')?.value || 'Work';
    const weather = form1.querySelector('input[name="weather"]:checked')?.value || 'Sunny';
    const style = form1.querySelector('input[name="style"]:checked')?.value || 'Minimalist';
    const comfort = document.getElementById('comfortInput')?.value || 'Breathable, relaxed tailoring';
    const budget = document.getElementById('budgetInput')?.value || '250';

    runAIGeneration({ occasion, weather, style, comfort, budget });
  });

  form2?.addEventListener('submit', (e) => {
    e.preventDefault();
    const occasion = document.getElementById('filterOccasion')?.value || 'Work';
    const weather = document.getElementById('filterWeather')?.value || 'Sunny';
    const style = document.getElementById('filterStyle')?.value || 'Minimalist';
    const comfort = document.getElementById('filterComfort')?.value || 'Balanced';
    const budget = document.getElementById('budgetRange')?.value || '350';

    runAIGeneration({ occasion, weather, style, comfort, budget });
  });

  // Range Slider label update
  const budgetRange = document.getElementById('budgetRange');
  const budgetValue = document.getElementById('budgetValue');
  budgetRange?.addEventListener('input', () => {
    if (budgetValue) budgetValue.innerText = `$${budgetRange.value}`;
  });
}

function runAIGeneration(params) {
  showToast('STYLO AI analyzing garments, color harmonies & silhouette synergy...');

  // Try calling the local /api/generate-styling server endpoint
  fetch('/api/generate-styling', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      occasion: params.occasion,
      weather: params.weather,
      style: params.style,
      comfort: params.comfort,
      budget: params.budget,
      garments: uploadedGarments
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data && data.status === 'success') {
      showLookbookResult(params, data.result);
    } else {
      showLookbookResult(params);
    }
  })
  .catch(() => {
    // Zero-latency client-side algorithmic fallback
    showLookbookResult(params);
  });
}

/* ==========================================================================
   6. COMPUTER VISION & WARDROBE STUDIO ALGORITHM
   ========================================================================== */
let uploadedGarments = [];

function initWardrobeDropzone() {
  const dropzone = document.getElementById('wardrobeDropzone');
  const fileInput = document.getElementById('wardrobeFileInput');

  if (!dropzone) return;

  dropzone.addEventListener('click', () => {
    fileInput?.click();
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-over');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    if (e.dataTransfer.files?.length) {
      processUploadedFiles(e.dataTransfer.files);
    }
  });

  fileInput?.addEventListener('change', () => {
    if (fileInput.files?.length) {
      processUploadedFiles(fileInput.files);
    }
  });
}

function processUploadedFiles(files) {
  Array.from(files).forEach((file, idx) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      analyzeGarmentImage(e.target.result, file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsDataURL(file);
  });
}

// Quick-Test Sample Presets
window.loadSampleGarment = function(type) {
  if (type === 'trench') {
    analyzeGarmentImage('assets/get-look-pleats.jpg', 'Camel Longline Trench Coat');
  } else if (type === 'pleats') {
    analyzeGarmentImage('assets/fabric-texture.jpg', 'Accordion Pleated Silk Separates');
  } else if (type === 'suit') {
    analyzeGarmentImage('assets/hero-couple.png', 'Architectural Tailored Suit');
  }
};

/* --- Computer Vision: Color & Silhouette Extraction --- */
function analyzeGarmentImage(imgSrc, givenName) {
  showToast(`AI Scanning "${givenName}"...`);

  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    // 1. Off-screen canvas pixel sampling
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const sampleSize = 64;
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

    let colorInfo = { hex: '#C19A6B', name: 'Camel / Sand', family: 'Warm Earth' };
    let isTextured = false;

    try {
      const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
      let totalR = 0, totalG = 0, totalB = 0, validPixels = 0;
      let lumList = [];

      for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const a = imgData[i + 3];

        if (a < 128) continue;
        // Filter out extreme pure white studio background or extreme black edges
        if (r > 242 && g > 242 && b > 242) continue;
        if (r < 18 && g < 18 && b < 18) continue;

        totalR += r;
        totalG += g;
        totalB += b;
        validPixels++;

        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        lumList.push(lum);
      }

      if (validPixels > 20) {
        const avgR = Math.round(totalR / validPixels);
        const avgG = Math.round(totalG / validPixels);
        const avgB = Math.round(totalB / validPixels);
        colorInfo = mapRgbToFashionPalette(avgR, avgG, avgB);

        // Compute texture variance
        const meanLum = lumList.reduce((acc, v) => acc + v, 0) / lumList.length;
        const variance = lumList.reduce((acc, v) => acc + Math.pow(v - meanLum, 2), 0) / lumList.length;
        isTextured = variance > 950;
      }
    } catch (err) {
      // Fallback color mapping based on name
      if (givenName.toLowerCase().includes('trench')) colorInfo = { hex: '#B8860B', name: 'Camel / Warm Tan', family: 'Warm Earth' };
      if (givenName.toLowerCase().includes('pleat')) colorInfo = { hex: '#D8A47F', name: 'Dusty Terracotta', family: 'Blush / Coral' };
      if (givenName.toLowerCase().includes('suit')) colorInfo = { hex: '#222222', name: 'Charcoal Onyx', family: 'Neutral' };
    }

    // 2. Silhouette & Category Heuristics
    const aspectRatio = (img.naturalHeight / (img.naturalWidth || 1)).toFixed(2);
    let category = 'Outerwear';
    let tags = [];

    const lower = (givenName + ' ' + imgSrc).toLowerCase();
    if (lower.includes('trench') || lower.includes('coat')) {
      category = 'Outerwear';
      tags = ['Longline Drape', 'Water-Resistant Twill', 'Staple Layer'];
    } else if (lower.includes('pleat') || lower.includes('skirt') || lower.includes('dress') || lower.includes('fabric')) {
      category = 'Skirt / Dress';
      tags = ['Accordion Pleats', 'Luminous Sheen', 'Movement'];
    } else if (lower.includes('suit') || lower.includes('blazer') || lower.includes('couple')) {
      category = 'Tailored Blazer';
      tags = ['Structured Shoulders', 'Double-Breasted', 'Sharp Lines'];
    } else if (aspectRatio > 1.4) {
      category = 'Outerwear';
      tags = ['Elongated Proportion', 'Capsule Anchor'];
    } else if (aspectRatio < 0.85) {
      category = 'Footwear / Bag';
      tags = ['Architectural Accessory', 'Grounding Accent'];
    } else {
      category = 'Top / Knit';
      tags = [isTextured ? 'Ribbed Knit' : 'Smooth Weave', 'Core Layer'];
    }

    const garmentItem = {
      id: 'garment_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: givenName || `${colorInfo.name} ${category}`,
      src: imgSrc,
      category,
      color: colorInfo,
      tags,
      aspectRatio
    };

    uploadedGarments.push(garmentItem);
    renderDetectedGarments();
    updateWardrobeSynergyAndSuggestions();
    showToast(`Detected: ${garmentItem.name} (${colorInfo.name})`);
  };

  img.onerror = () => {
    showToast(`Could not load image preview for ${givenName}`);
  };

  img.src = imgSrc;
}

/* --- Color Space Mapper (RGB -> HSL -> High-Fashion Palette) --- */
function mapRgbToFashionPalette(r, g, b) {
  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rNorm) h = ((gNorm - bNorm) / d) % 6;
    else if (max === gNorm) h = (bNorm - rNorm) / d + 2;
    else h = (rNorm - gNorm) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  // High fashion naming rules
  if (l > 0.88) return { hex, name: 'Crisp White / Ecru', family: 'Neutral' };
  if (l < 0.16) return { hex, name: 'Charcoal Onyx', family: 'Dark Neutral' };

  if (s < 0.16) {
    if (l > 0.65) return { hex, name: 'Heather Mist Grey', family: 'Cool Neutral' };
    if (l > 0.35) return { hex, name: 'Architectural Slate Grey', family: 'Neutral' };
    return { hex, name: 'Deep Graphite', family: 'Dark Neutral' };
  }

  if (h >= 24 && h <= 50) {
    if (l > 0.70) return { hex, name: 'Alabaster / Ivory', family: 'Warm Neutral' };
    if (l > 0.36) return { hex, name: 'Camel / Warm Tan', family: 'Warm Earth' };
    return { hex, name: 'Espresso / Chocolate', family: 'Deep Earth' };
  }

  if (h > 50 && h <= 80) return { hex, name: 'Olive Khaki / Ochre', family: 'Earthy Green' };
  if (h > 80 && h <= 165) {
    if (l < 0.35) return { hex, name: 'Emerald / Deep Forest', family: 'Jewel Tone' };
    return { hex, name: 'Muted Sage Green', family: 'Earthy Green' };
  }
  if (h > 165 && h <= 255) {
    if (l < 0.32) return { hex, name: 'Midnight Navy', family: 'Deep Blue' };
    return { hex, name: 'Slate Powder Blue', family: 'Cool Blue' };
  }
  if (h > 255 && h <= 320) return { hex, name: 'Aubergine / Plum', family: 'Deep Jewel' };

  // Reds / Warm Terracotta
  if (s < 0.40) return { hex, name: 'Dusty Rose / Blush', family: 'Soft Rose' };
  if (l < 0.35) return { hex, name: 'Burgundy / Bordeaux', family: 'Deep Wine' };
  return { hex, name: 'Burnt Terracotta', family: 'Warm Earth' };
}

/* --- Render Detected Garments List --- */
function renderDetectedGarments() {
  const container = document.getElementById('detectedGarmentsList');
  if (!container) return;

  if (uploadedGarments.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = uploadedGarments.map((item, idx) => `
    <div class="garment-card scanning" id="garmentCard_${item.id}">
      <button type="button" class="garment-remove-btn" onclick="removeGarment(${idx})" title="Remove piece">×</button>
      
      <div class="garment-thumb-wrap">
        <img src="${item.src}" alt="${item.name}" class="garment-thumb" />
      </div>

      <div class="garment-details">
        <select class="garment-category-select" onchange="updateGarmentCategory(${idx}, this.value)" aria-label="Garment Category">
          <option value="Outerwear" ${item.category === 'Outerwear' ? 'selected' : ''}>Outerwear</option>
          <option value="Tailored Blazer" ${item.category === 'Tailored Blazer' ? 'selected' : ''}>Tailored Blazer</option>
          <option value="Top / Knit" ${item.category === 'Top / Knit' ? 'selected' : ''}>Top / Knitwear</option>
          <option value="Skirt / Dress" ${item.category === 'Skirt / Dress' ? 'selected' : ''}>Skirt / Dress</option>
          <option value="Trousers" ${item.category === 'Trousers' ? 'selected' : ''}>Trousers / Pants</option>
          <option value="Footwear / Bag" ${item.category === 'Footwear / Bag' ? 'selected' : ''}>Footwear / Bag</option>
        </select>

        <div class="garment-color-row">
          <span class="color-swatch" style="background-color: ${item.color.hex};" title="${item.color.hex}"></span>
          <span class="color-name-text">${item.color.name}</span>
        </div>

        <div class="garment-tag-row">
          ${item.tags.map(t => `<span class="garment-tag-pill">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Remove scanning class after laser scan animation completes
  setTimeout(() => {
    uploadedGarments.forEach(item => {
      const card = document.getElementById(`garmentCard_${item.id}`);
      card?.classList.remove('scanning');
    });
  }, 480);
}

window.removeGarment = function(index) {
  if (uploadedGarments[index]) {
    const name = uploadedGarments[index].name;
    uploadedGarments.splice(index, 1);
    renderDetectedGarments();
    updateWardrobeSynergyAndSuggestions();
    showToast(`Removed "${name}" from studio.`);
  }
};

window.updateGarmentCategory = function(index, newCategory) {
  if (uploadedGarments[index]) {
    uploadedGarments[index].category = newCategory;
    updateWardrobeSynergyAndSuggestions();
    showToast(`Updated to ${newCategory}`);
  }
};

/* --- Wardrobe Synergy & Context Auto-Suggestion Engine --- */
function updateWardrobeSynergyAndSuggestions() {
  const scoreWrap = document.getElementById('wardrobeScoreBar');
  const progressFill = document.getElementById('wardrobeProgressFill');
  const scoreNum = document.getElementById('wardrobeScoreNum');
  const suggestionContainer = document.getElementById('aiSuggestionContainer');

  if (uploadedGarments.length === 0) {
    if (scoreWrap) scoreWrap.style.display = 'none';
    if (suggestionContainer) suggestionContainer.innerHTML = '';
    return;
  }

  // Calculate Synergy Score
  const count = uploadedGarments.length;
  const categories = new Set(uploadedGarments.map(g => g.category));
  const categoryBonus = categories.size * 12;
  const baseSynergy = Math.min(99, 45 + count * 15 + categoryBonus);

  if (scoreWrap) scoreWrap.style.display = 'flex';
  if (progressFill) progressFill.style.width = `${baseSynergy}%`;
  if (scoreNum) scoreNum.innerText = `${baseSynergy}% Synergy`;

  // Determine Smart Suggestions based on detected attributes
  const catList = uploadedGarments.map(g => g.category);
  const colorNames = uploadedGarments.map(g => g.color.name).join(' ');

  const hasOuterwear = catList.includes('Outerwear');
  const hasSkirtOrDress = catList.includes('Skirt / Dress');
  const hasBlazer = catList.includes('Tailored Blazer');
  const isEarthToned = colorNames.includes('Camel') || colorNames.includes('Sand') || colorNames.includes('Chocolate') || colorNames.includes('Ivory');
  const isJewelOrSilk = colorNames.includes('Terracotta') || colorNames.includes('Emerald') || colorNames.includes('Rose') || hasSkirtOrDress;

  let recOccasion = 'Work';
  let recWeather = 'Sunny';
  let recStyle = 'Minimalist';
  let recComfort = 'Balanced';
  let rationale = '';

  if (hasSkirtOrDress || isJewelOrSilk) {
    recOccasion = 'Gala';
    recWeather = 'Sunny';
    recStyle = 'Avant-garde';
    recComfort = 'Structured';
    rationale = 'Luminous fluid textures & evening drape detected. Ideal for modern gallery or gala occasions.';
  } else if (hasOuterwear && isEarthToned) {
    recOccasion = 'Work';
    recWeather = 'Autumn';
    recStyle = 'Quiet Luxury';
    recComfort = 'Balanced';
    rationale = 'Camel longline outerwear and warm earth tones create effortless autumn boardroom-to-dinner luxury.';
  } else if (hasBlazer) {
    recOccasion = 'Work';
    recWeather = 'Sunny';
    recStyle = 'Classic';
    recComfort = 'Balanced';
    rationale = 'Structured tailoring detected. Balanced proportion for professional corporate styling.';
  } else {
    recOccasion = 'Casual';
    recWeather = 'Sunny';
    recStyle = 'Minimalist';
    recComfort = 'Ultra Relaxed';
    rationale = 'Versatile essential detected. Perfect for relaxed off-duty minimalism.';
  }

  const garmentSummary = uploadedGarments.map(g => g.name).slice(0, 2).join(' + ');

  if (suggestionContainer) {
    suggestionContainer.innerHTML = `
      <div class="ai-suggestion-banner">
        <div class="ai-suggestion-info">
          <div class="ai-suggestion-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            STYLO AI Smart Context Detected (${garmentSummary})
          </div>
          <div class="ai-suggestion-text">
            ${rationale} Recommended context: <strong>${recOccasion}</strong> • <strong>${recWeather}</strong> • <strong>${recStyle}</strong>
          </div>
        </div>
        <button type="button" class="ai-autofill-btn" onclick="applyAiContextSuggestions('${recOccasion}', '${recWeather}', '${recStyle}', '${recComfort}')">
          ✨ Auto-Fill Suggested Context
        </button>
      </div>
    `;
  }
}

window.applyAiContextSuggestions = function(occ, weather, style, comfort) {
  // 1. Studio Select Dropdowns
  const selectOcc = document.getElementById('filterOccasion');
  const selectWeather = document.getElementById('filterWeather');
  const selectStyle = document.getElementById('filterStyle');
  const selectComfort = document.getElementById('filterComfort');

  if (selectOcc) selectOcc.value = occ;
  if (selectWeather) selectWeather.value = weather;
  if (selectStyle) selectStyle.value = style;
  if (selectComfort) selectComfort.value = comfort;

  // Add highlight pulse
  [selectOcc, selectWeather, selectStyle, selectComfort].forEach(el => {
    if (el) {
      el.classList.add('field-pulse-active');
      setTimeout(() => el.classList.remove('field-pulse-active'), 1500);
    }
  });

  // 2. QuickStyle Hero Radios if present
  const quickForm = document.getElementById('quickStyleForm');
  if (quickForm) {
    const rOcc = quickForm.querySelector(`input[name="occasion"][value="${occ}"]`);
    const rWeather = quickForm.querySelector(`input[name="weather"][value="${weather}"]`);
    const rStyle = quickForm.querySelector(`input[name="style"][value="${style}"]`);
    if (rOcc) rOcc.checked = true;
    if (rWeather) rWeather.checked = true;
    if (rStyle) rStyle.checked = true;
  }

  showToast(`✨ Auto-filled: ${occ} • ${weather} • ${style} • ${comfort}`);
};

/* ==========================================================================
   7. LOOKBOOK RESULT MODAL & DYNAMIC COMPOSITION
   ========================================================================== */
function initLookbookModal() {
  const overlay = document.getElementById('lookbookModalOverlay');
  const closeBtn = document.getElementById('lookbookCloseBtn');

  window.closeLookbook = function() {
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', window.closeLookbook);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) window.closeLookbook();
  });
}

function showLookbookResult(params, apiResult = null) {
  const overlay = document.getElementById('lookbookModalOverlay');
  const content = document.getElementById('lookbookModalContent');
  if (!overlay || !content) return;

  const outfits = {
    'Work': {
      title: 'Architectural Tailored Capsule',
      img: 'assets/hero-couple.png',
      items: [
        { tag: 'Core Outerwear', name: 'Sand Double-Breasted Wool Blazer', tip: 'Unbuttoned for modern ease' },
        { tag: 'Base Layer', name: 'Silk-Blend Ribbed Knit Crew', tip: 'Tucked neatly into high-waist trousers' },
        { tag: 'Bottom', name: 'Pleated Wide-Leg Crepe Trousers', tip: 'Creates elongated streamlined proportion' },
        { tag: 'Footwear', name: 'Chunky Leather Loafers', tip: 'Grounds the tailored silhouette' }
      ],
      looks: [
        { num: '01', name: 'Corporate Meeting', formula: 'Tailored trench + crisp poplin shirt + crepe trousers' },
        { num: '02', name: 'Client Luncheon', formula: 'Draped trench + ribbed turtleneck + cigarette pants' },
        { num: '03', name: 'Gallery Opening', formula: 'Cinched trench + monochrome slip dress + gold ear cuffs' },
        { num: '04', name: 'Travel & Commute', formula: 'Unstructured wrap + cashmere hoodie + tailored track trousers' },
        { num: '05', name: 'Smart Casual Friday', formula: 'Layered over crewneck + raw selvedge denim + Chelsea boots' }
      ],
      missingPiece: { name: 'Pleated High-Rise Crepe Trousers', price: 165.00, img: 'assets/get-look-pleats.jpg' },
      harmony: 98,
      advice: 'The sand and taupe tones perfectly balance professionalism with effortless luxury.'
    },
    'Casual': {
      title: 'Elevated Everyday Capsule',
      img: 'assets/step3-outfits.png',
      items: [
        { tag: 'Outerwear', name: 'Oversized Khaki Trench Coat', tip: 'Draped loosely over shoulders' },
        { tag: 'Top', name: 'Heavyweight Crisp White Poplin Shirt', tip: 'Collar popped with rolled cuffs' },
        { tag: 'Pants', name: 'Straight Tapered Chinos', tip: 'Tailored ankle break for casual movement' },
        { tag: 'Accent', name: 'Leather Crossbody & Canvas Runners', tip: 'Refined weekend utility' }
      ],
      looks: [
        { num: '01', name: 'Coffee & Market', formula: 'Open trench + heavy cotton tee + relaxed chinos + retro runners' },
        { num: '02', name: 'Boutique Tour', formula: 'Buttoned collar up + crossbody bag + dark wash denim' },
        { num: '03', name: 'Sunday Brunch', formula: 'Over soft knit sweater + pleated midi skirt + clean sneakers' },
        { num: '04', name: 'Museum Visit', formula: 'Belted trench + mock-neck knit + relaxed trousers + tote' },
        { num: '05', name: 'Evening Walk', formula: 'Loose drape + ribbed cashmere wrap + combat leather boots' }
      ],
      missingPiece: { name: 'Heavyweight Poplin Boy-Shirt', price: 110.00, img: 'assets/fabric-texture.jpg' },
      harmony: 95,
      advice: 'Utilizes your staple trench coat to instantly elevate basic denim or chinos.'
    },
    'Gala': {
      title: 'Monochromatic Modern Evening',
      img: 'assets/get-look-pleats.jpg',
      items: [
        { tag: 'Statement Piece', name: 'Pleated Accordion Chocolate Gown', tip: 'Cinched with tonal leather belt' },
        { tag: 'Layer', name: 'Cashmere Evening Wrap', tip: 'Warmth without concealing the silhouette' },
        { tag: 'Jewelry', name: 'Sculptural Gold Ear Cuffs', tip: 'Minimalist statement accents' },
        { tag: 'Footwear', name: 'Architectural Kitten Heel Mules', tip: 'Graceful posture and long lines' }
      ],
      looks: [
        { num: '01', name: 'Black-Tie Gala', formula: 'Floor-length accordion folds + gold sculptural cuff + satin clutch' },
        { num: '02', name: 'Opera Opening', formula: 'Layered tuxedo cape + architectural pearl ear cuffs + pointed pumps' },
        { num: '03', name: 'Cocktail Vernissage', formula: 'Pleated separate skirt + silk blouse + geometric clutch' },
        { num: '04', name: 'Private Dinner', formula: 'Cashmere wrap + silk camisole + wide pleated palazzo pants' },
        { num: '05', name: 'Charity Benefit', formula: 'Cinched metallic waist wrap + sleek chignon hair styling' }
      ],
      missingPiece: { name: 'Sculptural Brass Wave Ear Cuffs', price: 95.00, img: 'assets/fabric-texture.jpg' },
      harmony: 99,
      advice: 'Rich accordion folds catch evening lighting with breathtaking fluidity.'
    }
  };

  const selected = outfits[params.occasion] || outfits['Work'];

  // Check if user uploaded garments to integrate into the look
  let heroImage = selected.img;
  let userItemBadgeHtml = '';
  let itemsList = [...selected.items];
  let harmonyScore = selected.harmony;

  if (uploadedGarments.length > 0) {
    const heroGarment = uploadedGarments[0];
    heroImage = heroGarment.src;
    harmonyScore = Math.min(99, 90 + uploadedGarments.length * 3);

    userItemBadgeHtml = `
      <div style="background: rgba(0,206,209,0.1); border: 1px solid var(--color-cyan); padding: 0.6rem 0.9rem; border-radius: var(--radius-sm); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.6rem;">
        <span class="color-swatch" style="background-color: ${heroGarment.color.hex};"></span>
        <span style="font-size: 0.85rem; color: #111;">
          <strong>Detected Closet Anchor:</strong> ${heroGarment.name} (${heroGarment.category})
        </span>
      </div>
    `;

    // Replace the first item with user's detected piece
    itemsList[0] = {
      tag: `Your Piece • ${heroGarment.category}`,
      name: heroGarment.name,
      tip: `Color: ${heroGarment.color.name} (${heroGarment.tags.join(', ')})`
    };
  }

  // Missing piece recommendation based on budget
  const userBudget = Number(params.budget) || 350;
  const missingPiece = selected.missingPiece;
  const missingPiecePrice = Math.min(missingPiece.price, Math.round(userBudget * 0.6));

  content.innerHTML = `
    <span class="lookbook-badge">AI Style Match • ${params.style} • ${params.occasion}</span>
    <h2 class="modal-title font-serif" style="text-align: left; font-size: 2.2rem; margin-bottom: 0.35rem;">${selected.title}</h2>
    <p style="font-size: 0.9rem; color: #555; margin-bottom: 1.25rem;">
      Algorithmically tailored for <strong>${params.weather}</strong> conditions within budget guide: <strong>$${userBudget}</strong>
    </p>

    ${userItemBadgeHtml}

    <div class="lookbook-results-grid">
      <div class="lookbook-preview-card">
        <img src="${heroImage}" alt="${selected.title}" class="lookbook-img" />
      </div>

      <div class="lookbook-details">
        <div class="harmony-score-box">
          <div class="harmony-score-val">${harmonyScore}% Wardrobe Synergy</div>
          <div class="harmony-score-label">${selected.advice}</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.6rem;">
          ${itemsList.map(item => `
            <div class="lookbook-item-row">
              <div class="lookbook-item-tag">${item.tag}</div>
              <div class="lookbook-item-title">${item.name}</div>
              <div class="lookbook-item-tip">${item.tip}</div>
            </div>
          `).join('')}
        </div>

        <!-- 1 Item, 5 Looks Versatility Guide -->
        <div>
          <div class="lookbook-5looks-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            1 Item, 5 Looks Versatility Guide
          </div>
          <div class="lookbook-5looks-list">
            ${selected.looks.map(l => `
              <div class="look-formula-item">
                <span class="look-formula-num">LOOK ${l.num}</span>
                <span class="look-formula-text"><strong>${l.name}:</strong> ${l.formula}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Missing Piece Match Within Budget -->
        <div class="lookbook-budget-match">
          <div class="budget-match-info">
            <span class="budget-match-tag">Suggested Missing Piece</span>
            <span class="budget-match-name">${missingPiece.name}</span>
            <span class="budget-match-price">$${missingPiecePrice.toFixed(2)}</span>
          </div>
          <button type="button" class="budget-match-btn" onclick="addCustomItemToCart('${missingPiece.name}', ${missingPiecePrice}, '${missingPiece.img}')">
            + Add to Cart
          </button>
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
      <button type="button" class="btn-primary" onclick="showToast('Look saved to your STYLO Vault!'); window.closeLookbook();" style="flex: 1;">
        Save Look to Vault
      </button>
      <button type="button" class="btn-outline" onclick="window.closeLookbook(); window.openCart();" style="flex: 1;">
        Open Shopping Cart
      </button>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

window.addCustomItemToCart = function(title, price, img) {
  cartItems.push({
    title,
    price: Number(price),
    qty: 1,
    img: img || 'assets/get-look-pleats.jpg'
  });
  showToast(`Added "${title}" to cart!`);
  renderCart();
  window.closeLookbook();
  window.openCart();
};

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
