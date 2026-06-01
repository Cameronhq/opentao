import type { RichSubnet } from '../subnet-rich';

export const gradients: RichSubnet = {
  slug: '56-gradients',
  netuid: 56,
  name: 'Gradients',
  shortPitch: 'No-code LLM fine-tuning marketplace where miners compete to deliver the best model.',
  overview: [
    'Gradients is Bittensor subnet 56, operated by Rayon Labs — the same team behind Chutes (SN64) and Nineteen (SN19). It is a no-code fine-tuning marketplace: customers upload a dataset and pick a base model, and a swarm of miners competes to return the highest-scoring fine-tuned weights.',
    'Miners are GPU operators (and, since the July 2025 tournament redesign, submitters of open-source training scripts that run on validator-controlled compute in isolated environments). A single main validator operated by Rayon Labs runs evaluations; ranking is by held-out evaluation loss on the customer task.',
    'The customer is anyone outside Bittensor who wants a custom fine-tuned LLM or diffusion model — hobbyists, indie devs, and small teams who want better results than HuggingFace AutoTrain or Together AI without writing training code. Pricing has been quoted around $5/hr of training.',
    'One-line diff: an open AutoML tournament rather than a single managed training pipeline. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Publish task', body: 'Validator advertises a fine-tuning job: base model, dataset, hyperparameter budget, and time limit (text tasks 3–10h, image tasks 1–2h).', dataK: 'payload', dataV: 'base model + dataset + budget' },
    compute:   { actor: 'Miner',     title: 'Train + submit', body: 'Miner submits an open-source training script (post-July-2025 tournament design). The validator executes it on dedicated GPUs inside a sandboxed environment with no internet access.', dataK: 'window',  dataV: '1–10 h per task' },
    score:     { actor: 'Validator', title: 'Eval on held-out set', body: 'Each candidate model is evaluated on a held-out test split. Lower eval loss / higher task metric wins; top performers receive exponentially higher weights.', dataK: 'metric',    dataV: 'held-out eval loss' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Submits open-source fine-tuning training scripts (and historically ran the training themselves) competing on held-out eval performance.',
    input: 'Validator-published task: base model + customer dataset + time budget.',
    output: 'A fine-tuned model checkpoint (or training script that produces one) evaluated against a held-out test split.',
    hardware: 'High-end GPUs sized to the task — from a single A100/H100 for 7B-class models up to multi-GPU clusters for 70B fine-tunes.',
    paidFor: 'Producing the lowest-loss fine-tuned model in the tournament window.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Publishes tasks, runs miner-submitted training scripts in isolated sandboxes, evaluates outputs on held-out data, and writes weights on-chain. In practice a single main validator operated by Rayon Labs.',
    requires: 'Dedicated training-grade GPU infrastructure plus min-stake to register as a Bittensor validator.',
    output: 'Per-miner weight vector ranking fine-tune quality.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Lowest held-out evaluation loss on the customer task wins, with exponentially heavier weight on the top of the leaderboard.',
    explanation: [
      'Each tournament is a controlled experiment: identical base model, identical dataset, identical time budget. Miners differ only in their training script — choice of optimizer, learning-rate schedule, LoRA vs full fine-tune, data ordering, regularization. Validators load each candidate and evaluate on a private held-out split that miners never see.',
      'The Rayon Labs paper (Subia-Waud, 2025) reports Gradients winning 100% vs Together AI, Databricks, and Google Cloud, and 82.8% vs HuggingFace AutoTrain across 180 controlled tasks from 70M to 70B parameters — the central evidence that competitive AutoML beats single-strategy managed pipelines.',
    ],
    cheatPath: 'Classic attacks are overfitting to a leaked test set or hard-coding answers into the script. The post-July-2025 design mitigates both: training scripts run on validator compute in sandboxes with no internet access, and the held-out split is private to the validator. The remaining attack surface is collusion with the single main validator — a centralization risk Rayon Labs has openly acknowledged.',
  },
  customer: {
    leadOneLine: 'Anyone who wants a custom fine-tuned LLM or diffusion model without writing training code — and who is tired of suboptimal defaults from managed AutoML providers.',
    explanation: [
      'The unlock for end customers is "upload dataset, pick base model, click train" — a no-code workflow that delivers a deployable checkpoint (with Hugging Face export and Weights & Biases tracking). By April 2025 the platform had reportedly attracted around 3,000 paying users, mostly hobbyists and indie builders.',
      'Pricing has been quoted around $5/hour of training, undercutting Together AI, Databricks, and hyperscaler fine-tuning APIs. The pitch to customers is not just price — it is that 192 independent miners exploring the hyperparameter space in parallel tend to find better configurations than any one provider\'s default recipe.',
    ],
  },
  competitive: {
    scope: 'managed LLM fine-tuning · 2026',
    rows: [
      { name: 'Gradients', subtitle: 'SN56', isSelf: true, approach: 'Open tournament: miners submit training scripts, validators run them in sandboxes and score on held-out eval loss.', access: 'open · web app + API', accessTone: 'open', differentiator: 'Competitive AutoML across many independent strategies, not a single managed recipe.' },
      { name: 'OpenAI fine-tuning API', approach: 'Managed supervised fine-tuning and RFT on OpenAI base models (GPT-4o, GPT-4.1, o-series) with a fixed proprietary training stack.', access: 'closed · OpenAI API only', accessTone: 'closed', differentiator: 'Best-in-class base models but the recipe is fixed and the weights never leave OpenAI.' },
      { name: 'Together AI fine-tuning', approach: 'Managed LoRA and full fine-tuning on open-weight models (Llama, Mistral, Qwen) on Together\'s GPU cloud.', access: 'open · API + dashboard', accessTone: 'open', differentiator: 'Open weights returned to customer, but single default training recipe.' },
      { name: 'Hugging Face AutoTrain', approach: 'No-code AutoML for fine-tuning open-weight models from the Hub, run on Hugging Face Spaces or local hardware.', access: 'open · web UI', accessTone: 'open', differentiator: 'Closest UX analog; Gradients paper reports 82.8% win rate against it across 180 tasks.' },
      { name: 'Databricks / Mosaic foundation model training', approach: 'Enterprise managed pre-training and fine-tuning on the Databricks Lakehouse, with MPT/DBRX-class infrastructure.', access: 'closed · enterprise contract', accessTone: 'closed', differentiator: 'Enterprise-scale data + governance, but priced for large customers and a single recipe.' },
    ],
    note: 'Gradients\' wedge is the tournament structure itself: instead of one provider guessing hyperparameters, dozens of miners explore the space in parallel and the winner is decided by held-out loss. The trade-off is dependence on a single Rayon-operated main validator and a learning curve around tournament cadence rather than instant-on managed training.',
  },
  team: {
    intro: [
      'Gradients is operated by Rayon Labs, the same team that runs Chutes (SN64, serverless inference) and Nineteen (SN19, image inference). Together the "Rayon trio" has at times accounted for ~20%+ of daily Bittensor emissions, making Rayon the most commercially active subnet operator on the network.',
      'Rayon\'s thesis is that economic competition outperforms managed AutoML: turn fine-tuning into a tournament where many independent miners search the hyperparameter space in parallel, and let the market — not a single recipe — pick the winning configuration.',
    ],
    founders: [
      { initials: 'NM', gradient: 'v', name: 'Namoray', role: 'Co-founder · Rayon Labs', bio: 'Pseudonymous co-founder of Rayon Labs; public-facing operator across Gradients, Chutes, and Nineteen.', twitter: 'https://twitter.com/namoray_dev' },
      { initials: 'JD', gradient: 'a', name: 'Jon Durbin', role: 'Co-founder · Rayon Labs', bio: 'Co-founder of Rayon Labs; longtime open-source LLM fine-tuner known for the Airoboros dataset and model family.', twitter: 'https://twitter.com/jon_durbin', github: 'https://github.com/jondurbin' },
      { initials: 'CS', gradient: 'g', name: 'Christopher Subia-Waud', role: 'Research · Rayon Labs', bio: 'Lead author of the Gradients paper "When Markets Meet Fine-tuning" (arXiv 2506.07940), which formalises the tournament mechanism and the 180-task benchmark.' },
    ],
    size: '~10–20', founded: '2024', based: 'Remote / distributed',
    backers: 'Self-funded via subnet emissions; no disclosed external round.',
    placeholder: false,
  },
  milestones: [
    { date: '2024·10', text: 'Subnet 56 registered as Gradients by Rayon Labs.' },
    { date: '2025·04', text: 'Gradients reportedly crosses ~3,000 paying users; SN56 token rallies over 500% in a few weeks and reaches a top-5 market-cap subnet.' },
    { date: '2025·07', text: 'Incentive redesign: tournament-style mining where miners submit training scripts and validators execute them on sandboxed compute with no internet access.' },
    { date: '2025·06', text: 'Research paper "Gradients: When Markets Meet Fine-tuning" published (arXiv 2506.07940), reporting 100% win rate vs Together AI / Databricks / Google Cloud and 82.8% vs HuggingFace AutoTrain across 180 tasks.' },
  ],
  join: {
    title: 'Fine-tune a model on Gradients',
    body: 'Customers can sign up at gradients.io, upload a dataset, pick a base model, and launch a tournament. Miners and validators install the G.O.D stack from github.com/rayonlabs/G.O.D and register on netuid 56.',
    asideNote: 'Mining requires training-grade GPUs and a competitive script. Live network stats are on taostats.io/subnets/56/.',
  },
  tags: ['fine-tuning', 'AutoML', 'no-code', 'LLM training', 'diffusion', 'Rayon Labs'],
  external: {
    github: 'https://github.com/rayonlabs/G.O.D',
    website: 'https://gradients.io',
    twitter: 'https://twitter.com/rayon_labs',
    taostats: 'https://taostats.io/subnets/56/',
  },
  tweets: [
    { when: '2025·04', body: 'Chain of Thought: "Gradients, aka Subnet 56 on Bittensor, is @rayon_labs\' take on decentralized AI training. And it\'s built for everyone. No PhD required."' },
  ],
};
