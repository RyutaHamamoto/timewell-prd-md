# スライド生成の最強メソッド
## Claude Code + Nano Banana Pro によるホワイトペーパー・プレゼン資料の自動生成

---

## 1. 推奨アーキテクチャ

### 最も効率的なワークフロー

```
[マークダウン原稿] → [Claude Code] → [Nano Banana Pro] → [PowerPoint/PDF]
```

| ステップ | ツール | 役割 |
|----------|--------|------|
| 1. 原稿作成 | Markdown | サービス概要・ストーリー構成 |
| 2. スライド設計 | Claude Code | Marp形式への変換・構造化 |
| 3. ビジュアル生成 | Nano Banana Pro | 図解・インフォグラフィック・バナー |
| 4. 最終出力 | PPTX Skill / PDF | ブランドトーンに合わせた仕上げ |

---

## 2. Nano Banana Pro（Gemini 3 Pro Image）とは

Google DeepMindが開発した最新のAI画像生成モデルで、以下の特徴があります：

### 強み
- **日本語テキスト描画**: 高精度で日本語テキストを画像内に描画
- **ビジネス図解生成**: インフォグラフィック、フローチャート、組織図
- **ブランド一貫性**: 色・フォント・スタイルの統一
- **事実ベースのグラフ**: Google検索と連携したデータビジュアライゼーション

### Google スライドとの統合
Google スライドの「挿入 > 画像生成サポート」から直接利用可能：
- スライドモード
- 画像モード
- インフォグラフィックモード

---

## 3. セットアップ方法

### 方法A: Claude Code Skill（推奨）

```bash
# 1. スキルのクローン
git clone https://github.com/feedtailor/ccskill-nanobanana.git
cd ccskill-nanobanana

# 2. Python環境のセットアップ（Python 3.10以上必須）
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. 環境変数の設定
cp .env.example .env
# .envファイルにGEMINI_API_KEYを設定

# 4. シェル設定に追加
echo 'export CCSKILL_NANOBANANA_DIR="/path/to/ccskill-nanobanana"' >> ~/.zshrc

# 5. プロジェクトにスキルをリンク
mkdir -p /path/to/project/.claude/skills
ln -s $CCSKILL_NANOBANANA_DIR/.claude/skills/nano-banana-pro \
      /path/to/project/.claude/skills/nano-banana-pro
```

### 方法B: MCPサーバー

```bash
# nanobanana-pro-mcp のインストール
# Claude Desktop設定に追加することで利用可能
```

### 方法C: Vertex AI API 直接呼び出し

```python
# ADC（Application Default Credentials）認証
# gemini-3-pro-image-preview モデルを使用
```

---

## 4. 実践ワークフロー

### Step 1: マークダウン原稿の準備

サービス概要を構造化したマークダウンファイルを作成：

```markdown
# サービス名

## 課題
- ユーザーが抱える問題

## 解決策
- サービスの提供価値

## 機能
- 主要機能1
- 主要機能2

## 効果
- 定量的な成果
```

### Step 2: Claude Codeでスライド構成を生成

Claude Codeに以下のプロンプトを実行：

```
このマークダウンをMarp形式のスライドに変換してください。
各スライドに適切な図解のプロンプトを含めてください。
ブランドカラー: #[TimeWellのブランドカラー]
```

### Step 3: Nano Banana Proで画像生成

効果的なプロンプトの6要素：

| 要素 | 説明 | 例 |
|------|------|-----|
| 主題 | 画像の中心となる情報 | 「社内情報検索のワークフロー図」 |
| 構図 | テキストと図表の配置 | 「左にフロー図、右に効果数値」 |
| アクション | 動きや方向性 | 「矢印で効率化のビフォー・アフター」 |
| 対象 | ペルソナ設定 | 「企業のDX推進担当者向け」 |
| スタイル | 視覚的トーン | 「モダン、ミニマル、青系グラデーション」 |
| 編集 | 修正指示 | 「テキストをより大きく」 |

### Step 4: PowerPoint/PDF出力

#### Claude Code PPTXスキル使用

```bash
# Claude Codeで /pptx コマンドを実行
# または Skill ツールで pptx を呼び出し
```

#### Marp CLI使用

```bash
# Marpでスライド生成
marp slides.md --pptx --output output.pptx
marp slides.md --pdf --output output.pdf
```

---

## 5. ブランドトーンの統一

### TimeWell ブランドガイドライン（推奨設定）

```yaml
colors:
  primary: "#[ブランドプライマリカラー]"
  secondary: "#[ブランドセカンダリカラー]"
  accent: "#[アクセントカラー]"

typography:
  heading: "Noto Sans JP Bold"
  body: "Noto Sans JP Regular"

style:
  - モダン・ミニマル
  - データビジュアライゼーション重視
  - 「時間を価値ある活動へ」のメッセージ
```

### Nano Banana Proへのスタイル指示例

```
スタイル: プロフェッショナルなビジネスプレゼンテーション
配色: 青と白を基調とした清潔感のあるデザイン
フォント: 明瞭で読みやすい日本語フォント
トーン: 信頼性と革新性を両立
```

---

## 6. 自動化パイプライン

### Claude Codeカスタムスラッシュコマンド

`.claude/commands/generate-slides.md` を作成：

```markdown
# スライド自動生成コマンド

## ステップ
1. 入力マークダウンを分析
2. スライド構成を設計
3. 各スライドの図解プロンプトを生成
4. Nano Banana Proで画像生成
5. Marp形式で統合
6. PPTX/PDF出力
```

### 実行例

```bash
claude-code /generate-slides services/zerock.md
```

---

## 7. ベストプラクティス

### DO（推奨）

- **Mermaid構文を活用**: フロー図やシーケンス図はMermaid形式で定義し、そのままNano Banana Proに渡す
- **セクション分離**: 固定セクション（表紙・終了）と可変セクション（コンテンツ）を明確に分ける
- **反復的改善**: 初回生成後、細かい調整で100%の成果物へ
- **構造化プロンプト**: JSON/YAML形式で指示を構造化

### DON'T（非推奨）

- 曖昧なプロンプト（「良い感じに」「かっこよく」）
- 一度に大量のスライド生成
- ブランドガイドラインなしでの生成

---

## 8. コスト・パフォーマンス

| 方法 | コスト | 速度 | 品質 |
|------|--------|------|------|
| Nano Banana Pro API | 従量課金 | 高速 | 高 |
| Google スライド統合 | 無料〜 | 中速 | 高 |
| Claude PPTX Skill | Pro/Team以上 | 高速 | 高 |

---

## 9. 参考リソース

### 公式ドキュメント
- [Claude Code Skills Documentation](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart)
- [Nano Banana Pro GitHub Skill](https://github.com/feedtailor/ccskill-nanobanana)

### 実践記事
- [Claude CodeとNano Banana Proで議事録から提案書スライドを自動生成](https://dev.classmethod.jp/articles/claude-code-nano-banana-pro-proposal-slide-generation/)
- [ソースコードからスライドを生成する方法](https://zenn.dev/khirasan/articles/code2slide-how-to)

### 代替ツール
- [MarkSlides](https://www.markslides.ai/) - Marpベースのスライド生成
- [Napkin AI](https://www.napkin.ai/) - テキストからビジュアル生成（PPTX出力対応）
- [Beautiful.ai](https://www.beautiful.ai/) - ブランド一貫性に強み

---

## 10. TimeWellホワイトペーパー生成の推奨フロー

```
1. 各サービスのマークダウン原稿を作成（本リポジトリ内）
   ↓
2. Claude Codeでスライド構成・プロンプトを生成
   ↓
3. Nano Banana Proでビジュアル生成
   ↓
4. ブランドカラー・フォントを適用
   ↓
5. PPTX/PDF出力
   ↓
6. 最終レビュー・微調整
```

この方法により、**ブランドトーンの一貫性**を保ちながら、**効率的にホワイトペーパー**を量産できます。
