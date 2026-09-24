import { z } from 'zod';
import { HEX_RE, THEME_KEYS } from '@/content/themes';

/*
 * Zod schemas for every CMS section. These mirror src/content/schema.ts field
 * for field (a unit test enforces that), and are the single source of the
 * content types used across the app via z.infer.
 */

const text = (max = 300) => z.string().trim().max(max);
const longText = (max = 8000) => z.string().max(max);

/** Only **bold** is allowed in rich text, so strip anything that looks like HTML. */
const rich = (max = 8000) =>
  z
    .string()
    .max(max)
    .transform((s) => s.replace(/<\/?[a-z][^>]*>/gi, ''));

const isSafeHref = (v: string) => {
  if (v === '' || v.startsWith('/') || v.startsWith('#')) return true;
  try {
    return ['http:', 'https:', 'mailto:'].includes(new URL(v).protocol);
  } catch {
    return false;
  }
};

export const urlField = z
  .string()
  .trim()
  .max(2048)
  .refine(isSafeHref, 'Enter a full link starting with https://');

/** Images and files: empty, an https URL (Vercel Blob or CDN), or a site-relative path. */
export const assetField = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => v === '' || v.startsWith('/') || /^https:\/\//.test(v), 'Must be an https link');

const email = z.union([z.literal(''), z.email('Enter a valid email address').max(254)]);

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const settingsSchema = z.object({
  theme: z.enum([...THEME_KEYS, 'custom']),
  customColor: z.union([z.literal(''), z.string().regex(HEX_RE, 'Use a hex colour like #A3E900')]),
  projectLayout: z.enum(['grid', 'list']),
  showMarquee: z.boolean(),
  showStars: z.boolean(),
});

export const siteSchema = z.object({
  title: text(120),
  description: text(320),
  ogImage: assetField,
});

export const navSchema = z.object({
  logo: text(60),
  home: text(40),
  contact: text(40),
  resume: text(40),
  blog: text(40),
  availability: text(60),
  showAvailability: z.boolean(),
});

const statSchema = z.object({ value: text(40), label: text(80) });

export const heroSchema = z.object({
  eyebrow: text(80),
  firstName: text(60),
  lastName: text(80),
  tagline: text(200),
  intro: longText(1000),
  primaryLabel: text(40),
  secondaryLabel: text(40),
  stats: z.array(statSchema).max(8),
});

const tagSchema = z.object({ label: text(40), icon: assetField });

const projectSchema = z.object({
  title: text(100),
  status: text(40),
  description: longText(1000),
  image: assetField,
  imageAlt: text(200),
  imageLabel: text(100),
  link: urlField,
  featured: z.boolean(),
  tags: z.array(tagSchema).max(12),
});

export const projectsSchema = z.object({
  heading: text(100),
  buttonLabel: text(40),
  buttonUrl: urlField,
  featuredLabel: text(30),
  items: z.array(projectSchema).max(40),
});

const factSchema = z.object({ label: text(40), value: text(120) });

export const aboutSchema = z.object({
  heading: text(100),
  avatar: assetField,
  avatarAlt: text(200),
  avatarInitials: text(4),
  avatarLabel: text(60),
  bio: rich(3000),
  tags: z.array(text(40)).max(20),
  facts: z.array(factSchema).max(20),
});

export const marqueeSchema = z.object({ items: z.array(text(40)).max(40) });

const toolSchema = z.object({ name: text(40), icon: assetField, invert: z.boolean() });
const toolGroupSchema = z.object({ name: text(60), items: z.array(toolSchema).max(30) });

export const stackSchema = z.object({
  heading: text(100),
  groups: z.array(toolGroupSchema).max(10),
});

const roleSchema = z.object({
  time: text(60),
  role: text(100),
  org: text(100),
  status: text(30),
  body: longText(2000),
});

export const careerSchema = z.object({ heading: text(100), items: z.array(roleSchema).max(20) });

const credentialSchema = z.object({
  kind: text(40),
  title: text(120),
  org: text(100),
  year: text(20),
});

export const credentialsSchema = z.object({
  heading: text(100),
  items: z.array(credentialSchema).max(30),
});

const blockSchema = z.object({
  type: z.enum(['paragraph', 'code']),
  lang: text(30),
  text: longText(20000),
});

const postSchema = z.object({
  slug: z.string().trim().max(80).regex(SLUG_RE, 'Use lowercase letters, numbers and dashes'),
  title: text(160),
  fullTitle: text(200),
  category: text(40),
  date: text(40),
  readTime: text(20),
  excerpt: longText(600),
  image: assetField,
  imageAlt: text(200),
  blocks: z.array(blockSchema).min(1).max(200),
});

export const blogSchema = z
  .object({
    heading: text(100),
    subtitle: text(160),
    latestLabel: text(30),
    readMoreLabel: text(30),
    backLabel: text(30),
    prevLabel: text(30),
    nextLabel: text(30),
    writtenByLabel: text(30),
    ctaLabel: text(30),
    authorName: text(80),
    authorRole: text(120),
    authorInitials: text(4),
    authorPhoto: assetField,
    posts: z.array(postSchema).max(100),
  })
  .superRefine((blog, ctx) => {
    const seen = new Set<string>();
    blog.posts.forEach((p, i) => {
      if (seen.has(p.slug)) {
        ctx.addIssue({
          code: 'custom',
          path: ['posts', i, 'slug'],
          message: `Another post already uses the link “${p.slug}”`,
        });
      }
      seen.add(p.slug);
    });
  });

export const contactSchema = z.object({
  heading: text(120),
  body: longText(600),
  email,
  linkedinLabel: text(80),
  linkedinUrl: urlField,
  githubLabel: text(60),
  githubUrl: urlField,
  location: text(100),
  namePlaceholder: text(40),
  emailPlaceholder: text(40),
  messagePlaceholder: text(40),
  submitLabel: text(40),
  thanksTitle: text(80),
  thanksBody: longText(400),
});

export const footerSchema = z.object({
  brand: text(60),
  tagline: text(160),
  linksHeading: text(30),
  elsewhereHeading: text(30),
  resumeLabel: text(40),
  bigText: text(12),
  copyright: text(100),
  status: text(100),
});

const jobSchema = z.object({
  role: text(100),
  time: text(60),
  org: text(100),
  points: z.array(text(400)).max(12),
});
const educationSchema = z.object({ degree: text(100), time: text(40), school: text(120) });
const skillSchema = z.object({ label: text(60), value: text(400) });

export const resumeSchema = z.object({
  eyebrow: text(60),
  name: text(80),
  role: text(100),
  email,
  linkedin: text(100),
  location: text(100),
  pdf: assetField,
  downloadLabel: text(40),
  closeLabel: text(30),
  summaryTitle: text(40),
  summary: longText(2000),
  experienceTitle: text(40),
  jobs: z.array(jobSchema).max(12),
  educationTitle: text(40),
  education: z.array(educationSchema).max(8),
  certsTitle: text(40),
  certs: z.array(text(200)).max(20),
  skillsTitle: text(40),
  skills: z.array(skillSchema).max(12),
});

export const SECTION_SCHEMAS = {
  settings: settingsSchema,
  site: siteSchema,
  nav: navSchema,
  hero: heroSchema,
  projects: projectsSchema,
  about: aboutSchema,
  marquee: marqueeSchema,
  stack: stackSchema,
  career: careerSchema,
  credentials: credentialsSchema,
  blog: blogSchema,
  contact: contactSchema,
  footer: footerSchema,
  resume: resumeSchema,
} as const;

export type SectionId = keyof typeof SECTION_SCHEMAS;
export const SECTION_IDS = Object.keys(SECTION_SCHEMAS) as SectionId[];

export const contentSchema = z.object(SECTION_SCHEMAS);

export type Content = z.infer<typeof contentSchema>;
export type SectionContent<S extends SectionId> = Content[S];
export type Settings = Content['settings'];
export type Project = Content['projects']['items'][number];
export type Post = Content['blog']['posts'][number];
export type Block = Post['blocks'][number];

export function isSectionId(v: string): v is SectionId {
  return (SECTION_IDS as string[]).includes(v);
}

/** Backup file format produced by "Export backup" and accepted by "Import backup". */
export const backupSchema = z.object({
  format: z.literal('daniel-lotsu-portfolio-backup'),
  version: z.literal(1),
  exportedAt: z.string(),
  content: contentSchema,
});
export type Backup = z.infer<typeof backupSchema>;
