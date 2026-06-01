import type { RichPlaybook } from '../playbook-rich';

// SN5 — Hone (Manifold Labs + Latent). ARC-AGI-2 reasoning competition.
// Miners point validators at a git repo with their solver. Validators clone it
// into a GPU sandbox and run it against held-out ARC tasks. Docker-based.

export const sn5: RichPlaybook = {
  slug: '5-hone',
  netuid: 5,
  name: 'Hone',
  category: 'reason',
  categoryLabel: 'Reasoning (ARC-AGI-2)',

  blurb:
    'Run a sandbox endpoint that points validators at your ARC-AGI-2 solver repo. Validators clone your pinned commit, execute it in an H200-class GPU sandbox, and score by % tasks solved.',

  whatMinersDo:
    "A Hone miner runs a small Docker service that exposes an HTTP endpoint advertising a public solver repo (MINER_REPO_URL) + branch (MINER_REPO_BRANCH) + GPU weight class (1xH200, 2xH200, 4xH200, or 8xH200). Validators pull that pinned repo into a secure GPU sandbox each tempo, run it against a held-out ARC-AGI-2 batch with two phases — `python arc_main.py --phase prep` then `python arc_main.py --phase inference` — and score the miner by exact-match rate on the held-out tasks.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner host (advertises solver repo)',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 50,
      bandwidth: 'public IP · port 8091 open',
      notes: "The miner endpoint itself is light — it just declares which weight class and repo to use. Validators run the actual GPU work in their sandbox.",
    },
    {
      role: 'Validator-side sandbox (for reference, NOT miner-side)',
      count: 'n/a (validator runs this)',
      gpu: 'H200 (1× / 2× / 4× / 8× depending on declared MINER_WEIGHT_CLASS)',
      vramGb: 141,
      cpuCores: 16,
      ramGb: 128,
      diskGb: 500,
      notes: 'Your declared weight class determines the GPU pool the validator allocates during execution. Bigger class = more capable solver but you must actually use the capacity to score.',
    },
  ],
  hardwareNote:
    'Miner hardware is trivial because the GPU work happens on validator infra during sandbox execution. The hardware decision is which MINER_WEIGHT_CLASS to declare — pick the smallest class your solver actually needs. Declaring 8xH200 with a 1-GPU-shaped solver wastes capacity and does not improve score.',

  rentalOk: true,
  rentalNote: 'Miner endpoint can run anywhere — VPS, home box, anything with a public IP and port 8091 open.',
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/manifold-inc/hone',
    branch: 'main',
    minerEntrypoint: 'miner/Dockerfile (Docker image listens on 8091)',
  },

  setupShape: 'docker-compose',
  setupOverview:
    "Clone the Hone repo, write your solver in a separate public git repo, populate miner/.env with your wallet + repo URL + weight class, build the miner Docker image, and run it on a host with a public IP. Validators do the GPU work; you just advertise the repo + class.",

  install: [
    { step: 'Clone the Hone repo', cmd: 'git clone https://github.com/manifold-inc/hone.git && cd hone' },
    { step: 'Create solver repo (your code)', note: 'Fork a baseline or start fresh. Your solver must implement the two phases arc_main.py --phase prep and --phase inference. Push to a public git URL.' },
    { step: 'Populate miner/.env', note: 'Set WALLET_NAME, WALLET_HOTKEY, MINER_PORT, MINER_REPO_URL, MINER_REPO_BRANCH, MINER_WEIGHT_CLASS, and optional vLLM vars.' },
    { step: 'Register on SN5', cmd: 'btcli subnet register --netuid 5 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Post your axon IP on-chain', cmd: 'python tools/post_ip_chain.py --wallet-name $WALLET --hotkey $HOTKEY --ip $YOUR_PUBLIC_IP --port 8091' },
    { step: 'Build the miner Docker image', cmd: 'docker build -t hone-miner -f miner/Dockerfile .' },
  ],

  runSteps: [
    {
      step: 'Run the miner container',
      cmd: 'docker run -d --name miner -p 8091:8091 \\\n  -v ~/.bittensor/wallets:/root/.bittensor/wallets:ro \\\n  --env-file miner/.env hone-miner',
    },
    { step: 'Verify the miner is healthy', cmd: 'curl http://localhost:8091/health && curl http://localhost:8091/info' },
    { step: 'Verify on the metagraph', cmd: 'btcli subnet metagraph --netuid 5' },
  ],

  envVars: [
    { name: 'WALLET_NAME', description: 'Coldkey name (e.g. default)', required: true },
    { name: 'WALLET_HOTKEY', description: 'Hotkey name (e.g. miner)', required: true },
    { name: 'MINER_PORT', description: 'Axon port the Docker container exposes (default 8091)', required: true },
    { name: 'MINER_REPO_URL', description: 'Public git URL of your solver repo (validators clone this)', required: true },
    { name: 'MINER_REPO_BRANCH', description: 'Branch / tag / commit to pin (typically main)', required: true },
    { name: 'MINER_WEIGHT_CLASS', description: 'GPU class declaration: 1xH200 / 2xH200 / 4xH200 / 8xH200', required: true },
    { name: 'MINER_USE_VLLM', description: 'Optional: true/false — toggle vLLM-backed inference in solver', required: false },
    { name: 'VLLM_MODEL', description: 'Optional: HF model path if MINER_USE_VLLM=true', required: false },
  ],

  scoring: {
    summary:
      'Validators evaluate each miner with exact_match_rate — percentage of held-out ARC-AGI-2 tasks solved correctly. Minimum floor of 20% accuracy required to qualify; top 5 miners above floor receive rewards via exponential decay (factor 0.8 per rank).',
    rule: 'Solve more ARC-AGI-2 tasks than the field while declaring an appropriate weight class. Sub-floor solvers earn nothing.',
    cheatPath:
      'Tasks are drawn from a private held-out set, so you cannot pre-compute answers. The sandbox blocks network calls, ruling out remote-LLM relays. Code is revealed after each round but the test set rotates — copying yesterday\'s winner only works until the next batch lands and the same approach hits its ceiling.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Miner-side capex is trivial — a $5/mo VPS runs the endpoint. Real cost is engineering time on the solver itself. Top-5-only payout means ARC research talent is the bottleneck, not hardware.',
    notes: 'Exponential decay (0.8 per rank) plus top-5-only payout means the leaderboard is brutally winner-takes-most. You are not making median emission here — you either crack ARC-AGI-2 better than #6 or you earn near-zero.',
  },

  milestones: [
    { day: 'day 1', target: 'Miner registered, IP posted, container healthy', note: 'btcli metagraph shows UID, curl /health returns 200, validator should be cloning your repo within a tempo.' },
    { day: 'day 3', target: 'First validator runs visible in solver logs', note: 'Check /info endpoint hits and that arc_main.py executions are landing in your S3 or wherever you ship logs.' },
    { day: 'day 7', target: 'Above 20% floor, within top 5', note: 'Sub-floor → zero. Tune solver. If well below floor, you need a fundamentally better approach, not micro-optimisation.' },
    { day: 'day 14', target: 'Stable top-5 rank, surviving immunity drop', note: 'Decay factor 0.8 per rank means rank 1 vs rank 5 emissions differ ~3×. Push rank up.' },
  ],

  monitoring: [
    { metric: 'Validator clone hits', threshold: 'every tempo', where: 'Endpoint logs at port 8091 + solver repo traffic.' },
    { metric: 'exact_match_rate on held-out batch', threshold: '> 20% (floor)', where: 'Public Hone leaderboard / validator log forwards.' },
    { metric: 'Rank vs top-5 cutoff', threshold: 'in top 5', where: 'Leaderboard. Below #5 = zero emission.' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 5' },
  ],

  knownIssues: [
    { symptom: 'Validators never pull my repo', cause: "MINER_REPO_URL not publicly cloneable, or you didn't post your IP on-chain.", fix: 'Verify `git clone <url>` works from a fresh box with no auth; re-run tools/post_ip_chain.py with the right IP/port.' },
    { symptom: 'Solver runs but score is 0', cause: 'Solver does not implement both --phase prep and --phase inference, or output schema is wrong.', fix: 'Match arc_main.py contract exactly. Outputs must be in /output with expected filenames.' },
    { symptom: 'Wrong MINER_WEIGHT_CLASS, OOM in sandbox', cause: 'Solver wants more VRAM than your declared class provides.', fix: 'Either shrink the solver (quantise, smaller model) or declare a bigger class. Note declaring bigger costs you nothing miner-side but you need to actually use it for top-5 rank.' },
    { symptom: 'Health check OK, /info OK, but no UID assigned', cause: 'Registration TX not confirmed or wrong netuid.', fix: 'Re-check btcli subnet register output. Confirm --netuid 5. If burn was high, retry next tempo.' },
  ],

  notes: [
    'Solutions become public after each round — read winning packs and fork.',
    'Hone is paired with Targon (SN4) for productisation once a viable general solver exists.',
    'Hone leaderboard moves are publicised by Manifold — watch x.com/manifoldlabs for round announcements.',
  ],
};
