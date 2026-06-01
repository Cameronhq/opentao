import type { RichSubnet } from '../subnet-rich';

export const sn17: RichSubnet = {
  slug: '17-404-gen',
  netuid: 17,
  name: '404—GEN',
  shortPitch: 'A Bittensor subnet for runtime text-to-3D asset generation.',
  overview: [
    '404—GEN is the subnet operated by 404 Repo for text-to-3D generation. Miners run open-source 3D generative models (Gaussian Splatting, NeRF, diffusion, point-cloud) and return game-ready 3D assets from text prompts. Validators score outputs for quality, prompt alignment, and rendering speed. The customer outside Bittensor is a game studio or virtual-world developer.',
    'The subnet uses a standard metagraph. Each tempo the validator broadcasts a text prompt, miners return a generated 3D asset (typically a .ply or Gaussian Splatting file), and the validator scores it via a combination of CLIP-style alignment, render quality, and topology checks. Higher composite score earns emission via Yuma.',
    'The pitch is direct: 3D content is the bottleneck for every game, VR experience, and virtual world ever made. Hand-authoring assets costs $1k–$10k per model. 404—GEN ships a Unity plugin and a Blender plugin that produce a game-ready asset from a text prompt in seconds, with the subnet as the production backend.',
    'Where centralized text-to-3D players (Meshy, Luma, CSM) ship one model behind an API, 404—GEN runs a permissionless tournament of multiple architectures competing in parallel. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send a 3D prompt', body: 'Pick a text prompt from the rotating catalog — "a low-poly oak tree", "a sci-fi rifle", "a stone fountain" — and broadcast it to active miners.', dataK: 'payload', dataV: 'Text prompt · 50–200 tokens' },
    compute:   { actor: 'Miner',     title: 'Generate the asset', body: 'Each miner runs its 3D generative pipeline and returns a Gaussian Splatting file (or compatible format) representing the asset.', dataK: 'latency',  dataV: '10–60 s on 24GB GPU' },
    score:     { actor: 'Validator', title: 'Score quality + alignment', body: 'Render the asset, score CLIP alignment vs prompt, check topology and geometry, weight by latency. Composite score determines reward.', dataK: 'scale', dataV: '0.0 → 1.0 · alignment × quality' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs a text-to-3D generative model and returns game-ready assets each tempo.',
    input: 'Text prompt (50–200 tokens)',
    output: 'Gaussian Splatting / 3D mesh file',
    hardware: '24GB+ VRAM · A100 or H100 recommended',
    paidFor: 'High CLIP alignment + rendering quality at low latency',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues prompts, renders miner outputs, scores against CLIP + quality checks, submits weights.',
    requires: 'Top-N stake + reference validator code + rendering pipeline',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'A text prompt becomes a 3D asset. Is it good enough to drop into a game?',
    explanation: [
      'The validator picks a prompt from a rotating catalog of 3D concepts and broadcasts it to active miners. Each miner returns a 3D asset — typically a Gaussian Splatting file or compatible mesh format. The validator then renders the asset from multiple angles, runs a CLIP-style alignment score against the prompt, and runs geometry / topology checks (no holes, reasonable poly count, no NaN normals).',
      'The composite score weighs prompt alignment first, render quality second, and latency third. An asset that\'s pretty but ignores the prompt scores low. An asset that nails the prompt but has broken geometry scores low. Speed only matters as a tiebreaker.',
    ],
    cheatPath: 'Returning a cached asset for a known prompt — the prompt catalog rotates and includes novel combinations weekly. Returning a copyright-laundered scrape — the topology checks and the on-chain provenance of the model weights catch obvious dumps. Generating a pretty but unrelated mesh — CLIP alignment kills the score.',
  },
  customer: {
    leadOneLine: 'The customer outside Bittensor is the game / VR studio.',
    explanation: [
      'Game studios spend 30–50% of their art budget on asset creation, and most of those assets are background props that nobody will notice. 404—GEN turns text prompts into drop-in 3D assets via Unity and Blender plugins. The Unity plugin was the first blockchain-based genAI 3D plugin on the Unity Asset Store. The same pipeline also feeds the open dataset (404-GEN/404mini — 20K+ assets) that\'s become a reference for the open 3D research community.',
      'Concretely: indie studios use the plugin directly for runtime / pre-production assets; the dataset and model bounties are sold to AI labs building their own 3D foundation models.',
    ],
  },
  competitive: {
    scope: 'text-to-3D · 2026',
    rows: [
      { name: '404—GEN', subtitle: 'SN17', isSelf: true, approach: 'Incentivized tournament of 3D generative models — Gaussian Splatting + diffusion', access: 'open · Unity/Blender plugin', accessTone: 'open', differentiator: 'Multi-architecture competition · open dataset · plugin-native' },
      { name: 'Meshy', approach: 'Centralized text-to-3D SaaS with proprietary model', access: 'closed · paid', accessTone: 'closed', differentiator: 'Polished UX · single model · subscription pricing' },
      { name: 'Luma AI', approach: 'NeRF-first 3D capture + generation, mostly photo-to-3D', access: 'closed · paid', accessTone: 'closed', differentiator: 'Best photo-to-3D capture · weaker on text prompts' },
      { name: 'CSM', approach: 'Common Sense Machines — closed text-to-3D foundation model', access: 'closed · API', accessTone: 'closed', differentiator: 'Research-grade quality · expensive · slow API' },
      { name: 'TripoSR / OpenAI Shap-E', approach: 'Open-weights text-to-3D research models', access: 'open weights', accessTone: 'open', differentiator: 'Free to run · no curation · no integration layer' },
    ],
    note: 'Centralized players ship one model and lock it behind an API. 404—GEN runs the multi-architecture competition and ships the Unity/Blender plugins that game studios actually want. If the model landscape keeps shifting (it will), the subnet upgrades automatically — the next-best 3D architecture just registers as a miner.',
  },
  team: {
    intro: [
      '404 Repo is the team operating subnet 17. They wrote the validator, ship the Unity and Blender plugins, and maintain the open 3D dataset. The team has a heavy graphics / 3D research background and partners with Unity for distribution.',
      'The pitch they make: every virtual world ever built needed millions of assets. 404—GEN is the supply layer for that — a runtime-generation pipeline backed by a competitive subnet, not a single model.',
    ],
    founders: [
      { initials: '40', gradient: 'v', name: '[Founder 1 name]', role: 'Co-founder · technical', bio: 'Background in 3D research and rendering. Owns the validator and the score function.', github: 'https://github.com/404-Repo' },
      { initials: '4R', gradient: 'a', name: '[Founder 2 name]', role: 'Co-founder · product', bio: 'Owns the Unity / Blender plugins and game-studio partnerships.' },
    ],
    size: '~6–10',
    founded: '2024 · April mainnet launch',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·04', text: 'Subnet 17 registered on Bittensor mainnet by 404 Repo.' },
    { date: '2024·Q3', text: 'Discord bot live — community can generate 3D from text in real time.' },
    { date: '2024·Q4', text: 'Blender plugin shipped.' },
    { date: '2025·Q1', text: 'Unity Asset Store plugin — first blockchain-based genAI 3D plugin on the platform.' },
    { date: '2025·Q3', text: '404-GEN/404mini dataset released — 20,000+ text-to-3D pairs.' },
    { date: '2026·Q1', text: 'Roadmap pivots toward runtime asset generation inside live games.' },
  ],
  join: {
    title: 'Submit a 3D generation model',
    body: 'Hardware spec (24GB+ VRAM), install commands, and the reference miner stack are in the 404-Repo/three-gen-subnet README. The validator stack and integration tests are open-source.',
    asideNote: 'Validating? Requires a top-N stake and a rendering pipeline. Validator code in the same repo.',
  },
  tags: ['ai-model', '3d', 'gaming', 'metaverse', 'incentive'],
  external: {
    github: 'https://github.com/404-Repo/three-gen-subnet',
    website: 'https://404.xyz',
    twitter: 'https://twitter.com/404gen_',
    taostats: 'https://taostats.io/subnets/17/',
  },
};
