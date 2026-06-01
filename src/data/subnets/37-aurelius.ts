import type { RichSubnet } from '../subnet-rich';

export const sn37: RichSubnet = {
  slug: '37-aurelius',
  netuid: 37,
  name: 'Aurelius',
  shortPitch: 'Decentralized AI alignment red-teaming that produces high-signal safety datasets.',
  overview: [
    'Aurelius is an AI alignment subnet on Bittensor operated by the Aurelius Protocol team. The network crowdsources adversarial red-teaming of large language models: independent miners aggressively probe target LLMs to surface misaligned, harmful, false or unethical behavior, and the protocol turns those failures into structured, verifiable training data that downstream labs can use to make safer models.',
    'A continuous loop of miners (adversarial prompters), validators (graders of attack quality), and a higher-level "Tribunate" governance layer keeps the dataset honest. Validators score each attack on novelty, severity, and reproducibility, and weights aggregate through Yuma consensus so that miners are paid only for genuinely new misalignment signal rather than recycled jailbreaks.',
    'The customer is anyone training or auditing frontier models: foundation-model labs, alignment researchers, safety teams, and downstream fine-tuners who need a steady stream of adversarial coverage that internal red teams cannot match in volume. Outputs flow into RLHF pipelines, eval suites, and interpretability work.',
    'Differentiator: alignment data as a live, incentive-driven feed rather than a one-off contract, with on-chain provenance and continuous adversarial pressure. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue target', body: 'Validators select a target LLM and a topic frame, then broadcast the red-team brief to miners across the subnet.', dataK: 'payload', dataV: 'target model + topic' },
    compute:   { actor: 'Miner',     title: 'Adversarial prompt', body: 'Miners craft adversarial prompts and submit transcripts where the target model produced a misaligned response.', dataK: 'latency',  dataV: 'per-prompt' },
    score:     { actor: 'Validator', title: 'Grade attack', body: 'Validators re-run and grade each transcript on severity, novelty, and reproducibility, then commit weights.', dataK: 'scale',    dataV: 'novelty × severity' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Generates adversarial prompts that elicit misaligned behavior from target LLMs.', input: 'Validator brief: target model, topic, constraints.', output: 'Transcript + classification of the alignment failure.', hardware: 'Modest GPU or API budget — the work is creative prompting, not raw FLOPs.', paidFor: 'Novel, reproducible misalignment cases that validators verify.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Re-runs adversarial transcripts against the target model and grades them.', requires: 'Access to the target model API + judging rubric for novelty/severity.', output: 'Per-miner weight vector reflecting attack quality.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Score = novelty × severity × reproducibility of the misalignment surfaced.', explanation: [
    'Validators grade each transcript on whether the failure is genuinely new, how harmful it is, and whether the same prompt reliably reproduces the behavior. Duplicates of known jailbreaks score near zero; novel failure modes that survive replay score highest.',
    'Because the Tribunate layer and consensus median punish stylistic noise, miners cannot win by churning shallow variations — the gradient pushes the network toward broader coverage of the failure surface.',
  ], cheatPath: 'Resubmitting known jailbreaks, generating "shock" outputs without real safety signal, or colluding with validators — duplicates and unreproducible attacks are dropped.' },
  customer:  { leadOneLine: 'Frontier model labs, alignment researchers, and downstream fine-tuners who need live adversarial coverage.', explanation: [
    'Internal red teams are slow and expensive. Aurelius gives buyers a continuously refreshed dataset of adversarial transcripts annotated with severity, target model, and failure category — material that plugs directly into RLHF, eval harnesses, and interpretability studies.',
    'On-chain provenance also matters for safety audits: every transcript has a verifiable miner, validator score, and timestamp, which makes the data citable in safety cards and regulatory filings in ways closed vendor data is not.',
  ] },
  competitive: { scope: '2026 · global · alignment data', rows: [
    { name: 'Aurelius', subtitle: 'SN37', isSelf: true, approach: 'Open adversarial red-team network with on-chain provenance.', access: 'open · API', accessTone: 'open', differentiator: 'Continuous decentralized attack pressure; every transcript verifiable.' },
    { name: 'Scale AI / Surge', approach: 'Hand-recruited human red teamers under contract.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Vetted humans, but slow, expensive, lab-specific.' },
    { name: 'Anthropic / OpenAI internal RT', approach: 'In-house red teams + safety researchers.', access: 'closed', accessTone: 'closed', differentiator: 'Deep but private; data does not flow to outside labs.' },
    { name: 'HackerOne AI / bug bounties', approach: 'Crowd bounties for AI failures.', access: 'open · bounty', accessTone: 'open', differentiator: 'Episodic campaigns, not a continuous dataset feed.' },
    { name: 'Academic red-team datasets', approach: 'Static benchmark releases (HarmBench, etc.).', access: 'open · static', accessTone: 'open', differentiator: 'Frozen snapshots; saturate quickly against new models.' },
  ], note: 'Aurelius competes less on "best single attack" and more on uptime: the only continuously-refreshed adversarial feed with public provenance against current frontier models.' },
  team: { intro: [
    'Aurelius is led by Austin McCaffrey, who authored the protocol whitepaper and now operates the subnet under the Aurelius Protocol banner. The team frames alignment as an emergent property of continuous adversarial pressure rather than a fixed safety target.',
    'The project publishes on Medium and Substack (including via Macrocosmos AI) and maintains an open GitHub org. Public team detail beyond the founder is limited.',
  ], founders: [
    { initials: 'AM', gradient: 'v', name: 'Austin McCaffrey', role: 'Founder', bio: 'Author of the Aurelius whitepaper and project lead; writes publicly on alignment as a living engineering discipline.' },
  ], size: 'Small core team', founded: '2024', based: 'Not publicly disclosed.', backers: 'Not publicly disclosed.', placeholder: false },
  milestones: [
    { date: '2024', text: 'Aurelius Protocol takes ownership of Subnet 37 and bootstraps the alignment platform.' },
    { date: '2024·Q4', text: 'Initial whitepaper and Medium launch post published.' },
  ],
  join: { title: 'Help red-team the frontier', body: 'Run a miner if you have a knack for breaking models, or a validator if you can grade attacks rigorously. Researchers and labs can pull the adversarial dataset through the protocol.', asideNote: 'Start with the launch post and GitHub org before registering.' },
  tags: ['alignment', 'red-team', 'safety', 'datasets'],
  external: { github: 'https://github.com/Aurelius-Protocol', website: 'https://medium.com/aurelius-protocol', taostats: 'https://taostats.io/subnets/37/' },
  tweets: [],
};
