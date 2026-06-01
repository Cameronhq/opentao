import type { RichPlaybook } from '../playbook-rich';

// SN58 — Handshake58 (DRAIN Protocol)
// Active code lives at github.com/Handshake58/HS58-subnet (miner + validator)
// and Handshake58/HS58 (provider templates + docs). Miners run a provider
// node served over MCP and accept DRAIN payment-channel vouchers on Polygon.

export const sn58: RichPlaybook = {
  slug: '58-pending',
  netuid: 58,
  name: 'Handshake58',
  category: 'compute',
  categoryLabel: 'Agent Payments',

  blurb:
    'Provider node for the DRAIN payment-channel marketplace. 60% of your score is real USDC claimed from agent traffic; 40% is health-check availability.',
  whatMinersDo:
    "Operate an AI provider node that serves real agent requests over MCP and accepts DRAIN payment vouchers (EIP-712 signed, settled off-chain through Polygon payment channels). Each validator probe is a signed health check measuring response, latency, and protocol compliance. Every 7-day rolling window, validators count the USDC you actually claimed from channels — that drives 60% of your score, with the remaining 40% from availability under those probes.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Provider node',
      count: '1',
      cpuCores: 4,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'static public IP + open inbound for MCP',
      notes: 'Spec scales with the model class you serve. The DRAIN/MCP stack itself is light; the AI workload is your call.',
    },
  ],
  hardwareNote:
    "Hardware tracks whatever model class you advertise — LLM inference / retrieval / tool-use / image gen. You also need a Polygon wallet funded for opening channels (~\$0.02 per channel on Polygon) and to receive USDC claims.",

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.79, runpod: 0.69, coreweave: 0.89 },

  repo: {
    url: 'https://github.com/Handshake58/HS58-subnet',
    branch: 'main',
    extraRepos: [
      { name: 'HS58 templates', url: 'https://github.com/Handshake58/HS58', purpose: 'AI provider templates + integration docs' },
      { name: 'Handshake58 docs', url: 'https://handshake58.com/', purpose: 'Operator-facing docs' },
    ],
  },

  setupShape: 'docker-compose',
  setupOverview:
    'Install Bittensor + Bittensor CLI, register on netuid 58, then either run the miner locally via `python neurons/miner.py` or deploy under Docker with auto-update. Providers also need a Polygon wallet (DRAIN_PRIVATE_KEY) with USDC for channel ops, and an MCP-served endpoint that agents discover via the Handshake58 registry.',

  install: [
    { step: 'Install Bittensor', cmd: 'pip install bittensor bittensor-cli' },
    { step: 'Clone repo + editable install',
      cmd: 'git clone https://github.com/Handshake58/HS58-subnet.git && cd HS58-subnet && pip install -e .' },
    { step: 'Create wallets',
      cmd: 'btcli wallet new_coldkey --wallet.name hs58 && btcli wallet new_hotkey --wallet.name hs58 --wallet.hotkey default' },
    { step: 'Register hotkey',
      cmd: 'btcli subnet register --netuid 58 --wallet.name hs58 --wallet.hotkey default' },
    { step: 'Set Polygon wallet env',
      note: 'Set DRAIN_PRIVATE_KEY to a Polygon wallet you control; fund with USDC for channel operations.' },
    { step: 'Register provider endpoint',
      note: 'Point your provider to the Handshake58 registry (handshake58.com / mpp.dev) so agents discover it via MCP.' },
  ],

  runSteps: [
    { step: 'Run miner locally',
      cmd: 'python neurons/miner.py --netuid 58 --wallet.name hs58 --wallet.hotkey default' },
    { step: 'Or run via Docker (validator/provider with auto-update)',
      cmd: `docker build -t hs58-miner . && docker run -d --restart unless-stopped \\
  -e BT_HOTKEY_B64="$(base64 -w 0 < ~/.bittensor/wallets/hs58/hotkeys/default)" \\
  -e BT_COLDKEYPUB_B64="$(base64 -w 0 < ~/.bittensor/wallets/hs58/coldkeypub)" \\
  -e NEURON_TYPE=miner \\
  -e WALLET_NAME=hs58 \\
  -e HOTKEY_NAME=default \\
  -e AUTOUPDATE_ENABLED=true \\
  hs58-miner` },
    { step: 'Verify on metagraph', cmd: 'btcli subnet metagraph --netuid 58' },
  ],

  envVars: [
    { name: 'WALLET',                 description: 'Coldkey name (default in docs: hs58)',          required: true },
    { name: 'HOTKEY',                 description: 'Hotkey name (default in docs: default)',        required: true },
    { name: 'DRAIN_PRIVATE_KEY',      description: 'Polygon private key for your provider wallet (USDC claims + channel ops)', required: true },
    { name: 'PROBE_TIMEOUT_MS',       description: 'HTTP probe timeout (default 5000)',             required: false },
    { name: 'PROBES_PER_ROUND',       description: 'Providers tested per epoch (default 5)',        required: false },
    { name: 'MAX_LATENCY_DEVIATION',  description: 'Latency pass threshold in ms (default 2000)',   required: false },
    { name: 'REGISTRY_URLS',          description: 'Comma-separated registries (default handshake58.com,mpp.dev)', required: false },
    { name: 'AUTOUPDATE_ENABLED',     description: 'Auto-update Docker containers (default false)', required: false },
  ],

  scoring: {
    summary:
      '60% real USDC claimed via DRAIN over a 7-day rolling window + 40% health-check availability. Per epoch, validators compute: 0.4 × reachability match + 0.3 × status match + 0.3 × latency band (binary: pass if < 2000ms response), then apply EMA smoothing (α=0.3).',
    rule: 'Show real, agent-driven USDC claims. The 60% claim weight makes emission track economic demand directly — uptime alone is not enough.',
    cheatPath:
      "Self-paying your own node to inflate claims doesn't survive — DRAIN claims are on-chain attributable, and any pattern of self-routed traffic shows up in the claim graph validators inspect.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      "Capex tracks your model class. Subnet launched 2026-02 — emissions still small while agent traffic ramps.",
    notes:
      'The 60% claim component biases hard toward providers who already have agent demand. New entrants need to actively integrate with agent apps (drain-mcp users) to start earning.',
  },

  milestones: [
    { day: 'day 1',  target: 'Provider online + registered',     note: 'Health checks pass; MCP endpoint discoverable through handshake58.com registry.' },
    { day: 'day 3',  target: 'First DRAIN channel opened',       note: 'Some agent has opened a payment channel against your provider.' },
    { day: 'day 7',  target: 'First USDC claim from a channel',  note: 'Counts toward the 60% real-claims score component.' },
    { day: 'day 14', target: '7-day rolling claim window populated', note: "If still 0 USDC: integrate with agent apps directly; uptime alone caps your score at the 40% availability portion." },
  ],

  monitoring: [
    { metric: 'Health check pass rate',      threshold: '100%',           where: 'Validator probe logs' },
    { metric: 'Median response latency',     threshold: '< 2000 ms',      where: 'Provider logs / Handshake58 dashboard' },
    { metric: '7-day claimed USDC',          threshold: 'rising',         where: 'Polygon explorer + DRAIN claim observer' },
    { metric: 'Polygon wallet USDC balance', threshold: '> 0',            where: 'Polygon wallet UI' },
    { metric: 'Per-tempo incentive',         threshold: 'rising/flat',    where: 'btcli subnet metagraph --netuid 58' },
  ],

  knownIssues: [
    { symptom: 'Provider passes health checks but score stuck at ~40%',
      cause:   "No agent has opened a channel against you yet — the 60% claim weight is dragging score down.",
      fix:     "Integrate directly with agent apps using drain-mcp; advertise your endpoint where agent builders look (Handshake58 templates repo, MCP catalogs)." },
    { symptom: 'Channels open but no claims happen',
      cause:   'EIP-712 voucher signing or USDC claim transaction is failing.',
      fix:     'Verify DRAIN_PRIVATE_KEY corresponds to a wallet with enough Polygon gas; check Polygon block explorer for your claim transactions.' },
    { symptom: 'Validators see > 2000ms latency',
      cause:   'Provider region far from validator probe origin, or model inference latency too high.',
      fix:     "Latency is a binary pass/fail at 2000ms — host closer to validator regions, or lighten the model you serve." },
  ],

  notes: [
    'Two repos under Handshake58 org: HS58-subnet (miner + validator code), HS58 (provider templates + integration docs). Both are required reading.',
    'Subnet supports all provider types: DRAIN, MPP (x402), and any HTTP service. A `402 Payment Required` response from a payment-gated endpoint also counts as valid.',
    'CI validates on Python 3.9, 3.10, 3.11 — keep your runtime within that window for clean upgrades.',
  ],
};
