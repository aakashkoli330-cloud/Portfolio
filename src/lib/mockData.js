export const profile = {
  firstName: 'Alex',
  lastName: 'Morgan',
  role: 'Full-Stack Developer',
  tagline:
    'I craft bold, colorful web experiences that feel effortless — where clean engineering meets expressive design.',
  email: 'hello@alexmorgan.dev',
  resumeUrl: '/resume.pdf',
  socials: {
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/in/',
    email: 'mailto:hello@alexmorgan.dev',
  },
  facts: ['Open to work', 'Remote friendly', 'Based on planet Earth'],
  stats: [
    { value: '3+', label: 'Years experience' },
    { value: '20+', label: 'Projects shipped' },
    { value: '15+', label: 'Technologies' },
  ],
}

const bio = [
  "I'm a full-stack developer who lives at the intersection of engineering and design. I obsess over the details most people only feel — the easing curve on a modal, the rhythm of a type scale, the way a page lands.",
  'These days I work mostly with React, Node and Firebase, turning fuzzy ideas into polished, production-ready products. Away from the keyboard you will find me sketching interfaces, exploring generative art, or over-engineering my coffee setup.',
]

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export const sectionIds = [
  'home',
  ...navLinks.map((l) => l.id),
]

export const skillGroups = [
  {
    category: 'Languages',
    accent: '#7c5cff',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL'],
  },
  {
    category: 'Frontend',
    accent: '#ff5da2',
    items: [
      'React',
      'Next.js',
      'Redux',
      'Tailwind CSS',
      'Framer Motion',
      'HTML & CSS',
    ],
  },
  {
    category: 'Backend',
    accent: '#38d6f0',
    items: [
      'Node.js',
      'Express',
      'Firebase',
      'PostgreSQL',
      'MongoDB',
      'GraphQL',
    ],
  },
  {
    category: 'Tools',
    accent: '#ffb347',
    items: ['Git & GitHub', 'Docker', 'Vercel', 'Figma', 'Jest', 'Linux'],
  },
]

export const projects = [
  {
    title: 'Nimbus',
    description:
      'Real-time weather intelligence dashboard with animated radar views, hourly forecasts and location analytics.',
    tech: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API'],
    github: '#',
    live: '#',
    coverGradient: 'from-grape/70 via-grape/30 to-glow/50',
    letter: 'N',
    featured: true,
  },
  {
    title: 'Cartway',
    description:
      'Headless e-commerce storefront with Stripe checkout, instant search and a CMS-driven catalog.',
    tech: ['Next.js', 'Stripe', 'PostgreSQL', 'Algolia'],
    github: '#',
    live: '#',
    coverGradient: 'from-flare/60 via-flare/25 to-honey/50',
    letter: 'C',
    featured: false,
  },
  {
    title: 'DevBoard',
    description:
      'Kanban productivity app with realtime sync, drag-and-drop boards and full offline support.',
    tech: ['React', 'Firebase', 'dnd-kit', 'PWA'],
    github: '#',
    live: '#',
    coverGradient: 'from-glow/50 via-glow/20 to-grape/50',
    letter: 'D',
    featured: false,
  },
  {
    title: 'PulseChat',
    description:
      'Encrypted realtime chat with presence indicators, typing status and peer-to-peer media sharing.',
    tech: ['Node.js', 'Socket.io', 'Redis', 'WebRTC'],
    github: '#',
    live: '#',
    coverGradient: 'from-honey/50 via-honey/20 to-flare/45',
    letter: 'P',
    featured: false,
  },
]

export const experience = [
  {
    role: 'Senior Frontend Engineer',
    company: 'TechNova Labs',
    period: '2023 — Present',
    type: 'work',
    points: [
      'Led the rebuild of the customer portal in React + TypeScript, cutting load times by 40%.',
      'Built a company-wide design system adopted by four product teams.',
      'Mentored three junior engineers through structured code review and pairing.',
    ],
  },
  {
    role: 'Full-Stack Developer',
    company: 'PixelForge Studio',
    period: '2021 — 2023',
    type: 'work',
    points: [
      'Shipped twelve client sites end-to-end, from Figma handoff to production deploy.',
      'Developed Node.js APIs with Stripe billing powering recurring revenue products.',
      'Introduced CI/CD pipelines that took deploys from hours to minutes.',
    ],
  },
  {
    role: 'B.Tech in Computer Science',
    company: 'State University',
    period: '2017 — 2021',
    type: 'education',
    points: [
      'Graduated with first class honours.',
      'Won two inter-college hackathons; led the web development society.',
    ],
  },
]

export const siteDefaults = {
  ...profile,
  portraitUrl: '',
  bio,
}
