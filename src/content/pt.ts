export const pt = {
  meta: {
    title: "Pedro Vieira · Desenvolvedor Full Stack",
    description:
      "Portfólio de Pedro Vieira, desenvolvedor Full Stack em formação em Curitiba/PR. Estudante de Análise e Desenvolvimento de Sistemas no Senac PR.",
  },
  nav: {
    about: "Sobre",
    projects: "Projetos",
    stack: "Stack",
    journey: "Jornada",
    contact: "Contato",
    switchLabel: "Read in English",
    skip: "Pular para o conteúdo",
  },
  hero: {
    photoAlt: "Foto de Pedro Vieira",
    graph: {
      label: "Mapa de habilidades: hard skills, mentalidade AI First e soft skills, conectadas como um grafo",
      hubs: { hard: "Hard skills", ai: "AI First", soft: "Soft skills" },
      hard: ["JavaScript", "HTML5", "CSS3", "Python", "MySQL", "Git", "GitHub", "POO", "APIs REST", "Lógica", "Algoritmos"],
      ai: ["Prompt engineering", "Pair programming com IA", "Automação", "IA como ferramenta de estudo"],
      soft: ["Resolução de problemas", "Comunicação", "Trabalho em equipe", "Aprendizado contínuo", "Pensamento crítico", "Adaptabilidade"],
    },
    role: "Desenvolvedor Full Stack em formação",
    headline: "Transformo problemas em soluções, uma linha de código por vez.",
    sub: "Estudante de Análise e Desenvolvimento de Sistemas no Senac PR. Meu objetivo é simples: evoluir um pouco todos os dias e transformar ideias em aplicações que funcionam.",
    ctaPrimary: "Ver projetos",
    ctaSecondary: "Fale comigo",
    scroll: "role para baixo",
  },
  about: {
    label: "Sobre",
    title: "Comecei em 2025. Ainda não parei de perguntar “e se?”",
    paragraphs: [
      "Escrevi minha primeira linha de código em 2025 e descobri que o que mais me motiva é olhar para um problema e encontrar o caminho até a solução.",
      "Hoje curso Análise e Desenvolvimento de Sistemas no Senac PR. Meu foco atual é o front-end, com JavaScript, e estou avançando para o back-end para me tornar um desenvolvedor Full Stack.",
      "Ainda não trabalhei na área, e é justamente por isso que estudo todos os dias, documento tudo no GitHub e estou sempre aberto a feedback.",
    ],
    stats: [
      { value: "2025", label: "Primeira linha de código" },
      { value: "", icon: "python", label: "Algoritmos resolvidos em Python" },
      { value: "ADS", label: "Cursando no Senac PR" },
    ],
    softTitle: "O que levo para um time",
    soft: [
      "Resolução de problemas",
      "Comunicação",
      "Trabalho em equipe",
      "Aprendizado contínuo",
      "Abertura a feedback",
    ],
    personal: {
      title: "Longe do teclado (às vezes, em outro)",
      intro: "Pode mexer: tudo aqui é interativo.",
      keyboard: {
        title: "Teclado",
        hint: "toque as teclas ou use A–K",
        label: "Mini teclado: toque uma nota",
        text: "Toco teclado e canto. Prática diária, paciência e atenção aos detalhes valem tanto na música quanto no código.",
      },
      guitar: {
        title: "Violão",
        hint: "arraste pelas cordas",
        loading: "afinando o violão",
        fallback: {
          noWebgl: "Modo 2D: este navegador está sem aceleração de vídeo (WebGL)",
          failed: "Modo 2D: o violão 3D não carregou",
        },
        label: "Mini violão: arraste o dedo ou o mouse pelas cordas, ou use as teclas 1 a 6",
        text: "O violão me acompanha no dia a dia. Acorde difícil é igual bug teimoso: com repetição, sai.",
      },
      bjj: {
        title: "Jiu-Jitsu",
        hint: "clique no kimono",
        label: "Kimono com faixa branca e 3 graus. Clique para cumprimentar.",
        badge: "Faixa branca · 3 graus",
        bow: "Oss!",
        text: "No tatame aprendi que todo problema tem uma saída: manter a calma e ajustar a posição.",
      },
      growth: {
        title: "Desenvolvimento pessoal",
        hint: "passe o mouse e clique na capa",
        pick: "Passe o mouse sobre uma capa",
        amazon: "Buscar na Amazon",
        text: "Entusiasta de programação e de soft skills, sempre com um livro sobre os dois assuntos por perto.",
        books: [
          {
            title: "Como Fazer Amigos e Influenciar Pessoas",
            author: "Dale Carnegie",
            cover: "/books/como-fazer-amigos.jpg",
            url: "https://www.amazon.com.br/s?k=Como+fazer+amigos+e+influenciar+pessoas+Dale+Carnegie",
            note: "Ouvir e se interessar de verdade pelas pessoas abre mais portas do que qualquer argumento.",
          },
          {
            title: "The Clean Coder",
            author: "Robert C. Martin",
            cover: "/books/clean-coder.jpg",
            url: "https://www.amazon.com.br/s?k=The+Clean+Coder+Robert+C.+Martin",
            note: "Ser profissional é assumir a responsabilidade pelo próprio código, estimar com honestidade e saber dizer não.",
          },
        ],
      },
    },
  },
  projects: {
    label: "Projetos",
    title: "Coisas que construí",
    intro: "Cada projeto começou com uma pergunta e terminou com algo que aprendi.",
    featured: "Destaque",
    problem: "Problema",
    solution: "Solução",
    learned: "O que aprendi",
    live: "Ver ao vivo",
    code: "Código",
    here: "Você está aqui",
    items: {
      pokedex: {
        title: "Pokédex",
        summary:
          "Pokédex interativa que consome a PokéAPI: busca por nome ou número e navegação entre Pokémon com sprites animados.",
        problem:
          "Exibir dados de uma API externa de forma dinâmica e lidar com buscas que não retornam nada.",
        solution:
          "Requisições com fetch e async/await, renderização no DOM e estados de carregamento e de “não encontrado”.",
        learned: "Consumir APIs REST, programação assíncrona e manipulação do DOM.",
      },
      estudos: {
        title: "Estudos Acadêmicos",
        summary:
          "O hub dos meus estudos em ADS: algoritmos em Python e exercícios de Programação Orientada a Objetos em Python e JavaScript, incluindo um cadastro de alunos no navegador.",
        learned: "Lógica de programação, classes, herança e polimorfismo.",
      },
      portfolio: {
        title: "Este portfólio",
        summary:
          "Site bilíngue (PT/EN) feito com Next.js, TypeScript e Tailwind CSS, com animações, foco em acessibilidade e páginas geradas de forma estática.",
        learned: "Next.js, componentes em React e internacionalização.",
      },
    },
  },
  stack: {
    label: "Stack",
    title: "Ferramentas do dia a dia",
    main: "Principal",
    also: "Também uso",
    next: "Próximos passos rumo ao Full Stack",
  },
  journey: {
    label: "Jornada",
    title: "Até aqui",
    items: [
      {
        when: "2025",
        title: "Primeira linha de código",
        text: "Comecei a programar e descobri que gosto de resolver problemas.",
      },
      {
        when: "Em andamento",
        title: "Análise e Desenvolvimento de Sistemas · Senac PR",
        text: "Lógica, algoritmos, Programação Orientada a Objetos e banco de dados.",
      },
      {
        when: "2026",
        title: "Pokédex com a PokéAPI",
        text: "Meu primeiro projeto consumindo uma API externa, publicado no GitHub Pages.",
      },
      {
        when: "2026",
        title: "Algoritmos e POO em duas linguagens",
        text: "Pratiquei lógica em Python e apliquei os mesmos conceitos de POO em Python e JavaScript.",
      },
      {
        when: "Agora",
        title: "Buscando minha primeira vaga",
        text: "Pronto para aprender com um time e contribuir como desenvolvedor Full Stack.",
      },
    ],
  },
  contact: {
    label: "Contato",
    title: "Vamos conversar?",
    text: "Estou procurando minha primeira oportunidade como desenvolvedor Full Stack, em Curitiba e região ou remoto. Me chame por e-mail ou LinkedIn.",
    copy: "Copiar e-mail",
    copied: "Copiado!",
  },
  footer: {
    made: "Feito com Next.js por Pedro Vieira",
    top: "Voltar ao topo",
  },
};

export type Dict = typeof pt;
