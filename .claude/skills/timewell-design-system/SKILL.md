# TIMEWELL Design System v2

株式会社TIMEWELLの全スライド資料に適用するデザイン基盤。
Big Idea 2026で確立されたコンサルティングファームレベルのデザイン品質を標準化。

---

## 目次

1. [絶対厳守ルール](#絶対厳守ルール)
2. [カラーパレット](#カラーパレット)
3. [タイポグラフィ](#タイポグラフィ)
4. [レイアウト原則](#レイアウト原則)
5. [グラスモーフィズム仕様](#グラスモーフィズム仕様)
6. [レイアウトパターン](#レイアウトパターン)
7. [スライドタイプ別指示](#スライドタイプ別指示)
8. [グラフ・チャートの指示](#グラフチャートの指示)
9. [イラスト・ビジュアル要素](#イラストビジュアル要素)
10. [完全版プロンプトテンプレート](#完全版プロンプトテンプレート)
11. [安定性を高めるTips](#安定性を高めるtips)
12. [クイックリファレンス](#クイックリファレンス)

---

## 絶対厳守ルール

### ルール1: 画像アスペクト比の保持
画像を配置する際、アスペクト比を絶対に変更しない。

### ルール2: 背景デザインの統一
| スライド | 背景 |
|---------|------|
| 表紙（スライド1）のみ | グラデーション許可 |
| スライド2以降 | 純白(#FFFFFF) + 薄いグラデーション(8-10%透過) |

**例外なし（CTAスライドも白背景）**

### ルール3: サービスロゴのAI生成禁止
- Nano Banana Proでロゴを生成しない
- プロンプトに「No logos」を必ず含める
- ロゴはPptxGenJSで公式ファイルから配置

### ルール4: カラー厳守
```
✅ 許可: プライマリ、セカンダリ、白、グレー系のみ
❌ 禁止: 水色、青、紫、緑など無関係な色
```

### ルール5: スライド番号なし
- AI生成画像にスライド番号を含めない
- 番号はPptxGenJSで後付け

---

## カラーパレット

### サービス別ブランドカラー

| サービス | プライマリ | ミドル | セカンダリ |
|---------|-----------|--------|-----------|
| ZEROCK | #FF6B9D (ピンク) | #FF8A5B (コーラル) | #FF9472 (オレンジ) |
| TIMEWELL BASE | #764ba2 (パープル) | - | #667eea (ブルーパープル) |
| WARP | #7c3aed (バイオレット) | - | #ec4899 (ピンク) |
| Ex-CHECK | #FF6B9D | #FF8A5B | #FF9472 |

### テキストカラー（用途別）

| 用途 | カラーコード | 説明 |
|------|------------|------|
| タイトル | #1a1a2e | ダークネイビー、最も重要 |
| サブタイトル | #4a4a6a | グレーパープル、補足情報 |
| 本文 | #333333 | ダークグレー、読みやすさ重視 |
| キャプション | #666666 | ミディアムグレー |
| 薄いテキスト | #999999 | ライトグレー |
| 白テキスト | #FFFFFF | グラデーション背景用 |

### 背景・カード

| 要素 | 値 |
|------|-----|
| メイン背景 | #FFFFFF (純白) |
| カード背景 | rgba(255, 255, 255, 0.7) (半透明白) |
| カードボーダー | rgba(255, 255, 255, 0.3) (非推奨だが使う場合) |
| シャドウ | rgba(0, 0, 0, 0.1) (極めて薄く) |

---

## タイポグラフィ

### フォントサイズ

| 要素 | サイズ | ウェイト |
|------|--------|---------|
| メインタイトル（表紙） | 48-64px | Bold |
| スライドタイトル | 32-48px | Bold |
| サブタイトル | 20-24px | SemiBold |
| 本文 | 14-18px | Regular |
| キャプション・出典 | 10-12px | Regular |
| 数値ハイライト | 36-48px | Bold |

### 推奨フォント

| 言語 | フォント |
|------|---------|
| 日本語 | Noto Sans JP, 游ゴシック, ヒラギノ角ゴ |
| 英語 | Inter, Poppins, Montserrat, SF Pro Display |

### プロンプト指示

```
Typography:
- Title: Bold, 32-48px, dark gray (#1a1a2e)
- Subtitle: SemiBold, 20-24px, gray (#4a4a6a)
- Body: Regular, 14-18px, dark gray (#333333)
- Numbers/Emphasis: Bold, gradient or accent color
- Font family: Inter or Poppins for English; Noto Sans JP for Japanese
```

---

## レイアウト原則

### 基本設定

| 項目 | 値 |
|------|-----|
| アスペクト比 | 16:9 (1920x1080px) |
| 左右マージン | 60-80px |
| 上下マージン | 40-60px |
| グリッド | 2-3カラムを基本 |
| 情報密度 | 1スライドに3-4つの主要ポイント |
| 余白 | 十分なホワイトスペースを確保 |

### 基本レイアウト構成

```
┌────────────────────────────────────────────────┐
│  [タイトル]                        [ロゴ]      │
│  [ワンメッセージ 40-50文字]                    │
│                                                │
│  ┌────────────────────────────────────────┐   │
│  │                                        │   │
│  │         コンテンツエリア                │   │
│  │         (Bento UI / グリッド)          │   │
│  │                                        │   │
│  │                                        │   │
│  └────────────────────────────────────────┘   │
│                                    [ページ番号]│
└────────────────────────────────────────────────┘
```

### バランスの4原則

```
1. 整列（Alignment）
   - テキストの左端を揃える
   - 中央配置は完全に中央
   - 要素間の開始位置を統一

2. 余白（Spacing）
   - 上下左右に60-80pxの余白
   - 要素間の余白を均等に
   - 詰め込みすぎない

3. バランス（Balance）
   - 上下の重心を中央〜やや上に
   - 「下に落ちている」印象を避ける
   - 左右対称 or 意図的な非対称

4. 階層（Hierarchy）
   - タイトル > サブタイトル > 本文
   - サイズと太さで明確に区別
   - 視線の流れを意識
```

---

## グラスモーフィズム仕様

### 正しい実装（Apple iOS準拠）

```
┌─────────────────────────────────────┐
│  グラスモーフィズムの正しい実装      │
├─────────────────────────────────────┤
│                                     │
│  ✅ 不透明度: 70-90%               │
│     rgba(255,255,255,0.7-0.9)       │
│                                     │
│  ✅ 背景ブラー: 強め               │
│     backdrop-blur効果              │
│                                     │
│  ✅ ボーダー: なし or 極薄         │
│     rgba(255,255,255,0.3)以下      │
│                                     │
│  ✅ シャドウ: 柔らかく控えめ       │
│     0 8px 32px rgba(0,0,0,0.1)     │
│                                     │
│  ✅ 角丸: 16-24px                  │
│     角が溶けるような柔らかさ        │
│                                     │
└─────────────────────────────────────┘
```

### プロンプト指示

```
Glassmorphism Style:
- Card UI: Semi-transparent white (rgba(255,255,255,0.7)) + backdrop blur
- Border: Very thin or none (rgba(255,255,255,0.3))
- Shadow: Soft drop shadow (0 8px 32px rgba(0,0,0,0.1))
- Border radius: 16-24px
- Frosted glass effect like iOS Control Center
```

---

## レイアウトパターン

### パターンA: 左テキスト・右イラスト（最も一般的）

```
┌─────────────────────────────────────────────────┐
│  タイトル（大きく、太字）                          │
│  ┌────────────────┐    ┌──────────────────────┐ │
│  │ ポイント1       │    │                      │ │
│  │ ポイント2       │    │      イラスト         │ │
│  │ ポイント3       │    │                      │ │
│  │ ポイント4       │    │                      │ │
│  └────────────────┘    └──────────────────────┘ │
│                                    出典: ○○○    │
└─────────────────────────────────────────────────┘

プロンプト: Layout: 60/40 split - text content on left side, visual illustration on right side
```

### パターンB: 上タイトル・下3カラム（比較・一覧）

```
┌─────────────────────────────────────────────────┐
│              タイトル（中央揃え）                  │
│                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │  アイコン  │  │  アイコン  │  │  アイコン  │   │
│  │           │  │           │  │           │   │
│  │  テキスト  │  │  テキスト  │  │  テキスト  │   │
│  │  説明文   │  │  説明文   │  │  説明文   │   │
│  └───────────┘  └───────────┘  └───────────┘   │
└─────────────────────────────────────────────────┘

プロンプト: Layout: Centered title at top, 3-column grid below with glassmorphic cards
```

### パターンC: データ中心（グラフ主体）

```
┌─────────────────────────────────────────────────┐
│  タイトル                    ┌────────────────┐ │
│  サブタイトル                │  数値ハイライト │ │
│                             │  $XXX B        │ │
│  ┌────────────────────────┐ │  CAGR XX%     │ │
│  │                        │ └────────────────┘ │
│  │      グラフ・チャート    │                   │
│  │                        │  ・補足ポイント1   │
│  │                        │  ・補足ポイント2   │
│  └────────────────────────┘                   │
│                                    出典: ○○○    │
└─────────────────────────────────────────────────┘

プロンプト: Layout: Large chart on left (60%), key metrics in glassmorphic callout on right
```

### パターンD: Bento UIグリッド

```
┌────────────────────────────────────────────┐
│  タイトル                                  │
│  ┌──────────────┐  ┌──────────────────┐   │
│  │              │  │                  │   │
│  │   大カード    │  │    大カード      │   │
│  │   (2x2)      │  │    (2x2)        │   │
│  │              │  │                  │   │
│  └──────────────┘  └──────────────────┘   │
│                                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  │小(1x1)│ │小(1x1)│ │小(1x1)│ │小(1x1)│    │
│  └──────┘ └──────┘ └──────┘ └──────┘     │
└────────────────────────────────────────────┘

プロンプト: Layout: Bento UI grid with mixed card sizes (2x2, 1x2, 1x1)
```

### パターンE: セクション区切り

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│              SECTION 01                         │
│                                                 │
│           セクションタイトル                      │
│                                                 │
│              ───────────                        │
│           （グラデーションライン）                 │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘

プロンプト: Layout: Centered section divider, large section number, gradient accent line
```

---

## スライドタイプ別指示

| スライドタイプ | 追加指示 |
|--------------|---------|
| **タイトルスライド** | 中央配置、大きなタイトル(48-64px)、サブタイトル、グラデーション装飾ライン |
| **セクション区切り** | シンプル、セクション番号、アイコン1つ、グラデーションアクセント |
| **データスライド** | グラフ中心、CAGR等を強調、出典明記、数値をグラスモーフィズムカードで強調 |
| **比較スライド** | 2-3カラム、各項目をカードで区切り、アイコンで視覚的に区別 |
| **引用スライド** | 大きな引用符（"）、人物名・肩書き明記、背景に薄くシルエット |
| **まとめスライド** | 箇条書き3-5項目、チェックマークまたは番号アイコン、グラデーションハイライト |
| **CTAスライド** | 白背景、中央にグラスモーフィズムカード、ボタン2つ（プライマリ/セカンダリ）、URL明記 |

---

## グラフ・チャートの指示

### スタイル設定

```
【グラフ・チャート】
- 棒グラフ: ピンク〜オレンジのグラデーション塗り
- 折れ線: グラデーションライン + 半透明エリア塗り
- 円グラフ: パステルカラーパレット
- データラベル: 白背景のグラスモーフィズムカード内に配置
- 軸線: 薄いグレー（#E0E0E0）
- グリッド線: 極薄グレーまたは非表示

【数値の強調】
- 重要な数値: 大きなフォントサイズ(36-48px) + グラデーションカラー
- CAGR等の指標: グラスモーフィズムカード内にハイライト表示
- 出典: スライド下部に小さく明記(10-12px)
```

### プロンプト指示

```
Charts and Graphs:
- Bar charts: Pink-orange gradient fill
- Line charts: Gradient line with semi-transparent area fill
- Data labels: Inside glassmorphic cards with white background
- Axis lines: Light gray (#E0E0E0)
- Grid lines: Very light gray or hidden
- Key figures: Large font (36-48px) with gradient color
```

---

## イラスト・ビジュアル要素

### イラストスタイル

```
【基本スタイル】
- スタイル: フラットデザイン / アイソメトリック / 3Dレンダリング風
- トーン: 未来的、テクノロジー感、クリーンでプロフェッショナル
- カラー: メインカラー（ピンク〜オレンジ）+ 補色（ブルー、パープル控えめ）
- 質感: グラデーション、光沢感、ソフトなグロー効果
- 背景との調和: 白背景に映える、影やハイライトで立体感

【アイコン・図形】
- アイコン: シンプルなラインアイコン or フラットアイコン
- 図形: 角丸四角形(16-24px)、円形
- 接続線: 薄いグレーまたはグラデーション
```

### テーマ別イラストプロンプト

| テーマ | プロンプト |
|-------|----------|
| AI・機械学習 | Futuristic AI brain with neural network connections, glowing nodes in pink-orange gradient, holographic style, clean white background |
| データ・クラウド | Abstract data visualization with floating cubes and spheres, connected by light beams, gradient colors, futuristic data flow |
| 半導体・チップ | Modern semiconductor chip with circuit patterns, isometric view, glowing traces in gradient colors |
| 自動運転・モビリティ | Autonomous vehicle with sensor visualization, lidar waves in pink-orange, futuristic design |
| スマートファクトリー | Smart factory with robotic arms, IoT sensors, digital twin overlay, Industry 4.0 aesthetic |
| 経済安全保障 | World map with supply chain connections, gradient highlight on key regions, geopolitical visualization |

---

## 完全版プロンプトテンプレート

### 日本語版

```
プロフェッショナルなプレゼンテーションスライドを作成してください：

【デザインベース】
- 背景: 純白（#FFFFFF）
- スタイル: グラスモーフィズム（すりガラス効果のカード）
- アクセントカラー: ピンク〜オレンジのグラデーション（{primary} → {secondary}）
- アスペクト比: 16:9 (1920x1080px)
- 品質: コンサルティングファームレベル
- スライド番号: なし

【タイポグラフィ】
- タイトル: 太字、32-48px、ダークグレー（#1a1a2e）
- サブタイトル: セミボールド、20-24px、グレー（#4a4a6a）
- 本文: レギュラー、14-18px、ダークグレー（#333333）
- 数値強調: 太字、36-48px、グラデーションカラー

【レイアウト】
- 左右マージン: 60-80px
- 上下マージン: 40-60px
- 配置: [左テキスト・右イラスト / 3カラム / Bento UI等]
- 情報密度: 主要ポイント3-4つ

【ビジュアル要素】
- 配置: [右側 / 左側 / 中央]
- 内容: [具体的なイラスト内容]
- スタイル: モダン、クリーン、未来的、やや光沢感
- カラー: 白/シルバーベース + グラデーションハイライト

【テキストコンテンツ】
- タイトル: "{タイトル}"
- ワンメッセージ: "{40-50文字の要点}"
- キーポイント: グラスモーフィズムカード内に配置

【禁止事項】
- ロゴやブランドマークを入れない
- 暗い背景を使わない
- ネオンカラーを使わない
- 重いシャドウを使わない
- スライド番号を入れない
```

### 英語版

```
Create a professional presentation slide:

【DESIGN BASE】
- Background: Pure white (#FFFFFF)
- Style: Glassmorphism with frosted glass effect cards
- Accent colors: Pink to orange gradient ({primary} → {secondary})
- Aspect ratio: 16:9 (1920x1080px)
- Quality: Consulting firm level
- No slide numbers

【TYPOGRAPHY】
- Title: Bold, 32-48px, dark gray (#1a1a2e)
- Subtitle: SemiBold, 20-24px, gray (#4a4a6a)
- Body: Regular, 14-18px, dark gray (#333333)
- Number emphasis: Bold, 36-48px, gradient color

【LAYOUT】
- Left/Right margins: 60-80px
- Top/Bottom margins: 40-60px
- Layout pattern: [60/40 split / 3-column / Bento UI]
- Information density: 3-4 main points

【VISUAL ELEMENT】
- Position: [Right side / Left side / Center]
- Content: [Describe specific illustration]
- Style: Modern, clean, futuristic, slightly glossy
- Colors: White/silver base with gradient highlights
- Perspective: Isometric or 3/4 view

【TEXT CONTENT】
- Title: "{Title}" - bold, dark gray, top left
- One-message: "{40-50 char summary}"
- Key points: Inside glassmorphic cards

【NEGATIVE PROMPT】
- No logos or brand marks
- No dark backgrounds
- No neon colors
- No heavy shadows or 3D effects
- No slide numbers
- No watermarks
```

---

## 安定性を高めるTips

### 1. 具体的な数値を指定

| ❌ 曖昧な指示 | ✅ 具体的な指示 |
|-------------|---------------|
| きれいな角丸 | 16px角丸 |
| ピンク系の色 | #FF6B9D |
| 大きめのタイトル | 48pxのタイトル |
| 余白を取る | 左右マージン80px |
| やや透明 | rgba(255,255,255,0.7) |

### 2. ネガティブプロンプトを活用

```
Negative prompt:
- No dark backgrounds
- No neon colors
- No 3D effects with heavy shadows
- No complex textures
- No slide numbers
- No watermarks
- No logos or brand marks
- No product mockups, phones, or device images
```

### 3. スタイルキーワードを固定

```
Style keywords:
clean, modern, futuristic, professional, glossy, gradient, isometric,
glassmorphism, white background, pink-orange accent, consulting quality,
elegant, refined, minimal
```

### 4. 構造化されたプロンプト

プロンプトを`===`や`【】`で区切り、セクションを明確にする。
AIが各指示を正確に理解しやすくなる。

---

## クイックリファレンス

### カラーコード一覧

| 用途 | カラーコード |
|------|------------|
| 背景 | #FFFFFF |
| グラデーション開始 | #FF6B9D |
| グラデーション中間 | #FF8A5B |
| グラデーション終了 | #FF9472 / #FFB347 |
| タイトル文字 | #1a1a2e |
| サブタイトル文字 | #4a4a6a |
| 本文文字 | #333333 |
| カード背景 | rgba(255,255,255,0.7) |
| ボーダー | rgba(255,255,255,0.3) |
| シャドウ | rgba(0,0,0,0.1) |

### フォントサイズ一覧

| 要素 | サイズ |
|------|--------|
| メインタイトル | 48-64px |
| スライドタイトル | 32-48px |
| サブタイトル | 20-24px |
| 本文 | 14-18px |
| キャプション・出典 | 10-12px |
| 数値ハイライト | 36-48px |

### マージン一覧

| 位置 | サイズ |
|------|--------|
| 左右マージン | 60-80px |
| 上下マージン | 40-60px |
| カード間余白 | 16-24px |
| カード内パディング | 24-32px |

---

## 参照元

このスキルは以下のスキルから参照される:
- slide-whitepaper
- slide-customer
- slide-conference
- slide-knowhow
- slide-research
- nanobanana-core

---

*このデザインシステムは TIMEWELL Big Idea 2026 で確立されたデザイン基盤に基づいて作成されました。*
