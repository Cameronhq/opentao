import type { RichSubnet } from '../subnet-rich';

export const sn33: RichSubnet = {
  slug: '33-readyai',
  netuid: 33,
  name: 'ReadyAI',
  shortPitch: 'Structured data annotation at scale — turns raw text/PDFs into AI-ready datasets.',
  overview: [
    'Subnet 33 — ReadyAI — is a Bittensor subnet operated by Afterparty AI that runs a decentralized structured-data annotation pipeline. Miners use fine-tuned LLMs to convert unstructured inputs (transcripts, PDFs, social posts, Common Crawl text) into richly tagged, metadata-enhanced JSON that is directly usable for fine-tuning and RAG. The codebase is published at github.com/afterpartyai/bittensor-conversation-genome-project.',
    'Validators send raw conversation / document chunks to miners, who annotate them with personas, topics, sentiment, and other structured fields. Validators independently re-annotate samples (or compare against a reference) to score miner output, then write weights on-chain. The team reports outperforming Mechanical Turk by 91% and GPT-4o-direct by 50% on annotation benchmarks while costing ~660x less than Mechanical Turk.',
    'Customers are outside Bittensor: AI teams building fine-tuned LLMs or RAG products that need labelled / structured corpora, plus the broader open-source community that benefits from publicly-released datasets like the team\'s annotated "Conversational Genome" dialogue corpus.',
    'The competitive wedge versus crowdsourcing platforms (Scale AI, Surge, Mechanical Turk) is cost; versus GPT-4o-direct it is reported quality + price. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send raw chunk', body: 'Validator picks a chunk of raw unstructured data (conversation transcript, PDF section, social post thread) and dispatches it to a sample of miners with a schema describing what to annotate.', dataK: 'payload', dataV: 'raw text + annotation schema' },
    compute:   { actor: 'Miner',     title: 'Annotate with LLM', body: 'Miner runs its fine-tuned annotation LLM(s) over the chunk, producing structured JSON: persona tags, topic labels, entities, sentiment, and any other schema-required fields.', dataK: 'latency',  dataV: 'seconds-scale per chunk' },
    score:     { actor: 'Validator', title: 'Grade vs reference', body: 'Validator re-annotates a subset with a reference pipeline (or known ground truth) and scores miner annotations on schema compliance, accuracy, and coverage; writes per-miner weights on-chain.', dataK: 'scale', dataV: 'schema match · accuracy · coverage' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs fine-tuned LLM annotation models to convert raw text into structured, schema-compliant JSON labels.',
    input: 'Raw unstructured chunk (conversation transcript, PDF section, social post) + target schema.',
    output: 'Structured JSON annotation matching the requested schema.',
    hardware: 'GPU host(s) running mid-sized fine-tuned LLMs; fast inference for batch annotation throughput.',
    paidFor: 'Schema-compliant annotations that match validator re-annotation / reference labels with high accuracy and coverage.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Sources raw data, defines the annotation schema, queries miners, re-annotates samples for comparison, and writes weights every tempo.',
    requires: 'Stake plus access to raw data sources, a reference annotation pipeline, and storage for the produced structured datasets.',
    output: 'Per-miner weight vector reflecting annotation accuracy + structured output produced by the subnet.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Annotation accuracy and schema compliance — graded against a validator reference pipeline.',
    explanation: [
      'For each annotated chunk the validator either has a known reference label (gold-standard data) or runs its own reference annotation pipeline using a strong model. It then compares the miner\'s structured JSON to that reference on three axes: schema compliance (did every required field appear), accuracy (do labels match reference / ground truth), and coverage (did the miner annotate everything that should have been annotated).',
      'Scores accumulate across many chunks; weights are written on-chain every tempo and Yuma consensus picks the median. Validators are encouraged to publish anonymized reference samples so miners can self-evaluate, which makes the scoring surface less opaque than typical "trust the validator" mechanisms.',
    ],
    cheatPath: 'A miner can echo back template JSON without truly reading the chunk, fabricate plausible-sounding labels, or game schema coverage by overusing certain tags. Reference comparison kills hollow annotations, content-aware scoring kills fabrication, and tag-distribution sanity checks catch coverage gaming. Sybil farms reusing one annotation LLM converge in scores and gain nothing from copies.',
  },
  customer: {
    leadOneLine: 'AI teams fine-tuning LLMs and building RAG products who need cheap, high-quality structured datasets at scale.',
    explanation: [
      'Buyers are external: AI startups, enterprise ML teams, and academic groups that need labelled or structured corpora for fine-tuning, evaluation, or RAG ingestion. ReadyAI sells access to the annotation pipeline as a service and also publishes example datasets like the Conversational Genome (annotated, persona-labeled dialogue) for the open-source community.',
      'The pitch versus Scale AI / Surge / Mechanical Turk is price + speed: ~660x cheaper than Mechanical Turk per the team\'s own benchmarks, with quality reported as 91% better than MTurk and 50% better than naive GPT-4o annotations. That makes previously-uneconomical labelling jobs (huge corpora, fine-grained schemas) suddenly affordable.',
    ],
  },
  competitive: {
    scope: 'data annotation / structured-data pipelines for AI · 2026',
    rows: [
      { name: 'ReadyAI', subtitle: 'SN33', isSelf: true, approach: 'Bittensor-incentivized network of fine-tuned annotation LLMs; validators grade structured-JSON outputs against reference annotations.', access: 'open · API', accessTone: 'open', differentiator: '~660x cheaper than MTurk per team\'s benchmarks; open-source schemas + sample datasets; routes to best annotators automatically.' },
      { name: 'Scale AI', approach: 'Centralized human-in-the-loop labelling at very large scale; serves frontier labs and enterprises.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Premium quality + sales motion but expensive and slow vs LLM-pipeline alternatives.' },
      { name: 'Surge AI / Snorkel', approach: 'Crowd + programmatic labelling combining humans and weak supervision.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Mature tooling; centralized vendor pricing.' },
      { name: 'Amazon Mechanical Turk', approach: 'General-purpose crowdsourcing platform; users post HITs and pay workers per task.', access: 'open · marketplace', accessTone: 'open', differentiator: 'Long-running but low-quality for complex schemas; the team\'s explicit comparison baseline.' },
      { name: 'GPT-4o / Claude direct annotation', approach: 'Calling frontier LLMs directly with annotation prompts.', access: 'closed · API', accessTone: 'closed', differentiator: 'Easy to start, but no incentive for quality, no rotation across models, and unit cost stays at vendor list price.' },
    ],
    note: 'ReadyAI competes head-on with both crowdsourcing platforms (Scale, Surge, MTurk) and direct LLM-annotation. The wedge is using Bittensor to run a tournament of small fine-tuned annotators against a reference, achieving big cost reductions without the quality collapse typical of pure crowdsourcing.',
  },
  team: {
    intro: [
      'Subnet 33 is built and operated by Afterparty AI, a startup founded in 2021 that pivoted into structured-data annotation. In September 2023 Afterparty AI announced a $5M raise led by Blockchange Ventures.',
      'The team\'s philosophy is that structured / labelled data is the long-term bottleneck for both fine-tuning and RAG, and that an open Bittensor tournament of annotator LLMs can produce higher quality at radically lower cost than crowdsourcing or naive single-model labelling.',
    ],
    founders: [
      { initials: 'AP', gradient: 'v', name: '[Afterparty AI founders]', role: 'Founders, Afterparty AI', bio: 'Afterparty AI founded in 2021; raised $5M led by Blockchange Ventures in September 2023; operates subnet 33 under the ReadyAI brand. Individual founder names not extensively documented in publicly cross-checked sources.', twitter: 'https://x.com/readyai_' },
    ],
    size: 'Afterparty AI team (small-to-mid startup)',
    founded: '2021 (Afterparty AI) / SN33 launched 2024',
    based: 'United States',
    backers: '$5M led by Blockchange Ventures (Sep 2023).',
    placeholder: true,
  },
  milestones: [
    { date: '2021', text: 'Afterparty AI founded as the parent company.' },
    { date: '2023·09', text: 'Afterparty AI announces $5M funding round led by Blockchange Ventures.' },
    { date: '2024', text: 'Subnet 33 launched as the Conversation Genome Project / ReadyAI on Bittensor; bittensor-conversation-genome-project repo open-sourced.' },
    { date: '2025', text: 'Team publishes benchmarks claiming 91% better than MTurk and 50% better than GPT-4o-direct on annotation accuracy, ~660x cheaper than MTurk.' },
  ],
  join: {
    title: 'Annotate at subnet scale',
    body: 'Run a miner that annotates raw chunks into structured JSON, or hit the ReadyAI API to label your own corpora. Repo: github.com/afterpartyai/bittensor-conversation-genome-project.',
    asideNote: 'Schema-compliant output is essential — validators score on schema match, accuracy, and coverage together.',
  },
  tags: ['data', 'annotation', 'datasets', 'fine-tuning', 'rag'],
  external: {
    github: 'https://github.com/afterpartyai/bittensor-conversation-genome-project',
    website: 'https://readyai.ai',
    twitter: 'https://x.com/readyai_',
    taostats: 'https://taostats.io/subnets/33/',
  },
};
