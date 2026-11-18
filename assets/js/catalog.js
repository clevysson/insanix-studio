/**
 * INSANIX STUDIO — Catálogo e Configurações do Site
 *
 * Como editar:
 * 1. Atualize os dados do estúdio (links do GitHub, Discord, e-mail, domínio).
 * 2. Configure seus dados de doação (use SEMPRE chave Pix aleatória ou LivePix para proteger seu CPF).
 * 3. Adicione, edite ou remova seus Apps, Jogos e Mods no array `projects`.
 *
 * Dica: Quando você preencher `githubRepo: "insanixstudio/nome-do-repo"`,
 * o site busca automaticamente a última versão publicada na aba Releases do GitHub!
 */

window.INSANIX_DATA = {
  studio: {
    name: "INSANIX STUDIO",
    tagline: "Apps, jogos e mods feitos de forma independente para a comunidade.",
    description:
      "Somos dois criadores independentes desenvolvendo ferramentas úteis, jogos autorais e mods gratuitos. Tudo distribuído via GitHub, com guias passo a passo para instalar sem complicação.",
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
      id: "insanix-optimizer-app",
      isExample: true,
      category: "app",
      categoryLabel: "App",
      title: "Insanix Utility Hub [Exemplo]",
      summary:
        "Utilitário leve para Windows com scripts rápidos, limpeza de cache e monitoramento de desempenho em tempo real.",
      description:
        "Projeto modelo para você substituir pelo seu primeiro aplicativo. Centralize a descrição, requisitos mínimos, hash SHA-256 para dar confiança a quem baixa e um tutorial claro logo abaixo.",
      version: "v1.0.0",
      releaseDate: "2026-11-18",
      size: "14.2 MB",
      license: "MIT / Gratuito",
      platforms: ["Windows 10/11"],
      tags: ["Utilitário", "Desktop", "Open Source"],
      cover: "assets/img/cover-app.svg",
      coverAlt: "Ilustração de interface de aplicativo da Insanix Studio",
      featured: true,
      // Preencha com "insanixstudio/seu-repositorio" quando publicar no GitHub:
      githubRepo: "",
      downloadUrl: "https://github.com/clevysson/insanix-studio",
      repoUrl: "https://github.com/clevysson/insanix-studio",
      virustotalUrl: "",
      sha256: "substitua-pelo-hash-sha256-real-do-arquivo-zip",
      requirements: [
        "Windows 10 ou Windows 11 (64-bit)",
        ".NET 8 Desktop Runtime (ou versão portátil autocontida)",
        "50 MB de espaço livre em disco"
      ],
      tutorialSteps: [
        {
          title: "Baixe a versão mais recente no GitHub Releases",
          detail:
            "Clique no botão de download acima e escolha o arquivo .zip da última release estável."
        },
        {
          title: "Extraia a pasta completa antes de executar",
          detail:
            "Clique com o botão direito no arquivo .zip → Extrair Tudo. Não execute diretamente de dentro do ZIP."
        },
        {
          title: "Execute e confira os módulos",
          detail:
            "Abra o executável principal. Caso o Windows SmartScreen apareça em releases novas, verifique o hash SHA-256 ou compile pelo código-fonte no repositório."
        }
      ],
      tutorialCommand: "certutil -hashfile InsanixUtility-v1.0.0.zip SHA256",
      changelog: [
        "v1.0.0 — Lançamento inicial de exemplo com estrutura de download e tutorial."
      ]
    },
    {
      id: "neon-drift-game",
      isExample: true,
      category: "jogo",
      categoryLabel: "Jogo",
      title: "Neon Void Arena [Exemplo]",
      summary:
        "Jogo indie arcade top-down com chefes progressivos, trilha synthwave e suporte a teclado e controle.",
      description:
        "Modelo pronto para os jogos criados por vocês dois. Inclui controles recomendados, requisitos, link direto para o pacote do GitHub Releases e instruções para rodar sem erros.",
      version: "v0.9.4-beta",
      releaseDate: "2026-11-10",
      size: "68.5 MB",
      license: "Gratuito (Freeware)",
      platforms: ["Windows", "Linux"],
      tags: ["Arcade", "Indie", "Co-op Local"],
      cover: "assets/img/cover-game.svg",
      coverAlt: "Ilustração de controle gamer neon representando um jogo da Insanix Studio",
      featured: true,
      githubRepo: "",
      downloadUrl: "https://github.com/clevysson/insanix-studio",
      repoUrl: "https://github.com/clevysson/insanix-studio",
      virustotalUrl: "",
      sha256: "substitua-pelo-hash-sha256-real-do-jogo-zip",
      requirements: [
        "Placa de vídeo compatível com OpenGL 3.3 / Vulkan",
        "4 GB de RAM",
        "Teclado ou controle USB/Bluetooth"
      ],
      tutorialSteps: [
        {
          title: "Faça o download do pacote para seu sistema",
          detail:
            "Baixe a versão Windows (.zip) ou Linux (.tar.gz) na página de Releases."
        },
        {
          title: "Descompacte em uma pasta fora de Arquivos de Programas",
          detail:
            "Extrair em Documentos ou Jogos evita bloqueios de permissão ao salvar seu progresso."
        },
        {
          title: "Controles básicos dentro do jogo",
          detail:
            "Use WASD ou Setas para mover, Espaço para dash e Clique Esquerdo / Botão X para atacar."
        }
      ],
      tutorialCommand: "",
      changelog: [
        "v0.9.4-beta — Ajustes de balanceamento no Boss 2 e suporte a controle Xbox.",
        "v0.9.0-beta — Primeira build pública para testes da comunidade."
      ]
    },
    {
      id: "overhaul-pack-mod",
      isExample: true,
      category: "mod",
      categoryLabel: "Mod",
      title: "Insanix Realism & Tweaks [Exemplo]",
      summary:
        "Pacote de modificação que melhora balanceamento, interface e desempenho mantendo a experiência original.",
      description:
        "Modelo ideal para seus mods. Deixa explícito qual é o jogo base necessário, a versão compatível, passos exatos de instalação, backup do save e aviso legal de projeto feito por fãs.",
      version: "v2.1.0",
      releaseDate: "2026-11-02",
      size: "8.7 MB",
      license: "Fan Mod • Gratuito",
      platforms: ["PC (Jogo Base v1.20+)"],
      tags: ["QoL", "Balanceamento", "Performance"],
      cover: "assets/img/cover-mod.svg",
      coverAlt: "Ilustração geométrica representando um mod modular da Insanix Studio",
      featured: false,
      githubRepo: "",
      downloadUrl: "https://github.com/clevysson/insanix-studio",
      repoUrl: "https://github.com/clevysson/insanix-studio",
      virustotalUrl: "",
      sha256: "substitua-pelo-hash-sha256-real-do-mod-zip",
      requirements: [
        "Cópia original do jogo base atualizada",
        "Mod Loader compatível instalado previamente",
        "Backup da pasta de saves antes da instalação"
      ],
      tutorialSteps: [
        {
          title: "Faça backup dos seus saves antes de instalar",
          detail:
            "Copie sua pasta de save atual para um local seguro caso queira voltar atrás depois."
        },
        {
          title: "Mova os arquivos do mod para a pasta /mods",
          detail:
            "Extraia o arquivo baixado e copie apenas a pasta do mod para dentro do diretório /mods do jogo."
        },
        {
          title: "Valide a ordem de carregamento (Load Order)",
          detail:
            "Inicie o jogo e confira no menu de Mods se 'Insanix Realism & Tweaks' aparece ativado sem conflitos."
        }
      ],
      tutorialCommand: "robocopy .\\InsanixMod \"%USERPROFILE%\\Games\\Mods\\InsanixMod\" /E",
      changelog: [
        "v2.1.0 — Correção de compatibilidade com a atualização mais recente do jogo base.",
        "v2.0.0 — Reescrita dos arquivos de configuração e redução no uso de memória."
      ]
    }
  ]
};
