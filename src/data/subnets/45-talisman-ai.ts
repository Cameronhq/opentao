import type { RichSubnet } from '../subnet-rich';

export const sn45: RichSubnet = {
  slug: '45-talisman-ai',
  netuid: 45,
  name: 'Talisman AI',
  shortPitch: 'Real-time crypto signal mining feeding Talisman\'s in-wallet AI agent.',
  overview: [
    'Talisman AI (Subnet 45) is operated by the Rizzo Network team and acts as the eyes and ears of Talisman\'s AI wallet. Miners continuously scrape real-time crypto signal — initially social media like Twitter/X, with on-chain and market feeds rolling in — and use LLMs to score each item for relevance and sentiment. The output is a curated, batched signal stream the wallet\'s agent consumes.',
    'Validators independently re-run the same LLM analysis over each batch; if scores diverge across validators, the batch is rejected. Yuma then aggregates surviving weights per tempo, so emission flows to miners whose signal extraction is both timely and reproducible under independent re-grading.',
    'The customer is, in the first instance, Talisman wallet users — the AI agent reasons over the subnet\'s signals to recommend or even execute trades and staking actions on the user\'s behalf. Beyond that, any agentic crypto product that needs ranked real-time signal can subscribe.',
    'Differentiator: a wallet-integrated demand loop rather than a generic data feed — the AI agent ships the signal directly into trade execution. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Define scope', body: 'Validators broadcast the topic/source filter (e.g., crypto Twitter list, on-chain event class) and the scoring rubric.', dataK: 'payload', dataV: 'sources + window' },
    compute:   { actor: 'Miner',     title: 'Scrape & score', body: 'Miners scrape recent posts/events, run an LLM to rate relevance + sentiment, and submit a ranked batch.', dataK: 'latency',  dataV: 'minutes' },
    score:     { actor: 'Validator', title: 'Re-grade', body: 'Validators re-run the LLM rubric over each batch and reject any inconsistent scores.', dataK: 'scale',    dataV: 'rubric agreement' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Scrapes real-time crypto signal sources and LLM-scores each item.', input: 'Source list (Twitter/X handles, on-chain event types) + scoring rubric.', output: 'Ranked, scored batch of signal items with provenance.', hardware: 'GPU for local LLM inference or API budget; web-scraping infra.', paidFor: 'Timely, well-ranked signal batches that survive validator re-grading.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Re-runs the scoring rubric across batches and rejects inconsistent submissions.', requires: 'Same LLM-as-judge stack + source access.', output: 'Per-miner weight vector based on re-grade consistency.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Score = consistency of LLM-judged signal scores across independent validators.', explanation: [
    'Validators apply the published rubric to the same items the miner returned. If validator scores converge with the miner\'s scoring, the batch is accepted and weighted by relevance; if validators disagree, the batch is dropped.',
    'This makes consensus an LLM-as-judge process rather than a single oracle, which is well-suited to fuzzy tasks like sentiment and relevance where there is no clean numeric ground truth.',
  ], cheatPath: 'Stuffing irrelevant or copy-pasted items, or trying to game the rubric with prompt injection in payloads, fails when independent validators re-score with the same rubric.' },
  customer:  { leadOneLine: 'Talisman wallet AI agent and downstream agentic crypto products.', explanation: [
    'The flagship customer is Talisman\'s own in-wallet AI agent, which uses the subnet\'s ranked signal to suggest or execute trade and staking actions for the user. The vertical integration makes the subnet effectively the wallet\'s perception layer.',
    'Beyond Talisman, any agentic crypto product — auto-traders, portfolio copilots, alpha aggregators — can subscribe through the coordination API to get the same filtered stream without running their own scraping and scoring stack.',
  ] },
  competitive: { scope: '2026 · crypto signal', rows: [
    { name: 'Talisman AI', subtitle: 'SN45', isSelf: true, approach: 'Open signal mining w/ LLM-as-judge consensus, wallet-integrated.', access: 'open · API + wallet', accessTone: 'open', differentiator: 'Direct demand loop into a real wallet agent.' },
    { name: 'Nansen / Arkham', approach: 'Centralized on-chain analytics platforms.', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Strong on-chain analytics, weak on social + no agent integration.' },
    { name: 'LunarCrush / Kaito', approach: 'Crypto social listening platforms.', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Curated social data, but no open mining + no wallet path.' },
    { name: 'Desearch (SN22)', approach: 'Bittensor decentralized search.', access: 'open', accessTone: 'open', differentiator: 'Adjacent: search retrieval vs ranked agentic signal.' },
    { name: 'Custom agent stacks', approach: 'In-house signal pipelines per project.', access: 'closed', accessTone: 'closed', differentiator: 'Bespoke; no shared learning loop.' },
  ], note: 'Talisman AI\'s edge is that the buyer (the wallet agent) is downstream of the seller (the subnet) — it can guarantee distribution to a real user surface, which most signal vendors cannot.' },
  team: { intro: [
    'The subnet is led by Frank Rizzo (CEO) and RogueTensor (CTO), operating under the Rizzo Network banner. The team is integrated with Talisman, the multi-chain wallet, and frames Subnet 45 as the perception layer for Talisman\'s AI agent.',
    'Rizzo Network has positioned itself broadly around agentic AI and software-engineering automation on Bittensor; SN45 is the consumer-facing arm of that thesis.',
  ], founders: [
    { initials: 'FR', gradient: 'v', name: 'Frank Rizzo', role: 'Co-founder, CEO', bio: 'CEO of Rizzo Network; leads Talisman AI strategy and the SN45 build.' },
    { initials: 'RT', gradient: 'a', name: 'RogueTensor', role: 'Co-founder, CTO', bio: 'CTO of Rizzo Network; builds the validator and agentic stack across multiple Bittensor subnets.' },
  ], size: 'Small core team', founded: '2024', based: 'Not publicly disclosed.', backers: 'Not publicly disclosed.', placeholder: false },
  milestones: [
    { date: '2024', text: 'Talisman AI launched on SN45 with X/Twitter signal as the first source.' },
    { date: '2025', text: 'Integration with Talisman wallet AI agent rolled out.' },
  ],
  join: { title: 'Mine the alpha stream', body: 'Run a miner if you can build a scraping + LLM-scoring pipeline that beats validators\' re-grade. Validators run the same rubric.', asideNote: 'Spend time tuning your relevance/sentiment rubric prompts — that\'s where the gradient lives.' },
  tags: ['signal', 'social', 'wallet', 'agents'],
  external: { github: 'https://github.com/Team-Rizzo/talisman-ai', website: 'https://ai.talisman.xyz/', taostats: 'https://taostats.io/subnets/45/' },
  tweets: [],
};
