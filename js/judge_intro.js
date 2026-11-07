// The judges' page: one sentence on what HIRAKU is, a large play button and two links in the header that stay
// (the introduction page, and 「？ 使い方」 that brings the card back). The page's own tabs and its
// 「この記録を再生する」 button do the work; this only adds the card and presses them.
(function () {
  const LP = "https://kuglof16.github.io/h860337f9b68847f246/";
  const params = new URLSearchParams(location.search);
  const run = params.get("run") || "";
  const scripted = /-scripted$/.test(run);
  const words = scripted
    ? "<b>HIRAKU</b> は、作りたいものを文で書くと、Claude が設計を作り、CAE の計算で確かめ、NG を直すまで繰り返すツールです。" +
      "これは台本の運転 (Claude を呼ばずに、同じ道を決まった手順でなぞる) の記録で、8 分野すべてが OK になった v5 の判定です。タイルを押すと、解析を 3D で見られます。"
    : "<b>HIRAKU</b> は、作りたいものを文で書くと、Claude が設計を作り、CAE の計算で確かめ、NG を直すまで繰り返すツールです。" +
      "下は、Claude が回した 2 人乗りの小さなオフロード車の記録です (v1 の NG を v7 で全部 OK にしました)。";

  const bar = document.createElement("div");
  bar.id = "judge-intro";
  bar.innerHTML = '<p class="ji-text">' + words + "</p>" +
    '<div class="ji-buttons"><button type="button" class="ji-play" id="ji-play">▶ 最初から再生して見る</button>' +
    '<button type="button" class="ji-result" id="ji-result">結果を見る</button>' +
    '<a class="ji-lp" href="' + LP + '">HIRAKU の紹介ページへ</a></div>' +
    '<button type="button" class="ji-close" id="ji-close" title="閉じる (右下の「？ 使い方」でまた開けます)">×</button>';
  const css = document.createElement("style");
  // fixed over the page, bottom right, so the page's own grid keeps its rows
  css.textContent =
    "#judge-intro{position:fixed;right:20px;bottom:20px;z-index:9999;max-width:520px;display:flex;flex-direction:column;gap:12px;" +
    "padding:16px 20px;background:#1c1f24;color:#fff;font-size:15px;line-height:1.6;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.35)}" +
    "#judge-intro .ji-text{margin:0;padding-right:22px}" +
    "#judge-intro .ji-buttons{display:flex;gap:10px;flex-wrap:wrap;align-items:center}" +
    "#judge-intro button{font:inherit;font-weight:700;border-radius:999px;padding:9px 20px;cursor:pointer;border:2px solid #fff}" +
    "#judge-intro .ji-play{background:#fff;color:#1c1f24;font-size:17px}" +
    "#judge-intro .ji-result{background:transparent;color:#fff}" +
    "#judge-intro .ji-lp{color:#cfd6df;font-size:14px;margin-left:4px}" +
    "#judge-intro .ji-close{position:absolute;top:8px;right:10px;border:0;background:transparent;color:#aaa;font-size:18px;padding:2px 6px}" +
    ".ji-head{margin-left:10px;font:inherit;font-size:14px;font-weight:700;color:#1c1f24;background:#fff;border:1.5px solid #1c1f24;" +
    "border-radius:999px;padding:4px 12px;text-decoration:none;cursor:pointer;white-space:nowrap}" +
    ".ji-head.dark{background:#1c1f24;color:#fff}";
  document.head.appendChild(css);

  const tab = (word) => [...document.querySelectorAll("#tabs button, #tabs a, #tabs [role=tab]")].find((b) => b.textContent.includes(word));
  const later = (fn, tries = 60) => { const t = fn(); if (!t && tries > 0) setTimeout(() => later(fn, tries - 1), 250); };

  function openCard() {
    if (!document.getElementById("judge-intro")) document.body.appendChild(bar);
    document.getElementById("ji-close").onclick = () => bar.remove();
    document.getElementById("ji-result").onclick = () => { bar.remove(); const t = tab("解析結果"); if (t) t.click(); };
    document.getElementById("ji-play").onclick = () => {
      bar.remove();
      const t = tab("作りたいもの");
      if (t) t.click();
      later(() => { const b = document.querySelector("[data-static-replay]"); if (b) { b.click(); return true; } return false; });
    };
  }
  // two small buttons fixed at the bottom right, shown while the card is closed: the card back, and the
  // introduction page (the header has no room: the request's words by the wordmark need it)
  const dock = document.createElement("div");
  dock.id = "ji-dock";
  dock.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:9998;display:flex;gap:8px";
  function headerLinks() {
    if (document.getElementById("ji-help")) return;
    const help = document.createElement("button");
    help.type = "button"; help.id = "ji-help"; help.className = "ji-head dark"; help.textContent = "？ 使い方";
    help.onclick = openCard;
    const lp = document.createElement("a");
    lp.className = "ji-head"; lp.href = LP; lp.textContent = "HIRAKU の紹介ページ";
    dock.append(help, lp);
    document.body.appendChild(dock);
    new MutationObserver(() => { dock.style.display = document.getElementById("judge-intro") ? "none" : "flex"; })
      .observe(document.body, { childList: true });
  }
  function start() { headerLinks(); if (!params.has("list")) openCard(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  // open on ④ once the tabs are there (not the run list; ?tab= from a link wins)
  if (!params.has("list") && !params.has("tab")) later(() => { const t = tab("解析結果"); if (t) { t.click(); return true; } return false; });
})();
