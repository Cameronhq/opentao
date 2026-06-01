import type { RichSubnet } from '../subnet-rich';

export const sn78: RichSubnet = {
  slug: '78-vocence',
  netuid: 78,
  name: 'Vocence',
  shortPitch: 'Open voice-AI marketplace — miners deploy TTS / STT models, validators score quality.',
  overview: [
    'Vocence is Bittensor subnet 78, an open incentivized voice-intelligence platform. Miners deploy voice models — prompt-conditioned TTS, STT, speech-to-speech, voice cloning, and other multimodal voice tasks — through a standardized inference interface, and validators score how well each model matches both the requested content and the requested voice traits.',
    'The initial focus is PromptTTS: miners host TTS models that take a natural-language voice description (gender, tone, emotion, pitch, speed, age, accent, recording environment) plus the text to be spoken, and return an audio waveform. Validators evaluate against the description on a shared pipeline so model outputs are directly comparable across miners.',
    'On the deployment side, miner models run on Chutes (SN64) endpoints; the Vocence subnet calls each miner\'s /speak endpoint with evaluation prompts and aggregates scores via global consensus. To run a validator, operators must currently contact the Vocence team to be granted Chutes access and the owner API endpoint — a managed-onboarding pattern that keeps the validator set curated during the early phase.',
    'One-line diff: a competitive voice-model marketplace with descriptor-controlled prompts, not a single managed TTS API. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send prompt', body: 'Validator constructs a PromptTTS request — voice descriptor (gender, tone, emotion, pitch, speed, age, accent) plus content to be spoken — and queries each registered miner\'s /speak endpoint.', dataK: 'payload', dataV: 'descriptor + text' },
    compute:   { actor: 'Miner',     title: 'Synthesize', body: 'Miner runs the TTS / voice model behind a Chutes endpoint and returns the synthesized audio waveform matching the descriptor.', dataK: 'latency',  dataV: 'TTFB / RTF' },
    score:     { actor: 'Validator', title: 'Score audio', body: 'Validator runs a shared scoring pipeline over the returned audio: descriptor adherence, audio quality, content fidelity. Scores are reconciled via global consensus across validator buckets.', dataK: 'metric',  dataV: 'descriptor × quality' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Hosts voice intelligence models (PromptTTS initially; STT, STS, cloning, multimodal voice over time) behind a standard /speak inference endpoint on Chutes.',
    input: 'Validator-issued PromptTTS request: voice descriptor + content text.',
    output: 'Synthesized audio waveform served via the standard endpoint.',
    hardware: 'GPU sized to the model — single mid-range GPU sufficient for most TTS; higher tier for large multimodal voice models. Hosted via Chutes (SN64).',
    paidFor: 'Producing audio that best matches the descriptor and content across the shared scoring pipeline.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Sends PromptTTS requests to all registered miners, runs the shared scoring pipeline, reconciles results across validator buckets, and writes weights on-chain.',
    requires: 'Chutes access (granted by the Vocence team), the shared scoring pipeline, and min-stake to register as a Bittensor validator.',
    output: 'Per-miner weight vector ranking voice-model quality.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Descriptor adherence × audio quality × content fidelity, reconciled across validator buckets.',
    explanation: [
      'Each PromptTTS evaluation produces three signals: how closely the audio matches the requested voice traits (gender, tone, emotion, age, accent), how clean and natural the audio itself is, and how accurately the spoken content matches the requested text. The shared scoring pipeline turns those signals into per-miner scores.',
      'Validators read evaluation results from every active validator\'s bucket and reconcile via global consensus, which makes individual validator manipulation of the score expensive — a miner needs to win on most validators\' pipelines, not just one.',
    ],
    cheatPath: 'Classic attacks are caching responses to repeated descriptors, hard-coding common content, or routing requests to a closed third-party API (OpenAI Voice, ElevenLabs) instead of running a real model. The intended counters are descriptor randomization, content variation, and pipeline-level audio analysis; the residual surface is sophisticated API-proxying that still passes the descriptor scoring.',
  },
  customer: {
    leadOneLine: 'Voice-AI buyers who want descriptor-controlled TTS without locking into a single provider — and who want the model weights, not just the audio.',
    explanation: [
      'The buyer profile is products embedding voice — assistants, agents, accessibility tools, audio content pipelines — that need controllable voice characteristics rather than a single locked-in voice. PromptTTS as a primitive is closer to "Stable Diffusion for voice" than to a one-click voice clone service.',
      'The longer roadmap (STT, STS, cloning, multimodal voice) makes Vocence a candidate generalist voice-AI surface inside Bittensor. The early gating (validators must contact the team for Chutes access) is a stage-of-life choice; the underlying model and miner economics are open.',
    ],
  },
  competitive: {
    scope: 'voice AI / TTS · 2026',
    rows: [
      { name: 'Vocence', subtitle: 'SN78', isSelf: true, approach: 'Open marketplace of voice models behind a /speak standard interface; descriptor-controlled PromptTTS scored by validator consensus.', access: 'open · Chutes endpoint', accessTone: 'open', differentiator: 'Descriptor-controlled, open-model voice marketplace on Bittensor emission.' },
      { name: 'ElevenLabs', approach: 'Closed proprietary TTS and voice cloning with leading naturalness and voice-library breadth.', access: 'closed · API + SaaS', accessTone: 'closed', differentiator: 'Best-in-class quality but closed weights and per-character pricing.' },
      { name: 'OpenAI Voice / Realtime API', approach: 'Closed multimodal voice (text-in / audio-out and audio-in / audio-out) on GPT-4o-class models.', access: 'closed · OpenAI API', accessTone: 'closed', differentiator: 'Best multimodal voice latency but proprietary and tied to OpenAI billing.' },
      { name: 'Coqui / XTTS open weights', approach: 'Open-weight TTS models the community hosts and fine-tunes (XTTS, Tortoise, F5-TTS).', access: 'open · self-host', accessTone: 'open', differentiator: 'Open weights but no shared incentive layer or comparison harness.' },
      { name: 'Bittensor SN3 / SN58 voice-adjacent', approach: 'Other Bittensor subnets that have at times worked on voice / TTS / audio (e.g. SN58 Voice).', access: 'open · subnet API', accessTone: 'open', differentiator: 'Adjacent Bittensor entrants; Vocence is the dedicated descriptor-controlled marketplace.' },
    ],
    note: 'Vocence\'s wedge is the combination of descriptor-controlled prompts, standard inference interface, and Bittensor emission rewarding open-weight model performance. The trade-off vs ElevenLabs / OpenAI is product polish; vs Coqui / open weights it is having a paid incentive layer at all.',
  },
  team: {
    intro: [
      'Vocence operates under the vocence-78 GitHub organisation and the vocence.ai domain. The team is publicly small and largely pseudonymous at the time of writing, with onboarding controlled by direct contact (validators must request Chutes permission from the team).',
      'The thesis is that the right primitive for voice AI is descriptor-controlled synthesis rather than baked-in voices — and that an open subnet running on Chutes can compete on capability with closed providers if the scoring pipeline is well-designed.',
    ],
    founders: [
      { initials: 'VC', gradient: 'v', name: '[Vocence team]', role: 'Operator · Vocence', bio: 'Operator identity for the vocence-78 organisation is not publicly disclosed in the sources surveyed.' },
    ],
    size: 'Not publicly disclosed.', founded: '2025', based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025·Q4', text: 'Subnet 78 registered as Vocence; PromptTTS becomes the initial task spec.' },
    { date: '2025·Q4', text: 'Miner deployment standardized behind Chutes /speak endpoints; validator onboarding gated via direct contact.' },
  ],
  join: {
    title: 'Deploy a voice model on Vocence',
    body: 'Miners deploy voice models behind a Chutes /speak endpoint per the spec at github.com/vocence-78/vocence and register on netuid 78. Validators contact the Vocence team for Chutes permission and the owner API endpoint.',
    asideNote: 'Mining is GPU-bound (TTS-class models). Live network state on taostats.io/subnets/78/.',
  },
  tags: ['voice AI', 'TTS', 'PromptTTS', 'speech', 'multimodal'],
  external: {
    github: 'https://github.com/vocence-78/vocence',
    website: 'https://www.vocence.ai/',
    taostats: 'https://taostats.io/subnets/78/',
  },
};
