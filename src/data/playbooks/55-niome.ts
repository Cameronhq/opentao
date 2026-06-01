import type { RichPlaybook } from '../playbook-rich';

// SN55 — NIOME (Genomes.io / GenomesDAO, Yuma-accelerated)
// Generate privacy-safe synthetic genomes. Standard Bittensor neuron under
// pm2 / tmux. Python 3.12, GPU required for generative models, 16 vCPU,
// 16GB+ RAM, Ubuntu 22.04+.

export const sn55: RichPlaybook = {
  slug: '55-niome',
  netuid: 55,
  name: 'NIOME',
  category: 'data',
  categoryLabel: 'Synthetic Genomics',

  blurb:
    'Generate high-fidelity synthetic human genomes. Validators score on statistical fidelity against held-out reference panels + biological plausibility.',
  whatMinersDo:
    "Receive genomic simulation tasks (population spec, variant distribution requirements, pharmacogenomic constraints) from validators. Run a generative genomics model to produce synthetic genome batches that preserve real-world allele frequencies, linkage disequilibrium patterns, and gene-drug variability (e.g. CYP2D6). Return the synthetic genome to the issuing validator for fidelity scoring against held-out reference panels.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner node',
      count: '1',
      gpu: '1× GPU (generation-dependent — A6000 / A100 class typical for whole-genome batches)',
      vramGb: 24,
      cpuCores: 16,
      ramGb: 16,
      diskGb: 200,
      bandwidth: 'standard port-forwarding',
      notes: 'Ubuntu 22.04+ (no Windows). Python 3.12. Larger memory tasks demand more VRAM.',
    },
  ],
  hardwareNote:
    'README states "no specialized hardware required" but the official miner_guide.md requires a GPU because the generative pipeline runs locally.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.79, runpod: 0.69, coreweave: 0.89 },

  repo: {
    url: 'https://github.com/genomesio/subnet-niome',
    branch: 'main',
    extraRepos: [
      { name: 'miner_guide', url: 'https://github.com/genomesio/subnet-niome/blob/main/docs/miner_guide.md', purpose: 'Authoritative miner setup' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Standard Bittensor neuron pattern. Clone, venv, install requirements + bittensor-cli, create wallets, register on netuid 55, export PYTHONPATH, run `python neurons/miner.py` under pm2 or tmux. Validator-issued simulation tasks come in via the axon port; outputs go back to the validator that issued.',

  install: [
    { step: 'Clone repo', cmd: 'git clone https://github.com/genomesio/subnet-niome.git && cd subnet-niome' },
    { step: 'Create venv', cmd: 'python3 -m venv venv && source venv/bin/activate' },
    { step: 'Install deps', cmd: 'python3 -m pip install -r requirements.txt && python3 -m pip install bittensor-cli' },
    { step: 'Create coldkey', cmd: 'btcli wallet new_coldkey --wallet.name $WALLET' },
    { step: 'Create hotkey',  cmd: 'btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Register hotkey', cmd: 'btcli subnet register --netuid 55 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Set PYTHONPATH', cmd: 'export PYTHONPATH="$PYTHONPATH:$(pwd)"' },
  ],

  runSteps: [
    { step: 'Start miner (raw)',
      cmd: 'python neurons/miner.py --netuid 55 --subtensor.network finney --wallet.name $WALLET --wallet.hotkey $HOTKEY --axon.port $AXON_PORT' },
    { step: 'Wrap with pm2 (recommended)',
      cmd: 'pm2 start --name niome-miner python -- neurons/miner.py --netuid 55 --subtensor.network finney --wallet.name $WALLET --wallet.hotkey $HOTKEY --axon.port $AXON_PORT' },
    { step: 'Verify on metagraph', cmd: 'btcli subnet metagraph --netuid 55' },
  ],

  envVars: [
    { name: 'WALLET',     description: 'Coldkey name',                          required: true },
    { name: 'HOTKEY',     description: 'Hotkey name',                           required: true },
    { name: 'AXON_PORT',  description: 'TCP port the miner listens on (port-forward this)', required: true },
    { name: 'PYTHONPATH', description: 'Must include repo root (export $(pwd))', required: true },
  ],

  scoring: {
    summary:
      'Validators evaluate synthetic genome outputs against held-out reference panels using statistical-fidelity metrics (variant frequencies, linkage disequilibrium, ancestry-stratified distributions) and biological plausibility (no impossible variant combinations, no Mendelian violations). Reference panels are never exposed to miners, so memorizing public datasets does not help.',
    rule: 'Statistical fidelity vs. held-out reference panels + biological plausibility.',
    cheatPath:
      "Pasting random SNP arrays from public sources doesn't survive — held-out fidelity metrics catch outputs that don't match the task-specified population structure.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is GPU rental for the duration of mining. Long-term, owning a single A6000-class box is the typical setup.',
    notes:
      'NIOME emissions are live (Yuma-accelerated 2026 Q1) but absolute payouts depend on Genomes.io commercial pipeline maturing.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner registered + responding',  note: 'pm2 shows niome-miner alive; axon port reachable.' },
    { day: 'day 3',  target: 'First synthetic-genome scored',  note: 'Validator returns a fidelity score; investigate if zero or NaN.' },
    { day: 'day 7',  target: 'Above-floor incentive',          note: 'If at floor: suspect (a) wrong population spec, (b) model produces biologically impossible variants, (c) memorising public datasets.' },
    { day: 'day 30', target: 'Stable on leaderboard',          note: "Held-out panels rotate — sustained accuracy requires a model that learned the distribution, not the seed." },
  ],

  monitoring: [
    { metric: 'Axon port reachability', threshold: 'reachable',            where: 'curl from outside the network' },
    { metric: 'Statistical-fidelity score', threshold: 'above network median', where: 'Validator response logs / Genomes.io dashboard if published' },
    { metric: 'GPU utilization',        threshold: '> 50% during tasks',   where: 'nvidia-smi' },
    { metric: 'Per-tempo incentive',    threshold: 'rising/flat',          where: 'btcli subnet metagraph --netuid 55' },
  ],

  knownIssues: [
    { symptom: 'Miner imports fail at start',
      cause:   'PYTHONPATH not set to include repo root, or Python < 3.12.',
      fix:     '`export PYTHONPATH="$PYTHONPATH:$(pwd)"`; ensure `python3 --version` reports 3.12+.' },
    { symptom: 'Validator cannot reach miner',
      cause:   'Axon port closed at firewall or cloud-provider ingress.',
      fix:     'Open the port matching `--axon.port`; verify reachability from a different network.' },
    { symptom: 'Fidelity score zero despite real generation',
      cause:   'Output format mismatch with validator expectations, or wrong population spec applied.',
      fix:     'Re-read miner_guide.md; align output schema with the task-specified spec.' },
  ],

  notes: [
    'No Windows support — Ubuntu 22.04+ only.',
    'Use pm2 or tmux to keep the miner alive across SSH disconnects — validator rewards depend on uptime.',
    'NIOME backs onto Genomes.io / GenomesDAO\'s 5-year privacy-preserving genomic infra (AMD SEV confidential compute, on-chain consent).',
  ],
};
