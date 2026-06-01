import type { RichPlaybook } from '../playbook-rich';

// SN78 — Vocence. Voice AI marketplace. Miners deploy a locked-signature
// miner.py inference module behind a Chutes (SN64) endpoint exposing /speak.

export const sn78: RichPlaybook = {
  slug: '78-vocence',
  netuid: 78,
  name: 'Vocence',
  category: 'audio',
  categoryLabel: 'Audio',

  blurb:
    'Voice-AI tournament. Miners deploy TTS / voice models behind a Chutes (SN64) /speak endpoint; validators send PromptTTS descriptor + content prompts, score audio on descriptor adherence × quality × content fidelity.',

  whatMinersDo:
    "A Vocence miner does not run a persistent daemon. The deployment unit is a Hugging Face repo + a Chutes-hosted endpoint. Locally, you write a `miner.py` matching the locked signature (`Miner(path_hf_repo: Path)` with `warmup()` and `generate_wav(instruction: str, text: str) -> tuple[np.ndarray, int]`), package supporting config (`chute_config.yml`, `vocence_config.yaml`), and push to a Hugging Face revision. The Chutes template (`chute_template/vocence_chute.py.jinja2`) is rendered with your repo, revision, Chutes username, and chute name, then built and deployed via `chutes build … --local` + `chutes deploy … --accept-fee`. The deployed endpoint serves GET /health and POST /speak; validators call /speak with descriptor + text, score the returned WAV.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node (via Chutes)',
      count: '1',
      gpu: 'Single mid-range to high-tier GPU per chute_config.yml',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: 'Chutes default',
      notes: 'Hardware is provisioned by Chutes (SN64) at deploy time. Specifics are configured in chute_config.yml; tune VRAM/dependencies/scaling there. Voice models run a wide range — small TTS fits in 8 GB VRAM; large multimodal voice needs more.',
    },
  ],
  hardwareNote: 'You do not host the GPU yourself — Chutes does. Cost shows up as the `--accept-fee` you pay at deploy time and per-second inference billing.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.80, runpod: 0.70, coreweave: 1.00 },
  rentalNote: 'Effective hourly cost is whatever Chutes charges for your selected GPU class; rental table is indicative for self-hosted equivalents.',

  repo: {
    url: 'https://github.com/vocence-78/vocence',
    branch: 'master',
    minerEntrypoint: 'miner.py (locked canonical inference script; see miner_sample/MINER_GUIDE.md)',
  },

  setupShape: 'docker-compose',
  setupOverview:
    'Author `miner.py` matching the locked signature, package with `chute_config.yml` + `vocence_config.yaml`, push to a Hugging Face repo, take the 40-char commit SHA as VOCENCE_REVISION, render the canonical chute template, then `chutes build` + `chutes deploy` to put the /speak endpoint live. Vocence calls /speak from its validators on the descriptor + text it issues.',

  install: [
    { step: 'Install uv (Vocence CLI runtime)',
      cmd: 'curl -LsSf https://astral.sh/uv/install.sh | sh' },
    { step: 'Clone repo + sample',
      cmd: 'git clone https://github.com/vocence-78/vocence.git && cd vocence' },
    { step: 'Read miner_sample/MINER_GUIDE.md',
      note: 'Locked Miner class signature. Required methods: `warmup()` and `generate_wav(instruction, text) -> (np.ndarray, sample_rate)`.' },
    { step: 'Write miner.py + chute_config.yml + vocence_config.yaml',
      note: 'Filenames are not free — `miner.py` is the canonical entry. Wrong filename = automatic rejection.' },
    { step: 'Push model + code to a Hugging Face repo',
      note: 'Note the 40-character commit SHA — this is your VOCENCE_REVISION. Branch names are NOT accepted.' },
    { step: 'Install Chutes CLI',
      cmd: 'pip install chutes-cli',
      note: 'Required to build/deploy onto SN64.' },
    { step: 'Register on subnet',
      cmd: 'btcli subnet register --netuid 78 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Contact Vocence team for owner API endpoint',
      note: 'Currently validators are gated — miner-side deployment is open via Chutes, but coordination with the team is required for full validator pickup during early phase.' },
  ],

  runSteps: [
    { step: 'Render the canonical chute template',
      note: 'Render `chute_template/vocence_chute.py.jinja2` with VOCENCE_REPO, VOCENCE_REVISION, VOCENCE_CHUTES_USER, VOCENCE_CHUTE_ID (must contain "vocence").' },
    { step: 'Build the chute locally',
      cmd: 'chutes build <your_module>:chute --local' },
    { step: 'Deploy to SN64',
      cmd: 'chutes deploy <your_module>:chute --accept-fee' },
    { step: 'Verify endpoint health',
      cmd: 'curl https://<your-chute-url>/health',
      note: 'Should return status + repo id + revision + model state + sample rate.' },
    { step: 'Smoke-test /speak',
      cmd: `curl -X POST https://<your-chute-url>/speak \\
  -H "Content-Type: application/json" \\
  -d '{"instruction": "calm middle-aged female narrator", "text": "Hello world."}' \\
  --output sample.wav` },
  ],

  envVars: [
    { name: 'WALLET',              description: 'Coldkey name',                                                            required: true },
    { name: 'HOTKEY',              description: 'Hotkey name',                                                             required: true },
    { name: 'VOCENCE_REPO',        description: 'Hugging Face repo id holding miner.py + weights',                         required: true },
    { name: 'VOCENCE_REVISION',    description: '40-character HF commit SHA (branch names not accepted)',                  required: true },
    { name: 'VOCENCE_CHUTES_USER', description: 'Your Chutes username (SN64)',                                             required: true },
    { name: 'VOCENCE_CHUTE_ID',    description: 'Chute name (must contain "vocence")',                                     required: true },
  ],

  scoring: {
    summary:
      'Validators issue PromptTTS prompts (descriptor: gender/tone/emotion/pitch/speed/age/accent + content text) to every registered miner. Each returned WAV is scored on three axes: descriptor adherence (does the audio match the requested voice traits), audio quality (clarity / naturalness), and content fidelity (spoken text matches requested text). Scores are reconciled across validator buckets via global consensus — a miner must win on most validators, not just one.',
    rule: 'descriptor_adherence × audio_quality × content_fidelity, consensus-reconciled.',
    sourcePath: 'vocence-78/vocence · miner_sample/MINER_GUIDE.md + scoring pipeline',
    cheatPath:
      'Caching responses to repeated descriptors, hard-coding common content, or proxying to a closed third-party API (ElevenLabs, OpenAI Voice). Counters: descriptor randomization, content variation, pipeline-level audio analysis. Residual surface is sophisticated API-proxying that still passes descriptor scoring — but consensus across validators makes that expensive.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'No upfront GPU capex — pay Chutes per inference + the deploy fee. Reasonable per-hour cost depends on the GPU class you target in chute_config.yml.',
  },

  milestones: [
    { day: 'day 1',  target: 'Chute live, /health green',     note: 'GET /health returns sample rate + repo id + revision.' },
    { day: 'day 3',  target: 'First validator score recorded',note: 'Vocence team granted validators Chutes access; your /speak endpoint is being called.' },
    { day: 'day 7',  target: 'Out of immunity / incentive > 0', note: 'Tune voice model for descriptor adherence — top miners score on prompt control, not just naturalness.' },
    { day: 'day 30', target: 'Consistent top-quartile across descriptors', note: 'Broaden voice variety (accents, ages, emotions) to win across the full prompt distribution.' },
  ],

  monitoring: [
    { metric: '/health endpoint',           threshold: '200 OK',           where: 'curl https://<chute>/health' },
    { metric: '/speak latency',             threshold: '< real-time × 2',  where: 'Validator logs / Chutes dashboard' },
    { metric: 'Chute deploy state',         threshold: 'running',          where: '`chutes ls` / Chutes dashboard' },
    { metric: 'Per-tempo incentive',        threshold: 'rising or flat',   where: 'btcli subnet metagraph --netuid 78' },
  ],

  knownIssues: [
    {
      symptom: 'Chute rejected at deploy',
      cause:   'Wrong miner.py filename, missing required methods, undersized model weights, or wrong VOCENCE_REVISION format.',
      fix:     'Match the locked signature exactly. Use the 40-character commit SHA — branch names are rejected. Confirm warmup() + generate_wav() exist with the documented types.',
    },
    {
      symptom: 'Validators not calling /speak',
      cause:   'Vocence team has not granted Chutes access to active validators; or your endpoint is unreachable.',
      fix:     'Contact the Vocence team via the issue tracker / Discord. Confirm /health is publicly reachable.',
    },
    {
      symptom: 'Low descriptor adherence score',
      cause:   'Model is good at natural speech but ignores voice trait prompts.',
      fix:     'Train on descriptor-conditioned datasets; consider prompt-conditioned TTS architectures (PromptTTS-style).',
    },
    {
      symptom: 'High deploy fees burning cash',
      cause:   'Overspec\'d GPU in chute_config.yml.',
      fix:     'Pick the lowest GPU tier that still hits the latency requirement. PromptTTS-class models often fit on smaller GPUs than instinct suggests.',
    },
  ],

  notes: [
    'miner.py is locked — wrong filename or missing methods means automatic rejection at deploy time.',
    'VOCENCE_REVISION is a 40-char HF commit SHA. Branches are not accepted.',
    'Validator onboarding is currently gated (contact team). Miner-side deployment via Chutes is open.',
    'Roadmap: PromptTTS today; STT, STS, cloning, and multimodal voice over time.',
  ],
};
