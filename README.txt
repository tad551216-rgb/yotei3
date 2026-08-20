わが家の予定板（yotei3）PWA インストール対応キット
作成: 忠司 / ヤマトシステム 向け

■ リポジトリへの配置
  yotei3/
    index.html                ← 下記①②を追記
    manifest.webmanifest      ← 新規追加
    sw.js                     ← 無ければ追加／有れば fetch ハンドラを確認
    icon-192.png              ← 新規追加
    icon-512.png              ← 新規追加

■ 手順
  1. icon-192.png / icon-512.png / manifest.webmanifest を yotei3 直下にアップロード
  2. index-head-snippet.html の①を index.html の </head> 直前に貼り付け
  3. 同ファイルの②を </body> 直前に貼り付け（SW 登録が既にあれば不要）
  4. sw.js が無ければアップロード（既存がある場合は上書きしない。
     'fetch' の addEventListener が入っているかだけ確認）
  5. commit → GitHub Pages の反映を1〜2分待つ

■ 反映されないとき（Chrome は manifest をキャッシュします）
  Chrome → 設定 → サイトの設定 → 保存されているデータ →
  tad551216-rgb.github.io → 削除 → ページを再読み込み
  その後、メニューに「アプリをインストール」が出ます。

■ インストール判定に必要な条件（すべて満たすこと）
  - HTTPS（GitHub Pages は OK）
  - manifest がリンクされている
  - name / short_name
  - start_url と scope が /yotei3/ を指している
  - display: standalone（または fullscreen / minimal-ui）
  - 192px と 512px の PNG アイコン
  - fetch イベントを持つ Service Worker が登録されている
