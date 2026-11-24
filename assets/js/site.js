(() => {
  // Retain URLs from the earlier separate-page draft without duplicating content.
  if (document.body.dataset.redirect) {
    const target = new URL(document.body.dataset.redirect, window.location.href);
    target.search = window.location.search;
    target.hash = window.location.hash || document.body.dataset.defaultHash;
    window.location.replace(target.href);
    return;
  }

  const menuButton = document.getElementById('menuBtn');
  const navigation = document.getElementById('navLinks');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = navigation.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });

    navigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navigation.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (navigation && ['home', 'work'].includes(document.body.dataset.page)) {
    const updateCurrentSection = () => {
      const hash = window.location.hash;
      const home = document.body.dataset.page === 'home';
      const section = ['#pricing', '#one-time-pricing', '#additional-services'].includes(hash)
        ? '#pricing' : hash === '#checkup' ? '#checkup' : '#work';
      const currentHref = home ? (hash === '#checkup' ? '#checkup' : 'index.html') : `work.html${section}`;
      navigation.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === currentHref) {
          link.setAttribute('aria-current', hash ? 'location' : 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };
    updateCurrentSection();
    window.addEventListener('hashchange', updateCurrentSection);
  }

  // Preserve incoming links to sections that moved out of the original homepage.
  if (document.body.dataset.page === 'home') {
    const movedSections = {
      '#pricing': 'work.html#pricing',
      '#one-time-pricing': 'work.html#one-time-pricing',
      '#additional-services': 'work.html#additional-services',
      '#work': 'work.html#work'
    };

    const redirectMovedSection = () => {
      const destination = movedSections[window.location.hash];
      if (!destination) return;
      const target = new URL(destination, window.location.href);
      target.search = window.location.search;
      window.location.replace(target.href);
    };

    redirectMovedSection();
    window.addEventListener('hashchange', redirectMovedSection);
  }
})();
