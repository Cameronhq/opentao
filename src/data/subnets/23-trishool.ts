import type { RichSubnet } from '../subnet-rich';

export const sn23: RichSubnet = {
  slug: '23-trishool',
  netuid: 23,
  name: 'Trishool',
  shortPitch: 'A Bittensor subnet for decentralized AI alignment and red-teaming.',
  overview: [
    'Trishool is the subnet operated by Trishool AI for decentralized AI alignment. Miners submit adversarial prompts and attack strategies designed to elicit misalignment from target large language models. Validators use Petri-style alignment auditing agents to test the attacks and score miners on the severity and novelty of the failures they surface.',
    'The subnet uses a standard metagraph. Each tempo the validator picks a target model and a behavior category — deception, sycophancy, manipulation, overconfidence, power-seeking — and broadcasts the brief to active miners. Miners return seed prompts and attack chains. The validator runs the Petri auditor to test them and scores by elicited-misalignment rate.',
    'The customer outside Bittensor is anyone deploying a large language model in production who needs continuous, market-validated proof of robustness. Trishool already counts Chutes (SN64) as a customer for guardrails. The pitch is "humanity\'s last defense against runaway AI" — a decentralized red team that scales alongside the models it audits.',
    'Where centralized red-teaming firms (Apollo Research, Haize Labs) ship a static audit, Trishool runs a continuous tournament that improves automatically as models get smarter. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Pick target + behavior', body: 'Choose a target model and a misalignment category — deception, sycophancy, power-seeking — and broadcast the brief to active miners.', dataK: 'payload', dataV: 'Target model + behavior category' },
    compute:   { actor: 'Miner',     title: 'Craft attack prompts', body: 'Each miner returns seed instructions and attack chains designed to elicit the target misalignment behavior from the model under test.', dataK: 'latency',  dataV: 'Continuous · per-tempo batch' },
    score:     { actor: 'Validator', title: 'Run Petri audit', body: 'Run the Petri alignment-auditing agent on the attack prompts. Score by elicited-misalignment rate, novelty, and severity of the failure surfaced.', dataK: 'scale', dataV: 'severity × novelty × rate' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Crafts adversarial prompts and attack chains that probe target models for misalignment.',
    input: 'Target model + behavior category brief',
    output: 'Seed prompts + multi-turn attack chains',
    hardware: 'Mid-tier GPU for prompt generation; light compute',
    paidFor: 'Eliciting novel, severe misalignment from the target model',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Runs Petri-style alignment audits on miner-submitted attacks and scores by severity and novelty.',
    requires: 'Top-N stake + Petri-auditor stack + target-model access',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Find a way to make the model misbehave — the worse, the better.',
    explanation: [
      'The validator selects a target model and a misalignment category. Miners craft seed prompts and multi-turn attack chains designed to elicit the targeted behavior — manipulation, deception, sycophancy, overconfidence, power-seeking. The validator then runs the Petri alignment-auditing agent (an automated framework for probing LLM behavior) on the submitted attacks and scores by elicited-misalignment rate, novelty vs prior attacks, and severity of the failure surfaced.',
      'The published architecture emphasizes shaping activations rather than blocking output — Trishool aims to encode safety into the model\'s cognitive stream itself. The system creates continuous adversarial pressure: as defenses improve, the network rewards more creative attacks.',
    ],
    cheatPath: 'Recycling known jailbreaks — novelty term kills the score. Generating attacks that fail the auditor reliably — zero elicited misalignment, zero reward. Sycophantic prompts that produce mild misbehavior — severity term keeps the score low. The validator catalog rotates target models and categories to defeat any static attack library.',
  },
  customer: {
    leadOneLine: 'The customer outside Bittensor is anyone deploying an LLM in production.',
    explanation: [
      'Every serious LLM deployment needs ongoing red-teaming, and the supply of qualified red-teamers is the bottleneck. Trishool turns that into a market: anyone can mine, the chain rewards the best attackers, and customers buy the resulting safety report or live guardrail layer. Trishool publicly counts Chutes (SN64) as a customer for guardrails — meaning the Trishool attack distribution is actively shaping defenses on one of Bittensor\'s largest subnets.',
      'Concretely: a customer points their model at the Trishool gateway, gets a continuous stream of attack attempts, and receives a structured report of elicited failures. The chain handles the supply side of attackers; the customer handles the response.',
    ],
  },
  competitive: {
    scope: 'AI red-teaming · 2026',
    rows: [
      { name: 'Trishool', subtitle: 'SN23', isSelf: true, approach: 'Incentivized tournament of red-teamers with Petri-style automated auditing', access: 'open · API', accessTone: 'open', differentiator: 'Continuous · novelty-weighted · live Chutes customer · Yuma Group backed' },
      { name: 'Apollo Research', approach: 'Specialist alignment-research firm doing bespoke audits', access: 'closed · service', accessTone: 'closed', differentiator: 'Top-tier reputation · slow + expensive · one-shot audit' },
      { name: 'Haize Labs', approach: 'Centralized automated red-teaming startup', access: 'closed · paid', accessTone: 'closed', differentiator: 'Single attack-generation model · subscription pricing' },
      { name: 'METR (eval)', approach: 'Non-profit dangerous-capabilities evals', access: 'open dataset', accessTone: 'open', differentiator: 'Capability evals · not focused on behavioral red-teaming' },
      { name: 'Anthropic / OpenAI internal red teams', approach: 'In-house red-teaming by frontier labs', access: 'closed · internal', accessTone: 'closed', differentiator: 'Resourced + targeted · scoped to one lab\'s models only' },
    ],
    note: 'Centralized red-teaming firms ship one audit per engagement. Trishool runs the audit continuously, with a novelty-weighted reward that pulls miners toward attacks nobody has tried yet. If alignment becomes a recurring P0 for every deployed LLM (and it will), the market wants exactly this: always-on, market-priced adversarial pressure.',
  },
  team: {
    intro: [
      'Trishool is operated by Trishool AI, led by Nav Kumar with Preeth as CTO and co-founder. The team has a background in AI alignment, mechanistic interpretability, and adversarial ML. Trishool is accelerated by the Yuma Group (Digital Currency Group\'s AI venture accelerator).',
      'The pitch they make: as models get smarter, the only defense that scales is a decentralized adversarial network that also gets smarter. Trishool builds the market for that — and is already shipping guardrails to Chutes, one of Bittensor\'s most-used compute subnets.',
    ],
    founders: [
      { initials: 'NK', gradient: 'v', name: 'Nav Kumar', role: 'Founder · CEO', bio: 'AI alignment researcher and Trishool founder. Background in mechanistic interpretability and rogue-LLM behavior. Talks publicly about alignment, mech interp, and subnet 23 (podcast Ep. 75).' },
      { initials: 'PR', gradient: 'a', name: 'Preeth', role: 'Co-founder · CTO', bio: 'Co-founder and CTO. Leads the validator + auditor stack and the Petri-integration engineering.' },
    ],
    size: 'Small core team (not publicly disclosed)',
    founded: '2024',
    based: 'Distributed',
    backers: 'Yuma Group (Digital Currency Group AI accelerator).',
    placeholder: false,
  },
  milestones: [
    { date: '2024', text: 'Subnet 23 launches as Trishool — decentralized AI alignment subnet.' },
    { date: '2025', text: 'Phase 2 architecture published — shaping activations rather than blocking output.' },
    { date: '2025·Q4', text: 'Yuma Group (DCG AI accelerator) backs Trishool publicly.' },
    { date: '2026·Q1', text: 'Chutes (SN64) signs on as a customer for Trishool-driven guardrails.' },
  ],
  join: {
    title: 'Find ways to make AI misbehave',
    body: 'Miner setup, attack-prompt template, and reference auditor are in TrishoolAI/trishool-subnet. Validators welcome — Petri auditor stack + top-N stake.',
    asideNote: 'Validating? Petri auditor + target-model API access + top-N stake. Reference validator code in the GitHub org.',
  },
  tags: ['ai-safety', 'red-team', 'alignment', 'guardrails'],
  external: {
    github: 'https://github.com/TrishoolAI',
    website: 'https://trishool.ai',
    twitter: 'https://twitter.com/trishoolai',
    taostats: 'https://taostats.io/subnets/23/',
  },
};
