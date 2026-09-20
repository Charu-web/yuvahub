import sharp from 'sharp';
import fs from 'fs';

async function replaceRightPhoto() {
  // 1. Extract the exact Real Mama photo from the uploaded poster
  // Bounding box in poster (1491x1055): left: 1105, top: 540, width: 386, height: 515
  const mamaRaw = await sharp('public/standard-naukri-mahotsav-2026.jpeg')
    .extract({ left: 1105, top: 540, width: 386, height: 515 })
    .toBuffer();

  // Save the real Mama photo asset in public directory
  fs.writeFileSync('public/mama-photo-real.png', mamaRaw);
  console.log('Saved public/mama-photo-real.png');

  // --- 2. Desktop Banner (2082 x 907) ---
  {
    const DW = 2082;
    const DH = 907;
    // Old photo on right sits between x: 1610..2082 and y: 340..850 (above the white bottom text strip at y: 850)
    const targetH = 505;
    const mamaDesktop = await sharp(mamaRaw)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaDesktop).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    // Position Mama exactly where the old right-side person was
    const posX = DW - mW - 20; // ~1680
    const posY = 850 - mH;     // ~345

    const orig = fs.readFileSync('public/rojgar-melava-hero-desktop.jpeg');
    const out = await sharp(orig)
      .composite([
        {
          input: mamaDesktop,
          left: posX,
          top: posY
        }
      ])
      .jpeg({ quality: 98 })
      .toBuffer();

    fs.writeFileSync('public/rojgar-melava-hero-desktop.jpeg', out);
    console.log('Desktop banner updated with real Mama photo');
  }

  // --- 3. Tablet Horizontal Banner (1368 x 776) ---
  {
    const TW = 1368;
    const TH = 776;
    // White bottom strip starts around y: 720
    const targetH = 415;
    const mamaTabH = await sharp(mamaRaw)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaTabH).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    const posX = TW - mW - 15;
    const posY = 720 - mH;

    const orig = fs.readFileSync('public/rojgar-melava-hero-tablet-horizontal.jpeg');
    const out = await sharp(orig)
      .composite([
        {
          input: mamaTabH,
          left: posX,
          top: posY
        }
      ])
      .jpeg({ quality: 98 })
      .toBuffer();

    fs.writeFileSync('public/rojgar-melava-hero-tablet-horizontal.jpeg', out);
    console.log('Tablet horizontal banner updated with real Mama photo');
  }

  // --- 4. Tablet Vertical Banner (875 x 1049) ---
  {
    const TW = 875;
    const TH = 1049;
    // White bottom strip starts around y: 955
    const targetH = 345;
    const mamaTabV = await sharp(mamaRaw)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaTabV).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    const posX = TW - mW - 10;
    const posY = 955 - mH;

    const orig = fs.readFileSync('public/rojgar-melava-hero-tablet.jpeg');
    const out = await sharp(orig)
      .composite([
        {
          input: mamaTabV,
          left: posX,
          top: posY
        }
      ])
      .jpeg({ quality: 98 })
      .toBuffer();

    fs.writeFileSync('public/rojgar-melava-hero-tablet.jpeg', out);
    console.log('Tablet vertical banner updated with real Mama photo');
  }

  // --- 5. Mobile Banner (704 x 1274) ---
  {
    const MW = 704;
    const MH = 1274;
    // White bottom strip starts around y: 1180
    const targetH = 370;
    const mamaMob = await sharp(mamaRaw)
      .resize({ height: targetH, fit: 'contain' })
      .toBuffer();

    const mamaMeta = await sharp(mamaMob).metadata();
    const mW = mamaMeta.width;
    const mH = mamaMeta.height;

    const posX = MW - mW - 8;
    const posY = 1180 - mH;

    const orig = fs.readFileSync('public/rojgar-melava-hero-mobile.jpeg');
    const out = await sharp(orig)
      .composite([
        {
          input: mamaMob,
          left: posX,
          top: posY
        }
      ])
      .jpeg({ quality: 98 })
      .toBuffer();

    fs.writeFileSync('public/rojgar-melava-hero-mobile.jpeg', out);
    console.log('Mobile banner updated with real Mama photo');
  }

  console.log('Done: All banners now have the real Mama photo in place of the old right-side photo!');
}

replaceRightPhoto();
