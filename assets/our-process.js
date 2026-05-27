(() => {
  const selectors = {
    section: '[data-our-process-section]',
    viewport: '[data-our-process-viewport]',
    track: '[data-our-process-track]',
    card: '.our-process__card'
  };

  const canUseGsap = () => typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  const initProcessSection = (section) => {
    const viewport = section.querySelector(selectors.viewport);
    const track = section.querySelector(selectors.track);
    if (!viewport || !track) return;

    const cards = track.querySelectorAll(selectors.card);
    if (cards.length < 2 || !canUseGsap()) return;

    const mm = window.gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const totalScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (!totalScroll) return undefined;

      const tween = window.gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        window.gsap.set(track, { clearProps: 'transform' });
      };
    });
  };

  const onReady = () => {
    if (!canUseGsap()) return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    document.querySelectorAll(selectors.section).forEach(initProcessSection);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
