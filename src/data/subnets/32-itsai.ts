import type { RichSubnet } from '../subnet-rich';

export const sn32: RichSubnet = {
  slug: '32-itsai',
  netuid: 32,
  name: "It's AI",
  shortPitch: 'Decentralized AI-text detection — distinguishes human from LLM writing at 90%+ accuracy.',
  overview: [
    "Subnet 32 — It's AI — is a Bittensor subnet specialized in detecting AI-generated text. The team built and operates a hosted detector at its-ai.org and app.its-ai.org plus a Chrome extension, all powered by the SN32 miner network. The source lives at github.com/It-s-AI/llm-detection.",
    'Validators issue mixed human/LLM text samples to miners, who return a probability that the text is machine-written. Validators score miners against ground-truth labels and write weights on-chain; the team reports state-of-the-art benchmark results on RAID, GRiD, and CUDRT datasets with detection accuracy near 92%.',
    'Customers are outside Bittensor: educators verifying student work, content platforms moderating AI-generated submissions, recruiters screening cover letters, and compliance teams flagging AI-written disclosures. ITSAI Technologies (the operating company, incorporated in Dubai in early 2025) reports paying-customer revenue and tens of thousands of monthly website visits.',
    "Unlike OpenAI's now-discontinued classifier or single-vendor tools like GPTZero / Originality.ai, It's AI uses an open subnet of competing detectors — every miner is incentivised to track the next-generation LLMs. <a href=\"#customer\" style=\"color: var(--accent);\">See competitive landscape ↓</a>",
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send labelled text', body: 'Validator constructs a batch of mixed human-written and LLM-generated text (varied length, domain, model) and dispatches it to miners with the labels withheld.', dataK: 'payload', dataV: 'text batch + hidden labels' },
    compute:   { actor: 'Miner',     title: 'Classify text', body: 'Miner runs its detector model on each sample and returns a probability that the text is AI-generated; can use ensembles, perplexity features, classifier heads.', dataK: 'latency',  dataV: 'sub-second per sample' },
    score:     { actor: 'Validator', title: 'Score vs labels', body: 'Validator compares returned probabilities to ground truth labels using AUC / F1 / Matthews correlation, accumulates per-miner accuracy, writes weights on-chain.', dataK: 'scale', dataV: 'AUC · F1 · MCC' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Trains and serves an LLM-text-detection model; classifies short and long text samples as human-written or AI-generated.',
    input: 'Text sample(s) from a validator probe or hosted-API call.',
    output: 'Per-sample probability that the text is machine-generated.',
    hardware: 'GPU host (modest — classifier models are typically small); fresh training data covering newly-released LLMs.',
    paidFor: 'Highest classification accuracy across benchmark + ongoing fresh-LLM probes (AUC / F1 / MCC).',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Builds labelled text batches across many models and domains, queries miners, computes per-miner accuracy metrics, writes on-chain weights.',
    requires: 'Stake plus a curation pipeline of human-written and AI-generated text samples (with known labels) covering current frontier models.',
    output: 'Per-miner weight vector reflecting classification accuracy on held-out labelled data.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Classification accuracy — AUC, F1, and Matthews correlation against ground-truth labels — measured on a fast-rotating eval set.',
    explanation: [
      'Validators continuously assemble labelled batches covering the current frontier LLMs (GPT-class, Claude-class, Gemini-class, open-source) across multiple domains — academic essays, social posts, code, news articles, marketing copy. They probe miners with these batches and compute per-miner metrics: AUC for ranking quality, F1 for thresholded classification, and MCC for balanced accuracy on imbalanced batches.',
      'The eval set rotates as new LLMs ship. Miners that nailed last-quarter\'s detectors but never updated their training data will lose weight rapidly as new model families show up in the probe stream. Weights are written on-chain every tempo and Yuma consensus picks the median, so a single rogue validator cannot reward a friendly miner.',
    ],
    cheatPath: 'A miner can overfit to one validator\'s probe distribution, copy another miner\'s public detector model, or always return "AI" / always return "human" hoping for class imbalance. Multi-validator rotation, balanced batches, and MCC scoring punish all three: AUC kills constant-output strategies, rotation kills overfitting, and benchmark cross-checks kill copycats.',
  },
  customer: {
    leadOneLine: 'Schools, content platforms, recruiters, and compliance teams who need a verifiable AI-text detector — sold as a hosted SaaS by ITSAI Technologies.',
    explanation: [
      'The hosted product at its-ai.org / app.its-ai.org plus the Chrome extension lets non-technical users (teachers, editors, hiring managers) check arbitrary text in-browser. There is also a developer API for content platforms that want detection at scale, and an X bot that publicly checks tweets.',
      'ITSAI Technologies — registered in Dubai in January 2025 — reports paying-customer revenue and 22k+ monthly website visits as of early 2025. The market the team targets (English-language AI-text detection across education, hiring, and content moderation) is positioned as a multi-billion-dollar problem on their own materials.',
    ],
  },
  competitive: {
    scope: 'AI-generated text detection · 2026',
    rows: [
      { name: "It's AI", subtitle: 'SN32', isSelf: true, approach: 'Bittensor-incentivized detector network; many miners compete on AUC/F1/MCC across a rotating frontier-LLM eval set.', access: 'open · API + console', accessTone: 'open', differentiator: 'Constantly-renewed detection across new LLMs; hosted product + Chrome extension + API.' },
      { name: 'GPTZero', approach: 'Centralized AI-text detector originally aimed at educators; commercial SaaS.', access: 'closed · API', accessTone: 'closed', differentiator: 'Strong brand in education; single-vendor model under heavy criticism for false positives.' },
      { name: 'Originality.ai', approach: 'Commercial detector + plagiarism checker aimed at content marketers / SEO teams.', access: 'closed · API', accessTone: 'closed', differentiator: 'Bundled plagiarism + AI detection; centralized model.' },
      { name: "Turnitin AI detector", approach: 'AI-text detection embedded into Turnitin\'s academic integrity stack used by universities.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Deep school distribution; closed scoring methodology; institutional buying.' },
      { name: 'Open-source detectors (e.g. DetectGPT, Binoculars)', approach: 'Research detectors using likelihood / perplexity statistics or contrastive scoring.', access: 'open · code', accessTone: 'open', differentiator: 'Strong methods but no productized hosting, no ongoing model refresh, no go-to-market.' },
    ],
    note: "Detection is a moving target — new LLMs degrade old detectors every few months. It's AI's bet is that a Bittensor incentive layer + permanent eval rotation produces a detector network that keeps up with the frontier better than any single vendor. The competitive moat is the ongoing model refresh, not a single architecture.",
  },
  team: {
    intro: [
      "It's AI is operated by ITSAI Technologies — a small ML-focused company incorporated in Dubai at the end of January 2025. The team had been mining and validating on Bittensor before launching SN32, then built a hosted product surface on top.",
      'The team\'s philosophy is that AI detection should be measurable against academic benchmarks (they claim SOTA on RAID, GRiD, CUDRT) and visible to end users — hence the consumer Chrome extension and X bot in addition to the developer API.',
    ],
    founders: [
      { initials: 'IA', gradient: 'v', name: "[It's AI core team]", role: 'Operator, ITSAI Technologies', bio: "The SN32 team operates under the It's AI / ITSAI Technologies brand from Dubai; the founders\' individual identities are not extensively documented in publicly cross-checkable sources.", twitter: 'https://x.com/ai_detection' },
    ],
    size: 'Small team (ITSAI Technologies)',
    founded: '2025·01 (ITSAI Technologies incorporated in Dubai)',
    based: 'Dubai, UAE',
    backers: 'No public funding round disclosed; team cites paying-customer revenue.',
    placeholder: true,
  },
  milestones: [
    { date: '2024', text: 'Subnet 32 launched as "It\'s AI" focused on detecting LLM-generated text.' },
    { date: '2025·01', text: 'ITSAI Technologies incorporated in Dubai as the operating entity behind the SN32 detector network.' },
    { date: '2025', text: 'Team reports SOTA results on RAID, GRiD, and CUDRT datasets; launches Chrome extension and X-bot detector.' },
    { date: '2025·02', text: 'Public traction reported: 22k+ monthly website visits to its-ai.org; paying-customer revenue.' },
  ],
  join: {
    title: 'Detect AI text on subnet 32',
    body: "Train an LLM-text-detection model and register a miner on SN32, or hit the It's AI API / Chrome extension as an end user. Repo: github.com/It-s-AI/llm-detection.",
    asideNote: 'Detector accuracy degrades when new LLMs ship — winning miners ship fresh training data continuously.',
  },
  tags: ['detection', 'classification', 'content', 'safety', 'nlp'],
  external: {
    github: 'https://github.com/It-s-AI/llm-detection',
    website: 'https://its-ai.org',
    twitter: 'https://x.com/ai_detection',
    taostats: 'https://taostats.io/subnets/32/',
  },
};
