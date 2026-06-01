import type { RichSubnet } from '../subnet-rich';

export const sn29: RichSubnet = {
  slug: '29-coldint',
  netuid: 29,
  name: 'Coldint',
  shortPitch: 'Decentralized incentivized training of small, domain-specialized models.',
  overview: [
    'Subnet 29 — Coldint, short for "Collective Distributed Incentivized Training" — is a research-flavoured pre-training subnet on Bittensor. It was started as a fork of subnet 9\'s pretraining mechanism by two long-time Bittensor miners under the handle coldint (coldint.io, github.com/coldint), with the explicit goal of incentivising contribution of niche pretrained models rather than just one large monolithic LLM.',
    'Validators download miner-submitted models from HuggingFace, reset weights when necessary, evaluate them on held-out datasets, and write per-miner weights based on accuracy and parameter/FLOPs efficiency. The repo provides validator and miner code (coldint/coldint_validator), and the project openly publishes its design philosophy on coldint.io including "suitable subnet subjects" for new task domains.',
    'The customer is research-adjacent: open-source ML practitioners, builders fine-tuning small specialized LLMs, and the broader Bittensor "training subnet" stack (SN9 IOTA, SN56 Gradients, SN37). The output is a stream of public HuggingFace checkpoints under huggingface.co/coldint that anyone can download.',
    'In 2025 the subnet pivoted toward AI Agent Safety & Security under the name "AI-ASSeSS", repositioning Coldint as the first Bittensor subnet focused on safety-evaluation benchmarks. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue eval task', body: 'Validator fetches the latest miner-submitted model URLs from the chain (HuggingFace links), pulls the model weights, and prepares the held-out evaluation dataset for the current task.', dataK: 'payload', dataV: 'HF model URL + eval dataset' },
    compute:   { actor: 'Miner',     title: 'Train + publish', body: 'Miner trains a small specialized model offline on their own GPUs, uploads weights to HuggingFace, and points the chain at the new checkpoint via subnet-specific metadata.', dataK: 'latency',  dataV: 'training-bounded, not request-bounded' },
    score:     { actor: 'Validator', title: 'Eval + Pareto', body: 'Validator runs the model against held-out tasks, scoring on accuracy, parameter count, and FLOPs; only miners on the Pareto frontier of (accuracy × cost) earn meaningful weight.', dataK: 'scale', dataV: 'accuracy · params · FLOPs' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Pre-trains small specialized models on its own GPUs, uploads weights to HuggingFace under coldint/<model>, registers them on-chain.',
    input: 'Public task definition from the subnet (datasets, eval splits, target domain).',
    output: 'A versioned HuggingFace checkpoint plus chain-side metadata pointing validators at the new weights.',
    hardware: 'Local GPU rig (single H100 to small multi-GPU clusters), HuggingFace account, stable upload bandwidth.',
    paidFor: 'Sitting on the Pareto frontier of accuracy vs parameters vs FLOPs for the current task; sharing improvements rather than hoarding.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Tracks chain-side miner metadata, pulls each candidate model from HuggingFace, evaluates on held-out data, computes Pareto weights, and writes them on-chain.',
    requires: 'Stake plus a GPU host able to load and evaluate candidate models; the coldint_validator codebase from the public repo.',
    output: 'Per-miner weight vector reflecting eval accuracy normalized by parameter and compute cost.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Multi-objective Pareto on accuracy, parameter count, and FLOPs — efficient small models beat blind scale.',
    explanation: [
      'Unlike SN9-style "largest valid loss wins" mechanisms, Coldint scores models on at least three axes: accuracy on a held-out task, total parameter count, and FLOPs at inference. Only models on the current Pareto frontier — i.e. you cannot strictly beat them on all three axes — receive meaningful weight, so a tiny model that holds its own on quality earns alongside a much larger one.',
      'Validators reset model weights when they evaluate, run a deterministic eval pipeline from the coldint_validator repo, and accumulate scores across a rolling window. Weights are written on-chain every tempo and Yuma consensus picks the median, so single-validator favouritism is punished automatically.',
    ],
    cheatPath: 'A miner can copy another miner\'s HuggingFace weights, overfit to the validator\'s eval split, or upload an enormous model that wins on accuracy but loses on cost. Deterministic eval + Pareto scoring kills both the "just go bigger" and "just copy and rehash" attacks; weight-resetting at eval prevents data-poisoning the published weights.',
  },
  customer: {
    leadOneLine: 'Open-source ML researchers and the Bittensor pretraining stack — the output is a public stream of small specialized HuggingFace models.',
    explanation: [
      'Coldint is fundamentally an OSS research subnet: the artefacts it produces are public checkpoints under huggingface.co/coldint, downloadable by anyone for fine-tuning, distillation, or composition. Downstream consumers include builders making domain-specific LLMs, the safety-eval pivot ("AI-ASSeSS"), and the broader Bittensor training stack composing Coldint outputs.',
      'There is no proprietary API and no enterprise SaaS layer; instead the team treats the chain itself as the distribution mechanism and the HuggingFace org as the registry. That makes Coldint less of a hosted "product" and more of a continuously-updating model factory at the protocol level.',
    ],
  },
  competitive: {
    scope: 'Bittensor pretraining / decentralized model training · 2026',
    rows: [
      { name: 'Coldint', subtitle: 'SN29', isSelf: true, approach: 'Multi-objective Pareto scoring (accuracy × params × FLOPs); fork-of-SN9 with explicit niche-model focus.', access: 'open · HF', accessTone: 'open', differentiator: 'Rewards efficient small specialized models; safety-eval pivot under AI-ASSeSS.' },
      { name: 'Pretraining', subtitle: 'SN9 (IOTA)', approach: 'Bittensor flagship pretraining subnet — now Macrocosmos IOTA, distributed pre-training of large foundation models.', access: 'open · HF', accessTone: 'open', differentiator: 'Larger ambition (foundation models); accuracy-focused rather than Pareto-cost-aware.' },
      { name: 'Gradients', subtitle: 'SN56', approach: 'Bittensor fine-tuning marketplace from Rayon Labs — users post jobs, miners compete on best fine-tunes.', access: 'open · API', accessTone: 'open', differentiator: 'Customer-driven fine-tuning jobs rather than open self-directed training.' },
      { name: 'OpenAI / Anthropic / Meta', approach: 'Centralized large-lab pretraining of monolithic frontier models, gated APIs.', access: 'closed · API', accessTone: 'closed', differentiator: 'Vastly more compute and data; no Pareto/efficiency objective; closed weights for closed models.' },
      { name: 'HuggingFace community fine-tuners', approach: 'Independent OSS contributors training and uploading small specialized models without incentive layer.', access: 'open · HF', accessTone: 'open', differentiator: 'No reward mechanism; quality depends entirely on individual contributor motivation.' },
    ],
    note: 'Coldint\'s competitive niche inside Bittensor is being explicit about cost: where SN9/IOTA chases foundation-model scale and SN56 chases bespoke fine-tunes, Coldint optimises directly for tiny-but-strong models, plus a pivot toward safety/security evals that few subnets address head-on.',
  },
  team: {
    intro: [
      'Coldint is run by a small two-person team known on Bittensor as "coldint" — RWH and a co-builder, both mining the network since Q1 2024. RWH holds a PhD in experimental quantum physics; their public writing on coldint.io leans heavily on incentive-mechanism design.',
      'The stated philosophy is that decentralized pretraining only works when efficient models win, not just big ones, and that the subnet should evolve toward whatever task class is most underserved — hence the 2025 pivot toward AI Agent Safety & Security under the AI-ASSeSS brand.',
    ],
    founders: [
      { initials: 'RW', gradient: 'v', name: 'RWH (handle)', role: 'Co-founder, Coldint', bio: 'PhD in experimental quantum physics; long-time Bittensor miner since early 2024; writes the design notes on coldint.io.', github: 'https://github.com/coldint' },
      { initials: 'C2', gradient: 'a', name: '[Coldint co-founder]', role: 'Co-founder, Coldint', bio: 'Second member of the coldint pair; co-registered SN29 in July 2024 and co-maintains the validator codebase.', github: 'https://github.com/coldint' },
    ],
    size: '~2 (core)', founded: '2024·07 (subnet registration)', based: 'Not publicly disclosed.',
    backers: 'No public funding round disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·07', text: 'Subnet 29 registered as Coldint by two long-time Bittensor miners after forking SN9 pretraining mechanism.' },
    { date: '2024', text: 'coldint_validator and miner repos open-sourced; HuggingFace org huggingface.co/coldint hosts winning checkpoints.' },
    { date: '2025', text: 'Subnet rebrands toward "AI-ASSeSS" (AI Agent Safety & Security) — first Bittensor subnet explicitly framed around safety evals.' },
  ],
  join: {
    title: 'Train a Coldint model',
    body: 'Pre-train a small specialized model on your own GPUs, push it to HuggingFace, and register on subnet 29. Validator code, miner code, and the active task definition all live at github.com/coldint.',
    asideNote: 'Pareto scoring means small efficient wins matter — you do not need a foundation-model rig to compete.',
  },
  tags: ['pretraining', 'training', 'research', 'safety', 'open-source'],
  external: {
    github: 'https://github.com/coldint',
    website: 'https://coldint.io',
    taostats: 'https://taostats.io/subnets/29/',
  },
};
