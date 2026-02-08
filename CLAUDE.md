# TIMEWELL PRD Project

このプロジェクトはTIMEWELLのサービス資料・プレゼンテーション生成用リポジトリです。

---

## ⚠️ 最重要ルール（必ず守ること）

### バッチ処理の鉄則：必ず品質確認してから全体実行

大量のファイルを処理するとき（OCR、変換、生成など）は、**絶対に以下の手順を守る**:

1. **1件だけ処理** → 出力結果をユーザーに見せる
2. **品質OKの承認を得る** → ユーザーが「これでいい」と言うまで次に進まない
3. **全体実行** → 承認後に初めてバッチ処理を開始

**禁止**: 品質確認なしに全件処理を回すこと。テストで品質が怪しいと感じた時点で止めて報告すること。

**過去の失敗**: Tesseract OCRで28冊を一括処理 → 全て文字化けで使い物にならず → 数時間とAPI処理が無駄になった

### Agent Teams 運用ルール：レビュー担当を必ず入れる

バッチ処理・大量生成など非自明なタスクでは、**必ず Agent Teams を使い、レビュー担当を配置する**。

**チーム構成の基本パターン:**

| 役割 | 担当内容 |
|------|----------|
| **リーダー** | タスク分割・進行管理・ユーザー報告 |
| **実行担当** | 実際の処理（OCR、変換、生成など） |
| **レビュー担当** | 出力の品質検証・リスク指摘・改善提案 |

**レビュー担当の責務:**
1. 実行担当の最初の1件の出力を検証し、品質問題・リスクを洗い出す
2. 問題があればリーダーに報告し、全体実行を止める
3. 代替手段やパラメータ調整の改善案を提案する
4. 全体実行中もサンプリングで品質を継続監視する

**フロー:**
```
実行担当: 1件処理 → レビュー担当: 品質検証 → リーダー: ユーザーに確認
                                                  ↓ 承認後
                                          実行担当: 全体実行
                                          レビュー担当: 抜き打ち検証
```

### Tesseract OCR 使用禁止

日本語スキャンPDFのOCRには **Tesseract を絶対に使わない**。文字化けが激しすぎて読めない。
OCRには **Gemini 2.0 Flash（マルチモーダル）** を使うこと。

### プレゼンテーション生成時のAPI選択

| 使用するAPI | 使用禁止のAPI |
|------------|--------------|
| **Gemini 3 Pro Image** (`gemini-3-pro-image-preview`) | ~~Imagen 3.0~~ (`imagen-3.0-generate-001`) |

**理由**: Imagen 3.0は品質が低い。Gemini 3 Pro Imageはスライド全体を高品質画像として生成できる。

### 生成前チェックリスト

スライド生成スクリプトを書く前に必ず確認:

- [ ] モデルIDは `gemini-3-pro-image-preview` になっているか？
- [ ] エンドポイントは `locations/global` を使っているか？
- [ ] `responseModalities: ['TEXT', 'IMAGE']` を指定しているか？
- [ ] 各スライドを**全画面画像**として生成する設計か？

**1つでもNoがあれば、正しいNano Banana Pro実装ではない！**

---

## サービス一覧

- **ZEROCK**: 社内情報検索AI（ピンク→オレンジ）
- **WARP**: AI人材育成プログラム（バイオレット→ピンク）
- **TIMEWELL BASE**: コミュニティプラットフォーム（パープル→ブルー）

サービス詳細は `/services/*.md` を参照してください。

---

## プレゼンテーション生成ルール

### Nano Banana Pro を必ず使用する

スライド・プレゼンテーション（PPTX）を作成する際は、**必ず Nano Banana Pro（Gemini 3 Pro Image）** を使用してください。

**重要: Imagen 3.0 ではなく Gemini 3 Pro Image を使用すること**

Nano Banana Proはスライド全体を高品質な画像として生成します。テキストも画像としてレンダリングされるため、美しいデザインが実現できます。

---

## Nano Banana Pro 設定

### API情報

```javascript
// .env.local から読み込み（dotenvを使用）
require('dotenv').config({ path: '.env.local' });

const MODEL_ID = 'gemini-3-pro-image-preview';
const GLOBAL_ENDPOINT = 'aiplatform.googleapis.com';
const PROJECT_ID = process.env.GCP_PROJECT_ID;
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
```

### 環境変数設定（.env.local）

```
GOOGLE_APPLICATION_CREDENTIALS=/Users/hamamotoryuuta/.claude/keys/timewell-corp-key.json
GCP_PROJECT_ID=gen-lang-client-0454362783
```

**注意:** `.env.local` は `.gitignore` に追加済み。絶対にコミットしないこと。

### 画像生成関数

```javascript
const { GoogleAuth } = require('google-auth-library');

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  const client = await auth.getClient();
  return (await client.getAccessToken()).token;
}

async function generateSlideWithNanoBananaPro(prompt, outputPath) {
  const accessToken = await getAccessToken();

  const endpoint = `https://${GLOBAL_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/${MODEL_ID}:generateContent`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
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
    })
  });

  const data = await response.json();

  // 画像抽出
  if (data.candidates?.[0]?.content?.parts) {
    for (const part of data.candidates[0].content.parts) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        await fs.promises.writeFile(outputPath, buffer);
        return outputPath;
      }
    }
  }
  return null;
}
```

---

## スライドプロンプトテンプレート

各スライドは以下の形式でプロンプトを作成:

```
Create a professional presentation slide.
Brand: [サービス名]
Design Style: glassmorphism, frosted glass effect, soft shadows, rounded corners (16px radius)
Colors: Gradient from [プライマリカラー] to [セカンダリカラー]
Format: 16:9 aspect ratio (1920x1080 pixels)
Text Rendering: All text must be rendered clearly and legibly. Japanese text must be sharp and readable.
Quality: High resolution, professional business presentation

[スライドタイプ] SLIDE:
- Background: [背景の詳細]
- Main Title: "[タイトル]" (large, white, bold, centered)
- Content: [コンテンツの詳細]
- Decorative: [装飾要素]
```

---

## ブランドカラー

| サービス | プライマリ | セカンダリ |
|---------|-----------|-----------|
| ZEROCK | #FF6B9D | #FF9472 |
| WARP | #7c3aed | #ec4899 |
| TIMEWELL BASE | #764ba2 | #667eea |

---

## PPTX作成フロー

1. 各スライドのプロンプトを定義
2. Nano Banana Pro（Gemini 3 Pro Image）で各スライドを画像生成
3. PptxGenJSで画像をフルブリードで配置
4. 出力: `/output/` ディレクトリに保存

```javascript
const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// 各スライドは全画面画像として配置
const slide = pptx.addSlide();
slide.addImage({ path: 'slide-01.png', x: 0, y: 0, w: 10, h: 5.625 });

await pptx.writeFile({ fileName: 'output.pptx' });
```

---

## 参考スクリプト

- `/output/workspace/zerock-nanobanana-pro.js` - ZEROCK用（正しいNano Banana Pro実装）
- `/output/workspace/service-slides-generator.js` - 複数サービス対応版

---

## 禁止事項（絶対にやらないこと）

```
❌ 禁止: imagen-3.0-generate-001 を使う
❌ 禁止: getImageGenerationModel() を使う
❌ 禁止: スライドの一部だけに画像を使い、残りをPptxGenJSで組む
❌ 禁止: locations/us-central1 を使う（Gemini 3はglobalのみ）
```

## 正しい実装の見分け方

```javascript
// ✅ 正しい（Nano Banana Pro）
const MODEL_ID = 'gemini-3-pro-image-preview';
const endpoint = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/${MODEL_ID}:generateContent`;
responseModalities: ['TEXT', 'IMAGE']

// ❌ 間違い（Imagen 3.0 - 使用禁止）
const model = 'imagen-3.0-generate-001';
const endpoint = `https://us-central1-aiplatform.googleapis.com/.../imagen-3.0-generate-001:predict`;
```

---

## 注意事項

- Gemini 3 Pro ImageのAPIにはRate Limitあり（429エラー時は60秒待機）
- 日本語テキストの描画品質を確認すること
- 出力先: `/output/`、作業ファイル: `/output/workspace/`
