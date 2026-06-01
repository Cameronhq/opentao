import type { RichPlaybook } from '../playbook-rich';

// SN6 — Numinous (Numinous Labs). Forecasting agents.
// Miner writes a Python agent (agent_main signature), uploads via numi CLI.
// Agents run in validator sandboxes through a gateway; modest miner-side hardware.

export const sn6: RichPlaybook = {
  slug: '6-numinous',
  netuid: 6,
  name: 'Numinous',
  category: 'reason',
  categoryLabel: 'Forecasting agents',

  blurb:
    'Author a Python forecasting agent (agent_main signature), upload it via the numi CLI, and let validators run it inside a sandboxed gateway against real-world events. Brier-scored over rolling 100 resolved events.',

  whatMinersDo:
    "A Numinous miner writes a Python function `agent_main(event_data) -> {event_id, prediction}` that returns a calibrated probability in [0, 1] for each event. The agent runs inside a validator-side Docker sandbox through a controlled gateway that grants access to Chutes (compute), Desearch (search), OpenAI / OpenRouter / Perplexity (LLMs), and signal feeds (LunarCrush, Unusual Whales, Vericore, Numinous Signals). Validators score predictions against resolved outcomes using Brier-style metrics over each miner's last 100 events, winner-takes-all over the rolling window.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Developer machine (offline iteration)',
      count: '1',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 50,
      bandwidth: 'standard internet',
      notes: 'Agents run inside the validator sandbox, not on miner hardware. Miner-side resources are only for development, backtesting, and uploading.',
    },
  ],
  hardwareNote:
    "Compute scaling here is via gateway-paid services (Chutes for inference, Desearch for live data, OpenAI/OpenRouter for LLM calls) — not via miner-owned GPUs. Pay for better tool access, not bigger hardware. Sandbox times out at 240s per event.",

  rentalOk: true,
  rentalNote: 'Anywhere with Python 3.11+ works. The constraint is tool API access (paid third-party services), not host GPUs.',
  rentalUsdPerHr: { lambda: 0.05, runpod: 0.04, coreweave: 0.06 },

  repo: {
    url: 'https://github.com/numinouslabs/numinous',
    branch: 'main',
    minerEntrypoint: 'numi CLI (numi upload-agent) — agent code is your own Python file with agent_main()',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Install the numi CLI from the numinous repo, configure your gateway with linked third-party service keys (Chutes, OpenAI, Desearch, etc.), write a Python agent file implementing the agent_main contract, test locally, then upload. Agents go live at the next 00:00 UTC and can only be updated once per 3 days.",

  install: [
    { step: 'Install Python 3.11+ and clone the repo', cmd: 'git clone https://github.com/numinouslabs/numinous.git && cd numinous && pip install -e .' },
    { step: 'Verify numi CLI installed', cmd: 'numi --version' },
    { step: 'Register hotkey on SN6', cmd: 'btcli subnet register --netuid 6 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Link your third-party service API keys', cmd: 'numi services link [provider]', note: 'Run once per provider: Chutes, OpenAI, Desearch, Perplexity, LunarCrush, Unusual Whales, Vericore, OpenRouter, Numinous Signals. Costs are per-call against your own accounts.' },
    { step: 'Configure the gateway', cmd: 'numi gateway configure' },
    { step: 'Write your agent file', note: 'Implement def agent_main(event_data: Dict[str, Any]) -> Dict[str, Any] returning {"event_id": str, "prediction": float}.' },
  ],

  runSteps: [
    { step: 'Start the gateway locally', cmd: 'numi gateway start' },
    { step: 'Test the agent locally', cmd: 'numi test-agent', note: 'Run against historical events before going live — sandbox time limit is 240s per event.' },
    { step: 'Upload the agent to the network', cmd: 'numi upload-agent', note: 'Activates at next 00:00 UTC. After that, you can re-upload at most once every 3 days.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
    { name: 'SANDBOX_PROXY_URL', description: 'Gateway proxy endpoint exposed inside the sandbox (provided by validator)', required: true },
    { name: 'RUN_ID', description: 'Validator-provided execution identifier (passed in at runtime)', required: true },
  ],

  scoring: {
    summary:
      "Brier-score-style accuracy over each miner's last 100 resolved events, winner-takes-all over the rolling window. Confidently-wrong predictions are penalised more than uncertain ones, so well-calibrated agents outperform overconfident ones.",
    rule: 'Hold the top rolling-100 Brier score to capture the bulk of emissions. Variance smooths out across 100 events, so single lucky calls do not dominate.',
    cheatPath:
      'Agents run inside Docker sandboxes through a controlled gateway — they cannot call outside data sources that would let them pre-resolve events. Events are pulled from public prediction-market and partner feeds with known resolution dates, so ground truth cannot be fabricated. Brier penalises confidently-wrong predictions, so always predicting the popular outcome backfires.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex is engineering time on the agent plus running cost of paid tool APIs (LLM tokens, search calls, signal feeds). Compute is essentially free since the sandbox runs on validator infra.',
    notes:
      "Winner-takes-all is brutal. You need a meaningful Brier edge over the field — not just 'better than random'. Crunch integration brought 11,000 ML engineers into the pipeline, so the competition is real.",
  },

  milestones: [
    { day: 'day 1', target: 'Agent uploaded, activated at next 00:00 UTC', note: 'numi upload-agent succeeds, UID assigned on metagraph. Agent only goes live at the next 00:00 UTC tick.' },
    { day: 'day 3', target: 'First batch of resolved events scored', note: "Agents are evaluated against the previous events' resolutions. Inspect numi logs and gateway dashboards." },
    { day: 'day 7', target: 'Rolling-100 window has meaningful sample', note: 'Some signal on whether your Brier is above the median agent.' },
    { day: 'day 30', target: 'Above the median, surviving immunity drop', note: 'Winner-takes-all structure means median doesn’t earn much — you need top-decile to materially pay.' },
  ],

  monitoring: [
    { metric: 'Agent execution success rate', threshold: '> 95% (no sandbox timeouts)', where: 'Gateway / numi logs · 240s timeout is the cliff' },
    { metric: 'Brier score over rolling 100', threshold: 'top quartile', where: "Numinous leaderboard / validator status feeds" },
    { metric: 'Third-party API spend', threshold: 'within your per-day budget', where: 'Service dashboards (Chutes, OpenAI, etc.) — sandbox enforces per-service cost limits' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 6' },
  ],

  knownIssues: [
    { symptom: 'Agent times out (240s sandbox limit)', cause: 'Too many tool calls or expensive LLM calls in a single agent_main invocation.', fix: 'Cache aggressively, use cheaper models for cheap signal, parallelise tool calls. Set hard per-call timeouts inside the agent.' },
    { symptom: 'Score stuck at zero despite uploads', cause: 'Agent returns wrong schema or fails import inside sandbox.', fix: 'numi test-agent locally with the exact sandbox environment. Confirm return is {"event_id": str, "prediction": float 0.0–1.0}.' },
    { symptom: 'Re-upload rejected', cause: '3-day cooldown between updates.', fix: 'Wait. Test more aggressively offline before uploading.' },
    { symptom: 'Agent runs but never reaches API providers', cause: '`numi services link` not completed for that provider, or provider quota exhausted.', fix: 'Re-run `numi services link [provider]`. Check provider dashboards for rate limits.' },
  ],

  notes: [
    'Const (Opentensor founder) reportedly holds ~16% of the team / token allocation.',
    'Crunch integration routes 11,000 ML engineers into the agent-building flow — expect tough competition.',
    "Sandbox blocks arbitrary outbound — all third-party access is gated through SANDBOX_PROXY_URL.",
  ],
};
