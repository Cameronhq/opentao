import type { RichPlaybook } from '../playbook-rich';

// SN96 — Verathos. Verifiable LLM inference with sumcheck proofs over Merkle-committed
// weights. vLLM plugin generates GEMM proofs in parallel with single-digit % overhead.

export const sn96: RichPlaybook = {
  slug: '96-verathos',
  netuid: 96,
  name: 'Verathos',
  category: 'llm',
  categoryLabel: 'Verifiable LLM',

  blurb:
    'Verifiable LLM inference + training subnet. Miners run a vLLM-integrated proof plugin that generates sumcheck proofs over GEMM operations against Merkle-committed weights, with single-digit % overhead. Validators verify on CPU in milliseconds. Proof failure = instant score zero.',

  whatMinersDo:
    "A Verathos miner runs production vLLM with the Verathos proof plugin loaded. For each inference request, the plugin generates sumcheck proofs over the GEMM ops in parallel during CUDA graph execution. Validators perform epoch-based canary testing (~72 min cycles) and verify proofs in milliseconds on CPU. Scoring composes throughput × latency × proof correctness — any proof that fails verification zeros your score for that cycle. The training prover extends the same scheme to forward pass, backward pass, and optimizer step (AdamW / SGD / Muon) for full FT + LoRA.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node',
      count: '1',
      gpu: 'RTX 4090 / A100 / H100 (NVIDIA, 24 GB+ VRAM)',
      vramGb: 24,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'static public IP or domain · port reachable from outside',
      notes: 'README baseline is "NVIDIA GPU with 24 GB+ VRAM (RTX 4090, A100, H100, etc.)" — match GPU class to the model you serve.',
    },
  ],
  hardwareNote:
    'Proof plugin builds CUDA extensions during setup — keep CUDA toolkit + nvcc compatible with your driver. Sumcheck overhead is single-digit %, so capacity planning is roughly the same as un-proofed vLLM with a small tax.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/verathos-ai/verathos',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    "Two paths: (1) one-line installer (curl | bash) that wraps the whole setup, or (2) clone the repo and run scripts/setup_miner.sh manually for venv creation, dependency install, and CUDA extension build. Then start the miner with neurons/miner.py pointing at your public IP / domain so validators can canary-test you.",

  install: [
    { step: 'Quick install via installer script',
      cmd:  'curl -fsSL https://verathos.ai/install.sh | bash && verathos setup',
      note: 'Wraps venv, deps, CUDA extension build, and config in one flow.' },
    { step: 'OR manual install — clone repo',
      cmd:  'git clone https://github.com/verathos-ai/verathos && cd verathos' },
    { step: 'Run the manual setup script',
      cmd:  'bash scripts/setup_miner.sh',
      note: 'Builds venv, installs deps, compiles CUDA extensions for the proof plugin.' },
    { step: 'Create / fund wallet (EVM funding required for some flows)',
      cmd:  'btcli wallet new_coldkey --wallet.name miner && btcli wallet new_hotkey --wallet.name miner --wallet.hotkey default' },
    { step: 'Register hotkey on SN96',
      cmd:  'btcli subnet register --netuid 96 --wallet.name miner --wallet.hotkey default' },
  ],

  runSteps: [
    { step: 'Start miner (one-liner installer path)',
      cmd:  'verathos start' },
    { step: 'OR start manually',
      cmd:  `python -m neurons.miner \\
    --wallet miner --hotkey default \\
    --model-id auto \\
    --netuid 96 \\
    --subtensor-network finney \\
    --endpoint https://YOUR-PUBLIC-IP-OR-DOMAIN`,
      note: '--model-id auto picks an optimal model for your GPU capacity. Use PM2 for production: pm2 start --interpreter python3 --name sn96-miner -- -m neurons.miner …' },
    { step: 'Verify on metagraph',
      cmd:  'btcli subnet metagraph --netuid 96' },
  ],

  envVars: [
    { name: 'WALLET',          description: 'Coldkey name (default "miner")',                     required: true },
    { name: 'HOTKEY',          description: 'Hotkey name (default "default")',                    required: true },
    { name: 'MINER_ENDPOINT',  description: 'Your public endpoint URL (https://ip-or-domain)',    required: true },
    { name: 'SUBTENSOR_NETWORK', description: "Network — typically 'finney'",                    required: false },
  ],

  scoring: {
    summary:
      'Score = throughput × latency × proof correctness, evaluated over epoch-based canary tests (~72 min cycles). Every sumcheck proof is verified against Merkle-committed weights in milliseconds on CPU. Proof failure = instant score zero for that cycle.',
    rule: 'Serve high-throughput, low-latency vLLM with the proof plugin loaded. Any deviation from the committed weights — wrong model, drift, swap — is mathematically detectable and zeros your score.',
    cheatPath: "Returning a different model's output — Merkle weight commitments + sumcheck proofs make any deviation from the committed weights mathematically detectable. Proof tampering fails CPU verification within milliseconds.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'RTX 4090 (~$1.5-2k owned, $0.50/hr rented) is the entry GPU. A100 / H100 for larger models. Proof overhead is single-digit %, so effective hourly cost ≈ same as un-proofed vLLM.',
    notes:
      'Multi-rail commercial monetization (TAO / USDC on Base / x402) means the subnet has direct revenue surface, not just emission farming. Track real-traffic share vs. emission share carefully.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner up, first canary proof verified',  note: 'Validator canary returns "proof OK" within the first ~72-min epoch.' },
    { day: 'day 3',  target: 'Sustained proof-verified throughput',    note: 'No proof failures over 24h. Throughput stable, latency within median.' },
    { day: 'day 7',  target: 'Out of immunity, surviving',              note: 'Incentive above lowest non-immune miner. If close to floor, larger model or better GPU may help.' },
    { day: 'day 14', target: 'Steady real-traffic share',                note: 'Beyond canary, real OpenAI-compatible traffic + paid (TAO/USDC/x402) requests routing through you.' },
    { day: 'day 30', target: 'Break-even on GPU rental',                 note: 'Daily emission + commercial revenue ≥ daily GPU + endpoint cost.' },
  ],

  monitoring: [
    { metric: 'Proof verification success rate',  threshold: '100%',           where: 'Miner logs · any failure = epoch score zero' },
    { metric: 'GPU utilization under load',       threshold: '> 60%',          where: 'nvidia-smi · idle GPU = wasted opex' },
    { metric: 'Proof overhead vs. unproofed vLLM',threshold: '< 10%',          where: 'Internal profiling · plugin should keep overhead single-digit %' },
    { metric: 'Endpoint reachability',            threshold: '100%',           where: 'curl https://<your-endpoint>/health from outside' },
    { metric: 'Per-tempo incentive',              threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 96' },
  ],

  knownIssues: [
    {
      symptom: 'Proof verification fails → score 0',
      cause:   'Model weights drifted from the committed Merkle root, or proof plugin not loaded correctly into vLLM CUDA graph.',
      fix:     'Re-pin the exact model checkpoint matching the Merkle commitment. Rebuild CUDA extensions if vLLM was updated mid-flight.',
    },
    {
      symptom: 'CUDA extension build fails during setup',
      cause:   'CUDA toolkit / nvcc version mismatch with the installed PyTorch / driver combo.',
      fix:     'Pin CUDA toolkit to a version compatible with both the GPU driver and the PyTorch build. Refer to scripts/setup_miner.sh for the canonical combo.',
    },
    {
      symptom: 'Validator can\'t reach --endpoint',
      cause:   'Endpoint behind NAT, no TLS, or DNS / firewall blocking inbound from validator IPs.',
      fix:     'Expose endpoint with TLS at a public domain (Caddy / nginx reverse proxy is fine). Confirm with curl from a non-local network.',
    },
  ],

  notes: [
    'Production-grade proofs — vLLM integration with single-digit % overhead is the team\'s headline engineering claim.',
    'Training prover extends to FT + LoRA — same scheme can verify gradient + optimizer steps, not just inference.',
    'Multi-rail payment: TAO, USDC on Base, x402 pay-per-request — track commercial revenue separately from emission share.',
  ],
};
