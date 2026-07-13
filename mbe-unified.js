(() => {
  const tool = "romans";
  const illustratedVersion = "romans-intro-no-eyebrow-61";
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
    if (path === '/articles' || path.startsWith('/articles/')) {
      document.body.setAttribute('data-romans-route', 'articles');
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

  function syncArticlesNavigation() {
    const isArticlesRoute = routePath() === '/articles' || routePath().startsWith('/articles/');
    document.querySelectorAll('.reader-nav, .reader-menu').forEach((nav) => {
      let articlesLink = Array.from(nav.querySelectorAll('a')).find((link) => {
        const href = link.getAttribute('href') || '';
        return href === '/articles' || href === '/articles/';
      });
      if (!articlesLink) {
        articlesLink = document.createElement('a');
        articlesLink.href = '/articles/';
        articlesLink.textContent = 'Articles';
        articlesLink.className = nav.classList.contains('reader-menu') ? 'reader-menu-link' : 'reader-nav-link';
        const searchLink = Array.from(nav.querySelectorAll('a')).find((link) => {
          const href = link.getAttribute('href') || '';
          return href === '/search' || href === '/search/';
        });
        nav.insertBefore(articlesLink, searchLink || null);
      }

      articlesLink.classList.toggle('reader-nav-link-active', isArticlesRoute && nav.classList.contains('reader-nav'));
      articlesLink.classList.toggle('reader-menu-link-active', isArticlesRoute && nav.classList.contains('reader-menu'));
      if (isArticlesRoute) {
        nav.querySelectorAll('a').forEach((link) => {
          if (link === articlesLink) return;
          link.classList.remove('reader-nav-link-active', 'reader-menu-link-active');
          link.removeAttribute('aria-current');
        });
        articlesLink.setAttribute('aria-current', 'page');
      } else {
        articlesLink.removeAttribute('aria-current');
      }
    });
  }

  function syncHomeArticlesCard() {
    if (routePath() !== '/') return;
    const grid = document.querySelector('.home-action-grid');
    if (!grid || grid.querySelector('[data-romans-articles-card]')) return;
    const card = document.createElement('a');
    card.className = 'home-action-card';
    card.href = '/articles/';
    card.setAttribute('data-romans-articles-card', 'true');
    card.innerHTML = '<span class="home-action-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><path d="M8 7h8"></path><path d="M8 11h6"></path></svg></span><strong>Read the Articles</strong><span>Explore guides that follow Paul\'s argument, context, and theology across the whole letter.</span><em>Open <span aria-hidden="true">&rarr;</span></em>';
    grid.appendChild(card);
  }

  function syncHomeTitle() {
    if (routePath() !== '/') return;
    const title = document.querySelector('.home-showcase-copy h1');
    if (!title || title.previousElementSibling?.classList.contains('home-title-prefix')) return;
    const prefix = document.createElement('p');
    prefix.className = 'home-title-prefix';
    prefix.textContent = 'The Epistle to the';
    title.insertAdjacentElement('beforebegin', prefix);
  }

  function syncIntroductionHero() {
    if (routePath() !== '/introduction') return;
    document.querySelector('.background-kicker')?.remove();
    document.querySelector('.background-summary')?.remove();
    document.querySelector('.background-fact-grid')?.remove();

    const title = document.querySelector('#introduction-title');
    if (title && title.dataset.romansIntroTitle !== 'split') {
      title.setAttribute('aria-label', 'Introduction to the Epistle to the Romans');
      title.dataset.romansIntroTitle = 'split';
      title.innerHTML = '<span class="background-title-kicker">Introduction to the Epistle to the</span><span class="background-title-main">Romans</span>';
    }

    const subtitle = document.querySelector('.background-subtitle');
    if (subtitle) {
      subtitle.textContent = "A concise guide to Romans' name, author, date, setting, structure, and central burden.";
    }

    const sectionLabels = [
      'Author',
      'Recipients',
      'Date & Place',
      'Setting',
      'Historical Context',
      'Central Theme',
      'Theology',
      'Outline',
      'Why Romans Matters',
    ];
    document.querySelectorAll('.background-section-nav a').forEach((link, index) => {
      const label = Array.from(link.childNodes).find((node) => (
        node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      ));
      if (label && sectionLabels[index]) label.textContent = sectionLabels[index];
    });

    const heading = document.querySelector('.background-section-nav-heading');
    if (!heading || heading.dataset.romansContentsLabel === 'true') return;
    const label = Array.from(heading.childNodes).find((node) => (
      node.nodeType === Node.TEXT_NODE && node.textContent.trim()
    ));
    if (label) label.textContent = 'Read This Page';
    heading.dataset.romansContentsLabel = 'true';
  }

  function installArticlesNavigation() {
    if (window.__romansArticlesNavigationInstalled) return;
    window.__romansArticlesNavigationInstalled = true;
    document.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('.reader-menu-button')) {
        window.setTimeout(syncArticlesNavigation, 0);
      }
    });
  }

  function installArticleReadingBar() {
    const path = routePath();
    const isArticle = path.startsWith('/articles/') && path !== '/articles';
    if (!isArticle) {
      document.querySelectorAll('[data-romans-article-reading-bar]').forEach((node) => node.remove());
      return;
    }

    if (document.querySelector('[data-romans-article-reading-bar]')) return;

    const reader = document.querySelector('.article-reader');
    const documentCard = reader ? reader.querySelector('.article-document') : null;
    const sidebar = reader ? reader.querySelector('.article-related') : null;
    const contents = sidebar ? sidebar.querySelector('.article-related-list') : null;
    if (!reader || !documentCard || !sidebar || !contents) return;

    const kicker = sidebar.querySelector(':scope > .articles-kicker');
    const heading = sidebar.querySelector(':scope > h2');
    const nextArticle = sidebar.querySelector('.article-related-next');
    if (nextArticle) {
      nextArticle.classList.add('article-end-navigation');
      documentCard.appendChild(nextArticle);
    }

    const bar = document.createElement('aside');
    bar.className = 'article-reading-bar no-print';
    bar.setAttribute('data-romans-article-reading-bar', 'true');
    if (heading && heading.id) bar.setAttribute('aria-labelledby', heading.id);

    const inner = document.createElement('div');
    inner.className = 'article-reading-bar-inner';

    const barHeading = document.createElement('div');
    barHeading.className = 'article-reading-bar-heading';
    if (kicker) barHeading.appendChild(kicker);
    if (heading) barHeading.appendChild(heading);

    contents.classList.add('article-reading-links');

    const status = document.createElement('span');
    status.className = 'article-reading-status';
    status.innerHTML = 'Read <strong data-romans-reading-percent>0%</strong>';

    const progress = document.createElement('span');
    progress.className = 'article-reading-progress';
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-label', 'Article reading progress');
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '100');
    progress.setAttribute('aria-valuenow', '0');
    progress.innerHTML = '<span data-romans-reading-progress></span>';

    inner.appendChild(barHeading);
    inner.appendChild(contents);
    inner.appendChild(status);
    bar.appendChild(inner);
    bar.appendChild(progress);
    sidebar.remove();
    reader.insertAdjacentElement('beforebegin', bar);

    const progressFill = progress.querySelector('[data-romans-reading-progress]');
    const progressPercent = status.querySelector('[data-romans-reading-percent]');
    const links = Array.from(contents.querySelectorAll('a[href^="#"]'));
    const sectionLinks = links.map((link) => {
      const section = document.getElementById(link.getAttribute('href').slice(1));
      return section ? { link, section } : null;
    }).filter(Boolean);
    let ticking = false;
    let activeLink = null;

    const stickyOffset = () => {
      const globalShell = document.querySelector('.mbe-global-shell');
      const readerHeader = document.querySelector('.reader-header');
      return (globalShell ? globalShell.getBoundingClientRect().height : 0)
        + (readerHeader ? readerHeader.getBoundingClientRect().height : 0)
        + bar.getBoundingClientRect().height;
    };

    const updateReadingBar = () => {
      if (!bar.isConnected) return;
      const readerTop = reader.getBoundingClientRect().top + window.scrollY;
      const finish = Math.max(readerTop + reader.offsetHeight - window.innerHeight, readerTop + 1);
      const ratio = Math.min(1, Math.max(0, (window.scrollY - readerTop) / (finish - readerTop)));
      const percent = Math.round(ratio * 100);
      progressFill.style.width = percent + '%';
      progressPercent.textContent = percent + '%';
      progress.setAttribute('aria-valuenow', String(percent));

      const marker = window.scrollY + stickyOffset() + 24;
      let active = sectionLinks.length ? sectionLinks[0] : null;
      sectionLinks.forEach((item) => {
        const sectionTop = item.section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= marker) active = item;
      });
      sectionLinks.forEach((item) => {
        const isActive = item === active;
        item.link.classList.toggle('is-active', isActive);
        if (isActive) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      });
      if (active && active.link !== activeLink) {
        activeLink = active.link;
        const targetLeft = active.link.offsetLeft - ((contents.clientWidth - active.link.offsetWidth) / 2);
        contents.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      }
      ticking = false;
    };

    const scheduleReadingBarUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateReadingBar);
    };

    window.addEventListener('scroll', scheduleReadingBarUpdate, { passive: true });
    window.addEventListener('resize', scheduleReadingBarUpdate);
    window.addEventListener('hashchange', scheduleReadingBarUpdate);
    updateReadingBar();
  }

  function installStaticMobileMenu() {
    const button = document.querySelector('[data-romans-static-menu-button]');
    const menu = document.querySelector('[data-romans-static-menu]');
    if (!button || !menu || button.hasAttribute('data-romans-menu-ready')) return;
    button.setAttribute('data-romans-menu-ready', 'true');
    button.addEventListener('click', () => {
      const willOpen = menu.hidden;
      menu.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
      button.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
    });
    window.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || menu.hidden) return;
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open menu');
      button.focus();
    });
  }

  function syncChapterTopicPills() {
    document.querySelectorAll('.romans-chapter-tags').forEach((node) => {
      node.remove();
    });
  }

  function isMobileInlineNoteViewport() {
    return window.matchMedia ? window.matchMedia('(max-width: 1023.98px)').matches : window.innerWidth < 1024;
  }

  function isDesktopChapterReader() {
    const isDesktop = window.matchMedia ? window.matchMedia('(min-width: 1024px)').matches : window.innerWidth >= 1024;
    return isDesktop && Boolean(document.querySelector('.split-reader'));
  }

  function pinDesktopChapterReader() {
    if (!isDesktopChapterReader()) return;
    if (document.body.scrollTop) document.body.scrollTop = 0;
    if (document.documentElement.scrollTop) document.documentElement.scrollTop = 0;
    if (window.scrollY) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function scheduleDesktopChapterReaderPin() {
    if (!isDesktopChapterReader()) return;
    pinDesktopChapterReader();
    window.requestAnimationFrame(() => {
      pinDesktopChapterReader();
      window.requestAnimationFrame(pinDesktopChapterReader);
    });
    [40, 140, 320].forEach((delay) => {
      window.setTimeout(pinDesktopChapterReader, delay);
    });
  }

  function scrollVerseWithinScripturePane(button) {
    if (!button) return;
    if (!isDesktopChapterReader()) {
      button.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    const pane = button.closest('.scripture-pane-body');
    if (pane) {
      const buttonRect = button.getBoundingClientRect();
      const paneRect = pane.getBoundingClientRect();
      const centeredOffset = Math.max(24, (pane.clientHeight - buttonRect.height) / 2);
      const targetTop = pane.scrollTop + buttonRect.top - paneRect.top - centeredOffset;
      pane.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    }
    scheduleDesktopChapterReaderPin();
  }

  function installDesktopVerseScrollContainment() {
    if (window.__romansDesktopVerseScrollContainmentInstalled) return;
    window.__romansDesktopVerseScrollContainmentInstalled = true;

    document.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const verseButton = event.target.closest('.scripture-pane button.scripture-card[id^="romans-"]');
      if (!verseButton) return;
      const reference = verseReferenceFromButton(verseButton);
      if (reference) referenceScheduleInputSync(Number(reference.chapter), Number(reference.verse));
      if (!isDesktopChapterReader()) return;
      window.requestAnimationFrame(() => scrollVerseWithinScripturePane(verseButton));
      scheduleDesktopChapterReaderPin();
    });

    window.addEventListener('hashchange', scheduleDesktopChapterReaderPin);
  }

  function clearReaderFooterState() {
    if (!document.body) return;
    document.body.removeAttribute('data-reader-footer-visible');
    document.body.style.removeProperty('--reader-footer-height');
  }

  function installRomansReaderFooterReveal() {
    const reader = document.querySelector('body[data-romans-chapter] main.reader-page > .split-reader');
    const footer = document.querySelector('body > .mbe-global-footer[data-tool="romans"]');
    const installed = window.__romansReaderFooterReveal;

    if (!reader || !footer) {
      if (installed) installed.dispose();
      window.__romansReaderFooterReveal = null;
      clearReaderFooterState();
      return;
    }

    if (installed && installed.reader === reader && installed.footer === footer) {
      installed.refresh();
      return;
    }

    if (installed) installed.dispose();

    const body = document.body;
    const desktopQuery = window.matchMedia('(min-width: 981px)');
    let disposeDesktop = null;
    let refreshDesktop = () => {};

    function installDesktopFooterReveal() {
      const panes = Array.from(reader.querySelectorAll('.scripture-pane-body, .commentary-pane-body'));
      const content = Array.from(reader.querySelectorAll('.scripture-list, .commentary-shell'));
      const atEnd = new Map(panes.map((pane) => [pane, false]));
      let animationFrame = 0;
      let pinFrame = 0;
      let footerHeight = 0;

      function syncFooterVisibility() {
        const shouldShow = Array.from(atEnd.values()).some(Boolean);
        const wasVisible = body.hasAttribute('data-reader-footer-visible');
        body.toggleAttribute('data-reader-footer-visible', shouldShow);

        if (shouldShow && !wasVisible) {
          window.cancelAnimationFrame(pinFrame);
          pinFrame = window.requestAnimationFrame(() => {
            panes.forEach((pane) => {
              if (atEnd.get(pane)) pane.scrollTop = pane.scrollHeight - pane.clientHeight;
            });
          });
        }
      }

      function measureFooter() {
        const height = Math.ceil(footer.getBoundingClientRect().height);
        if (height > 0) {
          footerHeight = height;
          body.style.setProperty('--reader-footer-height', height + 'px');
        }
      }

      function updatePane(pane) {
        const maximumScroll = pane.scrollHeight - pane.clientHeight;
        const distanceFromEnd = maximumScroll - pane.scrollTop;
        const exitThreshold = Math.max(24, footerHeight + 16);
        const threshold = atEnd.get(pane) ? exitThreshold : 4;
        atEnd.set(pane, maximumScroll > 8 && distanceFromEnd <= threshold);
      }

      function updateAll() {
        measureFooter();
        panes.forEach(updatePane);
        syncFooterVisibility();
      }

      function scheduleUpdate() {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = window.requestAnimationFrame(updateAll);
      }

      function handlePaneScroll(event) {
        updatePane(event.currentTarget);
        syncFooterVisibility();
      }

      panes.forEach((pane) => pane.addEventListener('scroll', handlePaneScroll, { passive: true }));
      const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleUpdate) : null;
      if (resizeObserver) {
        resizeObserver.observe(footer);
        panes.forEach((pane) => resizeObserver.observe(pane));
        content.forEach((element) => resizeObserver.observe(element));
      }
      window.addEventListener('resize', scheduleUpdate);
      scheduleUpdate();
      refreshDesktop = scheduleUpdate;

      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.cancelAnimationFrame(pinFrame);
        if (resizeObserver) resizeObserver.disconnect();
        window.removeEventListener('resize', scheduleUpdate);
        panes.forEach((pane) => pane.removeEventListener('scroll', handlePaneScroll));
      };
    }

    function syncViewportMode() {
      if (disposeDesktop) disposeDesktop();
      disposeDesktop = null;
      refreshDesktop = () => {};
      clearReaderFooterState();
      if (desktopQuery.matches) disposeDesktop = installDesktopFooterReveal();
    }

    syncViewportMode();
    desktopQuery.addEventListener('change', syncViewportMode);

    const controller = {
      reader,
      footer,
      refresh: () => refreshDesktop(),
      dispose: () => {
        desktopQuery.removeEventListener('change', syncViewportMode);
        if (disposeDesktop) disposeDesktop();
        clearReaderFooterState();
      }
    };
    window.__romansReaderFooterReveal = controller;
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









  // MBE reference navigator start
  const referenceNavConfig = {"book":"Romans","slug":"romans","basePath":"/romans/","storageKey":"romansRecentReferences","chapterCount":16,"verseCounts":[0,32,29,31,25,21,23,25,39,33,21,36,21,14,23,33,27],"simpleVerseIds":false};
  const referenceNavIcons = {
    arrowLeft: '<svg class="mbe-ref-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>',
    arrowRight: '<svg class="mbe-ref-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>',
    chevronDown: '<svg class="mbe-ref-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>'
  };

  function installReferenceNavStyles() {
    if (!document.head || document.getElementById('mbe-reference-nav-style')) return;
    const style = document.createElement('style');
    style.id = 'mbe-reference-nav-style';
    style.textContent = `
.mbe-ref-strip {
  position: sticky !important;
  top: calc(46px + 4rem) !important;
  z-index: 55 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 3.35rem !important;
  border-bottom: 1px solid rgba(201, 164, 76, .18) !important;
  background: rgba(19, 45, 63, .94) !important;
  padding: .35rem .75rem !important;
  box-shadow: 0 16px 34px -34px rgba(0,0,0,.9) !important;
  backdrop-filter: blur(14px) !important;
}
.mbe-ref-nav {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: .45rem !important;
  width: min(100%, 72rem) !important;
  margin: 0 auto !important;
}
.mbe-ref-form {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: .45rem !important;
  flex: 1 1 18.5rem !important;
  width: min(18.5rem, 42vw) !important;
  max-width: 24rem !important;
  min-width: 13rem !important;
  height: 2.55rem !important;
  border: 1px solid rgba(229, 205, 154, .22) !important;
  border-radius: .4rem !important;
  background: rgba(245, 234, 213, .08) !important;
  padding: 0 .72rem 0 .55rem !important;
  color: #f5ead5 !important;
}
.mbe-ref-form:focus-within {
  border-color: rgba(229, 205, 154, .48) !important;
  background: rgba(245, 234, 213, .12) !important;
}
.mbe-ref-badge {
  display: inline-grid !important;
  place-items: center !important;
  flex: 0 0 auto !important;
  width: 1.5rem !important;
  height: 1.5rem !important;
  border-radius: .22rem !important;
  background: #c9a44c !important;
  color: #0b1f3a !important;
  font-size: .48rem !important;
  font-weight: 800 !important;
  letter-spacing: .02em !important;
}
.mbe-ref-picker-toggle {
  display: inline-flex !important;
  align-items: center !important;
  gap: .4rem !important;
  flex: 0 0 auto !important;
  border: 0 !important;
  background: transparent !important;
  color: rgba(245, 234, 213, .7) !important;
  padding: 0 !important;
  cursor: pointer !important;
}
.mbe-ref-input {
  min-width: 0 !important;
  flex: 1 1 auto !important;
  border: 0 !important;
  background: transparent !important;
  color: #f5ead5 !important;
  font: 800 clamp(.92rem, 1.5vw, 1.08rem) var(--font-sans, Inter, system-ui, sans-serif) !important;
  letter-spacing: 0 !important;
  outline: 0 !important;
}
.mbe-ref-input::placeholder {
  color: rgba(245, 234, 213, .48) !important;
}
.mbe-ref-step,
.mbe-ref-recent-toggle,
.mbe-ref-all-toggle {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex: 0 0 auto !important;
  height: 2.55rem !important;
  min-width: 2.55rem !important;
  border: 1px solid rgba(229, 205, 154, .18) !important;
  border-radius: .4rem !important;
  background: rgba(245, 234, 213, .07) !important;
  color: rgba(245, 234, 213, .72) !important;
  padding: 0 .78rem !important;
  font: 800 .7rem var(--font-sans, Inter, system-ui, sans-serif) !important;
  letter-spacing: .08em !important;
  text-transform: uppercase !important;
  text-decoration: none !important;
  cursor: pointer !important;
}
.mbe-ref-step {
  width: 2.55rem !important;
  padding: 0 !important;
}
.mbe-ref-step:hover,
.mbe-ref-recent-toggle:hover,
.mbe-ref-recent-toggle[aria-expanded="true"],
.mbe-ref-all-toggle:hover,
.mbe-ref-all-toggle[aria-expanded="true"] {
  border-color: rgba(229, 205, 154, .32) !important;
  background: #c9a44c !important;
  color: #0b1f3a !important;
}
.mbe-ref-disabled {
  opacity: .36 !important;
  pointer-events: none !important;
}
.mbe-ref-icon {
  width: .95rem !important;
  height: .95rem !important;
  fill: none !important;
  stroke: currentColor !important;
  stroke-width: 2.2 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}
.mbe-ref-menu-wrap {
  position: relative !important;
  flex: 0 0 auto !important;
}
.mbe-ref-picker,
.mbe-ref-recent-dropdown,
.mbe-ref-all-dropdown {
  position: absolute !important;
  top: calc(100% + .45rem) !important;
  z-index: 120 !important;
  overflow: hidden !important;
  border: 1px solid rgba(229, 205, 154, .24) !important;
  border-radius: .45rem !important;
  background: rgba(11, 31, 58, .98) !important;
  color: #f5ead5 !important;
  box-shadow: 0 22px 55px rgba(0,0,0,.42) !important;
}
.mbe-ref-picker {
  left: 50% !important;
  width: min(24rem, calc(100vw - 1.5rem)) !important;
  transform: translateX(-50%) !important;
}
.mbe-ref-recent-dropdown,
.mbe-ref-all-dropdown {
  right: 0 !important;
  width: min(15rem, calc(100vw - 1.5rem)) !important;
}
.mbe-ref-all-dropdown {
  width: min(24rem, calc(100vw - 1.5rem)) !important;
}
.mbe-ref-picker[hidden],
.mbe-ref-recent-dropdown[hidden],
.mbe-ref-all-dropdown[hidden] {
  display: none !important;
}
.mbe-ref-picker-head {
  display: grid !important;
  grid-template-columns: 1.8rem minmax(0, 1fr) auto 1.8rem !important;
  align-items: center !important;
  gap: .35rem !important;
  padding: .55rem .65rem !important;
  border-bottom: 1px solid rgba(229, 205, 154, .14) !important;
}
.mbe-ref-picker-title {
  color: #f5ead5 !important;
  text-align: center !important;
  font: 800 clamp(.9rem, 1.6vw, 1.08rem) var(--font-sans, Inter, system-ui, sans-serif) !important;
}
.mbe-ref-back,
.mbe-ref-close,
.mbe-ref-go {
  display: inline-grid !important;
  place-items: center !important;
  min-width: 1.8rem !important;
  height: 1.8rem !important;
  border: 0 !important;
  border-radius: .35rem !important;
  background: rgba(245, 234, 213, .08) !important;
  color: rgba(245, 234, 213, .72) !important;
  font: 800 .72rem var(--font-sans, Inter, system-ui, sans-serif) !important;
  cursor: pointer !important;
}
.mbe-ref-back[hidden] {
  display: inline-grid !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
.mbe-ref-close {
  font-size: 1.32rem !important;
  line-height: 1 !important;
}
.mbe-ref-go,
.mbe-ref-back:hover,
.mbe-ref-close:hover {
  background: #c9a44c !important;
  color: #0b1f3a !important;
}
.mbe-ref-grid,
.mbe-ref-recent-list {
  display: grid !important;
  gap: .35rem !important;
  padding: .75rem !important;
}
.mbe-ref-grid {
  grid-template-columns: repeat(7, minmax(0, 1fr)) !important;
}
.mbe-ref-grid button,
.mbe-ref-recent-list button,
.mbe-ref-empty {
  min-height: 1.7rem !important;
  border: 0 !important;
  border-radius: .35rem !important;
  background: transparent !important;
  color: rgba(245, 234, 213, .72) !important;
  font: 800 clamp(.72rem, 1vw, .88rem) var(--font-sans, Inter, system-ui, sans-serif) !important;
  letter-spacing: 0 !important;
}
.mbe-ref-grid button,
.mbe-ref-recent-list button {
  cursor: pointer !important;
}
.mbe-ref-grid button:hover,
.mbe-ref-grid button.is-active,
.mbe-ref-recent-list button:hover {
  background: #c9a44c !important;
  color: #0b1f3a !important;
}
.mbe-ref-recent-list button,
.mbe-ref-empty {
  width: 100% !important;
  padding: .55rem .65rem !important;
  text-align: left !important;
}
.mbe-ref-empty {
  margin: 0 !important;
  color: rgba(245, 234, 213, .52) !important;
  font-weight: 600 !important;
}
@media (max-width: 760px) {
  .mbe-ref-strip {
    top: calc(46px + 3.75rem) !important;
    padding: .25rem .45rem !important;
  }
  .mbe-ref-nav {
    gap: .3rem !important;
  }
  .mbe-ref-form {
    width: auto !important;
    min-width: 0 !important;
    height: 2.35rem !important;
    padding: 0 .5rem 0 .42rem !important;
  }
  .mbe-ref-input {
    font-size: clamp(.86rem, 4vw, 1rem) !important;
  }
  .mbe-ref-badge {
    width: 1.32rem !important;
    height: 1.32rem !important;
    font-size: .42rem !important;
  }
  .mbe-ref-step,
  .mbe-ref-recent-toggle,
  .mbe-ref-all-toggle {
    height: 2.35rem !important;
    min-width: 2.35rem !important;
    padding: 0 .48rem !important;
    font-size: .58rem !important;
    letter-spacing: .05em !important;
  }
  .mbe-ref-picker {
    position: fixed !important;
    top: calc(46px + 3.15rem + 2.15rem) !important;
    right: 1rem !important;
    left: 1rem !important;
    width: auto !important;
    transform: none !important;
  }
  .mbe-ref-picker-head {
    grid-template-columns: 1.65rem minmax(0, 1fr) auto 1.65rem !important;
    padding: .45rem .5rem !important;
  }
  .mbe-ref-grid {
    gap: .25rem !important;
    padding: .5rem !important;
  }
  .mbe-ref-grid button {
    min-height: 1.55rem !important;
    font-size: .66rem !important;
  }
}
    `;
    document.head.appendChild(style);
  }

  function referencePathChapter() {
    const path = (window.location.pathname || '/').replace(/\/index\.html$/, '/');
    if (!path.startsWith(referenceNavConfig.basePath)) return null;
    const rest = path.slice(referenceNavConfig.basePath.length).replace(/\/+$/, '');
    if (!/^\d+$/.test(rest)) return null;
    const chapter = Number(rest);
    if (!chapter || chapter < 1 || chapter > referenceNavConfig.chapterCount) return null;
    return chapter;
  }

  function referenceUrl(chapter, verse) {
    return referenceNavConfig.basePath + chapter + '/' + (verse ? '#v' + verse : '');
  }

  function referenceFormat(chapter, verse) {
    return referenceNavConfig.book + ' ' + chapter + ':' + verse;
  }

  function referenceVerseButton(chapter, verse) {
    const id = referenceNavConfig.simpleVerseIds ? 'v-' + verse : referenceNavConfig.slug + '-' + chapter + '-' + verse;
    return document.getElementById(id);
  }

  function referenceValid(chapter, verse) {
    return chapter >= 1 && chapter <= referenceNavConfig.chapterCount && verse >= 1 && verse <= (referenceNavConfig.verseCounts[chapter] || 0);
  }

  function referenceSelectedVerse(chapter) {
    const hashMatch = (window.location.hash || '').match(/^#v-?(\d+)$/);
    if (hashMatch && referenceValid(chapter, Number(hashMatch[1]))) return Number(hashMatch[1]);
    const active = document.querySelector('.scripture-card-active[id], main[data-bible-panel] button[id^="v-"].bg-primary, main[data-bible-panel] button[id^="v-"][aria-pressed="true"]');
    const idMatch = active?.id?.match(/(\d+)$/);
    if (idMatch && referenceValid(chapter, Number(idMatch[1]))) return Number(idMatch[1]);
    return 1;
  }

  function referenceSyncInput(chapter, verse) {
    const input = document.querySelector('[data-mbe-ref-input]');
    if (input) input.value = referenceFormat(chapter, verse);
  }

  function referenceScheduleInputSync(chapter, verse) {
    referenceSyncInput(chapter, verse);
    window.requestAnimationFrame(() => referenceSyncInput(chapter, verse));
    [80, 240].forEach((delay) => {
      window.setTimeout(() => referenceSyncInput(chapter, verse), delay);
    });
  }

  function referenceReadRecent() {
    try {
      const value = JSON.parse(localStorage.getItem(referenceNavConfig.storageKey) || '[]');
      if (!Array.isArray(value)) return [];
      return value
        .map((item) => ({ chapter: Number(item.chapter), verse: Number(item.verse) }))
        .filter((item) => referenceValid(item.chapter, item.verse))
        .slice(0, 8);
    } catch (error) {
      return [];
    }
  }

  function referenceWriteRecent(references) {
    try {
      localStorage.setItem(referenceNavConfig.storageKey, JSON.stringify(references));
    } catch (error) {
      // Storage can be unavailable in restricted contexts.
    }
  }

  function referenceAddRecent(chapter, verse) {
    if (!referenceValid(chapter, verse)) return;
    const references = referenceReadRecent().filter((item) => item.chapter !== chapter || item.verse !== verse);
    references.unshift({ chapter, verse });
    referenceWriteRecent(references.slice(0, 8));
  }

  function referenceParse(raw, currentChapter) {
    let value = String(raw || '').trim().toLowerCase();
    value = value
      .replace(/[–—]/g, '-')
      .replace(new RegExp('^' + referenceNavConfig.book.toLowerCase() + '\\s+'), '')
      .replace(/^chapter\s+/, '')
      .replace(/^ch\.?\s+/, '')
      .replace(/^verse\s+/, '')
      .replace(/^v\.?\s*/, '');
    const full = value.match(/^(\d{1,2})\s*[:.]\s*(\d{1,3})$/) || value.match(/^(\d{1,2})\s+(\d{1,3})$/);
    const single = value.match(/^(\d{1,3})$/);
    let chapter = currentChapter;
    let verse = null;
    if (full) {
      chapter = Number(full[1]);
      verse = Number(full[2]);
    } else if (single) {
      verse = Number(single[1]);
    }
    if (!referenceValid(chapter, verse)) return null;
    return { chapter, verse };
  }

  function referenceSelect(chapter, verse) {
    if (!referenceValid(chapter, verse)) return;
    referenceAddRecent(chapter, verse);
    const currentChapter = referencePathChapter();
    if (chapter !== currentChapter) {
      window.location.href = referenceUrl(chapter, verse);
      return;
    }
    const button = referenceVerseButton(chapter, verse);
    if (button) {
      button.click();
      scrollVerseWithinScripturePane(button);
    }
    const hash = '#v' + verse;
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
    referenceScheduleInputSync(chapter, verse);
  }

  function referenceFindStrip() {
    const managed = document.querySelector('.mbe-ref-strip');
    if (managed) return managed;
    const explicit = document.querySelector('nav.chapter-strip, .chapter-strip');
    if (explicit) return explicit;
    const candidates = Array.from(document.querySelectorAll('.bg-background.text-foreground > div, main.reader-page > nav, .reader-page > nav'));
    return candidates.find((node) => {
      const text = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text.startsWith('Chapter')) return false;
      const linkCount = Array.from(node.querySelectorAll('a')).filter((anchor) => {
        return (anchor.getAttribute('href') || '').startsWith(referenceNavConfig.basePath);
      }).length;
      return linkCount >= Math.min(referenceNavConfig.chapterCount, 3);
    }) || null;
  }

  function referenceCreateStrip() {
    const strip = document.createElement('nav');
    strip.className = 'mbe-ref-strip no-print';
    strip.setAttribute('aria-label', referenceNavConfig.book + ' reference navigation');
    const readerShell = document.querySelector('.reader-page, .bg-background.text-foreground');
    if (readerShell) {
      readerShell.insertAdjacentElement('afterbegin', strip);
      return strip;
    }
    const header = document.querySelector('header.reader-header, header.sticky, .mbe-global-shell, header');
    if (header && header.parentNode) {
      header.insertAdjacentElement('afterend', strip);
      return strip;
    }
    if (document.body) {
      document.body.insertAdjacentElement('afterbegin', strip);
      return strip;
    }
    return null;
  }

  function installReferenceNavigator() {
    if (!document.body) return;
    installReferenceNavStyles();
    const currentChapter = referencePathChapter();
    if (!currentChapter) return;
    const strip = referenceFindStrip() || referenceCreateStrip();
    if (!strip) return;
    const signature = referenceNavConfig.slug + '-' + currentChapter;
    if (strip.getAttribute('data-mbe-ref-nav') === signature) return;

    const currentVerse = referenceSelectedVerse(currentChapter);
    const previous = currentChapter > 1 ? currentChapter - 1 : null;
    const next = currentChapter < referenceNavConfig.chapterCount ? currentChapter + 1 : null;
    strip.className = 'mbe-ref-strip no-print';
    strip.setAttribute('aria-label', referenceNavConfig.book + ' reference navigation');
    strip.setAttribute('data-mbe-ref-nav', signature);
    strip.innerHTML =
      '<div class="mbe-ref-nav">' +
      (previous ? '<a class="mbe-ref-step" href="' + referenceUrl(previous) + '" aria-label="Previous chapter">' + referenceNavIcons.arrowLeft + '</a>' : '<span class="mbe-ref-step mbe-ref-disabled" aria-hidden="true">' + referenceNavIcons.arrowLeft + '</span>') +
      '<form class="mbe-ref-form" data-mbe-ref-form>' +
      '<button class="mbe-ref-picker-toggle" data-mbe-ref-picker-toggle type="button" aria-label="Choose ' + referenceNavConfig.book + ' chapter and verse" aria-expanded="false"><span class="mbe-ref-badge">KJV</span>' + referenceNavIcons.chevronDown + '</button>' +
      '<input class="mbe-ref-input" data-mbe-ref-input type="search" inputmode="numeric" autocomplete="off" value="' + referenceFormat(currentChapter, currentVerse) + '" aria-label="Type a verse reference">' +
      '<div class="mbe-ref-picker" data-mbe-ref-picker hidden><div class="mbe-ref-picker-head"><button class="mbe-ref-back" data-mbe-ref-back type="button" aria-label="Back to chapter selection" hidden>' + referenceNavIcons.arrowLeft + '</button><strong class="mbe-ref-picker-title" data-mbe-ref-title>' + referenceNavConfig.book + '</strong><button class="mbe-ref-go" data-mbe-ref-go type="button">Go</button><button class="mbe-ref-close" data-mbe-ref-close type="button" aria-label="Close verse picker">&times;</button></div><div class="mbe-ref-grid" data-mbe-ref-grid></div></div>' +
      '</form>' +
      '<div class="mbe-ref-menu-wrap"><button class="mbe-ref-recent-toggle" data-mbe-ref-recent-toggle type="button" aria-expanded="false">Recent ' + referenceNavIcons.chevronDown + '</button><div class="mbe-ref-recent-dropdown" data-mbe-ref-recent-dropdown hidden><div class="mbe-ref-recent-list" data-mbe-ref-recent-list></div></div></div>' +
      (next ? '<a class="mbe-ref-step" href="' + referenceUrl(next) + '" aria-label="Next chapter">' + referenceNavIcons.arrowRight + '</a>' : '<span class="mbe-ref-step mbe-ref-disabled" aria-hidden="true">' + referenceNavIcons.arrowRight + '</span>') +
      '<div class="mbe-ref-menu-wrap"><button class="mbe-ref-all-toggle" data-mbe-ref-all-toggle type="button" aria-expanded="false">All</button><div class="mbe-ref-all-dropdown" data-mbe-ref-all-dropdown hidden><div class="mbe-ref-grid">' +
      Array.from({ length: referenceNavConfig.chapterCount }, (_, index) => {
        const chapter = index + 1;
        return '<button type="button" data-mbe-ref-all-chapter="' + chapter + '" class="' + (chapter === currentChapter ? 'is-active' : '') + '">' + chapter + '</button>';
      }).join('') +
      '</div></div></div>' +
      '</div>';

    let pickerChapter = currentChapter;
    let pickerVerse = currentVerse;
    const form = strip.querySelector('[data-mbe-ref-form]');
    const input = strip.querySelector('[data-mbe-ref-input]');
    const picker = strip.querySelector('[data-mbe-ref-picker]');
    const pickerToggle = strip.querySelector('[data-mbe-ref-picker-toggle]');
    const pickerBack = strip.querySelector('[data-mbe-ref-back]');
    const pickerTitle = strip.querySelector('[data-mbe-ref-title]');
    const pickerGrid = strip.querySelector('[data-mbe-ref-grid]');
    const recentToggle = strip.querySelector('[data-mbe-ref-recent-toggle]');
    const recentDropdown = strip.querySelector('[data-mbe-ref-recent-dropdown]');
    const recentList = strip.querySelector('[data-mbe-ref-recent-list]');
    const allToggle = strip.querySelector('[data-mbe-ref-all-toggle]');
    const allDropdown = strip.querySelector('[data-mbe-ref-all-dropdown]');

    const closePicker = () => {
      picker.hidden = true;
      pickerToggle.setAttribute('aria-expanded', 'false');
    };
    const closeRecent = () => {
      recentDropdown.hidden = true;
      recentToggle.setAttribute('aria-expanded', 'false');
    };
    const closeAll = () => {
      allDropdown.hidden = true;
      allToggle.setAttribute('aria-expanded', 'false');
    };
    const renderChapters = () => {
      pickerTitle.textContent = referenceNavConfig.book;
      pickerBack.hidden = true;
      pickerGrid.innerHTML = Array.from({ length: referenceNavConfig.chapterCount }, (_, index) => {
        const chapter = index + 1;
        return '<button type="button" data-mbe-ref-chapter="' + chapter + '" class="' + (chapter === pickerChapter ? 'is-active' : '') + '">' + chapter + '</button>';
      }).join('');
    };
    const renderVerses = () => {
      const maxVerse = referenceNavConfig.verseCounts[pickerChapter] || 1;
      if (pickerVerse > maxVerse) pickerVerse = 1;
      pickerTitle.textContent = referenceNavConfig.book + ' ' + pickerChapter;
      pickerBack.hidden = false;
      pickerGrid.innerHTML = Array.from({ length: maxVerse }, (_, index) => {
        const verse = index + 1;
        return '<button type="button" data-mbe-ref-verse="' + verse + '" class="' + (verse === pickerVerse ? 'is-active' : '') + '">' + verse + '</button>';
      }).join('');
    };
    const renderRecent = () => {
      const recent = referenceReadRecent();
      if (!recent.length) {
        recentList.innerHTML = '<p class="mbe-ref-empty">No recent verses yet.</p>';
        return;
      }
      recentList.innerHTML = recent.map(({ chapter, verse }) => '<button type="button" data-mbe-ref-recent-chapter="' + chapter + '" data-mbe-ref-recent-verse="' + verse + '">' + referenceFormat(chapter, verse) + '</button>').join('');
    };
    const openPicker = () => {
      pickerChapter = currentChapter;
      pickerVerse = referenceSelectedVerse(currentChapter);
      closeRecent();
      closeAll();
      renderChapters();
      picker.hidden = false;
      pickerToggle.setAttribute('aria-expanded', 'true');
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const target = referenceParse(input.value, currentChapter);
      if (target) {
        closePicker();
        closeRecent();
        closeAll();
        referenceSelect(target.chapter, target.verse);
      }
    });
    input.addEventListener('focus', () => input.select());
    input.addEventListener('click', openPicker);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        form.requestSubmit();
      }
    });
    pickerToggle.addEventListener('click', () => {
      if (picker.hidden) openPicker();
      else closePicker();
    });
    strip.querySelector('[data-mbe-ref-close]').addEventListener('click', closePicker);
    pickerBack.addEventListener('click', renderChapters);
    strip.querySelector('[data-mbe-ref-go]').addEventListener('click', () => {
      closePicker();
      referenceSelect(pickerChapter, pickerVerse);
    });
    pickerGrid.addEventListener('click', (event) => {
      const chapterButton = event.target.closest?.('[data-mbe-ref-chapter]');
      const verseButton = event.target.closest?.('[data-mbe-ref-verse]');
      if (chapterButton) {
        pickerChapter = Number(chapterButton.dataset.mbeRefChapter);
        pickerVerse = pickerChapter === currentChapter ? referenceSelectedVerse(currentChapter) : 1;
        renderVerses();
      } else if (verseButton) {
        pickerVerse = Number(verseButton.dataset.mbeRefVerse);
        closePicker();
        referenceSelect(pickerChapter, pickerVerse);
      }
    });
    recentToggle.addEventListener('click', () => {
      if (recentDropdown.hidden) {
        closePicker();
        closeAll();
        renderRecent();
        recentDropdown.hidden = false;
        recentToggle.setAttribute('aria-expanded', 'true');
      } else closeRecent();
    });
    recentList.addEventListener('click', (event) => {
      const button = event.target.closest?.('[data-mbe-ref-recent-chapter]');
      if (!button) return;
      closeRecent();
      referenceSelect(Number(button.dataset.mbeRefRecentChapter), Number(button.dataset.mbeRefRecentVerse));
    });
    allToggle.addEventListener('click', () => {
      if (allDropdown.hidden) {
        closePicker();
        closeRecent();
        allDropdown.hidden = false;
        allToggle.setAttribute('aria-expanded', 'true');
      } else closeAll();
    });
    allDropdown.addEventListener('click', (event) => {
      const button = event.target.closest?.('[data-mbe-ref-all-chapter]');
      if (!button) return;
      window.location.href = referenceUrl(Number(button.dataset.mbeRefAllChapter));
    });
    document.addEventListener('click', (event) => {
      const path = event.composedPath ? event.composedPath() : [];
      if (!path.includes(strip) && !strip.contains(event.target)) {
        closePicker();
        closeRecent();
        closeAll();
      }
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closePicker();
        closeRecent();
        closeAll();
      }
    });

    referenceAddRecent(currentChapter, currentVerse);
    if ((window.location.hash || '').match(/^#v-?\d+$/)) {
      window.setTimeout(() => referenceSelect(currentChapter, referenceSelectedVerse(currentChapter)), 120);
    }
  }
  // MBE reference navigator end


  function ensureShell() {
    if (!document.body) return;
    installReferenceNavigator();
    forceDarkTheme();
    ensureIllustratedAssets();
    syncRomansRouteMeta();
    syncArticlesNavigation();
    syncHomeTitle();
    syncIntroductionHero();
    syncHomeArticlesCard();
    installArticlesNavigation();
    installStaticMobileMenu();
    syncChapterTopicPills();
    installRomansInlineNotes();
    installDesktopVerseScrollContainment();
    if (!isMobileInlineNoteViewport()) removeRomansInlineNotes();
    removeThemeToggle();
    document.body.classList.add('mbe-shell-managed');
    document.querySelectorAll('.mbe-global-shell').forEach((node, index) => {
      if (index > 0 || node.getAttribute('data-tool') !== tool || !node.hasAttribute('data-embedded')) node.remove();
    });
    if (!document.querySelector('.mbe-global-shell[data-tool="' + tool + '"][data-embedded="true"]')) {
      document.body.insertAdjacentHTML('afterbegin', headerMarkup);
    }
    installArticleReadingBar();
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
    installRomansReaderFooterReveal();
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
        scheduleDesktopChapterReaderPin();
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
