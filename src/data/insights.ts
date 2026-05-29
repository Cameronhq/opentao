// Insights registry. Stub pages render from this directly; rich insight pages
// (rich === true, e.g. yuma-walk-through) live as their own .astro files and
// are filtered out of the dynamic [slug].astro route.

export interface Insight {
  slug: string;
  title: string;
  lead: string;
  body: string;
  type: string;            // "Deep dive", "Retrospective", "Interview", "Tutorial", "Field notes"
  readTime: string;        // "22 min"
  cover: string;           // cover gradient class, e.g. "cover-1"
  coverText: string;       // placeholder text on the cover tile
  author: string;          // "@ke.ng" or "editorial"
  authorHandle?: string;   // "@rho.lab"
  date: string;            // "2026·05·19"
  rich?: boolean;
}

export const insights: Insight[] = [
  {
    slug: 'yuma-walk-through',
    title: 'Yuma consensus, slowly: a hand-traced walk through one block.',
    lead: 'We pause at every variable. By the end you can predict what every validator\'s weight does to emission — without opening the paper.',
    body: '',
    type: 'Deep dive', readTime: '22 min',
    cover: 'cover-1', coverText: 'cover · yuma-walkthrough.svg',
    author: 'Rho Carter', authorHandle: '@rho.lab',
    date: '2026·05·19',
    rich: true,
  },
  {
    slug: 'why-dtao-changed-everything',
    title: 'Why dTAO changed everything (and three things it didn\'t).',
    lead: 'One year in. The data, the surprises, the second-order effects nobody warned about.',
    body: 'A retrospective on the year since dTAO went live. Subnet-level price discovery did most of what the design doc predicted — emission concentration on top subnets, a real signal for "is this subnet valuable" beyond founder vibes, and a market for staking attention. The three things that did not change: validator concentration at the top, the difficulty of bootstrapping a new subnet from zero, and the fact that most TAO holders still do not actively participate in any single subnet\'s economics.',
    type: 'Retrospective', readTime: '14 min',
    cover: 'cover-2', coverText: 'cover · dtao-one-year.svg',
    author: '@ke.ng',
    date: '2026·05·11',
  },
  {
    slug: 'sn-18-interview',
    title: '"We almost shipped a centralized API and called it a subnet." — SN-18.',
    lead: 'The founders of one of Bittensor\'s longest-running subnets on the temptation of shortcuts.',
    body: 'A frank conversation with the SN-18 team about the moment in 2024 they considered cutting the validator-incentive layer entirely and shipping a wrapped centralized API instead. Why they didn\'t, what they learned about scoring functions in the process, and what a subnet actually owes the network beyond serving requests.',
    type: 'Interview', readTime: '32 min',
    cover: 'cover-3', coverText: 'cover · sn18-interview.svg',
    author: 'editorial',
    date: '2026·05·04',
  },
  {
    slug: 'validator-bonding-tutorial',
    title: 'Tuning a validator\'s bonding parameters without getting penalized.',
    lead: 'The advanced moves nobody documents. With numbers from three production validators.',
    body: 'A practical guide to the bonding/EMA parameters that govern validator trust. Where the safe ranges are, what happens at the edges, and three real validators\' actual numbers (anonymized but real). Includes a small script for sanity-checking your config against the current consensus median.',
    type: 'Tutorial', readTime: '18 min',
    cover: 'cover-4', coverText: 'cover · validator-tuning.svg',
    author: '@reza',
    date: '2026·04·28',
  },
  {
    slug: 'scoring-function-field-guide',
    title: 'Designing a subnet\'s scoring function: a field guide.',
    lead: 'Six patterns that work, three that don\'t, and how to know which you have.',
    body: 'A taxonomy of subnet scoring functions, with worked examples. The six patterns that have shipped successfully — pairwise comparisons, reference-model matching, downstream-task scoring, peer-review aggregation, deterministic verification, and synthetic stress tests. The three failure modes that keep appearing — gameable proxies, validator-only-knows-the-answer, and metric drift over time.',
    type: 'Deep dive', readTime: '25 min',
    cover: 'cover-5', coverText: 'cover · subnet-incentive-design.svg',
    author: '@maya',
    date: '2026·04·22',
  },
  {
    slug: 'emission-curve-halving',
    title: 'What the emission-curve halving will actually look like in practice.',
    lead: 'Three charts and a short take. We\'re closer than most miners realize.',
    body: 'A short field-notes piece with three charts: projected emission per block before and after the next halving, the historical 30-day-window comparison from 2025\'s halving, and a per-subnet payout simulation assuming current weight distribution. The take: most miners and validators have not modeled what their P&L looks like at half the emission rate.',
    type: 'Field notes', readTime: '8 min',
    cover: 'cover-6', coverText: 'cover · emission-charts.svg',
    author: '@yuki',
    date: '2026·04·18',
  },
  {
    slug: 'governance-hyperparam-votes',
    title: 'How the last three hyperparameter votes played out.',
    lead: 'A look at who voted, who didn\'t, and what\'s about to change.',
    body: 'A breakdown of the last three chain-wide hyperparameter votes — proposer, the change, voting window participation, coalitions visible from the on-chain record, and outcome. Two of the three passed; the third revealed a stable opposition bloc of mid-stake validators. A short read on how Bittensor governance is actually behaving versus how the docs say it should.',
    type: 'Retrospective', readTime: '12 min',
    cover: 'cover-1', coverText: 'cover · governance-process.svg',
    author: '@sasha',
    date: '2026·04·09',
  },
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}
