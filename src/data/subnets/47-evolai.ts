import type { RichSubnet } from '../subnet-rich';

export const sn47: RichSubnet = {
  slug: '47-evolai',
  netuid: 47,
  name: 'EvolAI',
  shortPitch: 'Decentralized LLM evaluation network where researchers submit and score models.',
  overview: [
    'EvolAI (Subnet 47) is a decentralized LLM model evaluation network on Bittensor. The operator runs a marketplace where AI researchers and labs submit custom language models, and the subnet returns scored evaluations from a distributed pool of validators rather than a single closed leaderboard.',
    'Miners host candidate language models and respond to evaluation prompts; validators grade responses against a rubric or benchmark suite, then commit weights every tempo. Yuma aggregates those weights so emission flows to whichever submitted models perform best across the validator panel.',
    'The customer is independent AI researchers, smaller labs, and fine-tuning teams who need a credible evaluation signal but don\'t want to pay for closed leaderboards or build their own eval harness. Open submission is a stated goal of the subnet, which differentiates it from invitation-only or vendor-run leaderboards.',
    'Differentiator: distributed evaluation rather than a single benchmark host, with open submission for researchers. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send prompt', body: 'Validators draw from the evaluation suite and broadcast prompts to miners hosting candidate models.', dataK: 'payload', dataV: 'eval prompt' },
    compute:   { actor: 'Miner',     title: 'Generate', body: 'Miners run their hosted LLM against the prompt and return a response.', dataK: 'latency',  dataV: 'per-prompt' },
    score:     { actor: 'Validator', title: 'Grade response', body: 'Validators score responses against the rubric / reference and commit weights.', dataK: 'scale',    dataV: 'rubric score' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Hosts a candidate LLM and serves it against the validator\'s evaluation prompts.', input: 'Evaluation prompts from validators.', output: 'Model responses to those prompts.', hardware: 'GPU sized to the hosted model; depends on the submission.', paidFor: 'Hosted-model response quality vs the validator rubric.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Issues evaluation prompts, grades responses, sets weights.', requires: 'Evaluation suite + reference answers or scoring rubric.', output: 'Per-miner weight vector.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Score = rubric / reference-based grade across the evaluation suite.', explanation: [
    'Validators grade each model response against the evaluation rubric — reference answers, programmatic checks, or LLM-as-judge depending on task. Models that consistently win across the suite earn higher weights.',
    'Because the panel is distributed, no single host owns the leaderboard; consensus across validators is what determines emission.',
  ], cheatPath: 'Memorizing public benchmark answers fails when the validator suite includes held-out prompts. Inconsistent grading is filtered by consensus median.' },
  customer:  { leadOneLine: 'Independent researchers, smaller labs, and fine-tuning teams who need credible eval signal.', explanation: [
    'Closed leaderboards (e.g., proprietary benchmark hosts) are expensive and slow to admit new entrants. EvolAI offers an open submission path so any team that hosts a model can get a continuous evaluation signal back.',
    'For downstream model buyers, the subnet doubles as a discovery surface — instead of trusting a vendor leaderboard, you can read the per-validator scores directly.',
  ] },
  competitive: { scope: '2026 · LLM evaluation', rows: [
    { name: 'EvolAI', subtitle: 'SN47', isSelf: true, approach: 'Distributed LLM evaluation with open model submission.', access: 'open · API', accessTone: 'open', differentiator: 'No single benchmark host; panel-of-validators scoring.' },
    { name: 'LMSys Chatbot Arena', approach: 'Public human-preference battles between LLMs.', access: 'open · web', accessTone: 'open', differentiator: 'Strong human signal; centralized host and slow throughput.' },
    { name: 'HELM / MMLU style benchmarks', approach: 'Static academic benchmarks.', access: 'open · static', accessTone: 'open', differentiator: 'Frozen; saturate quickly and easy to overfit.' },
    { name: 'Vendor leaderboards (HuggingFace OpenLLM)', approach: 'Centralized eval pipeline + leaderboard.', access: 'open · platform', accessTone: 'open', differentiator: 'Single host; eval suite locked to platform choices.' },
    { name: 'Internal eval suites', approach: 'In-house eval harnesses at each lab.', access: 'closed', accessTone: 'closed', differentiator: 'Bespoke and not portable across labs.' },
  ], note: 'Specific operator and roadmap detail for EvolAI is limited publicly; the differentiation rests on open submission and validator-panel grading vs single-host leaderboards.' },
  team: { intro: [
    'Public team detail for EvolAI is limited. The subnet is listed on the official Bittensor subnets directory as a decentralized LLM evaluation network with open participation for AI researchers.',
    'No publicly-disclosed founder identity is associated with this subnet at the time of writing; check the Bittensor subnets directory and Discord for the latest operator detail.',
  ], founders: [
    { initials: 'EA', gradient: 'g', name: '[Founder 1 name]', role: 'EvolAI team lead', bio: 'EvolAI operator; public identity not disclosed.' },
  ], size: 'Not publicly disclosed.', founded: 'Not publicly disclosed.', based: 'Not publicly disclosed.', backers: 'Not publicly disclosed.', placeholder: true },
  milestones: [
    { date: '2024', text: 'EvolAI registered on Subnet 47 as a decentralized LLM evaluation network.' },
  ],
  join: { title: 'Submit a model', body: 'Researchers can submit custom LLMs to the subnet for evaluation; validators host the rubric and scoring pipeline. Check the Bittensor subnets directory for the latest operator endpoints.', asideNote: 'Public documentation is thin — verify operator-side endpoints before mining.' },
  tags: ['llm', 'evaluation', 'benchmarks'],
  external: { website: 'https://bittensor.ai/subnets/47', taostats: 'https://taostats.io/subnets/47/' },
  tweets: [],
};
