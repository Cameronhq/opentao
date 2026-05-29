// Chapter registry. Stub pages render from this directly; rich chapter pages
// (rich === true, e.g. tokyo) live as their own .astro files and take
// precedence — they're filtered out of the dynamic [slug].astro route.

export interface Chapter {
  slug: string;
  city: string;
  flag: string;
  region: string;
  hosts: string;
  since: string;       // e.g. "2025-09"
  events: string;      // e.g. "12 hosted"
  members: string;     // e.g. "412"
  language?: string;   // e.g. "中文"
  blurb: string;       // short description
  rich?: boolean;      // true = its own .astro file, skipped by [slug].astro
}

export const chapters: Chapter[] = [
  { slug: 'tokyo',         city: 'Tokyo',         flag: '🇯🇵', region: 'Asia · Japan',         hosts: '@yuki + @takahiro', since: '2025-09', events: '12 hosted', members: '412',  blurb: 'The flagship East-Asia chapter. Monthly meetups in Shibuya, occasional weekend hackathons.', rich: true },
  { slug: 'san-francisco', city: 'San Francisco', flag: '🇺🇸', region: 'North America · USA',  hosts: '@ke.ng + 2 more',   since: '2025-06', events: '18 hosted', members: '1,108', blurb: 'The largest chapter by headcount. Workshops at the Mission, demo nights co-hosted with three other AI groups.' },
  { slug: 'berlin',        city: 'Berlin',        flag: '🇩🇪', region: 'Europe · Germany',     hosts: '@carlos',           since: '2025-11', events: '6 hosted',  members: '526',  blurb: 'Kreuzberg-based. BBQ-and-talks format in summer, indoor fireside chats in winter.' },
  { slug: 'singapore',     city: 'Singapore',     flag: '🇸🇬', region: 'Asia · Singapore',     hosts: '@wei',              since: '2025-10', events: '5 hosted',  members: '308',  blurb: 'APAC validator hub. Heavy on infrastructure operators, staking economics, validator tooling.' },
  { slug: 'shenzhen',      city: 'Shenzhen',     flag: '🇨🇳', region: 'Asia · China',         hosts: '@chen',             since: '2026-01', events: '3 hosted',  members: '144',  language: '中文', blurb: '华南区中文社区。聚焦矿工实操、硬件配置、补贴政策。每月线下技术分享。' },
  { slug: 'new-york',      city: 'New York',      flag: '🇺🇸', region: 'North America · USA',  hosts: '@maya',             since: '2026-02', events: '4 hosted',  members: '288',  blurb: 'Finance-leaning chapter. Hosted at coworking spaces in Manhattan; tighter overlap with the crypto-research crowd.' },
  { slug: 'london',        city: 'London',        flag: '🇬🇧', region: 'Europe · UK',          hosts: '@sasha',            since: '2025-12', events: '5 hosted',  members: '331',  blurb: 'EMEA flagship. Pub-format monthlies plus quarterly day-long workshops near King\'s Cross.' },
  { slug: 'bangalore',     city: 'Bangalore',     flag: '🇮🇳', region: 'Asia · India',         hosts: '@arjun',            since: '2026-01', events: '3 hosted',  members: '204',  blurb: 'India\'s first chapter. Strong miner builder community; weekend hack-jams at Indiranagar coworking spaces.' },
  { slug: 'sao-paulo',     city: 'São Paulo',     flag: '🇧🇷', region: 'South America · Brazil', hosts: 'founding · accepting applications', since: '2026-04', events: '0 hosted', members: '52',   blurb: 'Founding chapter. Looking for two more co-hosts. First meetup planned for Q3.' },
];

export function getChapter(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}
