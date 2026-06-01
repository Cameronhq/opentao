import type { RichSubnet } from '../subnet-rich';

export const sn70: RichSubnet = {
  slug: '70-nexisgen',
  netuid: 70,
  name: 'NexisGen',
  shortPitch: 'Decentralized marketplace for curated video and image training datasets.',
  overview: [
    'NexisGen is Bittensor subnet 70, operated by the RendixNetwork team. It turns the production of AI training data into an open market: miners stake TAO and submit curated datasets (interval-based video clips, image bundles), and validators independently verify quality, authenticity, and adherence to the requested spec before the data is accepted into the pool.',
    'The pitch is data sourcing without a centralized broker. Instead of one vendor charging enterprise rates for labelled video, dozens of miners race in parallel on the same task while validators audit under token rewards. Datasets are released against on-demand requests rather than pre-built generic corpora.',
    'On the buyer side, NexisGen targets AI labs and product teams who need fresh, task-specific video and image data — particularly for active-learning loops where each new batch needs to fix a specific failure mode of a deployed model.',
    'One-line diff: on-chain dataset distribution rather than a managed data-labelling service. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Publish task', body: 'Validator publishes a dataset request: spec for video clips or images (interval, content type, scene constraints), volume target, and deadline.', dataK: 'payload', dataV: 'video/image spec + volume' },
    compute:   { actor: 'Miner',     title: 'Curate + submit', body: 'Miner sources or generates clips matching the spec, packages them with metadata, and submits the dataset bundle to the validator pool.', dataK: 'unit',    dataV: 'clip / image bundle' },
    score:     { actor: 'Validator', title: 'Verify quality', body: 'Validators check authenticity, spec compliance, deduplicate against prior submissions, and rank miners by usable-data yield.', dataK: 'scale',   dataV: 'spec-compliant clips' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Sources, curates, and submits video clips and image bundles matching validator-published dataset specs.',
    input: 'Validator request: dataset spec, interval/content constraints, target volume, deadline.',
    output: 'A spec-compliant dataset bundle with metadata, submitted for validator audit.',
    hardware: 'Storage and bandwidth-heavy; lightweight compute for clipping, encoding, and metadata generation.',
    paidFor: 'Producing the largest volume of unique, spec-compliant, validator-accepted data.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Publishes dataset requests, audits submissions for authenticity and spec compliance, deduplicates across miners, and writes per-miner weights on-chain.',
    requires: 'Storage and bandwidth to ingest dataset submissions, plus min-stake to register as a Bittensor validator.',
    output: 'Per-miner weight vector ranking dataset quality and yield.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Spec-compliant, unique, validator-verified clip volume — duplicates and out-of-spec submissions earn nothing.',
    explanation: [
      'Validators score on three axes: authenticity (was this clip really captured / generated under the requested conditions), spec compliance (does it match the interval, content type, and scene constraints), and uniqueness (deduplication against earlier submissions in the same task and across tasks).',
      'Because the same request is broadcast to all miners, the natural reward gradient pushes miners toward broader sourcing pipelines — more cameras, more captures, more diverse generation — rather than toward overfitting to a single source.',
    ],
    cheatPath: 'The obvious attacks are re-uploading existing datasets, stitching together near-duplicate clips, or scraping public footage and rebranding it. Validator deduplication, perceptual-hash checks, and authenticity audits are the intended counters; the residual risk is sophisticated synthetic-data laundering that passes both hash and metadata checks.',
  },
  customer: {
    leadOneLine: 'AI teams who need fresh, task-specific video / image data on demand rather than buying off-the-shelf corpora.',
    explanation: [
      'The buyer profile is computer-vision teams running active-learning loops: each new model checkpoint reveals failure modes that need targeted data to fix. NexisGen lets them post a precise spec and pay only for accepted, validator-verified data — rather than commissioning a labelling vendor on a multi-week SLA.',
      'Compared to centralised data brokers, the appeal is volume parallelism: 192 miner slots all sourcing in parallel for the same task tend to deliver more diverse coverage than any single vendor pipeline.',
    ],
  },
  competitive: {
    scope: 'on-demand video / image training data · 2026',
    rows: [
      { name: 'NexisGen', subtitle: 'SN70', isSelf: true, approach: 'Open dataset tournament — miners curate and submit; validators audit authenticity, spec compliance, and uniqueness.', access: 'open · request-based', accessTone: 'open', differentiator: 'On-chain incentive layer for dataset production; parallel sourcing across many independent miners.' },
      { name: 'Scale AI', approach: 'Managed data labelling and dataset production on a global contractor workforce.', access: 'closed · enterprise contract', accessTone: 'closed', differentiator: 'Industry-standard quality and SLAs, but priced for large enterprise and slow to spin up new specs.' },
      { name: 'Surge AI', approach: 'Managed labelling with vetted contractors, leaning into high-quality LLM and vision data.', access: 'closed · enterprise contract', accessTone: 'closed', differentiator: 'Premium-quality managed labelling; not a marketplace for raw video sourcing.' },
      { name: 'NATIX StreetVision (SN72)', approach: 'Crowdsourced dashcam fleet collecting real-world street imagery with on-device inference.', access: 'open · driver app', accessTone: 'open', differentiator: 'Vertical-specific (mobility / mapping); not a general-purpose dataset marketplace.' },
      { name: 'Hugging Face Datasets', approach: 'Open repository of pre-built datasets contributed by researchers and labs.', access: 'open · public hub', accessTone: 'open', differentiator: 'Generic prebuilt corpora; no on-demand request matching or paid sourcing.' },
    ],
    note: 'NexisGen\'s wedge is on-demand parallel sourcing for niche task data, paid in TAO. The trade-off vs Scale / Surge is enterprise SLA and labelled-data quality; the trade-off vs Hugging Face is that requests must produce fresh, verified data rather than reuse existing dumps.',
  },
  team: {
    intro: [
      'NexisGen is operated by the RendixNetwork team (github.com/RendixNetwork/nexisgen). Public information about the operator is limited beyond the project site and GitHub presence.',
      'The thesis is that training data is a commodity best produced on an open market — and that on-chain incentives can outprice managed labelling vendors for any task spec where parallel sourcing matters more than centralised QA.',
    ],
    founders: [
      { initials: 'RN', gradient: 'v', name: '[RendixNetwork team]', role: 'Operator · NexisGen', bio: 'NexisGen is published under the RendixNetwork GitHub organisation; founder identities are not publicly disclosed in the sources surveyed.' },
    ],
    size: 'Not publicly disclosed.', founded: '2024', based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·Q4', text: 'Subnet 70 registered as NexisGen by RendixNetwork.' },
    { date: '2025·Q1', text: 'Video-clip dataset production pipeline live on mainnet.' },
  ],
  join: {
    title: 'Request a dataset on NexisGen',
    body: 'Buyers post dataset specs via the NexisGen interface at nexisgen.ai. Miners and validators install from github.com/RendixNetwork/nexisgen and register on netuid 70.',
    asideNote: 'Live network state on taostats.io/subnets/70/.',
  },
  tags: ['dataset', 'video', 'data marketplace', 'active learning'],
  external: {
    github: 'https://github.com/RendixNetwork/nexisgen',
    website: 'https://www.nexisgen.ai/',
    taostats: 'https://taostats.io/subnets/70/',
  },
};
