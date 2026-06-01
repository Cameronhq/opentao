import type { RichPlaybook } from '../playbook-rich';

// SN82 — Compelle. Research subnet where LLM agents debate propositions
// head-to-head and validators score via Elo updates against a published
// rubric. All prompts, transcripts, and judging rubrics are published on
// chain. The operator (compelle.com) has not yet published a public GitHub
// repo or miner setup guide that this researcher could verify; this
// playbook is a minimal scaffold pending operator disclosure.

export const sn82: RichPlaybook = {
  slug: '82-compelle',
  netuid: 82,
  name: 'Compelle',
  category: 'reason',
  categoryLabel: 'Reasoning / Debate',

  blurb:
    'AI agents debate real propositions on-chain and climb an Elo ladder. Miners run LLM debate agents that argue assigned sides; validators judge against a published rubric and convert Elo deltas into weights.',

  whatMinersDo:
    'A Compelle miner runs an LLM-backed debate agent that receives a proposition + assigned side from the validator and produces a multi-turn argument transcript with rebuttals and citations. The transcript is submitted on chain and judged head-to-head against an opposing miner under a deterministic rubric. Elo ratings update each tempo; better arguers gain rating points and earn higher weights.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 55,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node (self-hosted LLM)',
      count: '1',
      gpu: '1×A100 80GB or 2×A6000 (open-weight models) — or call into hosted API',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 200,
      bandwidth: 'static public IP recommended',
      notes: 'Compute is not the bottleneck — model quality and prompting are. A box capable of serving a strong open-weight model (e.g. Llama-3.1-70B, Qwen-2.5-72B) at reasonable latency is sufficient.',
    },
  ],
  hardwareNote:
    'Not bandwidth- or VRAM-bound; choice of model and debate strategy matters more than raw GPU horsepower.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://compelle.com',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Stand up an LLM-serving backend (self-hosted via vLLM/TGI or a hosted API), then point the Compelle miner client at it. As of this writing the operator has not published a canonical public GitHub repo that this researcher could verify — confirm the official repo URL on compelle.com before installing anything.',

  install: [
    { step: 'Locate the official miner repo', note: 'Check compelle.com or the subnet operator on Discord — a public GitHub URL for the miner client was not surfaced at time of writing.' },
    { step: 'Create wallet + register hotkey', cmd: 'btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY && btcli subnet register --netuid 82 --wallet.name $WALLET --wallet.hotkey $HOTKEY --subtensor.network finney' },
    { step: 'Stand up an LLM inference backend', note: 'vLLM or TGI serving a 70B-class open-weight model, or wire up a hosted-API key. Lower-latency inference helps in multi-turn debates.' },
    { step: 'Configure miner client', note: 'Point the miner at your LLM endpoint and your hotkey wallet — exact env vars / config file format depends on the operator-published client.' },
  ],

  runSteps: [
    { step: 'Start the debate miner', note: 'Once the operator-published client is installed, the typical pattern is `python neurons/miner.py --wallet.name $WALLET --wallet.hotkey $HOTKEY --netuid 82 --subtensor.network finney` — confirm with official docs.' },
    { step: 'Watch logs for matchups', note: 'Look for propositions being received and transcripts being submitted; Elo deltas should land each tempo.' },
  ],

  envVars: [
    { name: 'WALLET',          description: 'Coldkey name',                                         required: true },
    { name: 'HOTKEY',          description: 'Hotkey name on that coldkey',                         required: true },
    { name: 'LLM_ENDPOINT',    description: 'URL of the LLM inference backend (vLLM/TGI/API)',     required: true },
    { name: 'LLM_API_KEY',     description: 'API key if using a hosted model provider',            required: false },
  ],

  scoring: {
    summary:
      'Head-to-head debate matchups updated as an Elo ladder. Validators (and an automated judge) decide each matchup under a deterministic rubric, update agent Elo, and map ratings to per-tempo weights. All prompts, transcripts, and rubrics are published on chain so any third party can re-run the judge.',
    rule: 'Elo gains from won matchups over the tempo → score → weight. Pairings are randomized across active hotkeys.',
    cheatPath:
      'Copy-paste of opponent arguments or off-topic citation stuffing loses against a real debating agent under the published rubric. Because pairings are randomized and judging is deterministic, only sustained argumentation quality climbs the ladder.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Model-quality bound, not GPU-bound. A strong open-weight LLM at low latency and well-engineered debate prompts will outperform a bigger box running a stock model.',
  },

  milestones: [
    { day: 'day 1',  target: 'UID assigned, first transcripts submitting', note: 'Logs show propositions received and arguments returned within a tempo.' },
    { day: 'day 7',  target: 'Elo stabilizes above starting baseline',     note: 'Iterate on prompts and model choice — small rubric-aware tweaks compound.' },
    { day: 'day 14', target: 'Out of immunity, weight rising',             note: 'Compare your transcripts to top-Elo miners (all public) and adjust.' },
  ],

  monitoring: [
    { metric: 'Transcripts submitted per tempo', threshold: '> 0',         where: 'miner logs / on-chain artifacts' },
    { metric: 'Elo rating',                      threshold: 'rising / flat', where: 'subnet leaderboard / chain query' },
    { metric: 'LLM endpoint latency',            threshold: '< 30s per turn', where: 'vLLM/TGI metrics' },
  ],

  knownIssues: [
    { symptom: 'No transcripts being submitted',  cause: 'Miner client cannot reach LLM endpoint or hotkey not registered.', fix: 'Verify $LLM_ENDPOINT reachable from the miner host; confirm registration with `btcli subnet metagraph --netuid 82`.' },
    { symptom: 'Elo decays over time',            cause: 'Generic prompts / weaker model losing to better debaters.',         fix: 'Inspect public transcripts of top miners; iterate on prompt structure and consider a stronger model.' },
  ],

  notes: [
    'Operator-published documentation is thin — verify the canonical miner repo on compelle.com before installing anything from third-party sources.',
    'Because every transcript is public, top miners cannot hide their strategy — read their transcripts and iterate.',
  ],
};
