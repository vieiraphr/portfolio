import type { Dict } from "./pt";

export const en: Dict = {
  meta: {
    title: "Pedro Vieira · Full Stack Developer",
    description:
      "Portfolio of Pedro Vieira, an aspiring Full Stack developer based in Curitiba, Brazil. Systems Analysis and Development student at Senac PR.",
  },
  nav: {
    about: "About",
    projects: "Projects",
    stack: "Stack",
    journey: "Journey",
    contact: "Contact",
    switchLabel: "Ler em português",
    skip: "Skip to content",
  },
  hero: {
    photoAlt: "Photo of Pedro Vieira",
    graph: {
      label: "Skills map: hard skills, AI First mindset and soft skills, connected as a graph",
      hubs: { hard: "Hard skills", ai: "AI First", soft: "Soft skills" },
      hard: ["JavaScript", "HTML5", "CSS3", "Python", "MySQL", "Git", "GitHub", "OOP", "REST APIs", "Logic", "Algorithms"],
      ai: ["Prompt engineering", "AI pair programming", "Automation", "AI as a study tool"],
      soft: ["Problem solving", "Communication", "Teamwork", "Continuous learning", "Critical thinking", "Adaptability"],
    },
    role: "Aspiring Full Stack Developer",
    headline: "I turn problems into solutions, one line of code at a time.",
    sub: "Systems Analysis and Development student at Senac PR. My goal is simple: get a little better every day and turn ideas into applications that work.",
    ctaPrimary: "See projects",
    ctaSecondary: "Get in touch",
    scroll: "scroll down",
  },
  about: {
    label: "About",
    title: "I started in 2025. I haven't stopped asking “what if?”",
    paragraphs: [
      "I wrote my first line of code in 2025 and found out that what drives me most is looking at a problem and finding the path to its solution.",
      "I'm currently studying Systems Analysis and Development at Senac PR. My focus right now is front-end with JavaScript, and I'm moving into back-end to become a Full Stack developer.",
      "I haven't worked in the field yet, which is exactly why I study every day, document everything on GitHub and stay open to feedback.",
    ],
    stats: [
      { value: "2025", label: "First line of code" },
      { value: "", icon: "python", label: "Algorithms solved in Python" },
      { value: "ADS", label: "Student at Senac PR" },
    ],
    softTitle: "What I bring to a team",
    soft: [
      "Problem solving",
      "Communication",
      "Teamwork",
      "Continuous learning",
      "Open to feedback",
    ],
    personal: {
      title: "Away from the keyboard (sometimes at another one)",
      intro: "Go ahead and play: everything here is interactive.",
      keyboard: {
        title: "Keyboard",
        hint: "tap the keys or use A–K",
        label: "Mini keyboard: play a note",
        text: "I play keyboard and I sing. Daily practice, patience and attention to detail matter as much in music as in code.",
      },
      guitar: {
        title: "Guitar",
        hint: "drag across the strings",
        loading: "tuning the guitar",
        fallback: {
          noWebgl: "This browser has no hardware acceleration (WebGL), so the guitar is shown as a photo",
          failed: "The 3D guitar didn't load, so it is shown as a photo",
        },
        label: "Mini guitar: drag your finger or mouse across the strings, or use keys 1 to 6",
        text: "My acoustic guitar is with me every day. A hard chord is like a stubborn bug: practice it and it gives in.",
      },
      bjj: {
        title: "Jiu-Jitsu",
        hint: "click the gi",
        label: "Gi with a white belt and 3 stripes. Click to bow.",
        badge: "White belt · 3 stripes",
        bow: "Oss!",
        text: "On the mat I learned that every problem has a way out: stay calm and adjust your position.",
      },
      growth: {
        title: "Personal growth",
        hint: "hover and click a cover",
        pick: "Hover over a cover",
        amazon: "Search on Amazon",
        text: "Passionate about programming and soft skills, always with a book on both close at hand.",
        books: [
          {
            title: "How to Win Friends and Influence People",
            author: "Dale Carnegie",
            cover: "/books/como-fazer-amigos.jpg",
            url: "https://www.amazon.com/s?k=How+to+Win+Friends+and+Influence+People+Dale+Carnegie",
            note: "Listening and being genuinely interested in people opens more doors than any argument.",
          },
          {
            title: "The Clean Coder",
            author: "Robert C. Martin",
            cover: "/books/clean-coder.jpg",
            url: "https://www.amazon.com/s?k=The+Clean+Coder+Robert+C.+Martin",
            note: "Being a professional means owning your code, estimating honestly and knowing when to say no.",
          },
        ],
      },
    },
  },
  projects: {
    label: "Projects",
    title: "Things I've built",
    intro: "Every project started with a question and ended with something I learned.",
    featured: "Featured",
    problem: "Problem",
    solution: "Solution",
    learned: "What I learned",
    live: "Live demo",
    code: "Code",
    here: "You are here",
    items: {
      pokedex: {
        title: "Pokédex",
        summary:
          "An interactive Pokédex powered by the PokéAPI: search by name or number and browse Pokémon with animated sprites.",
        problem:
          "Show data from an external API dynamically and handle searches that return nothing.",
        solution:
          "Requests with fetch and async/await, DOM rendering, and loading and “not found” states.",
        learned: "Consuming REST APIs, asynchronous programming and DOM manipulation.",
      },
      estudos: {
        title: "Academic Studies",
        summary:
          "The hub for my degree work: algorithms in Python and Object-Oriented Programming exercises in Python and JavaScript, including a student sign-up app in the browser.",
        learned: "Programming logic, classes, inheritance and polymorphism.",
      },
      portfolio: {
        title: "This portfolio",
        summary:
          "A bilingual (PT/EN) site built with Next.js, TypeScript and Tailwind CSS, with animations, a focus on accessibility and statically generated pages.",
        learned: "Next.js, React components and internationalization.",
      },
    },
  },
  stack: {
    label: "Stack",
    title: "Everyday tools",
    main: "Main",
    also: "Also use",
    next: "Next steps toward Full Stack",
  },
  journey: {
    label: "Journey",
    title: "So far",
    items: [
      {
        when: "2025",
        title: "First line of code",
        text: "I started programming and found out I love solving problems.",
      },
      {
        when: "In progress",
        title: "Systems Analysis and Development · Senac PR",
        text: "Logic, algorithms, Object-Oriented Programming and databases.",
      },
      {
        when: "2026",
        title: "Pokédex with the PokéAPI",
        text: "My first project consuming an external API, published on GitHub Pages.",
      },
      {
        when: "2026",
        title: "Algorithms and OOP in two languages",
        text: "Practiced logic in Python and applied the same OOP concepts in Python and JavaScript.",
      },
      {
        when: "Now",
        title: "Looking for my first role",
        text: "Ready to learn with a team and contribute as a Full Stack developer.",
      },
    ],
  },
  contact: {
    label: "Contact",
    title: "Let's talk",
    text: "I'm looking for my first opportunity as a Full Stack developer, in the Curitiba area or remote. Reach out by email or LinkedIn.",
    copy: "Copy email",
    copied: "Copied!",
  },
  footer: {
    made: "Built with Next.js by Pedro Vieira",
    top: "Back to top",
  },
};
