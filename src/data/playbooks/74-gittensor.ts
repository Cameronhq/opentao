import type { RichPlaybook } from '../playbook-rich';

// SN74 — Gittensor. Operated by Entrius (anderdc + LandynDev).
// Pays TAO for merged PRs to whitelisted OSS repos. Miner registers a GitHub
// fine-grained PAT with validators; reward triggers only on upstream merge.

export const sn74: RichPlaybook = {
  slug: '74-gittensor',
  netuid: 74,
  name: 'Gittensor',
  category: 'data',
  categoryLabel: 'OSS Rewards',

  blurb:
    'Pays open-source developers in TAO for merged PRs to whitelisted repos. Miners register a fine-grained GitHub PAT with validators via the `gitt miner` CLI; reward triggers only on upstream merge.',

  whatMinersDo:
    "A Gittensor miner is a real developer. The on-host process is light — run `gitt miner post` to register your GitHub PAT with the active validator set, then `gitt miner check` to verify each validator is healthy and has your PAT. From that point, the validators independently poll GitHub for your account's merged PRs against whitelisted repos and score them by code quality × repo weight × language factor. There is no long-running miner daemon — the work is the code you actually commit.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Developer machine',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'Standard residential',
      notes: 'Whatever a developer needs to actually write code. No GPU. No always-on server requirement.',
    },
  ],
  hardwareNote: 'There is no miner daemon to keep alive. The "work" is upstream-merged PRs; the on-host commands are one-shot registrations.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.05, coreweave: 0.08 },

  repo: {
    url: 'https://github.com/entrius/gittensor',
    branch: 'test',
    minerEntrypoint: 'gitt miner (CLI installed via `uv sync`)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Clone the repo, `uv sync` to install the `gitt` CLI, generate a fine-grained GitHub PAT, export it as GITTENSOR_MINER_PAT, register on netuid 74, then `gitt miner post` to register the PAT with validators. After that, write PRs against whitelisted repos; rewards arrive when they merge upstream.',

  install: [
    { step: 'Install uv (if not present)',
      cmd: 'curl -LsSf https://astral.sh/uv/install.sh | sh' },
    { step: 'Clone repo',
      cmd: 'git clone https://github.com/entrius/gittensor.git && cd gittensor' },
    { step: 'Sync dependencies',
      cmd: 'uv sync',
      note: 'Default branch is `test`. Switch with `git checkout <branch>` if the team has cut a stable tag.' },
    { step: 'Create a fine-grained GitHub PAT',
      note: 'GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens. Scope: read access to your contributions. Bind to your real account.' },
    { step: 'Export PAT',
      cmd: 'export GITTENSOR_MINER_PAT=ghp_your_token_here' },
    { step: 'Register on subnet',
      cmd: 'btcli subnet register --netuid 74 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Register PAT with validators',
      cmd: 'gitt miner post --wallet $WALLET --hotkey $HOTKEY' },
    { step: 'Verify validator coverage',
      cmd: 'gitt miner check --wallet $WALLET --hotkey $HOTKEY',
      note: 'Run after `post` and any time you suspect a validator is unhealthy. Validators that did not receive your PAT will not score your PRs.' },
    { step: 'Now: write merged PRs',
      note: 'Pick whitelisted repos with high weight; produce real, mergeable, well-reviewed PRs. There is no on-host loop.' },
  ],

  envVars: [
    { name: 'WALLET',               description: 'Coldkey name',                                                  required: true },
    { name: 'HOTKEY',               description: 'Hotkey name',                                                   required: true },
    { name: 'GITTENSOR_MINER_PAT',  description: 'Fine-grained GitHub PAT bound to the GitHub account you commit from', required: true },
  ],

  scoring: {
    summary:
      'Only merged PRs count. Once a PR is merged upstream, validators score it by code-quality heuristics, repository weight (set by the validator-curated whitelist), and a programming language factor. Bigger / harder PRs in higher-weight repos earn more.',
    rule: 'merged_pr × code_quality × repo_weight × language_factor (validator-published).',
    sourcePath: 'entrius/gittensor · docs/ (scoring code open-sourced in the project repo)',
    cheatPath:
      "Spam PRs, AI-generated low-effort PRs, or maintainer collusion on small repos. The intended counters are PAT-binding (you cannot anonymise authorship), code-quality scoring, and whitelist curation. The residual surface is small repos with a single friendly maintainer — top miners avoid those because the score is also dampened by repo weight.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes: 'Revenue depends entirely on your real code output and the weights validators assign to your target repos. There is no fixed daily floor.',
  },

  milestones: [
    { day: 'day 1',  target: 'PAT registered with all validators', note: '`gitt miner check` shows green across the active validator set.' },
    { day: 'day 7',  target: 'First merged PR scored',             note: 'Validators have polled GitHub, seen a merged PR on a whitelisted repo, and assigned weight.' },
    { day: 'day 30', target: 'Recurring weekly merges',            note: 'Pick 2–3 repos with high weight and sustained merge cadence (Bittensor core, popular ML infra, etc.).' },
  ],

  monitoring: [
    { metric: 'Validator coverage',  threshold: '100%',            where: '`gitt miner check`' },
    { metric: 'Merged PR throughput',threshold: '> 0 / week',      where: 'GitHub profile / `gh search prs --author $GH_USER --merged`' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat',  where: 'btcli subnet metagraph --netuid 74' },
  ],

  knownIssues: [
    {
      symptom: 'No emission despite merged PRs',
      cause:   'PAT not registered with active validators, or whitelist does not include the target repo.',
      fix:     'Re-run `gitt miner post`; check the active whitelist before targeting a repo.',
    },
    {
      symptom: '`gitt miner check` shows some validators missing',
      cause:   'Validators rotate or are temporarily down; PAT distribution missed them.',
      fix:     'Re-run `gitt miner post` periodically (e.g. weekly). Watch the Discord for validator rotation announcements.',
    },
    {
      symptom: 'Scoring lower than expected on a big PR',
      cause:   'Code-quality heuristic flagged style issues; language factor lower for the language used; or repo weight is small.',
      fix:     'Target high-weight repos and write idiomatic, well-tested code that passes upstream review without churn.',
    },
  ],

  notes: [
    'Default branch is `test` — confirm against the README before pinning a commit.',
    'Full docs at docs.gittensor.io (was 403 at time of writing; check the repo README for fallback).',
    'There is no always-on miner process. Capex is essentially zero; opex is your developer time.',
  ],
};
