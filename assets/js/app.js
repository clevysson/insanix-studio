(() => {
  'use strict';

  const data = window.INSANIX_DATA;
  if (!data) return;

  const state = {
    category: 'all',
    query: '',
  };

  const els = {
    studioDescription: document.getElementById('studio-description'),
    heroGithubLink: document.getElementById('hero-github-link'),
    bannerDiscordLink: document.getElementById('banner-discord-link'),
    footerGithubLink: document.getElementById('footer-github-link'),
    footerDiscordLink: document.getElementById('footer-discord-link'),
    footerYoutubeLink: document.getElementById('footer-youtube-link'),
    footerEmailLink: document.getElementById('footer-email-link'),
    statTotal: document.getElementById('stat-total'),
    foundersList: document.getElementById('founders-list'),
    supportersList: document.getElementById('supporters-list'),
    filterButtons: Array.from(document.querySelectorAll('.filter-btn')),
    searchInput: document.getElementById('project-search'),
    resultsStatus: document.getElementById('results-status'),
    projectsGrid: document.getElementById('projects-grid'),
    themeToggle: document.getElementById('theme-toggle'),
    projectDialog: document.getElementById('project-dialog'),
    donateDialog: document.getElementById('donate-dialog'),
    projectDialogBadge: document.getElementById('project-dialog-badge'),
    projectDialogTitle: document.getElementById('project-dialog-title'),
    projectDialogCover: document.getElementById('project-dialog-cover'),
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
    donatePixQr: document.getElementById('donate-pix-qr'),
    donatePixReceiver: document.getElementById('donate-pix-receiver'),
    pixKeyValue: document.getElementById('pix-key-value'),
    donatePixNote: document.getElementById('donate-pix-note'),
    donateLivePixLink: document.getElementById('donate-livepix-link'),
    donateKofiLink: document.getElementById('donate-kofi-link'),
    donateSponsorsLink: document.getElementById('donate-sponsors-link'),
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

    // Fallback para browsers sem Invoker Commands (command="show-modal")
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

      // Fallback para light-dismiss em browsers sem <dialog closedby="any">
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

  // --- Copy button (Invoker Command + fallback + VoiceOver dedup) ---
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
      const saved = localStorage.getItem(storageKey);
      applyTheme(saved);
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
      const isCurrentlyDark = current ? current === 'dark' : media.matches;
      const next = isCurrentlyDark ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        // Ignora caso storage esteja bloqueado
      }
    });
  }

  // --- Hydrate Studio & Donations ---
  function hydrateStudioInfo() {
    const { studio, donations, projects } = data;
    if (els.studioDescription && studio.description) {
      els.studioDescription.textContent = studio.description;
    }
    if (els.heroGithubLink) els.heroGithubLink.href = studio.githubOrgUrl;
    if (els.footerGithubLink) els.footerGithubLink.href = studio.githubOrgUrl;
    if (els.bannerDiscordLink) els.bannerDiscordLink.href = studio.discordUrl;
    if (els.footerDiscordLink) els.footerDiscordLink.href = studio.discordUrl;
    if (els.footerYoutubeLink) els.footerYoutubeLink.href = studio.youtubeUrl;
    if (els.footerEmailLink) els.footerEmailLink.href = `mailto:${studio.contactEmail}`;
    if (els.statTotal) els.statTotal.textContent = String(projects.length);

    if (els.foundersList) {
      const items = studio.founders.map((f) => {
        const li = document.createElement('li');
        const name = document.createElement('span');
        name.className = 'founder-name';
        name.textContent = f.name;
        const role = document.createElement('span');
        role.className = 'founder-role';
        role.textContent = f.role;
        li.append(name, role);
        return li;
      });
      els.foundersList.replaceChildren(...items);
    }

    if (els.supportersList) {
      const items = donations.supporters.map((s) => {
        const li = document.createElement('li');
        const name = document.createElement('span');
        name.textContent = s.name;
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = s.badge;
        li.append(name, badge);
        return li;
      });
      els.supportersList.replaceChildren(...items);
    }

    if (els.donatePixQr) els.donatePixQr.src = donations.pixQrImage;
    if (els.donatePixReceiver) {
      els.donatePixReceiver.textContent = `Beneficiário: ${donations.pixReceiverName}`;
    }
    if (els.pixKeyValue) els.pixKeyValue.textContent = donations.pixKey;
    if (els.donatePixNote) els.donatePixNote.textContent = donations.pixNote;
    if (els.donateLivePixLink) els.donateLivePixLink.href = donations.livePixUrl;
    if (els.donateKofiLink) els.donateKofiLink.href = donations.kofiUrl;
    if (els.donateSponsorsLink) els.donateSponsorsLink.href = donations.githubSponsorsUrl;
  }

  // --- Optional GitHub Releases API Enrichment ---
  async function fetchReleaseMetadata(project) {
    if (!project.githubRepo || !project.githubRepo.includes('/')) return null;
    const cacheKey = `ix-gh-${project.githubRepo}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // Sem acesso ao sessionStorage
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

  // --- Project Modal ---
  async function openProjectModal(project) {
    const badgeClass =
      project.category === 'jogo'
        ? 'badge badge-jogo'
        : project.category === 'mod'
          ? 'badge badge-mod'
          : 'badge';

    els.projectDialogBadge.className = badgeClass;
    els.projectDialogBadge.textContent = project.categoryLabel;
    els.projectDialogTitle.textContent = project.title;
    els.projectDialogCover.src = project.cover;
    els.projectDialogCover.alt = project.coverAlt || project.title;
    els.projectDialogDescription.textContent = project.description;

    const renderMeta = (version, size) => {
      const metaEntries = [
        ['Versão atual', version],
        ['Tamanho', size],
        ['Plataformas', project.platforms.join(', ')],
        ['Licença', project.license],
      ];
      const nodes = metaEntries.map(([label, value]) => {
        const wrap = document.createElement('div');
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value;
        wrap.append(dt, dd);
        return wrap;
      });
      els.projectDialogMeta.replaceChildren(...nodes);
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

    els.projectDialogReqs.replaceChildren(
      ...project.requirements.map((req) => {
        const li = document.createElement('li');
        li.textContent = req;
        return li;
      }),
    );

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

    els.projectDialog.showModal();

    const live = await fetchReleaseMetadata(project);
    if (live && els.projectDialog.open) {
      renderMeta(live.version, live.size);
      els.projectDialogDownload.href = live.downloadUrl;
    }
  }

  // --- Catalog Filtering & Rendering ---
  function syncUrlParams() {
    if (window.location.protocol === 'file:') return;
    const url = new URL(window.location.href);
    if (state.category !== 'all') {
      url.searchParams.set('cat', state.category);
    } else {
      url.searchParams.delete('cat');
    }
    if (state.query) {
      url.searchParams.set('q', state.query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url);
  }

  function renderCatalog() {
    const queryLower = state.query.trim().toLowerCase();
    const filtered = data.projects
      .filter((project) => {
        if (state.category !== 'all' && project.category !== state.category) {
          return false;
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
      })
      .toSorted((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

    els.resultsStatus.textContent =
      filtered.length === 1
        ? '1 projeto encontrado.'
        : `${filtered.length} projetos encontrados.`;

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      const title = document.createElement('h3');
      title.textContent = 'Nenhum projeto encontrado para esse filtro';
      const desc = document.createElement('p');
      desc.textContent = 'Tente limpar a busca ou selecionar outra categoria acima.';
      empty.append(title, desc);
      els.projectsGrid.replaceChildren(empty);
      return;
    }

    const cards = filtered.map((project) => {
      const article = document.createElement('article');
      article.className = 'project-card';

      const coverWrap = document.createElement('div');
      coverWrap.className = 'card-cover-wrap';
      const img = document.createElement('img');
      img.className = 'card-cover';
      img.src = project.cover;
      img.alt = project.coverAlt || project.title;
      img.width = 800;
      img.height = 450;
      img.loading = 'lazy';
      coverWrap.append(img);

      const body = document.createElement('div');
      body.className = 'card-body';

      const topRow = document.createElement('div');
      topRow.className = 'card-top-row';

      const badge = document.createElement('span');
      badge.className =
        project.category === 'jogo'
          ? 'badge badge-jogo'
          : project.category === 'mod'
            ? 'badge badge-mod'
            : 'badge';
      badge.textContent = project.categoryLabel;

      const version = document.createElement('span');
      version.className = 'version-tag';
      version.textContent = `${project.version} • ${project.size}`;
      topRow.append(badge, version);

      const h3 = document.createElement('h3');
      h3.textContent = project.title;

      const summary = document.createElement('p');
      summary.className = 'card-summary';
      summary.textContent = project.summary;

      const tagList = document.createElement('ul');
      tagList.className = 'tag-list';
      tagList.setAttribute('aria-label', 'Plataformas e tags');
      for (const label of [...project.platforms, ...project.tags]) {
        const li = document.createElement('li');
        li.className = 'tag-chip';
        li.textContent = label;
        tagList.append(li);
      }

      const actions = document.createElement('div');
      actions.className = 'card-actions';

      const detailsBtn = document.createElement('button');
      detailsBtn.type = 'button';
      detailsBtn.className = 'btn btn-primary';
      detailsBtn.textContent = 'Tutorial & Baixar';
      detailsBtn.setAttribute('aria-label', `Tutorial & Baixar — ${project.title}`);
      detailsBtn.addEventListener('click', () => openProjectModal(project));

      const repoLink = document.createElement('a');
      repoLink.href = project.repoUrl || data.studio.githubOrgUrl;
      repoLink.target = '_blank';
      repoLink.rel = 'noopener noreferrer';
      repoLink.className = 'btn btn-secondary';
      repoLink.textContent = 'GitHub';
      repoLink.setAttribute('aria-label', `GitHub — ${project.title}`);

      actions.append(detailsBtn, repoLink);
      body.append(topRow, h3, summary, tagList, actions);
      article.append(coverWrap, body);
      return article;
    });

    els.projectsGrid.replaceChildren(...cards);
  }

  function setupCatalogControls() {
    const params = new URLSearchParams(window.location.search);
    const initialCat = params.get('cat');
    const initialQuery = params.get('q');
    const initialProjectId = params.get('projeto');

    if (initialCat && ['all', 'app', 'jogo', 'mod'].includes(initialCat)) {
      state.category = initialCat;
    }
    if (initialQuery) {
      state.query = initialQuery;
      if (els.searchInput) els.searchInput.value = initialQuery;
    }

    for (const btn of els.filterButtons) {
      const cat = btn.dataset.filter;
      btn.setAttribute('aria-pressed', String(cat === state.category));
      btn.addEventListener('click', () => {
        state.category = cat;
        for (const other of els.filterButtons) {
          other.setAttribute('aria-pressed', String(other === btn));
        }
        syncUrlParams();
        renderCatalog();
      });
    }

    els.searchInput?.addEventListener('input', (event) => {
      state.query = event.target.value;
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
  hydrateStudioInfo();
  setupCatalogControls();
})();
