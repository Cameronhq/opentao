import type { RichPlaybook } from '../playbook-rich';

// SN109 — Academia. Subnet incubator inside one netuid. README of
// github.com/fx-integral/academia at this point only outlines vision +
// architecture and explicitly notes: "Miner / validator onboarding docs"
// are listed under "Over the next updates we'll publish" — i.e. not yet
// released. This playbook therefore reflects announced architecture, with
// install/run steps templated against the standard Bittensor pattern.

export const sn109: RichPlaybook = {
  slug: '109-academia',
  netuid: 109,
  name: 'Academia',
  category: 'reason',
  categoryLabel: 'Reason',

  blurb:
    "Subnet incubator. Candidate subnet ideas live inside one netuid through two mechanisms — M0 (Research & Design) for theses, mechanism designs, benchmark suites, and exploit analysis, and M1 (Prototype & Arena) for working implementations and head-to-head benchmark runs. Best candidates graduate to dedicated netuids.",

  whatMinersDo:
    "A Academia 'miner' is a candidate subnet team rather than a traditional GPU operator. You submit research artefacts (M0) or run a working prototype (M1) against the incubator's active task slate. Validators — with AI-agent evaluation assistance — score against the published rubric (M0: design rigor; M1: benchmark performance), and Yuma settles weights across candidate teams every tempo. Hardware is whatever your specific candidate mechanism needs.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Candidate-team node',
      count: '1+ (depends on the candidate mechanism)',
      gpu: 'Mechanism-dependent — M0 (design) is largely CPU/research; M1 (prototype) sizes to whatever workload your prototype subnet would actually run',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 200,
      bandwidth: 'public IP · 1 Gbps',
      notes: 'Hardware floor is determined by your candidate proposal, not Academia itself. A pure-M0 design submission may need only a CPU box; a M1 prototype subnet competing in the arena needs whatever GPUs that prototype would natively use.',
    },
  ],
  hardwareNote:
    "Academia is mechanism-agnostic — bring whatever stack your proposal needs. The official miner / validator onboarding docs are not yet published; expect concrete hardware floors when the M0/M1 task slate is publicly defined.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/fx-integral/academia',
    branch: 'main',
    extraRepos: [
      { name: 'Academia context', url: 'https://bittensor.com/academia', purpose: 'Public-facing description of the incubator (La Masia framing)' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Onboarding docs are explicitly listed as forthcoming in the Academia README. Until those land, treat this playbook as a scaffold using the standard Bittensor miner template — register on SN109, run a stub neuron, and substitute the real Academia onboarding flow when published.",

  install: [
    { step: 'Clone the Academia repo',
      cmd:  'git clone https://github.com/fx-integral/academia && cd academia' },
    { step: 'Wait for / install miner onboarding deps',
      cmd:  'python -m venv .venv && source .venv/bin/activate && pip install -e .',
      note: "README explicitly notes 'Miner / validator onboarding docs' under 'Over the next updates we'll publish' — re-check the repo before installing." },
    { step: 'Copy and edit .env',
      cmd:  'cp .env.example .env && $EDITOR .env',
      note: 'Set WALLET / HOTKEY / NETUID=109 and the mechanism (M0 or M1) your candidate is targeting.' },
    { step: 'Register your hotkey on SN109',
      cmd:  'btcli subnet register --netuid 109 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the candidate-team neuron',
      cmd:  'python -m neurons.miner --netuid 109 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Command shape will be confirmed when Academia publishes its onboarding docs.' },
    { step: 'Watch metagraph',
      cmd:  'btcli subnet metagraph --netuid 109' },
  ],

  envVars: [
    { name: 'WALLET',     description: 'Coldkey name',                                        required: true },
    { name: 'HOTKEY',     description: 'Hotkey name',                                         required: true },
    { name: 'NETUID',     description: 'Subnet UID — 109 for Academia',                       required: true },
    { name: 'MECHANISM',  description: 'Mechanism slot — 0 (Research & Design) or 1 (Prototype & Arena)', required: false },
  ],

  scoring: {
    summary:
      'AI-agent evaluation against published rubrics. M0 scores subnet theses, incentive designs, benchmark suites, and exploit analyses on design rigor. M1 scores working prototypes on benchmark and arena performance.',
    rule:
      'Earn by making real progress against the rubric — design quality for M0, benchmark wins for M1. The strongest candidates graduate to their own dedicated netuids.',
    cheatPath:
      "Prompt-engineering the AI evaluator to score well rather than be good is the obvious attack. Defence depends on the rubric being grounded in measurable outputs (working code, benchmark numbers) rather than narrative. Plagiarising existing subnet designs is bounded by exploit-analysis + originality checks in the M0 rubric.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      "This isn't a traditional 'rent GPU, run miner, collect TAO' subnet. Returns are milestone-shaped: progress on the rubric, plus the option value of graduating to your own dedicated netuid. Sizing capex against per-UID emission alone undersells the real upside.",
  },

  milestones: [
    { day: 'day 1', target: 'Hotkey registered on SN109', note: 'Mechanism slot (M0 or M1) declared in env / submission.' },
    { day: 'day 7', target: 'First scored submission', note: 'M0: thesis or design doc accepted. M1: prototype runs against the arena.' },
    { day: 'day 30', target: 'Stable ranking against rubric', note: 'Iterate the candidate proposal in response to AI-evaluator feedback.' },
    { day: 'day 90', target: 'Graduation conversation begins', note: 'If your design or prototype consistently ranks well, the path to a dedicated netuid opens.' },
  ],

  monitoring: [
    { metric: 'Rubric score (M0 or M1)',       threshold: 'rising or flat', where: 'Academia evaluator (when published)' },
    { metric: 'Submission acceptance rate',    threshold: '100%',           where: 'Miner logs' },
    { metric: 'Per-tempo incentive',           threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 109' },
  ],

  knownIssues: [
    {
      symptom: 'Onboarding docs not yet published',
      cause:   "Academia README explicitly notes 'Miner / validator onboarding docs' under upcoming updates — public miner flow is a placeholder until then.",
      fix:     'Re-check github.com/fx-integral/academia and bittensor.com/academia before any serious capex; treat current install steps as a template.',
    },
    {
      symptom: 'AI evaluator scores narrative quality over real progress',
      cause:   'Rubric grounding still being tuned; possible during the early incubator phase.',
      fix:     "Focus submissions on measurable artefacts (working code, benchmark numbers, exploit demos) rather than prose — these survive rubric iteration better.",
    },
  ],

  notes: [
    "Treat this playbook as a scaffold — Academia's onboarding docs will rewrite the install/run sections when they ship.",
    'The real return on Academia is not per-tempo emission — it is the option to graduate to your own dedicated netuid with a mainnet-tested mechanism behind you.',
  ],
};
