import type { RichSubnet } from '../subnet-rich';

export const affine: RichSubnet = {
  slug: '120-affine',
  netuid: 120,
  name: 'Affine',
  shortPitch: 'Tournament-style RL subnet where miners forge reasoning models that beat the reigning champion.',
  overview: [
    'Affine is Bittensor Subnet 120, an incentivized reinforcement-learning environment operated by the Affine Foundation under Bittensor co-founder Jacob Steeves (@const_reborn). It commoditizes reasoning by paying TAO emissions to whichever open-weights model currently sits on the Pareto frontier of a fixed evaluation suite.',
    'Miners pull the current champion model from HuggingFace, fine-tune it with RL on reasoning environments (SAT, DED-V2 deduction, ABD-V2 abduction, program synthesis), and commit the new model/revision pair on-chain. Validators run every challenger against the reigning champion across all environments back-to-back; a challenger only dethrones the champion by winning strictly across every environment by a per-env margin. Task pools refresh roughly every 7,200 blocks (~24h).',
    'Outside Bittensor, every winning model is auto-deployed to Chutes (SN64) for public inference via API, so the "customer" is anyone calling that endpoint — independent developers, agent builders, and downstream subnets buying open reasoning capacity instead of paying a closed lab.',
    'One-line diff: a permissionless, winner-takes-all reasoning leaderboard whose champion is the open-source counterpart to o-series and DeepSeek-R1. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue reasoning batch', body: 'Validator pulls a fresh batch of prompts from the active environment suite (SAT, DED-V2, ABD-V2, program synthesis) and sends them to every queued challenger model and the current champion.', dataK: 'payload', dataV: 'multi-env reasoning prompts' },
    compute:   { actor: 'Miner',     title: 'Run RL-tuned model', body: 'Miner serves their HuggingFace-hosted model (registered on-chain) and returns reasoning traces / solutions for the batch. Models are run inside Docker via Affinetes; validators host inference through Targon or operator infra.', dataK: 'latency',  dataV: 'inference per prompt' },
    score:     { actor: 'Validator', title: 'Pareto-frontier check', body: 'Validator grades each trace per environment, then runs the challenger vs. champion head-to-head. Only a model that wins strictly across every environment by the per-env margin replaces the champion and captures emissions; losers are terminated.', dataK: 'scale',    dataV: 'winner-takes-all' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Fine-tune the reigning champion with RL (GRPO, PPO, multi-objective) on reasoning tasks, upload weights to HuggingFace, and commit the model/revision on-chain as a challenger.',
    input: 'Current champion weights + Affine env specs (SAT, DED-V2, ABD-V2, program synthesis)',
    output: 'New HuggingFace model + on-chain commitment',
    hardware: 'GPUs for RL fine-tuning (sized to base model; typically multi-GPU node)',
    paidFor: 'Becoming the new Pareto-frontier champion across every environment',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Host inference for the queue of pending miner models, run them against the current champion across all environments, set weights on the Pareto-frontier winner.',
    requires: 'GPU inference capacity (or Targon access), Affine validator stack, registered Bittensor validator hotkey',
    output: 'Weight vector concentrating emission on the current champion',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Winner-takes-all across a Pareto frontier of reasoning environments.',
    explanation: [
      'A challenger is evaluated against the reigning champion on every environment in the active suite — SAT, DED-V2 (deduction), ABD-V2 (abduction), and program-synthesis tasks. The challenger only takes the throne by winning strictly across all environments by a per-environment margin; losing on any single environment terminates the run.',
      'The new champion absorbs effectively all subnet emissions until dethroned. Task pools refresh roughly every 7,200 blocks (~24h), which forces continuous re-grading and prevents stale champions. The mechanism is explicitly designed to be sybil-proof, decoy-proof, copy-proof, and overfitting-proof: multiple identities don\'t help, decoy models can\'t hide a real one, copying the champion verbatim can\'t beat it on margin, and overfitting to one task fails the strict-across-all-envs rule.',
    ],
    cheatPath: 'The obvious attack is overfitting to one environment\'s public examples — defeated by the strict-across-all-envs win condition. Copy-paste of the champion fails because the per-env margin requires actual improvement. A subtler attack is colluding validators voting for a private model, but Yuma\'s stake-weighted consensus median punishes deviation from the public Pareto-frontier evaluation.',
  },
  customer: {
    leadOneLine: 'Anyone calling the open reasoning API on Chutes — and the broader open-weights research community downloading the champion from HuggingFace.',
    explanation: [
      'Affine auto-deploys every winning model to Chutes (SN64) for public inference, so external developers, agent frameworks, and downstream Bittensor subnets can hit a live API that always points at the current open-source reasoning frontier. There is no separate Affine paywall — demand-side capture happens through Chutes\' usage-priced endpoints and through HuggingFace downloads of the weights.',
      'In practice the customer surface today is research / dev-tooling rather than enterprise: teams who want a non-closed, continually-improving alternative to o-series or Claude extended thinking for code, math, and structured reasoning workloads. Reviewers have flagged the lack of explicit customer-facing pricing as the main commercial open question.',
    ],
  },
  competitive: {
    scope: 'frontier reasoning models · 2026',
    rows: [
      { name: 'Affine', subtitle: 'SN120', isSelf: true, approach: 'Permissionless tournament; miners RL-tune open weights to beat the champion across SAT / DED / ABD / program-synth.', access: 'open weights · API via Chutes', accessTone: 'open', differentiator: 'Only continuously-improving open reasoning model with on-chain provenance and TAO-paid contributors.' },
      { name: 'OpenAI o-series', approach: 'Closed RLHF + large-scale RL on chain-of-thought; o1 / o3 family with hidden reasoning tokens.', access: 'closed · paid API', accessTone: 'closed', differentiator: 'State-of-the-art on most reasoning benchmarks but fully proprietary; reasoning traces hidden from users.' },
      { name: 'DeepSeek-R1', approach: 'Open-weights reasoning model trained with large-scale RL (GRPO); released by DeepSeek with full weights.', access: 'open weights · self-host', accessTone: 'open', differentiator: 'Single-shot open release from one lab; no built-in mechanism for continuous community improvement.' },
      { name: 'Claude extended thinking', approach: 'Anthropic Claude family with extended-thinking mode for visible step-by-step reasoning.', access: 'closed · paid API', accessTone: 'closed', differentiator: 'Visible reasoning trace and strong tool-use, but closed weights and centralized roadmap.' },
      { name: 'Gemini Deep Think', approach: 'Google DeepMind reasoning mode that runs parallel thinking traces and aggregates.', access: 'closed · paid API', accessTone: 'closed', differentiator: 'Massive context and multimodal reach; fully proprietary, no contributor incentive layer.' },
    ],
    note: 'Closed labs (OpenAI, Anthropic, Google) dominate raw benchmark scores but ship as black boxes on a quarterly cadence. DeepSeek-R1 proved open-weights reasoning can be competitive, but it is a single artifact from a single lab. Affine\'s thesis is that the right unit isn\'t a model but a mechanism: a 24-hour tournament that any GPU operator can enter, with the champion auto-deployed for public use. Whether that compounds fast enough to close the closed-lab gap is the live experiment.',
  },
  team: {
    intro: [
      'Affine is led by Jacob Steeves (pseudonym "Const", @const_reborn) — co-founder of Bittensor itself — operating under the Affine Foundation. The project explicitly positions itself as a higher-order coordinator rather than just another specialised subnet, bridging Chutes (SN64) hosting with continuously-trained reasoning models.',
      'Beyond Const, named team members are not publicly disclosed; the foundation hires research engineers (ML/RL), protocol engineers, and developer-relations roles publicly, and the project is noted for strong participation from the Chinese AI developer community. The codebase is open under AffineFoundation on GitHub.',
    ],
    founders: [
      { initials: 'JS', gradient: 'v', name: 'Jacob Steeves ("Const")', role: 'Founder · Bittensor co-founder', bio: 'Co-founder of Bittensor and the original architect of its incentive mechanism. Launched Affine as a directed RL competition on top of the network he helped build.', twitter: 'https://twitter.com/const_reborn', github: 'https://github.com/AffineFoundation' },
    ],
    size: 'Small core team + open-source contributors',
    founded: '2025',
    based: 'Distributed / remote',
    backers: 'Affine Foundation (no disclosed external investors).',
    placeholder: true,
  },
  milestones: [
    { date: '2025·07', text: 'Subnet 120 registered on Bittensor; first public discussion of Affine as Const\'s new RL subnet.' },
    { date: '2025·09', text: 'Affine reaches top-3 by emission share, briefly claiming #1 ahead of Chutes.' },
    { date: '2026·04', text: 'Market cap ~$66M reported by third-party trackers; FDV in high $500M range.' },
  ],
  join: {
    title: 'Mine the reasoning frontier',
    body: 'Pull the current champion from HuggingFace, fine-tune with RL on the published environments, upload weights, and commit on-chain. Validators run the tournament for you — if your model wins across every environment by margin, emissions flip to you on the next tempo.',
    asideNote: 'Setup: AffineFoundation/affine-cortex on GitHub · docs/MINER.md and docs/VALIDATOR.md · live dashboard at affine.io · Discord for env updates.',
  },
  tags: ['reasoning', 'reinforcement-learning', 'open-weights', 'tournament', 'pareto-frontier'],
  external: {
    github: 'https://github.com/AffineFoundation/affine-cortex',
    website: 'https://www.affine.io/',
    twitter: 'https://x.com/affine_io',
    taostats: 'https://taostats.io/subnets/120/',
  },
  tweets: [
    { when: '2025·08', body: '"So @const_reborn talked a bit earlier about his Subnet 120 … as the co-founder of Bittensor, everyone will naturally expect a huge amount from Jake. What he and @shibshib89 have birthed into the world over the last few years is nothing short of monumental." — @JosephJacks_' },
    { when: '2025·09', body: '"What Affine (Subnet 120) Does in Bittensor — owner @const_reborn @affine_io. It\'s a reinforcement learning (RL) engine where miners compete to train and improve models. Tasks include program induction, reasoning…" — @Gabensor_tt' },
  ],
};
