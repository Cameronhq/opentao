import type { RichPlaybook } from '../playbook-rich';

// SN117 — dormant. No public name, repo, site, or operator as of June 2026.

export const sn117: RichPlaybook = {
  slug: '117-117',
  netuid: 117,
  name: 'Subnet 117',
  category: 'compute',
  categoryLabel: 'Unspecified',
  blurb: 'Dormant subnet — no public name, repo, or operator identity as of June 2026.',
  whatMinersDo: 'No published specification. The slot exists on the metagraph; the operator has not surfaced a miner client, scoring rule, or commercial pitch.',
  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',
  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,
  hardware: [{ role: 'TBD', count: '—', cpuCores: 0, ramGb: 0, diskGb: 0 }],
  rentalOk: true,
  repo: { url: 'https://taostats.io/subnets/117/', branch: 'main', minerEntrypoint: 'TBD' },
  setupShape: 'simple-binary',
  setupOverview: 'No setup guide exists. Watch the taostats page for updates; check back once the operator publishes a website, GitHub repo, or X account.',
  install: [{ step: 'No public install steps', note: 'Subnet 117 has no published miner client.' }],
  runSteps: [{ step: 'No public run command', note: 'Nothing to run.' }],
  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],
  scoring: { summary: 'No scoring rules published.', rule: 'TBD', cheatPath: 'Not applicable — no live workload.' },
  profitability: { estimatedDailyEmissionPerUid: 0.0, tokenPriceUsdFallback: 284 },
  milestones: [{ day: 'day 1', target: 'Watch for operator surfacing', note: 'No miner client or spec exists as of June 2026.' }],
  monitoring: [{ metric: 'Operator activity', threshold: 'any public surface', where: 'taostats.io/subnets/117' }],
  knownIssues: [{ symptom: 'Nothing to mine', cause: 'No published spec or code.', fix: 'Wait for the operator to publish a miner client.' }],
  notes: ['Dormant slot. Last checked 2026-06-01.'],
};
