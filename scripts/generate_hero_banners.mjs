import sharp from 'sharp';
import fs from 'fs';

async function generateAllHeroBanners() {
  // --- 1. Crop pure Mama portrait and create soft-blended edges ---
  const { data, info } = await sharp('public/standard-naukri-mahotsav-2026.jpeg')
    .extract({ left: 1110, top: 540, width: 381, height: 515 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const W = info.width;
  const H = info.height;
  const rgba = Buffer.alloc(W * H * 4);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 3;
      const outIdx = (y * W + x) * 4;

      rgba[outIdx] = data[idx];
      rgba[outIdx + 1] = data[idx + 1];
      rgba[outIdx + 2] = data[idx + 2];

      // Soft feather on left edge and top edge for natural integration
      let alpha = 255;
      if (x < 35) {
        alpha = Math.min(alpha, Math.round(255 * (x / 35)));
      }
      if (y < 25) {
        alpha = Math.min(alpha, Math.round(255 * (y / 25)));
      }

      rgba[outIdx + 3] = alpha;
    }
  }

  const mamaPure = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toBuffer();

  fs.writeFileSync('public/mama_real_photo.png', mamaPure);

  // --- 2. Desktop Banner (2082 x 907) ---
  {
    const DW = 2082;
    const DH = 907;

    const targetH = 510;
    const mamaDesktop = await sharp(mamaPure)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaDesktop).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    // Full white bottom name card covering old text
    const nameBadge = Buffer.from(`
      <svg width="580" height="115" viewBox="0 0 580 115" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="580" height="115" fill="#ffffff" />
        <text x="290" y="44" font-family="'Mukta', 'Poppins', sans-serif" font-size="32" font-weight="900" fill="#b91c1c" text-anchor="middle">
          मा. संजय देशमुख
        </text>
        <text x="290" y="74" font-family="'Mukta', 'Poppins', sans-serif" font-size="18" font-weight="700" fill="#ea580c" text-anchor="middle">
          खासदार यवतमाळ - वाशिम लोकसभा
        </text>
        <text x="290" y="98" font-family="'Mukta', 'Poppins', sans-serif" font-size="14" font-weight="700" fill="#374151" text-anchor="middle">
          आपला माणूस आपल्यासाठी
        </text>
      </svg>
    `);

    // Clean background gradient covering old person area
    const bgPatch = Buffer.from(`
      <svg width="520" height="520" viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradD" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8ed" />
            <stop offset="40%" stop-color="#ffedd5" />
            <stop offset="100%" stop-color="#fed7aa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="520" height="520" fill="url(#bgGradD)" />
      </svg>
    `);

    const origBuf = fs.readFileSync('public/rojgar-melava-hero-desktop-test.jpeg');
    await sharp(origBuf)
      .composite([
        {
          input: bgPatch,
          left: DW - 520,
          top: 300
        },
        {
          input: mamaDesktop,
          left: DW - mW,
          top: DH - mH - 105
        },
        {
          input: nameBadge,
          left: DW - 580,
          top: DH - 115
        }
      ])
      .jpeg({ quality: 96 })
      .toFile('public/rojgar-melava-hero-desktop-sanjay.jpeg');

    console.log('Desktop banner generated');
  }

  // --- 3. Tablet Horizontal Banner (1368 x 776) ---
  {
    const TW = 1368;
    const TH = 776;

    const targetH = 440;
    const mamaTabH = await sharp(mamaPure)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaTabH).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    const nameBadge = Buffer.from(`
      <svg width="420" height="100" viewBox="0 0 420 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="420" height="100" fill="#ffffff" />
        <text x="210" y="38" font-family="'Mukta', 'Poppins', sans-serif" font-size="26" font-weight="900" fill="#b91c1c" text-anchor="middle">
          मा. संजय देशमुख
        </text>
        <text x="210" y="64" font-family="'Mukta', 'Poppins', sans-serif" font-size="15" font-weight="700" fill="#ea580c" text-anchor="middle">
          खासदार यवतमाळ - वाशिम लोकसभा
        </text>
        <text x="210" y="86" font-family="'Mukta', 'Poppins', sans-serif" font-size="12" font-weight="700" fill="#374151" text-anchor="middle">
          आपला माणूस आपल्यासाठी
        </text>
      </svg>
    `);

    const bgPatch = Buffer.from(`
      <svg width="380" height="460" viewBox="0 0 380 460" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradTH" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8ed" />
            <stop offset="40%" stop-color="#ffedd5" />
            <stop offset="100%" stop-color="#fed7aa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="380" height="460" fill="url(#bgGradTH)" />
      </svg>
    `);

    const origBuf = fs.readFileSync('public/rojgar-melava-hero-tablet-horizontal.jpeg');
    await sharp(origBuf)
      .composite([
        {
          input: bgPatch,
          left: TW - 380,
          top: 240
        },
        {
          input: mamaTabH,
          left: TW - mW,
          top: TH - mH - 95
        },
        {
          input: nameBadge,
          left: TW - 420,
          top: TH - 100
        }
      ])
      .jpeg({ quality: 96 })
      .toFile('public/rojgar-melava-hero-tablet-horizontal-sanjay.jpeg');

    console.log('Tablet horizontal banner generated');
  }

  // --- 4. Tablet Vertical Banner (875 x 1049) ---
  {
    const TW = 875;
    const TH = 1049;

    const targetH = 390;
    const mamaTabV = await sharp(mamaPure)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaTabV).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    const nameBadge = Buffer.from(`
      <svg width="360" height="95" viewBox="0 0 360 95" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="360" height="95" fill="#ffffff" />
        <text x="180" y="34" font-family="'Mukta', 'Poppins', sans-serif" font-size="23" font-weight="900" fill="#b91c1c" text-anchor="middle">
          मा. संजय देशमुख
        </text>
        <text x="180" y="58" font-family="'Mukta', 'Poppins', sans-serif" font-size="14" font-weight="700" fill="#ea580c" text-anchor="middle">
          खासदार यवतमाळ - वाशिम लोकसभा
        </text>
        <text x="180" y="78" font-family="'Mukta', 'Poppins', sans-serif" font-size="11" font-weight="700" fill="#374151" text-anchor="middle">
          आपला माणूस आपल्यासाठी
        </text>
      </svg>
    `);

    const bgPatch = Buffer.from(`
      <svg width="330" height="420" viewBox="0 0 330 420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradTV" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8ed" />
            <stop offset="40%" stop-color="#ffedd5" />
            <stop offset="100%" stop-color="#fed7aa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="330" height="420" fill="url(#bgGradTV)" />
      </svg>
    `);

    const origBuf = fs.readFileSync('public/rojgar-melava-hero-tablet.jpeg');
    await sharp(origBuf)
      .composite([
        {
          input: bgPatch,
          left: TW - 330,
          top: 560
        },
        {
          input: mamaTabV,
          left: TW - mW,
          top: TH - mH - 90
        },
        {
          input: nameBadge,
          left: TW - 360,
          top: TH - 95
        }
      ])
      .jpeg({ quality: 96 })
      .toFile('public/rojgar-melava-hero-tablet-sanjay.jpeg');

    console.log('Tablet vertical banner generated');
  }

  // --- 5. Mobile Banner (704 x 1274) ---
  {
    const MW = 704;
    const MH = 1274;

    const targetH = 340;
    const mamaMob = await sharp(mamaPure)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaMob).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    const nameBadge = Buffer.from(`
      <svg width="320" height="90" viewBox="0 0 320 90" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="320" height="90" fill="#ffffff" />
        <text x="160" y="32" font-family="'Mukta', 'Poppins', sans-serif" font-size="21" font-weight="900" fill="#b91c1c" text-anchor="middle">
          मा. संजय देशमुख
        </text>
        <text x="160" y="55" font-family="'Mukta', 'Poppins', sans-serif" font-size="13" font-weight="700" fill="#ea580c" text-anchor="middle">
          खासदार यवतमाळ - वाशिम लोकसभा
        </text>
        <text x="160" y="74" font-family="'Mukta', 'Poppins', sans-serif" font-size="11" font-weight="700" fill="#374151" text-anchor="middle">
          आपला माणूस आपल्यासाठी
        </text>
      </svg>
    `);

    const bgPatch = Buffer.from(`
      <svg width="300" height="380" viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradM" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8ed" />
            <stop offset="40%" stop-color="#ffedd5" />
            <stop offset="100%" stop-color="#fed7aa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="300" height="380" fill="url(#bgGradM)" />
      </svg>
    `);

    const origBuf = fs.readFileSync('public/rojgar-melava-hero-mobile.jpeg');
    await sharp(origBuf)
      .composite([
        {
          input: bgPatch,
          left: MW - 300,
          top: 830
        },
        {
          input: mamaMob,
          left: MW - mW,
          top: MH - mH - 85
        },
        {
          input: nameBadge,
          left: MW - 320,
          top: MH - 90
        }
      ])
      .jpeg({ quality: 96 })
      .toFile('public/rojgar-melava-hero-mobile-sanjay.jpeg');

    console.log('Mobile banner generated');
  }

  console.log('All 4 hero banners generated with seamless blending!');
}

generateAllHeroBanners();
