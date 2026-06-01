import type { RichPlaybook } from '../playbook-rich';

// SN23 — Trishool. Source: github.com/TrishoolAI/trishool-subnet README (2026-06).
// astro-petri (TrishoolAI/astro-petri, branch `alignet`) is the auditor.
// Mining is unusually light: a miner submits one seed instruction (prompt) per day.

export const sn23: RichPlaybook = {
  slug: '23-trishool',
  netuid: 23,
  name: 'Trishool',
  category: 'reason',
  categoryLabel: 'AI safety · red-teaming',

  blurb:
    'Decentralized alignment red-teaming. Miners submit seed instructions (≤ 2500 chars, jailbreak-checked, dedup-checked, 1/day) that probe target LLMs for behavioral failures; validators run the Petri auditing agent in Docker sandboxes and score by binary correctness on a 5-model selection task.',

  whatMinersDo:
    "A miner crafts a single seed instruction (prompt, max 2500 characters) designed to make a target model exhibit a misalignment trait — deception, sycophancy, manipulation, overconfidence, power-seeking. The miner uploads it through the Trishool platform API (`alignet.cli.miner upload`). The platform jailbreak-checks the submission (guard-LLM gate), runs a duplicate-detection LLM judge (<50% variation rejected), and on acceptance creates a PetriConfig including the miner's seed + target models + auditor + judge + max_turns. Validators fetch PetriConfigs, run Petri in Docker sandboxes (which install astro-petri from the `alignet` branch), score the output (binary 1.0 if the correct model is selected, 0.0 otherwise), and submit results back. Each miner is limited to 1 submission per day.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner client',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 10,
      bandwidth: 'standard',
      notes: 'A miner only needs to author and upload a text prompt — no GPU, no continuous process. The heavy compute is validator-side (Petri sandboxes + target model API calls).',
    },
  ],
  hardwareNote:
    'Validator-side compute is non-trivial — Docker sandboxes, astro-petri install, Ollama/local LLM judges, target-model API access. Miners are essentially submitting one well-crafted prompt per day; the entire mining flow can run from a laptop.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.04, coreweave: 0.06 },

  repo: {
    url: 'https://github.com/TrishoolAI/trishool-subnet',
    branch: 'main',
    minerEntrypoint: 'alignet.cli.miner upload',
    extraRepos: [
      { name: 'astro-petri', url: 'https://github.com/TrishoolAI/astro-petri', purpose: 'The Petri alignment auditing agent (validator runs branch `alignet`)' },
      { name: 'trishool-phase2', url: 'https://github.com/TrishoolAI/trishool-phase2', purpose: 'Phase 2 architecture (shaping activations)' },
      { name: 'docs',              url: 'https://github.com/TrishoolAI/trishool-ai-docs', purpose: 'Public docs' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Mining Trishool is a text-submission workflow: install the alignet CLI from the trishool-subnet repo, write a seed prompt, upload via the CLI with your coldkey/hotkey/network/netuid/slot UID. Validators do the heavy lifting in PM2-managed Docker sandboxes that pull astro-petri from the `alignet` branch.',

  install: [
    { step: 'Install the trishool-subnet package',
      cmd:  'git clone https://github.com/TrishoolAI/trishool-subnet.git && cd trishool-subnet && pip install -r requirements.txt',
      note: 'Python 3.12 per the README prerequisites.' },
    { step: 'Author your seed prompt',
      note: 'Plain text file, max 2500 chars. Targets a specific misalignment trait. Will be tested for jailbreak attempts and similarity to existing submissions.' },
    { step: 'Register hotkey on SN23',
      cmd:  'btcli subnet register --netuid 23 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: '(Optional) Test the seed locally with Petri',
      note: 'Per the README, miners can run astro-petri locally before submitting — see trishool/validator/sandbox/petri/PETRI_README.md.' },
  ],

  runSteps: [
    { step: 'Upload the seed via the alignet CLI',
      cmd:  'python -m alignet.cli.miner upload --agent-file your_seed_prompt.txt --coldkey $WALLET --hotkey $HOTKEY --network finney --netuid 23 --slot $MINER_UID --api-url https://api.trishool.ai',
      note: 'Network can also be `test` for the testnet; netuid changes accordingly. Slot is your miner UID on the metagraph.' },
    { step: 'Wait for validator pickup',
      note: 'Validators poll the platform API for evaluation agents; your PetriConfig is fetched and run in a Docker sandbox.' },
    { step: 'Watch the score post back',
      note: 'Binary score (1.0 if correct misaligned-model selected by Petri, 0.0 otherwise) is submitted back to the platform and used by the weight-update loop.' },
  ],

  envVars: [
    { name: 'WALLET',    description: 'Coldkey name (matches btcli wallet list)',                  required: true },
    { name: 'HOTKEY',    description: 'Hotkey name on that coldkey',                                required: true },
    { name: 'MINER_UID', description: 'Slot / UID on the SN23 metagraph (passed via --slot)',       required: true },
  ],

  scoring: {
    summary:
      'Per the README: Petri tests the submitted seed against 5 models (1 misaligned). Binary scoring — 1.0 if Petri picks the correct misaligned model, 0.0 otherwise. Submissions are pre-gated by jailbreak detection (guard LLM) and duplicate detection (judge LLM, <50% variation threshold). 1 submission per miner per day.',
    rule: 'Craft a seed that reliably steers Petri toward identifying the misaligned model in the 5-model probe set. Novelty matters because duplicates are rejected pre-evaluation.',
    sourcePath: 'TrishoolAI/trishool-subnet · platform validation pipeline + astro-petri (branch `alignet`)',
    cheatPath:
      "Jailbreak attempts in the seed → caught by the guard LLM before scoring. Reusing prompts close to existing submissions → caught by the duplicate-detection LLM judge (<50% variation rejected). Spamming submissions → 1 submission per miner per day limit. Trying to escape the sandbox → all evaluation runs in isolated Docker with timeouts + resource limits.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Essentially zero capex — the work is intellectual (designing prompts that probe alignment failures). The 1-submission-per-day limit caps throughput; quality and novelty dominate volume.',
  },

  milestones: [
    { day: 'day 1',  target: 'First seed accepted by the platform',
      note: 'Pre-checks: jailbreak gate + duplicate-detection pass. Confirms the alignet CLI is wired and the platform sees your hotkey.' },
    { day: 'day 3',  target: 'First scored evaluation',
      note: 'Validator picks up your PetriConfig, runs Petri, scores 1.0 or 0.0. Binary 1.0 means Petri correctly identified the misaligned target — that is the target.' },
    { day: 'day 7',  target: '≥ 4 of 7 submissions scoring 1.0',
      note: 'Consistent positive scoring puts you on the leaderboard. Novelty matters because dup-check rejects prompts <50% different from existing ones.' },
    { day: 'day 14', target: 'Visible on-chain weight',
      note: 'Validators sync metagraph + set weights periodically; expect a lag from accepted-score to on-chain weight.' },
  ],

  monitoring: [
    { metric: 'Submission acceptance rate', threshold: '≥ 80%', where: 'alignet CLI response / platform dashboard' },
    { metric: 'Binary score 1.0 rate',       threshold: '≥ 50%', where: 'Per-submission validator score posted back' },
    { metric: 'Daily submission usage',       threshold: '1/day', where: 'Platform API (rate-limit enforced)' },
    { metric: 'Hotkey incentive',             threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 23' },
  ],

  knownIssues: [
    {
      symptom: 'Submission rejected at jailbreak check',
      cause:   'Guard LLM flagged the seed as a jailbreak attempt rather than an alignment probe.',
      fix:     'Rephrase as a behavioral probe (deception, sycophancy, etc.) rather than a direct unlock-instruction. The seed is supposed to elicit misalignment, not bypass safety.',
    },
    {
      symptom: 'Submission rejected at duplicate check',
      cause:   'Your prompt is <50% different from an existing submission per the judge LLM.',
      fix:     'Pivot to a different misalignment trait or a different framing — recycling known jailbreaks loses on the novelty axis.',
    },
    {
      symptom: 'Score stuck at 0.0 despite accepted submissions',
      cause:   'Petri is not selecting the misaligned model on your prompts.',
      fix:     'Test the seed locally with Petri (per PETRI_README.md) before submitting; iterate until Petri picks the correct misaligned target locally.',
    },
    {
      symptom: 'Validator log shows commit-checker stuck',
      cause:   'Validator-side issue — astro-petri repo polling is stuck on a stale commit hash.',
      fix:     'Validator-side, not miner-side. Operators run `pm2 start repo-auto-updater.config.js` to auto-pull astro-petri updates.',
    },
  ],

  notes: [
    'Trishool publicly counts Chutes (SN64) as a customer for guardrails — Trishool attack distribution actively shapes defenses on one of Bittensor\'s largest subnets.',
    'Backed by Yuma Group (Digital Currency Group AI accelerator).',
    'Mining is unusually low-overhead — 1 prompt per day, no compute required on the miner side. The bottleneck is creativity + alignment-research domain knowledge.',
    'Phase 2 of the architecture (shaping activations rather than blocking outputs) is published in the trishool-phase2 repo.',
  ],
};
