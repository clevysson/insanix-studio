/**
 * INSANIX STUDIO — Catálogo Oficial do Marketplace
 *
 * Projetos publicados via GitHub Releases (binários prontos para usuário final).
 * Atualizado automaticamente a partir de apps/, jogos/ e mods/.
 */

window.INSANIX_DATA = {
  studio: {
    name: "INSANIX STUDIO",
    tagline: "Apps, jogos e mods feitos de forma independente para a comunidade.",
    description:
      "Somos dois criadores independentes desenvolvendo ferramentas úteis, jogos autorais e mods gratuitos. Tudo distribuído via GitHub Releases, com tutoriais passo a passo e verificação SHA-256.",
    githubOrgUrl: "https://github.com/clevysson/insanix-studio",
    discordUrl: "https://discord.com/",
    youtubeUrl: "https://youtube.com/",
    contactEmail: "contato@insanixstudio.com.br",
    founders: [
      { name: "Clevysson", role: "Criador • Apps, Jogos & Mods" },
      { name: "Co-criador (Amigo)", role: "Parceiro • Design, Sistemas & Mods" }
    ]
  },

  donations: {
    // IMPORTANTE: Nunca coloque seu CPF como chave Pix pública!
    // Crie uma Chave Aleatória no seu banco ou use LivePix/Apoia.se.
    pixKey: "SUBSTITUA-PELA-SUA-CHAVE-PIX-ALEATORIA",
    pixReceiverName: "Insanix Studio",
    pixNote: "Use uma chave aleatória ou LivePix para manter seus dados pessoais privados.",
    pixQrImage: "assets/img/pix-qr-placeholder.svg",
    livePixUrl: "https://livepix.gg/",
    kofiUrl: "https://ko-fi.com/",
    githubSponsorsUrl: "https://github.com/sponsors",
    supporters: [
      { name: "Espaço para o 1º apoiador!", badge: "Fundador" },
      { name: "Seu nome pode aparecer aqui", badge: "Apoiador" }
    ]
  },

  projects: [
    {
      id: "desktop-organizer-pro",
      category: "app",
      categoryLabel: "App",
      title: "DesktopOrganizerPro",
      summary:
        "Organizador moderno para Área de Trabalho do Windows com Fences acrílicos, Portais de Pasta em tempo real e triagem automática.",
      description:
        "O DesktopOrganizerPro transforma uma Área de Trabalho cheia de atalhos em painéis translúcidos elegantes (Fences) com efeito Acrílico nativo do Windows (DWM). Conta com Portais de Pasta sincronizados em tempo real, regras automáticas para organizar novos arquivos e remover atalhos de apps desinstalados, busca instantânea (Ctrl+F), modos Grade ou Lista, ícones personalizáveis, perfis rápidos e proteção contra minimização no Win+D.",
      version: "v1.0.0",
      releaseDate: "2026-11-18",
      size: "62.6 MB",
      license: "Gratuito (Freeware)",
      platforms: ["Windows 10/11"],
      tags: ["Desktop", "Produtividade", "Utilitário", "Windows"],
      cover: "assets/img/cover-desktop-organizer.svg",
      coverAlt: "Interface estilizada com painéis translúcidos do DesktopOrganizerPro",
      featured: true,
      githubRepo: "clevysson/desktop-organizer-pro",
      downloadUrl:
        "https://github.com/clevysson/desktop-organizer-pro/releases/download/v1.0.0/DesktopOrganizerPro-v1.0.0-win64.zip",
      repoUrl: "https://github.com/clevysson/desktop-organizer-pro",
      virustotalUrl: "",
      sha256: "659073B80715854F5837CCD89ED1E5691B38A3A45230BC916722FED292BE2E5B",
      requirements: [
        "Windows 10 (versão 1903 ou superior) ou Windows 11 — 64-bit (x64)",
        "Nenhuma instalação adicional necessária (pacote portátil autocontido com .NET 8 incluso)",
        "Aproximadamente 165 MB de espaço livre em disco após extração"
      ],
      tutorialSteps: [
        {
          title: "1. Baixar e extrair o pacote",
          detail:
            "Baixe o arquivo DesktopOrganizerPro-v1.0.0-win64.zip, clique com o botão direito e escolha 'Extrair Tudo...' para uma pasta fixa no computador."
        },
        {
          title: "2. Executar o aplicativo",
          detail:
            "Abra o arquivo DesktopOrganizerPro.exe. Na primeira execução, o aplicativo cria automaticamente Fences iniciais (Jogos, Criação, Ferramentas, Pastas e Documentos) agrupando seus atalhos existentes."
        },
        {
          title: "3. Personalizar Fences, cores e ícones",
          detail:
            "Arraste pela barra de título ou redimensione pelas bordas com encaixe magnético. Clique no ícone ao lado do título para escolher um ícone personalizado (.ico, .png, .jpg) ou clique com o botão direito no fundo do Fence para ajustar transparência, cor de destaque, modo Grade/Lista, filtros por extensão e criação de Portais de Pasta."
        },
        {
          title: "4. Usar atalhos e bandeja do sistema",
          detail:
            "Pressione Ctrl + Alt + F a qualquer momento para ocultar ou mostrar todos os Fences rapidamente, ou Ctrl + F com o Fence focado para buscar atalhos. Pela bandeja do sistema (próximo ao relógio), você pode alternar perfis, alinhar todos os Fences na tela e ativar a inicialização junto com o Windows."
        }
      ],
      tutorialCommand: "certutil -hashfile DesktopOrganizerPro-v1.0.0-win64.zip SHA256",
      changelog: [
        "v1.0.0 — Lançamento oficial inicial: Fences translúcidos com DWM Acrylic Blur, Portais de Pasta com atualização em tempo real, triagem automática por regras, limpeza automática de atalhos de apps desinstalados, personalização de ícones (presets e imagens próprias), modo Fixo Sempre Aberto / Modo Cortina, perfis rápidos, alinhamento automático e atalho global Ctrl+Alt+F."
      ]
    },
    {
      id: "disklens-pro",
      category: "app",
      categoryLabel: "App",
      title: "DiskLens Pro",
      summary:
        "Analisador e limpador visual de disco por extensões com galeria de miniaturas, player integrado e detector de duplicados.",
      description:
        "Utilitário nativo para Windows 10/11 que vasculha discos e pastas em alta velocidade via API Win32, calcula o espaço real ocupado em disco por extensão (.mp4, .rar, .mkv, .pak, .zip, .vhdx, .png e outras), exibe pré-visualizações reais de imagens, vídeos, áudios, textos e arquivos compactados (ZIP/TAR), identifica cópias duplicadas por SHA-256 e permite abrir o local exato no Explorer, mover arquivos para outro disco ou limpar com segurança para a Lixeira.",
      version: "v2.0.0",
      releaseDate: "2026-11-18",
      size: "56.5 MB",
      license: "Gratuito (Freeware)",
      platforms: ["Windows 10 (64-bit)", "Windows 11 (64-bit)"],
      tags: ["Armazenamento", "Limpeza", "Utilitário", "Extensões", "Duplicados", "Windows"],
      cover: "assets/img/cover-disklens.svg",
      coverAlt: "Gráfico circular e barras de armazenamento por extensão do DiskLens Pro",
      featured: false,
      githubRepo: "clevysson/disklens-pro",
      downloadUrl:
        "https://github.com/clevysson/disklens-pro/releases/download/v2.0.0/DiskLensPro-v2.0.0-win-x64.zip",
      repoUrl: "https://github.com/clevysson/disklens-pro",
      virustotalUrl: "",
      sha256: "1927EE9BA70A213559D9DD7FC3D2DBC144265BEB55E36DF879C73AA9274BBA07",
      requirements: [
        "Windows 10 ou Windows 11 (64-bit / x64)",
        "Nenhuma dependência externa necessária (executável autocontido com runtime integrado)",
        "Aproximadamente 100 MB de espaço livre para extração e execução"
      ],
      tutorialSteps: [
        {
          title: "1. Baixar e extrair o pacote",
          detail:
            "Baixe o arquivo DiskLensPro-v2.0.0-win-x64.zip e extraia o executável DiskLensPro.exe para uma pasta de sua preferência (por exemplo, na Área de Trabalho ou em uma pasta de utilitários)."
        },
        {
          title: "2. Executar o aplicativo",
          detail:
            "Dê dois cliques em DiskLensPro.exe. Não é necessária instalação nem download separado do .NET."
        },
        {
          title: "3. Escolher o disco ou pasta e escanear",
          detail:
            "Na tela inicial ou na barra superior, selecione o disco (ex.: C: ou D:) ou clique em 'Pasta...' e pressione 'Escanear' (atalho F5)."
        },
        {
          title: "4. Filtrar por extensões e visualizar antes de apagar",
          detail:
            "Use o painel esquerdo para clicar ou marcar extensões (.mp4, .rar, .iso, .png, etc.), alterne entre 'Lista' e 'Galeria' de miniaturas, clique em um arquivo para pré-visualizar no painel direito (ou clique em 'Ampliar' para Lightbox) e use 'Ir para o Local' para abrir a pasta no Windows Explorer."
        },
        {
          title: "5. Limpar, mover ou remover duplicados com segurança",
          detail:
            "Marque as caixas dos itens desejados — ou use as abas 'Duplicados' e 'Caches e Lixeira' — e escolha 'Mover para Lixeira', 'Mover para...' (outro disco) ou 'Excluir Permanentemente' na barra inferior."
        }
      ],
      tutorialCommand: "Get-FileHash .\\DiskLensPro-v2.0.0-win-x64.zip -Algorithm SHA256",
      changelog: [
        "v2.0.0 — Adicionado modo Galeria Visual de miniaturas paginada, Lightbox ampliado com navegação por setas, ordenação global, inspeção de arquivos TAR/TAR.GZ, detecção expandida de caches (AMD, Photoshop IA, CrashDumps, pip, Roblox), preservação opcional de subpastas ao mover arquivos e dashboard inicial de discos.",
        "v1.0.0 — Versão inicial com varredura paralela Win32/NTFS, agrupamento por extensões e categorias, Treemap interativo, detector de duplicados SHA-256, prévia visual com player de vídeo/áudio e limpeza segura para a Lixeira."
      ]
    }
  ]
};
