import type { RichPlaybook } from '../playbook-rich';

// SN67 — Harnyx. Deep-research API. Anonymous operator.
// Repo: github.com/harnyx/harnyx. Miner ships a single Python `agent.py` file
// (≤1 MB) implementing an async `query(query) -> Response` entrypoint. Local
// iteration via `harnyx-miner-dev`, eval via `harnyx-miner-local-eval`, submit
// via `harnyx-miner-submit --wallet-name --hotkey-name`.

export const sn67: RichPlaybook = {
  slug: '67-harnyx',
  netuid: 67,
  name: 'Harnyx',
  category: 'reason',
  categoryLabel: 'Reasoning · Research',

  blurb:
    'Deep-research API for AI agents. Miners ship a single Python `agent.py` (≤1 MB) implementing an async `query` entrypoint that returns text + citations; validators score on quality × citation faithfulness.',
  whatMinersDo:
    "A Harnyx miner is a single UTF-8 Python file (≤1 MB) with an async `@entrypoint('query') async def query(query: Query) -> Response` function. The validator sends research questions, the agent calls bundled tools (`search_web`, `search_ai`, `fetch_page`, `llm_chat`, `tooling_info`) under a tight budget, and returns a synthesized answer with claim-level citations. Scoring is a pairwise judge comparison run twice with reversed ordering.",

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
      notes: 'No formal min-compute pinned by the README. Compute lives in the LLM/search API calls, not on your box.',
    },
  ],
  hardwareNote:
    "Inference is routed through bundled tools — the agent itself runs cheaply. Most miners host on a small VPS and budget for tokens (Chutes / OpenRouter) instead.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.15 },

  repo: {
    url: 'https://github.com/harnyx/harnyx',
    branch: 'main',
    minerEntrypoint: 'agent.py (query)',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is a uv-managed monorepo (`miner/`, `packages/miner-sdk/`). Install deps, set the platform + Chutes env vars, write `agent.py` with the async `query` entrypoint, iterate locally with `harnyx-miner-dev`, run local eval with `harnyx-miner-local-eval`, then submit with `harnyx-miner-submit`.',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/harnyx/harnyx && cd harnyx' },
    { step: 'Install all packages + dev deps via uv',
      cmd:  'uv sync --all-packages --dev' },
    { step: 'Set Chutes + platform env vars',
      note: 'CHUTES_API_KEY (evaluation scoring), PLATFORM_BASE_URL, BENCHMARK_LLM_MODEL. Optional: OPENROUTER_API_KEY, DESEARCH_API_KEY, SEARCH_PROVIDER.' },
    { step: 'Register hotkey on SN67',
      cmd:  'btcli subnet register --netuid 67 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Iterate against the dev harness',
      cmd:  'uv run --package harnyx-miner harnyx-miner-dev --agent-path ./agent.py' },
    { step: 'Run a local evaluation pass',
      cmd:  'uv run --package harnyx-miner harnyx-miner-local-eval --agent-path ./agent.py' },
    { step: 'Submit to the live subnet',
      cmd:  'uv run --package harnyx-miner harnyx-miner-submit --agent-path ./agent.py --wallet-name $WALLET --hotkey-name $HOTKEY' },
  ],

  envVars: [
    { name: 'WALLET',              description: 'Coldkey name (passed to harnyx-miner-submit)',  required: true },
    { name: 'HOTKEY',              description: 'Hotkey name (passed to harnyx-miner-submit)',   required: true },
    { name: 'CHUTES_API_KEY',      description: 'Chutes API key used for evaluation scoring',     required: true },
    { name: 'PLATFORM_BASE_URL',   description: 'Harnyx platform base URL',                       required: true },
    { name: 'BENCHMARK_LLM_MODEL', description: 'Model used for local benchmark grading',         required: true },
    { name: 'OPENROUTER_API_KEY',  description: 'OpenRouter API key for the agent (optional)',    required: false },
    { name: 'DESEARCH_API_KEY',    description: 'Search provider key (optional)',                 required: false },
    { name: 'SEARCH_PROVIDER',     description: 'Search backend selection',                       required: false },
  ],

  scoring: {
    summary:
      "Validator sends a research query with a held-back reference answer. Miner's response is graded on a pairwise judge comparison run twice with reversed ordering; total_score = comparison_score. Tiebreaker: lower tool cost wins. Champion miners are selected by margin over current top, not raw batch score.",
    rule: 'Return a correct answer with every claim backed by a real, retrievable citation, under a tight tool budget.',
    cheatPath:
      "Fabricating citations that look real but don't exist — validator-side fetching catches broken or off-topic sources. Exceeding the 80 000-character response cap or 200-citation cap auto-fails.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      'Miner emission is currently capped at 0% by default; the remaining allocation goes to owner uid=0. Treat live emission as zero until that cap moves.',
  },

  milestones: [
    { day: 'day 1', target: 'Local `harnyx-miner-dev` answers a sample query', note: 'agent.py loads; tools wired up; response under 80k chars.' },
    { day: 'day 3', target: 'Local eval pairwise score > random',              note: 'harnyx-miner-local-eval shows comparison_score above 0.5 vs reference.' },
    { day: 'day 7', target: 'Submission lands; on-chain miner UID active',     note: 'Once emission cap lifts, weak agents start being culled.' },
  ],

  monitoring: [
    { metric: 'Citation reachability',  threshold: '100% (no broken links)',  where: 'agent logs / validator fetch results' },
    { metric: 'Tool cost per response', threshold: 'minimize (tiebreaker)',   where: 'harnyx-miner-local-eval output' },
    { metric: 'Response size',          threshold: '< 80 000 chars',          where: 'agent output' },
    { metric: 'Per-tempo incentive',    threshold: 'event-driven (cap is 0%)', where: 'btcli subnet metagraph --netuid 67' },
  ],

  knownIssues: [
    {
      symptom: 'agent.py rejected at submission',
      cause:   'File exceeds 1 MB, or not valid UTF-8 Python.',
      fix:     'Strip vendored deps from agent.py; use the SDK tools rather than bundling libraries.',
    },
    {
      symptom: 'Score zero or near-zero',
      cause:   "Confident answer without citations — pairwise judge penalizes hallucinations heavily.",
      fix:     'Cite every non-trivial claim; if a source is unavailable, prefer a shorter cited answer over a long uncited one.',
    },
    {
      symptom: 'Citation links 404 at validator-side fetch',
      cause:   "Agent fabricated URLs or used short-lived session links.",
      fix:     'Only emit citations the agent has actually fetched in this turn; never construct URLs.',
    },
  ],

  notes: [
    'Operator is anonymous — no founders, advisors, or fundraise disclosed.',
    'SN67 previously hosted a different project (Tenex / Tenexium) that ended in exit allegations; Harnyx is unrelated and now occupies the slot.',
  ],
};
