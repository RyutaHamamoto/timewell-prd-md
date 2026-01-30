const { GoogleAuth } = require('google-auth-library');
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ===== 設定 =====
const CONFIG = {
  credentialsPath: '/Users/hamamotoryuuta/Desktop/timewell-corp-key.json',
  projectId: 'gen-lang-client-0454362783',
  modelId: 'gemini-3-pro-image-preview',
  endpoint: 'aiplatform.googleapis.com',
  outputDir: '/Users/hamamotoryuuta/Documents/timewell-prd-md/output/workspace',
  waitTime: 30000,        // Tier2: 30秒待機
  rateLimitWait: 90000,   // 429エラー時: 90秒
  maxRetries: 5
};

// ===== サービス定義 =====
const SERVICES = {
  excheck: {
    name: 'ZEROCK Ex-CHECK',
    subtitle: '輸出管理AIエージェント',
    tagline: '該非判定を5秒で自動化',
    colors: { primary: '#FF6B9D', secondary: '#FF9472' },
    slides: [
      { type: 'cover' },
      { type: 'content', header: '課題', oneMessage: '輸出管理業務は複雑で時間がかかり、担当者の負担が大きい', content: `
【現状の課題】
• 取引先調査に1件あたり30分〜1時間
• 複数の規制リスト（外為法、EAR、EU規制等）を手動照合
• 判定ミスは法的リスクに直結
• 業務が属人化し、担当者不在時に対応困難
• 監査対応のための証跡管理が煩雑` },
      { type: 'content', header: 'EARアフィリエイト・ルール', oneMessage: '2026年11月施行の新規制への対応が急務', content: `
【規制の概要】
• エンティティ・リスト掲載企業の50%以上を保有する関連会社も規制対象に
• MEUリスト、SDNリストにも適用範囲拡大
• 海外子会社・関連会社の取引も精査が必要

【現状の対応と課題】
• 誓約書・表明保証での対応 → 取引先の自己申告に依存
• 資本関係の調査が困難 → 間接的な株主構成の把握は現実的に難しい` },
      { type: 'content', header: 'ソリューション', oneMessage: 'Ex-CHECKが複数規制リストを一括照合し、5秒で懸念度を判定', content: `
【Ex-CHECKの特徴】
• 複数規制リスト（外為法、EAR、EU、国連制裁等）を同時チェック
• AIによる5段階懸念度スコアリング
• 根拠URL付きエビデンスレポート自動生成
• Webから関係性情報を自動収集・分析
• 岡山大学との共同開発による高精度AI（検出精度99%以上）` },
      { type: 'content', header: '機能1: 一括リスト照合', oneMessage: '複数の規制リストを同時にチェックし、漏れを防止', content: `
【対応リスト】
• 外為法リスト規制（日本）
• EAR - 米国輸出管理規則
• EU規制リスト
• 国連制裁リスト
• その他各国規制リスト

【メリット】
• 複数リストの確認を一度の操作で完了
• 見落としリスクを大幅に低減
• 規制更新時も自動反映` },
      { type: 'content', header: '機能2: 懸念度スコアリング', oneMessage: 'AIが5段階で懸念度を判定し、対応の優先順位を明確化', content: `
【5段階判定】
┌─────────────────────────────────┐
│ レベル1: 懸念なし → 通常取引可     │
│ レベル2: 低懸念 → 確認推奨        │
│ レベル3: 中懸念 → 詳細調査必要    │
│ レベル4: 高懸念 → 取引慎重検討    │
│ レベル5: 最高懸念 → 取引不可の可能性│
└─────────────────────────────────┘

• GraphRAG技術による関係性分析
• 最終判断は人間が行う設計（法的責任を明確化）` },
      { type: 'content', header: '機能3: エビデンスレポート', oneMessage: '判定根拠を明示したレポートで監査対応も万全', content: `
【レポート内容】
• 判定結果と懸念度スコア
• 根拠URLの明示（情報ソースを明確化）
• 関連規制リストへの該当状況
• 調査日時・条件の記録

【活用シーン】
• 監査対応の証跡として利用
• 社内稟議の添付資料
• 取引判断の記録・履歴管理` },
      { type: 'content', header: '導入効果', oneMessage: '調査業務時間90%削減、検出精度99%以上を実現', content: `
【Before → After】
┌───────────────────────────────────────┐
│ 取引先調査    30分〜1時間 → 5秒      │
│ 検出精度      担当者依存 → 99%以上   │
│ レポート作成  都度手作業 → 自動生成  │
└───────────────────────────────────────┘

【定性効果】
• ヒューマンエラーの防止
• 業務の属人化解消
• コンプライアンス体制強化` },
      { type: 'content', header: '対象業界', oneMessage: '輸出取引を行う製造業・商社・研究機関に最適', content: `
【主要ターゲット】
• 製造業: 精密機器、電子部品、化学品
• 商社: 国際取引全般
• 研究機関: 技術輸出管理
• 物流企業: 輸出入業務

【推奨企業規模】
• 輸出取引が月10件以上
• 該非判定担当者が1名以上
• コンプライアンス強化を検討中` },
      { type: 'content', header: 'セキュリティ', oneMessage: 'AWS上での安全な運用とISMS準拠で機密情報を保護', content: `
【セキュリティ対策】
• AWS上での安全な稼働
• データ暗号化（通信・保存）
• ISMS準拠

【データ保護方針】
• お客様データは再学習に使用しない
• 機密情報の外部流出リスクを排除
• 監査ログの完全保持` },
      { type: 'content', header: '導入フロー', oneMessage: 'トライアルから本格導入まで、専任サポートが伴走', content: `
【導入ステップ】
┌─────────────────────────────┐
│ 1. 無料相談・ヒアリング    │
│        ↓                   │
│ 2. 現状業務の分析          │
│        ↓                   │
│ 3. トライアル導入          │
│        ↓                   │
│ 4. 本格導入・研修          │
│        ↓                   │
│ 5. 継続サポート            │
└─────────────────────────────┘` },
      { type: 'cta', header: 'お問い合わせ', oneMessage: '輸出管理業務の効率化、まずは無料相談から', url: 'https://timewell.jp/', contact: '株式会社TIMEWELL' }
    ]
  },

  base: {
    name: 'TIMEWELL BASE',
    subtitle: 'AIコミュニティ運営プラットフォーム',
    tagline: 'SNS投稿とイベントページを60秒で自動生成',
    colors: { primary: '#764ba2', secondary: '#667eea' },
    slides: [
      { type: 'cover' },
      { type: 'content', header: '課題', oneMessage: 'コミュニティ運営は想像以上に時間がかかり、本業を圧迫', content: `
【運営者の悩み】
• SNS投稿作成に毎日2時間
• イベントページ作成に2時間/回
• 運営業務全体で1日6時間以上
• 本来やりたいコミュニティ活動に時間が割けない

【結果として…】
• 更新頻度が落ちてエンゲージメント低下
• イベント開催回数が減少
• 運営者の疲弊・離脱` },
      { type: 'content', header: 'ソリューション', oneMessage: 'BASEならAIが運営業務を自動化、週28時間を取り戻す', content: `
【導入効果】
┌────────────────────────────────────┐
│ SNS投稿作成  2時間/日 → 15分/日   │
│ イベントページ 2時間 → 60秒       │
│ 運営業務全体  6時間/日 → 2時間/日 │
│ 取り戻した時間: 週28時間          │
└────────────────────────────────────┘

【最新実績（2026年1月）】
• 月間10万PV突破
• ユニークユーザー2万人達成
• 数千名規模のイベント対応実績` },
      { type: 'content', header: '機能1: SNS投稿自動生成', oneMessage: 'テーマを入力するだけで各SNSに最適化された投稿を60秒で生成', content: `
【対応プラットフォーム】
• Twitter/X: 文字数制限を考慮した投稿
• Instagram: ハッシュタグ・画像提案付き
• Facebook: 長文・エンゲージメント重視

【特徴】
• プラットフォームごとに最適化
• トーン&マナーの調整可能
• 画像提案機能` },
      { type: 'content', header: '機能2: イベントページ自動生成', oneMessage: 'ワンクリックでバナーから申込フォームまで一括生成', content: `
【自動生成される内容】
• イベントバナー（デザイン済み）
• 説明文（魅力的なコピー）
• 申し込みフォーム
• リマインダーメール
• 参加者向け案内

【所要時間】
従来: 2時間 → BASE: 60秒（99%削減）` },
      { type: 'content', header: '機能3: オールインワン管理', oneMessage: 'SNS・イベント・メンバー・決済・分析、すべてが一つで完結', content: `
【統合機能】
┌─────────────────────────────────┐
│ SNS連携      複数プラットフォーム一括管理 │
│ イベント管理  作成・集客・当日運営        │
│ メンバー管理  属性管理・セグメント        │
│ 決済         オンライン決済対応          │
│ 分析         エンゲージメント・ROI分析   │
└─────────────────────────────────┘

• ツール間の連携不要
• データの一元管理` },
      { type: 'content', header: '機能4: AI分析機能', oneMessage: 'データに基づいた運営改善を自動提案', content: `
【分析・提案内容】
• メンバー行動データの自動分析
• 最適な投稿タイミングの提案
• 人気テーマの発見
• エンゲージメント向上施策の提案

【活用メリット】
• 勘に頼らない運営判断
• 効果的な施策の発見
• メンバー満足度の向上` },
      { type: 'content', header: '対象コミュニティ', oneMessage: 'オンラインサロンから企業ファンコミュニティまで幅広く対応', content: `
【オンラインサロン】
• ビジネス系サロン
• クリエイター系サロン
• 趣味コミュニティ

【企業ファンコミュニティ】
• 顧客エンゲージメント
• ブランドロイヤルティ向上

【専門家・業界コミュニティ】
• 士業ネットワーク
• 技術者コミュニティ` },
      { type: 'content', header: '導入事例', oneMessage: '大規模イベントから地域活動まで、多様な実績', content: `
【事例紹介】

YOXO Festival
横浜スタートアップイベント

TechGALA
名古屋スタートアップカンファレンス

アドベンチャーワールド ドリームデイ
大規模ファンイベント

• 数千名規模のイベントにも対応
• スムーズな運営をサポート` },
      { type: 'content', header: '料金プラン', oneMessage: 'クレカ不要のFREEプランから、本格運営のENTERPRISEまで', content: `
【プラン一覧】
┌─────────────────────────────────────┐
│ FREE       ¥0      クレカ不要・手数料4.8% │
│ LITE       ¥2,980  月2,000通メール配信    │
│ PRO        ¥14,800 月50,000通・属性管理   │
│ ENTERPRISE 個別見積 無制限・専任サポート  │
└─────────────────────────────────────┘

【全プラン共通】
• AI投稿生成機能
• イベントページ作成
• 基本分析機能` },
      { type: 'content', header: '始め方', oneMessage: '3ステップ、クレカ不要で今日から無料で始められる', content: `
【開始ステップ】
┌─────────────────────────────┐
│ 1. 無料アカウント作成      │
│    （クレカ不要）          │
│        ↓                   │
│ 2. コミュニティ設定        │
│        ↓                   │
│ 3. 運営開始！              │
└─────────────────────────────┘

【すぐに使える機能】
• SNS投稿生成
• イベントページ作成
• 基本的なメンバー管理` },
      { type: 'cta', header: 'お問い合わせ', oneMessage: 'コミュニティ運営の効率化、無料で今すぐ始めよう', url: 'https://base.timewell.jp/', contact: '株式会社TIMEWELL' }
    ]
  },

  warp: {
    name: 'WARP',
    subtitle: 'AI人材育成プログラム',
    tagline: '現役AI開発者による実践型AI研修',
    colors: { primary: '#7c3aed', secondary: '#ec4899' },
    slides: [
      { type: 'cover' },
      { type: 'content', header: '課題', oneMessage: 'AI導入は進めたいが、活用できる人材がいない', content: `
【企業が直面する課題】
• AIツールを導入しても使いこなせない
• 「AIでできること」がわからない
• 研修を受けても実務に活かせない
• 教科書的な知識では現場で役立たない

【結果として…】
• AI投資が成果につながらない
• 競合他社に後れを取る
• DX推進が停滞` },
      { type: 'content', header: 'WARPの強み', oneMessage: 'ZEROCKを自社開発するエンジニアが直接指導する実践型研修', content: `
【WARPが選ばれる3つの理由】

1. 現役AI開発者が講師
   • ZEROCKなどのAIエージェントを自社開発
   • 教科書的でない、現場のノウハウを伝授

2. 毎月コンテンツ更新
   • AIの急速な進化に対応
   • 常に最新のツール・手法を学べる

3. 環境に合わせたカスタマイズ
   • Google Workspace / Microsoft Copilot
   • 制約のある環境にも追加料金なしで対応` },
      { type: 'content', header: '実績', oneMessage: '累計受講者250名以上、満足度4.8/5.0の高評価', content: `
【プログラム実績】
┌─────────────────────────────┐
│ 累計受講者       250名以上  │
│ 修了率           90%       │
│ 業務効率向上実感率 92%      │
│ 満足度           4.8/5.0   │
│ 起業支援         15社以上  │
└─────────────────────────────┘

【受講者の声】
• 「開発2ヶ月で売上2,000万円を達成」（起業家）
• 「年間数億円のコスト削減を実現」（大手企業DX推進担当）
• 「提案書作成時間80%削減」（営業部長）` },
      { type: 'content', header: 'プログラム一覧', oneMessage: '1日体験から3ヶ月集中まで、目的に合わせて選べる', content: `
【プログラムラインナップ】
┌─────────────────────────────────────────┐
│ WARP 1Day  1日   全社員向け    要相談    │
│            ドアノック商材・初回導入に最適 │
├─────────────────────────────────────────┤
│ WARP NEXT  3ヶ月 DXコアメンバー ¥500,000 │
│            本格的なAI人材育成             │
├─────────────────────────────────────────┤
│ WARP BASIC 年間  自己学習者    ¥100,000/名│
│            自分のペースで学習             │
└─────────────────────────────────────────┘` },
      { type: 'content', header: 'WARP NEXT', oneMessage: 'DX推進コアメンバー向け3ヶ月集中プログラム', content: `
【プログラム概要】
• 期間: 3ヶ月（計30時間）
• 対象: DX推進担当者、若手〜中堅リーダー
• 推奨人数: 10〜20名

【カリキュラム】
Day 1-3: 基礎（AIとプロンプト設計）
Day 4-6: 実践（業務効率化ワークフロー）
Day 7-9: 応用（社内アプリ開発・展開戦略）
Day 10: 成果発表

【特典】
• 個別メンタリング月1回×3回
• WARP BASIC 1年間無料` },
      { type: 'content', header: 'WARP BASIC', oneMessage: '年間¥100,000で毎月更新される最新AIスキルを学び放題', content: `
【3段階スキルアップ体系】

Stage 1: AIを「使う」
→ 個人作業効率2倍以上向上

Stage 2: AIを「組み立てる」
→ 定型業務80%以上自動化

Stage 3: AIに「働かせる」
→ 3ヶ月でWebサービス開発・新規事業実現

【特徴】
• オンライン（動画＋実践教材）
• 毎月のコンテンツ更新
• 修了証発行` },
      { type: 'content', header: '講師陣', oneMessage: 'ZEROCKを開発した現役エンジニアが直接指導', content: `
【講師紹介】

濱本隆太（代表取締役）
• 信州大学 特任准教授
• 大手製造業DX・AI導入実績多数

安藤晃規（COO）
• 元パナソニックエンジニア
• WARPプログラム責任者

内藤一樹（CTO）
• ZEROCK開発責任者・元NTT

安藤義記（VPoP）
• TIMEWELL BASE開発責任者
• 世界ロボコン準優勝` },
      { type: 'content', header: '成功事例', oneMessage: '売上2,000万円達成、年間数億円のコスト削減など成果続出', content: `
【事例1: 起業家】
「開発2ヶ月で売上2,000万円を達成」
→ WARPで学んだAI開発スキルを即座に事業化

【事例2: 大手企業DX推進担当】
「年間数億円のコスト削減を実現」
→ 組織全体のAI活用を推進

【事例3: 営業部長】
「提案書作成時間80%削減」
→ 生成AIを営業業務に完全導入` },
      { type: 'content', header: 'FAQ', oneMessage: 'よくあるご質問にお答えします', content: `
Q. 環境制約があっても受講できますか？
A. 対応可能です。Google WorkspaceやMicrosoft Copilotのみの環境でも追加料金なしで対応。

Q. 育休中でも受講できますか？
A. WARP BASICは自分のペースで学習でき、育休中のスキルアップに最適です。

Q. コンテンツ更新頻度は？
A. AIの進化に合わせ、毎月更新しています。

Q. 修了証は発行されますか？
A. はい、各プログラム修了時に発行します。` },
      { type: 'cta', header: 'お問い合わせ', oneMessage: 'AI人材育成、まずは無料相談から', url: 'https://timewell.jp/warp', contact: '株式会社TIMEWELL' }
    ]
  },

  warp1day: {
    name: 'WARP 1Day',
    subtitle: '1日完結型AI研修',
    tagline: 'まず1日、従業員の皆さんの時間を取ってやってみませんか？',
    colors: { primary: '#7c3aed', secondary: '#ec4899' },
    slides: [
      { type: 'cover' },
      { type: 'content', header: '課題', oneMessage: 'AI導入を検討しているが、何から始めればいいかわからない', content: `
【よくある悩み】
• 「AIを導入したいけど、何から始めれば？」
• 「社員がAIに抵抗感を持っている」
• 「高額な研修は予算が取りにくい」
• 「まずは効果を確認してから本格導入したい」

【結果として…】
• AI導入が先送りになる
• 競合他社との差が開く
• DX推進が進まない` },
      { type: 'content', header: 'WARP 1Dayとは', oneMessage: '企業のAI導入への「最初の一歩」として設計されたドアノック商材', content: `
【位置づけ】
┌─────────────────────────────────────┐
│ ファーストコンタクト               │
│ → AI研修に興味がある企業様への入口 │
├─────────────────────────────────────┤
│ 効果実感                           │
│ → 1日で「AIでここまでできる」を体験│
├─────────────────────────────────────┤
│ 次のステップ                       │
│ → WARP NEXTやWARP BASICへの導線   │
└─────────────────────────────────────┘

• 短期間・低リスクでAI研修を体験
• 効果を確認してから本格導入を検討` },
      { type: 'content', header: '対象者', oneMessage: '全社員向け、AI活用を検討中の企業に最適', content: `
【対象】
• 全社員向けAI研修
• AI活用を検討中の企業
• 推奨人数: 20名以上

【こんな企業におすすめ】
• 「まずは少ない投資でAI研修を試したい」
• 「社員のAIアレルギーを解消したい」
• 「本格導入前に効果を確認したい」
• 「経営層を説得するための材料が欲しい」` },
      { type: 'content', header: '実施形式', oneMessage: 'ハンズオン形式で参加者全員が実践、カスタマイズも可能', content: `
【形式】
• 対面 / オンライン選択可
• ハンズオン形式（参加者全員がPCを使用）
• 講義＋実践演習

【カスタマイズ対応】
• 貴社の課題・目的に応じた内容設計
• 業界特有のユースケースに対応
• 使用ツールの調整（ChatGPT / Claude / その他）` },
      { type: 'content', header: 'プログラム例', oneMessage: '午前は基礎習得、午後は業務に直結する実践ワーク', content: `
【プログラム構成】

┌─────────────────────────────────────┐
│ 午前                               │
│ • AI基礎講座                       │
│ • プロンプト設計の基本             │
│ • ChatGPT/Claude活用実践           │
├─────────────────────────────────────┤
│ 午後                               │
│ • 業務効率化ワーク                 │
│ • AIツール実践演習                 │
│ • 成果発表・振り返り               │
└─────────────────────────────────────┘

※内容はカスタマイズ可能` },
      { type: 'content', header: '期待効果', oneMessage: '1日で「AIでここまでできる」を実感し、全社のAI意識が変わる', content: `
【1日で得られるもの】
• AIへの心理的ハードルの解消
• 基本的なプロンプト設計スキル
• 自業務への活用イメージ
• 「これは使える」という実感

【組織への効果】
• AI活用への前向きな雰囲気醸成
• 本格導入への意思決定材料
• 社内AI推進メンバーの発掘
• 経営層への報告材料` },
      { type: 'content', header: 'WARPプログラム全体像', oneMessage: '1Dayから始めて、段階的にAI活用を深められる', content: `
【ステップアップパス】

┌─────────────────────────────────────┐
│ WARP 1Day（本プログラム）          │
│ → まずは1日で効果を実感            │
│                ↓                   │
│ WARP NEXT（3ヶ月集中）             │
│ → DXコアメンバーを本格育成         │
│                ↓                   │
│ WARP BASIC（年間学習）             │
│ → 全社員の継続的スキルアップ       │
└─────────────────────────────────────┘

• 効果を確認しながら段階的に拡大
• 投資リスクを最小化` },
      { type: 'content', header: '講師紹介', oneMessage: 'ZEROCKを開発した現役AIエンジニアが直接指導', content: `
【なぜWARPの講師は違うのか】

• ZEROCKなどのAIエージェントを自社開発
• 教科書的な知識ではなく、実際の開発・導入現場のノウハウ
• 「使えるAI」にフォーカスした実践的な内容

【講師陣】
• 濱本隆太（代表取締役）- 信州大学特任准教授
• 安藤晃規（COO）- WARPプログラム責任者
• 内藤一樹（CTO）- ZEROCK開発責任者
• 安藤義記（VPoP）- BASE開発責任者` },
      { type: 'content', header: '導入事例', oneMessage: '様々な業界で「まずは1Day」から始めて成果を実感', content: `
【製造業A社（従業員500名）】
• 全社AI研修の第一歩として導入
• 「想像以上に実用的」と好評
• その後WARP NEXTを導入決定

【金融機関B社（従業員1,000名）】
• 部門横断でのAI意識統一に活用
• 「AIへの抵抗感がなくなった」
• 社内AI推進チームを発足

【サービス業C社（従業員200名）】
• 経営層向けにカスタマイズ実施
• 本格的なAI投資の意思決定材料に` },
      { type: 'content', header: '料金・お申込み', oneMessage: '人数・内容に応じてお見積り、まずはお気軽にご相談を', content: `
【料金】
要相談（人数・内容に応じてお見積り）

【含まれるもの】
• 1日研修プログラム
• 教材・資料
• 修了証
• 事後フォローアップ

【お申込みの流れ】
1. 無料相談・ヒアリング
2. カスタマイズ提案・お見積り
3. 日程調整・実施
4. 振り返り・次のステップ相談` },
      { type: 'cta', header: 'お問い合わせ', oneMessage: 'まず1日、試してみませんか？無料相談受付中', url: 'https://timewell.jp/warp', contact: '株式会社TIMEWELL' }
    ]
  }
};

// ===== API関数 =====
async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: CONFIG.credentialsPath,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  const client = await auth.getClient();
  return (await client.getAccessToken()).token;
}

function buildCoverPrompt(service) {
  return `Create an elegant, professionally designed presentation COVER slide.

=== BACKGROUND ===
Beautiful gradient from ${service.colors.primary} to ${service.colors.secondary}

=== LAYOUT (CRITICAL - must be balanced) ===
Vertically centered composition with proper spacing:

- "${service.name}" - Large white bold text, vertically centered
- Below with breathing room: "${service.subtitle}" in white
- Below with spacing: "${service.tagline}" in smaller white text
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
NO: blue, green, cyan, or unrelated colors

=== FORMAT ===
16:9 aspect ratio, high resolution

=== IMPORTANT ===
- No logo icons or symbols (text only)
- Professional designer quality
- Clean, minimal, premium aesthetic
- Perfect vertical and horizontal balance
- DO NOT include any product mockups, phones, or device images`;
}

function buildContentPrompt(service, slide) {
  return `Create a professional, elegant presentation slide.

=== BACKGROUND ===
- Base: White (#FFFFFF)
- Overlay: Very subtle gradient from light ${service.colors.primary} to light ${service.colors.secondary} at 8% opacity
- Clean, minimal, refined

=== LAYOUT ===
- Top-left: "${slide.header}" in ${service.colors.primary} (bold, 28pt)
- Below header: "${slide.oneMessage}" in #333333 (16pt)
- Content area with generous spacing and balance

=== CONTENT ===
${slide.content}

=== DESIGN STYLE ===
Cards and boxes MUST follow:
- Opacity: 85-95% white (background subtly visible through)
- Heavy background blur effect (frosted glass)
- NO borders or outlines on cards
- NO shadows or extremely minimal
- Very soft rounded corners (24px+, corners feel like they melt)
- Generous padding inside cards

=== COLOR RESTRICTIONS (STRICT) ===
ONLY use these colors:
- ${service.colors.primary} (primary accent)
- ${service.colors.secondary} (secondary accent)
- White (#FFFFFF)
- Text grays (#333333, #666666, #999999)

DO NOT use: blue, green, cyan, or any other unrelated colors

=== FORMAT ===
16:9 aspect ratio, high resolution

=== IMPORTANT ===
- No logos or brand marks
- Japanese text must be clear and sharp
- Professional designer quality
- Clean, minimal, premium aesthetic
- DO NOT include any product mockups, phones, or device images`;
}

function buildCtaPrompt(service, slide) {
  return `Create a professional presentation CTA (Call to Action) slide.

=== BACKGROUND ===
- Base: White (#FFFFFF)
- Overlay: Very subtle gradient at 8% opacity
- Clean, minimal, refined

=== LAYOUT ===
Center: Large glassmorphism card with centered content

Card content:
- Title: "${slide.oneMessage}" - 28pt bold dark
- Subtitle: "まずはお気軽にご相談ください" - 14pt gray

Two buttons side by side:
- Button 1 (primary): "無料相談" - gradient background (${service.colors.primary} to ${service.colors.secondary}), white text, pill shape
- Button 2 (secondary): "資料請求" - 10% primary background, ${service.colors.primary} text, pill shape

- URL: "${slide.url}" - 16pt ${service.colors.primary} bold
- Company: "${slide.contact}" - 12pt gray

=== DESIGN STYLE ===
Card: 95% white opacity, NO borders, NO shadows, 32px corners
Buttons: 30px border-radius (pill shape)

=== COLOR RESTRICTIONS ===
ONLY: ${service.colors.primary}, ${service.colors.secondary}, white, grays
NO: blue, green, cyan, or unrelated colors

=== FORMAT ===
16:9 aspect ratio, high resolution

=== IMPORTANT ===
- Inviting, professional, clean minimal design
- Japanese text must be clear
- DO NOT include any product mockups, phones, or device images`;
}

async function generateSlideImage(prompt, outputPath, retries = 0) {
  try {
    const accessToken = await getAccessToken();
    const endpoint = `https://${CONFIG.endpoint}/v1/projects/${CONFIG.projectId}/locations/global/publishers/google/models/${CONFIG.modelId}:generateContent`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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
      if (retries < CONFIG.maxRetries) {
        console.log(`  ⚠️ Rate limited, waiting ${CONFIG.rateLimitWait/1000}s...`);
        await new Promise(r => setTimeout(r, CONFIG.rateLimitWait));
        return generateSlideImage(prompt, outputPath, retries + 1);
      }
      throw new Error('Max retries exceeded for rate limit');
    }

    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    for (const part of data.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        await fs.promises.writeFile(outputPath, Buffer.from(part.inlineData.data, 'base64'));
        return true;
      }
    }
    throw new Error('No image in response');
  } catch (error) {
    if (retries < CONFIG.maxRetries) {
      console.log(`  ⚠️ Error: ${error.message}, retrying...`);
      await new Promise(r => setTimeout(r, CONFIG.waitTime));
      return generateSlideImage(prompt, outputPath, retries + 1);
    }
    throw error;
  }
}

async function addImagePreserveAspect(slide, imagePath, x, y, maxWidth, maxHeight) {
  const metadata = await sharp(imagePath).metadata();
  const aspectRatio = metadata.width / metadata.height;
  let width = maxWidth;
  let height = width / aspectRatio;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  slide.addImage({ path: imagePath, x, y, w: width, h: height });
}

async function generateServiceSlides(serviceKey) {
  const service = SERVICES[serviceKey];
  const slidesDir = path.join(CONFIG.outputDir, `${serviceKey}-slides`);

  if (!fs.existsSync(slidesDir)) {
    fs.mkdirSync(slidesDir, { recursive: true });
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Generating ${service.name} (${service.slides.length} slides)`);
  console.log(`${'='.repeat(50)}`);

  const slideImages = [];

  for (let i = 0; i < service.slides.length; i++) {
    const slide = service.slides[i];
    const slideNum = String(i + 1).padStart(2, '0');
    const outputPath = path.join(slidesDir, `slide-${slideNum}.png`);

    let prompt;
    if (slide.type === 'cover') {
      prompt = buildCoverPrompt(service);
    } else if (slide.type === 'cta') {
      prompt = buildCtaPrompt(service, slide);
    } else {
      prompt = buildContentPrompt(service, slide);
    }

    console.log(`  [${i + 1}/${service.slides.length}] Generating: ${slide.type === 'cover' ? 'Cover' : slide.header}...`);

    await generateSlideImage(prompt, outputPath);
    slideImages.push(outputPath);
    console.log(`  ✅ Saved: slide-${slideNum}.png`);

    if (i < service.slides.length - 1) {
      await new Promise(r => setTimeout(r, CONFIG.waitTime));
    }
  }

  // Build PPTX
  console.log(`\n  Building PPTX...`);
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = `${service.name} - ${service.subtitle}`;
  pptx.author = '株式会社TIMEWELL';
  pptx.company = '株式会社TIMEWELL';

  for (let i = 0; i < slideImages.length; i++) {
    const pptxSlide = pptx.addSlide();
    if (fs.existsSync(slideImages[i])) {
      await addImagePreserveAspect(pptxSlide, slideImages[i], 0, 0, 10, 5.625);
    }
    // Page numbers (slides 2+)
    if (i > 0) {
      pptxSlide.addText(`${i + 1}`, {
        x: 9.3, y: 5.2, w: 0.5, h: 0.3,
        fontSize: 10, color: '888888', align: 'right'
      });
    }
  }

  const pptxPath = path.join(CONFIG.outputDir, `${service.name.replace(/\s+/g, '-')}.pptx`);
  await pptx.writeFile({ fileName: pptxPath });
  console.log(`  ✅ PPTX saved: ${pptxPath}`);

  return pptxPath;
}

// ===== メイン処理 =====
async function main() {
  const args = process.argv.slice(2);
  const servicesToGenerate = args.length > 0 ? args : Object.keys(SERVICES);

  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  TIMEWELL Service Slides Generator                 ║');
  console.log('║  Using Nano Banana Pro (Gemini 3 Pro Image)        ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log(`\nServices to generate: ${servicesToGenerate.join(', ')}`);
  console.log(`Wait time: ${CONFIG.waitTime/1000}s per slide`);

  const results = [];
  for (const serviceKey of servicesToGenerate) {
    if (!SERVICES[serviceKey]) {
      console.log(`\n⚠️ Unknown service: ${serviceKey}`);
      continue;
    }
    try {
      const pptxPath = await generateServiceSlides(serviceKey);
      results.push({ service: serviceKey, path: pptxPath, status: 'success' });
    } catch (error) {
      console.error(`\n❌ Error generating ${serviceKey}:`, error.message);
      results.push({ service: serviceKey, error: error.message, status: 'failed' });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('GENERATION COMPLETE');
  console.log('='.repeat(50));
  for (const result of results) {
    if (result.status === 'success') {
      console.log(`✅ ${result.service}: ${result.path}`);
    } else {
      console.log(`❌ ${result.service}: ${result.error}`);
    }
  }
}

main().catch(console.error);
