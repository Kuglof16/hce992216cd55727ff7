// The judges' page: the two notes on the flow calculations are left out of what is shown (the README keeps
// them). A note that is the whole of its element hides that element; one at the end of a line is cut off.
(function () {
  const NOTES = [
    /\s*[—-]?\s*(この v5 の形で計算。)?実験と比べて(確かめて)?いない(計算による)?。?/g,
    /\s*[—-]?\s*見せるための計算で、走破の判定ではない。?/g,
  ];
  function trim(root) {
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const hits = [];
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      if (NOTES.some((re) => { re.lastIndex = 0; return re.test(n.nodeValue); })) hits.push(n);
    }
    for (const n of hits) {
      let s = n.nodeValue;
      for (const re of NOTES) { re.lastIndex = 0; s = s.replace(re, ""); }
      n.nodeValue = s;
      const el = n.parentElement;
      if (el && !el.textContent.replace(/[\s—-]/g, "")) el.style.display = "none";
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
