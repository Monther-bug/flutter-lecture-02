/* Slide navigation — no dependencies.
   Keys: → ↓ Space PageDown = next · ← ↑ Shift+Space PageUp = previous
         Home/End · F fullscreen · N speaker notes · T light/dark theme */
(() => {
  const root = document.documentElement;
  const slides = [...document.querySelectorAll('.slide')];
  const total = slides.length;
  const bar = document.querySelector('.progress span');
  const notesPanel = document.querySelector('.notes-panel');
  let current = 0;

  try {
    const saved = localStorage.getItem('deck-theme');
    if (saved) root.dataset.theme = saved;
  } catch (e) { /* storage unavailable */ }

  slides.forEach((slide, n) => {
    const heading = slide.querySelector('h1, h2');
    const name = heading ? heading.textContent.replace(/\s+/g, ' ').trim() : '';
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${n + 1} of ${total}: ${name}`);
    slide.querySelectorAll('.num').forEach(el => {
      el.textContent = `${String(n + 1).padStart(2, '0')} / ${total}`;
    });
    slide.querySelectorAll('.stagger').forEach(group => {
      [...group.children].forEach((child, k) => child.style.setProperty('--d', `${140 + k * 75}ms`));
    });
  });

  function go(n) {
    current = Math.max(0, Math.min(total - 1, n));
    slides.forEach((slide, k) => {
      const active = k === current;
      slide.classList.toggle('is-active', active);
      slide.classList.toggle('is-past', k < current);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    if (bar) bar.style.width = `${((current + 1) / total) * 100}%`;
    const hash = `#${current + 1}`;
    if (location.hash !== hash) {
      try { history.replaceState(null, '', hash); } catch (e) { location.hash = hash; }
    }
    renderNotes();
  }

  const next = () => go(current + 1);
  const prev = () => go(current - 1);

  function renderNotes() {
    if (!notesPanel || notesPanel.hidden) return;
    const aside = slides[current].querySelector('.notes');
    notesPanel.querySelector('.np-title').textContent = `Speaker notes · slide ${current + 1} of ${total}`;
    notesPanel.querySelector('.np-body').innerHTML = aside ? aside.innerHTML : '<p>No notes for this slide.</p>';
  }

  function toggleNotes() {
    if (!notesPanel) return;
    notesPanel.hidden = !notesPanel.hidden;
    renderNotes();
  }

  function toggleTheme() {
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = theme;
    try { localStorage.setItem('deck-theme', theme); } catch (e) { /* ignore */ }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      const req = root.requestFullscreen && root.requestFullscreen();
      if (req && req.catch) req.catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    const k = e.key;
    if ((k === ' ' || k === 'Enter') && tag === 'BUTTON') return;

    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) {
      e.preventDefault(); next();
    } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) {
      e.preventDefault(); prev();
    } else if (k === 'Home') {
      e.preventDefault(); go(0);
    } else if (k === 'End') {
      e.preventDefault(); go(total - 1);
    } else if (k === 'f' || k === 'F') {
      toggleFullscreen();
    } else if (k === 'n' || k === 'N') {
      toggleNotes();
    } else if (k === 't' || k === 'T') {
      toggleTheme();
    }
  });

  let touchX = null;
  let touchY = null;
  addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }, { passive: true });
  addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
    }
    touchX = null;
  });

  const fromHash = () => {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isFinite(n) ? n - 1 : 0;
  };
  addEventListener('hashchange', () => go(fromHash()));

  // Copy buttons (the AI-agent prompt)
  document.querySelectorAll('[data-copy]').forEach(btn => {
    const label = btn.querySelector('.copy-label');
    const original = label ? label.textContent : '';
    btn.addEventListener('click', async () => {
      const src = document.querySelector(btn.dataset.copy);
      if (!src) return;
      const text = src.textContent.trim();
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
        ta.remove();
      }
      if (label) label.textContent = ok ? 'Copied!' : 'Select the text & copy';
      btn.classList.toggle('is-done', ok);
      btn.blur();
      setTimeout(() => {
        if (label) label.textContent = original;
        btn.classList.remove('is-done');
      }, 2200);
    });
  });

  const hint = document.querySelector('.hint');
  if (hint) {
    setTimeout(() => hint.classList.add('is-on'), 700);
    setTimeout(() => hint.classList.remove('is-on'), 5600);
  }

  go(fromHash());
})();
