const toggleButton = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.site-nav');
const revealElements = document.querySelectorAll('[data-reveal]');
const heroButtons = document.querySelectorAll('[data-image]');
const heroImages = document.querySelectorAll('.hero-image');
const heroSection = document.querySelector('.hero');

function setActiveHeroImage(name) {
  heroImages.forEach((img) => {
    img.classList.toggle('active', img.dataset.image === name);
  });
}

function clearActiveHeroImage() {
  setActiveHeroImage('default');
}

heroButtons.forEach((button) => {
  button.addEventListener('mouseenter', () => setActiveHeroImage(button.dataset.image));
  button.addEventListener('focus', () => setActiveHeroImage(button.dataset.image));
  button.addEventListener('click', () => setActiveHeroImage(button.dataset.image));
});

heroSection?.addEventListener('mouseleave', clearActiveHeroImage);

if (toggleButton && navMenu) {
  toggleButton.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    toggleButton.setAttribute('aria-expanded', navMenu.classList.contains('open'));
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => observer.observe(element));

window.addEventListener('click', (event) => {
  if (!navMenu?.contains(event.target) && !toggleButton?.contains(event.target)) {
    navMenu?.classList.remove('open');
  }
});

setActiveHeroImage('default');
