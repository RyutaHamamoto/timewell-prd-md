# TIMEWELL ブランドガイドライン

> 各サービス共通のデザイン言語とブランドトーン

---

## 1. デザインコンセプト

### グラスモーフィズム

TIMEWELLのデザインは**グラスモーフィズム**を基調としています：

- **背景ブラー効果**: `backdrop-filter: blur()`
- **透過感のあるカード**: 半透明の背景
- **ソフトシャドウ**: 柔らかい影
- **レイヤー感**: 奥行きのある表現

### 角丸（Border Radius）

**柔らかいR**を全体で統一：

```css
--radius-sm: 8px;    /* 小さいボタン、タグ */
--radius-md: 12px;   /* カード、入力フィールド */
--radius-lg: 16px;   /* 大きなカード、セクション */
--radius-xl: 24px;   /* ヒーローセクション、モーダル */
```

---

## 2. カラーパレット

### TIMEWELL コーポレート（メインブランド）

**ピンク→オレンジ グラデーション**

| 名称 | HEX | 用途 |
|------|-----|------|
| Primary Pink | `#FF6B9D` | グラデーション開始色 |
| Primary Orange | `#FF9472` | グラデーション終了色 |

```css
/* メイングラデーション */
background: linear-gradient(135deg, #FF6B9D, #FF9472);

/* ホバー時のシャドウ */
box-shadow: 0 4px 20px rgba(255, 107, 157, 0.35);
```

### ZEROCK

**ピンク→オレンジ グラデーション**（コーポレートと同じ）

| 名称 | HEX | 用途 |
|------|-----|------|
| zerock-primary | `#FF6B9D` | メインカラー |
| zerock-secondary | `#FF9472` | アクセントカラー |

```css
--zerock-primary: #FF6B9D;
--zerock-secondary: #FF9472;
background: linear-gradient(135deg, #FF6B9D, #FF9472);
```

### TIMEWELL BASE

**パープル→ブルーパープル グラデーション**

| 名称 | HEX | 用途 |
|------|-----|------|
| base-primary | `#764ba2` | グラデーション開始色（パープル） |
| base-secondary | `#667eea` | グラデーション終了色（ブルーパープル） |

```css
--base-primary: #764ba2;
--base-secondary: #667eea;
background: linear-gradient(135deg, #764ba2, #667eea);
```

### WARP

**バイオレット→ピンク グラデーション**

| 名称 | HEX | 用途 |
|------|-----|------|
| warp-primary | `#7c3aed` | グラデーション開始色（バイオレット） |
| warp-secondary | `#ec4899` | グラデーション終了色（ピンク） |

```css
--warp-primary: #7c3aed;
--warp-secondary: #ec4899;
background: linear-gradient(135deg, #7c3aed, #ec4899);
```

### 共通カラー

| 名称 | HEX | 用途 |
|------|-----|------|
| Text Primary | `#111827` | メインテキスト |
| Text Secondary | `#374151` | サブテキスト |
| Text Tertiary | `#6B7280` | 補助テキスト |
| Background | `#FFFFFF` | 背景白 |
| Background Blur | `rgba(255,255,255,0.7)` | グラスモーフィズム背景 |

---

## 3. タイポグラフィ

### フォントファミリー

**Noto Sans JP** を全体で使用

```css
font-family: 'Noto Sans JP', sans-serif;
```

### フォントウェイト

| 用途 | ウェイト | CSS |
|------|----------|-----|
| 見出し（h1, h2） | Bold | `font-weight: 700` |
| 見出し（h3, h4） | SemiBold | `font-weight: 600` |
| 本文 | Regular | `font-weight: 400` |
| 注釈 | Light | `font-weight: 300` |

### フォントサイズ

| 要素 | サイズ | 行間 |
|------|--------|------|
| h1 | 48px / 3rem | 1.2 |
| h2 | 36px / 2.25rem | 1.3 |
| h3 | 24px / 1.5rem | 1.4 |
| 本文 | 16px / 1rem | 1.6 |
| 注釈 | 14px / 0.875rem | 1.5 |

---

## 4. グラスモーフィズムのCSS

### カードスタイル

```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
```

### ボタンスタイル

```css
.gradient-button {
  background: linear-gradient(135deg, #FF6B9D, #FF9472);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.gradient-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}
```

---

## 5. スライド生成時の適用

### Marp テーマ設定

```css
/* marp-theme-timewell.css */

section {
  font-family: 'Noto Sans JP', sans-serif;
  background: linear-gradient(180deg, #FFF 0%, #FFF5F7 100%);
}

h1, h2 {
  background: linear-gradient(135deg, #FF6B9D, #FF9472);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* グラスモーフィズムのカード */
.card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
}
```

### Nano Banana Pro プロンプト例

**TIMEWELL コーポレート**:
```
スタイル: グラスモーフィズム、モダンでクリーンなデザイン
配色: ピンク(#FF6B9D)からオレンジ(#FF9472)へのグラデーション
背景: 白ベースに薄いピンクのグラデーション
角丸: 柔らかいR（16px程度）
フォント: Noto Sans JP風の明瞭な日本語
形式: 16:9 プレゼンテーション用
```

**TIMEWELL BASE**:
```
スタイル: グラスモーフィズム、先進的でクールなデザイン
配色: パープル(#764ba2)からブルーパープル(#667eea)へのグラデーション
背景: 白ベースにパープル〜ブルーのアクセント
角丸: 柔らかいR（16px程度）
形式: 16:9 プレゼンテーション用
```

**WARP**:
```
スタイル: グラスモーフィズム、エネルギッシュで学習意欲を刺激するデザイン
配色: バイオレット(#7c3aed)からピンク(#ec4899)へのグラデーション
背景: 白ベースに紫〜ピンクのアクセント
角丸: 柔らかいR（16px程度）
形式: 16:9 プレゼンテーション用
```

---

## 6. ブランドトーン＆ボイス

### コミュニケーションスタイル

- **プロフェッショナル**: 信頼性のある表現
- **親しみやすさ**: 堅すぎない、フレンドリーなトーン
- **データドリブン**: 具体的な数値で説得力を持たせる
- **未来志向**: AIの可能性を前向きに伝える

### キーメッセージ

> 「挑戦者の時間を真に価値ある活動へ解放する」

### 避けるべき表現

- 過度に技術的な専門用語
- 誇大な表現（「革命的」「究極の」など）
- ネガティブな競合比較

---

## 7. アイコン・イラスト

### スタイル

- **線画**: 細めのストローク
- **グラデーション**: ブランドカラーを適用
- **シンプル**: 情報過多を避ける

### 推奨アイコンセット

- Heroicons
- Lucide Icons
- Phosphor Icons

---

## 8. 適用チェックリスト

スライド・資料作成時に確認：

- [ ] ブランドカラーのグラデーションが正しく適用されている
- [ ] Noto Sans JP フォントを使用している
- [ ] 角丸が柔らかい（16px程度）
- [ ] グラスモーフィズム効果が適用されている（必要な箇所）
- [ ] テキストカラーが統一されている
- [ ] サービス別のカラーが正しく使い分けられている

---

## 9. カラーコード早見表

| サービス | Primary | Secondary | グラデーション方向 |
|----------|---------|-----------|-------------------|
| TIMEWELL | `#FF6B9D` | `#FF9472` | 135deg |
| ZEROCK | `#FF6B9D` | `#FF9472` | 135deg |
| BASE | `#764ba2` | `#667eea` | 135deg |
| WARP | `#7c3aed` | `#ec4899` | 135deg |

---

*このガイドラインは、ホームページのデザインを基準として作成されています。*
*カラーコードの正確な値は、開発者ツールで確認の上、必要に応じて更新してください。*
