# Nano Banana Pro Core

Nano Banana Pro（Gemini 3 Pro Image）のAPI呼び出しと共通処理。

## API設定

### エンドポイント

```javascript
const CONFIG = {
  model: 'gemini-3-pro-image-preview',
  endpoint: 'aiplatform.googleapis.com',
  location: 'global',  // 必須: globalエンドポイント
  credentialsPath: '/path/to/service-account.json',
  projectId: 'your-project-id'
};
```

### 認証

```javascript
const { GoogleAuth } = require('google-auth-library');

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: CONFIG.credentialsPath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  const client = await auth.getClient();
  return (await client.getAccessToken()).token;
}
```

---

## レート制限対策

### 推奨設定

```javascript
// Tier 2 (50 IPM, 2000 RPD) - $250+累計支出で自動昇格
const RATE_LIMIT = {
  normalWait: 30000,      // 通常待機: 30秒（Tier 2推奨）
  rateLimitWait: 60000,   // 429エラー時: 60秒
  maxRetries: 5
};

// 12枚生成: 12 × 30秒 ≈ 6分 + API処理 ≈ 8分
```

### Tierごとの設定

| Tier | IPM | RPD | 推奨待機時間 | 条件 |
|------|-----|-----|------------|------|
| Tier 1 | 10 | 500 | 60秒 | 課金有効化のみ |
| **Tier 2** | 50 | 2,000 | **30秒** | $250+累計支出 |
| Tier 3 | 100 | 5,000 | 15秒 | $1,000+累計支出 |

### 制限の仕組み
- 同一API・同一認証情報 → レート制限は共有
- 並列処理しても効果なし（同じクォータを消費）

### 対策オプション

| 方法 | 効果 |
|-----|------|
| **Tier 2昇格（$250+支出）** | ◎ |
| 複数GCPプロジェクトで分散 | ◎ |
| Google Cloudでクォータ増加申請 | ◎ |

### 複数プロジェクト運用

```javascript
const PROJECTS = [
  { id: 'project-a', keyFile: '/path/to/key-a.json' },
  { id: 'project-b', keyFile: '/path/to/key-b.json' },
];

let currentIndex = 0;
function getNextProject() {
  const project = PROJECTS[currentIndex];
  currentIndex = (currentIndex + 1) % PROJECTS.length;
  return project;
}
```

---

## 画像生成関数

```javascript
async function generateSlide(prompt, outputPath, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const token = await getAccessToken();
      const endpoint = `https://${CONFIG.endpoint}/v1/projects/${CONFIG.projectId}/locations/global/publishers/google/models/${CONFIG.model}:generateContent`;

      console.log(`  Attempt ${attempt}/${retries}...`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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

      if (response.status === 429) {
        console.log(`  Rate limited. Waiting ${RATE_LIMIT.rateLimitWait/1000}s...`);
        await new Promise(r => setTimeout(r, RATE_LIMIT.rateLimitWait));
        continue;
      }

      if (!response.ok) throw new Error(`API ${response.status}`);

      const data = await response.json();
      for (const part of data.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          await fs.promises.writeFile(outputPath, Buffer.from(part.inlineData.data, 'base64'));
          console.log(`  ✅ ${path.basename(outputPath)}`);
          return outputPath;
        }
      }
      throw new Error('No image in response');
    } catch (e) {
      console.log(`  ❌ ${e.message}`);
      if (attempt === retries) return null;
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  return null;
}
```

---

## PPTX組み立て共通処理

### アスペクト比保持関数

```javascript
const sharp = require('sharp');

async function addImagePreserveAspect(slide, imagePath, x, y, maxWidth) {
  const metadata = await sharp(imagePath).metadata();
  const aspectRatio = metadata.width / metadata.height;
  const width = maxWidth;
  const height = width / aspectRatio;
  slide.addImage({ path: imagePath, x, y, w: width, h: height });
  return { width, height };
}
```

### スライド組み立て

```javascript
const pptxgen = require('pptxgenjs');

async function buildPresentation(slideImages, config) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = config.title;
  pptx.author = '株式会社TIMEWELL';

  for (let i = 0; i < slideImages.length; i++) {
    const slide = pptx.addSlide();
    const imgPath = slideImages[i];

    // スライド画像
    if (fs.existsSync(imgPath)) {
      slide.addImage({ path: imgPath, x: 0, y: 0, w: '100%', h: '100%' });
    }

    // スライド2以降: ロゴ + ページ番号
    if (i > 0) {
      if (fs.existsSync(config.logoPath)) {
        await addImagePreserveAspect(slide, config.logoPath, 8.5, 0.15, 1.0);
      }
      slide.addText(String(i + 1), {
        x: 9.2, y: 5.15, w: 0.5, h: 0.3,
        fontSize: 12, color: '999999', align: 'right'
      });
    }

    // スクリーンショット（指定スライドのみ）
    if (config.screenshotSlide === i && fs.existsSync(config.screenshotPath)) {
      await addImagePreserveAspect(slide, config.screenshotPath, 6.3, 1.3, 3.3);
    }
  }

  return pptx;
}
```

---

## 依存パッケージ

```json
{
  "dependencies": {
    "google-auth-library": "^9.0.0",
    "pptxgenjs": "^3.12.0",
    "sharp": "^0.33.0"
  }
}
```

---

## 参照元

このスキルは以下のスキルから参照される:
- slide-whitepaper
- slide-customer
- slide-conference
- slide-knowhow
- slide-research
