import type { RichSubnet } from '../subnet-rich';

export const sn112: RichSubnet = {
  slug: '112-minotaur',
  netuid: 112,
  name: 'minotaur',
  shortPitch: 'Distributed DEX aggregator and swap-intent solver on Bittensor.',
  overview: [
    'minotaur (SN112) is a distributed DEX aggregator and swap-intent solver engine. Miners are "solvers" who compete in real time to compute the best settlement path for user swap intents — minimizing slippage, gas, and time — while the subnet aggregates their bids into one execution decision. The goal: better, cheaper, faster trades than centralized aggregators.',
    'The architecture is a batch auction. An Aggregator coordinates live execution and records every solver submission with a cryptographic signature. Validators later replay that event window and produce deterministic weights — every validator processing the same events generates the same weight vector, which is unusual for AI subnets and exactly right for a financial system.',
    'Tempo-aware emission means weights are submitted once per epoch after the chain-finalization buffer elapses, so MEV games against the consensus itself are bounded. Cryptographic accountability — every submission signed by the solver hotkey — means invalid or unknown hotkeys are discarded before they ever touch settlement.',
    'MEV protection deploys in Phase B (months 3–6) with a Base rollout, putting minotaur in the same lane as 1inch, CoW Protocol, and Bittensor\'s Swap Subnet. The differentiator is deterministic, replayable scoring on top of a real solver market. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: {
      actor: 'Validator',
      title: 'Stream swap intents',
      body: 'The Aggregator broadcasts incoming user swap intents to all registered solvers in real time during the live execution window.',
      dataK: 'payload',
      dataV: 'token in/out + amount + deadline',
    },
    compute: {
      actor: 'Miner',
      title: 'Solve + bid',
      body: 'Each solver computes a candidate settlement maximizing user surplus across pools, signs the submission with its hotkey, and bids.',
      dataK: 'latency',
      dataV: 'real-time auction window',
    },
    score: {
      actor: 'Validator',
      title: 'Deterministic replay',
      body: 'Validators replay the same event window and grade solvers on realized user surplus, gas, and execution speed — producing identical weights.',
      dataK: 'scale',
      dataV: 'deterministic, replayable',
    },
    settle: {
      actor: 'Subtensor',
      title: 'Yuma → emission',
      body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.",
      dataK: 'tempo',
      dataV: '~72 min · 24×/day',
    },
  },
  miner: {
    does: 'Acts as a solver: ingests user swap intents, computes optimal multi-pool settlement routes, and bids signed quotes.',
    input: 'Real-time stream of swap intents (token in, token out, amount, deadline, tolerances) from the Aggregator.',
    output: 'Signed candidate settlement transactions optimized for surplus, gas, and speed.',
    hardware: 'Low-latency server, full archive node or fast RPC, solver code with pool-state tracking and pathfinding.',
    paidFor: 'Realized user surplus, gas efficiency, and execution speed — replayed deterministically by validators',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Replays the recorded execution event window, verifies signatures, computes deterministic per-solver scores, submits weights.',
    requires: 'Access to the recorded aggregator events, chain RPC, and the deterministic scoring code; runs after chain finalization.',
    output: 'Weight vector identical across validators when given the same event window — collapses dispute surface.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Deterministic replay of every signed solver bid — if your bid won the user, your weight is exactly what it should be.',
    explanation: [
      'Most AI subnets score with stochastic judges. minotaur cannot afford that — financial flows need replayable, dispute-free scoring. The Aggregator records every signed solver submission inside each execution window. Once the chain finalizes past the buffer, each validator pulls the same recorded events, re-runs the scoring function locally, and arrives at an identical weight vector.',
      'Scoring rewards realized user surplus first (price improvement vs reference), then gas efficiency, then execution speed. Submissions from unknown or invalid hotkeys are discarded before scoring — solvers must register their hotkey with the subnet to be eligible. This combination — signed bids, deterministic replay, hotkey gating — is what makes minotaur safe to drop real money through.',
    ],
    cheatPath: 'Submitting fake or unsigned bids, or running solver code from an unregistered hotkey — both filtered before any reward.',
  },
  customer: {
    leadOneLine: 'DEX aggregator users, agent wallets, and rollup-native apps that need best-execution swaps with MEV protection.',
    explanation: [
      'Primary buyers are end-users of swap UIs, agent wallets executing autonomous trades, and rollup-native apps wiring swaps into their flows — all of whom care about price improvement, MEV protection, and execution certainty. minotaur fits as the solver layer behind any wallet or aggregator that wants to drop in a competitive multi-solver market without operating one.',
      'Phase B brings MEV protection and a Base rollout, opening the door to L2-native integrations. Against 1inch and CoW, minotaur\'s pitch is a tokenized solver market with deterministic, open auditability — solvers compete openly for TAO emission, and every bid lives on chain or in signed records.',
    ],
  },
  competitive: {
    scope: '2026 · swap-intent solvers',
    rows: [
      { name: 'minotaur', subtitle: 'SN112', isSelf: true, approach: 'Subnet-native solver market with signed bids and deterministic replay scoring', access: 'open · API', accessTone: 'open', differentiator: 'Tokenized solver competition; deterministic, replayable scoring' },
      { name: 'Swap Subnet', subtitle: 'Bittensor', approach: 'Bittensor-native liquidity subnet focused on bringing swap liquidity to TAO', access: 'open · API', accessTone: 'open', differentiator: 'Liquidity-first vs solver-first' },
      { name: '1inch Fusion', approach: 'Resolver network with off-chain auctions and on-chain settlement', access: 'open · API', accessTone: 'open', differentiator: 'Mature liquidity but closed resolver set' },
      { name: 'CoW Protocol', approach: 'Batch auctions with solver competition and coincidence-of-wants matching', access: 'open · API', accessTone: 'open', differentiator: 'Most similar design; permissioned solver set' },
      { name: 'UniswapX', approach: 'Off-chain orders filled by permissionless fillers competing on price', access: 'open · API', accessTone: 'open', differentiator: 'No tokenized incentive layer for fillers' },
    ],
    note: 'minotaur\'s wedge inside the solver lane is the incentive design — Bittensor emission funds an open solver market without seed liquidity or grants, and the deterministic replay scoring removes most of the auditability concerns that plague closed solver sets.',
  },
  team: {
    intro: [
      'minotaur ships under the subnet112 GitHub organization. The team identities are not published on the public site or repo as of May 2026; the project communicates via the @minotaursubnet X account.',
      'The team operates the Aggregator, the reference solver code, the validator scoring binary, and the Base rollout planning for MEV protection.',
    ],
    founders: [
      { initials: 'MN', gradient: 'a', name: '[Founder 1 name]', role: 'Operator', bio: 'Operator team behind minotaur subnet 112; identities not publicly disclosed as of May 2026.' },
    ],
    size: 'Not publicly disclosed.',
    founded: '2025',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025·09', text: 'Subnet 112 launch and initial solver onboarding.' },
    { date: '2025·Q4', text: 'Phase A — live solver auctions and deterministic scoring online.' },
    { date: '2026·Q2', text: 'Phase B — MEV protection rollout planned with Base deployment.' },
  ],
  join: {
    title: 'Solve swap intents or route flow through SN112',
    body: 'If you have a solver — pathfinding, pool-state tracking, gas-aware execution — register a hotkey and start bidding into the live windows. If you operate a wallet or aggregator, integrate minotaur as a solver source.',
    asideNote: 'All bids must be signed by a registered hotkey or they are discarded before scoring.',
  },
  tags: ['defi', 'solver', 'dex-aggregator', 'mev'],
  external: {
    github: 'https://github.com/subnet112/minotaur_subnet',
    twitter: 'https://x.com/minotaursubnet',
    taostats: 'https://taostats.io/subnets/112/',
  },
  tweets: [],
};
