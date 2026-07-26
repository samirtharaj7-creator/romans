import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = 'romans-home-static-75';
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@400;500;600&display=swap';
const LEGACY_STUDY_SLUGS = [
  'gospel-unfolded',
  'righteousness-by-faith',
  'adam-and-christ',
  'law-flesh-and-spirit',
  'israel-and-the-nations',
  'a-living-sacrifice',
];

const romansRoad = {
  title: 'Walking the Romans Road',
  subtitle: 'Understanding the Gospel Message in 8 Verses',
  introduction: [
    'For centuries, the New Testament book of Romans has been considered one of the most profound explanations of the Christian faith ever written. In the Apostle Paul\'s letter to the early church in Rome, he systematically lays out the human condition, the nature of God, and the path to spiritual restoration.',
    'This logical path is often called the "Romans Road to Salvation." By walking through these eight key verses, anyone can understand the core message of the gospel - from humanity\'s ultimate problem to God\'s ultimate solution.',
  ],
  steps: [
    {
      id: 'power-of-the-message',
      number: 1,
      title: 'The Power of the Message',
      reference: 'Romans 1:16',
      quote: 'For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes: first to the Jew, then to the Gentile.',
      paragraphs: [
        'The journey begins with an open invitation. The word gospel literally means "good news." Paul establishes right away that this message is not exclusive to a specific culture, background, or social status. It is a universal offer of rescue ("salvation") driven entirely by God\'s power, available to absolutely anyone willing to believe it.',
      ],
      coreTruth: 'The Gospel\'s Power',
      takeaway: 'God wants to save everyone.',
      commentaryHref: '/romans/1/#romans-1-16',
      icon: 'book-open',
      tone: 'gold',
    },
    {
      id: 'universal-problem',
      number: 2,
      title: 'The Universal Problem',
      reference: 'Romans 3:23',
      quote: 'For all have sinned and fall short of the glory of God.',
      paragraphs: [
        'Before we can appreciate the "good news," we have to understand the bad news. The Bible defines sin as missing the mark of God\'s perfect moral standard. This verse establishes that no human being is perfect. Whether by a little or a lot, every single person has failed to live up to the perfect character ("the glory") of God. We are all in the same spiritual boat.',
      ],
      coreTruth: 'The Human Problem',
      takeaway: 'All people have sinned.',
      commentaryHref: '/romans/3/#romans-3-23',
      icon: 'circle-alert',
      tone: 'crimson',
    },
    {
      id: 'flaw-of-self-effort',
      number: 3,
      title: 'The Flaw of Self-Effort',
      reference: 'Romans 3:28',
      quote: 'For we maintain that a person is justified by faith apart from the works of the law.',
      paragraphs: [
        'When faced with our imperfections, our natural human instinct is to try harder - to do good deeds, follow religious rituals, or obey laws to balance the scales. However, Paul clarifies that no amount of human effort can ever justify us (make us right in the eyes of a perfect God). Being right with God is a matter of trust (faith), not earning points through religious checklists.',
      ],
      coreTruth: 'The Limitation',
      takeaway: 'The law and good works cannot justify us.',
      commentaryHref: '/romans/3/#romans-3-28',
      icon: 'scale',
      tone: 'copper',
    },
    {
      id: 'ultimate-remedy',
      number: 4,
      title: 'The Ultimate Remedy',
      reference: 'Romans 5:8',
      quote: 'But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.',
      paragraphs: [
        'This is the turning point of the gospel. God did not wait for humanity to clean up its act or figure out how to stop sinning. While we were still failing and spiritually distant, Jesus took the initiative. His death on the cross was a deliberate sacrifice, paying the spiritual penalty that we owed, serving as the ultimate proof of God\'s love.',
      ],
      coreTruth: 'The Divine Solution',
      takeaway: 'Christ died for us while we were still failing.',
      commentaryHref: '/romans/5/#romans-5-8',
      icon: 'heart',
      tone: 'gold',
    },
    {
      id: 'gift-versus-wage',
      number: 5,
      title: 'The Gift vs. The Wage',
      reference: 'Romans 6:23',
      quote: 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.',
      paragraphs: [
        'This verse presents a stark, mathematical contrast between two outcomes:',
      ],
      contrasts: [
        ['Wages', 'What we earn by our own actions. The "wage" of our collective sin is spiritual death - permanent separation from God.'],
        ['Gift', 'What is given freely without being earned. God offers the exact opposite of what we deserve: eternal life, found entirely through a relationship with Jesus.'],
      ],
      coreTruth: 'The Two Choices',
      takeaway: 'Sin earns death; God gifts eternal life.',
      commentaryHref: '/romans/6/#romans-6-23',
      icon: 'gift',
      tone: 'gold',
    },
    {
      id: 'personal-response',
      number: 6,
      title: 'The Personal Response',
      reference: 'Romans 10:9-10',
      quote: 'If you declare with your mouth, "Jesus is Lord," and believe in your heart that God raised him from the dead, you will be saved. For it is with your heart that you believe and are justified, and it is with your mouth that you profess your faith and are saved.',
      paragraphs: [
        'A gift does no good unless it is accepted. Paul explains that salvation requires a personal response involving both the heart and the mind. It means internally believing that Jesus conquered death through the resurrection, and externally surrendering control of your life by declaring Him as the leader ("Lord") of your life.',
      ],
      coreTruth: 'The Personal Action',
      takeaway: 'Believe in your heart and confess with your mouth.',
      commentaryHref: '/romans/10/#romans-10-9',
      icon: 'message-circle',
      tone: 'sage',
    },
    {
      id: 'open-guarantee',
      number: 7,
      title: 'The Open Guarantee',
      reference: 'Romans 10:13',
      quote: 'For, "Everyone who calls on the name of the Lord will be saved."',
      paragraphs: [
        'To eliminate any doubt about who is allowed to receive this gift, the text reinforces the promise made at the very beginning of the road. There are no hidden qualifications, no background checks, and no exclusions. Anyone who sincerely asks God for this rescue will receive it.',
      ],
      coreTruth: 'The Universal Promise',
      takeaway: 'Everyone who calls on Him will be saved.',
      commentaryHref: '/romans/10/#romans-10-13',
      icon: 'door-open',
      tone: 'copper',
    },
    {
      id: 'complete-spiritual-security',
      number: 8,
      title: 'Complete Spiritual Security',
      reference: 'Romans 8:1',
      quote: 'Therefore, there is now no condemnation for those who are in Christ Jesus.',
      paragraphs: [
        'The Romans Road concludes at a destination of profound peace. For the person who has trusted in Jesus, the fear of judgment is entirely gone. You are no longer defined by your past mistakes or your spiritual failures. In God\'s eyes, you are fully forgiven, permanently accepted, and completely free from condemnation.',
      ],
      coreTruth: 'The Final Status',
      takeaway: 'There is now no condemnation for believers.',
      commentaryHref: '/romans/8/#romans-8-1',
      icon: 'shield-check',
      tone: 'sage',
    },
  ],
};

const iconPaths = {
  'book-open': '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>',
  'circle-alert': '<circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line>',
  scale: '<path d="M12 3v18"></path><path d="m19 8 3 8a5 5 0 0 1-6 0zV7"></path><path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"></path><path d="m5 8 3 8a5 5 0 0 1-6 0zV7"></path><path d="M7 21h10"></path>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"></path>',
  'message-circle': '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>',
  'door-open': '<path d="M13 4h3a2 2 0 0 1 2 2v14"></path><path d="M2 20h3"></path><path d="M13 20h9"></path><path d="M10 12v.01"></path><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l5.243-1.31A1 1 0 0 1 13 3.28z"></path>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"></path><path d="m9 12 2 2 4-4"></path>',
  menu: '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>',
};

function icon(name, className = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">${iconPaths[name] || iconPaths['book-open']}</svg>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function head(title, description) {
  return `  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)} | Romans Study</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="preload" as="image" href="/assets/romans-hero-engraving-filled.webp?v=mbe-20260715-1" type="image/webp" fetchpriority="high">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="${FONT_HREF}" rel="stylesheet">
    <link rel="stylesheet" href="/_next/static/css/f76b0aea01fab224.css">
    <link rel="stylesheet" href="/global-shell.css?v=compact-strip-1">
    <link rel="stylesheet" href="/romans-illustrated.css?v=${VERSION}" data-romans-illustrated="css">
    <link rel="stylesheet" href="/gospel/gospel.css?v=${VERSION}">
  </head>`;
}

function siteHeader() {
  const links = [
    ['/', 'Home'],
    ['/introduction/', 'Introduction'],
    ['/romans/1/', 'Commentary'],
    ['/gospel/', 'Gospel'],
    ['/articles/', 'Articles'],
  ];
  const navLinks = links.map(([href, label]) => `<a class="reader-nav-link${label === 'Gospel' ? ' reader-nav-link-active' : ''}" href="${href}"${label === 'Gospel' ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const menuLinks = links.map(([href, label]) => `<a class="reader-menu-link${label === 'Gospel' ? ' reader-menu-link-active' : ''}" href="${href}"${label === 'Gospel' ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `  <header class="reader-header no-print">
    <a class="reader-brand" aria-label="Romans Study Home" href="/">
      <span class="reader-logo" aria-hidden="true">${icon('book-open', 'h-5 w-5')}</span>
      <span class="reader-brand-text"><span class="reader-brand-strong">Romans Study</span></span>
    </a>
    <nav class="reader-nav" aria-label="Primary navigation">${navLinks}</nav>
    <div class="reader-header-actions">
      <button class="reader-menu-button" type="button" aria-label="Open menu" aria-expanded="false" data-romans-static-menu-button>${icon('menu', 'h-5 w-5')}</button>
    </div>
    <nav class="reader-menu" aria-label="Mobile navigation" data-romans-static-menu hidden>${menuLinks}</nav>
  </header>`;
}

function stageMarkup(step) {
  const id = `romans-road-${step.id}`;
  const contrasts = step.contrasts
    ? `<dl class="gospel-road-contrast">${step.contrasts.map(([term, description]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(description)}</dd></div>`).join('')}</dl>`
    : '';
  return `      <article class="gospel-timeline-stage gospel-road-stage" id="${id}" data-gospel-stage data-tone="${step.tone}">
        <div class="gospel-stage-scripture">
          <p>${escapeHtml(step.reference)}</p>
          <h2>${escapeHtml(step.title)}</h2>
          <blockquote><span>&ldquo;${escapeHtml(step.quote)}&rdquo;</span></blockquote>
        </div>
        <div class="gospel-stage-rail" aria-hidden="true">
          <span>${icon(step.icon, 'h-6 w-6')}</span>
        </div>
        <div class="gospel-stage-explanation">
          <p class="gospel-stage-phase">Step ${String(step.number).padStart(2, '0')} &middot; ${escapeHtml(step.coreTruth)}</p>
          <h3>${escapeHtml(step.title)}</h3>
          <div class="gospel-road-copy">
            ${step.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}${contrasts ? `\n            ${contrasts}` : ''}
          </div>
          <a class="gospel-stage-commentary-link" href="${step.commentaryHref}">Open in Commentary <span aria-hidden="true">&rarr;</span></a>
        </div>
      </article>`;
}

function summaryRow(step) {
  return `          <tr>
            <th scope="row"><a href="#romans-road-${step.id}">${escapeHtml(step.reference)}</a></th>
            <td>${escapeHtml(step.coreTruth)}</td>
            <td>${escapeHtml(step.takeaway)}</td>
          </tr>`;
}

function renderRoad() {
  const progress = romansRoad.steps.map((step) => `<a href="#romans-road-${step.id}" data-gospel-progress-link><span>${String(step.number).padStart(2, '0')}</span><strong>${escapeHtml(step.title)}</strong></a>`).join('');
  return `<!doctype html>
<html lang="en" class="dark" style="color-scheme: dark">
${head(`${romansRoad.title}: ${romansRoad.subtitle}`, 'Walk through eight key verses in Romans and understand the gospel message from humanity\'s need to life in Christ.')}
<body data-romans-static-page="gospel-road">
${siteHeader()}
  <main class="gospel-page gospel-road-page">
    <section class="gospel-road-hero" aria-labelledby="gospel-road-title">
      <div class="gospel-road-hero-copy">
        <p>The Epistle to the Romans</p>
        <h1 id="gospel-road-title"><span>${escapeHtml(romansRoad.title)}</span><small>${escapeHtml(romansRoad.subtitle)}</small></h1>
      </div>
    </section>
    <section class="gospel-road-introduction" aria-labelledby="gospel-road-intro-title">
      <p class="gospel-road-kicker">Romans Road to Salvation</p>
      <h2 id="gospel-road-intro-title">From humanity's problem to God's solution.</h2>
      <div>${romansRoad.introduction.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>
    </section>
    <nav class="gospel-progress-strip" aria-label="Romans Road steps" data-gospel-progress>
      <div>${progress}</div>
    </nav>
    <section class="gospel-timeline" aria-label="Walking the Romans Road">
${romansRoad.steps.map(stageMarkup).join('\n')}
    </section>
    <section class="gospel-road-summary" aria-labelledby="gospel-road-summary-title">
      <div class="gospel-road-summary-heading">
        <p>Summary of the Journey</p>
        <h2 id="gospel-road-summary-title">Eight verses. One gospel message.</h2>
      </div>
      <div class="gospel-road-table-wrap">
        <table>
          <thead><tr><th>Verse</th><th>Core Truth</th><th>The Takeaway</th></tr></thead>
          <tbody>
${romansRoad.steps.map(summaryRow).join('\n')}
          </tbody>
        </table>
      </div>
    </section>
  </main>
  <script src="/gospel/gospel.js?v=${VERSION}"></script>
  <script src="/mbe-unified.js?v=${VERSION}"></script>
</body>
</html>
`;
}

function renderLegacyRedirect() {
  return `<!doctype html>
<html lang="en" class="dark" style="color-scheme: dark">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=/gospel/">
    <link rel="canonical" href="/gospel/">
    <title>Walking the Romans Road | Romans Study</title>
  </head>
  <body>
    <p><a href="/gospel/">Continue to Walking the Romans Road</a></p>
  </body>
</html>
`;
}

async function main() {
  const gospelRoot = path.join(ROOT, 'gospel');
  await fs.mkdir(gospelRoot, { recursive: true });
  await fs.writeFile(path.join(ROOT, 'data', 'gospel-studies.json'), `${JSON.stringify(romansRoad, null, 2)}\n`);
  await fs.writeFile(path.join(gospelRoot, 'index.html'), renderRoad());
  for (const slug of LEGACY_STUDY_SLUGS) {
    const legacyRoot = path.join(gospelRoot, slug);
    await fs.mkdir(legacyRoot, { recursive: true });
    await fs.writeFile(path.join(legacyRoot, 'index.html'), renderLegacyRedirect());
  }
  process.stdout.write(`Built the Romans Road with ${romansRoad.steps.length} steps and ${LEGACY_STUDY_SLUGS.length} legacy redirects.\n`);
}

await main();
