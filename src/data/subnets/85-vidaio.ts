import type { RichSubnet } from '../subnet-rich';

export const sn85: RichSubnet = {
  slug: '85-vidaio',
  netuid: 85,
  name: 'Vidaio',
  shortPitch: 'AI video upscaling and compression as a Bittensor service.',
  overview: [
    'Vidaio is Bittensor Subnet 85, an open-source decentralized video processing network focused on AI-driven upscaling and compression. The mission is to democratize high-quality video enhancement through decentralization, AI, and blockchain incentives — content owners send low-resolution video in and get crisp 4K back, paid for in TAO-denominated services.',
    'Mechanically, validators submit short low-res clips to miners; miners run deep-learning upscalers that reconstruct sharper frames by analyzing patterns, textures, and edges, then return the enhanced video. Validators then score perceptual quality using a stack of video-quality metrics. The upscaling product is live in beta and a compression layer is the next phase.',
    'External customers are content owners and platforms with large back-catalogs of old or low-bitrate video. Demos have shown ~95% file-size reduction on Vidaio compression, and a consumer-facing web app is live with planned paid tiers around $0.05/min. Industry-experienced operators including ex-Netflix / Disney / Sony / Spotify are running the product side.',
    'One-line diff: a TAO-incentivized Topaz Video AI where miner GPUs replace a single-vendor cloud. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send a low-res clip', body: 'Validators sample short low-resolution video clips from a benchmark distribution and dispatch them to miners along with the target output resolution and codec settings.', dataK: 'payload', dataV: 'low-res clip + target' },
    compute:   { actor: 'Miner',     title: 'Upscale + return', body: 'Miners run deep-learning upscaling models to reconstruct high-resolution frames from the input clip, then return the enhanced video to the validator within a latency budget.', dataK: 'latency',  dataV: 'enhance time / clip' },
    score:     { actor: 'Validator', title: 'Perceptual quality', body: 'Validators run a stack of video-quality metrics (perceptual + structural) against the returned clip, scoring miners on visual fidelity and reconstruction quality.', dataK: 'scale',    dataV: 'VMAF / SSIM blend' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs AI video upscaling models on assigned low-resolution clips, returning higher-resolution enhanced video that maximizes perceptual quality scores.',
    input: 'Low-resolution video clip + target resolution',
    output: 'Upscaled / enhanced video clip',
    hardware: 'GPU (A100 / H100 / RTX 4090 class) with enough VRAM to hold the upscaler and a clip\'s worth of frames',
    paidFor: 'Perceptual-quality score on returned clips over the tempo',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Dispatches clip jobs, runs video-quality metrics against returned outputs, and submits a weight vector ranking miners by perceptual fidelity.',
    requires: 'Bittensor validator stake + ability to run a video-quality metric stack consistently',
    output: 'Weight vector across miner hotkeys per tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'A blend of perceptual and structural video-quality metrics on each returned clip.',
    explanation: [
      'Validators score miners using a stack of established video-quality metrics — VMAF-style perceptual scores combined with structural metrics like SSIM and PSNR — applied to each returned clip versus a reference high-resolution target. The composite score per clip rolls up into a per-tempo ranking that maps to weights.',
      'Because the metrics are well-defined and reproducible, scoring noise is bounded; what miners control is their model choice, fine-tuning data, and inference pipeline efficiency. Better upscalers win, full stop.',
    ],
    cheatPath: 'A miner cannot pass off the input clip unchanged — perceptual and structural metrics directly compare against a high-resolution ground truth and would punish a no-op. Pre-cached outputs also fail because validators rotate clips and rate distortion: only miners that actually reconstruct plausible high-frequency content score well.',
  },
  customer: {
    leadOneLine: 'Content owners and video platforms with large catalogs of old or low-bitrate video they want to enhance or shrink.',
    explanation: [
      'The headline customer profile is anyone holding large amounts of video: streamers cleaning up old back-catalogs to 4K, VOD platforms shrinking bitrate without losing perceived quality, and creators who want a one-click upscale workflow. Vidaio is live in beta as a consumer web app, with paid tiers planned around $0.05 per minute of video processed.',
      'A secondary buyer profile is enterprise media operations — the team behind Vidaio carries 20 years of operational experience from Netflix, Disney, Sony, Spotify, Hulu, and Pokémon, which positions the project to sell into traditional content-distribution stacks. Compression (Phase II) targets the larger willingness-to-pay of bitrate-sensitive platforms.',
    ],
  },
  competitive: {
    scope: 'AI video upscaling & compression · 2026',
    rows: [
      { name: 'Vidaio', subtitle: 'SN85', isSelf: true, approach: 'Decentralized GPU fleet runs AI upscalers / compressors; validators score perceptual quality on every clip.', access: 'open · web app + API', accessTone: 'open', differentiator: 'Only TAO-incentivized video AI network — open supply of GPU miners, transparent quality scoring.' },
      { name: 'Topaz Video AI', approach: 'Desktop AI upscaling app with strong models for old-footage restoration.', access: 'closed · paid app', accessTone: 'closed', differentiator: 'Best-in-class consumer upscaler but single-machine, no scaled service.' },
      { name: 'Nvidia VSR', approach: 'Browser-side AI upscaling shipped with GeForce drivers.', access: 'closed · driver', accessTone: 'closed', differentiator: 'Free at the edge for Nvidia users; no offline batch processing or platform integration.' },
      { name: 'Capella / Beamr', approach: 'Enterprise content-aware encoding for streaming platforms.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Mature compression-side vendors with deep workflow integration; closed pricing.' },
      { name: 'Cloud media services (AWS Elemental, Mux)', approach: 'Hosted media pipelines with optional AI upscaling features.', access: 'closed · cloud', accessTone: 'closed', differentiator: 'One-stop transcoding stacks but premium per-minute pricing and vendor lock-in.' },
    ],
    note: 'Vidaio\'s differentiator is open supply plus transparent quality scoring. Enterprise compression vendors are mature but closed; Topaz is excellent but desktop-only. By incentivizing miner GPUs and scoring on standard video-quality metrics, Vidaio aims to offer a much cheaper per-minute price than centralized vendors.',
  },
  team: {
    intro: [
      'Vidaio is operated by a product- and ops-heavy team with deep media industry experience. Founder Gareth Howells has 20 years in product and operations across Netflix, Disney, Sony, Spotify, Hulu, and Pokémon, and is the public face of the subnet.',
      'Engineering is led by Ahmad Ayad (PhD, distributed learning, ML engineer since the project\'s inception) alongside Marcus Graichen (known on Bittensor channels as "mogmachine"). The combination of media-ops and ML research is unusual in the subnet ecosystem.',
    ],
    founders: [
      { initials: 'GH', gradient: 'v', name: 'Gareth Howells', role: 'Founder', bio: '20 years in product and operations across Netflix, Disney, Sony, Spotify, Hulu, and Pokémon; founded Vidaio to democratize video enhancement.', twitter: 'https://twitter.com/vidaio_' },
      { initials: 'AA', gradient: 'a', name: 'Ahmad Ayad', role: 'ML Engineer', bio: 'PhD researcher in distributed learning; ML lead at Vidaio since project inception, owns the upscaling model stack.' },
      { initials: 'MG', gradient: 'g', name: 'Marcus Graichen (mogmachine)', role: 'Core / community', bio: 'Active Bittensor builder on Vidaio, frequently appears on subnet-session podcasts under the "mogmachine" handle.' },
    ],
    size: 'Small core team',
    founded: '2024–25',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
  },
  milestones: [
    { date: '2025', text: 'Vidaio launches as Subnet 85 on Bittensor — first dedicated AI video subnet.' },
    { date: '2025', text: 'Beta upscaling product goes live for content owners and platforms.' },
    { date: '2025–26', text: 'Compression demos show ~95% file-size reduction with no perceptible quality loss.' },
    { date: '2026', text: 'Paid consumer web app launched at roughly $0.05/min of video processed.' },
  ],
  join: {
    title: 'Run a Vidaio upscaling miner',
    body: 'Stand up an A100 / H100 / RTX 4090-class GPU, pull the Vidaio miner client, and serve upscaling jobs dispatched by validators. Stronger models and lower-latency inference pipelines climb the perceptual-quality leaderboard.',
    asideNote: 'Scoring is metric-driven — no-op outputs are punished immediately by VMAF / SSIM.',
  },
  tags: ['video', 'upscaling', 'compression', 'media', 'gpu'],
  external: {
    website: 'https://vidaio.io',
    twitter: 'https://twitter.com/vidaio_',
    taostats: 'https://taostats.io/subnets/85/',
  },
  tweets: [
    { when: '2025', body: 'Vidaio Subnet 85 — democratizing high-quality video enhancement through decentralization, AI, and blockchain.' },
  ],
};
