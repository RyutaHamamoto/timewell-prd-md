const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = 'REDACTED_KEY_PATH';
const PROJECT_ID = 'REDACTED_PROJECT_ID';
const MODEL_ID = 'gemini-3-pro-image-preview';
const GLOBAL_ENDPOINT = 'aiplatform.googleapis.com';
const OUTPUT_PATH = '/Users/hamamotoryuuta/Documents/timewell-prd-md/output/workspace/v3-slides/slide-08-cta.png';

const BRAND = {
  primary: '#FF6B9D',
  secondary: '#FF9472',
};

const prompt = `Create a professional presentation slide.

Design Requirements:
- Clean, minimal, premium aesthetic
- Glassmorphism: 85% opacity white cards, heavy background blur
- NO borders, NO shadows - cards melt into background
- Rounded corners: 24px or larger (soft, melting into background)
- Color palette: ONLY ${BRAND.primary} (pink) and ${BRAND.secondary} (orange) gradient
- Typography: Clean sans-serif, generous whitespace
- Format: 16:9 aspect ratio (1920x1080px)
- All Japanese text must be rendered clearly and sharp

CTA (Call to Action) SLIDE:
- Background: White with 8% gradient overlay (NOT full gradient - this is content slide)
- Center: Large glassmorphism card with centered content

Card content:
- Title: "まずは無料でお試しください" - 28pt bold dark
- Subtitle: "14日間のフルトライアルで効果を実感" - 14pt gray

Two buttons side by side:
- Button 1 (primary): "無料相談" - gradient background, white text, pill shape
- Button 2 (secondary): "14日間トライアル" - 10% pink background, ${BRAND.primary} text, pill shape

- URL: "https://timewell.jp/zerock" - 16pt ${BRAND.primary} bold
- Company: "株式会社TIMEWELL" - 12pt gray

Card: 95% white opacity, NO borders, NO shadows, 32px corners
Buttons: 30px border-radius (pill shape)
Overall: inviting, professional, clean minimal design
DO NOT include any product mockups, phones, or device images`;

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  const client = await auth.getClient();
  return (await client.getAccessToken()).token;
}

async function generateCTA() {
  console.log('Regenerating CTA slide...');

  const accessToken = await getAccessToken();
  const endpoint = `https://${GLOBAL_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/${MODEL_ID}:generateContent`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{ role: 'USER', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        temperature: 1.0
      }
    })
  });

  if (!response.ok) {
    throw new Error(`API Error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();

  for (const part of data.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData?.mimeType?.startsWith('image/')) {
      await fs.promises.writeFile(OUTPUT_PATH, Buffer.from(part.inlineData.data, 'base64'));
      console.log('✅ CTA slide regenerated:', OUTPUT_PATH);
      return;
    }
  }

  throw new Error('No image in response');
}

generateCTA().catch(console.error);
