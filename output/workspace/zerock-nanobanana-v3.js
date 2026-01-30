/**
 * ZEROCK Presentation with Nano Banana Pro (Gemini 3 Pro Image)
 *
 * Updated: 40秒待機、Apple iOS風デザイン、グラスモーフィズム
 */

const { GoogleAuth } = require('google-auth-library');
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const CREDENTIALS_PATH = 'REDACTED_KEY_PATH';
const PROJECT_ID = 'REDACTED_PROJECT_ID';
const WORKSPACE = __dirname;
const SLIDES_DIR = path.join(WORKSPACE, 'v3-slides');

// Gemini 3 Pro Image - Global endpoint
const MODEL_ID = 'gemini-3-pro-image-preview';
const GLOBAL_ENDPOINT = 'aiplatform.googleapis.com';

// Rate limiting settings (Tier 2: 50 IPM)
const RATE_LIMIT = {
  normalWait: 30000,      // 30秒待機（Tier 2用）
  rateLimitWait: 60000,   // レート制限時は60秒
  maxRetries: 5
};

// Brand colors
const BRAND = {
  name: 'ZEROCK',
  primary: '#FF6B9D',
  secondary: '#FF9472',
  company: 'TIMEWELL'
};

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

/**
 * Gemini 3 Pro Image APIで画像を生成
 */
async function generateSlide(prompt, outputPath) {
  for (let attempt = 1; attempt <= RATE_LIMIT.maxRetries; attempt++) {
    try {
      const accessToken = await getAccessToken();
      const endpoint = `https://${GLOBAL_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/${MODEL_ID}:generateContent`;

      const requestBody = {
        contents: [{
          role: 'USER',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: 1.0,
          topP: 0.95
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
        ]
      };

      console.log(`  Attempt ${attempt}/${RATE_LIMIT.maxRetries}...`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 429) {
        console.log(`  Rate limited. Waiting ${RATE_LIMIT.rateLimitWait / 1000}s...`);
        await new Promise(r => setTimeout(r, RATE_LIMIT.rateLimitWait));
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData?.mimeType?.startsWith('image/')) {
            const imageData = part.inlineData.data;
            const buffer = Buffer.from(imageData, 'base64');
            await fs.promises.writeFile(outputPath, buffer);
            console.log(`  ✅ Generated: ${path.basename(outputPath)}`);
            return outputPath;
          }
        }
      }

      throw new Error('No image in response');
    } catch (error) {
      console.log(`  ❌ Attempt ${attempt}: ${error.message}`);
      if (attempt === RATE_LIMIT.maxRetries) return null;
      await new Promise(r => setTimeout(r, 10000));
    }
  }
  return null;
}

/**
 * スライドプロンプト定義（Apple iOS風デザイン、グラスモーフィズム）
 */
function getSlidePrompts() {
  // Clean minimal + Glassmorphism design system
  const designSystem = `
Design Requirements:
- Clean, minimal, premium aesthetic
- Glassmorphism: 85% opacity white cards, heavy background blur
- NO borders, NO shadows - cards melt into background
- Rounded corners: 24px or larger (soft, melting into background)
- Color palette: ONLY ${BRAND.primary} (pink) and ${BRAND.secondary} (orange) gradient
- Typography: Clean sans-serif, generous whitespace
- Format: 16:9 aspect ratio (1920x1080px)
- All Japanese text must be rendered clearly and sharp`;

  return [
    // Slide 1: Cover
    {
      name: 'slide-01-cover',
      prompt: `Create a professional presentation cover slide.
${designSystem}

COVER SLIDE:
- Background: Smooth gradient from ${BRAND.primary} to ${BRAND.secondary} (diagonal)
- Center content with generous vertical balance:
  - "ZEROCK" - 72pt, white, bold, centered
  - "社内情報検索AI" - 28pt, white, 90% opacity, below title
  - "「あの資料どこだっけ？」をなくす" - 20pt, white, 80% opacity
- Bottom: "株式会社TIMEWELL" - 14pt, white, 70% opacity
- Decorative: Very subtle glassmorphism shapes in background (15% opacity)
- Apple-style clean, premium, minimal design`
    },

    // Slide 2: Problem
    {
      name: 'slide-02-problem',
      prompt: `Create a professional presentation slide.
${designSystem}

PROBLEM SLIDE:
- Background: White with very subtle 8% gradient overlay
- Top-left header: "課題" - 14pt, ${BRAND.primary}, bold
- One-message: "情報検索・資料作成・新人育成に膨大な時間を浪費" - 22pt, dark gray, bold

Three glassmorphism cards in horizontal row (Bento UI style):
Card 1 (info search):
- Icon: magnifying glass emoji 🔍
- Title: "情報検索"
- Value: "30分" (large, ${BRAND.primary})
- Subtitle: "1件あたり平均"

Card 2 (slide creation):
- Icon: chart emoji 📊
- Title: "スライド作成"
- Value: "3時間" (large, ${BRAND.primary})
- Subtitle: "1資料あたり"

Card 3 (training):
- Icon: person emoji 👤
- Title: "新人教育"
- Value: "6ヶ月" (large, ${BRAND.primary})
- Subtitle: "独り立ちまで"

Cards: 85% white opacity, heavy blur effect, 24px corners, NO borders, NO shadows`
    },

    // Slide 3: Solution
    {
      name: 'slide-03-solution',
      prompt: `Create a professional presentation slide.
${designSystem}

SOLUTION SLIDE:
- Background: White with 8% gradient overlay
- Header: "ソリューション" - ${BRAND.primary}
- One-message: "GraphRAG技術で社内情報を10秒で検索・活用" - 22pt bold

Two-column layout:
LEFT COLUMN:
- Two glassmorphism feature cards stacked:
  1. "GraphRAG技術" - "ナレッジグラフとRAGを組み合わせた独自技術"
  2. "セキュアな環境" - "SOC2準拠のセキュリティ"
- Two small stat badges below:
  - "50+" with label "導入企業数"
  - "10秒" with label "平均検索時間"

RIGHT COLUMN:
- Large glassmorphism card with screenshot placeholder area
- Abstract AI/network visualization inside (gradient nodes)

All cards: 85% opacity, NO borders, NO shadows, 24px corners`
    },

    // Slide 4: Feature 1
    {
      name: 'slide-04-feature1',
      prompt: `Create a professional presentation slide.
${designSystem}

FEATURE 1 SLIDE:
- Background: White with 8% gradient overlay
- Header: "機能 1" - ${BRAND.primary}
- One-message: "ハイブリッド情報検索で必要な情報を瞬時に発見" - 22pt bold

Two-column layout:
LEFT COLUMN - Glassmorphism card with feature list:
- "セマンティック検索" - "自然言語で質問するだけで関連情報を自動抽出"
- "マルチソース対応" - "PDF, Word, Excel, Slack, Notionなど横断検索"
- "コンテキスト理解" - "曖昧な質問でも文脈を理解して最適な回答"

RIGHT COLUMN - Large stat display:
- Glassmorphism card with 15% pink tint
- "80%" - 64pt, ${BRAND.primary}, bold
- "検索時間削減" - 16pt below

All cards: 85% opacity, NO borders, NO shadows, 24px+ corners`
    },

    // Slide 5: Feature 2
    {
      name: 'slide-05-feature2',
      prompt: `Create a professional presentation slide.
${designSystem}

FEATURE 2 SLIDE:
- Background: White with 8% gradient overlay
- Header: "機能 2" - ${BRAND.primary}
- One-message: "AIによる自動生成で作業時間を大幅削減" - 22pt bold

Two glassmorphism cards side by side (Bento UI):

CARD 1 "AIスライド生成":
- Header row: title + badge "97%削減"
- Description: "キーワードを入力するだけでプロ品質のスライドを自動生成"
- Bullet points:
  ・ブランドガイドライン自動適用
  ・グラフ・図表の自動作成
  ・多言語対応

CARD 2 "中堅社員AI":
- Header row: title + badge "60%自動応答"
- Description: "新人からの質問にAIが24時間自動対応"
- Bullet points:
  ・社内ナレッジベースと連携
  ・過去の回答履歴を学習
  ・エスカレーション機能

Cards: equal size, 85% opacity, NO borders, NO shadows, 24px corners
Badges: 15% pink background, ${BRAND.primary} text`
    },

    // Slide 6: Results
    {
      name: 'slide-06-results',
      prompt: `Create a professional presentation slide.
${designSystem}

RESULTS SLIDE - Before/After comparison:
- Background: White with 8% gradient overlay
- Header: "導入効果" - ${BRAND.primary}
- One-message: "ZEROCK導入で業務効率が劇的に改善" - 22pt bold

Large glassmorphism table card:
Table header row (10% pink background):
| 項目 | Before | After | 効果 |

Data rows:
| 情報検索 | 30分/件 | 10秒/件 | -99% (green) |
| スライド作成 | 3時間/資料 | 5分/資料 | -97% (green) |
| 新人育成期間 | 6ヶ月 | 3ヶ月 | -50% (green) |

- Before column: gray text
- After column: ${BRAND.primary} bold
- Effect column: green bold
- Table: clean design, no heavy borders, 85% opacity card, 24px corners`
    },

    // Slide 7: Pricing
    {
      name: 'slide-07-pricing',
      prompt: `Create a professional presentation slide.
${designSystem}

PRICING SLIDE:
- Background: White with 8% gradient overlay
- Header: "料金プラン" - ${BRAND.primary}
- One-message: "ビジネス規模に合わせた柔軟なプラン設計" - 22pt bold

Two pricing cards side by side (Bento UI):

CARD 1 "Business":
- Plan name: "Business" - 18pt bold
- Price: "¥30,000〜" - 32pt ${BRAND.primary} bold
- Subtitle: "月額/10ユーザーから"
- Features:
  ・基本検索機能
  ・AIスライド生成
  ・標準サポート
  ・月間10GB ストレージ
- Card: 85% white, standard glassmorphism

CARD 2 "Enterprise" (highlighted):
- Plan name: "Enterprise" - 18pt bold
- Price: "要相談" - 32pt ${BRAND.primary} bold
- Subtitle: "カスタム見積もり"
- Features:
  ・全機能利用可能
  ・中堅社員AI
  ・専任サポート
  ・無制限ストレージ
  ・オンプレミス対応可
- Card: 8% pink tint background, premium feel

Both cards: NO borders, NO shadows, 24px corners`
    },

    // Slide 8: CTA
    {
      name: 'slide-08-cta',
      prompt: `Create a professional presentation slide.
${designSystem}

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
DO NOT include any product mockups, phones, or device images`
    }
  ];
}

/**
 * Add image to slide preserving aspect ratio
 */
async function addImagePreserveAspect(slide, imagePath, x, y, maxWidth, maxHeight) {
  try {
    const metadata = await sharp(imagePath).metadata();
    const aspectRatio = metadata.width / metadata.height;

    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    slide.addImage({ path: imagePath, x, y, w: width, h: height });
    return true;
  } catch (error) {
    console.error(`Error adding image: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('=== ZEROCK with Nano Banana Pro (v3) ===');
  console.log(`Model: ${MODEL_ID}`);
  console.log(`Wait time: ${RATE_LIMIT.normalWait / 1000}s between slides\n`);

  if (!fs.existsSync(SLIDES_DIR)) {
    fs.mkdirSync(SLIDES_DIR, { recursive: true });
  }

  const slidePrompts = getSlidePrompts();
  const generatedSlides = [];

  console.log(`Generating ${slidePrompts.length} slides...\n`);

  for (let i = 0; i < slidePrompts.length; i++) {
    const slide = slidePrompts[i];
    console.log(`[${i + 1}/${slidePrompts.length}] ${slide.name}`);

    const outputPath = path.join(SLIDES_DIR, `${slide.name}.png`);
    const result = await generateSlide(slide.prompt, outputPath);

    generatedSlides.push({ name: slide.name, path: result });

    if (i < slidePrompts.length - 1) {
      console.log(`  Waiting ${RATE_LIMIT.normalWait / 1000}s...`);
      await new Promise(r => setTimeout(r, RATE_LIMIT.normalWait));
    }
  }

  // Create PPTX
  console.log('\n=== Creating PowerPoint ===\n');

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'ZEROCK - 社内情報検索AI';
  pptx.author = 'TIMEWELL Inc.';
  pptx.company = '株式会社TIMEWELL';
  pptx.subject = 'Generated with Nano Banana Pro (Gemini 3 Pro Image)';

  let successCount = 0;
  for (const slide of generatedSlides) {
    const pptSlide = pptx.addSlide();

    if (slide.path && fs.existsSync(slide.path)) {
      await addImagePreserveAspect(pptSlide, slide.path, 0, 0, 10, 5.625);
      successCount++;
      console.log(`✅ Added: ${slide.name}`);
    } else {
      pptSlide.addText(`[${slide.name}]\nImage generation pending`, {
        x: 0.5, y: 2, w: 9, h: 2,
        fontSize: 24, color: 'FF6B9D', align: 'center', valign: 'middle'
      });
      console.log(`⚠️ Placeholder: ${slide.name}`);
    }
  }

  // Add slide numbers (pages 2-8)
  const slideCount = pptx.slides.length;
  for (let i = 1; i < slideCount; i++) {
    pptx.slides[i].addText(`${i + 1}`, {
      x: 9.3, y: 5.2, w: 0.5, h: 0.3,
      fontSize: 10, color: '888888', align: 'right'
    });
  }

  const outputPath = path.join(WORKSPACE, 'ZEROCK-NanoBananaPro-v3.pptx');
  await pptx.writeFile({ fileName: outputPath });

  console.log(`\n=== Complete ===`);
  console.log(`Generated: ${successCount}/${slidePrompts.length} slides`);
  console.log(`Output: ${outputPath}`);
  console.log(`Slide images: ${SLIDES_DIR}`);

  const estimatedTime = (slidePrompts.length - 1) * RATE_LIMIT.normalWait / 1000 / 60;
  console.log(`\nEstimated generation time: ~${Math.ceil(estimatedTime)} minutes`);
}

main().catch(console.error);
