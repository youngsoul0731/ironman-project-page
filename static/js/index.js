'use strict';
const videos = [...document.querySelectorAll('video[data-src]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reducedMotion.matches;
const manuallyPaused = new WeakSet();
const visibleVideos = new Set();
const motionToggle = document.getElementById('motion-toggle');
function updateMotionLabel() {
  motionToggle.textContent = motionPaused ? 'Play videos' : 'Pause videos';
  motionToggle.setAttribute('aria-pressed', String(motionPaused));
}
function loadVideo(video) {
  if (!video.getAttribute('src')) {
    video.src = video.dataset.src;
    video.load();
  }
}
function isVisible(video) {
  return video.getClientRects().length > 0 && !video.closest('[hidden]');
}
function playVideo(video) {
  if (motionPaused || document.hidden || !isVisible(video) || manuallyPaused.has(video)) return;
  loadVideo(video);
  video.play().catch(() => {}); // The poster and native controls remain usable if autoplay is denied.
}
function pauseVideo(video) {
  if (!video.paused) {
    video.dataset.automaticPause = 'true';
    video.pause();
  }
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(({target: video, isIntersecting}) => {
    if (isIntersecting && isVisible(video)) {
      visibleVideos.add(video);
      loadVideo(video);
      playVideo(video);
    } else {
      visibleVideos.delete(video);
      pauseVideo(video);
    }
  });
}, {threshold: 0.15});
videos.forEach(video => {
  video.addEventListener('pause', () => {
    if (video.dataset.automaticPause) delete video.dataset.automaticPause;
    else manuallyPaused.add(video);
  });
  video.addEventListener('play', () => manuallyPaused.delete(video));
  observer.observe(video);
});
updateMotionLabel();
motionToggle.addEventListener('click', () => {
  motionPaused = !motionPaused;
  updateMotionLabel();
  if (motionPaused) videos.forEach(pauseVideo);
  else visibleVideos.forEach(video => { manuallyPaused.delete(video); playVideo(video); });
});
reducedMotion.addEventListener('change', event => {
  motionPaused = event.matches;
  updateMotionLabel();
  if (motionPaused) videos.forEach(pauseVideo);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) videos.forEach(pauseVideo);
  else visibleVideos.forEach(playVideo);
});

// Each tab group supports keyboard navigation and pauses all hidden videos.
document.querySelectorAll('.tabs').forEach(tabs => {
  const group = tabs.dataset.group;
  const buttons = [...tabs.querySelectorAll('.tab-btn')];
  const panels = [...document.querySelectorAll(`.tab-panel[data-group="${group}"]`)];
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', group === 'rw' ? 'Real-world evaluation setting' : 'Simulation task');
  function select(button, focus = false) {
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.dataset.tab === button.dataset.tab;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
      panel.querySelectorAll('video').forEach(video => {
        if (!active) { pauseVideo(video); visibleVideos.delete(video); }
        observer.unobserve(video);
        observer.observe(video);
      });
    });
    if (focus) button.focus();
  }
  buttons.forEach((button, index) => {
    button.type = 'button';
    button.id = `tab-${button.dataset.tab}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `panel-${button.dataset.tab}`);
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault(); select(buttons[next], true);
    });
  });
  panels.forEach(panel => {
    panel.id = `panel-${panel.dataset.tab}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${panel.dataset.tab}`);
    panel.tabIndex = 0;
  });
  select(buttons.find(button => button.classList.contains('active')) || buttons[0]);
});

const copyBtn = document.getElementById('copy-bibtex');
const copyStatus = document.getElementById('copy-status');
copyBtn.addEventListener('click', async () => {
  const citation = document.getElementById('bibtex-text').textContent.trim();
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(citation);
    else {
      const input = document.createElement('textarea');
      input.value = citation;
      input.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(input); input.select();
      const copied = document.execCommand('copy'); input.remove();
      if (!copied) throw new Error('Copy not supported');
    }
    copyBtn.textContent = 'Copied'; copyStatus.textContent = 'BibTeX copied to clipboard.';
  } catch {
    copyBtn.textContent = 'Select & copy below';
    copyStatus.textContent = 'Please copy the selected citation manually.';
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('bibtex-text'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  }
  window.setTimeout(() => { copyBtn.textContent = 'Copy BibTeX'; }, 2500);
});
