import sharp from 'sharp';
import fs from 'fs';

async function replaceRightSidePhotoWithRealMama() {
  // 1. Extract Real Mama Photo from original uploaded poster
  const mamaHighRes = await sharp('public/standard-naukri-mahotsav-2026.jpeg')
    .extract({ left: 1105, top: 540, width: 386, height: 515 })
    .toBuffer();

  fs.writeFileSync('public/real-mama-photo.png', mamaHighRes);

  // Restore pristine base images from git first so we don't pile edits
  // --- 2. Desktop Banner (2082 x 907) ---
  {
    const DW = 2082;
    const DH = 907;

    // Clean background gradient covering the old person area entirely (x: 1580..2082, y: 340..850)
    const bgPatch = Buffer.from(`
      <svg width="510" height="515" viewBox="0 0 510 515" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradD" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8ed" />
            <stop offset="30%" stop-color="#ffedd5" />
            <stop offset="100%" stop-color="#fed7aa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="510" height="515" fill="url(#bgGradD)" />
      </svg>
    `);

    const targetH = 505;
    const mamaDesktop = await sharp(mamaHighRes)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaDesktop).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    const posX = DW - mW;
    const posY = 850 - mH;

    const orig = fs.readFileSync('public/rojgar-melava-hero-desktop.jpeg');
    const out = await sharp(orig)
      .composite([
        {
          input: bgPatch,
          left: DW - 510,
          top: 335
        },
        {
          input: mamaDesktop,
          left: posX,
          top: posY
        }
      ])
      .jpeg({ quality: 98 })
      .toBuffer();

    fs.writeFileSync('public/rojgar-melava-hero-desktop.jpeg', out);
    console.log('Desktop banner updated');
  }

  // --- 3. Tablet Horizontal Banner (1368 x 776) ---
  {
    const TW = 1368;
    const TH = 776;

    const bgPatch = Buffer.from(`
      <svg width="390" height="440" viewBox="0 0 390 440" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradTH" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8ed" />
            <stop offset="30%" stop-color="#ffedd5" />
            <stop offset="100%" stop-color="#fed7aa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="390" height="440" fill="url(#bgGradTH)" />
      </svg>
    `);

    const targetH = 430;
    const mamaTabH = await sharp(mamaHighRes)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaTabH).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    const posX = TW - mW;
    const posY = 720 - mH;

    const orig = fs.readFileSync('public/rojgar-melava-hero-tablet-horizontal.jpeg');
    const out = await sharp(orig)
      .composite([
        {
          input: bgPatch,
          left: TW - 390,
          top: 280
        },
        {
          input: mamaTabH,
          left: posX,
          top: posY
        }
      ])
      .jpeg({ quality: 98 })
      .toBuffer();

    fs.writeFileSync('public/rojgar-melava-hero-tablet-horizontal.jpeg', out);
    console.log('Tablet horizontal banner updated');
  }

  // --- 4. Tablet Vertical Banner (875 x 1049) ---
  {
    const TW = 875;
    const TH = 1049;

    const bgPatch = Buffer.from(`
      <svg width="330" height="390" viewBox="0 0 330 390" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradTV" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8ed" />
            <stop offset="30%" stop-color="#ffedd5" />
            <stop offset="100%" stop-color="#fed7aa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="330" height="390" fill="url(#bgGradTV)" />
      </svg>
    `);

    const targetH = 370;
    const mamaTabV = await sharp(mamaHighRes)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaTabV).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    const posX = TW - mW;
    const posY = 955 - mH;

    const orig = fs.readFileSync('public/rojgar-melava-hero-tablet.jpeg');
    const out = await sharp(orig)
      .composite([
        {
          input: bgPatch,
          left: TW - 330,
          top: 565
        },
        {
          input: mamaTabV,
          left: posX,
          top: posY
        }
      ])
      .jpeg({ quality: 98 })
      .toBuffer();

    fs.writeFileSync('public/rojgar-melava-hero-tablet.jpeg', out);
    console.log('Tablet vertical banner updated');
  }

  // --- 5. Mobile Banner (704 x 1274) ---
  {
    const MW = 704;
    const MH = 1274;

    const bgPatch = Buffer.from(`
      <svg width="310" height="400" viewBox="0 0 310 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradM" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8ed" />
            <stop offset="30%" stop-color="#ffedd5" />
            <stop offset="100%" stop-color="#fed7aa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="310" height="400" fill="url(#bgGradM)" />
      </svg>
    `);

    const targetH = 380;
    const mamaMob = await sharp(mamaHighRes)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaMob).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    const posX = MW - mW;
    const posY = 1180 - mH;

    const orig = fs.readFileSync('public/rojgar-melava-hero-mobile.jpeg');
    const out = await sharp(orig)
      .composite([
        {
          input: bgPatch,
          left: MW - 310,
          top: 780
        },
        {
          input: mamaMob,
          left: posX,
          top: posY
        }
      ])
      .jpeg({ quality: 98 })
      .toBuffer();

    fs.writeFileSync('public/rojgar-melava-hero-mobile.jpeg', out);
    console.log('Mobile banner updated');
  }

  console.log('Done!');
}

replaceRightSidePhotoWithRealMama();
