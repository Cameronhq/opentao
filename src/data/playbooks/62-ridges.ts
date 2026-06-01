import type { RichPlaybook } from '../playbook-rich';

// SN62 — Ridges (formerly Agentao). Tournament of autonomous SWE agents on SWE-bench.
// Miners install via `pip install -e ".[miner]"` or `uv sync --extra miner`, write an
// `agent_main(input) -> str` agent that returns a unified diff. Local iteration via
// `ridges miner run-local`. Validator wraps SWE-bench scoring in a sandbox.

export const sn62: RichPlaybook = {
  slug: '62-ridges',
  netuid: 62,
  name: 'Ridges',
  category: 'reason',
  categoryLabel: 'Reasoning · Coding',

  blurb:
    'Open tournament for autonomous SWE agents. Miners ship an `agent_main` Python file that takes a repo + failing test and returns a unified-diff patch; validators grade against SWE-bench Verified.',
  whatMinersDo:
    "A Ridges miner is a Python agent file with a single `agent_main(input) -> str` entrypoint that returns a unified diff patch. Validators pull SWE-bench tasks (repo + failing test), run your agent in a sandbox, apply the patch, and run the test. Pass = score, weighted by task difficulty. The Ridges CLI handles local iteration and submission.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Agent dev host',
      count: '1',
      gpu: '1× GPU (optional; many miners use API-only providers)',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 200,
      bandwidth: 'stable broadband',
      notes: 'Hardware floor is not pinned in the README — miners who run inference against OpenRouter/Chutes/Targon can mine from a small VPS. Heavier when self-hosting models for the agent.',
    },
  ],
  hardwareNote:
    "Compute cost lives in the LLM API call, not the box. Most top miners route inference through OpenRouter/Chutes/Targon and spend more on tokens than on the host.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.59, runpod: 0.49, coreweave: 0.79 },

  repo: {
    url: 'https://github.com/ridgesai/ridges',
    branch: 'main',
    minerEntrypoint: 'agent.py (agent_main)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is a Python CLI (`ridges`). Install with the `[miner]` extra, run `ridges miner setup` to scaffold a workspace, write your `agent.py` with `agent_main(input) -> str`, then iterate locally with `ridges miner run-local`. Submission is a separate CLI step once your agent passes local SWE-bench tasks.',

  install: [
    { step: 'Clone the repo (for examples + harness)',
      cmd:  'git clone https://github.com/ridgesai/ridges && cd ridges' },
    { step: 'Install with miner extras',
      cmd:  'pip install -e ".[miner]"',
      note: 'or `uv sync --extra miner` if you prefer uv.' },
    { step: 'Scaffold miner workspace + .env',
      cmd:  'ridges miner setup' },
    { step: 'Add provider credentials to <workspace>/.env.miner',
      note: 'Use miners/env.miner.example as template. Set RIDGES_OPENROUTER_API_KEY / RIDGES_TARGON_API_KEY / RIDGES_CHUTES_API_KEY as needed.' },
    { step: 'Register hotkey on SN62',
      cmd:  'btcli subnet register --netuid 62 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Iterate locally on a single task',
      cmd:  'ridges miner run-local' },
    { step: 'Or run against a specific task with non-interactive flags',
      cmd:  'ridges miner run-local --task-path /path/to/task.tar.gz --agent-path agent.py --provider openrouter --non-interactive' },
    { step: 'Submit (see CLI help for upload)',
      cmd:  'ridges miner --help',
      note: 'Submission flow is gated by an OpenRouter management key separate from the runtime API key.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
    { name: 'RIDGES_OPENROUTER_API_KEY',  description: 'OpenRouter API key (default provider)',          required: false },
    { name: 'RIDGES_OPENROUTER_BASE_URL', description: 'OpenRouter base URL override',                   required: false },
    { name: 'RIDGES_TARGON_API_KEY',      description: 'Targon API key (alternate provider)',            required: false },
    { name: 'RIDGES_TARGON_BASE_URL',     description: 'Targon base URL override',                       required: false },
    { name: 'RIDGES_CHUTES_API_KEY',      description: 'Chutes API key (alternate provider)',            required: false },
  ],

  scoring: {
    summary:
      "Validator pulls a SWE-bench Verified task, hands it to your agent in a sandbox, applies the returned diff, runs the failing test. Pass = score weighted by task difficulty; fail = zero. No partial credit. Top miners have pushed past 80% pass rate.",
    rule: 'Return a diff that turns the failing test green without breaking the rest of the suite.',
    sourcePath: 'ridgesai/ridges · validator/src/main.py + execution/',
    cheatPath:
      "Memorizing public SWE-bench hashes — validators randomize sampling and verify on held-out splits. Local runs are explicitly not validator-equivalent execution, so don't tune to the local harness alone.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Inference cost (OpenRouter/Chutes/Targon tokens) is the dominant variable cost. Top miners watch the cost-per-pass closely; emission must exceed token spend to break even.',
  },

  milestones: [
    { day: 'day 1', target: 'Local `ridges miner run-local` passes ≥ 1 task', note: 'Agent file syntactically valid, provider credentials work.' },
    { day: 'day 3', target: 'Submitted, validator runs your agent on mainnet', note: 'Confirm on btcli metagraph that incentive is non-zero.' },
    { day: 'day 14', target: 'SWE-bench pass rate > 50%',                      note: 'Top miners are at 80%+ — keep iterating the scaffold, not just the prompt.' },
    { day: 'day 30', target: 'Token spend < emission',                         note: 'Track cost/pass: free-tier providers, smarter retrieval, cheaper models.' },
  ],

  monitoring: [
    { metric: 'Local SWE-bench pass rate',  threshold: '> 50%',           where: 'ridges miner run-local output' },
    { metric: 'Token spend per task',       threshold: '< emission/task', where: 'provider dashboard (OpenRouter/Chutes/Targon)' },
    { metric: 'Per-tempo incentive',        threshold: 'rising',          where: 'btcli subnet metagraph --netuid 62' },
  ],

  knownIssues: [
    {
      symptom: 'Local passes but on-chain score is zero',
      cause:   'Local runs are explicitly not validator-equivalent. Sandbox differences in network/env/timeouts.',
      fix:     'Read docs/sandbox.md; instrument your agent to handle the validator-side sandbox properly.',
    },
    {
      symptom: 'Token spend > emission',
      cause:   'Agent calls too many tokens per task or uses expensive Claude/GPT-4 for everything.',
      fix:     'Cache file reads, plan before reading, prefer mid-tier models. Top miners often run Claude Sonnet / Qwen Coder over Opus/GPT-4.',
    },
    {
      symptom: 'Pre-commit hooks block install',
      cause:   'Repo enforces ruff linting; `uv run pre-commit install` failed.',
      fix:     '`uv sync --extra dev` then `uv run pre-commit install` again.',
    },
  ],

  notes: [
    'Ridges hit 73.6% on SWE-bench Verified within ~4 months of launch; top miners now exceed 80%.',
    'Downstream product (vibe-coding subscription, ~$29/mo) wraps the winning miner agents — emissions subsidize the talent producing them.',
    'Partnership with Latent Holdings (btcli, Bittensor SDK) announced Jan 2026.',
  ],
};
