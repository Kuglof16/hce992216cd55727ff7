// The judges' page, the 3D viewer: (1) a large play button on the 3D view, the same as the panel's 「▶ 再生」, so the
// motion is found at a glance; (2) the field switch keeps only the fields that have data here (a tile opens the viewer
// with one analysis' data, ?data=, so every other field would say 「データがない」).
(function () {
  const $ = (id) => document.getElementById(id);
  const css = document.createElement("style");
  css.textContent =
    "#jv-play{position:absolute;left:16px;bottom:252px;z-index:20;font:inherit;font-size:20px;font-weight:700;" +
    "padding:12px 28px;border-radius:999px;border:2px solid #fff;background:#d3352b;color:#fff;cursor:pointer;" +
    "box-shadow:0 4px 18px rgba(0,0,0,.35)}#jv-play:hover{background:#b02a21}" +
    // while it plays the button is dark, so the red asks only for the first press
    "#jv-play.on{background:#1c1f24}#jv-play.on:hover{background:#2c3138}";
  document.head.appendChild(css);

  const big = document.createElement("button");
  big.type = "button"; big.id = "jv-play"; big.style.display = "none";
  big.onclick = () => { const p = $("play"); if (p) p.click(); };

  function sync() {
    const p = $("play"), t = $("time");
    if (!p || !t) return;
    big.style.display = +t.max > 0 ? "" : "none";   // a field with one moment has nothing to play
    const on = /停止/.test(p.textContent);
    big.textContent = on ? "❚❚ 止める" : "▶ 動きを再生";
    big.classList.toggle("on", on);
  }
  // with ?data= the viewer reads nothing else, so only the open field has data; without it, a field has data when its
  // file (HV.fields[f].dataUrl, else data/<f>.js, as js/main.js loadData reads it) is on the server
  const exists = (url) => fetch(url, { method: "HEAD", cache: "no-store" }).then((r) => r.ok, () => false);
  async function onlyFieldsWithData() {
    const H = window.HV;
    if (!H) return;
    const have = window.VIEW_DATA || {};
    const sw = $("switch"); if (!sw) return;
    let shown = 0;
    for (const b of sw.querySelectorAll("button")) {
      const f = b.id.replace(/^sw_/, "");
      const variants = ((H.fields || {})[f] || {}).variants || [{ key: f }];
      let ok = f === window.__field || variants.some((v) => have[v.key]);
      if (!ok && !H.dataFromUrl) {
        for (const v of variants) if (await exists((H.fields[v.key] || H.fields[f] || {}).dataUrl || `data/${v.key}.js`)) { ok = true; break; }
      }
      b.style.display = ok ? "" : "none";
      if (ok) shown++;
    }
    // one field left: the header already names it, so the switch and its heading go
    const h = sw.previousElementSibling;
    const one = shown <= 1;
    sw.style.display = one ? "none" : "";
    if (h && h.tagName === "H3") h.style.display = one ? "none" : "";
  }
  function start() {
    document.body.appendChild(big);
    const wait = setInterval(() => {
      if (!window.__ready) return;
      clearInterval(wait);
      onlyFieldsWithData(); sync();
      new MutationObserver(sync).observe($("play"), { childList: true, characterData: true, subtree: true });
      new MutationObserver(sync).observe($("time"), { attributes: true, attributeFilter: ["max"] });
    }, 200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
