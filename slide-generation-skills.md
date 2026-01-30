# Claude Code Skills によるスライド生成品質安定化ガイド

> カスタムスキルでブランドトーンを統一し、再現性の高いスライド生成を実現

---

## 1. Claude Code Skills とは

Claude Code Skills は、Claude の能力を拡張するカスタム指示セットです。プロジェクト固有のルール（ブランドガイドライン、コーディング規約）を適用し、一貫性のある出力を実現します。

### 利用可能な公式スキル

| スキル | 機能 |
|--------|------|
| **pptx** | PowerPoint プレゼンテーション作成・編集 |
| **xlsx** | Excel スプレッドシート作成・分析 |
| **docx** | Word ドキュメント作成・編集 |
| **pdf** | PDF ドキュメント生成 |

---

## 2. カスタムスキルの作成方法

### ディレクトリ構成

```
.claude/skills/
└── timewell-slide-generator/
    ├── SKILL.md              # 必須：メインの指示ファイル
    ├── brand-guidelines.md   # ブランドガイドライン
    ├── templates/            # テンプレートファイル
    │   ├── title-slide.md
    │   ├── content-slide.md
    │   └── closing-slide.md
    ├── examples/             # 使用例
    │   └── sample-output.md
    └── scripts/              # ヘルパースクリプト
        └── image-generator.py
```

### SKILL.md の書き方

```yaml
---
name: timewell-slide-generator
description: |
  TIMEWELLブランドに準拠したプレゼンテーション・ホワイトペーパーを生成します。
  ブランドカラー、フォント、トーンを統一し、Nano Banana Proと連携して
  図解・インフォグラフィックを自動生成します。

  使用シーン：
  - サービス紹介スライドの作成
  - ホワイトペーパーの生成
  - 営業資料の作成
  - イベント登壇資料の作成
---

# TIMEWELL スライド生成スキル

## ブランドガイドライン

### カラーパレット
- プライマリ: [ブランドプライマリカラー]
- セカンダリ: [ブランドセカンダリカラー]
- アクセント: [アクセントカラー]
- テキスト: #333333
- 背景: #FFFFFF

### フォント
- 見出し: Noto Sans JP Bold
- 本文: Noto Sans JP Regular
- サイズ: 見出し24pt / 本文14pt

### トーン
- プロフェッショナルかつ親しみやすい
- データドリブンで説得力のある表現
- 「時間を価値ある活動へ」のメッセージを反映

## スライド構成ルール

### 必須スライド
1. **タイトルスライド**: サービス名、キャッチコピー、ロゴ
2. **課題提起**: ターゲットの抱える問題
3. **ソリューション**: サービスの提供価値
4. **機能詳細**: 主要機能3-5つ
5. **効果・実績**: 定量的な成果
6. **料金・プラン**: （必要に応じて）
7. **CTA**: 次のアクション

### 1スライドあたりの情報量
- 見出し: 1つ
- 本文: 3-5ポイント
- 図解: 1つ（推奨）

## 画像生成指示

### Nano Banana Pro プロンプトテンプレート

インフォグラフィック生成時:
```
スタイル: プロフェッショナルなビジネスプレゼンテーション
配色: [ブランドカラー]を基調とした清潔感のあるデザイン
フォント: 明瞭で読みやすい日本語フォント
内容: [具体的な図解内容]
形式: 16:9 スライド用
```

### 図解タイプ
- フロー図: 業務プロセスの可視化
- 比較表: Before/After
- 数値グラフ: ROI・効果測定
- アイコン付きリスト: 機能一覧

## 出力形式

### Marp形式（推奨）
```markdown
---
marp: true
theme: timewell
paginate: true
---

# タイトル

---

## セクション見出し

- ポイント1
- ポイント2
- ポイント3

![図解](./images/diagram.png)
```

### PPTX形式
Claude Code の /pptx スキルと連携して出力

## 品質チェックリスト

- [ ] ブランドカラーが統一されている
- [ ] フォントサイズが適切
- [ ] 1スライドの情報量が適切
- [ ] 図解が含まれている
- [ ] CTA が明確
```

---

## 3. スキルのインストール

### ローカルプロジェクトへのインストール

```bash
# プロジェクトディレクトリで
mkdir -p .claude/skills/timewell-slide-generator
# SKILL.md と関連ファイルを配置
```

### グローバルインストール

```bash
# ホームディレクトリに配置
mkdir -p ~/.claude/skills/timewell-slide-generator
```

### 外部スキルのリンク

```bash
# シンボリックリンクで共有
ln -s /path/to/shared/skills/timewell-slide-generator \
      ./.claude/skills/timewell-slide-generator
```

---

## 4. スキルの呼び出し方

### 自動呼び出し

Claude は description を見て、関連するタスクの際に自動的にスキルを呼び出します。

```
「ZEROCKのサービス紹介スライドを作成して」
→ description にマッチ → スキル自動読み込み
```

### 手動呼び出し

```bash
/timewell-slide-generator
```

---

## 5. 品質安定化のベストプラクティス

### description の書き方

スキルが正しく呼び出されるかどうかは **description の書き方で9割決まります**。

**良い例**:
```yaml
description: |
  TIMEWELLブランドのプレゼンテーション資料を生成します。
  サービス紹介、ホワイトペーパー、営業資料の作成時に使用。
  ブランドカラー・フォント・トーンを自動適用。
```

**悪い例**:
```yaml
description: スライドを作成するスキル
```

### SKILL.md の簡潔さ

- **500行以下** に抑える
- 詳細情報は別ファイルに分割して参照
- Claude が既に知っている情報は省略

### 参照ファイルの活用

```markdown
詳細なブランドガイドラインは `brand-guidelines.md` を参照してください。
```

---

## 6. Nano Banana Pro との連携

### セットアップ

1. **ccskill-nanobanana のインストール**

```bash
git clone https://github.com/feedtailor/ccskill-nanobanana.git
export CCSKILL_NANOBANANA_DIR="/path/to/ccskill-nanobanana"
```

2. **スキル内での呼び出し**

SKILL.md 内で画像生成が必要な場合の指示:

```markdown
## 画像生成

図解が必要な場合は、Nano Banana Pro スキルを使用してください。

### プロンプト例
「TIMEWELLブランドカラーで、情報検索のBefore/Afterを示すインフォグラフィック。
左側に30分かかる手動検索、右側に10秒で完了するAI検索。16:9形式。」
```

---

## 7. PPTX スキルとの連携

### Claude 公式 PPTX スキルの活用

API経由で利用する場合:

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "TIMEWELLのZEROCKサービス紹介プレゼンを5スライドで作成"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

### Claude Code CLI での利用

```bash
# /pptx スキルを呼び出し
claude-code /pptx
```

---

## 8. テンプレートの活用

### 既存テンプレートのアップロード

Claude の強みは **既存のPowerPointファイルをアップロードして、その構成を維持しながら中身を更新できる** 点です。

1. 会社のブランドテンプレートを用意
2. 各スライドタイプの空白版を作成
3. Claude にアップロードして分析
4. インベントリをマークダウンで保存

### テンプレート分析プロンプト

```
このPowerPointテンプレートを分析してください。
- すべてのスライドレイアウトをリスト化
- 各レイアウトの用途を説明
- カラーパレットを抽出
- フォント情報を抽出
結果をマークダウンで保存してください。
```

---

## 9. 自動化パイプライン

### カスタムコマンドの作成

`.claude/commands/generate-whitepaper.md`:

```markdown
# ホワイトペーパー生成コマンド

## 入力
- サービス名
- マークダウン原稿ファイル

## 実行ステップ
1. timewell-slide-generator スキルを読み込み
2. マークダウン原稿を分析
3. スライド構成を設計
4. Nano Banana Pro で図解生成
5. Marp形式でスライド出力
6. PPTX/PDFに変換
```

### 実行例

```bash
claude-code /generate-whitepaper services/zerock.md
```

---

## 10. トラブルシューティング

### スキルが呼び出されない

**原因**: description が曖昧
**対策**: 具体的なユースケースを description に記載

### 出力の品質がバラつく

**原因**: 指示が不十分
**対策**: SKILL.md にチェックリストを追加

### ブランドカラーが反映されない

**原因**: カラーコードが不明確
**対策**: HEX値で明示的に指定

---

## 11. 参考リソース

### 公式ドキュメント
- [Claude Code Skills（日本語）](https://code.claude.com/docs/ja/skills)
- [スキル作成のベストプラクティス](https://platform.claude.com/docs/ja/agents-and-tools/agent-skills/best-practices)
- [Agent Skills Quickstart](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart)

### コミュニティリソース
- [Claude Code Skills 実装ガイド](https://tech-lab.sios.jp/archives/50154)
- [Claude Code Skills の使い方と汎用テンプレート](https://tech-lab.sios.jp/archives/50570)
- [Marp × Claude Code 実践ガイド](https://qiita.com/toku345/items/11158328ca098957ff27)

### GitHub
- [ccskill-nanobanana](https://github.com/feedtailor/ccskill-nanobanana)
- [claude-code-general-skills](https://github.com/atomic-kanta-sasaki/claude-code-general-skills)

---

## 12. TIMEWELL 推奨ワークフロー

```
1. マークダウン原稿作成（本リポジトリの services/ ディレクトリ）
   ↓
2. timewell-slide-generator スキルを呼び出し
   ↓
3. スキルがブランドガイドラインを自動適用
   ↓
4. Nano Banana Pro で図解を生成
   ↓
5. Marp → PPTX/PDF に変換
   ↓
6. 品質チェック（スキル内のチェックリスト使用）
   ↓
7. 最終調整・出力
```

この方法により、**ブランドトーンの一貫性**と**再現性の高い品質**を両立したスライド生成が可能になります。
