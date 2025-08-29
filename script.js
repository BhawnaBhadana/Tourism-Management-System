 // script.js - small helpers: nav toggle, year, forms, prefill destination

document.addEventListener('DOMContentLoaded', () => {
  // year in footer(s)
  document.querySelectorAll('[id^="year"]').forEach(el => el.textContent = new Date().getFullYear());

  // nav toggle for small screens
  function setupNav(toggleId, listId) {
    const t = document.getElementById(toggleId);
    const list = document.getElementById(listId);
    if (!t || !list) return;
    t.addEventListener('click', () => {
      const open = list.style.display !== 'flex';
      list.style.display = open ? 'flex' : 'none';
      t.setAttribute('aria-expanded', String(open));
    });
  }
  setupNav('navToggle','navList');
  setupNav('navToggle2','navList2');
  setupNav('navToggle3','navList3');

  // Booking form behavior
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    // Pre-fill destination from query string if present
    const params = new URLSearchParams(location.search);
    const dest = params.get('dest') || params.get('q') || '';
    const destInput = document.getElementById('destinationInput');
    if (dest && destInput) destInput.value = decodeURIComponent(dest);

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(bookingForm);
      // basic validation
      if (!data.get('name') || !data.get('email') || !data.get('destination')) {
        alert('Please fill the required fields (name, email, destination).');
        return;
      }
      // basic dates check
      const start = data.get('start'), end = data.get('end');
      if (start && end && new Date(start) > new Date(end)) {
        alert('End date must be after start date.');
        return;
      }
      // show success and clear
      alert('✅ Booking submitted! (demo) — check your email for details.');
      bookingForm.reset();
    });

    // clear button
    const clearBtn = document.getElementById('clearBooking');
    if (clearBtn) clearBtn.addEventListener('click', () => bookingForm.reset());
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(contactForm);
      if (!data.get('name') || !data.get('email') || !data.get('message')) {
        alert('Please fill all fields.');
        return;
      }
      alert('📩 Message sent! (demo) — thanks for contacting us.');
      contactForm.reset();
    });
  }

  // Quick search: let it just submit to destinations (handled by default)
  const quickSearch = document.getElementById('quickSearch');
  if (quickSearch) quickSearch.addEventListener('submit', () => { /* form goes to destinations.html */ });

  // Simple client-side filter on destinations page
  const filterSearch = document.getElementById('filterSearch');
  const filterType = document.getElementById('filterType');
  const destGrid = document.getElementById('destGrid');

  function applyFilters() {
    if (!destGrid) return;
    const q = filterSearch?.value.toLowerCase().trim() || '';
    const t = filterType?.value || '';
    Array.from(destGrid.children).forEach(card => {
      const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
      const matchesQ = !q || title.includes(q) || desc.includes(q);
      let matchesT = true;
      if (t) {
        // simple mapping per id
        const id = card.id || '';
        if (t === 'beach') matchesT = ['maldives'].includes(id);
        if (t === 'city') matchesT = ['dubai','rome','japan','korea','turkey','dubai','rome'].includes(id);
        if (t === 'heritage') matchesT = ['rome','turkey','japan'].includes(id);
      }
      card.style.display = (matchesQ && matchesT) ? '' : 'none';
    });
  }
  if (filterSearch) filterSearch.addEventListener('input', applyFilters);
  if (filterType) filterType.addEventListener('change', applyFilters);
});
