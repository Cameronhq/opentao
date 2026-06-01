import type { RichPlaybook } from '../playbook-rich';

// SN14 — Cacheon. LLM inference-optimisation tournament against a baseline (Qwen).
// Mechanism is documented (Docker container + TTFT / TPS benchmarking) but no
// public github miner repo is currently surfaced under cacheon.ai (May 2026 relaunch).
// Honest stub — operational details verified against the public Cacheon thesis.

export const sn14: RichPlaybook = {
  slug: '14-cacheon',
  netuid: 14,
  name: 'Cacheon',
  category: 'llm',
  categoryLabel: 'LLM inference',

  blurb:
    "Submit a Docker container running an optimised LLM inference server for a baseline model (Qwen). Validators benchmark every container under identical compute and rank by time-to-first-token and tokens-per-second. Public miner repo not currently surfaced at verification time.",

  whatMinersDo:
    "A Cacheon miner builds a Docker container running an optimised inference server (Python, Rust, or sglang-based) for a baseline LLM (Qwen at launch). Validators pull every miner's container under identical compute conditions, verify output correctness against the baseline model on a benchmark prompt set, then rank passing containers by time-to-first-token (TTFT) and tokens-per-second (TPS). The miner edge is engineering on the serving stack — quantisation, kernel choice, batching, KV-cache strategy, prompt-prefix caching.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node (LLM serving)',
      count: '1',
      gpu: 'A6000 / A100 / H100-class (competitive serving)',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 128,
      diskGb: 500,
      bandwidth: 'public IP · standard',
      notes: 'Cacheon explicitly rewards making each unit of GPU produce more tokens/sec — so the question is efficiency at a given class, not raw size. A6000 / A100 / H100 are all viable depending on the baseline model.',
    },
  ],
  hardwareNote:
    "Compute scaling matters but does not substitute for serving-stack engineering. Validators run every container under identical compute, so the win is in software (kernels, batching, KV cache) more than in hardware tier.",

  rentalOk: true,
  rentalNote: 'Rented A100/H100 from RunPod/Lambda/CoreWeave work. No GraVal-style attestation requirement on this subnet.',
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://cacheon.ai/',
    branch: 'main',
    minerEntrypoint: 'NOT PUBLICLY SURFACED at verification time — confirm via cacheon.ai docs or operator Discord before building.',
  },

  setupShape: 'docker-compose',
  setupOverview:
    "Cacheon relaunched on SN14 in May 2026. A public miner repository link is not currently surfaced on cacheon.ai or in obvious GitHub locations at this verification time. The mechanism is well-defined — Docker container running an inference server, benchmarked on TTFT + TPS — but exact install/run commands should be pulled from the official Cacheon docs and operator channels before you proceed. This page is an honest stub until the public repo is confirmed.",

  install: [
    { step: 'Confirm current miner repo via cacheon.ai', note: 'No public GitHub repo surfaced under the project name at verification. Check cacheon.ai docs page and the project Discord / X account before installing anything.' },
    { step: 'Install bittensor-cli + create wallet', cmd: 'pip install bittensor-cli && btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Register on SN14', cmd: 'btcli subnet register --netuid 14 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Build your Docker container', note: 'Follow upstream Dockerfile template once published. Container must serve the baseline model (Qwen at launch) and respond to validator probe traffic.' },
  ],

  runSteps: [
    { step: 'Push your image and run it on the registered hotkey', note: 'Exact run command depends on the upstream miner repo. The container exposes an inference endpoint that validators benchmark on TTFT + TPS under identical compute.' },
    { step: 'Verify on the metagraph', cmd: 'btcli subnet metagraph --netuid 14' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
  ],

  scoring: {
    summary:
      'Two-stage. Stage 1: outputs must match the baseline model within tolerance (numerical noise from kernel choice is fine; substantively different generations fail). Stage 2: surviving containers ranked by time-to-first-token (TTFT) and tokens-per-second (TPS) on the validator-chosen prompt set.',
    rule: 'Pass correctness gate first. Then maximise TTFT + TPS on identical benchmark prompts.',
    cheatPath:
      'Returning wrong outputs fails the correctness gate — speed without quality is worthless. Validators select prompts on the fly and run every container under identical compute, ruling out cherry-picked benchmarks. Aggressive quantisation that drops accuracy below tolerance also fails the gate.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'A single H100 box is $1,500–$3,000/mo rented or $20k+ to own. Serving-stack engineering decides whether that GPU pays — winners get 2–5× more tokens/sec out of the same hardware than median miners.',
  },

  milestones: [
    { day: 'day 1', target: 'Container built, hotkey registered', note: 'Once the upstream miner repo is public, follow its build instructions exactly. Verify UID on metagraph.' },
    { day: 'day 3', target: 'Passing correctness gate', note: 'If outputs diverge from baseline, your quantisation or kernel choice is too aggressive. Tighten tolerance.' },
    { day: 'day 7', target: 'Within top quartile by TTFT + TPS', note: 'Open Docker images are forkable — pull leaderboard winners and propose improvements.' },
    { day: 'day 14', target: 'Out of immunity, stable rank', note: 'Iterate on prompt-prefix caching, KV-cache strategy, batching policy.' },
  ],

  monitoring: [
    { metric: 'Correctness vs baseline', threshold: '100% within tolerance', where: 'Validator probe responses · failed gate = zero emission' },
    { metric: 'TTFT (time-to-first-token)', threshold: 'top quartile', where: 'Cacheon leaderboard / validator logs' },
    { metric: 'TPS (tokens-per-second)', threshold: 'top quartile', where: 'Cacheon leaderboard / validator logs' },
    { metric: 'Per-tempo incentive', threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 14' },
  ],

  knownIssues: [
    { symptom: 'Container fails correctness gate', cause: 'Quantisation too aggressive or wrong model variant.', fix: 'Use the canonical baseline (Qwen weights at the exact revision spec) and back off quantisation until outputs match within tolerance.' },
    { symptom: 'Passing correctness but low TPS', cause: 'Default vLLM settings or missing kernels.', fix: 'Tune batching, enable paged attention, profile bottleneck kernels with nsys / nvprof.' },
    { symptom: 'Validators cannot pull image', cause: 'Image pushed to private registry or image tag mismatched on-chain commitment.', fix: 'Push to a public registry (Docker Hub, GHCR) with anonymous read; double-check the tag committed on-chain.' },
  ],

  notes: [
    "Slot history: TAOHash → KDN-1 (Tiger Alpha) → Cacheon (relaunch May 2026).",
    'Cacheon team identity beyond the operator handle is thin at verification time — treat operator info as a stub.',
    "Public miner repo URL not currently surfaced under cacheon.ai (verification 2026-06-01). Re-verify before sending any operator to this page.",
  ],
};
