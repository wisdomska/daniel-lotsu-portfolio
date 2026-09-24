import type { Content } from '@/lib/validation/content';

/*
 * Seed content, ported from DEFAULTS in design-source/portfolio-cms.js.
 * `pnpm db:seed` writes this into the database, and "Reset section" /
 * "Reset everything" in the CMS restore from it. Icon and cover URLs are kept
 * exactly as the design had them.
 *
 * Differences from the prototype: Daniel's contact email is updated, posts
 * carry a URL slug, and images carry alt text fields.
 */

const AWS = 'https://cdn.jsdelivr.net/npm/aws-icons@latest/icons/architecture-service/';
const DEV = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const DEFAULTS: Content = {
  settings: {
    theme: 'lime',
    customColor: '',
    projectLayout: 'grid',
    showMarquee: true,
    showStars: true,
  },
  site: {
    title: 'Daniel Ajayi Lotsu — Backend & Cloud Engineer',
    description:
      'Backend & cloud engineer at AmaliTech in Kumasi, Ghana. AWS-certified, architecting scalable cloud-native systems.',
    ogImage: '',
  },
  nav: {
    logo: 'daniel.lotsu',
    home: 'Home',
    contact: 'Contact',
    resume: 'Resume',
    blog: 'Blog',
    availability: 'Available for work',
    showAvailability: true,
  },
  hero: {
    eyebrow: 'BACKEND & CLOUD ENGINEER',
    firstName: 'Daniel',
    lastName: 'Ajayi Lotsu',
    tagline: '...building the behind-the-scenes systems that keep apps running',
    intro:
      'Architecting scalable, cloud-native systems from Kumasi — interconnected services, precisely composed like constellations. AWS-certified, building reliable backends that just stay online.',
    primaryLabel: 'See my work',
    secondaryLabel: 'Get in touch',
    stats: [
      {
        value: '2',
        label: 'AWS Certifications',
      },
      {
        value: '2+ yrs',
        label: 'as an engineer',
      },
      {
        value: 'BSc',
        label: 'Computer Science',
      },
      {
        value: 'Backend Engineer',
        label: 'at AmaliTech',
      },
    ],
  },
  projects: {
    heading: 'Things I’ve built',
    buttonLabel: 'View on GitHub',
    buttonUrl: 'https://github.com',
    featuredLabel: 'Featured',
    items: [
      {
        title: 'Leave Management API',
        status: 'Live',
        description:
          'A tool that lets AmaliTech staff request time off, get approvals and track their remaining leave days, with automatic notifications.',
        image: '',
        imageAlt: '',
        imageLabel: 'leave-mgmt-api — screenshot',
        link: '',
        featured: true,
        tags: [
          {
            label: 'Node.js',
            icon: DEV + 'nodejs/nodejs-original.svg',
          },
          {
            label: 'AWS Lambda',
            icon: AWS + 'AWSLambda.svg',
          },
          {
            label: 'PostgreSQL',
            icon: DEV + 'postgresql/postgresql-original.svg',
          },
          {
            label: 'API Gateway',
            icon: AWS + 'AmazonAPIGateway.svg',
          },
        ],
      },
      {
        title: 'Incident Service',
        status: 'Live',
        description:
          'A system for logging workplace issues and sending each one to the right team to fix.',
        image: '',
        imageAlt: '',
        imageLabel: 'incident-service — screenshot',
        link: '',
        featured: false,
        tags: [
          {
            label: 'Node.js',
            icon: DEV + 'nodejs/nodejs-original.svg',
          },
          {
            label: 'MySQL',
            icon: DEV + 'mysql/mysql-original.svg',
          },
          {
            label: 'Docker',
            icon: DEV + 'docker/docker-original.svg',
          },
        ],
      },
      {
        title: 'S3 Media Pipeline',
        status: 'In progress',
        description:
          'Automatically processes photos and files as soon as they’re uploaded, and keeps an eye on how well it’s running.',
        image: '',
        imageAlt: '',
        imageLabel: 's3-media-pipeline — diagram',
        link: '',
        featured: false,
        tags: [
          {
            label: 'AWS S3',
            icon: AWS + 'AmazonSimpleStorageService.svg',
          },
          {
            label: 'Lambda',
            icon: AWS + 'AWSLambda.svg',
          },
          {
            label: 'Node.js',
            icon: DEV + 'nodejs/nodejs-original.svg',
          },
        ],
      },
      {
        title: 'Auth & Identity Gateway',
        status: 'Live',
        description:
          'Handles secure sign-in and controls who can see or do what across other apps.',
        image: '',
        imageAlt: '',
        imageLabel: 'auth-gateway — screenshot',
        link: '',
        featured: false,
        tags: [
          {
            label: 'Node.js',
            icon: DEV + 'nodejs/nodejs-original.svg',
          },
          {
            label: 'PostgreSQL',
            icon: DEV + 'postgresql/postgresql-original.svg',
          },
          {
            label: 'REST',
            icon: DEV + 'openapi/openapi-original.svg',
          },
        ],
      },
    ],
  },
  about: {
    heading: 'Meet Daniel',
    avatar: '',
    avatarAlt: 'Portrait of Daniel Ajayi Lotsu',
    avatarInitials: 'DL',
    avatarLabel: 'avatar.png',
    bio: '**Daniel** is a **backend & cloud engineer** at **AmaliTech** who builds **the systems that sit behind apps**: how data is stored, how different apps talk to each other, and how everything **stays online** when lots of people use it at once. He focuses on the kind of quiet engineering that keeps products online and teams shipping. **Building the future of African tech**, one well-provisioned region at a time.',
    tags: ['Backend Engineering', 'Cloud Architecture', 'REST APIs', 'Serverless'],
    facts: [
      {
        label: 'Name',
        value: 'Daniel Ajayi Lotsu',
      },
      {
        label: 'Role',
        value: 'Backend & Cloud Engineer',
      },
      {
        label: 'Based in',
        value: 'Kumasi, Ghana 🇬🇭',
      },
      {
        label: 'Organization',
        value: 'AmaliTech',
      },
      {
        label: 'Status',
        value: 'Available for Hire',
      },
      {
        label: 'Education',
        value: 'BSc CS · Accra Institute of Technology · 2024',
      },
    ],
  },
  marquee: {
    items: [
      'EC2',
      'Lambda',
      'S3',
      'RDS',
      'API Gateway',
      'CloudWatch',
      'Node.js',
      'JavaScript',
      'REST API',
      'PostgreSQL',
      'MySQL',
      'Docker',
      'Git',
      'GitHub',
    ],
  },
  stack: {
    heading: 'Tools I use',
    groups: [
      {
        name: 'Cloud hosting (AWS)',
        items: [
          {
            name: 'EC2',
            icon: AWS + 'AmazonEC2.svg',
            invert: false,
          },
          {
            name: 'Lambda',
            icon: AWS + 'AWSLambda.svg',
            invert: false,
          },
          {
            name: 'S3',
            icon: AWS + 'AmazonSimpleStorageService.svg',
            invert: false,
          },
          {
            name: 'RDS',
            icon: AWS + 'AmazonRDS.svg',
            invert: false,
          },
          {
            name: 'API Gateway',
            icon: AWS + 'AmazonAPIGateway.svg',
            invert: false,
          },
          {
            name: 'CloudWatch',
            icon: AWS + 'AmazonCloudWatch.svg',
            invert: false,
          },
        ],
      },
      {
        name: 'Programming',
        items: [
          {
            name: 'Node.js',
            icon: DEV + 'nodejs/nodejs-original.svg',
            invert: false,
          },
          {
            name: 'JavaScript',
            icon: DEV + 'javascript/javascript-original.svg',
            invert: false,
          },
          {
            name: 'REST API',
            icon: DEV + 'openapi/openapi-original.svg',
            invert: false,
          },
        ],
      },
      {
        name: 'Data & teamwork',
        items: [
          {
            name: 'PostgreSQL',
            icon: DEV + 'postgresql/postgresql-original.svg',
            invert: false,
          },
          {
            name: 'MySQL',
            icon: DEV + 'mysql/mysql-original.svg',
            invert: false,
          },
          {
            name: 'Docker',
            icon: DEV + 'docker/docker-original.svg',
            invert: false,
          },
          {
            name: 'Git',
            icon: DEV + 'git/git-original.svg',
            invert: false,
          },
          {
            name: 'GitHub',
            icon: DEV + 'github/github-original.svg',
            invert: true,
          },
        ],
      },
    ],
  },
  career: {
    heading: 'Career',
    items: [
      {
        time: 'Oct 2025 → Now',
        role: 'Software Engineer',
        org: 'AmaliTech',
        status: 'Current',
        body: 'Building and looking after the systems behind AmaliTech’s internal apps — from how data is stored to how apps connect — and working with product teams from first idea to launch.',
      },
      {
        time: 'Oct 2024 → Sep 2025',
        role: 'Backend Developer (National Service)',
        org: 'AmaliTech',
        status: 'Completed',
        body: 'A national service placement building parts of AmaliTech’s internal systems, getting hands-on with Amazon’s cloud, and earning two AWS certifications along the way.',
      },
      {
        time: '2020 → 2024',
        role: 'BSc Computer Science',
        org: 'Accra Institute of Tech',
        status: 'Graduated',
        body: 'A degree in Computer Science covering how software is designed, built and stored — the foundation for everything I do today.',
      },
    ],
  },
  credentials: {
    heading: 'Certifications & education',
    items: [
      {
        kind: 'Intermediate',
        title: 'AWS Certified Developer',
        org: 'Amazon Web Services',
        year: '2025',
      },
      {
        kind: 'Beginner',
        title: 'AWS Cloud Practitioner',
        org: 'Amazon Web Services',
        year: '2024',
      },
      {
        kind: 'Badge',
        title: 'Data Protection & Disaster Recovery',
        org: 'Amazon Web Services',
        year: '2025',
      },
      {
        kind: 'Degree',
        title: 'BSc Computer Science',
        org: 'Accra Institute of Technology',
        year: '2024',
      },
    ],
  },
  blog: {
    heading: 'Blog',
    subtitle: 'Lessons from building and running software',
    latestLabel: 'Latest',
    readMoreLabel: 'Read post',
    backLabel: 'All posts',
    prevLabel: 'Previous',
    nextLabel: 'Next',
    writtenByLabel: 'Written by',
    ctaLabel: 'Get in touch',
    authorName: 'Daniel Ajayi Lotsu',
    authorRole: 'Backend & Cloud Engineer · AmaliTech',
    authorInitials: 'DL',
    authorPhoto: '',
    posts: [
      {
        slug: 'cold-starts-arent-the-enemy-trimming-lambda-latency-by-60',
        category: 'AWS Lambda',
        title: "Cold starts aren't the enemy — trimming Lambda latency by 60%",
        fullTitle: "Cold starts aren't the enemy — trimming Lambda latency by 60%",
        date: '12 Nov 2025',
        readTime: '6 min',
        excerpt:
          "Everyone panics about cold starts. Here's what actually moved the needle on our serverless APIs — and what turned out to be noise.",
        image: unsplash('photo-1555066931-4365d14bab8c'),
        imageAlt: 'Code on a laptop screen',
        blocks: [
          {
            type: 'paragraph',
            lang: '',
            text: 'When a service feels slow, "cold starts" is the first thing everyone blames. It\'s a real cost — the container spins up, the runtime boots, your dependencies load — but on the leave-management API it turned out to be a small slice of the latency budget. Most of the time was being spent elsewhere, and chasing the wrong number cost me a week.',
          },
          {
            type: 'paragraph',
            lang: '',
            text: 'The biggest win was unglamorous: shrinking the deploy bundle. Every megabyte the runtime has to pull and parse is time on the critical path. Tree-shaking unused SDK clients and importing only the specific AWS modules I needed cut init time roughly in half.',
          },
          {
            type: 'code',
            lang: 'javascript',
            text: '// don\'t drag in the whole SDK\n- import AWS from "aws-sdk";\n// import just the client you call\n+ import { S3Client } from "@aws-sdk/client-s3";',
          },
          {
            type: 'paragraph',
            lang: '',
            text: 'Second: reuse everything you can across invocations. Database clients, secrets, config — initialise them outside the handler so a warm container keeps them alive. And for the handful of latency-sensitive endpoints, provisioned concurrency removed the tail entirely for a predictable cost.',
          },
          {
            type: 'paragraph',
            lang: '',
            text: 'The lesson I keep coming back to: measure before you optimise. CloudWatch and a few well-placed timing logs told me exactly where the milliseconds went — and it was rarely where I assumed.',
          },
        ],
      },
      {
        slug: 'designing-a-leave-management-api-that-scales-quietly',
        category: 'Architecture',
        title: 'Designing a leave-management API that scales quietly',
        fullTitle: 'Designing a leave-management API that scales quietly',
        date: '04 Oct 2025',
        readTime: '8 min',
        excerpt:
          'How splitting a leave system along its natural seams kept it boring, reliable and easy to change.',
        image: unsplash('photo-1558494949-ef010cbdcc31'),
        imageAlt: 'Network cables in a server rack',
        blocks: [
          {
            type: 'paragraph',
            lang: '',
            text: 'A leave-management system looks trivial on a whiteboard: request time off, someone approves it, a balance goes down. The complexity hides in the edges — overlapping requests, approval chains, accrual rules, and notifications that must never fire twice.',
          },
          {
            type: 'paragraph',
            lang: '',
            text: 'I split the system along its natural seams. A request service owns the lifecycle of a leave request; a balance service is the source of truth for entitlements; and events tie them together. When a request is approved, it publishes an event rather than reaching into the balance tables directly — which keeps each service independently deployable and easy to reason about.',
          },
          {
            type: 'paragraph',
            lang: '',
            text: "Idempotency was the decision that saved me the most grief. Every state-changing endpoint accepts an idempotency key, so a retried request from a flaky mobile connection can never double-book a day. It's a small amount of plumbing that removes a whole category of bugs.",
          },
          {
            type: 'paragraph',
            lang: '',
            text: "None of this is exotic. It's boring on purpose — boring systems are the ones that stay online while everyone sleeps.",
          },
        ],
      },
      {
        slug: 'connection-pooling-in-serverless-what-finally-worked',
        category: 'PostgreSQL',
        title: 'Connection pooling in serverless: what finally worked',
        fullTitle: 'Connection pooling in serverless: what finally worked',
        date: '19 Sep 2025',
        readTime: '5 min',
        excerpt:
          'Lambda and Postgres want opposite things. Here is the setup that finally stopped connection exhaustion.',
        image: unsplash('photo-1544383835-bda2bc66a55d'),
        imageAlt: 'Rows of archive drawers, like database records',
        blocks: [
          {
            type: 'paragraph',
            lang: '',
            text: "Relational databases assume long-lived connections. Lambda assumes the opposite — thousands of short-lived containers, each wanting its own connection. Put them together naively and you'll exhaust Postgres's connection limit under the first real traffic spike.",
          },
          {
            type: 'paragraph',
            lang: '',
            text: 'My first instinct was a pool inside each function. That helps within a warm container, but it does nothing about the fleet of containers all opening connections at once. The pool-per-container just multiplied the problem.',
          },
          {
            type: 'code',
            lang: 'javascript',
            text: '// module scope — shared by a warm container\nconst pool = new Pool({ max: 2, idleTimeoutMillis: 30000 });\n\nexport const handler = async (event) => {\n  const client = await pool.connect();\n  try { /* ... */ } finally { client.release(); }\n};',
          },
          {
            type: 'paragraph',
            lang: '',
            text: 'What finally worked was RDS Proxy sitting between Lambda and Postgres. It multiplexes many function connections onto a small, stable set of database connections and handles failover cleanly. Combined with a tiny per-container pool, connection exhaustion simply stopped being something I thought about.',
          },
        ],
      },
      {
        slug: 'from-national-service-to-aws-certified-my-first-year',
        category: 'Career',
        title: 'From National Service to AWS-certified: my first year',
        fullTitle: 'From National Service to AWS-certified: my first year at AmaliTech',
        date: '28 Aug 2025',
        readTime: '4 min',
        excerpt:
          'What compounded fastest in my first year: reading code, studying for the mental model, and staying curious.',
        image: unsplash('photo-1522071820081-009f0129c71c'),
        imageAlt: 'A team working together around laptops',
        blocks: [
          {
            type: 'paragraph',
            lang: '',
            text: "I joined AmaliTech as a national-service backend developer with a computer-science degree and very little production experience. A year later I'd shipped features used across the company and earned two AWS certifications. Here's what compounded fastest.",
          },
          {
            type: 'paragraph',
            lang: '',
            text: 'Reading other people\'s code beat writing my own. Reviewing pull requests taught me the house style, the sharp edges of our systems, and why certain "clever" solutions had been rejected before. It was the fastest way to absorb a codebase I hadn\'t built.',
          },
          {
            type: 'paragraph',
            lang: '',
            text: 'The certifications mattered less for the badge than for the mental model. Studying for the Cloud Practitioner and Developer exams forced me to understand why services fit together — so when I reached for Lambda or RDS at work, I knew the trade-offs instead of copying a tutorial.',
          },
          {
            type: 'paragraph',
            lang: '',
            text: 'Mostly, though, it was showing up curious. Ask the naive question. Own the boring task. The trust that builds is what gets you the interesting problems next.',
          },
        ],
      },
    ],
  },
  contact: {
    pill: '👋 Hello to you too',
    heading: "Let's build something together.",
    body: 'Send me a message and I’ll reply within a day. Whether it’s a role, a project, or just a hello, I’d love to hear from you.',
    email: 'danielajayi100@gmail.com',
    linkedinLabel: 'linkedin.com/in/daniel-lotsu-jnr',
    linkedinUrl: 'https://linkedin.com/in/daniel-lotsu-jnr',
    githubLabel: 'GitHub',
    githubUrl: 'https://github.com',
    location: 'Kumasi, Ghana · Remote friendly',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Email address',
    messagePlaceholder: 'Message',
    submitLabel: 'Send message',
    thanksTitle: 'Thanks, {name}!',
    thanksBody: "Your message is on its way. I'll get back to you within a day.",
  },
  footer: {
    brand: 'daniel.lotsu',
    tagline: 'Reach out and let’s build something great together!',
    linksHeading: 'LINKS',
    elsewhereHeading: 'ELSEWHERE',
    resumeLabel: 'View Resume',
    bigText: 'LOTSU',
    copyright: '© 2025 Daniel Ajayi Lotsu',
    status: '🌍 Kumasi, Ghana · Online',
  },
  resume: {
    eyebrow: 'Curriculum · vitae',
    name: 'Daniel Ajayi Lotsu',
    role: 'Backend & Cloud Engineer',
    email: 'danielajayi100@gmail.com',
    linkedin: 'linkedin.com/in/daniel-lotsu-jnr',
    location: 'Kumasi, Ghana 🇬🇭 · Remote friendly',
    downloadLabel: 'Download PDF',
    closeLabel: 'Close',
    pdf: '',
    summaryTitle: 'Summary',
    summary:
      'Backend & cloud engineer who builds the systems behind apps — storing data, connecting services and keeping everything online on Amazon Web Services. Skilled in REST APIs, data modelling, serverless and containerised services. AWS-certified, currently at AmaliTech in Kumasi, Ghana.',
    experienceTitle: 'Experience',
    jobs: [
      {
        role: 'Software Engineer',
        time: 'Oct 2025 — Present',
        org: 'AmaliTech · Kumasi, Ghana',
        points: [
          'Design and ship REST APIs on AWS that back internal products used across the company.',
          'Model data in PostgreSQL and MySQL — owning migrations, indexing and query performance.',
          'Build serverless (Lambda + API Gateway) and containerised (Docker) workloads with CloudWatch observability.',
          'Partner with product teams across the full delivery lifecycle, from design to deploy.',
        ],
      },
      {
        role: 'Back End Developer · National Service',
        time: 'Oct 2024 — Sep 2025',
        org: 'AmaliTech · Kumasi, Ghana',
        points: [
          'Contributed to internal APIs and services, shipping production features end-to-end.',
          'Gained hands-on AWS experience and earned two AWS certifications during the placement.',
          'Wrote tests, reviewed pull requests and supported deployments alongside senior engineers.',
        ],
      },
    ],
    educationTitle: 'Education',
    education: [
      {
        degree: 'BSc Computer Science',
        time: '2020 — 2024',
        school: 'Accra Institute of Technology',
      },
    ],
    certsTitle: 'Certifications',
    certs: [
      'AWS Certified Developer — Associate · 2025',
      'AWS Certified Cloud Practitioner · 2024',
      'AWS Data Protection & Disaster Recovery · 2025',
    ],
    skillsTitle: 'Technical skills',
    skills: [
      {
        label: 'Cloud & DevOps',
        value: 'AWS · EC2 · Lambda · S3 · RDS · API Gateway · CloudWatch · Docker · Git · GitHub',
      },
      {
        label: 'Backend',
        value: 'Node.js · JavaScript · REST API design',
      },
      {
        label: 'Databases',
        value: 'PostgreSQL · MySQL',
      },
    ],
  },
};
