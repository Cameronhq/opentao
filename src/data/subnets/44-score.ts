import type { RichSubnet } from '../subnet-rich';

export const sn44: RichSubnet = {
  slug: '44-score',
  netuid: 44,
  name: 'Score',
  shortPitch: 'Decentralized computer vision for football, slashing video annotation cost.',
  overview: [
    'Score (Subnet 44) is operated by Score Technologies. The initial product is Game State Recognition for football: every match is sliced into thirty-second clips that get distributed to a global pool of miners running computer-vision models. Each miner returns a slim JSON file listing player bounding boxes, ball position, and key pitch keypoints, giving the system a frame-by-frame map of who is where and when.',
    'Validators sample a subset of frames per clip with hand-annotated ground truth, compare each miner\'s output, and grade by mAP-style metrics on detections and keypoints. Yuma aggregates the validator weights every tempo, so emission flows to miners producing the most accurate annotations against real footage.',
    'The customer is the $600 billion football industry — $50B in betting, $30B in data services — plus broadcasters, clubs, and analytics shops who today pay vendors like Stats Perform and Hawk-Eye for the same frame-level data. Score also runs a sister product, Score Predict, that converts the same engine into match-outcome forecasts.',
    'Differentiator: video annotation pricing collapses when supply is open mining instead of contracted human labelers. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send clip', body: 'Validators slice match footage into ~30-second clips and broadcast them to miners with the required output schema.', dataK: 'payload', dataV: '30-sec clip' },
    compute:   { actor: 'Miner',     title: 'Detect & track', body: 'Miners run their CV pipeline and return JSON with player boxes, ball position, and pitch keypoints per frame.', dataK: 'latency',  dataV: 'per-clip' },
    score:     { actor: 'Validator', title: 'mAP vs ground truth', body: 'Validators compare submissions to hand-annotated frames and grade with detection and keypoint metrics.', dataK: 'scale',    dataV: 'mAP / OKS' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Runs a CV pipeline on football clips to extract player/ball/pitch annotations.', input: '~30-second video clip + required output schema.', output: 'JSON per frame: bounding boxes, ball position, pitch keypoints.', hardware: 'GPU (consumer-class or better) for real-time inference.', paidFor: 'Annotation accuracy vs hand-labeled ground-truth frames.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Slices match footage, maintains ground-truth annotations, scores miner submissions.', requires: 'Match-footage pipeline + hand-annotated frames + scoring code.', output: 'Per-miner weight vector based on mAP / OKS.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Score = detection mAP and keypoint OKS against hand-annotated ground-truth frames.', explanation: [
    'Validators maintain a hidden set of frames with hand-annotated player, ball, and keypoint positions. Each miner submission is graded with object-detection and keypoint metrics, so partial credit goes to mostly-correct frames and zero credit to spam.',
    'Because the ground truth is real match footage rather than synthetic data, miners must produce models that generalize across leagues, lighting, and camera angles — not just overfit to one tournament.',
  ], cheatPath: 'Returning empty JSON, copying neighbor miners, or guessing fixed positions all collapse against the mAP score on hidden frames.' },
  customer:  { leadOneLine: 'Football data buyers — clubs, broadcasters, betting platforms, analytics shops.', explanation: [
    'Stats Perform, Hawk-Eye, and similar vendors sell match-state data at premium prices because manual annotation is expensive. Score reframes annotation as an open mining task and prices accordingly, opening the same data to smaller clubs, betting feeds, and indie analytics.',
    'Score Predict reuses the same engine to produce match-outcome forecasts for the prediction-market and sportsbook audiences, doubling the monetization surface on a single computer-vision investment.',
  ] },
  competitive: { scope: '2026 · sports CV / annotation', rows: [
    { name: 'Score', subtitle: 'SN44', isSelf: true, approach: 'Open mining of football game-state CV with mAP-graded outputs.', access: 'open · API', accessTone: 'open', differentiator: 'Annotation cost collapses; same engine powers Score Predict.' },
    { name: 'Stats Perform / Opta', approach: 'Centralized sports data vendor with proprietary annotation.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Deep history, premium pricing, no API self-serve.' },
    { name: 'Hawk-Eye', approach: 'Sensor + CV system embedded in stadiums.', access: 'closed · venue', accessTone: 'closed', differentiator: 'Best-in-class accuracy but tied to physical installation.' },
    { name: 'SkillCorner / Track160', approach: 'Broadcast-video CV vendors.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Closest comparables; premium-priced and lab-internal models.' },
    { name: 'Scale AI labeling', approach: 'Human-in-the-loop labeling service.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Generic; expensive per-frame and not real-time.' },
  ], note: 'Score is one of the clearer examples of a Bittensor "data factory" thesis: take a market with hand-labeled premium data and reprice it via open mining competition.' },
  team: { intro: [
    'Score is built by Score Technologies, led by founder Max. The team operates two product lines on the same subnet: Score Vision (the CV annotation engine) and Score Predict (match-outcome forecasting).',
    'Score has been profiled on Bittensor Guru and across the WeAreScore Medium publication, where the founder publishes deep dives on the technical and commercial roadmap.',
  ], founders: [
    { initials: 'MX', gradient: 'v', name: 'Max', role: 'Founder', bio: 'Founder of Score Technologies; leads both Score Vision and Score Predict on Subnet 44.' },
  ], size: 'Small core team', founded: '2024', based: 'Not publicly disclosed.', backers: 'Not publicly disclosed.', placeholder: false },
  milestones: [
    { date: '2024', text: 'Score launches on Subnet 44 with the Score Vision CV pipeline for football.' },
    { date: '2025', text: 'Score Predict released, extending the engine to match-outcome forecasting.' },
  ],
  join: { title: 'Annotate the beautiful game', body: 'If you ship CV models — detection + keypoints on football footage — register as a miner. Validators need match-video pipelines and ground-truth annotations.', asideNote: 'Read the WeAreScore Medium deep-dive for the technical scope.' },
  tags: ['computer-vision', 'sports', 'football', 'video'],
  external: { github: 'https://github.com/score-technologies/score-vision', website: 'https://www.wearescore.io/', taostats: 'https://taostats.io/subnets/44/' },
  tweets: [],
};
