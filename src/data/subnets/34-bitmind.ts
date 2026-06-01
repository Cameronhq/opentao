import type { RichSubnet } from '../subnet-rich';

export const sn34: RichSubnet = {
  slug: '34-bitmind',
  netuid: 34,
  name: 'BitMind',
  shortPitch: 'Decentralized deepfake detection across image, video, and audio.',
  overview: [
    'Subnet 34 — BitMind — is a Bittensor subnet specialized in detecting AI-generated media (deepfakes) across images, video, and audio. The team ships a mobile app, a Chrome extension, an X / Telegram bot ("AI or Not"), and a developer API, all powered by the SN34 detector network. Source is at github.com/BitMind-AI/bitmind-subnet.',
    'Validators send mixed batches of real and AI-generated media to miners and score returned probabilities using Matthews Correlation Coefficient (MCC), which handles class-imbalance better than raw accuracy. The team reports current detection accuracy ~88% with a >25% improvement over launch baseline thanks to subnet-driven model competition.',
    'Customers are external: social platforms moderating deepfake content, news organizations verifying media, brand-safety teams, and end-users wanting on-device verification via the mobile app. BitMind has also integrated with the SERAPH autonomous agent framework, becoming the first subnet to plug into a Virtuals Protocol AI agent.',
    'Unlike closed deepfake vendors (Reality Defender, Sensity, Hive), BitMind\'s detector pool is an open tournament — every miner is incentivised to track the next-generation generators. Plans include a "Gas" subnet (Generative Adversarial Subnet) to pit generators against detectors continuously. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send media batch', body: 'Validator constructs a mixed batch of real and AI-generated images/videos/audio drawn from many generator families and dispatches it to miners with labels withheld.', dataK: 'payload', dataV: 'image/video/audio batch' },
    compute:   { actor: 'Miner',     title: 'Detect deepfake', body: 'Miner runs its detector models on each sample and returns probability that the media is synthetic; many miners use ensembles of CNN, transformer, and frequency-domain detectors.', dataK: 'latency',  dataV: 'sub-second per sample' },
    score:     { actor: 'Validator', title: 'MCC vs labels', body: 'Validator computes Matthews Correlation Coefficient between miner predictions and ground-truth labels, accumulates per-miner scores, writes weights on-chain.', dataK: 'scale', dataV: 'MCC across modalities' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Trains and serves deepfake-detection models for images, video, and audio; returns per-sample synthetic-probability scores.',
    input: 'Media sample(s) from a validator probe or hosted-API request.',
    output: 'Per-sample probability that the media is AI-generated.',
    hardware: 'GPU host(s) running ensembles of CNN/transformer detectors; ongoing access to fresh generator outputs for training.',
    paidFor: 'High Matthews Correlation Coefficient on validator probes across many generator families.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Builds mixed batches of real and AI-generated media, queries miners, computes MCC, writes on-chain weights.',
    requires: 'Stake plus a curation pipeline of real + synthetic media (covering current image/video/audio generators) and ground-truth labels.',
    output: 'Per-miner weight vector reflecting MCC on the current eval set.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Matthews Correlation Coefficient on mixed real/synthetic batches — class-imbalance-aware accuracy.',
    explanation: [
      'Raw accuracy is misleading on deepfake detection because real-world traffic is highly skewed toward real media — a "always say real" miner could score 95% accuracy and be worthless. BitMind uses Matthews Correlation Coefficient (MCC), which combines true positives, true negatives, false positives, and false negatives into a single score from -1 to +1 that stays meaningful under imbalance.',
      'Validators rotate generator families (Stable Diffusion variants, DALL-E, Midjourney, Sora-class video, ElevenLabs-class audio) into the eval set as new ones ship. Miners that nailed last quarter\'s diffusion outputs but never trained on the latest video generators will see MCC fall. Weights are written on-chain every tempo and Yuma consensus picks the median.',
    ],
    cheatPath: 'A miner can always predict "AI" or always predict "real", overfit to one validator\'s probe distribution, or copy another miner\'s detector. MCC kills constant-output strategies (one of TN/TP will be zero so MCC ≈ 0), multi-validator rotation kills overfitting, and cross-validator score correlation flags identical copycats.',
  },
  customer: {
    leadOneLine: 'Social platforms, newsrooms, brand-safety teams, and end-users who need verifiable deepfake detection at the point of consumption.',
    explanation: [
      'The hosted product surface includes a mobile app (App Store + Play Store), a Chrome extension, an "AI or Not" Telegram and X bot, and a developer API. End-users can check a single image on their phone; platforms can plug the API into moderation pipelines; news teams can verify viral video before it spreads.',
      'BitMind has also positioned the subnet as detection infrastructure for autonomous AI agents — the SERAPH integration (Virtuals Protocol) makes BitMind callable from agent frameworks. The longer-term plan is a "Gas" (Generative Adversarial Subnet) where AI generators continuously challenge the SN34 detectors, keeping the network ahead of frontier synthesis.',
    ],
  },
  competitive: {
    scope: 'deepfake / synthetic-media detection · 2026',
    rows: [
      { name: 'BitMind', subtitle: 'SN34', isSelf: true, approach: 'Bittensor-incentivized detector network across image/video/audio; MCC scoring against rotating generator families.', access: 'open · API + apps', accessTone: 'open', differentiator: 'Open subnet tournament keeps pace with new generators; consumer apps + agent integration (SERAPH).' },
      { name: 'Reality Defender', approach: 'Enterprise deepfake-detection vendor focused on banks, governments, and platforms.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Strong sales motion into regulated industries; closed scoring.' },
      { name: 'Hive Moderation', approach: 'Centralized AI-moderation vendor offering deepfake detection alongside CSAM, violence, NSFW classifiers.', access: 'closed · API', accessTone: 'closed', differentiator: 'Broad moderation stack but single-vendor model + closed scoring.' },
      { name: 'Sensity AI', approach: 'Deepfake-monitoring and detection platform focused on threat intel.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Threat-intel framing for enterprises; centralized.' },
      { name: 'Intel FakeCatcher / academic detectors', approach: 'Vendor and research detectors using physiological / frequency-domain features.', access: 'mixed', accessTone: 'closed', differentiator: 'Strong methods on specific cohorts; no continuous-tournament refresh model.' },
    ],
    note: 'Deepfake detection ages fast — every new generator family invalidates last year\'s detectors. BitMind\'s thesis is that the only durable architecture is a tournament that pays detectors to keep up. The "Gas" subnet plan formalises this by pitting generator miners against detector miners directly inside Bittensor.',
  },
  team: {
    intro: [
      'BitMind is operated by a US-based team led by Ken Jon Miyachi (CEO, ex-NEAR Foundation, ex-Amazon, founded LedgerSafe), with Dylan Uys (Head of AI, ML across CV/NLP/fraud at ViaSat and Poshmark) and Canh Trinh (Head of Engineering, ex-Axelar, ex-JPMC, ex-Deutsche Bank).',
      'The team\'s philosophy is that deepfake detection has to be a continuously-tournamented, open network — closed single-vendor models always fall behind the next generator wave. The "Gas" Generative Adversarial Subnet plan is the long-form version of that thesis.',
    ],
    founders: [
      { initials: 'KM', gradient: 'v', name: 'Ken Jon Miyachi', role: 'Co-founder & CEO, BitMind', bio: 'Previously Senior Tech Lead at the NEAR Foundation; before BitMind founded LedgerSafe and worked at Amazon on recommendation systems.', twitter: 'https://x.com/BitMindAI' },
      { initials: 'DU', gradient: 'a', name: 'Dylan Uys', role: 'Co-founder & Head of AI, BitMind', bio: 'ML across computer vision, NLP, fraud detection, recommender systems, and search at ViaSat and Poshmark.' },
      { initials: 'CT', gradient: 'g', name: 'Canh Trinh', role: 'Head of Engineering, BitMind', bio: 'Previously led interoperability integrations at Axelar; engineering / leadership roles at JPMorgan Chase and Deutsche Bank.' },
    ],
    size: 'Small core team (multiple eng + research)',
    founded: '2024',
    based: 'United States',
    backers: 'Investment memo by Unsupervised Capital (publicly published).',
    placeholder: false,
  },
  milestones: [
    { date: '2024', text: 'Subnet 34 launched; bitmind-subnet repo open-sourced under BitMind-AI on GitHub.' },
    { date: '2024·12', text: 'SERAPH (Virtuals Protocol AI agent) integration — first subnet to plug into an autonomous-agent framework.' },
    { date: '2025·02', text: 'Subnet roadmap "Powering the Future of Content Detection" published; detection accuracy reported >25% improvement since launch.' },
    { date: '2025·04', text: 'Mobile app live on App Store and Play Store — migration from the "AI or Not" Telegram game to native mobile.' },
  ],
  join: {
    title: 'Run a detector or check a deepfake',
    body: 'Train a multi-modal deepfake detector and register a miner on SN34, or pull the BitMind app / Chrome extension / API to verify media. Repo: github.com/BitMind-AI/bitmind-subnet.',
    asideNote: 'MCC scoring means class-imbalance gaming does not work — calibration matters.',
  },
  tags: ['deepfake', 'detection', 'media', 'safety', 'agents'],
  external: {
    github: 'https://github.com/BitMind-AI/bitmind-subnet',
    website: 'https://bitmind.ai',
    twitter: 'https://x.com/BitMindAI',
    taostats: 'https://taostats.io/subnets/34/',
  },
};
