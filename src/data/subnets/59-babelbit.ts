import type { RichSubnet } from '../subnet-rich';

export const sn59: RichSubnet = {
  slug: '59-babelbit',
  netuid: 59,
  name: 'Babelbit',
  shortPitch: 'Real-time speech-to-speech translation with predictive LLM completion.',
  overview: [
    'Babelbit (SN59) is a Bittensor subnet building low-latency, real-time speech-to-speech translation. Founder Matthew Karas argues that professional human interpreters do not wait for a sentence to finish — they predict where it is going and start speaking sooner. Babelbit teaches miners to do the same with LLMs, treating early phrase completion as the core competitive game.',
    'The subnet decomposes interpretation into three sub-problems: phrase prediction (what is the speaker about to say), speech tokenization (encoding voice into a model-friendly form), and semantic paraphrasing (rendering meaning in the target language with the right cultural register). Each can be incentivized as an isolated challenge before being stitched into an end-to-end pipeline.',
    'Validators issue speech challenges drawn from real conversation corpora and score miner completions on a blend of latency, fluency, faithfulness to the source, and predictive accuracy. The first live tournament focuses on early completion — given a partial utterance, can the miner finish it the way the speaker would, fast enough to translate in flight.',
    'Babelbit positions itself against cloud captioning APIs and traditional CAT tools. Where they wait for clauses to close, Babelbit wants to speak alongside the speaker, like a human interpreter at the UN. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Speech prompt', body: 'Validator streams a partial utterance from a multilingual corpus and asks miners to predict the completion and produce a target-language rendering.', dataK: 'payload', dataV: 'Audio + partial transcript' },
    compute:   { actor: 'Miner',     title: 'Predict + translate', body: 'Miner runs its own LLM + speech stack to anticipate the rest of the phrase and emit a translated audio/text segment under a strict time budget.', dataK: 'latency',  dataV: 'sub-second target' },
    score:     { actor: 'Validator', title: 'Latency × meaning', body: 'Validator scores answers on prediction accuracy, semantic faithfulness, fluency, and end-to-end latency; cheaters who wait for the full clause are penalized.', dataK: 'scale',    dataV: '0–1 composite' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs a low-latency speech + LLM pipeline that predicts phrase completions and emits target-language output.',
    input: 'Streaming audio plus partial transcript in source language.',
    output: 'Predicted completion + translated audio/text in target language, with a latency stamp.',
    hardware: 'GPU node sized for streaming inference (modern consumer or datacenter card).',
    paidFor: 'Predicting and translating faster and more faithfully than peers',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Streams speech challenges, scores miner output on latency-weighted meaning quality, and submits weights.',
    requires: 'Multilingual eval corpus, reference translations, and audio scoring tools.',
    output: 'Weight vector ranking miners on the composite latency × fidelity metric.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Speak earlier than the speaker finishes, and still be right.',
    explanation: [
      'Each round mixes prediction (did you guess the rest of the phrase) with translation quality (did the meaning carry across) and latency (how quickly did you commit). Waiting for the full clause is the safe move that loses, because latency is multiplied into the score.',
      'Validators use held-out reference completions plus semantic similarity metrics, so miners cannot game the system by parroting source text or stalling for context. The dominant strategy is to fine-tune a predictive LLM that is willing to commit early and rarely needs to retract.',
    ],
    cheatPath: 'Stalling until the speaker finishes — latency penalty crushes the score, even if the translation is perfect.',
  },
  customer: {
    leadOneLine: 'Anyone whose product currently waits for a clause to end before translating.',
    explanation: [
      'Conferences, livestreams, call centers, and consumer voice assistants all want interpretation that feels concurrent rather than chunked. Today they either pay human interpreters or eat the awkward delay of cloud captioning APIs.',
      'Babelbit aims to expose its swarm via API so a developer can stream microphone audio in and get translated audio out with interpreter-style anticipation built in. The buyer is the product team that has tried Google/AWS speech translation and given up on the latency.',
    ],
  },
  competitive: {
    scope: '2026 · real-time speech translation',
    rows: [
      { name: 'Babelbit', subtitle: 'SN59', isSelf: true, approach: 'Open swarm scored on early phrase completion + translation fidelity under tight latency budget.', access: 'open · subnet', accessTone: 'open', differentiator: 'Predictive LLM completion — speaks before the speaker finishes.' },
      { name: 'Google Translate (live)', approach: 'Cloud STT → MT → TTS pipeline waiting for clause boundaries.', access: 'closed · API', accessTone: 'closed', differentiator: 'Massive scale, but chunked latency users describe as awkward.' },
      { name: 'AWS / Azure speech translation', approach: 'Enterprise STT + NMT services with similar clause-bounded latency.', access: 'closed · API', accessTone: 'closed', differentiator: 'Compliance-grade SLAs, not interpreter-style timing.' },
      { name: 'Meta SeamlessM4T', approach: 'Open-source unified speech translation model, single-team R&D.', access: 'open · model', accessTone: 'open', differentiator: 'No incentive layer or live tournament — one frozen checkpoint.' },
      { name: 'KUDO / Interprefy', approach: 'Human interpreter marketplaces with AI assist.', access: 'closed · service', accessTone: 'closed', differentiator: 'Person-in-the-loop pricing; great for UN, not for consumer apps.' },
    ],
    note: 'The interesting axis is anticipation. Big cloud APIs deliberately wait for stable phrase boundaries. Babelbit is betting that an incentive layer can mine for predictive interpreters that commit early — closer to how humans actually do simultaneous interpretation.',
  },
  team: {
    intro: [
      'Babelbit is operated by BabelBit Ltd, led by founder Matthew Karas. Karas has 25+ years in speech and language tech, studied under Karen Spärck Jones and Tony Robinson at Cambridge in the mid-1990s, and previously designed the content management system behind BBC News Online.',
      'The team is small and deeply specialized: speech model engineering, Bittensor integration, and deployment/scalability are each held by a single named operator. The first prediction prototype was built in October 2025 with a single LLM prompt before being formalized into the subnet game.',
    ],
    founders: [
      { initials: 'MK', gradient: 'v', name: 'Matthew Karas', role: 'Founder', bio: '25+ years in speech tech and large-scale media. Cambridge speech/NLP background; designed early BBC News Online CMS; now building predictive interpretation on Bittensor.' },
      { initials: 'JG', gradient: 'a', name: 'Josh Greifer', role: 'Speech / NN engineer', bio: 'Specialist in adapting and building speech-processing neural networks for production.' },
      { initials: 'MM', gradient: 'g', name: 'Mica Ménard', role: 'Bittensor integration', bio: 'Owns the bridge between Babelbit\'s NLP stack and the Bittensor subnet incentive layer.' },
    ],
    size: '~4 core',
    founded: '2025',
    based: 'UK',
    backers: 'Not publicly disclosed.',
  },
  milestones: [
    { date: '2025·10', text: 'First prediction-engine prototype built from a single LLM prompt.' },
    { date: '2025·Q4', text: 'Subnet 59 registered on Bittensor under BabelBit Ltd.' },
    { date: '2026·Q1', text: 'Early phrase-completion tournament live for miners.' },
  ],
  join: {
    title: 'Mine the interpreter, not the transcript',
    body: 'If you have an opinion about predictive speech models, the early-completion game is wide open. Latency + fidelity is the whole score — small teams can win.',
    asideNote: 'Speech + LLM background is the natural fit.',
  },
  tags: ['speech', 'translation', 'llm', 'real-time'],
  external: {
    github: 'https://github.com/babelbit',
    website: 'https://babelbit.ai/',
    twitter: 'https://x.com/babelbit',
    taostats: 'https://taostats.io/subnets/59/',
  },
  tweets: [
    { when: '2025·10', body: 'Prototype 1: an interpreter that predicts where the speaker is going. Latency is the game.' },
  ],
};
