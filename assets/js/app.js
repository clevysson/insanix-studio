(() => {
  'use strict';

  const data = window.INSANIX_DATA;
  if (!data) return;

  const state = {
    view: 'loja',
    category: 'all',
    platform: 'all',
    sort: 'featured',
    query: '',
  };

  const els = {
    navButtons: Array.from(document.querySelectorAll('[data-nav]')),
    views: {
      loja: document.getElementById('view-loja'),
      apoiar: document.getElementById('view-apoiar'),
      ajuda: document.getElementById('view-ajuda'),
    },
    searchInput: document.getElementById('project-search'),
    themeToggle: document.getElementById('theme-toggle'),
    spotlightCover: document.getElementById('spotlight-cover'),
    spotlightBadge: document.getElementById('spotlight-badge'),
    spotlightVersion: document.getElementById('spotlight-version'),
    spotlightText: document.getElementById('spotlight-text'),
    spotlightOpenBtn: document.getElementById('spotlight-open-btn'),
    heroGithubLink: document.getElementById('hero-github-link'),
    catButtons: Array.from(document.querySelectorAll('.cat-btn')),
    platformButtons: Array.from(document.querySelectorAll('.chip-btn')),
    sortSelect: document.getElementById('sort-select'),
    clearFiltersBtn: document.getElementById('clear-filters-btn'),
    resultsStatus: document.getElementById('results-status'),
    projectsGrid: document.getElementById('projects-grid'),
    countAll: document.getElementById('count-all'),
    countApp: document.getElementById('count-app'),
    countJogo: document.getElementById('count-jogo'),
    countMod: document.getElementById('count-mod'),
    studioDescription: document.getElementById('studio-description'),
    foundersList: document.getElementById('founders-list'),
    supportersList: document.getElementById('supporters-list'),
    pagePixQr: document.getElementById('page-pix-qr'),
    pagePixReceiver: document.getElementById('page-pix-receiver'),
    pagePixKey: document.getElementById('page-pix-key'),
    pagePixNote: document.getElementById('page-pix-note'),
    pageLivePixLink: document.getElementById('page-livepix-link'),
    pageKofiLink: document.getElementById('page-kofi-link'),
    pageSponsorsLink: document.getElementById('page-sponsors-link'),
    donatePixQr: document.getElementById('donate-pix-qr'),
    donatePixReceiver: document.getElementById('donate-pix-receiver'),
    pixKeyValue: document.getElementById('pix-key-value'),
    donatePixNote: document.getElementById('donate-pix-note'),
    donateLivePixLink: document.getElementById('donate-livepix-link'),
    donateKofiLink: document.getElementById('donate-kofi-link'),
    donateSponsorsLink: document.getElementById('donate-sponsors-link'),
    footerGithubLink: document.getElementById('footer-github-link'),
    footerDiscordLink: document.getElementById('footer-discord-link'),
    footerYoutubeLink: document.getElementById('footer-youtube-link'),
    footerEmailLink: document.getElementById('footer-email-link'),
    projectDialog: document.getElementById('project-dialog'),
    donateDialog: document.getElementById('donate-dialog'),
    projectDialogLogo: document.getElementById('project-dialog-logo'),
    projectDialogBadge: document.getElementById('project-dialog-badge'),
    projectDialogTitle: document.getElementById('project-dialog-title'),
    projectDialogCover: document.getElementById('project-dialog-cover'),
    projectDialogGallery: document.getElementById('project-dialog-gallery'),
    projectDialogDescription: document.getElementById('project-dialog-description'),
    projectDialogMeta: document.getElementById('project-dialog-meta'),
    projectDialogDownload: document.getElementById('project-dialog-download'),
    projectDialogRepo: document.getElementById('project-dialog-repo'),
    projectDialogVt: document.getElementById('project-dialog-vt'),
    projectDialogReqs: document.getElementById('project-dialog-reqs'),
    projectDialogSteps: document.getElementById('project-dialog-steps'),
    projectCommandWrap: document.getElementById('project-command-wrap'),
    projectCommandCode: document.getElementById('project-command-code'),
    projectHashSection: document.getElementById('project-hash-section'),
    projectDialogSha: document.getElementById('project-dialog-sha'),
    projectDialogChangelog: document.getElementById('project-dialog-changelog'),
    productTabList: document.querySelector('#project-dialog .tablist'),
    productTabs: Array.from(document.querySelectorAll('#project-dialog .tablist button')),
    productPanels: Array.from(document.querySelectorAll('#project-dialog [role="tabpanel"]')),
  };

  // --- Feature detection: top-layer dialog exit fallback ---
  let supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
      return false;
    }
    const probe = document.createElement('div');
    probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = 'none';
    supportsDisplayTransition = getComputedStyle(probe).display === 'block';
    probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay();
  }

  async function closeTopLayer(dialog) {
    if (!dialog?.open) return;
    if (!supportsTopLayerExit()) {
      dialog.setAttribute('data-closing', '');
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((resolve) => setTimeout(resolve, 400)),
        ]);
      }
      if (!dialog.hasAttribute('data-closing')) return;
      dialog.removeAttribute('data-closing');
    }
    dialog.close();
  }

  function setupDialogs() {
    const dialogs = [els.projectDialog, els.donateDialog].filter(Boolean);

    if (!('commandForElement' in HTMLButtonElement.prototype)) {
      document.addEventListener('click', (event) => {
        const trigger = event.target.closest('button[command="show-modal"][commandfor]');
        if (!trigger) return;
        const target = document.getElementById(trigger.getAttribute('commandfor'));
        if (target && typeof target.showModal === 'function') {
          target.showModal();
        }
      });
    }

    for (const dialog of dialogs) {
      dialog.addEventListener('cancel', (event) => {
        if (!supportsTopLayerExit()) {
          event.preventDefault();
          closeTopLayer(dialog);
        }
      });

      dialog.addEventListener('close', () => {
        dialog.removeAttribute('data-closing');
        dialog.returnValue = '';
      });

      if (!('closedBy' in HTMLDialogElement.prototype)) {
        const outside = (e) => {
          const r = dialog.getBoundingClientRect();
          return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
        };
        let pressedOutside = false;
        dialog.addEventListener('pointerdown', (e) => {
          pressedOutside = outside(e);
        });
        dialog.addEventListener('pointerup', (e) => {
          if (pressedOutside && outside(e)) {
            closeTopLayer(dialog);
          }
        });
      }
    }

    document.addEventListener('click', (event) => {
      const closeBtn = event.target.closest('[data-dialog-close]');
      if (!closeBtn) return;
      const dialog = closeBtn.closest('dialog');
      if (dialog) closeTopLayer(dialog);
    });
  }

  // --- Copy button ---
  const copyTimers = new WeakMap();
  let lastCopyMessage = '';

  function legacyCopy(text) {
    const field = Object.assign(document.createElement('textarea'), { value: text });
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
    document.body.append(field);
    field.select();
    try {
      return document.execCommand('copy');
    } finally {
      field.remove();
    }
  }

  function reportCopy(button, ok) {
    const tip = button.nextElementSibling;
    if (!tip) return;
    clearTimeout(copyTimers.get(button));
    button.removeAttribute('data-copied');
    button.removeAttribute('data-failed');

    let message = ok ? 'Copiado!' : 'Falha ao copiar';
    if (message === lastCopyMessage) message += '\u00A0';
    lastCopyMessage = message;

    tip.textContent = '';
    void button.offsetWidth;
    button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
    requestAnimationFrame(() => {
      tip.textContent = message;
    });

    copyTimers.set(
      button,
      setTimeout(() => {
        button.removeAttribute('data-copied');
        button.removeAttribute('data-failed');
        tip.textContent = '';
      }, 2000),
    );
  }

  async function runCopy(button, target) {
    if (!button || !target) return;
    const text = target.matches('input, textarea') ? target.value : target.innerText.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      reportCopy(button, true);
    } catch {
      try {
        if (!legacyCopy(text)) throw new Error('Copy failed');
        reportCopy(button, true);
      } catch {
        reportCopy(button, false);
      }
    }
  }

  function setupCopyButtons() {
    document.addEventListener(
      'command',
      (event) => {
        if (event.command?.startsWith('--copy')) {
          runCopy(event.source, event.target);
        }
      },
      true,
    );

    if (!('CommandEvent' in window)) {
      document.addEventListener('click', (event) => {
        const button = event.target.closest('button[command^="--copy"]');
        if (!button) return;
        const target = document.getElementById(button.getAttribute('commandfor'));
        if (target) runCopy(button, target);
      });
    }
  }

  // --- Theme toggle ---
  function setupThemeToggle() {
    const storageKey = 'insanix-theme';
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme) => {
      if (theme === 'dark' || theme === 'light') {
        document.documentElement.setAttribute('data-theme', theme);
        els.themeToggle?.setAttribute('aria-pressed', String(theme === 'dark'));
      } else {
        document.documentElement.removeAttribute('data-theme');
        els.themeToggle?.setAttribute('aria-pressed', String(media.matches));
      }
    };

    try {
      applyTheme(localStorage.getItem(storageKey));
    } catch {
      applyTheme(null);
    }

    media.addEventListener('change', () => {
      if (!document.documentElement.hasAttribute('data-theme')) {
        els.themeToggle?.setAttribute('aria-pressed', String(media.matches));
      }
    });

    els.themeToggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const isDark = current ? current === 'dark' : media.matches;
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        // Ignora
      }
    });
  }

  // --- Product Modal Tabs (focusgroup + hidden="until-found" + beforematch) ---
  const hasNativeFocusGroup = Object.hasOwn(HTMLElement.prototype, 'focusGroup');

  function selectProductTab(tab) {
    const targetId = tab.id;
    for (const t of els.productTabs) {
      const selected = t === tab;
      t.ariaSelected = String(selected);
      t.toggleAttribute('focusgroupstart', selected);
      if (!hasNativeFocusGroup) {
        t.tabIndex = selected ? 0 : -1;
      }
    }
    for (const panel of els.productPanels) {
      const active = panel.getAttribute('aria-labelledby') === targetId;
      if (active) {
        panel.removeAttribute('hidden');
        panel.setAttribute('tabindex', '0');
      } else {
        panel.setAttribute('hidden', 'until-found');
        panel.removeAttribute('tabindex');
      }
    }
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function setupProductTabs() {
    if (!hasNativeFocusGroup && els.productTabList) {
      els.productTabList.setAttribute('role', 'tablist');
      for (const tab of els.productTabs) {
        tab.setAttribute('role', 'tab');
      }
    }

    for (const tab of els.productTabs) {
      tab.addEventListener('click', () => selectProductTab(tab));
    }

    for (const panel of els.productPanels) {
      panel.addEventListener('beforematch', () => {
        const tab = document.getElementById(panel.getAttribute('aria-labelledby'));
        if (tab) selectProductTab(tab);
      });
    }

    if (!hasNativeFocusGroup) {
      els.productTabList?.addEventListener('keydown', (event) => {
        const idx = els.productTabs.indexOf(document.activeElement);
        if (idx === -1) return;
        let nextIdx = -1;
        if (event.key === 'ArrowRight') nextIdx = (idx + 1) % els.productTabs.length;
        if (event.key === 'ArrowLeft') nextIdx = (idx - 1 + els.productTabs.length) % els.productTabs.length;
        if (event.key === 'Home') nextIdx = 0;
        if (event.key === 'End') nextIdx = els.productTabs.length - 1;
        if (nextIdx !== -1) {
          event.preventDefault();
          const targetTab = els.productTabs[nextIdx];
          targetTab.focus();
          selectProductTab(targetTab);
        }
      });
    }
  }

  // --- Navigation between Marketplace views (Loja / Apoiar / Ajuda) ---
  const viewTitles = {
    loja: 'INSANIX STUDIO — Marketplace de Apps, Jogos e Mods',
    apoiar: 'Apoiar o Estúdio | INSANIX STUDIO',
    ajuda: 'Ajuda & Segurança | INSANIX STUDIO',
  };

  function switchView(viewName, syncUrl = true) {
    if (!els.views[viewName]) viewName = 'loja';
    state.view = viewName;

    for (const [key, section] of Object.entries(els.views)) {
      if (!section) continue;
      if (key === viewName) {
        section.removeAttribute('hidden');
      } else {
        section.setAttribute('hidden', '');
      }
    }

    for (const btn of els.navButtons) {
      if (btn.classList.contains('nav-tab')) {
        if (btn.dataset.nav === viewName) {
          btn.setAttribute('aria-current', 'page');
        } else {
          btn.removeAttribute('aria-current');
        }
      }
    }

    document.title = viewTitles[viewName] || viewTitles.loja;
    if (syncUrl) syncUrlParams();
  }

  function setupNavigation() {
    for (const btn of els.navButtons) {
      btn.addEventListener('click', (event) => {
        if (btn.tagName === 'A') event.preventDefault();
        switchView(btn.dataset.nav || 'loja');
        window.scrollTo({ top: 0, behavior: 'auto' });
      });
    }
  }

  // --- Hydrate Studio & Donations ---
  function hydrateStudioInfo() {
    const { studio, donations, projects } = data;

    if (els.studioDescription && studio.description) {
      els.studioDescription.textContent = studio.description;
    }
    if (els.heroGithubLink) els.heroGithubLink.href = studio.githubOrgUrl;
    if (els.footerGithubLink) els.footerGithubLink.href = studio.githubOrgUrl;
    if (els.footerDiscordLink) els.footerDiscordLink.href = studio.discordUrl;
    if (els.footerYoutubeLink) els.footerYoutubeLink.href = studio.youtubeUrl;
    if (els.footerEmailLink) els.footerEmailLink.href = `mailto:${studio.contactEmail}`;

    if (els.foundersList) {
      els.foundersList.replaceChildren(
        ...studio.founders.map((f) => {
          const li = document.createElement('li');
          const name = document.createElement('span');
          name.textContent = f.name;
          const role = document.createElement('span');
          role.className = 'founder-role';
          role.textContent = f.role;
          li.append(name, role);
          return li;
        }),
      );
    }

    if (els.supportersList) {
      els.supportersList.replaceChildren(
        ...donations.supporters.map((s) => {
          const li = document.createElement('li');
          const name = document.createElement('span');
          name.textContent = s.name;
          const badge = document.createElement('span');
          badge.className = 'badge badge-accent';
          badge.textContent = s.badge;
          li.append(name, badge);
          return li;
        }),
      );
    }

    // Populate both Pix modal and Apoiar page
    const pixReceiverText = `Beneficiário: ${donations.pixReceiverName}`;
    for (const img of [els.donatePixQr, els.pagePixQr]) {
      if (img) img.src = donations.pixQrImage;
    }
    for (const el of [els.donatePixReceiver, els.pagePixReceiver]) {
      if (el) el.textContent = pixReceiverText;
    }
    for (const el of [els.pixKeyValue, els.pagePixKey]) {
      if (el) el.textContent = donations.pixKey;
    }
    for (const el of [els.donatePixNote, els.pagePixNote]) {
      if (el) el.textContent = donations.pixNote;
    }
    for (const a of [els.donateLivePixLink, els.pageLivePixLink]) {
      if (a) a.href = donations.livePixUrl;
    }
    for (const a of [els.donateKofiLink, els.pageKofiLink]) {
      if (a) a.href = donations.kofiUrl;
    }
    for (const a of [els.donateSponsorsLink, els.pageSponsorsLink]) {
      if (a) a.href = donations.githubSponsorsUrl;
    }

    // Category counts
    const byCategory = Object.groupBy(projects, (p) => p.category);
    if (els.countAll) els.countAll.textContent = String(projects.length);
    if (els.countApp) els.countApp.textContent = String((byCategory.app ?? []).length);
    if (els.countJogo) els.countJogo.textContent = String((byCategory.jogo ?? []).length);
    if (els.countMod) els.countMod.textContent = String((byCategory.mod ?? []).length);

    // Spotlight Banner
    const spotlight = projects.find((p) => p.featured) || projects[0];
    if (spotlight) {
      if (els.spotlightCover) {
        els.spotlightCover.src = spotlight.cover;
        els.spotlightCover.alt = spotlight.coverAlt || spotlight.title;
      }
      if (els.spotlightBadge) {
        els.spotlightBadge.className = getCategoryBadgeClass(spotlight.category);
        els.spotlightBadge.textContent = spotlight.categoryLabel;
      }
      if (els.spotlightVersion) els.spotlightVersion.textContent = spotlight.version;
      if (els.spotlightText) {
        els.spotlightText.textContent = `${spotlight.title} — ${spotlight.summary}`;
      }
      els.spotlightOpenBtn?.addEventListener('click', () => openProjectModal(spotlight));
    }
  }

  function getCategoryBadgeClass(category) {
    if (category === 'jogo') return 'badge badge-jogo';
    if (category === 'mod') return 'badge badge-mod';
    return 'badge';
  }

  // --- Optional GitHub Releases API Enrichment ---
  async function fetchReleaseMetadata(project) {
    if (!project.githubRepo || !project.githubRepo.includes('/')) return null;
    const cacheKey = `ix-gh-${project.githubRepo}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // Ignora
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${project.githubRepo}/releases/latest`,
        {
          headers: { Accept: 'application/vnd.github+json' },
          signal: AbortSignal.timeout(4000),
        },
      );
      if (!res.ok) return null;
      const release = await res.json();
      const firstAsset = Array.isArray(release.assets) ? release.assets[0] : null;
      const info = {
        version: release.tag_name || project.version,
        downloadUrl: firstAsset?.browser_download_url || release.html_url || project.downloadUrl,
        size: firstAsset ? `${(firstAsset.size / (1024 * 1024)).toFixed(1)} MB` : project.size,
      };
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(info));
      } catch {
        // Ignora
      }
      return info;
    } catch {
      return null;
    }
  }

  // --- Product Modal ---
  async function openProjectModal(project) {
    if (els.projectDialogLogo) {
      if (project.logo) {
        els.projectDialogLogo.src = project.logo;
        els.projectDialogLogo.alt = `Logo de ${project.title}`;
        els.projectDialogLogo.hidden = false;
      } else {
        els.projectDialogLogo.hidden = true;
      }
    }

    els.projectDialogBadge.className = getCategoryBadgeClass(project.category);
    els.projectDialogBadge.textContent = project.categoryLabel;
    els.projectDialogTitle.textContent = project.title;
    els.projectDialogCover.src = project.cover;
    els.projectDialogCover.alt = project.coverAlt || project.title;

    if (els.projectDialogGallery) {
      const mediaItems = Array.isArray(project.screenshots) && project.screenshots.length > 0
        ? project.screenshots.slice(0, 3)
        : [];
      if (mediaItems.length > 0) {
        els.projectDialogCover.src = mediaItems[0];
        const thumbs = mediaItems.map((src, index) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'gallery-thumb';
          btn.setAttribute('aria-label', `Ver print ${index + 1} de ${project.title}`);
          btn.setAttribute('aria-pressed', String(index === 0));
          const img = document.createElement('img');
          img.src = src;
          img.alt = '';
          img.width = 160;
          img.height = 90;
          btn.append(img);
          btn.addEventListener('click', () => {
            els.projectDialogCover.src = src;
            els.projectDialogCover.alt = `${project.title} — Print ${index + 1}`;
            for (const other of els.projectDialogGallery.querySelectorAll('.gallery-thumb')) {
              other.setAttribute('aria-pressed', String(other === btn));
            }
          });
          return btn;
        });
        els.projectDialogGallery.replaceChildren(...thumbs);
        els.projectDialogGallery.hidden = false;
      } else {
        els.projectDialogGallery.replaceChildren();
        els.projectDialogGallery.hidden = true;
      }
    }

    els.projectDialogDescription.textContent = project.description;

    const renderMeta = (version, size) => {
      const metaEntries = [
        ['Versão', version],
        ['Tamanho', size],
        ['Plataformas', project.platforms.join(', ')],
        ['Licença', project.license],
      ];
      els.projectDialogMeta.replaceChildren(
        ...metaEntries.map(([label, value]) => {
          const wrap = document.createElement('div');
          const dt = document.createElement('dt');
          dt.textContent = label;
          const dd = document.createElement('dd');
          dd.textContent = value;
          wrap.append(dt, dd);
          return wrap;
        }),
      );
    };

    renderMeta(project.version, project.size);

    els.projectDialogDownload.href = project.downloadUrl;
    els.projectDialogRepo.href = project.repoUrl || data.studio.githubOrgUrl;

    if (project.virustotalUrl) {
      els.projectDialogVt.href = project.virustotalUrl;
      els.projectDialogVt.hidden = false;
    } else {
      els.projectDialogVt.hidden = true;
    }

    els.projectDialogSteps.replaceChildren(
      ...project.tutorialSteps.map((step) => {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = step.title;
        const p = document.createElement('p');
        p.textContent = step.detail;
        li.append(strong, p);
        return li;
      }),
    );

    if (project.tutorialCommand) {
      els.projectCommandCode.textContent = project.tutorialCommand;
      els.projectCommandWrap.hidden = false;
    } else {
      els.projectCommandWrap.hidden = true;
    }

    els.projectDialogReqs.replaceChildren(
      ...project.requirements.map((req) => {
        const li = document.createElement('li');
        li.textContent = req;
        return li;
      }),
    );

    if (project.sha256) {
      els.projectDialogSha.textContent = project.sha256;
      els.projectHashSection.hidden = false;
    } else {
      els.projectHashSection.hidden = true;
    }

    els.projectDialogChangelog.replaceChildren(
      ...project.changelog.map((entry) => {
        const li = document.createElement('li');
        li.textContent = entry;
        return li;
      }),
    );

    if (els.productTabs[0]) selectProductTab(els.productTabs[0]);
    els.projectDialog.showModal();

    const live = await fetchReleaseMetadata(project);
    if (live && els.projectDialog.open) {
      renderMeta(live.version, live.size);
      els.projectDialogDownload.href = live.downloadUrl;
    }
  }

  // --- Catalog Filtering & Sorting ---
  function syncUrlParams() {
    if (window.location.protocol === 'file:') return;
    const url = new URL(window.location.href);
    if (state.view !== 'loja') url.searchParams.set('aba', state.view);
    else url.searchParams.delete('aba');

    if (state.category !== 'all') url.searchParams.set('cat', state.category);
    else url.searchParams.delete('cat');

    if (state.platform !== 'all') url.searchParams.set('plat', state.platform);
    else url.searchParams.delete('plat');

    if (state.query) url.searchParams.set('q', state.query);
    else url.searchParams.delete('q');

    window.history.replaceState({}, '', url);
  }

  function hasActiveFilters() {
    return state.category !== 'all' || state.platform !== 'all' || state.query.trim() !== '';
  }

  function renderCatalog() {
    const queryLower = state.query.trim().toLowerCase();

    const filtered = data.projects.filter((project) => {
      if (state.category !== 'all' && project.category !== state.category) {
        return false;
      }
      if (state.platform !== 'all') {
        const platText = project.platforms.join(' ').toLowerCase();
        if (!platText.includes(state.platform)) return false;
      }
      if (!queryLower) return true;
      const haystack = [
        project.title,
        project.summary,
        project.categoryLabel,
        ...project.platforms,
        ...project.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(queryLower);
    });

    const sorted = filtered.toSorted((a, b) => {
      if (state.sort === 'az') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      if (state.sort === 'recent') {
        return (b.releaseDate || '').localeCompare(a.releaseDate || '');
      }
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

    els.resultsStatus.textContent =
      sorted.length === 1
        ? 'Exibindo 1 item na loja'
        : `Exibindo ${sorted.length} itens na loja`;

    if (els.clearFiltersBtn) {
      els.clearFiltersBtn.hidden = !hasActiveFilters();
    }

    if (sorted.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      const title = document.createElement('h2');
      title.textContent = 'Nenhum item encontrado com esses filtros';
      const desc = document.createElement('p');
      desc.textContent = 'Limpe a busca ou escolha outra categoria na barra lateral.';
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'btn btn-primary';
      resetBtn.textContent = 'Mostrar tudo';
      resetBtn.addEventListener('click', resetAllFilters);
      empty.append(title, desc, resetBtn);
      els.projectsGrid.replaceChildren(empty);
      return;
    }

    const cards = sorted.map((project) => {
      const article = document.createElement('article');
      article.className = 'store-card';

      const banner = document.createElement('div');
      banner.className = 'card-banner';
      const img = document.createElement('img');
      img.src = project.cover;
      img.alt = project.coverAlt || project.title;
      img.width = 400;
      img.height = 225;
      img.loading = 'lazy';

      const overlay = document.createElement('div');
      overlay.className = 'card-badges-overlay';
      const badge = document.createElement('span');
      badge.className = getCategoryBadgeClass(project.category);
      badge.textContent = project.categoryLabel;
      const version = document.createElement('span');
      version.className = 'version-pill';
      version.textContent = project.version;
      overlay.append(badge, version);
      banner.append(img, overlay);

      const content = document.createElement('div');
      content.className = 'card-content';

      const titleRow = document.createElement('div');
      titleRow.className = 'card-title-row';
      if (project.logo) {
        const logoImg = document.createElement('img');
        logoImg.className = 'card-app-logo';
        logoImg.src = project.logo;
        logoImg.alt = '';
        logoImg.width = 36;
        logoImg.height = 36;
        logoImg.loading = 'lazy';
        titleRow.append(logoImg);
      }

      const title = document.createElement('h2');
      title.className = 'card-title';
      title.textContent = project.title;
      titleRow.append(title);

      const summary = document.createElement('p');
      summary.className = 'card-summary';
      summary.textContent = project.summary;

      const specs = document.createElement('div');
      specs.className = 'card-specs';
      const plat = document.createElement('span');
      plat.textContent = project.platforms[0] || 'PC';
      const size = document.createElement('span');
      size.textContent = project.size;
      const lic = document.createElement('span');
      lic.textContent = 'Gratuito';
      specs.append(plat, size, lic);

      const actions = document.createElement('div');
      actions.className = 'card-actions';

      const downloadBtn = document.createElement('a');
      downloadBtn.href = project.downloadUrl;
      downloadBtn.target = '_blank';
      downloadBtn.rel = 'noopener noreferrer';
      downloadBtn.className = 'btn btn-primary';
      downloadBtn.textContent = 'Baixar';
      downloadBtn.setAttribute('aria-label', `Baixar — ${project.title}`);

      const infoBtn = document.createElement('button');
      infoBtn.type = 'button';
      infoBtn.className = 'btn btn-secondary';
      infoBtn.textContent = 'Guia & Info';
      infoBtn.setAttribute('aria-label', `Guia & Info — ${project.title}`);
      infoBtn.addEventListener('click', () => openProjectModal(project));

      actions.append(downloadBtn, infoBtn);
      content.append(titleRow, summary, specs, actions);
      article.append(banner, content);
      return article;
    });

    els.projectsGrid.replaceChildren(...cards);
  }

  function resetAllFilters() {
    state.category = 'all';
    state.platform = 'all';
    state.query = '';
    if (els.searchInput) els.searchInput.value = '';
    for (const btn of els.catButtons) {
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === 'all'));
    }
    for (const btn of els.platformButtons) {
      btn.setAttribute('aria-pressed', String(btn.dataset.platform === 'all'));
    }
    syncUrlParams();
    renderCatalog();
  }

  function setupCatalogControls() {
    const params = new URLSearchParams(window.location.search);
    const initialView = params.get('aba');
    const initialCat = params.get('cat');
    const initialPlat = params.get('plat');
    const initialQuery = params.get('q');
    const initialProjectId = params.get('projeto');

    if (initialView && els.views[initialView]) {
      switchView(initialView, false);
    }
    if (initialCat && ['all', 'app', 'jogo', 'mod'].includes(initialCat)) {
      state.category = initialCat;
    }
    if (initialPlat && ['all', 'windows', 'linux', 'android'].includes(initialPlat)) {
      state.platform = initialPlat;
    }
    if (initialQuery) {
      state.query = initialQuery;
      if (els.searchInput) els.searchInput.value = initialQuery;
    }

    for (const btn of els.catButtons) {
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === state.category));
      btn.addEventListener('click', () => {
        state.category = btn.dataset.filter;
        for (const other of els.catButtons) {
          other.setAttribute('aria-pressed', String(other === btn));
        }
        syncUrlParams();
        renderCatalog();
      });
    }

    for (const btn of els.platformButtons) {
      btn.setAttribute('aria-pressed', String(btn.dataset.platform === state.platform));
      btn.addEventListener('click', () => {
        state.platform = btn.dataset.platform;
        for (const other of els.platformButtons) {
          other.setAttribute('aria-pressed', String(other === btn));
        }
        syncUrlParams();
        renderCatalog();
      });
    }

    els.sortSelect?.addEventListener('change', (event) => {
      state.sort = event.target.value;
      renderCatalog();
    });

    els.clearFiltersBtn?.addEventListener('click', resetAllFilters);

    els.searchInput?.addEventListener('input', (event) => {
      state.query = event.target.value;
      if (state.view !== 'loja') switchView('loja');
      syncUrlParams();
      renderCatalog();
    });

    renderCatalog();

    if (initialProjectId) {
      const match = data.projects.find((p) => p.id === initialProjectId);
      if (match) openProjectModal(match);
    }
  }

  // --- Init ---
  setupThemeToggle();
  setupDialogs();
  setupCopyButtons();
  setupProductTabs();
  setupNavigation();
  hydrateStudioInfo();
  setupCatalogControls();
})();
