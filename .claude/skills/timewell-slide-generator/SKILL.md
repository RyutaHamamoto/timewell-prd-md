---
name: timewell-slide-generator
description: |
  Nano Banana Pro（Gemini 3 Pro Image）を使用した高品質プレゼンテーション生成スキル。

  使用シーン：
  - サービス紹介スライド（ZEROCK、BASE、WARP、Ex-CHECK）
  - ホワイトペーパー・営業資料
  - イベント登壇資料

  特徴：
  - 6ステップの標準化されたワークフロー
  - ブランドガイドライン完全準拠
  - 品質を安定させる型化されたプロセス
---

# TIMEWELL スライド生成スキル v2

## 絶対厳守ルール（違反禁止）

### ルール1: 画像アスペクト比の保持

**画像を配置する際、アスペクト比を絶対に変更しない。**

```javascript
// ❌ 禁止: 幅と高さを両方指定（アスペクト比崩壊）
slide.addImage({ path: logo, w: 1.3, h: 0.25 });

// ✅ 正解: アスペクト比を計算して保持
const sharp = require('sharp');
async function addImagePreserveAspect(slide, imagePath, x, y, maxWidth) {
  const metadata = await sharp(imagePath).metadata();
  const aspectRatio = metadata.width / metadata.height;
  const width = maxWidth;
  const height = width / aspectRatio;
  slide.addImage({ path: imagePath, x, y, w: width, h: height });
}
```

### ルール2: 背景デザインの統一

| スライド | 背景 |
|---------|------|
| スライド1（表紙）のみ | グラデーション許可 |
| スライド2以降（全て） | 白背景 + 薄いグラデーション（10%透過） |

**例外なし。CTAスライドも統一背景を使用。**

### ルール3: サービスロゴの扱い

- Nano Banana Proでロゴを生成しない（品質が不安定）
- プロンプトに「No logos」を必ず含める
- ロゴはPptxGenJSで公式ファイルから配置

### ルール4: カラー厳守

**ブランドカラー以外の色を使用しない。**

```
✅ 許可される色:
- プライマリカラー（例: #FF6B9D）
- セカンダリカラー（例: #FF9472）
- 白 (#FFFFFF)
- テキスト黒/グレー (#333333, #666666, #999999)

❌ 禁止される色:
- 水色、青、紫、緑など関係ない色
- ブランドと無関係なアクセントカラー
```

---

## デザイン原則（Apple/iPhone準拠）

### グラスモーフィズム仕様

**iPhoneのデザイン言語に準拠する。**

```
┌─────────────────────────────────┐
│  グラスモーフィズムの正しい実装   │
├─────────────────────────────────┤
│                                 │
│  ✅ 不透明度: 80-90%           │
│     （背景がうっすら透けて見える）│
│                                 │
│  ✅ 背景ブラー: 強め            │
│     （iPhoneのコントロールセンター│
│      のような効果）              │
│                                 │
│  ✅ ボーダー: なし              │
│     （線で囲まない）             │
│                                 │
│  ✅ シャドウ: なし or 極めて薄い │
│     （端にシャドウを入れない）    │
│                                 │
│  ✅ 角丸: 非常に柔らかい        │
│     （24px以上、角が溶けるような）│
│                                 │
└─────────────────────────────────┘
```

**プロンプトでの指定方法**:
```
Cards/boxes must follow Apple iOS design:
- Opacity: 80-90% (background visible through)
- Heavy background blur (frosted glass effect)
- NO borders or outlines
- NO shadows or very minimal
- Very soft rounded corners (24px+, melting into background)
- Colors: ONLY brand colors (pink/orange), white, gray - NO blue, purple, green
```

### レイアウト・バランスの原則

**プロフェッショナルなデザインの条件**:

```
1. 整列（Alignment）
   - テキストの左端を揃える
   - 中央配置の場合は完全に中央
   - 要素間の開始位置を統一

2. 余白（Spacing）
   - 上下左右に十分な余白
   - 要素間の余白を均等に
   - 詰め込みすぎない

3. バランス（Balance）
   - 上下の重心を中央〜やや上に
   - 左右対称 or 意図的な非対称
   - 「下に落ちている」印象を避ける

4. 階層（Hierarchy）
   - タイトル > サブタイトル > 本文
   - サイズと太さで明確に区別
   - 視線の流れを意識
```

### 表紙スライドのデザイン指針

```
❌ 悪い例:
┌────────────────────────┐
│                        │
│                        │
│       ZEROCK           │
│    社内情報検索AI       │  ← 下に落ちている
│ 「あの資料どこだっけ」   │  ← バランス悪い
│      をなくす           │
│                        │
│   株式会社TIMEWELL      │
└────────────────────────┘

✅ 良い例:
┌────────────────────────┐
│                        │
│       ZEROCK           │  ← 垂直方向の中央
│                        │
│    社内情報検索AI       │  ← 適度な余白
│                        │
│ 「あの資料どこだっけ」   │
│      をなくす           │
│                        │
│                        │
│   株式会社TIMEWELL      │  ← 下部に控えめに
└────────────────────────┘
```

---

## 標準ワークフロー（6ステップ）

### Step 1: 情報収集（Web検索）

**スライド生成前に必ず最新情報を収集する。**

```markdown
## 検索対象（必須）
1. サービス公式ページ
   - ZEROCK: https://timewell.jp/zerock
   - BASE: https://timewell.jp/base
   - WARP: https://timewell.jp/warp

2. PR TIMES プレスリリース
   - 検索: "TIMEWELL" OR "{サービス名}"
   - 直近6ヶ月の発表を確認

3. 会社ニュースページ
   - https://timewell.jp/news

## 収集する情報
- [ ] 最新の導入企業数
- [ ] 新機能・アップデート
- [ ] 料金プランの変更
- [ ] 新しい導入事例
- [ ] 受賞歴・メディア掲載
- [ ] 数値データ（効果・実績）
```

### Step 2: コンテンツ整理（マークダウン）

**ファイル**: `output/workspace/{service}-content.md`

```markdown
# {サービス名} コンテンツ整理

## 更新日
{YYYY-MM-DD}

## 基本情報
- サービス名:
- カテゴリ:
- ターゲット:
- キャッチコピー:

## 最新情報
- 導入企業数:
- 最新機能:
- プレスリリース: {タイトル}（{日付}）

## 数値データ
| 指標 | Before | After | 効果 |
|-----|--------|-------|------|
|     |        |       |      |

## 差別化ポイント
1.
2.
3.

## 料金プラン
| プラン | 価格 | 内容 |
|-------|------|------|
|       |      |      |

## 導入事例
### 事例1: {企業タイプ}
- 課題:
- 効果:
- 声:
```

### Step 3: スライドアウトライン作成

**ファイル**: `output/workspace/{service}-outline.md`

```markdown
# {サービス名} スライドアウトライン

## 基本設定
- 枚数: 12枚（デフォルト。8枚は少なすぎる）
- 対象:
- 目的:

---

## スライド構成

### スライド1: 表紙
- タイトル: {サービス名}
- サブタイトル: {キャッチコピー}
- 会社名: 株式会社TIMEWELL
- 背景: **グラデーション**（表紙のみ許可）
- ロゴ: なし

### スライド2: 課題
- ヘッダー: 課題
- ワンメッセージ（40-50文字目安）:
- 内容:
- 背景: **白+薄いグラデーション**

### スライド3: ソリューション
- ヘッダー: ソリューション
- ワンメッセージ（40-50文字目安）:
- 内容:
- スクリーンショット: あり/なし
- 背景: **白+薄いグラデーション**

### スライド4: 技術/仕組み
- ヘッダー:
- ワンメッセージ:
- 内容:
- 背景: **白+薄いグラデーション**

### スライド5-7: 機能詳細（3枚）
- 各機能を1枚ずつ詳細に説明
- 効果の数値を必ず含める
- 背景: **白+薄いグラデーション**

### スライド8: 導入効果
- Before/After表形式
- 背景: **白+薄いグラデーション**

### スライド9: 導入事例
- 2社程度の事例
- 背景: **白+薄いグラデーション**

### スライド10: セキュリティ/安心感
- 背景: **白+薄いグラデーション**

### スライド11: 料金プラン
- 背景: **白+薄いグラデーション**

### スライド12: CTA
- ヘッダー: お問い合わせ
- ワンメッセージ:
- URL、連絡先
- 背景: **白+薄いグラデーション**（※表紙以外は統一）
```

### Step 4: デザインガイドライン確認

**ファイル**: `output/workspace/{service}-design.md`

```markdown
# {サービス名} デザインガイドライン

## カラー設定
- プライマリ: {色コード}
- セカンダリ: {色コード}
- テキスト: #333333
- サブテキスト: #666666

## 背景設定（重要）
| スライド | 背景 |
|---------|------|
| 表紙（1枚目）| グラデーション（プライマリ→セカンダリ） |
| 2枚目以降 | 白（#FFFFFF）+ グラデーション10%透過 |

## レイアウト
- 左上: ヘッダー（タイトル）
- ヘッダー下: ワンメッセージ（40-50文字目安、そのスライドの要点を伝える）
- 中央〜下: コンテンツエリア
- 右上: TIMEWELLロゴ（スライド2以降）
- 右下: ページ番号（スライド2以降）

## 情報量の目安
- ワンメッセージ: 40-50文字（スライドの核心を1文で伝える）
- コンテンツエリア: 箇条書き3-5項目、または2-4つのカード
- 余白を確保しつつ、内容が薄くならないバランス

## 禁止事項
- [ ] サービスロゴのAI生成
- [ ] 画像アスペクト比の変更
- [ ] 背景デザインの不統一（CTAも白背景）
- [ ] 極端に長いワンメッセージ（60文字以上）
```

### Step 5: Nano Banana Pro生成

**API設定**:

```javascript
const CONFIG = {
  model: 'gemini-3-pro-image-preview',
  endpoint: 'aiplatform.googleapis.com',
  location: 'global',  // 必須
  credentialsPath: '/path/to/service-account.json',
  projectId: 'your-project-id'
};

const RATE_LIMIT = {
  normalWait: 40000,      // 通常待機: 40秒（推奨）
  rateLimitWait: 90000,   // 429エラー時: 90秒
  maxRetries: 5
};

// 12枚生成の場合: 12 × 40秒 ≈ 8分 + API処理 ≈ 10分で完了
```

**プロンプトテンプレート（コンテンツスライド用）**:

```javascript
const CONTENT_SLIDE_PROMPT = (header, oneMessage, content, colors) => `
Create a professional, elegant presentation slide.

=== BACKGROUND ===
- Base: White (#FFFFFF)
- Overlay: Very subtle gradient from light ${colors.primary} to light ${colors.secondary} at 10% opacity
- Clean, minimal, refined

=== LAYOUT ===
- Top-left: "${header}" in ${colors.primary} (bold)
- Below header: "${oneMessage}" in #333333
- Content area with generous spacing and balance

=== CONTENT ===
${content}

=== DESIGN STYLE (Apple iOS / iPhone inspired) ===
Cards and boxes MUST follow:
- Opacity: 80-90% (background subtly visible through)
- Heavy background blur effect (frosted glass)
- NO borders or outlines on cards
- NO shadows or extremely minimal
- Very soft rounded corners (24px+, corners feel like they melt)
- Generous padding inside cards

=== COLOR RESTRICTIONS (STRICT) ===
ONLY use these colors:
- ${colors.primary} (primary accent)
- ${colors.secondary} (secondary accent)
- White (#FFFFFF)
- Text grays (#333333, #666666, #999999)

DO NOT use: blue, purple, green, cyan, or any other colors

=== FORMAT ===
16:9 aspect ratio, high resolution

=== IMPORTANT ===
- No logos or brand marks
- Japanese text must be clear
- Professional designer quality
- Elegant, refined, not cluttered
`;
```

**プロンプトテンプレート（表紙スライド用）**:

```javascript
const COVER_SLIDE_PROMPT = (serviceName, subtitle, tagline, colors) => `
Create an elegant, professionally designed presentation COVER slide.

=== BACKGROUND ===
Beautiful gradient from ${colors.primary} to ${colors.secondary}

=== LAYOUT (CRITICAL - must be balanced) ===
Vertically centered composition with proper spacing:

- "${serviceName}" - Large white bold text, vertically centered (not too high, not too low)
- Below with breathing room: "${subtitle}" in white
- Below with spacing: "${tagline}" in smaller white text
- Bottom margin: "株式会社TIMEWELL" in small white text

IMPORTANT:
- Text group should be vertically centered in the slide
- Equal visual weight above and below the main content
- Do NOT let content sink to the bottom
- Generous spacing between each text element
- All text perfectly aligned (centered)

=== DECORATIVE ELEMENTS ===
- Subtle glassmorphism shapes in corners (very subtle, not distracting)
- Shapes should be 80-90% opacity with blur
- NO borders on decorative elements

=== COLOR RESTRICTIONS ===
ONLY: white text, gradient background colors
NO: blue, purple, green, or unrelated colors

=== FORMAT ===
16:9 aspect ratio, high resolution

=== IMPORTANT ===
- No logo icons or symbols (text only)
- Professional designer quality
- Elegant and refined
- Perfect vertical and horizontal balance
`;
```

### Step 6: PPTX組み立て

```javascript
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');

// アスペクト比を保持して画像を追加
async function addImagePreserveAspect(slide, imagePath, x, y, maxWidth) {
  const metadata = await sharp(imagePath).metadata();
  const aspectRatio = metadata.width / metadata.height;
  const width = maxWidth;
  const height = width / aspectRatio;
  slide.addImage({ path: imagePath, x, y, w: width, h: height });
  return { width, height };
}

// スライド組み立て
async function buildPresentation(slideImages, assets) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = `${assets.serviceName} - サービス紹介`;
  pptx.author = '株式会社TIMEWELL';

  for (let i = 0; i < slideImages.length; i++) {
    const slide = pptx.addSlide();
    const imgPath = slideImages[i];

    // スライド画像を配置
    if (fs.existsSync(imgPath)) {
      slide.addImage({ path: imgPath, x: 0, y: 0, w: '100%', h: '100%' });
    }

    // スライド2以降にロゴとページ番号を追加
    if (i > 0) {
      // ロゴ（アスペクト比保持）
      if (fs.existsSync(assets.logoPath)) {
        await addImagePreserveAspect(slide, assets.logoPath, 8.5, 0.15, 1.0);
      }

      // ページ番号
      slide.addText(String(i + 1), {
        x: 9.2, y: 5.15, w: 0.5, h: 0.3,
        fontSize: 12, color: '999999', align: 'right'
      });
    }

    // スクリーンショット追加（指定スライドのみ）
    if (assets.screenshotSlide === i && fs.existsSync(assets.screenshotPath)) {
      await addImagePreserveAspect(slide, assets.screenshotPath, 6.3, 1.3, 3.3);
    }
  }

  return pptx;
}
```

---

## APIレート制限対策

### 制限の仕組み
- 同一API・同一認証情報 → レート制限は共有
- 並列処理しても効果なし（同じクォータを消費）

### 対策オプション

| 方法 | 効果 | 実装難易度 |
|-----|------|----------|
| **待機時間40秒に設定（推奨）** | ◎ | 低 |
| 複数GCPプロジェクトで分散 | ◎ | 中 |
| Google Cloudでクォータ増加申請 | ◎ | 低 |
| オフピーク時間に実行 | △ | 低 |
| 生成済み画像のキャッシュ再利用 | ◯ | 中 |

### 推奨待機時間
- **通常待機: 40秒**（15秒や30秒では429エラー頻発）
- レート制限時: 90秒
- 12枚生成で約10分完了

### 複数プロジェクト運用例

```javascript
const PROJECTS = [
  { id: 'project-a', keyFile: '/path/to/key-a.json' },
  { id: 'project-b', keyFile: '/path/to/key-b.json' },
  { id: 'project-c', keyFile: '/path/to/key-c.json' },
];

// ラウンドロビンで使用
let currentProjectIndex = 0;
function getNextProject() {
  const project = PROJECTS[currentProjectIndex];
  currentProjectIndex = (currentProjectIndex + 1) % PROJECTS.length;
  return project;
}
```

---

## サービス別カラー設定

| サービス | プライマリ | セカンダリ |
|---------|-----------|-----------|
| ZEROCK | #FF6B9D | #FF9472 |
| TIMEWELL BASE | #764ba2 | #667eea |
| WARP | #7c3aed | #ec4899 |
| Ex-CHECK | #FF6B9D | #FF9472 |

---

## ブランドアセット配置

```
output/workspace/brand-assets/
├── timewell-logo.png      # 会社ロゴ
├── zerock-screenshot.png  # ZEROCKスクリーンショット
├── base-screenshot.png    # BASEスクリーンショット
└── warp-screenshot.png    # WARPスクリーンショット
```

---

## 品質チェックリスト

### 生成前チェック
- [ ] Web検索で最新情報を収集した
- [ ] コンテンツをマークダウンで整理した
- [ ] スライドアウトラインを作成した（12枚以上）
- [ ] デザインガイドラインを確認した
- [ ] 全スライドの背景設定が統一されている（表紙以外は白背景）
- [ ] ワンメッセージが適切な長さ（40-50文字目安）

### 生成後チェック

**基本チェック**:
- [ ] 全スライドの背景が統一されている（表紙以外は白背景）
- [ ] CTAスライドも白背景になっている
- [ ] 日本語テキストが正しく表示されている
- [ ] ロゴのアスペクト比が保持されている
- [ ] ページ番号が正しく配置されている
- [ ] サービスロゴがAI生成で混入していない

**デザイン品質チェック**:
- [ ] ブランドカラー以外の色が混入していない（水色、紫、緑などNG）
- [ ] ボックスが80-90%の透過度になっている（背景が透けて見える）
- [ ] ボックスにボーダー（線）がない
- [ ] ボックスにシャドウがない or 極めて薄い
- [ ] 角丸が十分に柔らかい（24px以上相当）
- [ ] 表紙のテキストが垂直方向に中央配置されている
- [ ] 要素間の余白が十分にある（詰め込みすぎていない）
- [ ] 全体的にプロフェッショナルでエレガントな印象

---

## 参照ファイル

- `services/zerock.md` - ZEROCK詳細
- `services/excheck.md` - Ex-CHECK詳細
- `services/timewell-base.md` - TIMEWELL BASE詳細
- `services/warp.md` - WARP詳細
- `brand-guidelines.md` - ブランドガイドライン
