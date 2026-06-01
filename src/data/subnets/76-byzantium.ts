import type { RichSubnet } from '../subnet-rich';

// Note: the netuid 76 slot has been publicly associated with both "Safe Scan"
// (decentralized cancer-detection vision subnet) and a current taostats ticker
// "ByzantiumSN76". The two appear to refer to the same slot at different points
// in its history, and current operating identity is not unambiguous in public sources.

export const sn76: RichSubnet = {
  slug: '76-byzantium',
  netuid: 76,
  name: 'Byzantium',
  shortPitch: 'Bittensor subnet 76 — decentralized AI inference scored on real-world medical and signal tasks.',
  overview: [
    'Byzantium is the current public label for Bittensor subnet 76, which the taostats ticker lists as ByzantiumSN76. The netuid 76 slot has been operated under the Safe Scan brand — a decentralized cancer-detection vision project (initially skin / melanoma, with breast and lung as planned expansions) founded by Mateusz Woźniak and Wojciech Jurkowlaniec. The relationship between the Byzantium label and the Safe Scan codebase is not unambiguously documented in public sources at the time of this writing.',
    'On the technical side, the subnet runs the canonical Bittensor pattern: miners deploy AI inference models against labelled medical-image tasks, validators evaluate model outputs on held-out test data, and the highest-performing models win emission. The open repository at github.com/safe-scan-ai/cancer-ai is the most public artefact tied to the slot.',
    'The downstream customer profile for the Safe Scan thesis is healthcare — providing free AI-powered cancer-screening tools to anyone, with model improvements compounded by an open mining tournament. Under a Byzantium re-positioning, the customer surface may be broader or different; this profile should be updated when the operator publishes a definitive identity.',
    'One-line diff: an inference tournament with healthcare-grade target metrics rather than general-purpose model serving. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Publish task', body: 'Validator publishes an inference task (e.g. medical image classification) with a labelled test split and a deadline.', dataK: 'payload', dataV: 'task + test split' },
    compute:   { actor: 'Miner',     title: 'Run inference', body: 'Miner deploys an AI model and runs inference on the task batch, returning predictions to the validator.', dataK: 'latency',  dataV: 'per-image ms' },
    score:     { actor: 'Validator', title: 'Eval predictions', body: 'Validator scores miner predictions against ground truth on the held-out split; top-F1 / top-AUC models win.', dataK: 'metric',  dataV: 'F1 / AUC' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Deploys AI inference models against validator-published tasks (historically cancer-detection vision models under Safe Scan).',
    input: 'Task batch with labelled training data and unlabelled inference items.',
    output: 'Predicted labels / probabilities for each test item.',
    hardware: 'GPU sized to the task — single A100/H100-class for typical medical-image classification workloads.',
    paidFor: 'Producing the highest-F1 / AUC predictions on the held-out test split.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Publishes tasks, evaluates miner predictions against held-out labelled data, ranks by task metric, and writes weights on-chain.',
    requires: 'Labelled dataset access and GPU for evaluation, plus min-stake to register as a Bittensor validator.',
    output: 'Per-miner weight vector ranking model accuracy.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Best F1 / AUC on held-out labelled medical-image data wins.',
    explanation: [
      'Validators score each miner\'s predictions against a labelled held-out test split. For cancer-screening tasks the natural target metrics are F1 and AUC on a balanced or class-weighted split that reflects clinical priors (false negatives weighted more than false positives).',
      'The trust assumption is that the labelled ground truth is genuinely high quality. In the Safe Scan design this means partnering with dermatology and oncology datasets that have expert-annotated labels — the bottleneck on subnet usefulness is the quality and breadth of those labelled corpora.',
    ],
    cheatPath: 'The standard attacks are over-fitting to public datasets (ISIC, etc.) or scraping the validator\'s test set if it leaks. The intended counter is private validator-held splits drawn from partnered medical datasets. The residual risk is that miners ensemble or query foundation-model APIs in ways that move all the differentiation upstream.',
  },
  customer: {
    leadOneLine: 'Under the Safe Scan thesis — anyone needing free, accessible AI-powered cancer screening; under a Byzantium re-positioning, scope may differ.',
    explanation: [
      'Safe Scan\'s stated mission was to make advanced cancer-detection algorithms accessible and free, starting with skin (melanoma) and expanding to breast and lung. That orients the customer surface toward consumer-facing screening apps and clinical pilot programs, not toward inference-as-a-service buyers.',
      'If the slot is now operating under a Byzantium banner with a different remit, the customer profile should be re-authored when public materials are stable. For now, treat the customer description as inherited from the Safe Scan thesis.',
    ],
  },
  competitive: {
    scope: 'medical-image AI · 2026',
    rows: [
      { name: 'Byzantium', subtitle: 'SN76', isSelf: true, approach: 'Inference tournament on labelled medical-image tasks; historically operated as Safe Scan for cancer detection.', access: 'open · subnet model API', accessTone: 'open', differentiator: 'On-chain reward tied to held-out F1 / AUC on clinical-grade labels.' },
      { name: 'Google Health (DermAssist / lung CT)', approach: 'Centralized clinical AI from Google Health and DeepMind partnered with hospital systems.', access: 'closed · partner systems', accessTone: 'closed', differentiator: 'State-of-the-art performance but closed; available only through Google products and partnerships.' },
      { name: 'PathAI', approach: 'Centralized pathology AI for cancer diagnostics, sold to labs and pharma.', access: 'closed · enterprise contract', accessTone: 'closed', differentiator: 'Enterprise-grade clinical AI; not consumer-accessible and not a public tournament.' },
      { name: 'Aidoc / Lunit', approach: 'FDA-cleared radiology AI products integrated into hospital PACS workflows.', access: 'closed · clinical deployment', accessTone: 'closed', differentiator: 'Regulatory-cleared clinical deployment; not open inference and not free at point of use.' },
      { name: 'Kaggle / Grand Challenge benchmarks', approach: 'Academic and competition leaderboards on labelled medical-imaging tasks.', access: 'open · public benchmark', accessTone: 'open', differentiator: 'Leaderboard-only; no ongoing incentive to deploy and serve the best model.' },
    ],
    note: 'The wedge under the Safe Scan thesis is being a free-at-point-of-use consumer screening tool backed by a continuous on-chain tournament. The trade-off vs Google Health / Aidoc / Lunit is regulatory clearance and clinical workflow integration; vs Kaggle the trade-off is that the leaderboard pays out and persists rather than expiring at competition end.',
  },
  team: {
    intro: [
      'The netuid 76 slot has been most publicly associated with Safe Scan, founded by Mateusz Woźniak and Wojciech Jurkowlaniec, with the cancer-AI codebase published at github.com/safe-scan-ai/cancer-ai. Whether the current "Byzantium" label refers to the same operating team or a new one is not unambiguously documented in public sources.',
      'This team block should be re-authored when an authoritative public statement clarifies the relationship between the Byzantium label and the Safe Scan project.',
    ],
    founders: [
      { initials: 'MW', gradient: 'v', name: 'Mateusz Woźniak', role: 'Co-founder · Safe Scan (historical SN76 operator)', bio: 'Co-founder of Safe Scan, the decentralized cancer-detection project historically operating netuid 76.' },
      { initials: 'WJ', gradient: 'a', name: 'Wojciech Jurkowlaniec', role: 'Co-founder · Safe Scan (historical SN76 operator)', bio: 'Co-founder of Safe Scan, the decentralized cancer-detection project historically operating netuid 76.' },
    ],
    size: 'Not publicly disclosed.', founded: '2024', based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·Q4', text: 'Subnet 76 registered; Safe Scan team begins decentralized cancer-detection mining.' },
    { date: '2025·Q3', text: 'Public discussion of an SN76 flash-crash / anomaly episode reported in community write-ups.' },
    { date: '2026·Q1', text: 'Taostats label observed as ByzantiumSN76; relationship to Safe Scan project not unambiguously documented.' },
  ],
  join: {
    title: 'Run inference on SN76',
    body: 'Miners install from github.com/safe-scan-ai/cancer-ai (historical Safe Scan stack) and register on netuid 76. Validate current operator and stack against taostats before deploying.',
    asideNote: 'Operator identity not fully settled in public sources at time of writing. Live state on taostats.io/subnets/76/.',
  },
  tags: ['medical AI', 'healthcare', 'computer vision', 'cancer detection'],
  external: {
    github: 'https://github.com/safe-scan-ai/cancer-ai',
    taostats: 'https://taostats.io/subnets/76/',
  },
};
