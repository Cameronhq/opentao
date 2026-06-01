import type { RichSubnet } from '../subnet-rich';

export const sn72: RichSubnet = {
  slug: '72-streetvision-by-natix',
  netuid: 72,
  name: 'StreetVision by NATIX',
  shortPitch: 'Crowdsourced dashcam fleet training physical-AI models for mapping and self-driving.',
  overview: [
    'StreetVision is Bittensor subnet 72, launched by NATIX Network in May 2025. NATIX is a Solana-based DePIN of smart cameras and dashcam-equipped drivers that has crowdsourced more than 170 million km of street-level driving footage from a quarter-million contributors. The Bittensor subnet is NATIX\'s training and validation layer for the physical-AI models that run on those edge devices.',
    'On SN72, miners train and submit vision models for tasks the NATIX fleet needs — initial focus is real-time roadwork detection, expanding to potholes, signage, litter, and edge-case driving-scenario classification. Validators score models on held-out driving footage, and the best models are redeployed to NATIX\'s edge fleet (smartphones, dashcams) for real-time on-device inference.',
    'The customers are autonomous-driving teams, HD-map vendors, and physical-AI labs who need both the training data and the trained-and-deployed model loop. NATIX has publicly partnered with Valeo (open AI model for autonomous vehicles) and Grab (mapping expansion into the US and Europe).',
    'One-line diff: it is a closed sense-train-deploy loop with real edge hardware, not just a dataset or a model marketplace. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Publish task', body: 'Validator publishes a vision task (e.g. roadwork detection) with a labelled training set sourced from the NATIX driver fleet and a held-out evaluation split.', dataK: 'payload', dataV: 'task + footage' },
    compute:   { actor: 'Miner',     title: 'Train + submit', body: 'Miners train classification / detection models on the released footage and submit weights against the task deadline.', dataK: 'window',  dataV: 'per-task budget' },
    score:     { actor: 'Validator', title: 'Eval on held-out', body: 'Each model is evaluated on a held-out split of NATIX driver footage; precision / recall on the target class drives ranking.', dataK: 'metric',  dataV: 'held-out F1 / mAP' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Trains image classification and object detection models on NATIX driver-fleet footage and submits weights against task specs.',
    input: 'Validator-published task: labelled training footage, target classes, held-out eval window.',
    output: 'A trained vision model checkpoint deployable to NATIX edge devices.',
    hardware: 'Training-grade GPU (A100 / H100-class for larger detection models, single-GPU sufficient for smaller classification tasks).',
    paidFor: 'Producing the highest-F1 model on held-out NATIX driving footage.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Publishes vision tasks, evaluates miner-submitted models on held-out footage, ranks by task metric, and writes weights on-chain.',
    requires: 'GPU for evaluation runs plus min-stake to register as a Bittensor validator.',
    output: 'Per-miner weight vector ranking detection / classification quality.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Highest task-specific metric (mAP / F1) on held-out NATIX driver footage wins.',
    explanation: [
      'Each task is a controlled experiment: identical labelled training set, identical held-out split, identical deadline. Miners differ only in model architecture, augmentation strategy, and training recipe. Validators evaluate every submitted checkpoint and rank by the task\'s target metric.',
      'The crucial asymmetry is data provenance: NATIX owns the dashcam fleet that captured the footage and runs the edge devices the winning model deploys to. That means the held-out split is naturally adversarial — real driving footage from the same fleet, in conditions the deployed model will actually face.',
    ],
    cheatPath: 'Standard attacks are overfitting to the released training set or scraping public driving datasets to memorise edge cases. The counter is a held-out split drawn fresh from the NATIX fleet and validator-controlled. The remaining surface is whether a miner can over-rotate to the specific eval distribution at the cost of fleet-deployment robustness.',
  },
  customer: {
    leadOneLine: 'Autonomous-driving teams, HD-map vendors, and physical-AI labs who need fleet-grade vision models — not just a dataset.',
    explanation: [
      'NATIX\'s edge network (smartphones, dashcams) is the deployment target: the best models on SN72 are pushed back to the driver fleet for real-time on-device inference. The closed loop — driver fleet captures data, subnet trains and ranks models, fleet redeploys the winner — is what differentiates this from a generic vision-model marketplace.',
      'Public customers and partners disclosed by NATIX include Valeo (joint open AI model for autonomous vehicles) and Grab (mapping expansion into the US and Europe announced May 2025). Backers include Borderless Capital, Tioga Capital, and Laser Digital (Nomura).',
    ],
  },
  competitive: {
    scope: 'physical-AI / mapping vision · 2026',
    rows: [
      { name: 'StreetVision by NATIX', subtitle: 'SN72', isSelf: true, approach: 'Open vision-model tournament tied to a 250k-driver dashcam fleet; winning models redeployed to edge devices.', access: 'open · driver app + API', accessTone: 'open', differentiator: 'Closed sense-train-deploy loop on a real DePIN fleet; not just a dataset or a leaderboard.' },
      { name: 'Hivemapper', approach: 'Solana DePIN mapping network with dashcam contributors producing a global street-level map.', access: 'open · dashcam network', accessTone: 'open', differentiator: 'Map-centric; primary product is the map itself, not a generic physical-AI training layer.' },
      { name: 'Mobileye REM', approach: 'Closed in-vehicle vision stack from Intel\'s Mobileye, crowdsourcing map data from OEM partners.', access: 'closed · OEM partnership', accessTone: 'closed', differentiator: 'OEM-grade vision and mapping but vertically integrated and not open to external model contributors.' },
      { name: 'Tesla AI Data Engine', approach: 'Closed in-house pipeline using the Tesla fleet for active learning on autonomy models.', access: 'closed · internal only', accessTone: 'closed', differentiator: 'Largest passenger-vehicle fleet but fully internal; no third-party model marketplace.' },
      { name: 'Waymo / Aurora datasets', approach: 'AV companies release public datasets (Waymo Open, Aurora) for academic benchmarking.', access: 'open · research dataset', accessTone: 'open', differentiator: 'Static dataset releases; no live fleet, no on-chain incentives, no deployment loop.' },
    ],
    note: 'StreetVision\'s wedge is the combination of a real DePIN fleet, an on-chain model tournament, and a deployment path back to edge devices. Competing AV stacks (Mobileye, Tesla) own the loop but keep it internal; competing DePIN networks (Hivemapper) own a fleet but not the open model marketplace.',
  },
  team: {
    intro: [
      'StreetVision is operated by NATIX Network, a DePIN founded in 2020 with headquarters and team across Berlin and a distributed footprint. NATIX runs the dashcam fleet, the Solana-based token, and now the SN72 Bittensor training layer.',
      'The team\'s thesis is that the bottleneck in physical AI is fleet access, not model architecture — and that combining a DePIN sensor fleet with a Bittensor tournament closes the loop in a way neither side could on its own.',
    ],
    founders: [
      { initials: 'AG', gradient: 'v', name: 'Alireza Ghods', role: 'Co-founder & CEO · NATIX', bio: 'CEO and co-founder of NATIX; 10+ years across IoT, mapping, and autonomous driving. Previously IoT Europe lead and blockchain co-lead at PwC.' },
      { initials: 'LM', gradient: 'a', name: 'Lorenz Muck', role: 'Co-founder & CPO · NATIX', bio: 'Co-founder and CPO of NATIX; 10+ years across VR and computer vision; previously launched 20+ applications across consumer and enterprise.' },
      { initials: 'OM', gradient: 'g', name: 'Omid Mogharian', role: 'Co-founder & CTO · NATIX', bio: 'Co-founder and CTO of NATIX; 15 years in software development and architecture; co-led blockchain initiatives at PwC.' },
    ],
    size: 'Not publicly disclosed.', founded: '2020 (NATIX); SN72 May 2025', based: 'Berlin / distributed',
    backers: 'Borderless Capital (lead), Tioga Capital (co-lead), Laser Digital (Nomura), Big Brain Holdings, Escape Velocity, IoTeX, WAGMI Ventures, Moonrock Capital.',
    placeholder: false,
  },
  milestones: [
    { date: '2025·05', text: 'StreetVision Subnet 72 launched on Bittensor mainnet; press across The Defiant, CryptoSlate, Cointelegraph.' },
    { date: '2025·05', text: 'Grab × NATIX partnership announced — mapping expansion into US and Europe.' },
    { date: '2025·Q2', text: 'Valeo × NATIX joint announcement on open AI model for autonomous vehicles.' },
    { date: '2025·Q3', text: 'NATIX driver fleet reportedly past 170M km mapped across 250k contributors.' },
  ],
  join: {
    title: 'Train a physical-AI model on StreetVision',
    body: 'Miners install from github.com/natixnetwork/streetvision-subnet and register on netuid 72. The NATIX driver app (drive.natix.network) is the data-capture endpoint.',
    asideNote: 'Mining is GPU-bound; the highest-yield tasks track NATIX\'s fleet deployment roadmap (roadwork → potholes → signage → scenarios). Live network state on taostats.io/subnets/72/.',
  },
  tags: ['physical AI', 'computer vision', 'autonomous driving', 'mapping', 'DePIN'],
  external: {
    github: 'https://github.com/natixnetwork/streetvision-subnet',
    website: 'https://www.natix.network/',
    twitter: 'https://twitter.com/NATIXNetwork',
    taostats: 'https://taostats.io/subnets/72/',
  },
  tweets: [
    { when: '2025·05', body: 'NATIX Network: "DePIN meets DeAI — NATIX is launching the StreetVision Subnet (#sn72) on @bittensor_ to build the future of Physical AI, mapping, and autonomous driving."' },
  ],
};
