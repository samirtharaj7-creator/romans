(() => {
  function installGospelTimeline() {
    const timeline = document.querySelector('.gospel-timeline');
    if (!timeline || timeline.hasAttribute('data-gospel-ready')) return;
    timeline.setAttribute('data-gospel-ready', 'true');

    const stages = Array.from(timeline.querySelectorAll('[data-gospel-stage]'));
    const progress = document.querySelector('[data-gospel-progress]');
    const progressLinks = progress ? Array.from(progress.querySelectorAll('[data-gospel-progress-link]')) : [];
    if (!stages.length) return;

    const stageFromHash = () => {
      if (!window.location.hash) return null;
      const id = decodeURIComponent(window.location.hash.slice(1));
      return stages.find((stage) => stage.id === id) || null;
    };

    const progressLinkFor = (stage) => progressLinks.find((link) => link.getAttribute('href') === `#${stage.id}`) || null;

    const setCurrentProgress = (stage, reveal = false) => {
      progressLinks.forEach((link) => {
        if (link === progressLinkFor(stage)) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
      if (reveal) {
        progressLinkFor(stage)?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    };

    const openStage = (stage, { updateHash = false, scroll = false } = {}) => {
      if (!stage) return;
      stages.forEach((candidate) => {
        const toggle = candidate.querySelector('[data-gospel-stage-toggle]');
        const panel = candidate.querySelector('[data-gospel-stage-expanded]');
        const isOpen = candidate === stage;
        candidate.classList.toggle('gospel-stage-active', isOpen);
        toggle?.setAttribute('aria-expanded', String(isOpen));
        if (panel) panel.hidden = !isOpen;
      });
      setCurrentProgress(stage, true);
      if (updateHash && window.location.hash !== `#${stage.id}`) {
        history.pushState(null, '', `#${stage.id}`);
      }
      if (scroll) {
        window.requestAnimationFrame(() => {
          stage.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start',
          });
        });
      }
    };

    stages.forEach((stage) => {
      const toggle = stage.querySelector('[data-gospel-stage-toggle]');
      toggle?.addEventListener('click', () => {
        openStage(stage, { updateHash: true });
      });
      toggle?.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openStage(stage, { updateHash: true });
      });
    });

    progressLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = decodeURIComponent((link.getAttribute('href') || '').replace(/^#/, ''));
        const stage = stages.find((candidate) => candidate.id === id);
        if (!stage) return;
        event.preventDefault();
        openStage(stage, { updateHash: true, scroll: true });
      });
    });

    const initialStage = stageFromHash() || stages[0];
    openStage(initialStage);

    window.addEventListener('hashchange', () => {
      const stage = stageFromHash();
      if (stage) openStage(stage);
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrentProgress(visible.target);
      }, {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.35, 0.6],
      });
      stages.forEach((stage) => observer.observe(stage));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installGospelTimeline, { once: true });
  } else {
    installGospelTimeline();
  }
})();
