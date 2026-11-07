// The judges' page: one sentence on what HIRAKU is, a large play button, and the record opened on ④ (the results).
// The page's own tabs and its 「この記録を再生する」 button do the work; this only adds the bar and presses them.
(function () {
  const bar = document.createElement("div");
  bar.id = "judge-intro";
  bar.innerHTML =
    '<p class="ji-text"><b>HIRAKU</b> は、作りたいものを文で書くと、Claude が設計を作り、CAE の計算で確かめ、NG を直すまで繰り返すツールです。' +
    '下は、2 人乗りの小さなオフロード車の記録です (v1 の NG を v7 で全部 OK にしました)。</p>' +
    '<div class="ji-buttons"><button type="button" class="ji-play" id="ji-play">▶ 最初から再生して見る</button>' +
    '<button type="button" class="ji-result" id="ji-result">結果を見る</button></div>' +
    '<button type="button" class="ji-close" id="ji-close" title="閉じる">×</button>';
  const css = document.createElement("style");
  // fixed over the page, bottom left, so the page's own grid keeps its rows; × hides it
  css.textContent =
    "#judge-intro{position:fixed;left:20px;bottom:20px;z-index:9999;max-width:560px;display:flex;flex-direction:column;gap:12px;" +
    "padding:16px 20px;background:#1c1f24;color:#fff;font-size:15px;line-height:1.6;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.35)}" +
    "#judge-intro .ji-text{margin:0;padding-right:22px}" +
    "#judge-intro .ji-buttons{display:flex;gap:10px;flex-wrap:wrap}" +
    "#judge-intro button{font:inherit;font-weight:700;border-radius:999px;padding:9px 20px;cursor:pointer;border:2px solid #fff}" +
    "#judge-intro .ji-play{background:#fff;color:#1c1f24;font-size:17px}" +
    "#judge-intro .ji-result{background:transparent;color:#fff}" +
    "#judge-intro .ji-close{position:absolute;top:8px;right:10px;border:0;background:transparent;color:#aaa;font-size:18px;padding:2px 6px}";
  document.head.appendChild(css);

  const tab = (word) => [...document.querySelectorAll("#tabs button, #tabs a, #tabs [role=tab]")].find((b) => b.textContent.includes(word));
  const later = (fn, tries = 60) => { const t = fn(); if (!t && tries > 0) setTimeout(() => later(fn, tries - 1), 250); };

  function show() {
    if (document.getElementById("judge-intro")) return;
    document.body.appendChild(bar);
    document.getElementById("ji-close").onclick = () => bar.remove();
    document.getElementById("ji-result").onclick = () => { bar.remove(); const t = tab("解析結果"); if (t) t.click(); };
    document.getElementById("ji-play").onclick = () => {
      bar.remove();
      const t = tab("作りたいもの");
      if (t) t.click();
      later(() => { const b = document.querySelector("[data-static-replay]"); if (b) { b.click(); return true; } return false; });
    };
  }
  const params = new URLSearchParams(location.search);
  const onRecord = !params.has("list") && !params.has("run") || params.has("run");
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show); else show();
  // open on ④ once the tabs are there, only on the first record (not the run list)
  if (onRecord && !params.has("list")) later(() => { const t = tab("解析結果"); if (t) { t.click(); return true; } return false; });
})();
