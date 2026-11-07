// The judges' page: the notes on the flow calculations (not compared with experiments; a calculation to show,
// not a verdict on fording) are left out of what is shown. The README keeps them. A whole sentence that holds
// such a note is cut; an element left with nothing, or with only a label such as 「検証:」, is hidden.
(function () {
  const NOTES = [
    /[^。\n]*実験と比べて(確かめて)?(い)?ない[^。\n]*。?/g,
    /[^。\n]*見せるための計算で[^。\n]*。?/g,
  ];
  const leftover = (s) => !s.replace(/[\s—\-:：、,]/g, "") || /^[\s—\-]*[^\s:：]{0,8}[:：][\s—\-]*$/.test(s);
  function trim(root) {
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
