// The judges' page: the notes on the flow calculations (not compared with experiments; a calculation to show,
// not a verdict on fording) are left out of what is shown. The README keeps them. A whole sentence that holds
// such a note is cut; an element left with nothing, or with only a label such as 「検証:」, is hidden.
(function () {
  const NOTES = [
    /[^。\n]*実験と比べて(確かめて)?(い)?ない[^。\n]*。?/g,
    /[^。\n]*見せるための計算で[^。\n]*。?/g,
  ];
  const leftover = (s) => !s.replace(/[\s—\-:：、,]/g, "") || /^[\s—\-]*[^\s:：]{0,8}[:：][\s—\-]*$/.test(s);
  // the agents' row says 「終わり」 by each name; the line 「仕事を終えた」 under it says the same again
  const SAME = /^\s*仕事を終えた\s*$/;
  // names of the agents as the person asked: 「設計」, 「まとめ」, 「パッケージ」, not 「…役」 (役 reads as a part in a play)
  const NAMES = [[/設計役/g, "設計"], [/まとめ役/g, "まとめ"], [/パッケージ役/g, "パッケージ"], [/CAE ?役/g, "CAE"]];
  const ANY = /(設計役|まとめ役|パッケージ役|CAE ?役)/;
  function rename(root) {
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const v = n.nodeValue;
      if (!ANY.test(v)) continue;
      let s = v;
      for (const [re, to] of NAMES) s = s.replace(re, to);
      if (s !== v) n.nodeValue = s;
    }
    for (const el of root.querySelectorAll("[title],[aria-label]")) {
      for (const at of ["title", "aria-label"]) {
        const v = el.getAttribute(at);
        if (v && ANY.test(v)) {
          let s = v;
          for (const [re, to] of NAMES) s = s.replace(re, to);
          el.setAttribute(at, s);
        }
      }
    }
  }
  function trim(root) {
    rename(root);
    for (const el of root.querySelectorAll("div,span,small,p")) {
      if (el.children.length === 0 && SAME.test(el.textContent) && el.style.display !== "none") el.style.display = "none";
    }
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const hits = [];
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      if (NOTES.some((re) => { re.lastIndex = 0; return re.test(n.nodeValue); })) hits.push(n);
    }
    for (const n of hits) {
      let s = n.nodeValue;
      for (const re of NOTES) { re.lastIndex = 0; s = s.replace(re, ""); }
      n.nodeValue = s.replace(/\s*[—-]\s*$/, "");
      let el = n.parentElement;
      if (el && leftover(el.textContent)) {
        el.style.display = "none";
        const up = el.parentElement;   // a row whose only words were the label and the note
        if (up && leftover(up.textContent)) up.style.display = "none";
      }
    }
  }
  const go = () => trim(document.body);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; go(); });
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
