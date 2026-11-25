(() => {
  const stage = document.querySelector('[data-hero-reels]');
  const dialog = document.getElementById('heroReelDialog');
  if (!stage || !dialog) return;

  const wall = stage.querySelector('.hero-reels__wall');
  const videos = [...stage.querySelectorAll('video')];
  const toggle = stage.querySelector('[data-reels-toggle]');
  const label = toggle.querySelector('[data-reels-toggle-label]');
  const icon = toggle.querySelector('[data-reels-icon]');
  const player = dialog.querySelector('[data-reel-player]');
  const title = document.getElementById('heroReelTitle');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visibleVideos = new Set();
  let userPaused = motionPreference.matches;
  let stageVisible = true;
  let keyboardFocused = false;
  let trigger = null;
  let previousOverflow = '';

  const syncPlayback = () => {
    const paused = userPaused || keyboardFocused || !stageVisible || document.hidden || dialog.open;
    stage.classList.toggle('is-paused', paused);
    stage.classList.toggle('is-motion-enabled', !userPaused);
    for (const video of videos) {
      const columnVisible = video.closest('.hero-reels__column').getBoundingClientRect().width > 0;
      if (!paused && columnVisible && visibleVideos.has(video)) {
        if (!video.getAttribute('src')) video.src = video.dataset.src;
        video.muted = true;
        const playing = video.play();
        if (playing) playing.catch(() => {});
      } else {
        video.pause();
      }
    }
  };

  const syncToggle = () => {
    toggle.setAttribute('aria-pressed', String(userPaused));
    label.textContent = userPaused ? 'Play motion' : 'Pause motion';
    icon.textContent = userPaused ? '▶' : 'Ⅱ';
    syncPlayback();
  };

  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    syncToggle();
  });

  wall.addEventListener('focusin', event => {
    keyboardFocused = event.target.matches('.hero-reel:focus-visible');
    syncPlayback();
  });
  wall.addEventListener('focusout', event => {
    if (!wall.contains(event.relatedTarget)) {
      keyboardFocused = false;
      syncPlayback();
    }
  });

  // Preview videos only decode while their moving tiles are actually visible.
  if ('IntersectionObserver' in window) {
    const tileObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleVideos.add(entry.target);
        else visibleVideos.delete(entry.target);
      }
      syncPlayback();
    }, { root: wall, threshold: .15 });
    videos.forEach(video => tileObserver.observe(video));

    const stageObserver = new IntersectionObserver(entries => {
      stageVisible = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: 0 });
    stageObserver.observe(stage);
  } else {
    videos.forEach(video => visibleVideos.add(video));
  }

  document.addEventListener('visibilitychange', syncPlayback);
  motionPreference.addEventListener('change', () => {
    userPaused = motionPreference.matches;
    syncToggle();
  });
  window.addEventListener('resize', syncPlayback);

  stage.querySelectorAll('[data-reel-src]').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      title.textContent = button.dataset.reelTitle;
      player.poster = button.querySelector('video').poster;
      player.src = button.dataset.reelSrc;
      previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal();
      syncPlayback();
      const playing = player.play();
      if (playing) playing.catch(() => {});
    });
  });

  dialog.querySelector('[data-reel-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    player.pause();
    player.removeAttribute('src');
    player.load();
    document.documentElement.style.overflow = previousOverflow;
    syncPlayback();
    if (trigger) {
      const returnTarget = trigger.closest('[aria-hidden="true"]') ? toggle : trigger;
      returnTarget.focus({ preventScroll: true });
    }
  });

  syncToggle();
})();
