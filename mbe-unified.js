(() => {
  const tool = "romans";
  const illustratedVersion = "romans-inline-notes-16";
  const danielFontsHref = "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@400;500;600&display=swap";
  const headerMarkup = "<header class=\"mbe-global-shell\" data-tool=\"romans\" data-embedded=\"true\">\n      <div class=\"mbe-shell-wrap\">\n        <div class=\"mbe-ribbon-left\">\n          <a class=\"mbe-ribbon-brand\" href=\"https://mybibleexplorer.com\" aria-label=\"My Bible Explorer home\"><img class=\"mbe-ribbon-logo\" src=\"/assets/my-bible-explorer-logo.png\" alt=\"My Bible Explorer\"></a>\n          <a class=\"mbe-ribbon-back\" href=\"https://mybibleexplorer.com/#journeys\">Back to Library</a>\n        </div>\n        <nav class=\"mbe-global-nav\" aria-label=\"My Bible Explorer\">\n          <details class=\"mbe-library-menu\">\n            <summary class=\"mbe-library-toggle\">Library</summary>\n            <div class=\"mbe-library-panel\">\n              <div class=\"mbe-library-grid\">\n            <a class=\"mbe-library-item\" href=\"https://hermeneutics.mybibleexplorer.com\"><span class=\"mbe-library-name\">Hermeneutics</span><span class=\"mbe-library-desc\">Learn to read Scripture faithfully</span></a>\n            <a class=\"mbe-library-item\" href=\"https://psalms.mybibleexplorer.com\"><span class=\"mbe-library-name\">Psalms</span><span class=\"mbe-library-desc\">Worship, lament, praise, and prayer</span></a>\n            <a class=\"mbe-library-item\" href=\"https://daniel.mybibleexplorer.com\"><span class=\"mbe-library-name\">Daniel</span><span class=\"mbe-library-desc\">Prophecy and providence</span></a>\n            <a class=\"mbe-library-item\" href=\"https://revelation.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Revelation</span><span class=\"mbe-library-desc\">Symbols, judgment, and final hope</span></a>\n            <a class=\"mbe-library-item\" href=\"https://sanctuary.mybibleexplorer.com/#structure\"><span class=\"mbe-library-name\">Sanctuary</span><span class=\"mbe-library-desc\">A blueprint of salvation</span></a>\n            <a class=\"mbe-library-item\" href=\"https://lastdayevents.mybibleexplorer.com/index.html\"><span class=\"mbe-library-name\">Last Day Events</span><span class=\"mbe-library-desc\">Earth's final chapter</span></a>\n            <a class=\"mbe-library-item\" href=\"https://romans.mybibleexplorer.com\" aria-current=\"page\"><span class=\"mbe-library-name\">Romans</span><span class=\"mbe-library-desc\">Righteousness by faith and life in the Spirit</span></a>\n              </div>\n            </div>\n          </details>\n          <a class=\"mbe-ribbon-give\" href=\"https://mybibleexplorer.com/#donate\">Support</a>\n        </nav>\n      </div>\n    </header>\n";
  const footerMarkup = "<footer class=\"mbe-global-footer\" data-tool=\"romans\">\n      <div class=\"mbe-shell-wrap mbe-footer-wrap\">\n        <a class=\"mbe-footer-brand\" href=\"https://mybibleexplorer.com\" aria-label=\"My Bible Explorer home\"><img class=\"mbe-footer-logo\" src=\"/assets/my-bible-explorer-logo.png\" alt=\"My Bible Explorer\"></a>\n        <span>Know the Word. Live the Word.</span>\n        <span>To contact, email <a class=\"mbe-footer-link\" href=\"mailto:admin@mybibleexplorer.com\">admin@mybibleexplorer.com</a></span>\n        <a class=\"mbe-footer-link\" href=\"https://mybibleexplorer.com/#donate\">Support</a>\n        <span>&copy; <span data-mbe-year></span> My Bible Explorer</span>\n      </div>\n    </footer>\n    ";

  function updateYear() {
    document.querySelectorAll('[data-mbe-year]').forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
  }

  function forceDarkTheme() {
    const html = document.documentElement;
    if (!html) return;
    html.classList.add('dark');
    html.style.colorScheme = 'dark';
  }

  function removeThemeToggle() {
    document.querySelectorAll('.theme-word-toggle').forEach((node) => {
      node.remove();
    });
  }

  function ensureDanielFonts() {
    if (!document.head) return;
    if (!document.querySelector('link[data-romans-font-preconnect="googleapis"]')) {
      const preconnectGoogle = document.createElement('link');
      preconnectGoogle.rel = 'preconnect';
      preconnectGoogle.href = 'https://fonts.googleapis.com';
      preconnectGoogle.setAttribute('data-romans-font-preconnect', 'googleapis');
      document.head.appendChild(preconnectGoogle);
    }
    if (!document.querySelector('link[data-romans-font-preconnect="gstatic"]')) {
      const preconnectStatic = document.createElement('link');
      preconnectStatic.rel = 'preconnect';
      preconnectStatic.href = 'https://fonts.gstatic.com';
      preconnectStatic.crossOrigin = '';
      preconnectStatic.setAttribute('data-romans-font-preconnect', 'gstatic');
      document.head.appendChild(preconnectStatic);
    }
    let fontLink = document.getElementById('romans-daniel-fonts');
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = 'romans-daniel-fonts';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    if (fontLink.getAttribute('href') !== danielFontsHref) {
      fontLink.href = danielFontsHref;
    }
  }

  function ensureIllustratedAssets() {
    if (!document.head) return;
    ensureDanielFonts();
    const href = '/romans-illustrated.css?v=' + illustratedVersion;
    const existing = document.querySelector('link[data-romans-illustrated="css"]');
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-romans-illustrated', 'css');
      document.head.appendChild(link);
    } else if (existing.getAttribute('href') !== href) {
      existing.href = href;
    }
  }

  function routePath() {
    const path = window.location.pathname || '/';
    return path.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
  }

  function syncRomansRouteMeta() {
    if (!document.body) return;
    const path = routePath();
    const chapterMatch = path.match(/^\/romans\/([1-9]|1[0-6])$/);
    document.body.removeAttribute('data-romans-route');
    document.body.removeAttribute('data-romans-chapter');
    if (path === '/') {
      document.body.setAttribute('data-romans-route', 'home');
      return;
    }
    if (path === '/introduction') {
      document.body.setAttribute('data-romans-route', 'introduction');
      return;
    }
    if (chapterMatch) {
      document.body.setAttribute('data-romans-route', 'commentary');
      document.body.setAttribute('data-romans-chapter', chapterMatch[1]);
      return;
    }
    if (path === '/search') {
      document.body.setAttribute('data-romans-route', 'search');
    }
  }

  function syncChapterTopicPills() {
    document.querySelectorAll('.romans-chapter-tags').forEach((node) => {
      node.remove();
    });
  }

  function isMobileInlineNoteViewport() {
    return window.matchMedia ? window.matchMedia('(max-width: 1023.98px)').matches : window.innerWidth < 1024;
  }

  function verseReferenceFromButton(button) {
    const match = button && button.id ? button.id.match(/^romans-(\d+)-(\d+)$/) : null;
    if (!match) return null;
    return {
      chapter: match[1],
      verse: match[2],
      text: 'Romans ' + match[1] + ':' + match[2],
      inlineId: 'inline-note-' + match[1] + '-' + match[2]
    };
  }

  function removeRomansInlineNotes() {
    document.querySelectorAll('[data-romans-inline-note]').forEach((node) => {
      node.remove();
    });
  }

  function sanitizeInlineNoteIds(note, reference) {
    note.id = reference.inlineId;
    note.querySelectorAll('[id]').forEach((node, index) => {
      node.id = reference.inlineId + '-' + (index + 1);
    });
    note.querySelectorAll('[for]').forEach((node) => {
      node.removeAttribute('for');
    });
  }

  function hideMobileCommentaryDrawer() {
    document.querySelectorAll('[data-commentary-panel][data-state="open"], [data-mobile-commentary][data-state="open"], .commentary-drawer[data-state="open"]').forEach((node) => {
      node.setAttribute('data-state', 'closed');
      node.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('button[aria-label="Close study notes"], button[aria-label="Close Study Notes"]').forEach((button) => {
      if (button.offsetParent !== null) button.click();
    });
  }

  function cloneCurrentCommentaryForVerse(verseButton, reference) {
    if (!isMobileInlineNoteViewport()) {
      removeRomansInlineNotes();
      return false;
    }
    const source = document.querySelector('.commentary-pane .exposition-card');
    const heading = source ? source.querySelector('.exposition-card-heading h2') : null;
    if (!source || !heading || heading.textContent.trim() !== reference.text) return false;

    const verseBlock = verseButton.closest('.scripture-list-item') || verseButton.parentElement;
    if (!verseBlock) return false;

    removeRomansInlineNotes();
    const inlineNote = source.cloneNode(true);
    inlineNote.classList.add('romans-inline-note');
    inlineNote.setAttribute('data-romans-inline-note', reference.text);
    inlineNote.setAttribute('role', 'region');
    inlineNote.setAttribute('aria-label', reference.text + ' study note');
    sanitizeInlineNoteIds(inlineNote, reference);
    verseBlock.appendChild(inlineNote);
    hideMobileCommentaryDrawer();
    return true;
  }

  function syncRomansInlineNoteForVerse(verseButton, attempt) {
    const reference = verseReferenceFromButton(verseButton);
    if (!reference) return;
    if (!isMobileInlineNoteViewport()) {
      removeRomansInlineNotes();
      return;
    }
    if (cloneCurrentCommentaryForVerse(verseButton, reference)) return;
    if ((attempt || 0) < 16) {
      window.setTimeout(() => syncRomansInlineNoteForVerse(verseButton, (attempt || 0) + 1), 60);
    }
  }

  function syncRomansInlineNoteFromActiveVerse() {
    const active = document.querySelector('.scripture-pane .scripture-card-active[id^="romans-"]');
    if (active) syncRomansInlineNoteForVerse(active, 0);
  }

  function installRomansInlineNotes() {
    if (window.__romansInlineNotesInstalled) return;
    window.__romansInlineNotesInstalled = true;
    document.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const verseButton = event.target.closest('.scripture-pane button.scripture-card[id^="romans-"]');
      if (!verseButton) return;
      window.setTimeout(() => syncRomansInlineNoteForVerse(verseButton, 0), 0);
    });
    window.addEventListener('hashchange', () => {
      window.setTimeout(syncRomansInlineNoteFromActiveVerse, 0);
    });
    window.addEventListener('resize', () => {
      if (isMobileInlineNoteViewport()) {
        syncRomansInlineNoteFromActiveVerse();
      } else {
        removeRomansInlineNotes();
      }
    });
  }

  function ensureShell() {
    if (!document.body) return;
    forceDarkTheme();
    ensureIllustratedAssets();
    syncRomansRouteMeta();
    syncChapterTopicPills();
    installRomansInlineNotes();
    if (!isMobileInlineNoteViewport()) removeRomansInlineNotes();
    removeThemeToggle();
    document.body.classList.add('mbe-shell-managed');
    document.querySelectorAll('.mbe-global-shell').forEach((node, index) => {
      if (index > 0 || node.getAttribute('data-tool') !== tool || !node.hasAttribute('data-embedded')) node.remove();
    });
    if (!document.querySelector('.mbe-global-shell[data-tool="' + tool + '"][data-embedded="true"]')) {
      document.body.insertAdjacentHTML('afterbegin', headerMarkup);
    }
    const existingFooters = Array.from(document.querySelectorAll('.mbe-global-footer'));
    let footer = existingFooters.find((node) => node.getAttribute('data-tool') === tool) || null;
    existingFooters.forEach((node) => {
      if (node !== footer) node.remove();
    });
    if (!footer) {
      document.body.insertAdjacentHTML('beforeend', footerMarkup);
      footer = document.querySelector('.mbe-global-footer[data-tool="' + tool + '"]');
    }
    if (footer && footer.parentElement === document.body && footer !== document.body.lastElementChild) {
      document.body.appendChild(footer);
    }
    removeThemeToggle();
    updateYear();
  }

  function installRouteWatcher() {
    if (window.__romansRouteWatcherInstalled) return;
    window.__romansRouteWatcherInstalled = true;
    const refresh = () => window.setTimeout(ensureShell, 0);
    ['pushState', 'replaceState'].forEach((method) => {
      const original = history[method];
      history[method] = function patchedHistoryMethod() {
        const result = original.apply(this, arguments);
        refresh();
        return result;
      };
    });
    window.addEventListener('popstate', refresh);
  }

  forceDarkTheme();
  installRouteWatcher();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureShell, { once: true });
  } else {
    ensureShell();
  }
  window.addEventListener('load', () => {
    ensureShell();
    window.setTimeout(ensureShell, 300);
    window.setTimeout(ensureShell, 1000);
  });
})();
