import type { RichSubnet } from '../subnet-rich';

export const sn111: RichSubnet = {
  slug: '111-oneoneone',
  netuid: 111,
  name: 'oneoneone',
  shortPitch: 'Decentralized network scraping authentic user-generated content for AI.',
  overview: [
    'oneoneone (SN111) is a decentralized data subnet that collects, validates, and serves authentic user-generated content — Google Maps reviews, Yelp listings, X posts, forums, blogs — at scale, packaged with AI-powered authenticity, sentiment, and intent analysis. The pitch: every AI app needs human signal as fuel, and oneoneone is the always-on UGC pipeline.',
    'A network of miners scrapes and cleans content from across the web, normalizing format and stripping junk. Validators run challenge rounds roughly every 20 minutes, issuing synthetic queries to each miner and grading responses on three axes: volume (50%), speed (30%), and recency (20%). Miners have 120 seconds to respond to each challenge or the score zeros.',
    'The commercial surface is oneoneone.io — a subscription API that lets developers, research teams, and AI companies pull real-time UGC streams without operating scrapers. Buyers can also purchase validated datasets directly from validators with crypto payment and email delivery. The data flows through Macrocosmos\' Gravity infrastructure for authenticity verification.',
    'Closest competitors are Data Universe (SN13) for general web data and Masa (SN42) for social-media-flavored scraping. oneoneone\'s wedge is the reviews-and-UGC tilt — restaurants, products, services — exactly the data class agents and recommendation models actually need. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: {
      actor: 'Validator',
      title: 'Issue UGC query',
      body: 'Validator hits each miner with a synthetic query — fetch reviews for X place, posts mentioning Y product, etc. — every ~20 minutes.',
      dataK: 'payload',
      dataV: 'UGC scrape request',
    },
    compute: {
      actor: 'Miner',
      title: 'Scrape + clean',
      body: 'Miner pulls fresh content from the target source, normalizes it, attaches metadata, and returns within the 120s deadline.',
      dataK: 'latency',
      dataV: '<120s window',
    },
    score: {
      actor: 'Validator',
      title: 'Volume + speed + recency',
      body: 'Validator scores on volume (50%), speed (30%), recency (20%); checks authenticity via Gravity-style consensus.',
      dataK: 'scale',
      dataV: '50/30/20 weighting',
    },
    settle: {
      actor: 'Subtensor',
      title: 'Yuma → emission',
      body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.",
      dataK: 'tempo',
      dataV: '~72 min · 24×/day',
    },
  },
  miner: {
    does: 'Scrapes user-generated content from Google Maps, Yelp, X, forums, blogs; cleans and normalizes; serves on request.',
    input: 'Synthetic queries from validators and live API requests from oneoneone.io subscribers.',
    output: 'Structured JSON UGC payloads — reviews, posts, ratings, metadata — with authenticity signals.',
    hardware: 'Server with Node.js 18+ and Python 3.12+, residential proxies, modest CPU, decent bandwidth.',
    paidFor: 'Volume served (50%), response speed (30%), and freshness of returned content (20%)',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues synthetic UGC challenges every ~20 minutes, scores responses on volume/speed/recency, audits authenticity.',
    requires: 'Stable server, ability to run frequent challenge rounds, ground-truth content for cross-checking.',
    output: 'Per-miner weight vector based on the 50/30/20 volume-speed-recency formula.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Volume × speed × recency — fresh, fast, full responses win the tempo.',
    explanation: [
      'Every ~20 minutes a validator dispatches synthetic queries — fetch the latest reviews for a Tokyo ramen shop, find X posts mentioning a product launch — to every registered miner. Volume (how much valid UGC came back) is the dominant axis at 50%; speed (how fast inside the 120-second window) is 30%; recency (how new the content is versus the validator\'s ground truth) is the remaining 20%.',
      'Authenticity is the silent multiplier. Synthetic-looking content, recycled scrapes, or AI-generated reviews fail consensus checks — multiple validators independently re-pull a sample and cross-reference. Repeated authenticity misses crater a miner\'s weight quickly because the entire commercial pitch depends on real human signal.',
    ],
    cheatPath: 'Serving AI-generated reviews or stale cached scrapes — the cross-validator authenticity check catches both.',
  },
  customer: {
    leadOneLine: 'AI app teams, agent builders, and recommendation-system engineers who need real human signal at scale.',
    explanation: [
      'Primary buyers come through oneoneone.io — subscription API access for developers and research teams building AI products that need fresh UGC inputs. Use cases include sentiment dashboards, agent shopping/booking flows that read reviews, fine-tuning corpora that need post-2024 human text, and trust-and-safety teams hunting fake reviews.',
      'Validators can also sell curated datasets directly with crypto payment and email delivery, opening a B2B channel for one-off research drops without an API contract. The pitch versus building your own scraper: oneoneone handles proxy rotation, format drift, source coverage, and authenticity verification — buyers just pay for the clean stream.',
    ],
  },
  competitive: {
    scope: '2026 · UGC + reviews data lane',
    rows: [
      { name: 'oneoneone', subtitle: 'SN111', isSelf: true, approach: 'Reviews-and-UGC focused scraping with 20-minute challenge cycles and authenticity verification', access: 'open · API', accessTone: 'open', differentiator: 'Specialization in reviews, ratings, and UGC payloads' },
      { name: 'Data Universe', subtitle: 'SN13', approach: 'General-purpose web data subnet covering broad sources and historical depth', access: 'open · API', accessTone: 'open', differentiator: 'Broader source mix; less reviews-specific' },
      { name: 'Masa', subtitle: 'SN42', approach: 'Real-time social-media data with X-heavy focus and structured feeds', access: 'open · API', accessTone: 'open', differentiator: 'Social-first; less coverage of long-form review sites' },
      { name: 'Bright Data / Apify', approach: 'Centralized scraping-as-a-service with managed proxies and dashboards', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'No incentive layer or authenticity consensus; pay per request' },
      { name: 'Reddit / Yelp / Google APIs', approach: 'First-party APIs from the sources themselves, gated and rate-limited', access: 'closed · API key', accessTone: 'closed', differentiator: 'Direct source, but narrow coverage and aggressive rate limits' },
    ],
    note: 'oneoneone\'s wedge is the reviews-and-ratings cut of UGC — exactly what shopping agents, travel agents, and recommendation models actually consume. Against centralized scrapers, the incentive layer keeps the network always-on and the authenticity-by-consensus check is hard to replicate as a single vendor.',
  },
  team: {
    intro: [
      'oneoneone is operated through the oneoneone-io GitHub organization. The team has not published an official roster; commits come from Bittensor-community developers including engineers like @basfroman-backup. The brand and product ship under the "oneoneone" identity at oneoneone.io.',
      'The organization handles the subnet code, the public oneoneone.io API, integrations with Macrocosmos\' Gravity for authenticity tooling, and the validator/miner reference clients written in Node.js and Python.',
    ],
    founders: [
      { initials: '11', gradient: 'v', name: '[Founder 1 name]', role: 'Operator', bio: 'Operator team behind oneoneone-io; individual identities not publicly disclosed as of May 2026.' },
    ],
    size: 'Small core team plus community contributors.',
    founded: '2025',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 111 launched, scraping Google Maps reviews and X posts.' },
    { date: '2025·11', text: 'v1.6.0 release shipped.' },
    { date: '2026', text: 'Macrocosmos Gravity integration deepens authenticity verification.' },
  ],
  join: {
    title: 'Mine UGC or buy the clean stream',
    body: 'If you can run scrapers responsibly and respond to 20-minute challenges inside the 120-second window with volume and freshness, you can mine SN111. If you just want the API, hit oneoneone.io for subscription access.',
    asideNote: 'Authenticity is checked by cross-validator consensus — fake UGC fails fast.',
  },
  tags: ['data', 'ugc', 'scraping', 'reviews'],
  external: {
    github: 'https://github.com/oneoneone-io/subnet-111',
    website: 'https://oneoneone.io/',
    taostats: 'https://taostats.io/subnets/111/',
  },
  tweets: [],
};
