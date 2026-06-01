import type { RichSubnet } from '../subnet-rich';

export const desearch: RichSubnet = {
  slug: '22-desearch',
  netuid: 22,
  name: 'Desearch',
  shortPitch: 'Decentralized real-time search API for AI agents — X, web, Reddit.',
  overview: [
    'Desearch is subnet 22 on Bittensor, operated by Datura Labs. It runs a decentralized real-time search layer that serves live data from X (Twitter), the open web, Reddit, Hacker News, Wikipedia, and arXiv to AI agents and applications. The subnet powers Desearch\'s hosted API and console product (desearch.ai, console.desearch.ai).',
    'Miners run axons that scrape and retrieve content on demand, returning ranked links plus LLM-generated summaries. Validators issue synthetic and organic queries, verify results against independent providers, and score miners on three axes: Twitter relevance (~50%), summary quality (~40%), and web link relevance (~10%). Validator logs are exposed publicly via Weights & Biases.',
    'The buyer is outside Bittensor: AI-agent builders, search apps, and product teams that need fresh, queryable web and social data. Desearch sells a unified Live Search API spanning X, Reddit, Google web, arXiv, and basic AI summarization, priced as a SaaS subscription; recent operator disclosures cite ~$11k MRR, ~1,000 registered users, and ~200 agent-beta users.',
    'Unlike closed search APIs, Desearch is open-source and Bittensor-incentivized — miners compete on freshness and relevance rather than a single vendor\'s index. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue search query', body: 'Validator picks a synthetic or organic prompt (X handle, topic, URL pattern) and dispatches it to a sample of miners via the search synapse, requesting links plus a summary.', dataK: 'payload', dataV: 'query + sources + max-links' },
    compute:   { actor: 'Miner',     title: 'Scrape, rank, summarize', body: 'Miner hits X/Twitter, web search, Reddit, arXiv via its own data plane, ranks results for relevance, and returns up to ~10 links per source with an LLM-generated summary.', dataK: 'latency',  dataV: 'seconds-scale per query' },
    score:     { actor: 'Validator', title: 'Verify & weight', body: 'Validator cross-checks links against independent providers and scores each miner on Twitter relevance (~50%), summary quality (~40%), web-link relevance (~10%); weights are pushed on-chain.', dataK: 'scale', dataV: 'Twitter 50 · Summary 40 · Web 10' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Maintains scrapers and rankers for X, web, Reddit, arXiv; serves search + summary requests via Bittensor axon synapses.',
    input: 'Search query + source list + max-link cap from a validator.',
    output: 'Ranked links per source + LLM summary, returned within seconds.',
    hardware: 'CPU-heavy host plus paid X/web API keys or proxy infra; GPU optional for summarization.',
    paidFor: 'Returning fresh, relevant, low-hallucination results that match validator-side reference checks.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Generates synthetic + organic queries, fans them out to miners, verifies returned links against independent search providers, and writes weights every tempo.',
    requires: 'Stake plus API keys for independent reference providers (web search, X). Runs the validator FastAPI service exposing /search endpoints to authorized organic clients.',
    output: 'Per-miner weight vector reflecting Twitter, summary, and web sub-scores.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Three-axis relevance score — Twitter 50%, summary quality 40%, web 10% — cross-checked against independent providers.',
    explanation: [
      'For each query, validators compare miner-returned X links to results from independent X data providers and score relevance per link, contributing roughly half of the total reward. Web links are scored similarly against an independent search API but weighted much lower (~10%). The summary returned by the miner is graded by an LLM judge on faithfulness to the retrieved sources and on coverage, contributing ~40%.',
      'Scores are accumulated across a rolling window of queries; validator logs and judge prompts are exposed via Weights & Biases so operators can audit how miners are graded. Weights are written on-chain every tempo and aggregated by Yuma consensus, so miners that disagree sharply with the validator median earn less even if they responded.',
    ],
    cheatPath: 'A miner can stuff popular but off-topic links, fabricate plausible-sounding summaries that don\'t cite real sources, or scrape from cached/stale snapshots. Validator-side independent cross-checks catch low-overlap link sets; the LLM judge penalizes hallucinated quotes and missing citations. Sybil farms reusing one upstream scraper get flattened because relevance scores converge across copies.',
  },
  customer: {
    leadOneLine: 'AI agents and search apps that need a single API for live X, web, Reddit, and arXiv data — sold as a hosted SaaS by Datura Labs.',
    explanation: [
      'Buyers are external: AI-agent builders, copilots, research tools, sentiment dashboards, and chat products that would otherwise stitch together X\'s paid API, a web search API, Reddit\'s API, and bespoke scrapers. Desearch packages all of this behind one Live Search API surface and a developer console at console.desearch.ai, with an LLM-summary layer on top for chat-style consumption.',
      'Datura Labs has publicly disclosed early traction in operator updates — on the order of ~$11k MRR, ~1,000 registered users, and ~200 beta agents — and a revenue/burn payback model that routes API revenue back to miners. The roadmap emphasizes more sources, scoring upgrades, and growing API customers rather than crypto-native usage.',
    ],
  },
  competitive: {
    scope: 'real-time web + social search API for AI agents · 2026',
    rows: [
      { name: 'Desearch', subtitle: 'SN22', isSelf: true, approach: 'Bittensor-incentivized miners scrape X, web, Reddit, arXiv and return ranked links + LLM summary via one API.', access: 'open · API', accessTone: 'open', differentiator: 'Open-source subnet runtime; X/social coverage bundled with web; revenue routes back to miners.' },
      { name: 'Perplexity API', approach: 'Hosted answer engine with Sonar API; LLM-generated answer plus cited web sources.', access: 'closed · API', accessTone: 'closed', differentiator: 'Strong answer quality and brand, but no native X firehose access and pricing tied to Perplexity\'s stack.' },
      { name: 'Tavily', approach: 'Search API purpose-built for LLM agents; returns ranked web results and extractive answers.', access: 'closed · API', accessTone: 'closed', differentiator: 'Agent-friendly schema and citations, web-only; no X, Reddit, or open miner network.' },
      { name: 'Brave Search API', approach: 'Independent web index (~30B+ pages) exposed via paid API with web, news, image, and AI snippets.', access: 'closed · API', accessTone: 'closed', differentiator: 'Real independent index, strong privacy story; no social/X data, centralized vendor.' },
      { name: 'Exa', approach: 'Neural search API (formerly Metaphor) over a custom web index optimized for semantic, LLM-style queries.', access: 'closed · API', accessTone: 'closed', differentiator: 'Embedding-native retrieval over curated web corpus; web-only, no live X or Reddit.' },
    ],
    note: 'Desearch competes head-on with hosted LLM-search APIs (Perplexity, Tavily, Exa) and traditional search APIs (Brave, Serper, SerpApi, You.com). Its wedge is twofold: X/Twitter coverage that closed vendors no longer ship as a clean API, and a Bittensor-incentivized supply side where many independent miners compete on freshness and relevance instead of one vendor maintaining one index.',
  },
  team: {
    intro: [
      'Subnet 22 is built and operated by Datura Labs (datura.ai), a small AI + Bittensor studio that also operates other Bittensor subnets and tools such as the smart-scrape stack and TaoMarketcap.',
      'The team\'s stated philosophy is "quality over decentralization for its own sake" — they curate a smaller, vetted miner set and ship a hosted API (desearch.ai, console.desearch.ai) on top of the subnet rather than treating decentralization as the end product.',
    ],
    founders: [
      { initials: 'PF', gradient: 'v', name: 'Pierre "Fish"', role: 'Founder & CEO, Datura Labs', bio: 'Long-time Bittensor builder (writes as "Fish | Datura" on Medium); previously open-sourced miner code and ran large-scale mining experiments on the network.', twitter: 'https://x.com/fish_datura' },
      { initials: 'GC', gradient: 'a', name: 'Giga Chkhikvadze', role: 'CTO', bio: 'Subnet 22 technical lead; featured on Bittensor Guru ep. 25 discussing Datura\'s architecture and roadmap.', twitter: 'https://x.com/gigch_eth' },
    ],
    size: '1-10', founded: '2023', based: 'Nevis, Saint Kitts and Nevis',
    backers: 'No public funding round disclosed.',
    placeholder: false,
  },
  milestones: [
    { date: '2023·10', text: 'Bittensor subnets go live on Finney; subnet 22 registered as Datura "smart-scrape" focused on X/Twitter retrieval.' },
    { date: '2024', text: 'Rebrand of the subnet product surface from Datura "smart-scrape" toward Desearch as the API + console front-end.' },
    { date: '2025·07', text: 'Subnet runtime release v0.0.188 published on the Datura-ai/desearch GitHub repo (MIT license).' },
    { date: '2025', text: 'Operator updates cite ~$11k MRR, ~1,000 registered users, ~200 agent-beta users on the Desearch API.' },
  ],
  join: {
    title: 'Build on Desearch',
    body: 'Hit the Desearch Live Search API for X, web, Reddit, and arXiv from one endpoint, or run a miner/validator on subnet 22. Repo: github.com/Datura-ai/desearch. Console: console.desearch.ai.',
    asideNote: 'Validator API is access-key gated; public miner status routes are open at /public/miners.',
  },
  tags: ['search', 'data', 'x-twitter', 'web', 'api', 'agents'],
  external: {
    github: 'https://github.com/Datura-ai/desearch',
    website: 'https://desearch.ai',
    twitter: 'https://x.com/desearch_ai',
    taostats: 'https://taostats.io/subnets/22/',
  },
};
