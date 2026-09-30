/*=============== HOME SPLIT TEXT ===============*/
document.querySelectorAll('.home__split, .home__profession-1, .home__profession-2').forEach((el, n) => {
  const text = el.textContent; el.textContent = '';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'split-char'; s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.animationDelay = `${n * 0.25 + i * 0.04}s`;
    el.appendChild(s);
  });
});

/*=============== PROJECT SLIDES (from projects.js) + SWIPER ===============*/
const slides = document.getElementById('projects-slides');
PROJECTS.forEach((p, i) => {
  slides.insertAdjacentHTML('beforeend', `
    <article class="swiper-slide projects__card">
      <img src="assets/img/${p.img}" alt="${p.title.replace(/<br>/g, '')}" class="projects__img">
      <div class="projects__data">
        <span class="projects__number">0${i + 1}</span>
        <h3 class="projects__type">${p.type}</h3>
        <h2 class="projects__title">${p.title}</h2>
        <h4 class="projects__subtitle">Technologies used</h4>
        <p class="projects__tech">${p.tech.join(', ')}.</p>
        <ul class="projects__points">${p.points.map(t => `<li>${t}</li>`).join('')}</ul>
        <div class="projects__links">
          ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener" class="projects__link">Live Demo <i class="ri-external-link-line"></i></a>` : ''}
          ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="projects__link">GitHub <i class="ri-github-line"></i></a>` : ''}
        </div>
      </div>
    </article>`);
});
new Swiper('.projects__swiper', {
  loop: PROJECTS.length > 2, grabCursor: true, slidesPerView: 1, spaceBetween: 24,
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: { 1150: { slidesPerView: 2, spaceBetween: 32 } }
});

/*=============== WORK TABS ===============*/
const tabs = document.querySelectorAll('.work__button'), tabContents = document.querySelectorAll('.work__content');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabContents.forEach(c => c.classList.remove('work-show'));
  tabs.forEach(t => t.classList.remove('work-active'));
  document.querySelector(tab.dataset.target).classList.add('work-show');
  tab.classList.add('work-active');
}));

/*=============== SERVICES ACCORDION ===============*/
const cards = document.querySelectorAll('.services__card');
cards.forEach(card => card.querySelector('.services__header').addEventListener('click', () => {
  const open = card.classList.contains('services-open');
  cards.forEach(c => c.classList.remove('services-open'));
  if (!open) card.classList.add('services-open');
}));

/*=============== CERTIFICATIONS: DUPLICATE CARDS FOR INFINITE SCROLL ===============*/
const certs = document.querySelector('.certs__content');
[...certs.children].forEach(c => certs.appendChild(c.cloneNode(true)));

/*=============== COPY EMAIL IN CONTACT ===============*/
const copyBtn = document.getElementById('copy-email');
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(document.querySelector('.contact__email').textContent.trim()).then(() => {
    copyBtn.querySelector('span').textContent = 'Email copied ✓';
    setTimeout(() => copyBtn.querySelector('span').textContent = 'Copy email', 2000);
  });
});

/*=============== CURRENT YEAR OF THE FOOTER ===============*/
document.getElementById('year').textContent = new Date().getFullYear();

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const secs = document.querySelectorAll('section[id]');
addEventListener('scroll', () => {
  const y = scrollY + 120;
  secs.forEach(s => {
    const link = document.querySelector(`.nav__link[href="#${s.id}"]`);
    if (link) link.classList.toggle('active-link', y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
  });
  document.getElementById('header').classList.toggle('header-blur', scrollY > 20);
});

/*=============== CUSTOM CURSOR ===============*/
const cursor = document.querySelector('.cursor');
addEventListener('mousemove', e => { cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; cursor.style.opacity = 1; });
/* Hide custom cursor on links */
document.querySelectorAll('a, button, .services__header').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hide'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hide'));
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
if (typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({ origin: 'top', distance: '60px', duration: 2000, delay: 200 });
  sr.reveal('.home__img, .about__img, .section__title, .contact__data');
  sr.reveal('.home__data, .about__data', { origin: 'left' });
  sr.reveal('.home__info, .contact__info', { origin: 'right' });
  sr.reveal('.projects__swiper, .work__container, .services__card, .certs__container', { interval: 100 });
}
