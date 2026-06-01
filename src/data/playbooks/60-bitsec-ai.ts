import type { RichPlaybook } from '../playbook-rich';

// SN60 — Bitsec. Decentralized AI code auditors.
// Miner is launched via `./start-miner.sh`; min_compute.yml in the repo pins
// CPU/RAM/disk/GPU/bandwidth requirements. Validator scores against ground-truth
// vulnerability sets and live bug bounties. README: github.com/Bitsec-AI/subnet.

export const sn60: RichPlaybook = {
  slug: '60-bitsec-ai',
  netuid: 60,
  name: 'Bitsec.ai',
  category: 'reason',
  categoryLabel: 'Reasoning · Security',

  blurb:
    'Decentralized AI code auditors. Miners build agent / ML / static-analysis pipelines that scan code and smart contracts for vulnerabilities; validators grade against ground-truth bug sets and live bounty programs.',
  whatMinersDo:
    "A Bitsec miner is launched via `./start-miner.sh`. It receives code artifacts from the validator — smart contracts, subnet repos, Python services — and returns a structured list of vulnerabilities with severity, line number and suggested fix. Scoring is precision-weighted recall against a ground-truth bug set; live bounty results feed back into the score.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Auditor node',
      count: '1',
      gpu: '1× GPU, compute capability ≥ 6.0',
      vramGb: 8,
      cpuCores: 4,
      ramGb: 16,
      diskGb: 10,
      bandwidth: '100 Mbps down / 20 Mbps up',
      notes: 'From min_compute.yml: x86_64, 2.5 GHz CPU, SSD with ≥ 1000 IOPS, 1024 CUDA cores. Disk floor is small — but agent caches and code corpora expand it fast.',
    },
  ],
  hardwareNote:
    'min_compute.yml is conservative — competitive miners run multi-agent LLM workflows that prefer 24GB+ VRAM and 64GB+ RAM. Treat the spec sheet as the floor, not the target.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.59, runpod: 0.49, coreweave: 0.79 },

  repo: {
    url: 'https://github.com/Bitsec-AI/subnet',
    branch: 'main',
    minerEntrypoint: 'start-miner.sh',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is a shell-script wrapper around a Python miner. Create a Bittensor wallet, register on netuid 60, then run `./start-miner.sh` (or `--testnet`). If you hit Python issues, the README recommends an isolated `pyenv` virtualenv on Python 3.11.9.',

  install: [
    { step: 'Clone the miner repo',
      cmd:  'git clone https://github.com/Bitsec-AI/subnet && cd subnet' },
    { step: 'Create coldkey + hotkey (skip if you have one)',
      cmd:  'btcli wallet new_coldkey --wallet.name miner --no-use-password --quiet && btcli wallet new_hotkey --wallet.name miner --wallet.hotkey default --quiet' },
    { step: 'Register hotkey on SN60',
      cmd:  'btcli subnet register --wallet.name miner --netuid 60 --wallet.hotkey default',
      note: 'Re-check burn-cost immediately before this.' },
    { step: 'Optional: isolated Python env if dep install fails',
      cmd:  'brew install pyenv-virtualenv && pyenv virtualenv 3.11.9 bt-venv && pyenv activate bt-venv && pip install -r requirements.txt',
      note: 'Use this if you hit dependency conflicts in your global Python.' },
  ],

  runSteps: [
    { step: 'Start miner (mainnet)',
      cmd:  './start-miner.sh' },
    { step: 'Or run against testnet first',
      cmd:  './start-miner.sh --testnet' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 60' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (default in README is `miner`)', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name on that coldkey (default `default`)', required: true },
  ],

  scoring: {
    summary:
      'Validator distributes code artifacts with known + unknown vulnerabilities seeded inside. Miner returns a structured findings list. Score is precision-weighted recall against the ground-truth bug set, weighted by severity. Live bug-bounty confirmations feed in as additional signal.',
    rule: 'Find real bugs. Hallucinated findings are penalized; novelty + severity stack the score.',
    cheatPath:
      "Spraying generic vulnerability templates at every repo — precision penalty crashes the score. Don't run only against the seeded test set; live bounty data shifts the bar.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'No per-UID emission disclosed in README; use taostats live data to estimate. Distribution is heavy-tailed — miners with strong LLM-agent stacks outperform pure-static-analysis miners.',
  },

  milestones: [
    { day: 'day 1', target: 'Miner registered, axon reachable, no startup errors', note: '`./start-miner.sh` logs steady; btcli metagraph shows your UID.' },
    { day: 'day 3', target: 'First validator-issued repo audited',                 note: 'Logs show inbound code-drop requests being processed.' },
    { day: 'day 14', target: 'Out of immunity, incentive > floor',                 note: 'If still near zero, swap from generic vuln templates to a real agent stack.' },
  ],

  monitoring: [
    { metric: 'Vuln-find precision', threshold: '> 0.5 (no spray-and-pray)', where: 'miner logs · validator returns per-finding grades' },
    { metric: 'Axon reachability',   threshold: '100% from outside',          where: 'curl http://<miner-ip>:<port>/health' },
    { metric: 'Disk free',           threshold: '> 10 GB',                    where: 'df -h · code corpora + agent caches grow' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat',             where: 'btcli subnet metagraph --netuid 60' },
  ],

  knownIssues: [
    {
      symptom: 'pip install fails on global Python',
      cause:   'Dependency conflict with system Python.',
      fix:     'Use the pyenv-virtualenv path: `pyenv virtualenv 3.11.9 bt-venv && pyenv activate bt-venv && pip install -r requirements.txt`.',
    },
    {
      symptom: 'High false-positive rate → score stays near zero',
      cause:   'Generic vulnerability templates spraying findings at every line.',
      fix:     'Switch to an agent-based approach with confirmatory checks; precision matters more than recall once you exceed a low bar.',
    },
    {
      symptom: 'Miner registers but no work received',
      cause:   'Validator firewall blocking your axon port.',
      fix:     'Open your axon port to the public internet and confirm via `curl http://<miner-ip>:<port>/`.',
    },
  ],

  notes: [
    'Bitsec V2 (late 2025) moved to an agent-based architecture — agent frameworks tend to outperform pure static-analyzers.',
    'Public-facing product surface is split across Bitsec Scanner (point-at-a-repo) and Bitsec Hunter (live bug bounties).',
  ],
};
