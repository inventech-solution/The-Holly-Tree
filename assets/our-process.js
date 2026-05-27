(() => {
  const selectors = {
    section: '[data-our-process-section]',
    viewport: '[data-our-process-viewport]',
    track: '[data-our-process-track]',
    card: '.our-process__card'
  };

  const state = new WeakMap();

  const getGsapRuntime = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger || window.gsap?.plugins?.ScrollTrigger;

    if (!gsap || !ScrollTrigger) return null;
    return { gsap, ScrollTrigger };
  };

  const getTotalScroll = (track, viewport) => Math.max(0, track.scrollWidth - viewport.clientWidth);

  const destroyProcessSection = (section) => {
    const teardown = state.get(section);
    if (typeof teardown === 'function') teardown();
    state.delete(section);
  };

  const initProcessSection = (section, runtime) => {
    destroyProcessSection(section);

    const { gsap } = runtime;
    const viewport = section.querySelector(selectors.viewport);
    const track = section.querySelector(selectors.track);

    if (!viewport || !track) return;

    const cards = track.querySelectorAll(selectors.card);
    if (cards.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const totalScroll = getTotalScroll(track, viewport);
      if (totalScroll <= 0) return undefined;

      const tween = gsap.to(track, {
        x: () => -getTotalScroll(track, viewport),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(1, getTotalScroll(track, viewport))}`,
          pin: true,
          pinSpacing: true,
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

    state.set(section, () => {
      mm.revert();
      gsap.set(track, { clearProps: 'transform' });
    });
  };

  const onReady = () => {
    const runtime = getGsapRuntime();
    if (!runtime) return;

    const { gsap, ScrollTrigger } = runtime;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll(selectors.section).forEach((section) => initProcessSection(section, runtime));

    document.addEventListener('shopify:section:load', (event) => {
      const section = event.target?.matches?.(selectors.section)
        ? event.target
        : event.target?.querySelector?.(selectors.section);

      if (section) {
        initProcessSection(section, runtime);
        ScrollTrigger.refresh();
      }
    });

    document.addEventListener('shopify:section:unload', (event) => {
      const section = event.target?.matches?.(selectors.section)
        ? event.target
        : event.target?.querySelector?.(selectors.section);

      if (section) {
        destroyProcessSection(section);
        ScrollTrigger.refresh();
      }
    });

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
