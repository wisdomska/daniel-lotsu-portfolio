// Shared content store for the portfolio + CMS. Browser-only (localStorage).
const AWS = 'https://cdn.jsdelivr.net/npm/aws-icons@latest/icons/architecture-service/';
const DEV = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
const UNS = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
const I = {
  ec2: AWS + 'AmazonEC2.svg', lambda: AWS + 'AWSLambda.svg', s3: AWS + 'AmazonSimpleStorageService.svg', rds: AWS + 'AmazonRDS.svg',
  apigw: AWS + 'AmazonAPIGateway.svg', cw: AWS + 'AmazonCloudWatch.svg', node: DEV + 'nodejs/nodejs-original.svg',
  js: DEV + 'javascript/javascript-original.svg', rest: DEV + 'openapi/openapi-original.svg', pg: DEV + 'postgresql/postgresql-original.svg',
  mysql: DEV + 'mysql/mysql-original.svg', docker: DEV + 'docker/docker-original.svg', git: DEV + 'git/git-original.svg', gh: DEV + 'github/github-original.svg',
};

export const KEYS = { content: 'dl-portfolio:content:v1', inbox: 'dl-portfolio:inbox:v1', pass: 'dl-portfolio:passcode', session: 'dl-portfolio:session' };
export const DEFAULT_PASSCODE = 'admin';
export const PORTFOLIO_URL = 'Daniel Portfolio.dc.html';

export const THEMES = [
  { key: 'lime', name: 'Volt Lime', color: '#A3E900', hover: '#8FCC00' },
  { key: 'cyan', name: 'Cyber Cyan', color: '#00E5FF', hover: '#00C4DB' },
  { key: 'magenta', name: 'Hot Magenta', color: '#FF2FD1', hover: '#E011B3' },
  { key: 'orange', name: 'Blaze Orange', color: '#FF7A1A', hover: '#E86400' },
  { key: 'violet', name: 'Ultra Violet', color: '#B57BFF', hover: '#9D57FF' },
];

export const DEFAULTS = {
  settings: { theme: 'lime', customColor: '', projectLayout: 'grid', showMarquee: true, showStars: true },
  site: { title: 'Daniel Ajayi Lotsu — Backend & Cloud Engineer', description: 'Backend & cloud engineer at AmaliTech in Kumasi, Ghana. AWS-certified, architecting scalable cloud-native systems.' },
  nav: { logo: 'daniel.lotsu', home: 'Home', contact: 'Contact', resume: 'Resume', blog: 'Blog', availability: 'Available for work', showAvailability: true },
  hero: {
    eyebrow: 'BACKEND & CLOUD ENGINEER', firstName: 'Daniel', lastName: 'Ajayi Lotsu',
    tagline: '...building the behind-the-scenes systems that keep apps running',
    intro: 'Architecting scalable, cloud-native systems from Kumasi — interconnected services, precisely composed like constellations. AWS-certified, building reliable backends that just stay online.',
    primaryLabel: 'See my work', secondaryLabel: 'Get in touch',
    stats: [
      { value: '2', label: 'AWS Certifications' }, { value: '2+ yrs', label: 'as an engineer' },
      { value: 'BSc', label: 'Computer Science' }, { value: 'Backend Engineer', label: 'at AmaliTech' },
    ],
  },
  projects: {
    heading: 'Things I’ve built', buttonLabel: 'View on GitHub', buttonUrl: 'https://github.com', featuredLabel: 'Featured',
    items: [
      { title: 'Leave Management API', status: 'Live', featured: true, link: '', image: '', imageLabel: 'leave-mgmt-api — screenshot', description: 'A tool that lets AmaliTech staff request time off, get approvals and track their remaining leave days, with automatic notifications.', tags: [{ label: 'Node.js', icon: I.node }, { label: 'AWS Lambda', icon: I.lambda }, { label: 'PostgreSQL', icon: I.pg }, { label: 'API Gateway', icon: I.apigw }] },
      { title: 'Incident Service', status: 'Live', featured: false, link: '', image: '', imageLabel: 'incident-service — screenshot', description: 'A system for logging workplace issues and sending each one to the right team to fix.', tags: [{ label: 'Node.js', icon: I.node }, { label: 'MySQL', icon: I.mysql }, { label: 'Docker', icon: I.docker }] },
      { title: 'S3 Media Pipeline', status: 'In progress', featured: false, link: '', image: '', imageLabel: 's3-media-pipeline — diagram', description: 'Automatically processes photos and files as soon as they’re uploaded, and keeps an eye on how well it’s running.', tags: [{ label: 'AWS S3', icon: I.s3 }, { label: 'Lambda', icon: I.lambda }, { label: 'Node.js', icon: I.node }] },
      { title: 'Auth & Identity Gateway', status: 'Live', featured: false, link: '', image: '', imageLabel: 'auth-gateway — screenshot', description: 'Handles secure sign-in and controls who can see or do what across other apps.', tags: [{ label: 'Node.js', icon: I.node }, { label: 'PostgreSQL', icon: I.pg }, { label: 'REST', icon: I.rest }] },
    ],
  },
  about: {
    heading: 'Meet Daniel', avatar: '', avatarInitials: 'DL', avatarLabel: 'avatar.png',
    bio: '**Daniel** is a **backend & cloud engineer** at **AmaliTech** who builds **the systems that sit behind apps**: how data is stored, how different apps talk to each other, and how everything **stays online** when lots of people use it at once. He focuses on the kind of quiet engineering that keeps products online and teams shipping. **Building the future of African tech**, one well-provisioned region at a time.',
    tags: ['Backend Engineering', 'Cloud Architecture', 'REST APIs', 'Serverless'],
    facts: [
      { label: 'Name', value: 'Daniel Ajayi Lotsu' }, { label: 'Role', value: 'Backend & Cloud Engineer' }, { label: 'Based in', value: 'Kumasi, Ghana 🇬🇭' },
      { label: 'Organization', value: 'AmaliTech' }, { label: 'Status', value: 'Available for Hire' }, { label: 'Education', value: 'BSc CS · Accra Institute of Technology · 2024' },
    ],
  },
  marquee: { items: ['EC2', 'Lambda', 'S3', 'RDS', 'API Gateway', 'CloudWatch', 'Node.js', 'JavaScript', 'REST API', 'PostgreSQL', 'MySQL', 'Docker', 'Git', 'GitHub'] },
  stack: {
    heading: 'Tools I use',
    groups: [
      { name: 'Cloud hosting (AWS)', items: [{ name: 'EC2', icon: I.ec2, invert: false }, { name: 'Lambda', icon: I.lambda, invert: false }, { name: 'S3', icon: I.s3, invert: false }, { name: 'RDS', icon: I.rds, invert: false }, { name: 'API Gateway', icon: I.apigw, invert: false }, { name: 'CloudWatch', icon: I.cw, invert: false }] },
      { name: 'Programming', items: [{ name: 'Node.js', icon: I.node, invert: false }, { name: 'JavaScript', icon: I.js, invert: false }, { name: 'REST API', icon: I.rest, invert: false }] },
      { name: 'Data & teamwork', items: [{ name: 'PostgreSQL', icon: I.pg, invert: false }, { name: 'MySQL', icon: I.mysql, invert: false }, { name: 'Docker', icon: I.docker, invert: false }, { name: 'Git', icon: I.git, invert: false }, { name: 'GitHub', icon: I.gh, invert: true }] },
    ],
  },
  career: {
    heading: 'Career',
    items: [
      { time: 'Oct 2025 → Now', role: 'Software Engineer', org: 'AmaliTech', status: 'Current', body: 'Building and looking after the systems behind AmaliTech’s internal apps — from how data is stored to how apps connect — and working with product teams from first idea to launch.' },
      { time: 'Oct 2024 → Sep 2025', role: 'Backend Developer (National Service)', org: 'AmaliTech', status: 'Completed', body: 'A national service placement building parts of AmaliTech’s internal systems, getting hands-on with Amazon’s cloud, and earning two AWS certifications along the way.' },
      { time: '2020 → 2024', role: 'BSc Computer Science', org: 'Accra Institute of Tech', status: 'Graduated', body: 'A degree in Computer Science covering how software is designed, built and stored — the foundation for everything I do today.' },
    ],
  },
  credentials: {
    heading: 'Certifications & education',
    items: [
      { kind: 'Intermediate', title: 'AWS Certified Developer', org: 'Amazon Web Services', year: '2025' },
      { kind: 'Beginner', title: 'AWS Cloud Practitioner', org: 'Amazon Web Services', year: '2024' },
      { kind: 'Badge', title: 'Data Protection & Disaster Recovery', org: 'Amazon Web Services', year: '2025' },
      { kind: 'Degree', title: 'BSc Computer Science', org: 'Accra Institute of Technology', year: '2024' },
    ],
  },
  blog: {
    heading: 'Blog', subtitle: 'Lessons from building and running software', latestLabel: 'Latest', readMoreLabel: 'Read post',
    backLabel: 'All posts', prevLabel: 'Previous', nextLabel: 'Next', writtenByLabel: 'Written by', ctaLabel: 'Get in touch',
    authorName: 'Daniel Ajayi Lotsu', authorRole: 'Backend & Cloud Engineer · AmaliTech', authorInitials: 'DL', authorPhoto: '',
    posts: [
      { category: 'AWS Lambda', title: "Cold starts aren't the enemy — trimming Lambda latency by 60%", fullTitle: "Cold starts aren't the enemy — trimming Lambda latency by 60%", date: '12 Nov 2025', readTime: '6 min', excerpt: "Everyone panics about cold starts. Here's what actually moved the needle on our serverless APIs — and what turned out to be noise.", image: UNS('photo-1555066931-4365d14bab8c'), imageAlt: 'Code on a laptop screen', blocks: [
        { type: 'paragraph', lang: '', text: "When a service feels slow, \"cold starts\" is the first thing everyone blames. It's a real cost — the container spins up, the runtime boots, your dependencies load — but on the leave-management API it turned out to be a small slice of the latency budget. Most of the time was being spent elsewhere, and chasing the wrong number cost me a week." },
        { type: 'paragraph', lang: '', text: 'The biggest win was unglamorous: shrinking the deploy bundle. Every megabyte the runtime has to pull and parse is time on the critical path. Tree-shaking unused SDK clients and importing only the specific AWS modules I needed cut init time roughly in half.' },
        { type: 'code', lang: 'javascript', text: '// don\'t drag in the whole SDK\n- import AWS from "aws-sdk";\n// import just the client you call\n+ import { S3Client } from "@aws-sdk/client-s3";' },
        { type: 'paragraph', lang: '', text: 'Second: reuse everything you can across invocations. Database clients, secrets, config — initialise them outside the handler so a warm container keeps them alive. And for the handful of latency-sensitive endpoints, provisioned concurrency removed the tail entirely for a predictable cost.' },
        { type: 'paragraph', lang: '', text: 'The lesson I keep coming back to: measure before you optimise. CloudWatch and a few well-placed timing logs told me exactly where the milliseconds went — and it was rarely where I assumed.' }] },
      { category: 'Architecture', title: 'Designing a leave-management API that scales quietly', fullTitle: 'Designing a leave-management API that scales quietly', date: '04 Oct 2025', readTime: '8 min', excerpt: 'How splitting a leave system along its natural seams kept it boring, reliable and easy to change.', image: UNS('photo-1558494949-ef010cbdcc31'), imageAlt: 'Network cables in a server rack', blocks: [
        { type: 'paragraph', lang: '', text: 'A leave-management system looks trivial on a whiteboard: request time off, someone approves it, a balance goes down. The complexity hides in the edges — overlapping requests, approval chains, accrual rules, and notifications that must never fire twice.' },
        { type: 'paragraph', lang: '', text: 'I split the system along its natural seams. A request service owns the lifecycle of a leave request; a balance service is the source of truth for entitlements; and events tie them together. When a request is approved, it publishes an event rather than reaching into the balance tables directly — which keeps each service independently deployable and easy to reason about.' },
        { type: 'paragraph', lang: '', text: "Idempotency was the decision that saved me the most grief. Every state-changing endpoint accepts an idempotency key, so a retried request from a flaky mobile connection can never double-book a day. It's a small amount of plumbing that removes a whole category of bugs." },
        { type: 'paragraph', lang: '', text: "None of this is exotic. It's boring on purpose — boring systems are the ones that stay online while everyone sleeps." }] },
      { category: 'PostgreSQL', title: 'Connection pooling in serverless: what finally worked', fullTitle: 'Connection pooling in serverless: what finally worked', date: '19 Sep 2025', readTime: '5 min', excerpt: 'Lambda and Postgres want opposite things. Here is the setup that finally stopped connection exhaustion.', image: UNS('photo-1544383835-bda2bc66a55d'), imageAlt: 'Rows of archive drawers, like database records', blocks: [
        { type: 'paragraph', lang: '', text: "Relational databases assume long-lived connections. Lambda assumes the opposite — thousands of short-lived containers, each wanting its own connection. Put them together naively and you'll exhaust Postgres's connection limit under the first real traffic spike." },
        { type: 'paragraph', lang: '', text: 'My first instinct was a pool inside each function. That helps within a warm container, but it does nothing about the fleet of containers all opening connections at once. The pool-per-container just multiplied the problem.' },
        { type: 'code', lang: 'javascript', text: '// module scope — shared by a warm container\nconst pool = new Pool({ max: 2, idleTimeoutMillis: 30000 });\n\nexport const handler = async (event) => {\n  const client = await pool.connect();\n  try { /* ... */ } finally { client.release(); }\n};' },
        { type: 'paragraph', lang: '', text: 'What finally worked was RDS Proxy sitting between Lambda and Postgres. It multiplexes many function connections onto a small, stable set of database connections and handles failover cleanly. Combined with a tiny per-container pool, connection exhaustion simply stopped being something I thought about.' }] },
      { category: 'Career', title: 'From National Service to AWS-certified: my first year', fullTitle: 'From National Service to AWS-certified: my first year at AmaliTech', date: '28 Aug 2025', readTime: '4 min', excerpt: 'What compounded fastest in my first year: reading code, studying for the mental model, and staying curious.', image: UNS('photo-1522071820081-009f0129c71c'), imageAlt: 'A team working together around laptops', blocks: [
        { type: 'paragraph', lang: '', text: "I joined AmaliTech as a national-service backend developer with a computer-science degree and very little production experience. A year later I'd shipped features used across the company and earned two AWS certifications. Here's what compounded fastest." },
        { type: 'paragraph', lang: '', text: "Reading other people's code beat writing my own. Reviewing pull requests taught me the house style, the sharp edges of our systems, and why certain \"clever\" solutions had been rejected before. It was the fastest way to absorb a codebase I hadn't built." },
        { type: 'paragraph', lang: '', text: 'The certifications mattered less for the badge than for the mental model. Studying for the Cloud Practitioner and Developer exams forced me to understand why services fit together — so when I reached for Lambda or RDS at work, I knew the trade-offs instead of copying a tutorial.' },
        { type: 'paragraph', lang: '', text: 'Mostly, though, it was showing up curious. Ask the naive question. Own the boring task. The trust that builds is what gets you the interesting problems next.' }] },
    ],
  },
  contact: {
    pill: '👋 Hello to you too', heading: "Let's build something together.",
    body: 'Send me a message and I’ll reply within a day. Whether it’s a role, a project, or just a hello, I’d love to hear from you.',
    email: 'daniel.lotsu.jnr@gmail.com', linkedinLabel: 'linkedin.com/in/daniel-lotsu-jnr', linkedinUrl: 'https://linkedin.com/in/daniel-lotsu-jnr',
    githubLabel: 'GitHub', githubUrl: 'https://github.com', location: 'Kumasi, Ghana · Remote friendly',
    namePlaceholder: 'Your name', emailPlaceholder: 'Email address', messagePlaceholder: 'Message', submitLabel: 'Send message',
    thanksTitle: 'Thanks, {name}!', thanksBody: "Your message is on its way. I'll get back to you within a day.",
  },
  footer: {
    brand: 'daniel.lotsu', tagline: 'Reach out and let’s build something great together!', linksHeading: 'LINKS', elsewhereHeading: 'ELSEWHERE',
    resumeLabel: 'View Resume', bigText: 'LOTSU', copyright: '© 2025 Daniel Ajayi Lotsu', status: '🌍 Kumasi, Ghana · Online',
  },
  resume: {
    eyebrow: 'Curriculum · vitae', name: 'Daniel Ajayi Lotsu', role: 'Backend & Cloud Engineer',
    email: 'daniel.lotsu.jnr@gmail.com', linkedin: 'linkedin.com/in/daniel-lotsu-jnr', location: 'Kumasi, Ghana 🇬🇭 · Remote friendly',
    downloadLabel: 'Download PDF', closeLabel: 'Close', pdf: '',
    summaryTitle: 'Summary', summary: 'Backend & cloud engineer who builds the systems behind apps — storing data, connecting services and keeping everything online on Amazon Web Services. Skilled in REST APIs, data modelling, serverless and containerised services. AWS-certified, currently at AmaliTech in Kumasi, Ghana.',
    experienceTitle: 'Experience',
    jobs: [
      { role: 'Software Engineer', time: 'Oct 2025 — Present', org: 'AmaliTech · Kumasi, Ghana', points: ['Design and ship REST APIs on AWS that back internal products used across the company.', 'Model data in PostgreSQL and MySQL — owning migrations, indexing and query performance.', 'Build serverless (Lambda + API Gateway) and containerised (Docker) workloads with CloudWatch observability.', 'Partner with product teams across the full delivery lifecycle, from design to deploy.'] },
      { role: 'Back End Developer · National Service', time: 'Oct 2024 — Sep 2025', org: 'AmaliTech · Kumasi, Ghana', points: ['Contributed to internal APIs and services, shipping production features end-to-end.', 'Gained hands-on AWS experience and earned two AWS certifications during the placement.', 'Wrote tests, reviewed pull requests and supported deployments alongside senior engineers.'] },
    ],
    educationTitle: 'Education', education: [{ degree: 'BSc Computer Science', time: '2020 — 2024', school: 'Accra Institute of Technology' }],
    certsTitle: 'Certifications', certs: ['AWS Certified Developer — Associate · 2025', 'AWS Certified Cloud Practitioner · 2024', 'AWS Data Protection & Disaster Recovery · 2025'],
    skillsTitle: 'Technical skills',
    skills: [
      { label: 'Cloud & DevOps', value: 'AWS · EC2 · Lambda · S3 · RDS · API Gateway · CloudWatch · Docker · Git · GitHub' },
      { label: 'Backend', value: 'Node.js · JavaScript · REST API design' },
      { label: 'Databases', value: 'PostgreSQL · MySQL' },
    ],
  },
};

// Field schema drives the CMS editor. Types: text, textarea, rich, code, image, file, url, bool, select, list, strings
const tag = [{ key: 'label', label: 'Label', type: 'text' }, { key: 'icon', label: 'Logo', type: 'image' }];
export const SCHEMA = [
  { id: 'site', title: 'Site & SEO', icon: 'globe', desc: 'Browser tab title and search description.', fields: [
    { key: 'title', label: 'Page title', type: 'text' }, { key: 'description', label: 'Search description', type: 'textarea' }] },
  { id: 'nav', title: 'Navigation', icon: 'menu', desc: 'The floating bar at the top of every page.', fields: [
    { key: 'logo', label: 'Logo text', type: 'text' }, { key: 'home', label: 'Home link', type: 'text' }, { key: 'contact', label: 'Contact link', type: 'text' },
    { key: 'resume', label: 'Resume link', type: 'text' }, { key: 'blog', label: 'Blog link', type: 'text' },
    { key: 'availability', label: 'Availability badge', type: 'text' }, { key: 'showAvailability', label: 'Show availability badge', type: 'bool' }] },
  { id: 'hero', title: 'Hero', icon: 'sparkles', desc: 'The first thing visitors see.', fields: [
    { key: 'eyebrow', label: 'Small label above name', type: 'text' }, { key: 'firstName', label: 'First line (name)', type: 'text' }, { key: 'lastName', label: 'Second line (surname)', type: 'text' },
    { key: 'tagline', label: 'Tagline', type: 'text' }, { key: 'intro', label: 'Intro paragraph', type: 'textarea' },
    { key: 'primaryLabel', label: 'Primary button', type: 'text' }, { key: 'secondaryLabel', label: 'Secondary button', type: 'text' },
    { key: 'stats', label: 'Stats', type: 'list', itemTitle: 'value', newItem: { value: 'New', label: 'Label' }, of: [{ key: 'value', label: 'Value', type: 'text' }, { key: 'label', label: 'Label', type: 'text' }] }] },
  { id: 'projects', title: 'Projects', icon: 'layout-grid', desc: 'Your portfolio of work.', fields: [
    { key: 'heading', label: 'Section heading', type: 'text' }, { key: 'buttonLabel', label: 'Button label', type: 'text' }, { key: 'buttonUrl', label: 'Button link', type: 'url' },
    { key: 'featuredLabel', label: '“Featured” badge text', type: 'text' },
    { key: 'items', label: 'Projects', type: 'list', itemTitle: 'title', newItem: { title: 'New project', status: 'Live', featured: false, link: '', image: '', imageLabel: 'project screenshot', description: '', tags: [] }, of: [
      { key: 'title', label: 'Title', type: 'text' }, { key: 'status', label: 'Status', type: 'text' }, { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'image', label: 'Cover image', type: 'image' }, { key: 'imageLabel', label: 'Placeholder text (when no image)', type: 'text' },
      { key: 'link', label: 'Project link (optional)', type: 'url' }, { key: 'featured', label: 'Featured', type: 'bool' },
      { key: 'tags', label: 'Technology tags', type: 'list', itemTitle: 'label', newItem: { label: 'Tag', icon: '' }, of: tag }] }] },
  { id: 'about', title: 'About', icon: 'user', desc: 'Wrap words in **double asterisks** to make them bold.', fields: [
    { key: 'heading', label: 'Section heading', type: 'text' }, { key: 'avatar', label: 'Portrait photo', type: 'image' },
    { key: 'avatarInitials', label: 'Initials (when no photo)', type: 'text' }, { key: 'avatarLabel', label: 'Placeholder caption', type: 'text' },
    { key: 'bio', label: 'Bio', type: 'rich' }, { key: 'tags', label: 'Skill tags', type: 'strings' },
    { key: 'facts', label: 'Facts', type: 'list', itemTitle: 'label', newItem: { label: 'Label', value: 'Value' }, of: [{ key: 'label', label: 'Label', type: 'text' }, { key: 'value', label: 'Value', type: 'text' }] }] },
  { id: 'marquee', title: 'Tech strip', icon: 'move-horizontal', desc: 'The scrolling band of technologies.', fields: [{ key: 'items', label: 'Words', type: 'strings' }] },
  { id: 'stack', title: 'Tools', icon: 'wrench', desc: 'Grouped tool tiles with logos.', fields: [
    { key: 'heading', label: 'Section heading', type: 'text' },
    { key: 'groups', label: 'Groups', type: 'list', itemTitle: 'name', newItem: { name: 'New group', items: [] }, of: [
      { key: 'name', label: 'Group name', type: 'text' },
      { key: 'items', label: 'Tools', type: 'list', itemTitle: 'name', newItem: { name: 'Tool', icon: '', invert: false }, of: [
        { key: 'name', label: 'Name', type: 'text' }, { key: 'icon', label: 'Logo', type: 'image' }, { key: 'invert', label: 'Invert logo (for dark logos)', type: 'bool' }] }] }] },
  { id: 'career', title: 'Career', icon: 'briefcase', desc: 'Expandable timeline of roles.', fields: [
    { key: 'heading', label: 'Section heading', type: 'text' },
    { key: 'items', label: 'Roles', type: 'list', itemTitle: 'role', newItem: { time: '', role: 'New role', org: '', status: '', body: '' }, of: [
      { key: 'time', label: 'Dates', type: 'text' }, { key: 'role', label: 'Role', type: 'text' }, { key: 'org', label: 'Organisation', type: 'text' },
      { key: 'status', label: 'Status badge', type: 'text' }, { key: 'body', label: 'Description', type: 'textarea' }] }] },
  { id: 'credentials', title: 'Credentials', icon: 'award', desc: 'Certifications and education.', fields: [
    { key: 'heading', label: 'Section heading', type: 'text' },
    { key: 'items', label: 'Credentials', type: 'list', itemTitle: 'title', newItem: { kind: '', title: 'New credential', org: '', year: '' }, of: [
      { key: 'kind', label: 'Type', type: 'text' }, { key: 'title', label: 'Title', type: 'text' }, { key: 'org', label: 'Issuer', type: 'text' }, { key: 'year', label: 'Year', type: 'text' }] }] },
  { id: 'blog', title: 'Blog', icon: 'newspaper', desc: 'The first post is shown as the featured “Latest” post.', fields: [
    { key: 'heading', label: 'Section heading', type: 'text' }, { key: 'subtitle', label: 'Subtitle', type: 'text' },
    { key: 'latestLabel', label: '“Latest” label', type: 'text' }, { key: 'readMoreLabel', label: 'Read more label', type: 'text' },
    { key: 'backLabel', label: 'Back button', type: 'text' }, { key: 'prevLabel', label: 'Previous label', type: 'text' }, { key: 'nextLabel', label: 'Next label', type: 'text' },
    { key: 'writtenByLabel', label: '“Written by” label', type: 'text' }, { key: 'ctaLabel', label: 'Post CTA button', type: 'text' },
    { key: 'authorName', label: 'Author name', type: 'text' }, { key: 'authorRole', label: 'Author role', type: 'text' },
    { key: 'authorInitials', label: 'Author initials', type: 'text' }, { key: 'authorPhoto', label: 'Author photo', type: 'image' },
    { key: 'posts', label: 'Posts', type: 'list', itemTitle: 'title', newItem: { category: 'Category', title: 'New post', fullTitle: 'New post', date: '', readTime: '3 min', excerpt: '', image: '', imageAlt: '', blocks: [{ type: 'paragraph', lang: '', text: '' }] }, of: [
      { key: 'title', label: 'Short title (lists)', type: 'text' }, { key: 'fullTitle', label: 'Full title (article)', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' }, { key: 'date', label: 'Date', type: 'text' }, { key: 'readTime', label: 'Read time', type: 'text' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' }, { key: 'image', label: 'Cover image', type: 'image' }, { key: 'imageAlt', label: 'Image description', type: 'text' },
      { key: 'blocks', label: 'Article content', type: 'list', itemTitle: 'type', newItem: { type: 'paragraph', lang: '', text: '' }, of: [
        { key: 'type', label: 'Block type', type: 'select', options: [{ v: 'paragraph', l: 'Paragraph' }, { v: 'code', l: 'Code' }] },
        { key: 'lang', label: 'Code language label', type: 'text' }, { key: 'text', label: 'Text', type: 'code' }] }] }] },
  { id: 'contact', title: 'Contact', icon: 'mail', desc: 'Use {name} in the thank-you title to insert the sender’s first name.', fields: [
    { key: 'pill', label: 'Small pill', type: 'text' }, { key: 'heading', label: 'Heading', type: 'text' }, { key: 'body', label: 'Body', type: 'textarea' },
    { key: 'email', label: 'Email', type: 'text' }, { key: 'linkedinLabel', label: 'LinkedIn label', type: 'text' }, { key: 'linkedinUrl', label: 'LinkedIn link', type: 'url' },
    { key: 'githubLabel', label: 'GitHub label', type: 'text' }, { key: 'githubUrl', label: 'GitHub link', type: 'url' }, { key: 'location', label: 'Location', type: 'text' },
    { key: 'namePlaceholder', label: 'Name field', type: 'text' }, { key: 'emailPlaceholder', label: 'Email field', type: 'text' }, { key: 'messagePlaceholder', label: 'Message field', type: 'text' },
    { key: 'submitLabel', label: 'Submit button', type: 'text' }, { key: 'thanksTitle', label: 'Thank-you title', type: 'text' }, { key: 'thanksBody', label: 'Thank-you message', type: 'textarea' }] },
  { id: 'footer', title: 'Footer', icon: 'panel-bottom', desc: 'Bottom of the page, including the big spotlight word.', fields: [
    { key: 'brand', label: 'Brand', type: 'text' }, { key: 'tagline', label: 'Tagline', type: 'text' }, { key: 'linksHeading', label: 'Links heading', type: 'text' },
    { key: 'elsewhereHeading', label: 'Elsewhere heading', type: 'text' }, { key: 'resumeLabel', label: 'Resume button', type: 'text' },
    { key: 'bigText', label: 'Big spotlight word', type: 'text' }, { key: 'copyright', label: 'Copyright', type: 'text' }, { key: 'status', label: 'Status line', type: 'text' }] },
  { id: 'resume', title: 'Resume', icon: 'file-text', desc: 'The resume overlay. Upload a PDF to enable the download button.', fields: [
    { key: 'eyebrow', label: 'Small label', type: 'text' }, { key: 'name', label: 'Name', type: 'text' }, { key: 'role', label: 'Role', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' }, { key: 'linkedin', label: 'LinkedIn', type: 'text' }, { key: 'location', label: 'Location', type: 'text' },
    { key: 'pdf', label: 'Resume PDF', type: 'file', accept: 'application/pdf' }, { key: 'downloadLabel', label: 'Download button', type: 'text' }, { key: 'closeLabel', label: 'Close button', type: 'text' },
    { key: 'summaryTitle', label: 'Summary heading', type: 'text' }, { key: 'summary', label: 'Summary', type: 'textarea' },
    { key: 'experienceTitle', label: 'Experience heading', type: 'text' },
    { key: 'jobs', label: 'Jobs', type: 'list', itemTitle: 'role', newItem: { role: 'New role', time: '', org: '', points: [] }, of: [
      { key: 'role', label: 'Role', type: 'text' }, { key: 'time', label: 'Dates', type: 'text' }, { key: 'org', label: 'Organisation', type: 'text' }, { key: 'points', label: 'Bullet points', type: 'strings' }] },
    { key: 'educationTitle', label: 'Education heading', type: 'text' },
    { key: 'education', label: 'Education', type: 'list', itemTitle: 'degree', newItem: { degree: 'Degree', time: '', school: '' }, of: [
      { key: 'degree', label: 'Degree', type: 'text' }, { key: 'time', label: 'Dates', type: 'text' }, { key: 'school', label: 'School', type: 'text' }] },
    { key: 'certsTitle', label: 'Certifications heading', type: 'text' }, { key: 'certs', label: 'Certifications', type: 'strings' },
    { key: 'skillsTitle', label: 'Skills heading', type: 'text' },
    { key: 'skills', label: 'Skills', type: 'list', itemTitle: 'label', newItem: { label: 'Category', value: '' }, of: [{ key: 'label', label: 'Category', type: 'text' }, { key: 'value', label: 'Skills', type: 'text' }] }] },
];

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
export function merge(base, over) {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = isObj(base[k]) && isObj(over[k]) ? merge(base[k], over[k]) : over[k];
  return out;
}
export const clone = (o) => JSON.parse(JSON.stringify(o));
export function load() {
  try { const raw = localStorage.getItem(KEYS.content); return raw ? merge(clone(DEFAULTS), JSON.parse(raw)) : clone(DEFAULTS); }
  catch (e) { return clone(DEFAULTS); }
}
export function save(content) { localStorage.setItem(KEYS.content, JSON.stringify(content)); }
export function reset() { localStorage.removeItem(KEYS.content); }
export function storageBytes() { let n = 0; for (const k of Object.values(KEYS)) { const v = localStorage.getItem(k); if (v) n += v.length * 2; } return n; }

export function theme(content) {
  const s = (content && content.settings) || {};
  if (s.theme === 'custom' && /^#[0-9a-f]{6}$/i.test(s.customColor || '')) return { key: 'custom', name: 'Custom', color: s.customColor, hover: shade(s.customColor, -0.12) };
  return THEMES.find((t) => t.key === s.theme) || THEMES[0];
}
export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16); const f = (c) => Math.max(0, Math.min(255, Math.round(c + (amt < 0 ? c * amt : (255 - c) * amt))));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
export function hexToRgb(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
export function applyTheme(content, el = document.documentElement) {
  const t = theme(content); el.style.setProperty('--pri', t.color); el.style.setProperty('--prih', t.hover); return t;
}

export function getInbox() { try { return JSON.parse(localStorage.getItem(KEYS.inbox) || '[]'); } catch (e) { return []; } }
export function setInbox(list) { localStorage.setItem(KEYS.inbox, JSON.stringify(list)); }
export function addMessage(msg) { const l = getInbox(); l.unshift({ id: Date.now() + '-' + Math.random().toString(36).slice(2, 7), date: new Date().toISOString(), read: false, ...msg }); setInbox(l); }

export function getPasscode() { return localStorage.getItem(KEYS.pass) || DEFAULT_PASSCODE; }
export function setPasscode(p) { localStorage.setItem(KEYS.pass, p); }
export function isAuthed() { return sessionStorage.getItem(KEYS.session) === '1'; }
export function login(p) { if (p === getPasscode()) { sessionStorage.setItem(KEYS.session, '1'); return true; } return false; }
export function logout() { sessionStorage.removeItem(KEYS.session); }

// Downscale an image file to a JPEG/PNG data URL so it fits in browser storage.
export function fileToDataUrl(file, maxW = 1600) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => {
      if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') return resolve(r.result);
      const img = new Image();
      img.onload = () => {
        const s = Math.min(1, maxW / img.width); const c = document.createElement('canvas');
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(file.type === 'image/png' ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(r.result);
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

// Parse **bold** into segments.
export function richSegments(text) {
  const out = []; String(text || '').split(/(\*\*[^*]+\*\*)/g).forEach((p) => { if (!p) return; const b = /^\*\*[^*]+\*\*$/.test(p); out.push({ text: b ? p.slice(2, -2) : p, bold: b }); });
  return out;
}
