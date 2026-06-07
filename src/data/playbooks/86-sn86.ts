import type { RichPlaybook } from '../playbook-rich';

// SN86 — registered and emitting under the hammer-and-pickaxe ("⚒") glyph
// rather than a full brand name. As of this writing the operator has not
// published a public website, GitHub repo, or miner setup guide that this
// researcher could verify. This playbook is a placeholder pending
// operator disclosure — do not infer install / run steps from third-party
// rumor.

export const sn86: RichPlaybook = {
  slug: '86-sn86',
  netuid: 86,
  name: 'Subnet 86',
  category: 'data',
  categoryLabel: 'Under-documented',

  blurb:
    'Active but under-documented subnet on Bittensor — registered under the "⚒" identity with no widely-published miner workflow at time of writing. Treat this entry as a placeholder pending operator disclosure.',

  whatMinersDo:
    'The specific miner workload on SN86 is not publicly documented by the operator. Secondary sources describe the team as "methodical" with a small core team (~4 people, including a senior data scientist), but no website, GitHub repo, or published spec has surfaced. Until the operator publishes documentation, prospective miners should expect to work directly with the operator to learn the mechanism.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    { role: 'unknown — pending operator disclosure', cpuCores: 0, ramGb: 0, diskGb: 0, notes: 'Hardware requirements are not publicly documented.' },
  ],

  rentalOk: true,
  rentalNote: 'Cannot be characterized without a public spec.',

  repo: {
    url: 'https://taostats.io/subnets/86/',
    branch: 'n/a',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'There is no publicly-published setup guide for SN86 at time of writing. Watch the taostats subnet 86 page and any operator social channels for an announcement before provisioning hardware or burning to register.',

  install: [
    { step: 'Wait for operator disclosure', note: 'No verifiable miner repo or install steps have been published for SN86. Do not install from unverified third-party sources.' },
  ],

  runSteps: [
    { step: 'No published run command', note: 'The standard Bittensor pattern would be `python neurons/miner.py --netuid 86 --wallet.name $WALLET --wallet.hotkey $HOTKEY` — but the actual entrypoint is not confirmed.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY', description: 'Hotkey name on that coldkey',              required: true },
  ],

  scoring: {
    summary:
      'Reward function and scoring mechanism are not publicly described. Until the operator publishes a spec, third-party observers can only confirm the subnet is registered and emitting on chain.',
    rule: 'Not publicly documented.',
    cheatPath: 'Cannot be characterized without public scoring documentation.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Cannot estimate profitability without a public spec. The fact that the subnet is emitting means there is something to mine — but the unit economics are unknown.',
  },

  milestones: [
    { day: 'n/a', target: 'Watch for operator announcement', note: 'Monitor taostats and Bittensor community channels for any official launch of SN86 documentation.' },
  ],

  monitoring: [
    { metric: 'Operator status', threshold: 'any public release', where: 'https://taostats.io/subnets/86/' },
  ],

  knownIssues: [
    { symptom: 'Third-party guides claim to describe SN86', cause: 'No verified operator-published spec exists; community guesses can be wrong.', fix: 'Wait for an operator-signed announcement before installing anything.' },
  ],

  notes: [
    'Operator uses the "⚒" glyph rather than a full brand name on taostats — this is intentional, not a placeholder.',
    'Reported team size is roughly 4 people including a senior data scientist; no public bios available at time of writing.',
  ],
  placeholder: true,
};
