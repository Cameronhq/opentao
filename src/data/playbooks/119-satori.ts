import type { RichPlaybook } from '../playbook-rich';

// SN119 — Satori. AI companion + Japan-rooted Digital Residency program.
// No public miner repo discoverable as of June 2026 — registry listing only.

export const sn119: RichPlaybook = {
  slug: '119-satori',
  netuid: 119,
  name: 'Satori',
  category: 'llm',
  categoryLabel: 'LLM / Companion',

  blurb:
    "AI-companion + Digital-Residency subnet anchored in Japan. Miners run the long-context persona + memory stack; no public setup repo as of June 2026.",

  whatMinersDo:
    "Operate the AI-companion stack — model + persona templating + persistent memory — that sustains long-term relationships across many turns and sessions. Validators run multi-turn probes to expose persona drift, memory failures, and emotional misfires; scoring rewards coherent identity and faithful long-term memory above raw cleverness. The Digital Residency hook ties the companion to a real-world Japan-rooted program (events, venues, communities).",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Companion inference node',
      count: '1',
      gpu: 'inference GPU (e.g. A6000 / L40S / RTX 4090) — exact spec not published',
      vramGb: 48,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'standard broadband',
      notes: 'Need GPU for inference + persistent SSD for memory store (vector DB or equivalent). Exact spec not published; size from your model choice and expected concurrent residents.',
    },
  ],

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.49, runpod: 1.29, coreweave: 1.69 },

  repo: {
    url: 'https://taostats.io/subnets/119/',
    branch: 'main',
    minerEntrypoint: 'TBD — no public miner repo discoverable as of June 2026',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "No public miner repo or setup guide is centrally surfaced as of June 2026 — Satori is listed on the Bittensor registry with the AI-companion + Digital-Residency framing. Anyone planning to mine SN119 has to track the registry / operator channels for the reference companion stack.",

  install: [
    { step: 'Track registry + operator channels for release',
      note: 'taostats.io/subnets/119 and any operator-published website / X account.' },
    { step: 'Plan the companion stack',
      note: 'Pick a base LLM (local or hosted), wire a memory layer (vector DB + episodic store), build persona templating with system prompts pinned across sessions.' },
    { step: 'Register hotkey on SN119 (when miner client ships)',
      cmd:  'btcli subnet register --netuid 119 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Run companion server (TBD)',
      note: 'No published reference command. Implementation likely serves an axon endpoint that accepts a session ID + user turn and returns a persona-consistent response.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],

  scoring: {
    summary:
      "Validators drive multi-turn probes designed to surface persona drift, memory failures, and emotional misfires. Scoring rewards persona consistency, memory recall accuracy, emotional appropriateness, and long-context coherence across the probe.",
    rule: 'Sustain a consistent identity across long contexts with faithful recall of earlier interactions.',
    cheatPath:
      "Stateless single-turn responses fail long-context probes immediately. Scripted persona templates (canned responses) get caught when the probe drifts off-script. Persona drift past turn ~50 is a known failure mode the validator is designed to detect.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'GPU + memory store + persistent disk. If you run a local mid-sized LLM you need real VRAM; if you broker hosted inference the cost shifts to per-call API spend. Memory tier (vector DB hosting + episodic store) is a non-trivial line item.',
  },

  milestones: [
    { day: 'day 1',  target: 'Track repo / spec release',
      note: 'No public install path yet. Watch the registry and any operator channel that surfaces.' },
    { day: 'day 7',  target: 'Local companion holds persona over 100 turns',
      note: 'Bench your stack with a long script — if persona breaks or memory fails before turn 100, the probes will catch it.' },
    { day: 'day 30', target: 'Hotkey live (assuming spec ships)',
      note: 'Re-read this playbook once Satori publishes a miner repo + scoring spec.' },
  ],

  monitoring: [
    { metric: 'Repo / spec surfacing',     threshold: 'public link available', where: 'taostats.io/subnets/119' },
    { metric: 'Persona consistency score', threshold: '> threshold (TBD)',     where: 'local bench + validator probes when live' },
    { metric: 'Memory recall accuracy',    threshold: '> threshold (TBD)',     where: 'long-context bench + per-tempo incentive' },
  ],

  knownIssues: [
    {
      symptom: 'No miner code to install',
      cause:   'Operator has not published a public reference repo as of June 2026.',
      fix:     'Watch registry; engage operator if any public channel surfaces.',
    },
    {
      symptom: 'Persona drift past long context',
      cause:   'Base model context too short, or system prompt not re-anchored across sessions.',
      fix:     'Re-anchor persona system prompt on every session resume; use a memory tier to surface relevant earlier turns; pick a model with sufficient context window for your residency length.',
    },
  ],

  notes: [
    "Japan-rooted Digital Residency framing means validation likely also probes 'residency context' — recommending, planning, coordinating around physical events.",
    'No direct comparator on Bittensor; outside Bittensor the closest products are Replika, Character.AI, Cotomo, Loverse — none with a residency hook.',
    "Public footprint as of June 2026 is registry listing only — treat this playbook as preview, not runbook.",
  ],
};
