import type { RichPlaybook } from '../playbook-rich';

// SN83 — CliqueAI. Solver-as-a-service for the NP-hard maximum-clique
// problem. Validators send graphs, miners return candidate cliques,
// validators verify cheaply (clique-checking is polynomial) and rank by
// the size of the largest valid clique. Open-source toptensor/CliqueAI
// repo, mostly Python. CPU-heavy; GPU optional for learned heuristics.

export const sn83: RichPlaybook = {
  slug: '83-cliqueai',
  netuid: 83,
  name: 'CliqueAI',
  category: 'reason',
  categoryLabel: 'Combinatorial / NP-hard',

  blurb:
    'Decentralized solver network for the maximum-clique problem. Validators issue graphs, miners return candidate cliques, verification is cheap and search is hard — the asymmetry favors miners with better solvers.',

  whatMinersDo:
    'You receive a graph (vertices + edges + time budget) from a validator and return the largest clique you can find within the budget. Stronger branch-and-bound, smarter local search, and optional learned heuristics directly translate into bigger cliques and higher weights. Validators cheaply verify each submission is actually a clique; invalid submissions drop to zero.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 188,
  slotCap: 256,

  hardware: [
    {
      role: 'CPU node',
      count: '1',
      cpuCores: 32,
      ramGb: 128,
      diskGb: 200,
      bandwidth: 'static public IP · open axon port',
      notes: 'CPU-heavy. Many cores + fast memory matter more than GPU. Graphs can be large — having 128GB RAM avoids swapping during heavy searches.',
    },
  ],
  hardwareNote:
    'GPU is optional and only useful if you plug in a learned heuristic. The default reference miner is a pure-CPU combinatorial solver.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/toptensor/CliqueAI',
    branch: 'main',
    minerEntrypoint: 'start_miner.sh',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone the toptensor/CliqueAI repo, install dependencies, register a hotkey on netuid 83, and run start_miner.sh with your wallet flags + axon IP/port. Customize the solver plugin if you want to climb the leaderboard — the reference solver is a baseline, not a frontier.',

  install: [
    { step: 'Clone the miner repo',
      cmd:  'git clone https://github.com/toptensor/CliqueAI && cd CliqueAI' },
    { step: 'Create wallet + hotkey',
      cmd:  'btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Register on SN83',
      cmd:  'btcli subnet register --netuid 83 --wallet.name $WALLET --wallet.hotkey $HOTKEY --subtensor.network finney',
      note: 'Check burn-cost immediately before — re-registration is expensive.' },
    { step: 'Make miner entrypoint executable',
      cmd:  'chmod +x start_miner.sh' },
  ],

  runSteps: [
    { step: 'Start the miner',
      cmd:  './start_miner.sh \\\n  --wallet.name $WALLET \\\n  --wallet.hotkey $HOTKEY \\\n  --subtensor.network finney \\\n  --netuid 83 \\\n  --logging.info \\\n  --axon.ip <your-miner-ip> \\\n  --axon.port <your-miner-port>',
      note: 'The axon IP/port must be reachable from the public internet — validators send graphs over the axon.' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 83',
      note: 'Confirm your UID and watch incentive climb after the first few tempos.' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name on that coldkey',              required: true },
  ],

  scoring: {
    summary:
      'Largest valid clique returned across the tempo benchmark set wins. Verification is polynomial (just check every claimed edge exists and the subgraph is complete), so validators cheaply reject invalid submissions. Across many graphs in the benchmark set, miners accumulate a score that maps directly to weights.',
    rule: 'Per-graph rank by valid clique size → aggregate score over the tempo → weight vector. Invalid submissions score zero on that graph.',
    cheatPath:
      'Cannot fake a clique — every vertex pair is edge-checked. Memorizing benchmark instances fails because validators rotate graphs from a parametric distribution. The only durable edge is genuinely better combinatorial solvers (better branch-and-bound, smarter local search, learned heuristics).',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Capex-light vs GPU subnets — a 32-core box at $300–$500/mo is enough to compete. Edge comes from solver quality, not hardware spend.',
  },

  milestones: [
    { day: 'day 1',  target: 'UID assigned, axon reachable, first responses', note: 'Validators should be hitting your axon within a tempo. Confirm with `curl http://<your-ip>:<port>` from a different network.' },
    { day: 'day 3',  target: 'First non-zero incentive',                       note: 'Reference solver produces some valid cliques on easier graphs.' },
    { day: 'day 7',  target: 'Solver tuning starts paying',                    note: 'If still near the floor, swap or tune the solver — that is the only lever.' },
    { day: 'day 14', target: 'Out of immunity, weight stable',                 note: 'Compare your solver output to top miners on hard benchmark graphs.' },
  ],

  monitoring: [
    { metric: 'Axon reachability',     threshold: '100%',          where: 'curl http://<miner-ip>:<port> from outside' },
    { metric: 'Valid-clique rate',     threshold: '> 95%',         where: 'miner logs · invalid submissions are wasted compute' },
    { metric: 'CPU utilization',       threshold: '> 70% under load', where: 'top / htop' },
    { metric: 'Per-tempo incentive',   threshold: 'rising or flat',where: 'btcli subnet metagraph --netuid 83' },
  ],

  knownIssues: [
    { symptom: 'Validators not hitting the axon', cause: 'Firewall blocking axon port, or --axon.ip set to a private/internal address.', fix: 'Open the axon port at the cloud firewall; set --axon.ip to the public IP of the box (or use 0.0.0.0 with port-forwarding).' },
    { symptom: 'Submissions valid but score low', cause: 'Reference solver leaves a lot on the table on dense graphs.',                  fix: 'Swap in a stronger heuristic (PMC, MCS, learned model) or extend search budget.' },
    { symptom: 'Invalid submissions score zero',  cause: 'Solver bug returning non-cliques, or vertex indexing off-by-one.',             fix: 'Add a local clique-checker before submission — never trust the solver output blind.' },
  ],

  notes: [
    'The repo is ~99% Python plus shell scripts — easy to fork and slot in a custom solver.',
    'Verification is cheap and rotation is real — invalid cliques score zero and benchmarks rotate from a parametric distribution.',
  ],
};
