/* つくる手帖 ── キャッシュはオリジン単位で共有されます。
   github.io は全リポジトリが同じオリジンなので、
   自分の名前空間（TT_NS）のものだけを消します。 */
// わが家の予定板 - オフライン対応サービスワーカー
// 一度開けば、以後はサーバーに繋がらなくても起動できます。
// 画面はまずキャッシュから表示し、裏で新しい版を取得して次回に反映します。
const TT_NS = 'tt:yotei3:';
const TT_OLD = 'wagaya-v2';   /* 旧名。次の更新のときに消して構いません */
const CACHE = TT_NS + 'v2';
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-180.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter(k => (k.startsWith(TT_NS) || k === TT_OLD) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      const cached = await c.match(e.request, { ignoreSearch: true });
      const network = fetch(e.request)
        .then((res) => {
          if (res && res.ok) c.put(e.request, res.clone());
          return res;
        })
        .catch(() => null);
      // キャッシュがあれば即表示、なければネットワーク、それも無理ならアプリ本体を返す
      return cached || (await network) || c.match("./index.html");
    })
  );
});
