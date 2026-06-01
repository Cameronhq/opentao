import type { RichPlaybook } from '../playbook-rich';

// SN36 — Web Agents / Eirel. Operated by Autoppia. Miner does NOT execute
// tasks live — miners advertise METADATA (AGENT_NAME, GITHUB_URL,
// AGENT_IMAGE). The validator then clones the miner's GitHub repo at the
// declared commit and runs the agent in a sandboxed Docker environment.
// Agent repo must expose an HTTP /act endpoint matching ApifiedWebAgent.
// Subnet positioning is mid-evolution from "Web Agents (IWA)" to "Eirel
// (multimodal execution layer)".

export const sn36: RichPlaybook = {
  slug: '36-eirel',
  netuid: 36,
  name: 'Eirel (Web Agents)',
  category: 'reason',
  categoryLabel: 'Agents / Execution',

  blurb:
    'Execution layer for multimodal AI workflows — agents that complete real tasks on real software. Miners advertise GitHub URL + commit; validators clone the repo and run the agent in a sandbox against the Infinite Web Arena (IWA) benchmark.',

  whatMinersDo:
    "A SN36 miner runs `neurons/miner.py` to advertise metadata only: AGENT_NAME (public display name), GITHUB_URL (a repo URL with specific ref/commit, e.g. `github.com/<owner>/<repo>/commit/<sha>`), and AGENT_IMAGE (icon URL). At each round, validators read the metadata, clone the repo at the declared commit, and run the agent in a sandboxed Docker environment. The agent code must expose an HTTP `/act` endpoint compatible with `ApifiedWebAgent` — validator sends task state, agent returns an action sequence. Validator executes those actions in a fresh browser, snapshots after each step, and grades against task-specific tests (HTML verification, backend events, vision-based screenshots, LLM evaluation). If your repo cannot be cloned or doesn't implement `/act`, your score is 0.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner host (metadata serving only)',
      count: '1',
      cpuCores: 2,
      ramGb: 4,
      diskGb: 20,
      bandwidth: '100 Mbps · static public IP for axon',
      notes: 'Miner does NOT execute tasks live — it only responds to handshake with metadata. The actual agent runs inside the validator sandbox. A laptop / cheap VPS is sufficient for the miner process itself.',
    },
    {
      role: '(Optional) Local dev box for benchmark testing',
      count: '1',
      gpu: '1× modern NVIDIA if your agent stack uses local multimodal models',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: '100 Mbps',
      notes: 'Used pre-mainnet to run `python -m autoppia_iwa.entrypoints.benchmark.run` against your agent locally. Validators never see this box.',
    },
  ],
  hardwareNote:
    "The miner process is essentially metadata serving; real cost is hosting / API spend INSIDE the agent that the validator clones. If your agent uses GPT-4o / Claude / Gemini API for reasoning, the validator-side API key budget is the bottleneck. If it uses a self-hosted model, the validator sandbox needs to launch the heavy container.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.05, coreweave: 0.05 },

  repo: {
    url: 'https://github.com/autoppia/autoppia_web_agents_subnet',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
    extraRepos: [
      { name: 'autoppia/autoppia_iwa', url: 'https://github.com/autoppia/autoppia_iwa', purpose: 'Infinite Web Arena benchmark + ApifiedWebAgent sandbox runner spec' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Run two install scripts (dependencies + miner env), copy `.env.miner-example` to `.env`, fill in AGENT_NAME + GITHUB_URL + AGENT_IMAGE pointing at your public agent repo (with a specific commit), then start `neurons/miner.py` under PM2. Most of the work is BUILDING the agent in the referenced repo — test it locally with the benchmark before mainnet.',

  install: [
    { step: 'Clone the SN36 miner repo',
      cmd: 'git clone https://github.com/autoppia/autoppia_web_agents_subnet.git && cd autoppia_web_agents_subnet' },
    { step: 'Install miner dependencies',
      cmd: 'chmod +x scripts/miner/install_dependencies.sh && ./scripts/miner/install_dependencies.sh' },
    { step: 'Run miner setup',
      cmd: 'chmod +x scripts/miner/setup.sh && ./scripts/miner/setup.sh',
      note: 'Installs Python, PM2, bittensor only. Does NOT install Playwright/IWA — those are only needed locally for benchmark testing.' },
    { step: 'Copy env template',
      cmd: 'cp .env.miner-example .env' },
    { step: 'Set AGENT_NAME / GITHUB_URL / AGENT_IMAGE in .env',
      note: 'GITHUB_URL must point to a specific commit URL (recommended), e.g. https://github.com/<owner>/<repo>/commit/<sha>. The agent repo must expose the HTTP /act endpoint used by ApifiedWebAgent.' },
    { step: '(Recommended) Test your agent locally first',
      cmd: 'cd ../autoppia_iwa && python -m autoppia_iwa.entrypoints.benchmark.run' },
    { step: '(Recommended) Run validator-equivalent sandbox eval against your commit',
      cmd: 'python -m scripts.miner.eval_github --github "https://github.com/<owner>/<repo>/commit/<sha>" --tasks 1',
      note: 'Validates that your repo can actually be cloned + run + scored by a validator BEFORE you advertise it on mainnet.' },
    { step: 'Acquire stake (≥ 100 alpha) on the hotkey',
      note: "Anti-spam requirement: hotkey needs >= 100.0 alpha staked. Also: max 2 hotkeys per coldkey." },
    { step: 'Register on SN36',
      cmd: 'btcli subnet register --netuid 36 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Activate miner env + start under PM2',
      cmd: `source miner_env/bin/activate && pm2 start neurons/miner.py \\
  --name "subnet_36_miner" \\
  --interpreter python3.11 \\
  -- \\
  --netuid 36 \\
  --subtensor.network finney \\
  --wallet.name $WALLET \\
  --wallet.hotkey $HOTKEY \\
  --logging.debug \\
  --axon.port 8091` },
    { step: 'Verify on metagraph',
      cmd: 'btcli subnet metagraph --netuid 36' },
    { step: 'Push a new agent version',
      note: 'Within the same season, validators skip re-evaluating the same repo+commit. To get re-evaluated, push a NEW commit to your agent repo and update GITHUB_URL in .env to the new commit URL, then `pm2 restart subnet_36_miner`.' },
  ],

  envVars: [
    { name: 'WALLET',       description: 'Coldkey name',                                                             required: true },
    { name: 'HOTKEY',       description: 'Hotkey name (≥ 100 alpha staked, max 2 hotkeys per coldkey)',              required: true },
    { name: 'AGENT_NAME',   description: 'Public display name shown to validators in the leaderboard',                required: true },
    { name: 'GITHUB_URL',   description: 'Specific commit URL of your agent repo (validator clones this exact ref)', required: true },
    { name: 'AGENT_IMAGE',  description: 'Public icon URL shown in the leaderboard / UI',                             required: false },
  ],

  scoring: {
    summary:
      'Two-component reward: 85% task-completion precision (did the agent finish the task per the success rubric?) + 15% execution speed (step count + wall-clock time + tool-call count). Tasks are organized into seasons composed of rounds. Validator over-cost rule: if `cost_usd >= MAX_TASK_DOLLAR_COST_USD` for a task, it counts as over-cost; if over-cost hits reach 10 in a season, the validator-equivalent final score is FORCED TO ZERO.',
    rule: 'Maximize task completion rate on Infinite Web Arena benchmark tasks; keep per-task LLM API cost below the over-cost threshold to avoid the zero-score safety rule.',
    sourcePath: 'autoppia/autoppia_web_agents_subnet · calculate_reward_for_task + sandbox config',
    cheatPath:
      "Returning plausible-looking outputs without actually executing the actions fails state-level grading — validator inspects the sandbox state, not just the agent's reported result. Memorizing specific tasks is killed by task-family rotation in IWA. Sybil copies of one agent give identical scores across hotkeys and cross-validator correlation flags them.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Miner process itself is near-zero cost (cheap VPS). Real cost is (a) ≥ 100 alpha stake requirement and (b) LLM API budget for the agent code that runs INSIDE the validator sandbox — over-cost tasks zero out your score, so you need to optimize cost per task aggressively.',
    notes:
      'Agent engineering quality (planning, error recovery, cost efficiency) dominates emission. Cookie-cutter LangChain wrappers will not survive long.',
  },

  milestones: [
    { day: 'day 1',  target: 'Local benchmark passes',  note: '`autoppia_iwa.entrypoints.benchmark.run` reports validator-equivalent score > 0 against a real task set.' },
    { day: 'day 3',  target: 'Miner registered + advertised', note: 'Hotkey has ≥ 100 alpha; metagraph shows your UID; validators have cloned your repo at the declared commit.' },
    { day: 'day 7',  target: 'First round scored',     note: 'Validator-equivalent score > 0 visible in scoring logs; UID incentive non-zero.' },
    { day: 'day 14', target: 'Over-cost rule clean',   note: 'Less than 10 over-cost tasks in the season; safety zero-score rule never triggered.' },
    { day: 'day 30', target: 'Out of immunity + improving',  note: 'Surviving deregistration; ship at least one new commit per round to stay competitive with newcomers.' },
  ],

  monitoring: [
    { metric: 'Local benchmark validator_final_score', threshold: '> 0.3',          where: '`scripts/miner/eval_github` summary JSON' },
    { metric: 'Over-cost task count in season',        threshold: '< 10',           where: 'eval_github cost-limit counters · 10 = forced zero-score' },
    { metric: 'Per-task cost_usd',                     threshold: '< MAX_TASK_DOLLAR_COST_USD', where: 'eval_github report per-task cost' },
    { metric: 'Hotkey alpha stake',                    threshold: '≥ 100',          where: 'btcli wallet inspect · drop below 100 disqualifies' },
    { metric: 'Per-tempo incentive',                   threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 36' },
  ],

  knownIssues: [
    {
      symptom: 'Validator scores your hotkey at 0',
      cause:   "Repo cannot be cloned (private repo), the declared commit doesn't exist, or the agent doesn't expose the /act endpoint.",
      fix:     "Make the repo PUBLIC. Use a specific commit URL: `github.com/<owner>/<repo>/commit/<sha>`. Implement `/act` per ApifiedWebAgent spec. Re-run `scripts/miner/eval_github --github <url>` to confirm before changing GITHUB_URL in .env.",
    },
    {
      symptom: 'Forced zero-score halfway through season',
      cause:   'Agent burned through > 10 over-cost tasks (each over MAX_TASK_DOLLAR_COST_USD). Safety rule kicked in.',
      fix:     "Profile per-task LLM cost. Add cost ceilings inside the agent (early-exit on long sessions, switch to cheaper model after N steps). Local eval reports cost per task — calibrate before pushing.",
    },
    {
      symptom: 'Validator never re-evaluates your model even after pushing a commit',
      cause:   "Within a season, validators skip re-evaluation of the same repo+commit. If you didn't change the commit hash, you stay cached.",
      fix:     "Push a NEW commit to the agent repo, update GITHUB_URL in .env to the new commit URL, then `pm2 restart subnet_36_miner`.",
    },
    {
      symptom: '/act endpoint returns 500 inside the sandbox',
      cause:   "Sandbox missing an env var your agent needs (e.g. OPENAI_API_KEY) — validator sandboxes run with restricted env.",
      fix:     "Document required env vars in your agent repo; validators typically forward a standard agent-env set. Coordinate with operator on Discord (@Daryxx / @Riiveer) if your agent needs unusual config.",
    },
    {
      symptom: 'Cannot register because hotkey alpha < 100',
      cause:   "Anti-spam stake requirement.",
      fix:     "Stake at least 100 alpha to the hotkey via `btcli stake add` before validators will pick you up.",
    },
  ],

  notes: [
    "Subnet identity is positioned as 'Eirel — execution layer for multimodal AI workflows' on the Bittensor.ai directory; original code repo remains under autoppia/autoppia_web_agents_subnet.",
    'No testnet required by design — develop locally with the IWA benchmark, then deploy directly to mainnet.',
    'Seasons contain multiple rounds; new commits during a season trigger re-evaluation. Same commit = cached.',
    'Reward formula: 85% precision + 15% speed per the official Miner docs.',
  ],
};
