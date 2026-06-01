import type { RichPlaybook } from '../playbook-rich';

// SN92 — TensorClaw. Decentralized LLM inference aggregator with WebSocket-tunneled
// miners (no public IP needed) and bonus multipliers for in-demand open-source models.

export const sn92: RichPlaybook = {
  slug: '92-tensorclaw',
  netuid: 92,
  name: 'TensorClaw',
  category: 'llm',
  categoryLabel: 'LLM Inference',

  blurb:
    'OpenAI-compatible LLM inference aggregator. Miners host inference endpoints behind WebSocket tunnels (WSS) to a central AICenter router — no public IP, no port forwarding. Bonus multipliers reward in-demand open-source backends (Qwen, DeepSeek).',

  whatMinersDo:
    'A TensorClaw miner runs an OpenAI-compatible inference server locally (vLLM, llama.cpp, Ollama, anything on http://localhost:8000/v1) and connects outbound via WebSocket to the AICenter router. The validator forwards real API traffic plus benchmark prompts; you stream completions back. Scoring is real-traffic-weighted: latency, output quality vs. reference, and throughput. Bonus multipliers stack for serving in-demand open models, so model choice is your main lever.',

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
      gpu: 'A100 80GB or H100 (for 70B-class models) · A6000/4090 (smaller models)',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 128,
      diskGb: 500,
      bandwidth: 'no public IP required · stable outbound 1 Gbps',
      notes: 'Sized to host whichever open-source model you choose. Qwen and DeepSeek classes get bonus multipliers.',
    },
  ],
  hardwareNote:
    'WebSocket tunnel architecture means home / NAT / firewall miners are first-class — no public IP, no port forwarding. The constraint is GPU capacity for the model you choose.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/tensorclaw/tensorclaw',
    branch: 'main',
    minerEntrypoint: 'miner.py',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Setup is two-layer: (1) bring up an OpenAI-compatible inference server locally (vLLM is the canonical choice), (2) clone the TensorClaw miner repo, edit configs/miner.env to point at your local server, and run miner.py. The miner opens a WebSocket to AICenter; no inbound networking required.',

  install: [
    { step: 'Bring up an OpenAI-compatible local model server (vLLM example)',
      cmd:  'pip install vllm && python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-7B-Instruct --port 8000',
      note: 'Alternative: Ollama or llama.cpp serving on the same port. Bonus multipliers favor Qwen / DeepSeek family.' },
    { step: 'Clone the miner repo',
      cmd:  'git clone https://github.com/tensorclaw/tensorclaw && cd tensorclaw' },
    { step: 'Create and activate Python 3.10+ venv',
      cmd:  'python3 -m venv venv && source venv/bin/activate' },
    { step: 'Install dependencies',
      cmd:  'pip install -r requirements.txt' },
    { step: 'Register hotkey on SN92',
      cmd:  'btcli subnet register --netuid 92 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Edit configs/miner.env',
      cmd:  'cp configs/miner.env.example configs/miner.env && $EDITOR configs/miner.env',
      note: 'Set MODEL_URL=http://localhost:8000/v1 · MODEL_NAME=<your-model> · WALLET_NAME · WALLET_HOTKEY.' },
  ],

  runSteps: [
    { step: 'Start the miner',
      cmd:  'python miner.py',
      note: 'Miner opens a WSS connection outbound to AICenter — no firewall changes needed.' },
    { step: 'Confirm on metagraph',
      cmd:  'btcli subnet metagraph --netuid 92',
      note: 'Find your hotkey, watch incentive after first tempo (~72 min).' },
  ],

  envVars: [
    { name: 'MODEL_URL',     description: 'Local OpenAI-compatible endpoint (e.g. http://localhost:8000/v1)', required: true },
    { name: 'MODEL_NAME',    description: 'Model identifier as exposed by your local server',                  required: true },
    { name: 'WALLET_NAME',   description: 'Coldkey name',                                                       required: true },
    { name: 'WALLET_HOTKEY', description: 'Hotkey name',                                                        required: true },
  ],

  scoring: {
    summary:
      'Validators score real API traffic (and synthetic benchmark prompts) on output quality vs. reference models, p50/p99 latency, and sustained throughput. Bonus multipliers stack for in-demand open-source models (Qwen, DeepSeek family).',
    rule: 'Process real requests with high quality. Pick a bonus-multiplied model where your GPU is competitively sized — being the best at one model beats being mediocre at three.',
    cheatPath: 'Proxying every prompt to a premium API (Anthropic / OpenAI passthrough) — bonus multipliers favor open backends and validators check output entropy / signatures to detect simple passthrough.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'A100 80GB rental ~$1.50-2.00/hr ($1.1k-1.5k/mo). H100 ~$2.50-3.50/hr. Match GPU spend to chosen model class — over-spec is dead capital.',
    notes:
      'Real-traffic share is the dominant signal — early miners benefit from low pool size before saturation. Model selection (bonus multiplier vs. GPU fit) is the main lever.',
  },

  milestones: [
    { day: 'day 1',  target: 'WebSocket connected, first scored response', note: 'AICenter logs route requests to your hotkey. Incentive > 0 after first tempo.' },
    { day: 'day 3',  target: 'Quality benchmarks above median',           note: 'Compare your latency + completion quality vs. top miners on taostats.' },
    { day: 'day 7',  target: 'Bonus multiplier active',                    note: 'Confirm you\'re serving a multiplier-eligible model (Qwen / DeepSeek class) — check protocol docs for current eligible list.' },
    { day: 'day 14', target: 'Out of immunity, surviving',                 note: 'Incentive above lowest non-immune. If close to floor, switch to a bigger or better-multiplied model.' },
    { day: 'day 30', target: 'Break-even on GPU rental',                   note: 'Daily emission ≥ daily GPU rental cost.' },
  ],

  monitoring: [
    { metric: 'Local model server p99 latency', threshold: '< 2s',          where: 'vLLM / Ollama metrics endpoint' },
    { metric: 'GPU utilization under load',     threshold: '> 50%',          where: 'nvidia-smi · long-tail idle = wasted opex' },
    { metric: 'WebSocket tunnel uptime',        threshold: '> 99.5%',        where: 'miner.py logs · look for reconnect spam' },
    { metric: 'Per-tempo incentive',            threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 92' },
  ],

  knownIssues: [
    {
      symptom: 'Miner connects but never receives requests',
      cause:   'Local OpenAI server unreachable at MODEL_URL, or MODEL_NAME mismatch with what AICenter expects.',
      fix:     'Curl your own MODEL_URL/models endpoint locally and confirm the model id matches MODEL_NAME exactly.',
    },
    {
      symptom: 'Score stays low despite serving traffic',
      cause:   'Model not on bonus-multiplier list, or completion quality below validator reference.',
      fix:     'Switch to a Qwen / DeepSeek class model with bonus multiplier. Confirm the model checkpoint matches the canonical version (not a janky finetune).',
    },
    {
      symptom: 'OOM crashes on the model server',
      cause:   'Model size exceeds VRAM with chosen context length.',
      fix:     'Either reduce --max-model-len in vLLM, switch to a smaller variant, or upgrade GPU.',
    },
  ],

  notes: [
    'WebSocket architecture means you can mine from home with no public IP — major UX win vs. typical inference subnets.',
    'OpenClaw Agents is the team\'s anchor consumer — real downstream traffic, not just synthetic benchmarks.',
    'Inference subnets compete on price and quality — verify current per-tempo emission before serious capex.',
  ],
};
