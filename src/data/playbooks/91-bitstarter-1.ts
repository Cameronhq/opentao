import type { RichPlaybook } from '../playbook-rich';

// SN91 — Bitstarter. Crowdfunding / accelerator for Bittensor subnet startups.
// This subnet is not a traditional compute-mining subnet — miners forecast startup
// pitch outcomes. No standalone miner repo has been publicly published as of 2026-06.
// Treat as low-disclosure: minimal playbook until the team ships public mining materials.

export const sn91: RichPlaybook = {
  slug: '91-bitstarter-1',
  netuid: 91,
  name: 'Bitstarter #1',
  category: 'reason',
  categoryLabel: 'Reasoning',
  blurb:
    'Bittensor-native crowdfunding + accelerator for subnet startups. Miners forecast which startup pitches will close rounds and launch live subnets. No public miner repo or open mining spec as of 2026-06 — treat as dormant for operator onboarding.',
  whatMinersDo:
    "Miners are pitch-forecasters: they receive pitch decks, founder track records, and traction signals from validators, and return structured viability scores predicting whether a startup will hit funding and launch milestones. Validators settle scores after outcomes resolve, so the game is calibration over many cohorts. No public miner code, no open scoring spec.",
  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',
  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,
  hardware: [{ role: 'CPU node', count: '1', cpuCores: 2, ramGb: 4, diskGb: 20, bandwidth: 'standard' }],
  rentalOk: true,
  repo: { url: 'https://www.bitstarter.ai/', branch: 'main' },
  setupShape: 'simple-binary',
  setupOverview:
    'No publicly published miner repo or canonical setup as of 2026-06. Watch bitstarter.ai and @bitstarter_ai for an operator onboarding spec.',
  install: [{ step: 'Awaiting public miner repo', note: 'No canonical setup is publicly documented. Do not deploy capital until the team ships a miner spec.' }],
  runSteps: [{ step: 'Awaiting public miner spec', note: 'No public run command exists.' }],
  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
  ],
  scoring: {
    summary: 'Forecast accuracy against realized fundraise + subnet-launch outcomes. Validators settle after outcomes resolve.',
    rule: 'Calibrate well over many cohorts — accuracy compounds.',
    cheatPath: 'Inflated scoring of every pitch fails — validators score against realized outcomes.',
  },
  profitability: { estimatedDailyEmissionPerUid: 0.0, tokenPriceUsdFallback: 284, notes: 'Mining economics not publicly disclosed.' },
  milestones: [{ day: 'day 1', target: 'Wait for public miner spec', note: 'Subnet has not published canonical mining materials.' }],
  monitoring: [{ metric: 'Project announcements', threshold: 'watch', where: '@bitstarter_ai on X · bitstarter.ai' }],
  knownIssues: [{ symptom: 'No public miner code', cause: 'Team has not released a canonical miner repo as of 2026-06.', fix: 'Wait for an official onboarding release before committing capital.' }],
  notes: [
    'Bitstarter functions as an accelerator + crowdfunding platform — the "mining" surface may evolve differently from typical inference subnets.',
    'Jacob Steeves sits on the advisory panel; Chris Zacharia is the founder.',
  ],
};
