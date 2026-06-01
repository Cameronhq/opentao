import type { RichPlaybook } from '../playbook-rich';

// SN104 — parked / for sale. Emissions burned to uid1 by current owner. No
// live miner workload to profile. Minimal stub until a buyer takes over.

export const sn104: RichPlaybook = {
  slug: '104-for-sale-burn-to-uid1',
  netuid: 104,
  name: 'for sale (burn to uid1)',
  category: 'compute',
  categoryLabel: 'Compute',
  blurb: 'Slot for sale — emissions burned to uid1, no active miner workload.',
  whatMinersDo: 'Nothing — SN104 is publicly listed as for-sale with emissions burned to uid1 to preserve slot value while the owner looks for a buyer. There is no active challenge / compute / score loop. Do not register.',
  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',
  emission: '— τ/day (burning to uid1)',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,
  hardware: [{ role: 'n/a', count: '—', cpuCores: 0, ramGb: 0, diskGb: 0 }],
  rentalOk: true,
  repo: { url: 'https://taostats.io/subnets/104/', branch: 'main' },
  setupShape: 'simple-binary',
  setupOverview: 'No active workload. Skip mining; check taostats for sale status if interested in slot acquisition via OTC channels.',
  install: [{ step: 'Do not install — slot is parked', cmd: 'open https://taostats.io/subnets/104/' }],
  runSteps: [{ step: 'Not active', cmd: '—' }],
  envVars: [{ name: 'WALLET', description: 'Coldkey name', required: true }, { name: 'HOTKEY', description: 'Hotkey name', required: true }],
  scoring: { summary: 'No live scoring — emissions burning to uid1.', rule: 'n/a', cheatPath: 'n/a' },
  profitability: { estimatedDailyEmissionPerUid: 0, tokenPriceUsdFallback: 284, notes: 'Emissions burn to uid1 — registering any other UID earns zero.' },
  milestones: [{ day: 'day 1', target: 'Do not register', note: 'Wait for new owner / restart announcement.' }],
  monitoring: [{ metric: 'Owner / sale status', threshold: 'sold + restart', where: 'taostats.io/subnets/104/ + OTC channels' }],
  knownIssues: [{ symptom: 'Any registration earns zero emission', cause: 'All emission is being directed to uid1 by the current owner.', fix: 'Skip the subnet until ownership and workload are restored.' }],
  notes: ['Parked slot — re-evaluate only after public restart announcement.'],
};
