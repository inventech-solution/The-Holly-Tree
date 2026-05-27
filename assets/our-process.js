(() => {
  const selectors = {
    section: '[data-our-process-section]',
    viewport: '[data-our-process-viewport]',
    track: '[data-our-process-track]',
    card: '.our-process__card'
  };

  const LOG_PREFIX = '[our-process]';

  const getGsapRuntime = () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger || window.gsap?.plugins?.ScrollTrigger;

    if (!gsap) {
      console.log(`${LOG_PREFIX} GSAP not available on window.`);
      return null;
    }

    if (!ScrollTrigger) {
      console.log(`${LOG_PREFIX} ScrollTrigger not available on window/plugin registry.`);
      return null;
    }

    return { gsap, ScrollTrigger };
  };

  const initProcessSection = (section, runtime) => {
    const { gsap } = runtime;
    const viewport = section.querySelector(selectors.viewport);
    const track = section.querySelector(selectors.track);

    if (!viewport || !track) {
      console.log(`${LOG_PREFIX} Missing viewport/track in section`, section);
      return;
    }

    const cards = track.querySelectorAll(selectors.card);
    if (cards.length < 2) {
      console.log(`${LOG_PREFIX} Skipping: expected at least 2 cards, found ${cards.length}.`);
      return;
    }

    console.log(`${LOG_PREFIX} Initializing section`, {
      sectionId: section.dataset.sectionId,
      cards: cards.length,
      viewportWidth: viewport.clientWidth,
      trackWidth: track.scrollWidth,
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const totalScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
      console.log(`${LOG_PREFIX} Desktop media query matched`, {
        sectionId: section.dataset.sectionId,
        totalScroll,
        viewportWidth: viewport.clientWidth,
        trackWidth: track.scrollWidth,
      });

      if (!totalScroll) {
        console.log(`${LOG_PREFIX} Skipping GSAP tween because totalScroll is 0.`);
        return undefined;
      }

      const tween = gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            console.log(`${LOG_PREFIX} ScrollTrigger refreshed`, {
              sectionId: section.dataset.sectionId,
              start: self.start,
              end: self.end,
              progress: self.progress,
            });
          },
        }
      });

      console.log(`${LOG_PREFIX} GSAP tween + ScrollTrigger created`, {
        sectionId: section.dataset.sectionId,
        end: totalScroll,
      });

      return () => {
        console.log(`${LOG_PREFIX} Cleaning up GSAP tween`, { sectionId: section.dataset.sectionId });
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

    const sections = document.querySelectorAll(selectors.section);
    console.log(`${LOG_PREFIX} Found sections`, { count: sections.length });

    sections.forEach((section) => initProcessSection(section, runtime));
    ScrollTrigger.refresh();
    console.log(`${LOG_PREFIX} Forced ScrollTrigger.refresh after init.`);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
