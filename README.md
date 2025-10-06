# Invader Game with p5js　(3ファイル構成)

p5.js を使ったインベーダー風の最小プロトタイプです。
HTML / CSS / JS を分離し、ブラウザだけで動作します（CDN読み込み）。

## デモの主な仕様

- プレイヤー移動（← → / A D）

- 弾発射（Space、連射クールダウンあり）

- 敵の横移動＆端で折り返し＋段下げ

- 全滅で YOU WIN!、侵攻されると GAME OVER

- R でリスタート

ファイル構成
```
├── index.html    # エントリ（p5.js CDN読込 & DOM配置）
├── styles.css    # 見た目（ダーク背景・キャンバス枠など）
└── sketch.js     # p5.js スケッチ（ゲームロジック一式）
```

## 動かし方（ローカル）
もっとも簡単な方法

- この3ファイルを同じフォルダに配置

- index.html をダブルクリックでブラウザ起動

(p5.js を CDN から読み込むため、インターネット接続が必要です)

##操作方法

- 移動：← / → または A / D

- 攻撃：Space

- リスタート：R

## 依存・要件

- モダンブラウザ（Chrome / Edge / Firefox / Safari など）

- オンライン（p5.js CDN: https://cdn.jsdelivr.net/npm/p5@1.11.0/lib/p5.min.js）
