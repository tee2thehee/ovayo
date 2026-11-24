(() => {
  const form = document.getElementById('leadForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  const endpoint = form.dataset.endpoint.trim();
  const submitButton = form.querySelector('button[type="submit"]');
  if (!submitButton) return;

  if (endpoint) {
    submitButton.disabled = false;
    status.classList.remove('is-notice');
    status.textContent = '';
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.classList.add('is-notice');
    if (!endpoint) {
      status.textContent = 'Online inquiries are coming soon.';
      return;
    }

    submitButton.disabled = true;
    status.textContent = 'Sending…';
    status.style.color = '#676C74';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Request failed');
      status.style.color = '#315BFF';
      status.textContent = "Thank you. We'll review your business and get back to you soon.";
      form.reset();
    } catch {
      status.style.color = '#B42318';
      status.textContent = 'Your request could not be sent. Please try again later.';
    } finally {
      submitButton.disabled = false;
    }
  });
})();
