# TIMEWELL Design System

株式会社TIMEWELLの全スライド資料に適用するデザイン基盤。

## 絶対厳守ルール

### ルール1: 画像アスペクト比の保持
画像を配置する際、アスペクト比を絶対に変更しない。

### ルール2: 背景デザインの統一
- 表紙（スライド1）のみ: グラデーション許可
- スライド2以降: 白背景 + 薄いグラデーション（10%透過）
- **例外なし（CTAスライドも白背景）**

### ルール3: サービスロゴのAI生成禁止
- Nano Banana Proでロゴを生成しない
- ロゴはPptxGenJSで公式ファイルから配置

### ルール4: カラー厳守
ブランドカラー以外の色を使用しない。

```
✅ 許可: プライマリ、セカンダリ、白、グレー系のみ
❌ 禁止: 水色、青、紫、緑など無関係な色
```

---

## サービス別ブランドカラー

| サービス | プライマリ | セカンダリ |
|---------|-----------|-----------|
| ZEROCK | #FF6B9D | #FF9472 |
| TIMEWELL BASE | #764ba2 | #667eea |
| WARP | #7c3aed | #ec4899 |
| Ex-CHECK | #FF6B9D | #FF9472 |

### テキストカラー
- Primary: #333333
- Secondary: #666666
- Tertiary: #999999
- White: #FFFFFF

---

## デザインスタイル: Apple iOS + Bento UI

### グラスモーフィズム仕様（Apple iOS準拠）

```
┌─────────────────────────────────────┐
│  グラスモーフィズムの正しい実装      │
├─────────────────────────────────────┤
│                                     │
│  ✅ 不透明度: 80-90%               │
│     （背景がうっすら透けて見える）   │
│                                     │
│  ✅ 背景ブラー: 強め               │
│     （iPhoneコントロールセンター風） │
│                                     │
│  ✅ ボーダー: なし                 │
│                                     │
│  ✅ シャドウ: なし or 極めて薄い   │
│                                     │
│  ✅ 角丸: 非常に柔らかい（24px+）  │
│                                     │
└─────────────────────────────────────┘
```

### Bento UI（グリッドレイアウト）

Bento UIは、異なるサイズのカードを組み合わせたグリッドレイアウト。
Appleのマーケティングサイトで採用されているモダンなデザイン。

```
┌────────────────────────────────────────────┐
│                                            │
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
│                                            │
│  ┌────────────────────────┐ ┌──────────┐  │
│  │      横長カード (3x1)   │ │ 中(1x2) │  │
│  └────────────────────────┘ └──────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

**Bento UIの原則**:
- 異なるサイズのカードを組み合わせる
- 視覚的なリズムと変化を作る
- 重要な情報は大きなカードに
- 補足情報は小さなカードに
- カード間の余白は均等に

**プロンプトでの指定**:
```
Layout: Bento UI grid layout
- Mix of large (2x2), medium (2x1, 1x2), and small (1x1) cards
- Cards have glassmorphism effect (80-90% opacity, blur, no borders)
- Equal spacing between all cards
- Visual rhythm and hierarchy through card sizes
```

---

## レイアウト原則

### 基本レイアウト
- 左上: ヘッダー（タイトル）
- ヘッダー下: ワンメッセージ（40-50文字）
- 中央〜下: コンテンツエリア（Bento UI推奨）
- 右上: TIMEWELLロゴ（スライド2以降）
- 右下: ページ番号（スライド2以降）

### バランスの原則

```
1. 整列（Alignment）
   - テキストの左端を揃える
   - 中央配置は完全に中央
   - 要素間の開始位置を統一

2. 余白（Spacing）
   - 上下左右に十分な余白
   - 要素間の余白を均等に
   - 詰め込みすぎない

3. バランス（Balance）
   - 上下の重心を中央〜やや上に
   - 「下に落ちている」印象を避ける

4. 階層（Hierarchy）
   - タイトル > サブタイトル > 本文
   - Bento UIでカードサイズによる階層も表現
```

---

## 表紙スライドのデザイン

```
✅ 良い表紙:
┌────────────────────────────────────┐
│                                    │
│            ZEROCK                  │  ← 垂直中央
│                                    │
│        社内情報検索AI               │
│                                    │
│  「あの資料どこだっけ？」をなくす    │
│                                    │
│                                    │
│        株式会社TIMEWELL             │  ← 下部に控えめ
└────────────────────────────────────┘

- テキストグループを垂直方向に中央配置
- 要素間に十分な余白
- 完全に中央揃え
```

---

## プロンプトテンプレート

### コンテンツスライド用

```
Create a professional, elegant presentation slide.

=== BACKGROUND ===
- Base: White (#FFFFFF)
- Overlay: Very subtle gradient at 10% opacity
- Clean, minimal, refined

=== LAYOUT ===
- Top-left: Header in {primary_color} (bold)
- Below: One-message (40-50 chars) in #333333
- Content: Bento UI grid layout

=== DESIGN STYLE ===
Apple iOS + Bento UI:
- Glassmorphism cards (80-90% opacity, blur, NO borders, NO shadows)
- Very soft rounded corners (24px+)
- Mix of card sizes for visual rhythm
- Generous padding and spacing

=== COLOR RESTRICTIONS ===
ONLY: {primary}, {secondary}, white, grays
DO NOT use: blue, purple, green, cyan

=== FORMAT ===
16:9, high resolution, no logos
```

### 表紙スライド用

```
Create an elegant presentation COVER slide.

=== BACKGROUND ===
Gradient from {primary} to {secondary}

=== LAYOUT ===
Vertically centered:
- "{service_name}" - Large white bold
- "{subtitle}" - White
- "{tagline}" - Smaller white
- Bottom: "株式会社TIMEWELL"

Perfect vertical balance, generous spacing between elements.

=== DECORATIVE ===
Subtle glassmorphism shapes (80-90% opacity, blur, NO borders)

=== FORMAT ===
16:9, high resolution, NO logos
```

---

## ブランドアセット

```
brand-assets/
├── timewell-logo.png      # 会社ロゴ
├── zerock-screenshot.png  # ZEROCK画面
├── base-screenshot.png    # BASE画面
└── warp-screenshot.png    # WARP画面
```

### ロゴ配置ルール
- 位置: 右上（x: 8.5, y: 0.15）
- 最大幅: 1.0インチ
- アスペクト比: 必ず保持
- 表紙には配置しない

---

## 参照元

このスキルは以下のスキルから参照される:
- slide-whitepaper
- slide-customer
- slide-conference
- slide-knowhow
- slide-research
