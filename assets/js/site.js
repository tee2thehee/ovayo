(() => {
  // Preserve links from the former separate pages on the single index page.
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

  if (navigation && document.body.dataset.page === 'home') {
    const updateCurrentSection = () => {
      const hash = window.location.hash;
      const section = ['#pricing', '#one-time-pricing', '#additional-services'].includes(hash)
        ? '#pricing' : hash === '#checkup' ? '#checkup' : hash === '#work' ? '#work' : '#top';
      navigation.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === section) {
          link.setAttribute('aria-current', hash ? 'location' : 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };
    updateCurrentSection();
    window.addEventListener('hashchange', updateCurrentSection);
  }

})();
