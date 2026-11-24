(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loadVideo = video => {
    if (video && !video.src && video.dataset.src) {
      video.src = video.dataset.src;
      video.load();
    }
  };

  const safePlay = video => {
    if (!video) return;
    loadVideo(video);
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  };

  /* ---------- Background videos (home work card) ---------- */
  const bgObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) safePlay(target); else target.pause();
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('video[data-autoplay]').forEach(v => bgObserver.observe(v));

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- 3D depth carousel (moves only on swipe / drag / arrows) ---------- */
  document.querySelectorAll('.carousel3d').forEach(root => {
    const stage = root.querySelector('.c3d-stage');
    const cards = Array.from(root.querySelectorAll('.c3d-card'));
    const count = root.querySelector('.c3d-count');
    const n = cards.length;
    if (!n) return;

    let position = 0;      // current (animated) position, float
    let target = 0;        // where we are heading, integer
    let animating = false;
    let inView = false;
    let activeIndex = -1;

    const wrap = d => {
      // Shortest signed distance on a loop of n items.
      let x = ((d % n) + n) % n;
      if (x > n / 2) x -= n;
      return x;
    };

    const spacing = () => cards[0].offsetWidth * (window.innerWidth < 680 ? 0.62 : 0.74);

    const render = () => {
      const s = spacing();
      cards.forEach((card, i) => {
        const d = wrap(i - position);
        const a = Math.abs(d);

        // Closer = bigger + brighter. Further = smaller, darker, pushed back.
        const x = d * s;
        const z = -a * 260;
        const rotY = Math.max(-38, Math.min(38, d * -22));
        const scale = 1.06 - Math.min(a, 3) * 0.1;
        const opacity = a <= 1 ? 1 - a * 0.18 : Math.max(0, 0.82 - (a - 1) * 0.6);
        const shade = Math.min(0.72, a * 0.42);

        card.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg) scale(${scale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = String(100 - Math.round(a * 10));
        card.style.visibility = opacity < 0.02 ? 'hidden' : 'visible';
        card.querySelector('.c3d-shade').style.opacity = shade.toFixed(3);
      });
    };

    const setActive = () => {
      const idx = ((Math.round(position) % n) + n) % n;
      if (count) count.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
      if (idx === activeIndex) return;
      activeIndex = idx;
      cards.forEach((card, i) => {
        const video = card.querySelector('video');
        const isActive = i === idx;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-hidden', String(!isActive));
        if (isActive && inView) {
          safePlay(video);
        } else {
          video.pause();
          if (!isActive) muteCard(card);
        }
      });
      // Warm up neighbours so swiping feels instant.
      [idx - 1, idx + 1].forEach(j => loadVideo(cards[((j % n) + n) % n].querySelector('video')));
    };

    const tick = () => {
      const diff = target - position;
      if (Math.abs(diff) < 0.001 || reducedMotion) {
        position = target;
        animating = false;
      } else {
        position += diff * 0.14;
      }
      render();
      setActive();
      if (animating) requestAnimationFrame(tick);
    };

    const goTo = t => {
      target = t;
      if (!animating) {
        animating = true;
        requestAnimationFrame(tick);
      }
    };

    /* Sound */
    function muteCard(card) {
      const v = card.querySelector('video');
      const b = card.querySelector('.c3d-sound');
      v.muted = true;
      card.classList.remove('is-unmuted');
      if (b) { b.textContent = '🔇'; b.setAttribute('aria-label', 'Turn sound on'); }
    }

    const toggleSound = card => {
      const v = card.querySelector('video');
      const b = card.querySelector('.c3d-sound');
      const turnOn = v.muted;
      cards.forEach(muteCard);
      if (turnOn) {
        v.muted = false;
        card.classList.add('is-unmuted');
        if (b) { b.textContent = '🔊'; b.setAttribute('aria-label', 'Turn sound off'); }
        safePlay(v);
      }
    };

    /* Drag / swipe */
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let startPos = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;

    stage.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = lastX = e.clientX;
      startY = e.clientY;
      startPos = position;
      lastT = performance.now();
      velocity = 0;
      animating = false;
    });

    window.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(e.clientY - startY)) {
        moved = true;
        stage.classList.add('is-dragging');
        try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      }
      if (!moved) return;
      const now = performance.now();
      velocity = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      position = startPos - dx / spacing();
      target = position;
      render();
      setActive();
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      if (moved) {
        const fling = -velocity * 3.2; // px/ms → items
        goTo(Math.round(position + Math.max(-2, Math.min(2, fling))));
      }
    };
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    // Click: centre card toggles sound, side cards come forward.
    cards.forEach((card, i) => {
      card.addEventListener('click', e => {
        if (moved) { e.preventDefault(); return; }
        const d = wrap(i - Math.round(position));
        if (d === 0) toggleSound(card);
        else goTo(Math.round(position) + d);
      });
    });

    // Trackpad horizontal swipe.
    let wheelLock = false;
    stage.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 12) return;
      e.preventDefault();
      if (wheelLock) return;
      wheelLock = true;
      goTo(Math.round(target) + (e.deltaX > 0 ? 1 : -1));
      setTimeout(() => { wheelLock = false; }, 420);
    }, { passive: false });

    root.querySelector('.c3d-prev')?.addEventListener('click', () => goTo(Math.round(target) - 1));
    root.querySelector('.c3d-next')?.addEventListener('click', () => goTo(Math.round(target) + 1));

    root.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.round(target) - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.round(target) + 1); }
    });

    // Only play while the carousel is on screen.
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      const v = cards[activeIndex]?.querySelector('video');
      if (!v) return;
      if (inView) safePlay(v); else v.pause();
    }, { threshold: 0.4 }).observe(stage);

    window.addEventListener('resize', render);
    render();
    setActive();
  });

  /* ---------- Work page: video library ---------- */
  const library = document.querySelector('.library-grid');
  if (library) {
    const tiles = Array.from(library.querySelectorAll('.lib-tile'));
    const chips = Array.from(document.querySelectorAll('.filter-chip'));

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const f = chip.dataset.filter;
        chips.forEach(c => c.classList.toggle('is-active', c === chip));
        chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
        tiles.forEach((tile, i) => {
          const show = f === 'all' || tile.dataset.cat === f;
          tile.hidden = !show;
          if (show) {
            tile.classList.remove('is-in');
            tile.style.setProperty('--delay', (i % 4) * 0.06 + 's');
            requestAnimationFrame(() => requestAnimationFrame(() => tile.classList.add('is-in')));
          }
        });
      });
    });

    // Hover preview (desktop).
    tiles.forEach(tile => {
      const v = tile.querySelector('video');
      tile.addEventListener('mouseenter', () => {
        if (!window.matchMedia('(hover: hover)').matches) return;
        tile.classList.add('is-previewing');
        safePlay(v);
      });
      tile.addEventListener('mouseleave', () => {
        tile.classList.remove('is-previewing');
        v.pause();
      });
    });

    // Lightbox with sound + controls.
    const box = document.getElementById('lightbox');
    const boxVideo = box?.querySelector('video');
    const close = () => {
      boxVideo.pause();
      boxVideo.removeAttribute('src');
      boxVideo.load();
      box.close();
    };

    tiles.forEach(tile => {
      tile.addEventListener('click', () => {
        if (!box) return;
        tiles.forEach(t => t.querySelector('video').pause());
        boxVideo.src = tile.dataset.full;
        boxVideo.poster = tile.querySelector('img').src;
        box.showModal();
        boxVideo.muted = false;
        const p = boxVideo.play();
        if (p && p.catch) p.catch(() => {});
      });
    });

    box?.querySelector('.lightbox-close').addEventListener('click', close);
    box?.addEventListener('click', e => {
      if (e.target === box || e.target.classList.contains('lightbox-inner')) close();
    });
    box?.addEventListener('cancel', e => { e.preventDefault(); close(); });
  }
})();
