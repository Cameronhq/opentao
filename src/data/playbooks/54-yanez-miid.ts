import type { RichPlaybook } from '../playbook-rich';

// SN54 — Yanez MIID
// Adversarial identity generation: KAV (name/DOB/address variations) + face
// image variations. Default LLM backend is Ollama / llama3.1. Standard
// Bittensor neuron pattern under PM2.

export const sn54: RichPlaybook = {
  slug: '54-yanez-miid',
  netuid: 54,
  name: 'Yanez MIID',
  category: 'data',
  categoryLabel: 'Synthetic Identity',

  blurb:
    'Generate adversarial synthetic identities (name variations + face transformations) to red-team KYC/AML/sanctions screening engines.',
  whatMinersDo:
    "Receive mixed identity challenges from validators — KAV (name / DOB / address variation) tasks and face-image variation tasks seeded from validator-provided images. Run generative models (default is Ollama with llama3.1) to produce candidate adversarial identities meeting the task spec. Validators run candidates through reference compliance engines and score on bypass rate × realism × uniqueness.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner node',
      count: '1',
      gpu: 'optional 1× consumer/datacenter GPU for image variation tasks',
      vramGb: 12,
      cpuCores: 8,
      ramGb: 16,
      diskGb: 100,
      bandwidth: 'port 8091 open inbound',
      notes: 'Ollama hosts the default LLM (llama3.1). RAM ≥ 16GB recommended. Face-variation phase benefits from a GPU.',
    },
  ],
  hardwareNote:
    'Phase 4 (face / deepfake variations) added Q1 2026 — that phase wants a GPU. KAV-only operation is fine on a CPU-only box with enough RAM for llama3.1.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.79, runpod: 0.69, coreweave: 0.89 },

  repo: {
    url: 'https://github.com/yanez-compliance/MIID-subnet',
    branch: 'main',
    extraRepos: [
      { name: 'miner.md', url: 'https://github.com/yanez-compliance/MIID-subnet/blob/main/docs/miner.md', purpose: 'Mining guide' },
      { name: 'network_setup.md', url: 'https://github.com/yanez-compliance/MIID-subnet/blob/main/docs/network_setup.md', purpose: 'Port-forward + firewall reference' },
      { name: 'dashboard', url: 'https://tao-ui-dashboard.yanez.ai/', purpose: 'Leaderboard + monitoring' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Run the bundled miner setup script, which creates a venv, installs deps, and pulls llama3.1 via Ollama. Then `pm2 start` with your wallet flags. Port 8091 must be reachable for validator-to-miner traffic.',

  install: [
    { step: 'Clone repo', cmd: 'git clone https://github.com/yanez-compliance/MIID-subnet.git && cd MIID-subnet' },
    { step: 'Run miner installer', cmd: 'bash scripts/miner/setup.sh' },
    { step: 'Activate venv', cmd: 'source miner_env/bin/activate' },
    { step: 'Confirm Ollama + llama3.1', cmd: 'ollama list', note: 'Default LLM is llama3.1. Pull if not present: `ollama pull llama3.1`.' },
    { step: 'Open port 8091', cmd: 'sudo ufw allow 8091/tcp', note: 'Also open in cloud provider firewall.' },
    { step: 'Register hotkey', cmd: 'btcli subnet register --netuid 54 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start miner under pm2',
      cmd: 'pm2 start python --name neuron-miner -- neurons/miner.py --netuid 54 --wallet.name $WALLET --wallet.hotkey $HOTKEY --subtensor.network finney' },
    { step: 'Tail logs', cmd: 'pm2 logs neuron-miner' },
    { step: 'Verify on dashboard', note: 'https://tao-ui-dashboard.yanez.ai/ — confirm your UID is in the leaderboard.' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name',                  required: true },
    { name: 'HOTKEY',  description: 'Hotkey name',                   required: true },
    { name: 'NETUID',  description: 'Always 54 for mainnet',         required: true },
  ],

  scoring: {
    summary:
      'Generated identities are run through reference KYC/AML/sanctions engines. Bypass (engine fails to flag a synthetic variant of a sanctioned name) counts — but realism graders penalise garbage outputs and uniqueness scoring kills mass-produced near-duplicates. Combined accuracy + authenticity-of-attack.',
    rule: 'Bypass rate against reference compliance engines + realism + uniqueness, scored per challenge family (phonetic, orthographic, transliteration, homoglyph, biometric perturbation).',
    cheatPath:
      "Submitting random gibberish that fuzzes filters doesn't survive — realism graders catch outputs no human would actually use. Submitting the same successful pattern repeatedly fails uniqueness scoring.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex-light unless you scale Phase 4 face-variation; a single mid-tier GPU is enough for that.',
    notes:
      'Yanez has committed to recycling a portion of commercial revenue back into the subnet — emissions are tied to real B2B compliance demand.',
  },

  milestones: [
    { day: 'day 1',  target: 'Miner up + Ollama healthy',          note: 'pm2 shows neuron-miner running; ollama list shows llama3.1.' },
    { day: 'day 3',  target: 'First validator challenges scored',  note: 'Watch yanez dashboard for your UID + bypass rate.' },
    { day: 'day 7',  target: 'Above-floor incentive',              note: 'If at floor: suspect format mismatch on outputs or repeated patterns flagged by uniqueness scoring.' },
    { day: 'day 14', target: 'Phase-specific variations live',     note: 'Phase 4 adds face variation — wire up an image model if not yet.' },
  ],

  monitoring: [
    { metric: 'Port 8091 reachability',     threshold: 'reachable',           where: 'curl from outside the network' },
    { metric: 'Bypass rate',                threshold: 'above network median', where: 'tao-ui-dashboard.yanez.ai' },
    { metric: 'Realism score',              threshold: 'above floor',         where: 'tao-ui-dashboard.yanez.ai' },
    { metric: 'Per-tempo incentive',        threshold: 'rising/flat',         where: 'btcli subnet metagraph --netuid 54' },
  ],

  knownIssues: [
    { symptom: 'Ollama out-of-memory loading llama3.1',
      cause:   'System RAM < 16GB.',
      fix:     'Bump host to ≥ 16GB RAM, or swap in a smaller model in the miner config.' },
    { symptom: 'Validator cannot reach miner',
      cause:   'Port 8091 closed at OS firewall or cloud provider ingress.',
      fix:     '`sudo ufw allow 8091/tcp` and open the port in the cloud console. See docs/network_setup.md.' },
    { symptom: 'High submission rate but score stuck',
      cause:   'Outputs failing realism graders (gibberish) or uniqueness check (duplicates).',
      fix:     'Diversify variation strategies across phonetic / orthographic / transliteration / homoglyph; review what realism gives you a high partial score.' },
  ],

  notes: [
    'Default LLM is llama3.1 served via Ollama — you can swap in stronger or instruction-tuned models if your host has the VRAM.',
    'Phase roadmap: Phase 4 (Q1 2026) adds face / deepfake variations; future phases add documents, digital presence, voice, 3D avatars.',
    'Dashboard at tao-ui-dashboard.yanez.ai is the primary monitoring surface.',
  ],
};
