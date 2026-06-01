import type { RichPlaybook } from '../playbook-rich';

// SN11 — TrajectoryRL. Agent-policy cost-optimisation tournament.
// Miner authors a policy pack (AGENTS.md / SOUL.md / tool_policy), uploads to S3,
// commits SHA256 hash on chain. No GPU, no uptime required.

export const sn11: RichPlaybook = {
  slug: '11-trajectoryrl',
  netuid: 11,
  name: 'TrajectoryRL',
  category: 'reason',
  categoryLabel: 'Agent policies',

  blurb:
    "Author a SKILL.md / AGENTS.md / tool_policy bundle, upload to S3, commit the SHA256 on-chain. Validators clone it, run ClawBench, score pass-then-cheapest. No GPU, no uptime required.",

  whatMinersDo:
    "A TrajectoryRL miner builds a 'policy pack' — a small bundle (SKILL.md / AGENTS.md / SOUL.md / tool_policy files) that makes an AI agent cheaper and more reliable. Build the pack locally with `trajectoryrl-miner build ./SKILL.md -o pack.json`, upload to an HTTP-reachable endpoint (typically S3) with `trajectoryrl-miner upload pack.json`, then submit the URL with `trajectoryrl-miner submit https://your-bucket.s3.amazonaws.com/pack.json` to commit the SHA256 hash on-chain. Validators pull the pack, run it through five ClawBench scenarios, apply safety/correctness rubrics; passing packs are ranked by total token cost, cheapest wins.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Dev machine',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      bandwidth: 'standard internet',
      notes: "Docs explicitly state 'No GPU, no uptime required.' The miner is build + upload, not a long-running process.",
    },
  ],
  hardwareNote:
    "Compute scaling is irrelevant — the tournament rewards better policy authoring, not bigger infrastructure. Your laptop is enough. The cost question is LLM token spend during your own offline iteration, not host hardware.",

  rentalOk: true,
  rentalNote: 'Anywhere with internet. The work is engineering, not compute.',
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.04, coreweave: 0.06 },

  repo: {
    url: 'https://github.com/trajectoryRL/trajectoryRL',
    branch: 'main',
    minerEntrypoint: 'trajectoryrl-miner CLI (installed by pip install -e .)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Install bittensor-cli, create + register a wallet on SN11, then `git clone` the repo and `pip install -e .` to get the trajectoryrl-miner CLI. Set up S3 credentials in .env.miner, author your SKILL.md, build into a pack, upload to S3, and submit the URL on-chain. Iterate.",

  install: [
    { step: 'Install bittensor-cli + create wallet', cmd: 'pip install bittensor-cli && btcli wallet create --wallet-name $WALLET' },
    { step: 'Register on SN11', cmd: 'btcli subnets register --wallet-name $WALLET --hotkey $HOTKEY --netuid 11' },
    { step: 'Clone + install the repo', cmd: 'git clone https://github.com/trajectoryRL/trajectoryrl.git && cd trajectoryrl && pip install -e .' },
    { step: 'Copy .env.miner.example → .env.miner', note: 'Fill S3_BUCKET and AWS_* credentials for the bucket where your packs will live.' },
    { step: 'Author SKILL.md / AGENTS.md / SOUL.md', note: 'Read winning packs from prior rounds — leaderboard solutions are open. Iterate offline against the ClawBench framework.' },
  ],

  runSteps: [
    { step: 'Build the pack', cmd: 'trajectoryrl-miner build ./SKILL.md -o pack.json' },
    { step: 'Upload pack to S3', cmd: 'trajectoryrl-miner upload pack.json' },
    { step: 'Submit the URL on-chain', cmd: 'trajectoryrl-miner submit https://your-bucket.s3.amazonaws.com/pack.json' },
    { step: 'Check status', cmd: 'trajectoryrl-miner status' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
    { name: 'S3_BUCKET', description: 'S3 bucket name where pack.json is hosted', required: true },
    { name: 'AWS_ACCESS_KEY_ID', description: 'AWS access key for S3 upload', required: true },
    { name: 'AWS_SECRET_ACCESS_KEY', description: 'AWS secret key for S3 upload', required: true },
    { name: 'AWS_REGION', description: 'S3 region (e.g. us-east-1)', required: false },
  ],

  scoring: {
    summary:
      'Two-stage. Stage 1: each of five ClawBench scenarios applies deterministic regex-based safety / correctness rubrics. Pack fails any rubric → score 0. Stage 2: surviving packs are ranked by total token cost; cheapest wins. Reported wins include 50–70% token reduction from instruction compression and up to 93% from cutting redundant tool calls.',
    rule: 'Pass every safety/correctness gate first. Then minimise total token cost across all five scenarios.',
    cheatPath:
      'Skimping on quality fails the rubrics, which sit before cost ranking — cheap-but-broken packs score zero. Hash commitment prevents post-hoc pack swapping. Five-scenario coverage (workplace tasks, model routing, self-evolution, security checks) means a pack optimised for one scenario fails the others and never reaches the cost stage.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is essentially zero. Engineering time + your own LLM token spend during offline iteration.',
    notes:
      'The slot was previously Dippy Roleplay before this pivot. Packs are open after each round — leaderboard converges quickly, so the edge is iteration speed, not raw cleverness.',
  },

  milestones: [
    { day: 'day 1', target: 'First pack submitted', note: 'trajectoryrl-miner submit returns success, btcli metagraph shows UID, status command shows your pack registered.' },
    { day: 'day 3', target: 'Pass safety/correctness rubrics', note: 'If failing, read the round logs and tighten the SKILL.md against the failing scenario.' },
    { day: 'day 7', target: 'Within top quartile by cost', note: 'Compare your token cost vs top miners. Compress instructions, eliminate redundant tool calls.' },
    { day: 'day 14', target: 'Stable above floor, iterating each round', note: 'Pull winning packs after each round, fork, propose improvements.' },
  ],

  monitoring: [
    { metric: 'Pack pass rate on rubrics', threshold: '5/5 scenarios pass', where: 'trajectoryrl-miner status + round-level logs published by validators' },
    { metric: 'Total token cost (cost stage)', threshold: 'top quartile vs leaderboard', where: 'Leaderboard / round logs' },
    { metric: 'S3 endpoint reachable', threshold: '100% (validators must clone)', where: 'curl your S3 URL from outside · public ACL' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 11' },
  ],

  knownIssues: [
    { symptom: 'Validators cannot fetch pack', cause: 'S3 object not publicly readable or wrong URL submitted.', fix: 'Set object ACL to public-read or use a presigned URL with long expiry. Re-submit if URL was wrong.' },
    { symptom: 'All scenarios fail correctness rubric', cause: 'SKILL.md too terse / stop rules missing.', fix: 'Add explicit step-by-step instructions and stop conditions. Trade some token cost for correctness — failing rubric = zero anyway.' },
    { symptom: 'Pass rubrics but high cost, low rank', cause: 'Redundant tool calls or verbose persona.', fix: 'Cut SOUL.md / persona text; restrict tool_policy to only the tools each scenario actually needs.' },
    { symptom: 'Re-submit rejected', cause: 'Cooldown between submissions or hash mismatch.', fix: 'Verify the SHA256 of your local pack matches what is on S3 before submit. Wait the cooldown out.' },
  ],

  notes: [
    'Slot history: Dippy Roleplay → TrajectoryRL.',
    "ClawBench framework lives at trajectoryRL/clawbench — useful to clone for offline iteration.",
    'Broader OpenClaw research stack provides the trajectory-centric RL environment around the packs.',
  ],
};
