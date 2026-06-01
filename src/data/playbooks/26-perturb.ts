import type { RichPlaybook } from '../playbook-rich';

// SN26 — Perturb. Source: github.com/0xsigurd/Perturb README (2026-06).
// Note: SN26 previously hosted "Image Alchemy" and at one point appeared as
// "Storb" in third-party trackers. The current public miner repo is
// 0xsigurd/Perturb — an adversarial-image subnet (PGD-style attacks).

export const sn26: RichPlaybook = {
  slug: '26-perturb',
  netuid: 26,
  name: 'Perturb',
  category: 'vision',
  categoryLabel: 'Adversarial vision · PGD attacks',

  blurb:
    'Adversarial-image subnet. Validators pull Pexels images, classify with EfficientNetV2-M, semantically verify via a local Ollama LLM, then send challenges to miners. Miners run PGD-style attacks under bounded L∞ distortion and return a perturbed image; the validator scores reward by how effectively the perturbation flips the classifier within the allowed delta.',

  whatMinersDo:
    "A miner runs the baseline neuron (`neurons/miner.py`) which receives an `AttackChallenge` synapse over Axon — containing the source image + true label. The miner runs a baseline PGD (Projected Gradient Descent) attack to perturb the image under bounded L∞ distortion constraints (PERTURB_MIN_LINF_DELTA / PERTURB_MAX_LINF_DELTA) and returns only `perturbed_image_b64`. The validator handles all authoritative verification — running EfficientNetV2-M on the perturbed image and scoring whether the attack flipped the classification within the bounded distortion budget.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Miner GPU node',
      count: '1',
      gpu: 'NVIDIA GPU with 8+ GB VRAM (recommended)',
      vramGb: 8,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: '20+ Mbps (minimum)',
      notes: 'Per the Perturb README: miner minimum 4 vCPU / 16 GB RAM / 50 GB SSD / 20+ Mbps; recommended 8 vCPU / 32 GB RAM / 8+ GB VRAM / 100+ GB SSD. The PGD attack is fast on modest GPUs — this is not an H100 subnet.',
    },
  ],
  hardwareNote:
    'Validator side is heavier: 8+ vCPU, 32+ GB RAM, NVIDIA GPU with 12+ GB VRAM minimum (24+ recommended), 100+ GB SSD. Validator also runs a local Ollama LLM endpoint (qwen2.5:1.5b-instruct by default) for semantic verification of pulled images.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.40, runpod: 0.34, coreweave: 0.50 },

  repo: {
    url: 'https://github.com/0xsigurd/Perturb',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
    extraRepos: [
      { name: 'Run scripts', url: 'https://github.com/0xsigurd/Perturb/tree/main/scripts', purpose: 'setup_common.sh / run_miner.sh / run_validator.sh / run_llm_endpoint.sh' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Two scripts do the heavy lifting: `setup_common.sh miner` creates the .venv and installs Python + Bittensor deps; `run_miner.sh` starts the miner with the env file. No PM2 or Ollama needed on the miner side — those are validator-side only (validators also use PM2 + Ollama for the local llm_endpoint).',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/0xsigurd/Perturb && cd Perturb' },
    { step: 'Install miner-side common deps',
      cmd:  'bash ./scripts/setup_common.sh miner',
      note: 'Creates .venv and installs Python / Bittensor dependencies only (miner does NOT need PM2 or Ollama).' },
    { step: 'Copy and fill miner env',
      cmd:  'cp scripts/miner.env.example scripts/miner.env',
      note: 'Set WALLET_NAME, WALLET_HOTKEY, NETUID, NETWORK. Optional: PYTHON_BIN, LOG_LEVEL (DEBUG default), MINER_EXTRA_ARGS.' },
    { step: 'Register hotkey on SN26',
      cmd:  'btcli subnet register --netuid 26 --wallet.name $WALLET_NAME --wallet.hotkey $WALLET_HOTKEY' },
    { step: '(Optional) Improve over the baseline PGD attack',
      note: 'README explicitly notes "Baseline miner is intentionally simple; competitive miners should optimize attack logic."' },
  ],

  runSteps: [
    { step: 'Start the miner',
      cmd:  'bash ./scripts/run_miner.sh' },
    { step: 'Confirm axon is serving',
      note: 'Expected logs: `Serving miner axon...` and `Miner started. Waiting for validator queries.`' },
    { step: 'Verify on metagraph',
      cmd:  'btcli subnet metagraph --netuid 26' },
  ],

  envVars: [
    { name: 'WALLET_NAME',   description: 'Coldkey name (matches btcli wallet list)', required: true },
    { name: 'WALLET_HOTKEY', description: 'Hotkey name on that coldkey',               required: true },
    { name: 'NETUID',        description: 'Subnet uid (26 for mainnet)',                required: true },
    { name: 'NETWORK',       description: 'Bittensor network (finney for mainnet)',     required: true },
    { name: 'PYTHON_BIN',    description: 'Override Python binary path (optional)',     required: false },
    { name: 'LOG_LEVEL',     description: 'DEBUG / INFO / WARNING / ERROR (default DEBUG)', required: false },
    { name: 'MINER_EXTRA_ARGS', description: 'Extra args passed to the miner runner',   required: false },
  ],

  scoring: {
    summary:
      'Validator workflow: pull image from Pexels (PERTURB_IMAGE_ENDPOINT) → classify with EfficientNetV2-M → verify semantic match between model label and prompt via local Ollama llm_endpoint → broadcast AttackChallenge with the EfficientNet label as `true_label` → score miner-returned perturbed images. Scoring rewards effective attacks within the bounded L∞ distortion budget (PERTURB_MIN_LINF_DELTA to PERTURB_MAX_LINF_DELTA).',
    rule: 'Flip the EfficientNetV2-M classification using the smallest L∞ distortion within the allowed bounds. Baseline PGD is the floor — competitive miners optimize attack strength + minimality.',
    sourcePath: '0xsigurd/Perturb · neurons/validator.py + perturbnet/constants.py (PROMPTS)',
    cheatPath:
      "Returning the unperturbed image → fails the attack (classification doesn't flip), scores zero. Exceeding PERTURB_MAX_LINF_DELTA → out of bounds, rejected. Returning random noise → exceeds the delta cap before flipping the classifier, also rejected. Verification is LLM-only on the validator side — but that runs on the validator's pull side, not on the miner's response, so spoofing the prompt-image semantic check is not a miner attack surface.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Low capex — an 8 GB VRAM GPU is enough for PGD on EfficientNetV2-M-sized inputs. The competitive edge is attack quality: minimum-norm L∞ attacks (sparse, well-targeted) outperform straight PGD at the validator scoring tilt. The first fork in the wild (1rainguy/Perturb) advertises "sparse minimum-norm Linf attack" — suggesting the meta is already moving past vanilla PGD.',
  },

  milestones: [
    { day: 'day 1',  target: 'Baseline miner serving axon',
      note: 'After setup_common.sh + run_miner.sh, the miner should log `Serving miner axon...` and accept incoming AttackChallenge synapses.' },
    { day: 'day 3',  target: 'First successful attack scored',
      note: 'Perturbed image flips EfficientNet classification within bounds — confirms the PGD path works.' },
    { day: 'day 7',  target: 'Above-baseline attack logic',
      note: 'README explicitly invites custom attack optimization; sparse minimum-norm L∞ attacks beat vanilla PGD at the score tilt.' },
    { day: 'day 14', target: 'Consistent rank above PERTURB_MIN_PROCESSED_COUNT floor',
      note: 'The validator filters by minimum processed count + min/max linf delta; consistent in-bounds attacks compound on the rolling history.' },
  ],

  monitoring: [
    { metric: 'Attack success rate (flip / within delta)', threshold: '> 50%',  where: 'Miner logs · per-challenge response' },
    { metric: 'Average L∞ distortion used',                  threshold: 'near MIN_LINF_DELTA', where: 'Local attack output stats' },
    { metric: 'Axon availability',                           threshold: '> 99%', where: 'Miner logs / validator probe responses' },
    { metric: 'Hotkey incentive',                            threshold: 'rising or flat', where: 'btcli subnet metagraph --netuid 26' },
  ],

  knownIssues: [
    {
      symptom: '`npm: command not found` during setup',
      cause:   'Node.js / npm not installed — required for PM2 (validator-side only, but setup_common.sh checks it).',
      fix:     'Install Node.js (macOS: `brew install node`, Ubuntu: `sudo apt-get install -y nodejs npm`), then rerun the setup script. On miner-side this only affects optional PM2 usage.',
    },
    {
      symptom: 'Attack flips classification but score still 0',
      cause:   'L∞ distortion exceeded PERTURB_MAX_LINF_DELTA, so the attack is rejected as out-of-bounds.',
      fix:     'Clip the perturbation harder — use a smaller step size or terminate the PGD loop earlier once the classifier flips.',
    },
    {
      symptom: 'Validator never sends a challenge',
      cause:   'Hotkey not registered, or the validator\'s Pexels API key is rate-limited and falls back to assets/dog_1.jpg (label `dog`).',
      fix:     'Confirm registration on the metagraph. Validator-side issue if Pexels is down — the fallback prompt is `dog`, which still produces valid challenges.',
    },
    {
      symptom: 'Verification of true_label fails on validator',
      cause:   'Validator-side: Ollama llm_endpoint is down → challenge verification fails before broadcast.',
      fix:     'Validator operators only: ensure `perturb-ollama` PM2 process is running and PERTURB_LLM_ENDPOINT_URL is reachable from validator host.',
    },
  ],

  notes: [
    'Subnet 26 was previously "Image Alchemy" and at one point appeared as "Storb" on third-party trackers — the current operator surface is the 0xsigurd/Perturb repo described above.',
    'Validator-side verification is LLM-only by design: if the local Ollama llm_endpoint is down, challenges are not broadcast. Miners are not affected directly but may see lower challenge throughput.',
    'Baseline miner uses straight PGD; competitive miners optimize the attack (sparse / minimum-norm L∞). See 1rainguy/Perturb fork for an example direction.',
    'PROMPTS are defined in `perturbnet/constants.py` — the validator samples prompts and queries Pexels for matching images.',
  ],
};
