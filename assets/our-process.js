(() => {
  const selectors = {
    section: '[data-our-process-section]',
    viewport: '[data-our-process-viewport]',
    track: '[data-our-process-track]',
    card: '.our-process__card'
  };

  const getGsapRuntime = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger || window.gsap?.plugins?.ScrollTrigger;

    if (!gsap || !ScrollTrigger) return null;
    return { gsap, ScrollTrigger };
  };

  const getTotalScroll = (track, viewport) => Math.max(0, track.scrollWidth - viewport.clientWidth);

  const initProcessSection = (section, runtime) => {
    const { gsap } = runtime;
    const viewport = section.querySelector(selectors.viewport);
    const track = section.querySelector(selectors.track);

    if (!viewport || !track) return;

    const cards = track.querySelectorAll(selectors.card);
    if (cards.length < 2) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const tween = gsap.to(track, {
        x: () => -getTotalScroll(track, viewport),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: () => `+=${Math.max(1, getTotalScroll(track, viewport))}`,
          pin: true,
          pinSpacing: false,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: 'transform' });
      };
    });
  };

  const onReady = () => {
    const runtime = getGsapRuntime();
    if (!runtime) return;

    const { gsap, ScrollTrigger } = runtime;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll(selectors.section).forEach((section) => initProcessSection(section, runtime));

    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    }, { once: true });

    ScrollTrigger.refresh();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
