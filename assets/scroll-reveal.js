import { prefersReducedMotion } from '@theme/utilities';

const TARGET_SELECTOR = '.shopify-section, [data-scroll-reveal]';
const VISIBLE_CLASS = 'scroll-reveal--visible';

function getOffset(element) {
  const rawOffset = element.dataset.scrollRevealOffset;
  const parsedOffset = Number.parseInt(rawOffset ?? '', 10);
  return Number.isFinite(parsedOffset) ? parsedOffset : 32;
}

function getDuration(element) {
  const rawDuration = element.dataset.scrollRevealDuration;
  const parsedDuration = Number.parseInt(rawDuration ?? '', 10);
  return Number.isFinite(parsedDuration) ? parsedDuration : 450;
}

function setupScrollReveal() {
  if (prefersReducedMotion()) {
    return;
  }

  const elements = Array.from(document.querySelectorAll(TARGET_SELECTOR)).filter((element) => !element.closest('#shopify-section-header-group'));

  if (!elements.length) return;

  elements.forEach((element) => {
    element.classList.add('scroll-reveal');
    element.style.setProperty('--scroll-reveal-offset', `${getOffset(element)}px`);
    element.style.setProperty('--scroll-reveal-duration', `${getDuration(element)}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(VISIBLE_CLASS, entry.isIntersecting);
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  elements.forEach((element) => observer.observe(element));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupScrollReveal, { once: true });
} else {
  setupScrollReveal();
}
