import type { RichSubnet } from '../subnet-rich';

export const masa: RichSubnet = {
  slug: '42-masa',
  netuid: 42,
  name: 'Masa',
  shortPitch: 'TEE-verified real-time scrapers for X, Reddit, TikTok and the open web.',
  overview: [
    'Subnet 42 is a real-time social and web data pipeline operated by Masa Finance (San Francisco, founded 2021 by Calanthia Mei and Brendan Playford). In September 2025 the project rebranded the parent company to Gopher AI and is building a Cosmos-SDK Layer-1; the subnet repo now lives under github.com/gopher-lab/subnet-42, though netuid 42 still trades and is widely referenced as "Masa".',
    'Miners run a TEE worker on Intel SGX 2.0+ hardware that scrapes Twitter/X, Reddit, TikTok, LinkedIn and the open web via API keys and Apify actors. Validators verify telemetry from each TEE worker, normalize success rates per source, apply kurtosis weighting to emphasize top performers, and submit weights. The standard Bittensor cap of 64 validators and 192 miner slots applies.',
    'Buyers outside Bittensor are AI agents, trading bots, sentiment-driven funds and ML teams that need fresh structured social data without paying enterprise X or Reddit API rates. Masa-derived data already powers GoTrader, an in-house sentiment trading product, and is shared on Hugging Face.',
    'Differs from Bright Data and Apify by routing scrapes through cryptographically attested TEEs instead of a centralized cloud — buyers get tamper-evidence, not just JSON. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Telemetry request', body: 'Validator queries each TEE-worker miner for performance telemetry across enabled platforms (X, Reddit, TikTok, web) and any pending scrape jobs.', dataK: 'payload', dataV: 'telemetry + jobs' },
    compute:   { actor: 'Miner',     title: 'Scrape inside SGX enclave', body: 'Miner executes scraping jobs (tweets, profiles, subreddits, TikTok, web pages) inside an Intel SGX 2.0 enclave via the gopher-lab/tee-worker, returning attested results.', dataK: 'latency',  dataV: 'per-job, sub-source' },
    score:     { actor: 'Validator', title: 'Normalize + kurtosis weighting', body: 'Validator diffs telemetry over time, normalizes raw metrics, applies source-demand weights, combines into a composite score, then applies a kurtosis curve to skew rewards toward top performers.', dataK: 'scale', dataV: 'composite, top-skewed' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs a TEE worker on Intel SGX 2.0+ hardware that scrapes X/Twitter, Reddit, TikTok, LinkedIn and the open web',
    input: 'Validator-issued scrape jobs plus the miner\'s own telemetry stream',
    output: 'Attested scrape results plus per-source success/latency telemetry',
    hardware: '11th-gen Intel Core or modern Xeon with SGX 2.0 (Azure DC4s v2 recommended, 4 vCPU / 16 GB, up to 4 miners per box) plus Twitter/X API keys or premium accounts and Apify credits',
    paidFor: 'Consistent, high-volume, low-error scrapes across all weighted platforms',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Polls TEE-worker miners, verifies attested telemetry, scores per the kurtosis-weighted algorithm, sets weights',
    requires: 'Same SGX 2.0+ hardware as miners, TAO stake, plus the standard Bittensor validator permit',
    output: 'Weight vector over miner UIDs each tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Telemetry-driven, source-weighted, kurtosis-skewed toward top miners.',
    explanation: [
      'Each miner runs a TEE worker that emits performance telemetry — tweet pulls, profile lookups, Reddit and TikTok success/failure rates, web-scrape latency, auth errors, rate-limit hits, processing time. Validators read this telemetry stream and compute deltas over the scoring window so miners are paid for new throughput, not historical totals.',
      'Raw metrics are normalized, multiplied by source-demand weights set in the validator config (X usually heaviest), composed, then passed through a kurtosis-shaped curve that compresses the middle and rewards the right tail before being converted into Yuma weights. The full weight table and parameters live in the public validator config on GitHub.',
    ],
    cheatPath: 'Fabricated telemetry is the obvious attack — the TEE attestation is the answer: results are signed inside the SGX enclave so a miner cannot inflate counters without breaking remote attestation. Residual risks are running degraded API keys that pass attestation but return low-quality data, or coordinating with a friendly validator on weights; both show up as divergence from the consensus weights set by the Gopher-operated validator.',
  },
  customer: {
    leadOneLine: 'Trading bots, AI agents and ML teams that need fresh social data without enterprise X/Reddit bills.',
    explanation: [
      'The directly addressable buyer is anyone today paying X enterprise API, Reddit Data API, Bright Data or Apify for real-time social streams — sentiment funds, AI agent frameworks, brand-monitoring SaaS, ML researchers fine-tuning on recent text. The pitch is comparable freshness and coverage with cryptographic tamper-evidence, at subnet-subsidized cost.',
      'Masa Finance also runs first-party products on the same pipeline: Gopher AI Insights (~54k users per their disclosures) and GoTrader, a financial-sentiment trading app (~20k users, ~1k paying, contributing to the company\'s reported ~$1M ARR). External proof points are limited published case studies and a presence on Hugging Face.',
    ],
  },
  competitive: {
    scope: 'real-time social-data APIs · 2026',
    rows: [
      { name: 'Masa', subtitle: 'SN42', isSelf: true, approach: 'Decentralized network of TEE-attested miners scraping X/Reddit/TikTok/web; validators score telemetry', access: 'open · API + on-chain', accessTone: 'open', differentiator: 'Hardware-attested provenance — buyers can verify data was not tampered post-scrape' },
      { name: 'Bright Data', approach: 'Centralized residential/datacenter proxy network with managed X, Reddit and web scraper APIs', access: 'commercial · pay-per-success', accessTone: 'closed', differentiator: 'Highest measured success rate in independent benchmarks; deep proxy moat, but no attestation' },
      { name: 'Apify', approach: 'Marketplace of 2,000+ "Actors" running on Apify\'s cloud; compute-time billing', access: 'commercial · usage-based', accessTone: 'closed', differentiator: 'Largest catalog of pre-built scrapers; Masa itself uses Apify actors under the hood' },
      { name: 'X enterprise API', approach: 'Official Twitter/X firehose and search tiers from X Corp.', access: 'commercial · enterprise', accessTone: 'closed', differentiator: 'Only fully ToS-blessed source for X data; pricing has pushed most teams off-platform' },
      { name: 'Reddit Data API', approach: 'Official Reddit API with paid commercial tiers post-2023 changes', access: 'commercial · enterprise', accessTone: 'closed', differentiator: 'Authoritative Reddit access, but tiered pricing and quotas exclude most independent teams' },
    ],
    note: 'The honest read in 2026: Bright Data and Apify dominate paid scraping on raw success-rate and tooling; Masa\'s wedge is TEE-attested provenance and a subnet-subsidized cost structure. SN42\'s on-chain footprint has been thin — current taostats data shows very low emission share and as few as one active miner, consistent with the team having shifted attention to the Gopher Layer-1 and GOAI token after the September 2025 rebrand. Whether the subnet rebuilds liveness or fades is an open question.',
  },
  team: {
    intro: [
      'Masa Finance was founded in 2021 in San Francisco by Calanthia Mei (ex-PayPal venture arm, ex-banker) and Brendan Playford (co-founder Pngme; UC Berkeley physics/math). The company raised roughly $8.9M across pre-seed and seed rounds from Digital Currency Group, GoldenTree, GSR, Avalanche Blizzard Fund, Anagram, Flori Ventures, Unshackled and others, plus an $8.75M CoinList community sale for the $MASA token in March 2024.',
      'In September 2025 the team rebranded the parent project to Gopher AI and announced a Cosmos-SDK Layer-1 with GOAI replacing MASA at 1:1. Bittensor SN42 is now positioned as the data-acquisition layer feeding Gopher Chain and the in-house GoTrader / AI Insights products. The brand "Masa" persists on netuid 42 but the active GitHub org is gopher-lab.',
    ],
    founders: [
      { initials: 'CM', gradient: 'v', name: 'Calanthia Mei', role: 'Co-founder', bio: 'Co-founder of Masa / Gopher AI. Previously at PayPal\'s venture arm and in investment banking; based in San Francisco.', twitter: 'https://twitter.com/calanthia' },
      { initials: 'BP', gradient: 'a', name: 'Brendan Playford', role: 'Co-founder, CEO', bio: 'Co-founder and CEO. Previously co-founded Pngme; studied physics and mathematics at UC Berkeley. Public face of the MASA to GOAI rebrand.', twitter: 'https://twitter.com/BrendanPlayford' },
    ],
    size: 'Undisclosed',
    founded: '2021',
    based: 'San Francisco, USA',
    backers: 'Digital Currency Group, GoldenTree, GSR, Avalanche Blizzard Fund, Anagram, Flori Ventures, Unshackled Ventures, OpCrypto, PEER VC',
    placeholder: false,
  },
  milestones: [
    { date: '2021', text: 'Masa Finance founded in San Francisco by Calanthia Mei and Brendan Playford' },
    { date: '2022·05', text: '$3.5M pre-seed announced, framed as a hybrid credit / decentralized data network' },
    { date: '2024·01', text: '$5.4M seed round announced; data-network thesis on Avalanche' },
    { date: '2024·03', text: '$MASA CoinList community sale raises $8.75M in roughly 17 minutes' },
    { date: '2024', text: 'Bittensor netuid 42 ("Masa Subnet") launched as the real-time data subnet' },
    { date: '2025·09', text: 'Project rebrands to Gopher AI; GitHub moves to gopher-lab; Cosmos-SDK Layer-1 announced' },
    { date: '2025·10', text: 'Gopher testnet goes live; GOAI presale opens' },
    { date: '2026·03', text: 'subnet-42 repo v2.24.0 released, including SGX 2.0 migration work' },
  ],
  join: {
    title: 'Join Subnet 42',
    body: 'Miners need Intel SGX 2.0+ hardware (11th-gen Core or modern Xeon, Azure DC4s v2 is the documented baseline), Twitter/X API access plus Apify credits, and the gopher-lab/tee-worker container alongside the subnet-42 neuron. Validators run the same stack with stake and a permit. Docs at developers.gopher-ai.com are authoritative.',
    asideNote: 'Emission share on SN42 has been very low and active miners are few — model unit economics carefully before bringing capacity online.',
  },
  tags: ['real-time data', 'social scraping', 'X/Twitter', 'Reddit', 'TikTok', 'TEE', 'Intel SGX'],
  external: {
    github: 'https://github.com/gopher-lab/subnet-42',
    website: 'https://www.gopher-ai.com/',
    twitter: 'https://twitter.com/getmasafi',
    taostats: 'https://taostats.io/subnets/42/',
  },
  tweets: [
    { when: '2025·11', body: 'Brendan Playford publishes "The Journey from MASA to GOAI" thread explaining the rebrand from Masa application to Gopher sovereign Layer-1' },
    { when: '2025·11', body: '@gopher_ai announces GOAI presale open; MASA holders eligible for 1:1 swap' },
  ],
};
