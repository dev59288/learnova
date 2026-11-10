(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const pages = ['home','onboarding','dashboard','study','classroom','nova','quiz','memory','achievements','progress','profile','login','about'];
  const toast = (message) => {
    const el = $('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
  };

  let profile = {};
  try { profile = JSON.parse(localStorage.getItem('learnova_profile') || '{}'); } catch { profile = {}; }

  function navigate(page) {
    if (!pages.includes(page)) page = 'home';
    document.querySelectorAll('.page').forEach(el => el.classList.toggle('active', el.id === `page-${page}`));
    document.querySelectorAll('[data-page]').forEach(el => {
      if (el.classList.contains('nav-link') || el.classList.contains('mobile-nav-item')) {
        el.classList.toggle('active', el.dataset.page === page);
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'dashboard') updateDashboard();
    if (page === 'study') renderSubjects();
    history.replaceState(null, '', `#${page}`);
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-page]');
    if (target) {
      event.preventDefault();
      navigate(target.dataset.page);
    }
  });

  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigate(card.dataset.page);
      }
    });
  });

  $('themeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('learnova_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
  if (localStorage.getItem('learnova_theme') === 'dark') document.body.classList.add('dark');

  $('mobileMenu')?.addEventListener('click', () => {
    const current = document.querySelector('.desktop-nav');
    if (!current) return;
    const open = current.classList.toggle('mobile-open');
    current.style.display = open ? 'flex' : '';
    current.style.position = open ? 'absolute' : '';
    current.style.top = open ? '64px' : '';
    current.style.left = open ? '0' : '';
    current.style.right = open ? '0' : '';
    current.style.padding = open ? '18px 22px' : '';
    current.style.background = open ? 'white' : '';
    current.style.flexDirection = open ? 'column' : '';
    current.style.alignItems = open ? 'flex-start' : '';
    current.style.borderBottom = open ? '1px solid #e2e8f0' : '';
  });

  $('saveProfile')?.addEventListener('click', () => {
    const name = $('studentName').value.trim();
    const grade = $('classSelect').value;
    const medium = $('mediumSelect').value;
    const board = $('boardSelect').value;
    if (!name || !grade || !board) {
      toast('Please enter your name, class and curriculum.');
      return;
    }
    profile = { name, grade, medium, board };
    localStorage.setItem('learnova_profile', JSON.stringify(profile));
    updateDashboard();
    toast('Your learning preferences have been saved on this device.');
    navigate('dashboard');
  });

  function updateDashboard() {
    $('dashboardName').textContent = profile.name || 'Learner';
    $('dashboardMeta').textContent = [profile.grade, profile.board, profile.medium ? `${profile.medium} medium` : ''].filter(Boolean).join(' · ') || 'Your learning journey continues here.';
  }

  const subjectSets = {
    'Class 1':['English','Hindi','Mathematics','Environmental Studies'],
    'Class 2':['English','Hindi','Mathematics','Environmental Studies'],
    'Class 3':['English','Hindi','Mathematics','Environmental Studies'],
    'Class 4':['English','Hindi','Mathematics','Environmental Studies'],
    'Class 5':['English','Hindi','Mathematics','Environmental Studies'],
    'Class 6':['English','Hindi','Mathematics','Science','Social Science','Mathematics'],
    'Class 7':['English','Hindi','Mathematics','Science','Social Science'],
    'Class 8':['English','Hindi','Mathematics','Science','Social Science'],
    'Class 9':['English','Hindi','Mathematics','Science','Social Science'],
    'Class 10':['English','Hindi','Mathematics','Science','Social Science'],
    'Class 11':['Physics','Chemistry','Biology','Mathematics','English'],
    'Class 12':['Physics','Chemistry','Biology','Mathematics','English'],
    'College':['Coming soon: college subject vaults']
  };
  const symbols = ['▤','◈','⌘','◎','✳','◇'];
  function renderSubjects() {
    const grade = $('studyClass')?.value || profile.grade || 'Class 11';
    const board = $('studyBoard')?.value || profile.board || 'CBSE';
    const medium = $('studyMedium')?.value || profile.medium || 'English';
    $('vaultTitle').textContent = `${grade} · ${board} · ${medium}`;
    const list = subjectSets[grade] || ['General Knowledge','Language Learning','Study Skills'];
    $('subjectGrid').innerHTML = list.map((subject, index) => `
      <button class="subject-card" type="button" data-subject="${subject.replace(/"/g, '&quot;')}">
        <span class="subject-symbol">${symbols[index % symbols.length]}</span>
        <b>${subject}</b>
        <small>Subject vault · Content being prepared</small>
      </button>`).join('');
    document.querySelectorAll('.subject-card').forEach(card => card.addEventListener('click', () => {
      if (card.dataset.subject === 'Biology') navigate('classroom');
      else toast(`${card.dataset.subject} vault selected. Reviewed lessons are being prepared.`);
    }));
  }
  ['studyClass','studyBoard','studyMedium'].forEach(id => $(id)?.addEventListener('change', renderSubjects));

  document.querySelectorAll('.suggestion-chip').forEach(chip => chip.addEventListener('click', () => {
    $('novaInput').value = chip.textContent;
    $('novaInput').focus();
  }));
  $('novaForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const value = $('novaInput').value.trim();
    if (!value) return;
    toast('Nova AI will be connected after the secure AI backend is set up.');
    $('novaInput').value = '';
  });

  updateDashboard();
  renderSubjects();
  const initial = location.hash.replace('#','');
  navigate(pages.includes(initial) ? initial : 'home');
})();
                     
