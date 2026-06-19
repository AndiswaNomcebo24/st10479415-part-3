/* ============================================================
   BrightFuture Youth Foundation — site script.js
   Handles: programme search, active-nav highlighting,
            and basic contact form feedback.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  highlightActiveNav();
  initSearch();
  initContactForm();
});

/* ------------------------------------------------------------
   1. ACTIVE NAV LINK
   Automatically marks the nav link matching the current page
   as "active", so you don't need to hand-edit class="active"
   on every file (and it fixes pages where it was missing).
   ------------------------------------------------------------ */
function highlightActiveNav() {
  const links = document.querySelectorAll('.nav-links a, nav a');
  if (!links.length) return;

  // current page file name, e.g. "about.html" (default to index.html)
  let current = window.location.pathname.split('/').pop().toLowerCase();
  if (current === '') current = 'index.html';

  links.forEach(function (link) {
    const href = (link.getAttribute('href') || '').toLowerCase();
    link.classList.remove('active');
    if (href === current) {
      link.classList.add('active');
    }
  });
}

/* ------------------------------------------------------------
   2. PROGRAMME SEARCH
   - On programmes.html: filters the program-item cards live.
   - On any other page: pressing Enter / clicking Search sends
     the visitor to programmes.html?q=... which then runs the
     same filter automatically on load.
   ------------------------------------------------------------ */
function initSearch() {
  const input = document.getElementById('searchInput');
  const button = document.getElementById('searchBtn');
  if (!input) return;

  const items = document.querySelectorAll('.program-grid .program-item');
  const onProgrammesPage = items.length > 0;

  // If we landed here via ?q=..., prefill the box and filter immediately
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');
  if (initialQuery) {
    input.value = initialQuery;
    if (onProgrammesPage) filterProgrammes(initialQuery, items);
  }

  function runSearch() {
    const query = input.value.trim();

    if (onProgrammesPage) {
      filterProgrammes(query, items);
    } else if (query) {
      // Not on the programmes page: go there with the search term
      window.location.href = 'programmes.html?q=' + encodeURIComponent(query);
    } else {
      window.location.href = 'programmes.html';
    }
  }

  if (button) button.addEventListener('click', runSearch);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSearch();
    }
  });

  // Live filtering as the user types, only when already on programmes.html
  if (onProgrammesPage) {
    input.addEventListener('input', function () {
      filterProgrammes(input.value.trim(), items);
    });
  }
}

function filterProgrammes(query, items) {
  const term = query.toLowerCase();
  let visibleCount = 0;

  items.forEach(function (item) {
    const title = item.querySelector('h3') ? item.querySelector('h3').textContent.toLowerCase() : '';
    const desc = item.querySelector('p') ? item.querySelector('p').textContent.toLowerCase() : '';
    const matches = term === '' || title.includes(term) || desc.includes(term);

    item.style.display = matches ? '' : 'none';
    if (matches) visibleCount++;
  });

  showNoResultsMessage(visibleCount === 0);
}

function showNoResultsMessage(show) {
  const grid = document.querySelector('.program-grid');
  if (!grid) return;

  let msg = document.getElementById('noResultsMsg');

  if (show) {
    if (!msg) {
      msg = document.createElement('p');
      msg.id = 'noResultsMsg';
      msg.textContent = 'No programmes match your search. Try a different keyword.';
      grid.insertAdjacentElement('afterend', msg);
    }
  } else if (msg) {
    msg.remove();
  }
}

/* ------------------------------------------------------------
   3. CONTACT FORM
   Lightweight feedback on submit (the form still posts to
   action_page.php as before — this just confirms to the user
   that their input was received before the page navigates).
   ------------------------------------------------------------ */
function initContactForm() {
  const form = document.querySelector('.container form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    const email = form.querySelector('#Email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailPattern.test(email.value.trim())) {
      e.preventDefault();
      email.focus();
      alert('Please enter a valid email address.');
    }
  });
}
