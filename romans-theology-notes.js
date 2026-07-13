(() => {
  function isMobileViewport() {
    return window.matchMedia ? window.matchMedia('(max-width: 1023.98px)').matches : window.innerWidth < 1024;
  }

  function removeInlineNotes() {
    document.querySelectorAll('[data-romans-inline-note]').forEach((note) => note.remove());
  }

  function cloneInlineNote(verseButton, attempt = 0) {
    if (!isMobileViewport()) {
      removeInlineNotes();
      return;
    }
    const match = verseButton?.id?.match(/^romans-(\d+)-(\d+)$/u);
    if (!match) return;
    const reference = `Romans ${match[1]}:${match[2]}`;
    const source = document.querySelector('.commentary-pane .exposition-card');
    const heading = source?.querySelector('.exposition-card-heading h2, h2')?.textContent?.trim();
    const verseBlock = verseButton.closest('.scripture-list-item') || verseButton.parentElement;
    if (!source || heading !== reference || !verseBlock) {
      if (attempt < 12) window.setTimeout(() => cloneInlineNote(verseButton, attempt + 1), 60);
      return;
    }
    removeInlineNotes();
    const inline = source.cloneNode(true);
    const baseId = `inline-note-${match[1]}-${match[2]}`;
    inline.id = baseId;
    inline.classList.add('romans-inline-note');
    inline.setAttribute('data-romans-inline-note', reference);
    inline.setAttribute('role', 'region');
    inline.setAttribute('aria-label', `${reference} study note`);
    inline.querySelectorAll('[id]').forEach((node, index) => {
      node.id = `${baseId}-${index + 1}`;
    });
    inline.querySelectorAll('[for]').forEach((node) => node.removeAttribute('for'));
    verseBlock.appendChild(inline);
  }

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const verseButton = event.target.closest('button[id^="romans-"]');
    if (!verseButton) return;
    if (verseButton) window.setTimeout(() => cloneInlineNote(verseButton), 0);
  }, true);

  window.addEventListener('hashchange', () => {
    window.setTimeout(() => cloneInlineNote(document.querySelector('.scripture-card-active[id^="romans-"]')), 140);
  });
  window.addEventListener('resize', () => {
    if (!isMobileViewport()) removeInlineNotes();
  });
})();
