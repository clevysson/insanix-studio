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
    spotlightLogo: document.getElementById('spotlight-logo'),
    spotlightTitle: document.getElementById('spotlight-title'),
    spotlightBadge: document.getElementById('spotlight-badge'),
    spotlightVersion: document.getElementById('spotlight-version'),
    spotlightText: document.getElementById('spotlight-text'),
    spotlightThumbs: document.getElementById('spotlight-thumbs'),
    spotlightTags: document.getElementById('spotlight-tags'),
    spotlightMetaLine: document.getElementById('spotlight-meta-line'),
    spotlightDownloadBtn: document.getElementById('spotlight-download-btn'),
    spotlightOpenBtn: document.getElementById('spotlight-open-btn'),
    spotlightPrev: document.getElementById('spotlight-prev'),
    spotlightNext: document.getElementById('spotlight-next'),
    spotlightSwitcher: document.getElementById('spotlight-switcher'),
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
    donatePixQr: document.getElementById('donate-pix-qr'),
    donatePixReceiver: document.getElementById('donate-pix-receiver'),
    pixKeyValue: document.getElementById('pix-key-value'),
    donatePixNote: document.getElementById('donate-pix-note'),
    donateLivePixLink: document.getElementById('donate-livepix-link'),
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

    // Populate both Quick Donate modal and Apoiar page
    const pixReceiverText = `Recebedor: ${donations.pixReceiverName}`;
    for (const img of [els.donatePixQr, els.pagePixQr]) {
      if (img) img.src = donations.pixQrImage;
    }
    for (const el of [els.donatePixReceiver, els.pagePixReceiver]) {
      if (el) el.textContent = pixReceiverText;
    }
    for (const el of [els.pixKeyValue, els.pagePixKey]) {
      if (el) el.textContent = donations.pixKey || donations.livePixUrl;
    }
    for (const el of [els.donatePixNote, els.pagePixNote]) {
      if (el) el.textContent = donations.pixNote;
    }
    for (const a of [els.donateLivePixLink, els.pageLivePixLink]) {
      if (a && donations.livePixUrl) a.href = donations.livePixUrl;
    }

    // Category counts
    const byCategory = Object.groupBy(projects, (p) => p.category);
    if (els.countAll) els.countAll.textContent = String(projects.length);
    if (els.countApp) els.countApp.textContent = String((byCategory.app ?? []).length);
    if (els.countJogo) els.countJogo.textContent = String((byCategory.jogo ?? []).length);
    if (els.countMod) els.countMod.textContent = String((byCategory.mod ?? []).length);

    // Steam-style Featured Showcase
    const showcaseList = projects.toSorted(
      (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
    );
    let spotlightIndex = 0;

    const renderSpotlight = (index) => {
      if (showcaseList.length === 0) return;
      spotlightIndex = ((index % showcaseList.length) + showcaseList.length) % showcaseList.length;
      const spotlight = showcaseList[spotlightIndex];

      const screenshots =
        Array.isArray(spotlight.screenshots) && spotlight.screenshots.length > 0
          ? spotlight.screenshots.slice(0, 4)
          : [spotlight.cover].filter(Boolean);

      if (els.spotlightCover) {
        els.spotlightCover.src = screenshots[0] || spotlight.cover;
        els.spotlightCover.alt = spotlight.coverAlt || spotlight.title;
      }

      if (els.spotlightLogo) {
        if (spotlight.logo) {
          els.spotlightLogo.src = spotlight.logo;
          els.spotlightLogo.alt = `Logo de ${spotlight.title}`;
          els.spotlightLogo.hidden = false;
        } else {
          els.spotlightLogo.hidden = true;
        }
      }

      if (els.spotlightTitle) {
        els.spotlightTitle.textContent = spotlight.title;
      }
      if (els.spotlightBadge) {
        els.spotlightBadge.className = getCategoryBadgeClass(spotlight.category);
        els.spotlightBadge.textContent = spotlight.categoryLabel;
      }
      if (els.spotlightVersion) {
        els.spotlightVersion.textContent = spotlight.version;
      }
      if (els.spotlightText) {
        els.spotlightText.textContent = spotlight.summary;
      }
      if (els.spotlightMetaLine) {
        const plat = spotlight.platforms?.[0] || 'PC';
        els.spotlightMetaLine.textContent = `${plat} • ${spotlight.size}`;
      }
      if (els.spotlightDownloadBtn) {
        els.spotlightDownloadBtn.href = spotlight.downloadUrl;
        els.spotlightDownloadBtn.setAttribute('aria-label', `Baixar — ${spotlight.title}`);
      }

      if (els.spotlightThumbs) {
        const thumbButtons = screenshots.map((src, thumbIdx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'showcase-thumb-btn';
          btn.setAttribute('aria-label', `Ver captura ${thumbIdx + 1} de ${spotlight.title}`);
          btn.setAttribute('aria-pressed', String(thumbIdx === 0));
          const img = document.createElement('img');
          img.src = src;
          img.alt = '';
          img.width = 160;
          img.height = 90;
          img.loading = 'lazy';
          btn.append(img);

          const activateThumb = () => {
            if (els.spotlightCover) {
              els.spotlightCover.src = src;
              els.spotlightCover.alt = `${spotlight.title} — Captura ${thumbIdx + 1}`;
            }
            for (const other of els.spotlightThumbs.querySelectorAll('.showcase-thumb-btn')) {
              other.setAttribute('aria-pressed', String(other === btn));
            }
          };

          btn.addEventListener('click', activateThumb);
          btn.addEventListener('pointerenter', activateThumb);
          return btn;
        });
        els.spotlightThumbs.replaceChildren(...thumbButtons);
      }

      if (els.spotlightTags) {
        const tagItems = (spotlight.tags || []).slice(0, 4).map((tag) => {
          const li = document.createElement('li');
          li.className = 'showcase-tag';
          li.textContent = tag;
          return li;
        });
        els.spotlightTags.replaceChildren(...tagItems);
      }

      if (els.spotlightSwitcher) {
        for (const tab of els.spotlightSwitcher.querySelectorAll('.switcher-pill')) {
          tab.setAttribute('aria-pressed', String(Number(tab.dataset.index) === spotlightIndex));
        }
      }
    };

    if (els.spotlightSwitcher && showcaseList.length > 1) {
      const pills = showcaseList.map((item, idx) => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'switcher-pill';
        pill.dataset.index = String(idx);
        pill.setAttribute('aria-pressed', String(idx === 0));

        if (item.logo) {
          const img = document.createElement('img');
          img.src = item.logo;
          img.alt = '';
          img.width = 20;
          img.height = 20;
          pill.append(img);
        }

        const label = document.createElement('span');
        label.textContent = item.title;
        pill.append(label);

        pill.addEventListener('click', () => renderSpotlight(idx));
        return pill;
      });
      els.spotlightSwitcher.replaceChildren(...pills);
      els.spotlightSwitcher.hidden = false;
    } else if (els.spotlightSwitcher) {
      els.spotlightSwitcher.hidden = true;
    }

    if (showcaseList.length <= 1) {
      if (els.spotlightPrev) els.spotlightPrev.hidden = true;
      if (els.spotlightNext) els.spotlightNext.hidden = true;
    } else {
      els.spotlightPrev?.addEventListener('click', () => renderSpotlight(spotlightIndex - 1));
      els.spotlightNext?.addEventListener('click', () => renderSpotlight(spotlightIndex + 1));
    }

    els.spotlightOpenBtn?.addEventListener('click', () => {
      const current = showcaseList[spotlightIndex];
      if (current) openProjectModal(current);
    });

    renderSpotlight(0);
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
        ? project.screenshots.slice(0, 4)
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
      article.dataset.category = project.category || 'app';

      const bannerBtn = document.createElement('button');
      bannerBtn.type = 'button';
      bannerBtn.className = 'card-banner';
      bannerBtn.setAttribute('aria-label', `Abrir detalhes e capturas de ${project.title}`);
      bannerBtn.addEventListener('click', () => openProjectModal(project));

      const img = document.createElement('img');
      img.src = project.cover;
      img.alt = '';
      img.width = 400;
      img.height = 225;
      img.loading = 'lazy';
      bannerBtn.append(img);

      const content = document.createElement('div');
      content.className = 'card-content';

      const header = document.createElement('header');
      header.className = 'card-header';
      if (project.logo) {
        const logoImg = document.createElement('img');
        logoImg.className = 'card-app-logo';
        logoImg.src = project.logo;
        logoImg.alt = '';
        logoImg.width = 44;
        logoImg.height = 44;
        logoImg.loading = 'lazy';
        header.append(logoImg);
      }

      const titleCol = document.createElement('div');
      titleCol.className = 'card-title-col';

      const title = document.createElement('h2');
      title.className = 'card-title';
      title.textContent = project.title;

      const badgesRow = document.createElement('div');
      badgesRow.className = 'card-badges-row';
      const badge = document.createElement('span');
      badge.className = getCategoryBadgeClass(project.category);
      badge.textContent = project.categoryLabel;
      const version = document.createElement('span');
      version.className = 'version-pill';
      version.textContent = project.version;
      const freeBadge = document.createElement('span');
      freeBadge.className = 'badge badge-free';
      freeBadge.textContent = 'Gratuito';
      badgesRow.append(badge, version, freeBadge);

      titleCol.append(title, badgesRow);
      header.append(titleCol);

      const summary = document.createElement('p');
      summary.className = 'card-summary';
      summary.textContent = project.summary;

      const tagsList = document.createElement('ul');
      tagsList.className = 'card-tags';
      tagsList.setAttribute('aria-label', `Tags de ${project.title}`);
      for (const tag of (project.tags || []).slice(0, 3)) {
        const li = document.createElement('li');
        li.className = 'card-tag';
        li.textContent = tag;
        tagsList.append(li);
      }

      const footer = document.createElement('footer');
      footer.className = 'card-footer';

      const specs = document.createElement('div');
      specs.className = 'card-specs';
      const plat = document.createElement('span');
      plat.textContent = project.platforms[0] || 'PC';
      const size = document.createElement('span');
      size.textContent = project.size;
      specs.append(plat, size);

      const actions = document.createElement('div');
      actions.className = 'card-actions';

      const downloadBtn = document.createElement('a');
      downloadBtn.href = project.downloadUrl;
      downloadBtn.target = '_blank';
      downloadBtn.rel = 'noopener noreferrer';
      downloadBtn.className = 'btn btn-download';
      downloadBtn.textContent = 'Baixar';
      downloadBtn.setAttribute('aria-label', `Baixar — ${project.title}`);

      const infoBtn = document.createElement('button');
      infoBtn.type = 'button';
      infoBtn.className = 'btn btn-secondary';
      infoBtn.textContent = 'Guia & Info';
      infoBtn.setAttribute('aria-label', `Guia & Info — ${project.title}`);
      infoBtn.addEventListener('click', () => openProjectModal(project));

      actions.append(downloadBtn, infoBtn);
      footer.append(specs, actions);
      content.append(header, summary, tagsList, footer);
      article.append(bannerBtn, content);
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
