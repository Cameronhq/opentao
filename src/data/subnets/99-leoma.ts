import type { RichSubnet } from '../subnet-rich';
export const sn99: RichSubnet = {
  slug: '99-leoma', netuid: 99, name: 'Leoma',
  shortPitch: 'Cinematic AI video generation subnet where miners compete on text-image-to-video quality.',
  overview: [
    'Leoma (SN99, sometimes labeled "Neza" in earlier taostats snapshots) is a Bittensor subnet for studio-grade AI video generation. Miners run text-image-to-video (TI2V) models and validators evaluate output quality, setting winner-take-all weights on-chain so the best model for any given request earns the emission.',
    'The product pitch flips the standard AI-video business model. Where Runway, Luma, and Pika lock creators into subscriptions with a single house model, Leoma exposes a permissionless competition where miners openly race to deliver the best cinematic output. The result: faster iteration, no vendor lock-in, no single company deciding what "good" looks like, and transparent on-chain quality signals.',
    'Each generation request is a small public benchmark. The winner-take-all weight rule per request means a miner with a marginal-quality edge captures disproportionate emission, which biases the miner pool toward continuously sharpening their models against the validator quality rubric.',
    'AI video is one of the hottest consumer-AI categories of 2026, dominated by centralized giants. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Video prompt', body: 'Validator broadcasts a text and/or image prompt for a video generation, including target duration and resolution.', dataK: 'payload', dataV: 'prompt + image + duration' },
    compute:   { actor: 'Miner',     title: 'Generate video', body: 'Miner runs its TI2V model on the prompt and returns the generated video for validator evaluation.', dataK: 'latency',  dataV: 'GPU-time per clip' },
    score:     { actor: 'Validator', title: 'Quality eval', body: 'Validators evaluate generated videos on quality (motion, fidelity, prompt adherence) and pick a winner under winner-take-all weighting.', dataK: 'scale',    dataV: 'winner-take-all per request' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Runs text-image-to-video (TI2V) models to generate cinematic-quality video from prompts.', input: 'Text prompt + optional image conditioning + duration / resolution spec', output: 'Generated video file (MP4 or similar)', hardware: 'High-VRAM GPU (A100/H100 class) for studio-grade TI2V generation', paidFor: 'Quality and prompt adherence — winner-take-all per request', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Publishes video prompts, evaluates miner outputs on quality and prompt adherence, sets winner-take-all weights.', requires: 'Video quality evaluation pipeline + reference / human-in-loop scoring', output: 'Per-miner weights — winner-take-all per request', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   {
    leadOneLine: 'Winner-take-all per request — the best video for each prompt earns the emission.',
    explanation: [
      'Per-request winner-take-all is a sharper signal than soft scoring: it forces miners to be the best for some slice of the prompt distribution rather than middling everywhere. Validators evaluate motion quality, prompt adherence, fidelity, and artifacts, sometimes with human-in-loop reference scoring.',
      'Because each prompt is a small public benchmark, the leaderboard updates continuously and miners can specialize — one for cinematic landscape shots, another for character animation, another for fast-action scenes. The pool sharpens through specialization rather than convergence to a single house model.',
    ],
    cheatPath: 'Cached video for repeated prompts — validators use prompt randomization and block-seeded variation to prevent direct cache hits.',
  },
  customer:  {
    leadOneLine: 'Creative teams, ad agencies, and indie filmmakers wanting cinematic AI video without vendor lock-in.',
    explanation: [
      'The target is professional creative work where a single house model isn\'t good enough — ad creative, short films, animated explainers, music videos. Leoma\'s pitch is access to the best model for each shot, paid per-generation, with no subscription gate.',
      'Direct competition is fierce: Runway, Luma Dream Machine, Pika, OpenAI Sora, and Google Veo each have hundreds of millions in funding and integrated product UX. Leoma\'s wedge is permissionless model supply — any TI2V model can enter, and the winner-take-all incentive sharpens the frontier continuously.',
    ],
  },
  competitive: { scope: '2026 · AI video generation', rows: [
    { name: 'Leoma', subtitle: 'SN99', isSelf: true, approach: 'Bittensor TI2V miner competition, winner-take-all per request', access: 'open · API', accessTone: 'open', differentiator: 'Permissionless model supply, no vendor lock-in, on-chain quality signals' },
    { name: 'Runway', approach: 'Centralized AI video product (Gen-3, Gen-4)', access: 'closed · API', accessTone: 'closed', differentiator: 'Established creative tool with strong UX' },
    { name: 'Luma Dream Machine', approach: 'Centralized text-to-video product', access: 'closed · API', accessTone: 'closed', differentiator: 'VC-backed, large user base, agent-driven product line' },
    { name: 'OpenAI Sora', approach: 'Closed flagship text-to-video model', access: 'closed · API', accessTone: 'closed', differentiator: 'State-of-the-art quality, gated rollout' },
    { name: 'Pika Labs', approach: 'Centralized text-to-video product', access: 'closed · API', accessTone: 'closed', differentiator: 'Consumer-friendly UX, focused on short clips' },
  ], note: 'Leoma\'s thesis is that permissionless model competition outpaces any single house model on the frontier. The challenge is consumer UX — a winner-take-all subnet needs a polished front door to compete with Runway\'s creative tools.' },
  team: {
    intro: [
      'Leoma is operated by the Rendix Network team (per the RendixNetwork/leoma GitHub repository). Specific founder identities are not prominently disclosed in publicly available materials as of mid-2026.',
      'The team publishes on leoma.ai and runs the official @leoma_ai X account.',
    ],
    founders: [{ initials: 'RX', gradient: 'a', name: '[Rendix Network team]', role: 'Operators', bio: 'Team behind Leoma SN99 and the Rendix Network — building permissionless AI video generation on Bittensor.' }],
    size: 'Not publicly disclosed', founded: '2025', based: 'Not publicly disclosed', backers: 'Not publicly disclosed.', placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 99 registered (taostats initially labeled the slot Neza, now Leoma).' },
    { date: '2025', text: 'Leoma TI2V miner protocol + winner-take-all scoring goes live.' },
    { date: '2026', text: '@leoma_ai launches public X presence and creative-team positioning.' },
  ],
  join: { title: 'Race for the best frame', body: 'Operators with high-VRAM GPUs can run TI2V models and compete per-request for emission. Creative teams can route generation requests through the subnet API and pay-per-video without subscription gates.', asideNote: 'AI video is the most capital-intensive consumer-AI category — model quality and infrastructure cost both matter. Track miner GPU economics carefully.' },
  tags: ['ai-video', 'ti2v', 'creative', 'winner-take-all'],
  external: { github: 'https://github.com/RendixNetwork/leoma', website: 'https://leoma.ai/', twitter: 'https://x.com/leoma_ai', taostats: 'https://taostats.io/subnets/99/' },
  tweets: [],
};
