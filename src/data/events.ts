// Event registry. Stub pages render from this directly; rich event pages
// (rich === true, e.g. 2026-tokyo-meetup-03) live as their own .astro files
// and are filtered out of the dynamic [slug].astro route.

export interface EventItem {
  slug: string;
  title: string;
  blurb: string;
  category: string;       // "Meetup", "AMA", "Workshop", "Hackathon", "Demo day"
  tags: string[];         // ["In-person", "Online", "Hackathon"]
  month: string;          // "Jun"
  day: string;            // "12"
  date: string;           // "2026-06-12"
  time: string;           // "09:00 PST"
  duration?: string;      // "60 min"
  location: string;       // "Discord stage" or "📍 Mission, SF"
  host?: string;          // "@ke.ng" or "Tokyo Chapter"
  when: string;           // "in 16 days"
  rich?: boolean;
}

export const events: EventItem[] = [
  {
    slug: '2026-tokyo-meetup-03',
    title: 'Bittensor Tokyo Meetup #03',
    blurb: "Three subnet founders talking about what they wish they'd known on day one. Drinks after.",
    category: 'Meetup',
    tags: ['Meetup', 'In-person'],
    month: 'Jun', day: '08', date: '2026-06-08',
    time: '19:00 JST', duration: '180 min',
    location: '📍 WeWork Shibuya, Tokyo',
    host: 'Tokyo Chapter',
    when: 'in 12 days',
    rich: true,
  },
  {
    slug: '2026-sn3-fireside-ke-ng',
    title: '"What we learned running SN3 for a year" — fireside with @ke.ng',
    blurb: 'A year of operating one of the longer-running subnets. What broke, what surprised, what is the same a year later.',
    category: 'AMA',
    tags: ['Online', 'AMA'],
    month: 'Jun', day: '12', date: '2026-06-12',
    time: '09:00 PST', duration: '60 min',
    location: 'Discord stage',
    host: '@ke.ng',
    when: 'in 16 days',
  },
  {
    slug: '2026-sf-build-first-subnet',
    title: 'San Francisco — "Build your first subnet in 4 hours"',
    blurb: 'Hands-on workshop. Bring a laptop, leave with a registered testnet subnet and a working miner + validator pair.',
    category: 'Workshop',
    tags: ['Workshop', 'In-person'],
    month: 'Jun', day: '15', date: '2026-06-15',
    time: '10:00 PST', duration: '240 min',
    location: '📍 Mission, San Francisco',
    host: 'SF Chapter',
    when: 'in 19 days',
  },
  {
    slug: '2026-hackathon-mid-checkpoint',
    title: 'Mid-checkpoint demos · Season 01 hackathon',
    blurb: 'Twenty teams demo their work-in-progress, get feedback, iterate for the next three weeks. Spectators welcome.',
    category: 'Hackathon',
    tags: ['Hackathon', 'Hybrid'],
    month: 'Jun', day: '22', date: '2026-06-22',
    time: '18:00 local', duration: '180 min',
    location: 'Hybrid · 6 cities',
    host: 'OpenTAO',
    when: 'in 26 days',
  },
  {
    slug: '2026-berlin-garden-edition',
    title: 'Berlin — Bittensor Garden Edition',
    blurb: 'BBQ + three short lightning talks in a Kreuzberg backyard. Bring something to share; the chapter handles drinks.',
    category: 'Meetup',
    tags: ['Meetup', 'In-person'],
    month: 'Jun', day: '28', date: '2026-06-28',
    time: '17:00 CEST', duration: '240 min',
    location: '📍 Kreuzberg, Berlin',
    host: 'Berlin Chapter',
    when: 'in 32 days',
  },
  {
    slug: '2026-validator-night-bonding',
    title: 'Validator night — bonding & trust calibration',
    blurb: 'For experienced validators. Live walkthrough of how three production validators tune their bonding/EMA parameters, with Q&A.',
    category: 'Workshop',
    tags: ['Online', 'Workshop'],
    month: 'Jul', day: '06', date: '2026-07-06',
    time: '18:00 UTC', duration: '90 min',
    location: 'Discord stage',
    host: '@reza',
    when: 'in 40 days',
  },
  {
    slug: '2026-sf-demo-day-season-01',
    title: 'Season 01 Demo Day · SF',
    blurb: 'Thirty finalists from the season pitch. In-person in SF, livestream for everyone else.',
    category: 'Demo day',
    tags: ['Demo day', 'In-person', 'Livestream'],
    month: 'Jul', day: '22', date: '2026-07-22',
    time: '10:00 PT', duration: '480 min',
    location: '📍 SF + global stream',
    host: 'OpenTAO',
    when: 'in 56 days',
  },
];

export function getEvent(slug: string): EventItem | undefined {
  return events.find((e) => e.slug === slug);
}
