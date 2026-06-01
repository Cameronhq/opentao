import type { RichPlaybook } from '../playbook-rich';

// SN66 — ninja. King-of-the-hill coding-agent eval harness by unarbos + unconst.
// Repo: github.com/unarbos/tau. Miner writes a private `agent.py` with a
// `solve(repo_path, issue, model, api_base, api_key)` function and submits via
// `tau private-submit`. Validator runs the agent in a Docker sandbox against
// fresh real-bug tasks; LLM-judged diff comparison decides round wins.

export const sn66: RichPlaybook = {
  slug: '66-ninja',
  netuid: 66,
  name: 'ninja',
  category: 'reason',
  categoryLabel: 'Reasoning · Coding',

  blurb:
    'King-of-the-hill tournament for open-source coding agents. Miners submit a private `agent.py` that takes a repo + failing test and returns a patch; the validator runs every agent in a Docker sandbox against fresh real-bug tasks.',
  whatMinersDo:
    "A ninja miner writes a private Python file containing a single `solve(repo_path, issue, model, api_base, api_key)` function that returns a dict with `patch`, `logs`, `steps`, `cost`, `success`. The agent is submitted via `tau private-submit` with a hotkey signature. Validators run agents in a Docker sandbox (default 2 GB / 2 CPUs) against tasks generated from fresh GitHub commits, and an LLM judge (Claude Sonnet 4.6, temp 0) compares diffs round-by-round.",

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
      cpuCores: 4,
      ramGb: 16,
      diskGb: 100,
      bandwidth: 'stable broadband',
      notes: 'No formal min-compute pinned. Default docker-solver limits are `--docker-solver-memory 2g --docker-solver-cpus 2`. The miner does no inference locally — the solver makes provider API calls.',
    },
  ],
  hardwareNote:
    'Compute lives in the LLM API call to OpenRouter / Cursor, not on your box. You can mine ninja from a small VPS — the costly variable is token spend.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.15 },

  repo: {
    url: 'https://github.com/unarbos/tau',
    branch: 'main',
    minerEntrypoint: 'agent.py (solve)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is a uv-managed Python project. Clone the repo, install in editable mode, create a `.env` with provider keys, write your private `agent.py`, then submit via `tau private-submit` with a signed hotkey payload. The subnet is in bootstrapping phase (100% burn at time of writing) while the harness is hardened.',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/unarbos/tau && cd tau' },
    { step: 'Create + activate a venv, install editable',
      cmd:  'python3.11 -m venv .venv && source .venv/bin/activate && uv pip install -e .',
      note: 'Requires Python 3.11+, uv, Docker.' },
    { step: 'Create tau/.env with provider keys',
      note: 'GITHUB_TOKEN, OPENROUTER_API_KEY, CURSOR_API_KEY (Cursor is telemetry-only; not for scoring).' },
    { step: 'Register hotkey on SN66',
      cmd:  'btcli subnet register --netuid 66 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Write your private agent.py with the solve() entrypoint',
      note: "def solve(repo_path, issue, model, api_base, api_key) -> dict — return {patch, logs, steps, cost, success}." },
    { step: 'Test the agent locally against the eval harness',
      cmd:  'tau --help',
      note: 'See `run_validate.sh` / `start_submissions_api.sh` for the validator-equivalent harness.' },
    { step: 'Submit privately to the king-of-the-hill ladder',
      cmd:  'tau private-submit --hotkey <miner-hotkey> --agent /path/to/submitted-agent.py --base-agent /path/to/current-public-agent.py --signature <hotkey-signature>',
      note: 'Signature payload format: `tau-private-submission-v1:<hotkey>:<submission-id>:<sha256-of-agent.py>`.' },
  ],

  envVars: [
    { name: 'WALLET',              description: 'Coldkey name',                                   required: true },
    { name: 'HOTKEY',              description: 'Hotkey name',                                    required: true },
    { name: 'GITHUB_TOKEN',        description: 'GitHub PAT used by the solver to clone repos',   required: true },
    { name: 'OPENROUTER_API_KEY',  description: 'OpenRouter API key — default inference provider',required: true },
    { name: 'CURSOR_API_KEY',      description: 'Cursor API key — telemetry only, not scoring',   required: false },
  ],

  scoring: {
    summary:
      'King-of-the-hill: challenger must win more rounds than current king plus a margin (default 3). Each round, validator runs both agents in a Docker sandbox against a fresh real-bug task; an LLM judge (anthropic/claude-sonnet-4.6, temp 0) compares diffs.',
    rule: "Beat the current king on a margin of N rounds with cleaner diffs that pass the failing test.",
    cheatPath:
      "Submissions are auto-rejected if they: change the solve() contract, hardcode credentials, override api_base/api_key/model, set sampling params (temperature/top_p/seed), add direct network calls bypassing the validator proxy, or fail pyflakes/compile.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Subnet is in bootstrapping phase with 100% burn while the harness is hardened. Treat emission as zero today; the play is to land a strong agent early.',
  },

  milestones: [
    { day: 'day 1', target: 'tau installed; local agent.py passes `tau --help` sanity', note: 'Docker present; provider keys present.' },
    { day: 'day 3', target: 'First valid private submission accepted',                  note: 'Signature payload formatted correctly; submission not auto-rejected.' },
    { day: 'day 14', target: 'Agent wins at least one round vs current king',           note: 'Iterate solve() scaffold and model selection.' },
  ],

  monitoring: [
    { metric: 'Submission acceptance rate', threshold: '> 0',           where: 'tau submission API logs' },
    { metric: 'Round win rate vs king',     threshold: '> 50%',         where: 'subnet leaderboard' },
    { metric: 'Token spend per round',      threshold: '< emission',    where: 'OpenRouter dashboard' },
    { metric: 'Per-tempo incentive',        threshold: 'rising or N/A while burn active', where: 'btcli subnet metagraph --netuid 66' },
  ],

  knownIssues: [
    {
      symptom: 'Submission auto-rejected',
      cause:   "solve() contract changed, or credentials/sampling params hardcoded, or direct network calls bypass the validator proxy.",
      fix:     'Read the public agent.py contract carefully; do not change the signature, do not set temperature/top_p/seed, route all I/O through the provided api_base/api_key/model.',
    },
    {
      symptom: 'Signature rejected',
      cause:   "Wrong payload format for the hotkey signature.",
      fix:     "Use exactly `tau-private-submission-v1:<hotkey>:<submission-id>:<sha256-of-agent.py>` and sign with the registered hotkey.",
    },
    {
      symptom: '100% miner burn — emission zero',
      cause:   'Subnet in bootstrapping phase; burn deliberately set high while harness is hardened.',
      fix:     'Wait for harness graduation. Use the time to iterate the agent against the local harness.',
    },
  ],

  notes: [
    'Run by unarbos (prev. Distil / SN97) and unconst (long-time Bittensor builder).',
    'Repo created March 2026; rapid early commit activity, 100% miner burn while harness is hardened.',
    'Differentiator vs Ridges (SN62): agent-agnostic harness; same task can be replayed against any agent backend.',
  ],
};
