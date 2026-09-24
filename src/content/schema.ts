import type { SectionId } from '@/lib/validation/content';

/*
 * CMS field schema, ported from SCHEMA in design-source/portfolio-cms.js.
 * It drives the CMS form generator: every section, field, label and list
 * template the editor shows comes from here. The Zod schemas in
 * src/lib/validation/content.ts mirror it one-to-one.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'rich'
  | 'code'
  | 'url'
  | 'email'
  | 'bool'
  | 'select'
  | 'image'
  | 'file'
  | 'list'
  | 'strings';

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

interface BaseField {
  key: string;
  label: string;
  help?: string;
}

export interface ScalarField extends BaseField {
  type: 'text' | 'textarea' | 'rich' | 'code' | 'url' | 'email' | 'bool' | 'strings';
}

export interface SelectField extends BaseField {
  type: 'select';
  options: { v: string; l: string }[];
}

export interface AssetField extends BaseField {
  type: 'image' | 'file';
  accept?: string;
  /** Sibling field holding this image's alt text. */
  altKey?: string;
  /** Logos are shown uncropped. */
  fit?: 'cover' | 'contain';
}

export interface ListField extends BaseField {
  type: 'list';
  itemTitle: string;
  newItem: { [key: string]: Json };
  of: Field[];
}

export type Field = ScalarField | SelectField | AssetField | ListField;

export type CmsIcon =
  | 'globe'
  | 'menu'
  | 'sparkles'
  | 'layout-grid'
  | 'user'
  | 'move-horizontal'
  | 'wrench'
  | 'briefcase'
  | 'award'
  | 'newspaper'
  | 'mail'
  | 'panel-bottom'
  | 'file-text';

export interface SectionDef {
  id: Exclude<SectionId, 'settings'>;
  title: string;
  icon: CmsIcon;
  desc: string;
  /** Anchor on the home page the live preview scrolls to. */
  anchor?: string;
  fields: Field[];
}

const tag: Field[] = [
  { key: 'label', label: 'Label', type: 'text' },
  {
    key: 'icon',
    label: 'Logo',
    type: 'image',
    fit: 'contain',
    help: 'Decorative — the label is read out instead.',
  },
];

export const SCHEMA: SectionDef[] = [
  {
    id: 'site',
    title: 'Site & SEO',
    icon: 'globe',
    desc: 'Browser tab title and search description.',
    fields: [
      { key: 'title', label: 'Page title', type: 'text' },
      { key: 'description', label: 'Search description', type: 'textarea' },
      {
        key: 'ogImage',
        label: 'Social share image (optional)',
        type: 'image',
        help: '1200 × 630 works best. Leave empty to use the generated card.',
      },
    ],
  },
  {
    id: 'nav',
    title: 'Navigation',
    icon: 'menu',
    desc: 'The floating bar at the top of every page.',
    anchor: 'top',
    fields: [
      { key: 'logo', label: 'Logo text', type: 'text' },
      { key: 'home', label: 'Home link', type: 'text' },
      { key: 'contact', label: 'Contact link', type: 'text' },
      { key: 'resume', label: 'Resume link', type: 'text' },
      { key: 'blog', label: 'Blog link', type: 'text' },
      { key: 'availability', label: 'Availability badge', type: 'text' },
      { key: 'showAvailability', label: 'Show availability badge', type: 'bool' },
    ],
  },
  {
    id: 'hero',
    title: 'Hero',
    icon: 'sparkles',
    desc: 'The first thing visitors see.',
    anchor: 'top',
    fields: [
      { key: 'eyebrow', label: 'Small label above name', type: 'text' },
      { key: 'firstName', label: 'First line (name)', type: 'text' },
      { key: 'lastName', label: 'Second line (surname)', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'intro', label: 'Intro paragraph', type: 'textarea' },
      { key: 'primaryLabel', label: 'Primary button', type: 'text' },
      { key: 'secondaryLabel', label: 'Secondary button', type: 'text' },
      {
        key: 'stats',
        label: 'Stats',
        type: 'list',
        itemTitle: 'value',
        newItem: { value: 'New', label: 'Label' },
        of: [
          { key: 'value', label: 'Value', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: 'layout-grid',
    desc: 'Your portfolio of work.',
    anchor: 'projects',
    fields: [
      { key: 'heading', label: 'Section heading', type: 'text' },
      { key: 'buttonLabel', label: 'Button label', type: 'text' },
      { key: 'buttonUrl', label: 'Button link', type: 'url' },
      { key: 'featuredLabel', label: '“Featured” badge text', type: 'text' },
      {
        key: 'items',
        label: 'Projects',
        type: 'list',
        itemTitle: 'title',
        newItem: {
          title: 'New project',
          status: 'Live',
          description: '',
          image: '',
          imageAlt: '',
          imageLabel: 'project screenshot',
          link: '',
          featured: false,
          tags: [],
        },
        of: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'status', label: 'Status', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'image', label: 'Cover image', type: 'image', altKey: 'imageAlt' },
          {
            key: 'imageAlt',
            label: 'Cover image description',
            type: 'text',
            help: 'Describe the image for screen readers. Leave empty to use the title.',
          },
          { key: 'imageLabel', label: 'Placeholder text (when no image)', type: 'text' },
          { key: 'link', label: 'Project link (optional)', type: 'url' },
          { key: 'featured', label: 'Featured', type: 'bool' },
          {
            key: 'tags',
            label: 'Technology tags',
            type: 'list',
            itemTitle: 'label',
            newItem: { label: 'Tag', icon: '' },
            of: tag,
          },
        ],
      },
    ],
  },
  {
    id: 'about',
    title: 'About',
    icon: 'user',
    desc: 'Wrap words in **double asterisks** to make them bold.',
    anchor: 'about',
    fields: [
      { key: 'heading', label: 'Section heading', type: 'text' },
      { key: 'avatar', label: 'Portrait photo', type: 'image', altKey: 'avatarAlt' },
      { key: 'avatarAlt', label: 'Portrait description', type: 'text' },
      { key: 'avatarInitials', label: 'Initials (when no photo)', type: 'text' },
      { key: 'avatarLabel', label: 'Placeholder caption', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'rich' },
      { key: 'tags', label: 'Skill tags', type: 'strings' },
      {
        key: 'facts',
        label: 'Facts',
        type: 'list',
        itemTitle: 'label',
        newItem: { label: 'Label', value: 'Value' },
        of: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'value', label: 'Value', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'marquee',
    title: 'Tech strip',
    icon: 'move-horizontal',
    desc: 'The scrolling band of technologies.',
    anchor: 'about',
    fields: [{ key: 'items', label: 'Words', type: 'strings' }],
  },
  {
    id: 'stack',
    title: 'Tools',
    icon: 'wrench',
    desc: 'Grouped tool tiles with logos.',
    anchor: 'tools',
    fields: [
      { key: 'heading', label: 'Section heading', type: 'text' },
      {
        key: 'groups',
        label: 'Groups',
        type: 'list',
        itemTitle: 'name',
        newItem: { name: 'New group', items: [] },
        of: [
          { key: 'name', label: 'Group name', type: 'text' },
          {
            key: 'items',
            label: 'Tools',
            type: 'list',
            itemTitle: 'name',
            newItem: { name: 'Tool', icon: '', invert: false },
            of: [
              { key: 'name', label: 'Name', type: 'text' },
              {
                key: 'icon',
                label: 'Logo',
                type: 'image',
                fit: 'contain',
                help: 'Decorative — the tool name is read out instead.',
              },
              { key: 'invert', label: 'Invert logo (for dark logos)', type: 'bool' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'career',
    title: 'Career',
    icon: 'briefcase',
    desc: 'Expandable timeline of roles.',
    anchor: 'career',
    fields: [
      { key: 'heading', label: 'Section heading', type: 'text' },
      {
        key: 'items',
        label: 'Roles',
        type: 'list',
        itemTitle: 'role',
        newItem: { time: '', role: 'New role', org: '', status: '', body: '' },
        of: [
          { key: 'time', label: 'Dates', type: 'text' },
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'org', label: 'Organisation', type: 'text' },
          { key: 'status', label: 'Status badge', type: 'text' },
          { key: 'body', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'credentials',
    title: 'Credentials',
    icon: 'award',
    desc: 'Certifications and education.',
    anchor: 'credentials',
    fields: [
      { key: 'heading', label: 'Section heading', type: 'text' },
      {
        key: 'items',
        label: 'Credentials',
        type: 'list',
        itemTitle: 'title',
        newItem: { kind: '', title: 'New credential', org: '', year: '' },
        of: [
          { key: 'kind', label: 'Type', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'org', label: 'Issuer', type: 'text' },
          { key: 'year', label: 'Year', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'blog',
    title: 'Blog',
    icon: 'newspaper',
    desc: 'The first post is shown as the featured “Latest” post.',
    anchor: 'blog',
    fields: [
      { key: 'heading', label: 'Section heading', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      { key: 'latestLabel', label: '“Latest” label', type: 'text' },
      { key: 'readMoreLabel', label: 'Read more label', type: 'text' },
      { key: 'backLabel', label: 'Back button', type: 'text' },
      { key: 'prevLabel', label: 'Previous label', type: 'text' },
      { key: 'nextLabel', label: 'Next label', type: 'text' },
      { key: 'writtenByLabel', label: '“Written by” label', type: 'text' },
      { key: 'ctaLabel', label: 'Post CTA button', type: 'text' },
      { key: 'authorName', label: 'Author name', type: 'text' },
      { key: 'authorRole', label: 'Author role', type: 'text' },
      { key: 'authorInitials', label: 'Author initials', type: 'text' },
      {
        key: 'authorPhoto',
        label: 'Author photo',
        type: 'image',
        help: 'Shown beside the author name, so it needs no description.',
      },
      {
        key: 'posts',
        label: 'Posts',
        type: 'list',
        itemTitle: 'title',
        newItem: {
          slug: 'new-post',
          title: 'New post',
          fullTitle: 'New post',
          category: 'Category',
          date: '',
          readTime: '3 min',
          excerpt: '',
          image: '',
          imageAlt: '',
          blocks: [{ type: 'paragraph', lang: '', text: '' }],
        },
        of: [
          { key: 'title', label: 'Short title (lists)', type: 'text' },
          { key: 'fullTitle', label: 'Full title (article)', type: 'text' },
          {
            key: 'slug',
            label: 'Link (URL)',
            type: 'text',
            help: 'The end of the post’s web address: /blog/your-link. Lowercase letters, numbers and dashes.',
          },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'date', label: 'Date', type: 'text' },
          { key: 'readTime', label: 'Read time', type: 'text' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
          { key: 'image', label: 'Cover image', type: 'image', altKey: 'imageAlt' },
          { key: 'imageAlt', label: 'Image description', type: 'text' },
          {
            key: 'blocks',
            label: 'Article content',
            type: 'list',
            itemTitle: 'type',
            newItem: { type: 'paragraph', lang: '', text: '' },
            of: [
              {
                key: 'type',
                label: 'Block type',
                type: 'select',
                options: [
                  { v: 'paragraph', l: 'Paragraph' },
                  { v: 'code', l: 'Code' },
                ],
              },
              { key: 'lang', label: 'Code language label', type: 'text' },
              { key: 'text', label: 'Text', type: 'code' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: 'mail',
    desc: 'Use {name} in the thank-you title to insert the sender’s first name.',
    anchor: 'contact',
    fields: [
      { key: 'pill', label: 'Small pill', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'linkedinLabel', label: 'LinkedIn label', type: 'text' },
      { key: 'linkedinUrl', label: 'LinkedIn link', type: 'url' },
      { key: 'githubLabel', label: 'GitHub label', type: 'text' },
      { key: 'githubUrl', label: 'GitHub link', type: 'url' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'namePlaceholder', label: 'Name field', type: 'text' },
      { key: 'emailPlaceholder', label: 'Email field', type: 'text' },
      { key: 'messagePlaceholder', label: 'Message field', type: 'text' },
      { key: 'submitLabel', label: 'Submit button', type: 'text' },
      { key: 'thanksTitle', label: 'Thank-you title', type: 'text' },
      { key: 'thanksBody', label: 'Thank-you message', type: 'textarea' },
    ],
  },
  {
    id: 'footer',
    title: 'Footer',
    icon: 'panel-bottom',
    desc: 'Bottom of the page, including the big spotlight word.',
    anchor: 'footer',
    fields: [
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'linksHeading', label: 'Links heading', type: 'text' },
      { key: 'elsewhereHeading', label: 'Elsewhere heading', type: 'text' },
      { key: 'resumeLabel', label: 'Resume button', type: 'text' },
      { key: 'bigText', label: 'Big spotlight word', type: 'text' },
      { key: 'copyright', label: 'Copyright', type: 'text' },
      { key: 'status', label: 'Status line', type: 'text' },
    ],
  },
  {
    id: 'resume',
    title: 'Resume',
    icon: 'file-text',
    desc: 'The resume overlay. Upload a PDF to enable the download button.',
    fields: [
      { key: 'eyebrow', label: 'Small label', type: 'text' },
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'linkedin', label: 'LinkedIn', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'pdf', label: 'Resume PDF', type: 'file', accept: 'application/pdf' },
      { key: 'downloadLabel', label: 'Download button', type: 'text' },
      { key: 'closeLabel', label: 'Close button', type: 'text' },
      { key: 'summaryTitle', label: 'Summary heading', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'experienceTitle', label: 'Experience heading', type: 'text' },
      {
        key: 'jobs',
        label: 'Jobs',
        type: 'list',
        itemTitle: 'role',
        newItem: { role: 'New role', time: '', org: '', points: [] },
        of: [
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'time', label: 'Dates', type: 'text' },
          { key: 'org', label: 'Organisation', type: 'text' },
          { key: 'points', label: 'Bullet points', type: 'strings' },
        ],
      },
      { key: 'educationTitle', label: 'Education heading', type: 'text' },
      {
        key: 'education',
        label: 'Education',
        type: 'list',
        itemTitle: 'degree',
        newItem: { degree: 'Degree', time: '', school: '' },
        of: [
          { key: 'degree', label: 'Degree', type: 'text' },
          { key: 'time', label: 'Dates', type: 'text' },
          { key: 'school', label: 'School', type: 'text' },
        ],
      },
      { key: 'certsTitle', label: 'Certifications heading', type: 'text' },
      { key: 'certs', label: 'Certifications', type: 'strings' },
      { key: 'skillsTitle', label: 'Skills heading', type: 'text' },
      {
        key: 'skills',
        label: 'Skills',
        type: 'list',
        itemTitle: 'label',
        newItem: { label: 'Category', value: '' },
        of: [
          { key: 'label', label: 'Category', type: 'text' },
          { key: 'value', label: 'Skills', type: 'text' },
        ],
      },
    ],
  },
];

export function getSectionDef(id: string): SectionDef | undefined {
  return SCHEMA.find((s) => s.id === id);
}
