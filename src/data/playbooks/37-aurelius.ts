import type { RichPlaybook } from '../playbook-rich';

// SN37 — Aurelius Protocol. AI alignment / ethical-reasoning red-team subnet.
// Miners serve scenario JSON configs (ethical dilemmas, 2 agents, tensions);
// validators run an 8-stage pipeline that ends in a Concordia simulation, and
// only deduct one "work-token" per ACCEPTED submission. Setup is Docker-based.

export const sn37: RichPlaybook = {
  slug: '37-aurelius',
  netuid: 37,
  name: 'Aurelius',
  category: 'reason',
  categoryLabel: 'Reasoning / Alignment',

  blurb:
    'Decentralized AI alignment red-teaming via scenario libraries. Miners submit pre-authored ethical-dilemma configs; validators run an 8-stage screen ending in a Concordia multi-agent simulation, charging one work-token per accepted scenario.',

  whatMinersDo:
    "A miner runs the Aurelius axon (default port 8091) and serves scenario JSON files in round-robin order when validators issue a ScenarioConfigSynapse. Each scenario is a structured ethical dilemma — two agents, named tensions (e.g. justice vs. mercy), decision points. The validator pipes the config through eight stages (version, schema, balance, rate-limit, novelty, classifier, simulation, weight-set) and only deducts a work-token when all stages pass. Your job is to write a deep, novel scenario library — recycled jailbreaks fail the FAISS novelty check and earn nothing.",

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
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'static public IP · open inbound TCP 8091',
      notes: 'No GPU needed — the heavy LLM work runs on the validator side. Miner just serves JSON configs.',
    },
  ],
  hardwareNote:
    'CPU-only subnet. The work is curatorial — write deep ethical dilemmas, not GPU inference. A cheap VPS with a public IP is sufficient.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.12 },

  repo: {
    url: 'https://github.com/Aurelius-Protocol/Aurelius-Protocol',
    branch: 'main',
    extraRepos: [
      { name: 'aurelius-whitepaper', url: 'https://github.com/Aurelius-Protocol/aurelius-whitepaper', purpose: 'Protocol design rationale' },
    ],
  },

  setupShape: 'docker-compose',
  setupOverview:
    'Official path is the published Docker image — pull, mount your wallets directory and a configs/ folder of scenario JSON, set five env vars, expose port 8091. No source build is recommended; the lock-file pins specific bittensor / scalecodec versions to avoid known dep conflicts.',

  install: [
    { step: 'Pull the official miner image',
      cmd:  'docker pull ghcr.io/aurelius-protocol/aurelius-miner:latest' },
    { step: 'Create the configs/ scenario directory',
      note: 'Drop your scenario JSON files here. Each describes two agents + named tensions + decision points. Quality and novelty drive earnings.' },
    { step: 'Create .env from the template',
      note: 'Set ENVIRONMENT=mainnet, WALLET_NAME, WALLET_HOTKEY, AXON_EXTERNAL_IP, AXON_EXTERNAL_PORT=8091. Do NOT leave CENTRAL_API_URL blank — omit it entirely (blank overrides profile defaults).' },
    { step: 'Register your hotkey on SN37',
      cmd:  'btcli subnet register --netuid 37 --wallet.name $WALLET_NAME --wallet.hotkey $WALLET_HOTKEY' },
    { step: 'Deposit work-tokens',
      note: 'Transfer TAO to the protocol multisig — the Central API credits your hotkey work-token balance. Submissions are rejected at stage 3 if balance is zero.' },
  ],

  runSteps: [
    { step: 'Start the miner container',
      cmd: `docker run -d \\
  --name aurelius-miner \\
  --restart unless-stopped \\
  --env-file .env \\
  -p 8091:8091 \\
  -v ~/.bittensor/wallets:/home/appuser/.bittensor/wallets:ro \\
  -v "$(pwd)/data:/app/data" \\
  -v "$(pwd)/configs:/app/configs:ro" \\
  ghcr.io/aurelius-protocol/aurelius-miner:latest`,
      note: 'Wallets mounted read-only. configs/ read-only. data/ writable for local state.' },
    { step: 'Tail the logs',
      cmd:  'docker logs -f aurelius-miner',
      note: 'Watch for validator queries arriving and acceptances coming back.' },
  ],

  envVars: [
    { name: 'ENVIRONMENT',        description: 'Set to mainnet for SN37',                              required: true },
    { name: 'WALLET_NAME',        description: 'Coldkey name (btcli wallet list)',                     required: true },
    { name: 'WALLET_HOTKEY',      description: 'Hotkey name on that coldkey',                          required: true },
    { name: 'AXON_EXTERNAL_IP',   description: 'Publicly reachable IP of this miner',                  required: true },
    { name: 'AXON_EXTERNAL_PORT', description: 'External port mapped to 8091 (default 8091)',         required: true },
    { name: 'MINER_CONFIG_DIR',   description: 'Path to scenario JSON dir (default: configs)',         required: false },
  ],

  scoring: {
    summary:
      'Validators run each scenario through 8 stages: version → schema → balance → rate-limit → novelty (FAISS) → classifier quality → Concordia simulation → weight set. Pipeline short-circuits on the first failure; the work-token is deducted only after stage 8 succeeds. DEFAULT_WORK_TOKEN_COST = 1.0 per accepted submission.',
    rule: 'Earn by submitting genuinely novel, well-formed ethical dilemmas that survive the classifier and run cleanly in Concordia. Recycled or near-duplicate scenarios fail novelty (stage 5) and earn nothing.',
    cheatPath:
      "Don't recycle public jailbreak prompts — the FAISS novelty stage embedding-compares against the historical corpus. Don't ship malformed JSON — stage 2 hard-fails. Don't run with empty work-token balance — stage 3 hard-fails before any LLM cost is incurred (so you never earn back the deposit).",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Minimal — VPS + work-token TAO deposit. The cost center is YOUR TIME authoring scenarios.',
    notes:
      'Top miners maintain libraries of hundreds to thousands of distinct scenarios. This is a curation/authoring play, not a GPU play.',
  },

  milestones: [
    { day: 'day 1', target: 'Container up, hotkey registered, work-tokens deposited',
      note: 'docker logs show validator queries arriving. Balance > 0 at stage 3.' },
    { day: 'day 3', target: 'First accepted scenarios → first weight signal',
      note: 'Most rejections at day 1-2 are novelty-related. Iterate scenario diversity.' },
    { day: 'day 7', target: 'Stable acceptance rate above 30%',
      note: 'If acceptance < 10%, your library is too narrow. Expand tension types and agent archetypes.' },
    { day: 'day 14', target: 'Out of immunity period, weight > floor',
      note: 'Top miners by then have shipped 200+ distinct accepted scenarios.' },
  ],

  monitoring: [
    { metric: 'Work-token balance',       threshold: '> 100',           where: 'Central API · or docker logs balance check stage' },
    { metric: 'Stage-3 rejections',       threshold: '0',               where: 'docker logs — means balance hit zero' },
    { metric: 'Stage-5 rejections',       threshold: '< 70%',           where: 'docker logs — means novelty is failing' },
    { metric: 'Axon reachability',        threshold: '100%',            where: 'curl http://$AXON_EXTERNAL_IP:8091/ from outside' },
    { metric: 'Per-tempo incentive',      threshold: 'rising',          where: 'btcli subnet metagraph --netuid 37' },
  ],

  knownIssues: [
    {
      symptom: 'pip install fails with scalecodec / async-substrate-interface conflict',
      cause:   'async-substrate-interface 2.x detects scalecodec; bittensor versions require ScaleObj which older interfaces lack.',
      fix:     'Use the published Docker image. If you must build from source, honor the lockfile: scalecodec==1.6.3, bittensor==10.2.0.',
    },
    {
      symptom: 'Container ignores CENTRAL_API_URL profile default',
      cause:   'A blank CENTRAL_API_URL= line in .env overrides the built-in profile default in older images.',
      fix:     'OMIT the CENTRAL_API_URL line entirely from .env rather than leaving it empty.',
    },
    {
      symptom: 'All submissions reject at stage 3',
      cause:   'Work-token balance is zero — you have not deposited TAO to the protocol multisig.',
      fix:     'Send TAO to the multisig address shown in repo docs; Central API credits your hotkey after confirmation.',
    },
    {
      symptom: 'High stage-5 (novelty) reject rate',
      cause:   'Scenarios too similar to existing corpus — FAISS embeddings match.',
      fix:     'Diversify: change tension pairings, agent archetypes, cultural framing, decision-point structure. Re-author rather than tweak.',
    },
  ],

  notes: [
    'Aurelius publishes via Medium / Substack — light on protocol-level changelog. Watch the repo commits for stage-pipeline updates.',
    'This subnet is unusual in Bittensor: it is a CPU-only authoring play, not a GPU inference play. Optimize for content quality, not throughput.',
  ],
};
