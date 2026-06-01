import type { RichSubnet } from '../subnet-rich';

export const dataUniverse: RichSubnet = {
  slug: '13-data-universe',
  netuid: 13,
  name: 'Data Universe',
  shortPitch: 'Decentralised scraping of X, Reddit and YouTube into open social-media datasets.',
  overview: [
    'Data Universe is Bittensor subnet 13, a decentralised data layer that incentivises miners to scrape and store fresh social-media content from X (Twitter), Reddit and YouTube transcripts. The subnet was launched in early 2024 and has been operated by London-based Macrocosmos since June 2024, when the original developers handed it over to the team that also runs subnets 1, 9, 25 and 37.',
    'Validators issue dynamic "desirability" lists of labels they want collected. Miners scrape matching content, store it as DataEntities grouped into time- and label-keyed DataEntityBuckets, push anonymised copies to S3-compatible storage and report a MinerIndex back to validators. Validators sample entries, re-fetch them from source, and score each miner on freshness (30-day cutoff), desirability, uniqueness and an exponential-moving-average credibility.',
    'Outside Bittensor, the dataset feeds AI labs, market-research firms and forecasting shops. Macrocosmos sells access through Gravity (no-code scraping jobs), Nebula (3D dataset explorer) and a Marketplace, with tiers from a $5 pay-as-you-go credit up to a $499/month Cosmonaut plan and enterprise contracts. A public Hugging Face mirror exposes the corpus to anyone.',
    'Versus centralised scrapers like Bright Data or Apify, Data Universe replaces a single vendor\'s proxy fleet with a 192-slot global miner mesh whose marginal cost per row trends toward emission rather than IP-rental margin. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Publish desirability list', body: 'Validators stake-weight a Dynamic Desirability List of platforms, labels and keywords they want scraped, then sample existing MinerIndex entries to re-validate at source.', dataK: 'sources', dataV: 'X · Reddit · YouTube' },
    compute:   { actor: 'Miner', title: 'Scrape, store, index', body: 'Miners pull matching content, write it to local DataEntityBuckets, upload anonymised shards to S3-compatible storage and serve a MinerIndex summarising what they hold.', dataK: 'freshness', dataV: '30-day window' },
    score:     { actor: 'Validator', title: 'Score × credibility', body: 'Validators re-fetch sampled URIs from source, check byte-level match, then weight by freshness, desirability and inverse duplication. Credibility (EMA of successful validations) is raised to the 2.5 power, so dishonest miners collapse fast.', dataK: 'weights', dataV: 'Reddit 65% · X 35%' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Scrapes X, Reddit and YouTube and stores each post as a DataEntity inside time- and label-keyed DataEntityBuckets.',
    input: 'Validator desirability list plus public social-media APIs and HTML endpoints.',
    output: 'Local DataEntityBuckets, an S3 upload of anonymised rows, and a MinerIndex served on request.',
    hardware: 'Modest CPU node with large disk, residential or rotating proxies, and stable bandwidth — no GPU required.',
    paidFor: 'Fresh, non-duplicate, on-list rows that survive validator re-fetch and byte-level checks.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Publishes the desirability list, queries MinerIndexes, re-fetches sampled DataEntities from source, and sets weights.',
    requires: 'Validator stake, scraping clients for each supported platform, and storage for the local mirror of miner indices.',
    output: 'A weight vector over miners reflecting raw score, S3 + OnDemand boosts and credibility^2.5.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Final = (Raw + S3 boost + OnDemand boost) × Credibility^2.5, with a hard 30-day freshness cliff.',
    explanation: [
      'Raw score is built from four signals: source (Reddit weighted 65%, X 35%), label desirability (unlisted labels score 0.3×), recency (anything older than 30 days scores zero) and a duplication factor that rewards rows held by fewer miners. S3 and OnDemand boosts add weight for rows mirrored to public storage and rows served through Gravity\'s on-demand API.',
      'Credibility is an exponential moving average of the fraction of validation samples that match source. It is then raised to the 2.5 power before multiplying the raw score, so a miner that fails even a small share of checks loses almost all emission. This converts "lying once is cheap" into "lying once is ruinous".',
    ],
    cheatPath: 'Synthetic rows fail byte-level re-fetch and crater credibility. Re-uploading another miner\'s shards is caught by the duplication factor, which drops scores for widely-held content. Stuffing the index with archival data hits the 30-day cliff and scores zero. Targeting only easy labels yields a 0.3× discount versus the validator-curated list.',
  },
  customer: {
    leadOneLine: 'AI labs, quant desks and marketing teams that need bulk, fresh social-media data without managing a proxy fleet.',
    explanation: [
      'The corpus claims 55B+ rows and ~80M new rows per day across X, Reddit and YouTube, mirrored to Hugging Face as the largest open social-media dataset of its kind. Buyers consume it directly from Hugging Face for free, or pay Macrocosmos for curated jobs: pay-as-you-go with $5 starter credit, Astronaut at $99/month for 300K records, Cosmonaut at $499/month for 4M records, and bespoke enterprise contracts.',
      'Gravity is the no-code front end where customers specify keywords, hashtags and labels and watch miners deliver matching rows in near real time; Nebula visualises the result as a 3D point cloud with sentiment metrics; an MCP server exposes the same data to Claude and Cursor. Stated use-cases include brand monitoring, sentiment-driven forecasting, sports analytics and pretraining corpora for downstream subnets like SN9.',
    ],
  },
  competitive: {
    scope: 'Web-scale social-media scraping and structured-dataset providers serving AI training and market-intelligence buyers.',
    rows: [
      { name: 'Data Universe', subtitle: 'SN13', isSelf: true, approach: '192 miner slots scrape X, Reddit and YouTube against a validator-curated desirability list; rows mirrored to Hugging Face and sold via Gravity/Nebula.', access: 'open · datasets on HF', accessTone: 'open', differentiator: 'Open corpus + emission-subsidised cost floor; competitors must price IP rotation and labour into every row.' },
      { name: 'Bright Data', approach: 'Commercial proxy network with managed scraper APIs and pre-built datasets, sold per-record or per-GB.', access: 'closed · paid API', accessTone: 'closed', differentiator: 'Largest residential proxy fleet and enterprise SLAs, but datasets remain proprietary and per-row pricing scales linearly.' },
      { name: 'Apify', approach: 'Actor marketplace where developers publish scrapers; customers rent compute and pay per result.', access: 'closed · marketplace', accessTone: 'closed', differentiator: 'Breadth of scrapers across long-tail sites; no shared open corpus and unit cost set by individual actor authors.' },
      { name: 'Scrapfly', approach: 'API-first scraping infrastructure with anti-bot bypass, headless rendering and dataset products.', access: 'closed · paid API', accessTone: 'closed', differentiator: 'Strong anti-bot tooling for hard targets but narrower breadth on social platforms and no public dataset mirror.' },
      { name: 'Common Crawl', approach: 'Non-profit monthly crawl of the public web published as free WARC archives on S3.', access: 'open · free archives', accessTone: 'open', differentiator: 'Free and massive but stale, web-page-centric and weak on logged-in social feeds — SN13 fills the social-media-specific gap.' },
    ],
    note: 'Bright Data, Apify and Scrapfly compete on proxy quality and developer experience but keep their corpora private. Common Crawl is free but coarse and not social-native. Data Universe sits between them: a continuously-refreshed, label-curated social-media corpus where TAO emission subsidises the long tail of scraping cost and the result is mirrored to Hugging Face for anyone to ingest.',
  },
  team: {
    intro: [
      'Macrocosmos is a London-based Bittensor operator that runs subnet 1 (Apex conversational intelligence), subnet 9 (IOTA distributed pre-training), subnet 13 (Data Universe), subnet 25 (Mainframe) and subnet 37 (Finetuning). It took over SN13 from its original developers in June 2024 and folded it into a single product line.',
      'The team\'s thesis is that open-source training stacks — data, pre-training, fine-tuning, inference — should be built as interoperating subnets rather than one monolith, with each subnet competing on a clear incentive surface.',
    ],
    founders: [
      { initials: 'WS', gradient: 'v', name: 'Will Squires', role: 'CEO & Co-founder', bio: 'Engineer-turned-operator; MEng in civil engineering and sustainability from the University of Warwick, prior AI-startup founding experience. Co-founded Macrocosmos in March 2024.' },
      { initials: 'SC', gradient: 'a', name: 'Steffen Cruz', role: 'CTO & Co-founder', bio: 'Former CTO of the Opentensor Foundation and original architect of Subnet 1 (Apex). PhD in experimental nuclear / subatomic physics, University of British Columbia.' },
      { initials: 'MB', gradient: 'g', name: 'Michael Bunting', role: 'CFO', bio: 'Finance lead at Macrocosmos; public-facing for SN13 partnerships and appears as the SN13 spokesperson on partner podcasts.' },
    ],
    size: '~27 employees', founded: 'March 2024', based: 'London, United Kingdom',
    backers: 'No public funding round disclosed; revenue from Gravity/Nebula tiers and TAO emission.',
    placeholder: false,
  },
  milestones: [
    { date: '2024·06', text: 'Macrocosmos takes over SN13 from original developers and renames it Data Universe.' },
    { date: '2024·H2', text: 'Dynamic Desirability List shipped; validators can stake-weight which labels miners should scrape.' },
    { date: '2025', text: 'Gravity launches as the no-code consumer product on top of SN13, with X and Reddit scraping jobs.' },
    { date: '2025', text: 'YouTube transcripts added as a third data source; corpus surpasses 55B rows mirrored to Hugging Face.' },
    { date: '2025·10', text: '"Inventive Mechanisms" livestream covers SN13 roadmap, Gravity, partnerships and new features.' },
    { date: '2026·05', text: 'data-universe repo at v1.18.67 with 2,070+ commits and 183 releases on main.' },
  ],
  join: {
    title: 'Run a miner or buy the firehose',
    body: 'Miners need a Linux box with plenty of disk, residential or rotating proxies and the public scraper clients in the data-universe repo. Buyers can start free from the Hugging Face mirror or use the $5 starter credit on Gravity to test a scraping job.',
    asideNote: '30-day freshness cliff means archival data scores zero — gear up for continuous scraping, not one-shot dumps.',
  },
  tags: ['data', 'scraping', 'social-media', 'datasets', 'macrocosmos'],
  external: {
    github: 'https://github.com/macrocosm-os/data-universe',
    website: 'https://datauniverse.macrocosmos.ai/',
    twitter: 'https://x.com/MacrocosmosAI',
    taostats: 'https://taostats.io/subnets/13/',
  },
  tweets: [
    { when: '2025·04', body: 'Scrape real-time data from X and Reddit, no technical skill necessary. Gravity, powered by #SN13 Data Universe, lets you collect data on demand from X and Reddit, across any number of topics.' },
    { when: '2025·10', body: 'Our livestream, Inventive Mechanisms, is happening on Thursday 16th October. Featuring the SN13 Data-Universe team — topics include SN13\'s purpose, Gravity, collaborations and new features.' },
  ],
};
