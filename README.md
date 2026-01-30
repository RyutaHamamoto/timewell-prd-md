# TIMEWELL ホワイトペーパー・マークダウン資料集

> 株式会社TIMEWELLの各サービス概要とスライド生成メソッドをまとめたリポジトリ

---

## 概要

このリポジトリは、TIMEWELLの各サービスのマークダウン原稿と、Claude Code + Nano Banana Pro を活用したスライド生成の方法論をまとめています。

---

## ディレクトリ構成

```
timewell-prd-md/
├── README.md                          # このファイル
├── slide-generation-methodology.md    # スライド生成の最強メソッド
├── slide-generation-skills.md         # Claude Code Skills による品質安定化
└── services/                          # 各サービスのマークダウン原稿
    ├── company-overview.md            # 会社概要
    ├── zerock.md                      # ZEROCK - 社内情報検索AI
    ├── excheck.md                     # Ex-CHECK - 輸出管理AIエージェント
    ├── timewell-base.md               # TIMEWELL BASE - コミュニティプラットフォーム
    └── warp.md                        # WARP - AI人材育成プログラム
```

---

## サービス一覧

### AIプロダクト

| サービス | 概要 | ファイル |
|----------|------|----------|
| **ZEROCK** | 社内情報を10秒で検索するAI | [zerock.md](services/zerock.md) |
| **Ex-CHECK** | 輸出管理の該非判定を自動化 | [excheck.md](services/excheck.md) |
| **TIMEWELL BASE** | AIがSNS・イベントページを自動生成 | [timewell-base.md](services/timewell-base.md) |

### AI人材育成

| プログラム | 概要 | ファイル |
|------------|------|----------|
| **WARP NEXT** | 3ヶ月集中型DX人材育成 | [warp.md](services/warp.md) |
| **WARP BASIC** | eラーニング型AI研修 | [warp.md](services/warp.md) |
| **WARP ENTRE** | 起業家向けプログラム | [warp.md](services/warp.md) |
| **WARP 1Day** | 1日完結型研修 | [warp.md](services/warp.md) |

---

## スライド生成メソッド

### 推奨ワークフロー

```
[マークダウン原稿] → [Claude Code] → [Nano Banana Pro] → [PPTX/PDF]
```

詳細は以下のドキュメントを参照:

1. **[slide-generation-methodology.md](slide-generation-methodology.md)**: 全体像とベストプラクティス
2. **[slide-generation-skills.md](slide-generation-skills.md)**: Claude Code Skills による品質安定化

### 主要ツール

| ツール | 役割 |
|--------|------|
| **Claude Code** | マークダウン→スライド構成変換 |
| **Nano Banana Pro** | 図解・インフォグラフィック生成 |
| **Marp** | マークダウン→スライド変換 |
| **Claude PPTX Skill** | PowerPoint生成 |

---

## 使い方

### 1. マークダウン原稿の編集

`services/` ディレクトリ内の各ファイルを編集して、最新のサービス情報を反映させます。

### 2. スライド生成

#### Marp を使用する場合

```bash
# インストール
npm install -g @marp-team/marp-cli

# スライド生成
marp services/zerock.md --pptx --output output/zerock.pptx
marp services/zerock.md --pdf --output output/zerock.pdf
```

#### Claude Code を使用する場合

```bash
# PPTX スキルを呼び出し
claude-code /pptx

# または timewell-slide-generator スキルを使用
claude-code /timewell-slide-generator
```

### 3. 画像生成（Nano Banana Pro）

```bash
# ccskill-nanobanana を使用
python generate_image.py "TIMEWELLブランドカラーで情報検索のフロー図を生成"
```

---

## ブランドガイドライン

詳細は [brand-guidelines.md](brand-guidelines.md) を参照。

### デザインコンセプト

- **スタイル**: グラスモーフィズム（背景ブラー効果、透過感）
- **角丸**: 柔らかいR（16px程度）
- **フォント**: Noto Sans JP

### サービス別カラー

| サービス | Primary | Secondary | グラデーション |
|----------|---------|-----------|----------------|
| **TIMEWELL / ZEROCK** | `#FF6B9D` | `#FF9472` | ピンク→オレンジ |
| **TIMEWELL BASE** | `#764ba2` | `#667eea` | パープル→ブルーパープル |
| **WARP** | `#7c3aed` | `#ec4899` | バイオレット→ピンク |

### キーメッセージ

> 「挑戦者の時間を真に価値ある活動へ解放する」

---

## 参考リンク

### 公式サイト
- [TIMEWELL](https://timewell.jp/)
- [TIMEWELL BASE](https://base.timewell.jp/)

### ドキュメント
- [Claude Code Skills](https://code.claude.com/docs/ja/skills)
- [Nano Banana Pro (ccskill-nanobanana)](https://github.com/feedtailor/ccskill-nanobanana)
- [Marp](https://marp.app/)

---

## 更新履歴

- 2026-01-28: 初版作成
  - 各サービス概要のマークダウンファイル作成
  - スライド生成メソッドのドキュメント作成
  - Claude Code Skills による品質安定化ガイド追加
