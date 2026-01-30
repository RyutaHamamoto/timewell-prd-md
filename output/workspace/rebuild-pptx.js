const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SLIDES_DIR = '/Users/hamamotoryuuta/Documents/timewell-prd-md/output/workspace/v3-slides';
const OUTPUT_PATH = '/Users/hamamotoryuuta/Documents/timewell-prd-md/output/workspace/ZEROCK-NanoBananaPro-v3.pptx';

const slideFiles = [
  'slide-01-cover.png',
  'slide-02-problem.png',
  'slide-03-solution.png',
  'slide-04-feature1.png',
  'slide-05-feature2.png',
  'slide-06-results.png',
  'slide-07-pricing.png',
  'slide-08-cta.png'
];

async function addImagePreserveAspect(slide, imagePath, x, y, maxWidth, maxHeight) {
  const metadata = await sharp(imagePath).metadata();
  const aspectRatio = metadata.width / metadata.height;
  let width = maxWidth;
  let height = width / aspectRatio;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  slide.addImage({ path: imagePath, x, y, w: width, h: height });
}

async function rebuild() {
  console.log('Rebuilding PPTX...');

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'ZEROCK - 社内情報検索AI';
  pptx.author = 'TIMEWELL Inc.';
  pptx.company = '株式会社TIMEWELL';

  for (let i = 0; i < slideFiles.length; i++) {
    const imgPath = path.join(SLIDES_DIR, slideFiles[i]);
    const slide = pptx.addSlide();

    if (fs.existsSync(imgPath)) {
      await addImagePreserveAspect(slide, imgPath, 0, 0, 10, 5.625);
      console.log(`✅ Added: ${slideFiles[i]}`);
    }

    // Page numbers (slides 2-8)
    if (i > 0) {
      slide.addText(`${i + 1}`, {
        x: 9.3, y: 5.2, w: 0.5, h: 0.3,
        fontSize: 10, color: '888888', align: 'right'
      });
    }
  }

  await pptx.writeFile({ fileName: OUTPUT_PATH });
  console.log(`\n✅ PPTX rebuilt: ${OUTPUT_PATH}`);
}

rebuild().catch(console.error);
