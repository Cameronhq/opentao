import type { RichPlaybook } from '../playbook-rich';

// SN95 — Actual Computer. Stealth launch (Oct 2025) from Actual Computer Inc.
// in Venice, CA. No public mining spec, repo, or scoring rule as of 2026-06.
// Treat as low-disclosure: minimal playbook until product reveal.

export const sn95: RichPlaybook = {
  slug: '95-95',
  netuid: 95,
  name: 'Actual Computer',
  category: 'compute',
  categoryLabel: 'Compute (stealth)',
  blurb:
    'Stealth-launched compute / inference subnet from Actual Computer Inc. (Venice, CA). No public miner repo, scoring spec, or hardware requirements as of 2026-06. Treat as not-yet-mineable until product reveal.',
  whatMinersDo:
    "Public materials describe a generic compute / inference loop — validators issue tasks, miners execute, validators score against an undisclosed quality metric. The specific workload type, scoring rule, hardware requirements, and target customer are not publicly documented. Notable AI figures follow the team's X account (including Jack Clark of Anthropic), driving community speculation, but operator onboarding is gated until reveal.",
  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',
  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,
  hardware: [{ role: 'Compute node', count: '1', cpuCores: 8, ramGb: 32, diskGb: 100, bandwidth: 'standard', notes: 'Specifics not publicly disclosed — placeholder.' }],
  rentalOk: true,
  repo: { url: 'https://x.com/actualputer', branch: 'main' },
  setupShape: 'simple-binary',
  setupOverview:
    'No publicly published miner repo or canonical setup as of 2026-06. Watch @actualputer and backprop.finance/dtao/subnets/95-actual-computer for the eventual reveal.',
  install: [{ step: 'Awaiting public miner repo', note: 'Actual Computer Inc. has not published mining materials. Do not deploy capital until the team ships a spec.' }],
  runSteps: [{ step: 'Awaiting public miner spec', note: 'No public run command exists.' }],
  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
  ],
  scoring: {
    summary: 'Compute / inference scoring with undisclosed quality metric. Spec not publicly available.',
    rule: 'Awaiting product reveal.',
    cheatPath: 'Standard compute-subnet attacks (cached outputs, identical replies) are obvious initial vectors but specific cheat paths cannot be enumerated without the scoring rule.',
  },
  profitability: { estimatedDailyEmissionPerUid: 0.0, tokenPriceUsdFallback: 284, notes: 'Token surged 110%+ post-launch on community speculation. Mining economics not publicly disclosed.' },
  milestones: [{ day: 'day 1', target: 'Wait for public reveal', note: 'No public mining materials.' }],
  monitoring: [{ metric: 'Team announcements', threshold: 'watch', where: '@actualputer · @Tom_A_Lynch on X' }],
  knownIssues: [{ symptom: 'No public miner code', cause: 'Stealth posture as of 2026-06.', fix: 'Wait for the official product reveal before committing capital.' }],
  notes: [
    'CEO Tom Lynch (@Tom_A_Lynch), advisor Steve Sperandeo (@stevesperandeo), engineering @somewheresy. Venice, CA-based.',
    'Followed on X by notable AI figures including Anthropic co-founder Jack Clark — driving speculative pricing.',
    'High-signal-but-low-transparency — do your own diligence before committing capital.',
  ],
};
