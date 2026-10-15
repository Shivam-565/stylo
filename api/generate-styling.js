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

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const payload = req.body || {};
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

  res.status(200).json({
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
  });
};
