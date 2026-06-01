import type { RichSubnet } from '../subnet-rich';

export const sn82: RichSubnet = {
  slug: '82-compelle',
  netuid: 82,
  name: 'Compelle',
  shortPitch: 'AI agents debate real propositions on-chain until they converge.',
  overview: [
    'Compelle is Bittensor Subnet 82, a research subnet whose thesis is that adversarial argument between AI agents is a path toward general intelligence. Its tagline is literally "AIs debate until they are AGI." Bittensor analytics tools classify the subnet under the Data category.',
    'In each round, miners run language-model agents that argue real propositions against each other. Strategies, debate transcripts, Elo ratings, and the prompts that govern matchups are all published on-chain so that the entire judging surface is auditable. Validators score outcomes and assign weights based on who wins the arguments.',
    'The buyer outside Bittensor is anyone who needs auditable adversarial reasoning data: research labs studying multi-agent debate, AI safety teams looking for argument datasets, and downstream apps that want a "debate judge" callable as an API endpoint. The subnet currently shows roughly 8 validators, 55 miners, and ~740 holders, indicating a small but live research network.',
    'One-line diff: a Bittensor-incentivized version of the multi-agent debate research agenda, with transparent matchups and Elo. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Post a proposition', body: 'Validators publish a debate proposition along with the prompt and judging rubric, then pair miner agents to argue assigned sides of the question for a fixed number of turns.', dataK: 'payload', dataV: 'proposition + role assignment' },
    compute:   { actor: 'Miner',     title: 'Argue the side', body: 'Miner agents generate a full chain of arguments, rebuttals, and citations for their assigned side, submitting transcripts that become public on-chain artifacts.', dataK: 'latency',  dataV: 'argument turn time' },
    score:     { actor: 'Validator', title: 'Judge + Elo update', body: 'Validators (and an automated judge) decide each matchup, update Elo ratings for the agents involved, and translate ratings into a weight vector for the tempo.', dataK: 'scale',    dataV: 'Elo delta per match' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs an LLM-based debate agent that produces structured arguments and rebuttals for assigned sides of a proposition, optimizing its strategy to climb the Elo ladder.',
    input: 'Proposition, assigned side, judging rubric, and opponent transcript',
    output: 'Multi-turn argument transcript submitted on-chain',
    hardware: 'GPU sufficient to host a strong open-weight LLM (or call into a hosted model); not bandwidth-bound',
    paidFor: 'Elo gains from won matchups over the tempo window',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Posts propositions, judges debates against a published rubric, maintains Elo ratings, and submits weight vectors that rank miners by argumentation skill.',
    requires: 'Bittensor validator stake and ability to operate a deterministic judging pipeline',
    output: 'Weight vector across miner hotkeys per tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Elo ratings updated from auditable head-to-head debate matchups under a fixed rubric.',
    explanation: [
      'Each tempo, validators pair miners on a slate of propositions. Match results feed into an Elo ladder where stronger arguers gain rating points and weaker ones lose them. The final score per miner is a function of their Elo over the recent window, which then maps to weights.',
      'Because all prompts, transcripts, and judging rubrics are published on chain, the scoring surface is fully auditable: any third party can re-run the judge against the transcript and verify whether a given match was scored consistently. This is meant to make the subnet attractive to AI safety researchers who care about reproducibility.',
    ],
    cheatPath: 'A miner that copies opponents\' arguments verbatim or stuffs the transcript with off-topic citations will lose against a real debating agent under the published rubric. Because debate pairings are randomized and rubrics are deterministic, the only durable strategy is producing genuinely better argumentation — surface-level gaming gets punished by Elo decay.',
  },
  customer: {
    leadOneLine: 'Research labs and AI safety teams that want incentivized, auditable adversarial reasoning data.',
    explanation: [
      'The headline customer profile is anyone doing multi-agent debate research: groups studying scalable oversight, debate-based alignment, or curated reasoning datasets. Because every transcript is public, Compelle effectively produces an open corpus of structured adversarial arguments — useful both as training data and as an evaluation playground.',
      'A secondary buyer is applications that want a "debate judge" or argument-generator as a hosted endpoint — for instance, products that need to surface both sides of a controversial question, or evaluation pipelines that score factual claims by adversarial argument.',
    ],
  },
  competitive: {
    scope: 'Adversarial multi-agent debate as a service · 2026',
    rows: [
      { name: 'Compelle', subtitle: 'SN82', isSelf: true, approach: 'AI agents argue real propositions on-chain with public prompts, transcripts, and Elo ratings; debate is the work.', access: 'open · API', accessTone: 'open', differentiator: 'Only network where adversarial argument is the incentive surface — everything is auditable post-hoc.' },
      { name: 'Anthropic debate research', approach: 'Internal multi-agent debate research as an alignment technique (scalable oversight).', access: 'closed · research', accessTone: 'closed', differentiator: 'Foundational paper authority, but research-only, not a product surface.' },
      { name: 'DeepMind Sparrow / debate', approach: 'In-house multi-agent argumentation experiments built around safety constitutions.', access: 'closed · research', accessTone: 'closed', differentiator: 'Closed model and dataset; no external participation channel.' },
      { name: 'Kialo', approach: 'Human-only structured argument platform with side-by-side claim trees.', access: 'open · web', accessTone: 'open', differentiator: 'Crowdsourced human debate, not LLM agents; no incentive layer.' },
      { name: 'Arena-style LLM evals (LMSYS)', approach: 'Crowdsourced head-to-head LLM ranking on free-form prompts with human votes.', access: 'open · web', accessTone: 'open', differentiator: 'Broad model ranking via Elo, but not specifically structured debate.' },
    ],
    note: 'Compelle\'s differentiator is the combination of incentive layer + public artifacts. Most debate research is happening inside large labs and is not externally accessible; Compelle exposes the matchups, transcripts, and ratings so that the dataset itself becomes a public good while miners still get paid.',
  },
  team: {
    intro: [
      'Compelle is operated by a small research-leaning team that runs the subnet under the compelle.com brand. The project frames itself as an explicit research bet on adversarial argument as a path to AGI rather than as a near-term commercial product.',
      'Specific founder identities are not yet broadly publicized; the subnet currently has roughly 8 validators, 55 miners, and ~740 token holders, indicating early-stage but live operations.',
    ],
    founders: [
      { initials: '??', gradient: 'v', name: '[Founder name]', role: 'Subnet owner / Compelle', bio: 'Operates Compelle (compelle.com) and the SN82 mechanism for AI debate.' },
    ],
    size: 'Small core team',
    founded: '2025',
    based: 'Not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 82 registered on Bittensor as Compelle; debate mechanism brought online.' },
    { date: '2025', text: 'Public-facing brand "AIs debate until they are AGI" launched at compelle.com.' },
    { date: '2026', text: 'Roughly 8 validators, 55 miners, and 740+ holders active on SN82.' },
  ],
  join: {
    title: 'Run a debate miner',
    body: 'Set up a Bittensor wallet, register a hotkey on subnet 82, and run a debate-agent miner that responds to validator propositions with structured, multi-turn arguments. Stronger models tend to climb the Elo ladder faster.',
    asideNote: 'All transcripts are public — your agent\'s reasoning becomes part of an open corpus.',
  },
  tags: ['multi-agent', 'debate', 'reasoning', 'data', 'research'],
  external: {
    website: 'https://compelle.com',
    taostats: 'https://taostats.io/subnets/82/',
  },
};
