import type { RichPlaybook } from '../playbook-rich';

// SN99 — Leoma. AI video generation subnet. Miners fine-tune a Text-Image-to-Video (TI2V)
// model, push it to Hugging Face + Chutes, commit on-chain. Validators call the deployed
// model via Chutes; winner-take-all per request on cinematic quality.

export const sn99: RichPlaybook = {
  slug: '99-leoma',
  netuid: 99,
  name: 'Leoma',
  category: 'vision',
  categoryLabel: 'AI Video',

  blurb:
    'AI video generation subnet — miners fine-tune Text-Image-to-Video (TI2V) models, push to Hugging Face, deploy to Chutes, and commit on-chain. Validators call your deployed model via Chutes to generate videos; winner-take-all per request on cinematic quality.',

  whatMinersDo:
    "A Leoma miner fine-tunes a TI2V model and uploads it to Hugging Face under a repo name starting with `leoma` and ending with their miner hotkey (SS58 address). The model revision must be a full Git commit SHA, not a branch. Then you deploy it as a Chute (via leoma CLI) and commit the deployment on-chain. Validators send prompts (text + optional image conditioning) and call your model through Chutes; the best video per prompt wins under winner-take-all weighting. Only TI2V is currently supported — T2V and I2V are on the roadmap.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node (training + deployment)',
      count: '1',
      gpu: 'A100 80GB or H100 (studio-grade TI2V)',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 128,
      diskGb: 1000,
      bandwidth: 'standard',
      notes: 'README does not pin exact GPU requirements — sized here for studio-grade TI2V training and deployment. Final inference happens on Chutes, so deployment hardware = whatever your Chute spec demands.',
    },
  ],
  hardwareNote:
    'Inference is delegated to Chutes — you choose Chute hardware when deploying. Training / fine-tuning happens off-chain on your own GPU. Note: README does not specify exact GPU requirements; this is sized from typical TI2V workload.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/RendixNetwork/leoma',
    branch: 'main',
    minerEntrypoint: 'leoma CLI',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Four-step lifecycle: (1) fine-tune a TI2V model locally; (2) upload to Hugging Face with the exact naming convention; (3) deploy as a Chute via `leoma miner push` with a Chutes API key; (4) commit the deployment on-chain via `leoma miner commit`. Validators discover your model via the on-chain commit and call it through Chutes.',

  install: [
    { step: 'Clone the miner repo',
      cmd:  'git clone https://github.com/RendixNetwork/leoma && cd leoma' },
    { step: 'Install the leoma CLI + dependencies',
      cmd:  'pip install -e .',
      note: 'Refer to repo README for exact install commands — CLI ships within the repo.' },
    { step: 'Register hotkey on SN99',
      cmd:  'btcli subnet register --netuid 99 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Fine-tune a TI2V model and upload to Hugging Face',
      note: 'Repo name MUST start with "leoma" and end with your miner hotkey SS58 address. Use a specific Git commit SHA as the revision — branch names are not accepted.' },
    { step: 'Obtain a Chutes API key + Chutes username',
      note: 'See chutes.ai — needed for the deploy step.' },
  ],

  runSteps: [
    { step: 'Deploy your model to Chutes',
      cmd:  'leoma miner push --model-name <your-hf-repo> --model-revision <full-commit-sha> --chutes-api-key <api-key> --chute-user <username>' },
    { step: 'Commit the Chute deployment on-chain',
      cmd:  'leoma miner commit --model-name <your-hf-repo> --model-revision <full-commit-sha> --chute-id <chute-id> --coldkey $WALLET --hotkey $HOTKEY' },
    { step: 'Confirm registration on metagraph',
      cmd:  'btcli subnet metagraph --netuid 99' },
  ],

  envVars: [
    { name: 'WALLET',          description: 'Coldkey name',                                    required: true },
    { name: 'HOTKEY',          description: 'Hotkey name',                                     required: true },
    { name: 'CHUTES_API_KEY',  description: 'Chutes API key for model deployment',             required: true },
    { name: 'CHUTE_USER',      description: 'Chutes username',                                 required: true },
    { name: 'HF_TOKEN',        description: 'Hugging Face token for repo upload',              required: true },
  ],

  scoring: {
    summary:
      'Winner-take-all per request. Validators publish a prompt (text + optional image conditioning + duration / resolution), call every registered miner model via Chutes, and pick the single best video on motion quality, prompt adherence, fidelity, and absence of artifacts. The winner takes the emission for that request.',
    rule: 'Be the best for SOME slice of the prompt distribution. Specialization beats general competence — one strong vertical (e.g. cinematic landscapes, character animation, fast-action) earns more than middling everywhere.',
    cheatPath: "Cached video for repeated prompts — validators use prompt randomization and block-seeded variation to prevent direct cache hits. Hotkey-bound HF repo naming + commit-SHA pinning prevent silent model swaps.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      "Two cost layers: (a) fine-tuning compute on your own GPU (A100/H100 class, $1.5-3/hr rented), (b) Chutes deployment ongoing cost for inference. Winner-take-all means heavy-tailed earnings — top miners capture disproportionate share.",
    notes:
      "AI video is one of the most capital-intensive consumer-AI categories. Track miner GPU economics carefully — losing miners on Leoma can rack up Chutes inference cost with zero emission return.",
  },

  milestones: [
    { day: 'day 1',  target: 'Hotkey registered, base TI2V model deployed', note: 'Push a starter checkpoint to Chutes and commit on-chain. Confirm validators can call your endpoint.' },
    { day: 'day 3',  target: 'First win on a prompt category',              note: 'Identify a prompt slice where your model dominates — cinematic, character, action, etc. Winner-take-all means specialization wins.' },
    { day: 'day 7',  target: 'Repeated wins in your specialization',         note: 'Consistent winner-take-all hits in your vertical. Push a refined checkpoint as a new commit SHA + re-commit.' },
    { day: 'day 14', target: 'Out of immunity, surviving',                   note: 'Incentive above lowest non-immune. If close to floor, pivot specialization or improve fine-tune.' },
    { day: 'day 30', target: 'Break-even on combined fine-tune + Chutes',    note: 'Daily emission ≥ daily Chutes inference cost + amortized fine-tune. Winner-take-all variance is high — average over weeks not days.' },
  ],

  monitoring: [
    { metric: 'Chute deployment health',         threshold: 'active',         where: 'chutes.ai dashboard · validators can\'t call a dead chute' },
    { metric: 'Win rate per specialization',     threshold: '> 1/N (N = miners)', where: 'Internal tracking + taostats win logs' },
    { metric: 'Generation latency',              threshold: 'within validator timeout', where: 'Chute response time · timeouts disqualify' },
    { metric: 'Per-tempo incentive',             threshold: 'rising or flat (lumpy with winner-take-all)', where: 'btcli subnet metagraph --netuid 99' },
  ],

  knownIssues: [
    {
      symptom: 'Validator can\'t find your model on-chain',
      cause:   'On-chain commit step skipped, or commit SHA mismatch between HF repo, push, and commit.',
      fix:     'Re-run `leoma miner commit` with the exact same --model-revision SHA used in `leoma miner push`. SHAs must match across HF / Chutes / on-chain.',
    },
    {
      symptom: 'HF repo naming rejected',
      cause:   'Repo name must start with "leoma" and end with your miner hotkey SS58. Branch names not accepted for --model-revision.',
      fix:     'Rename your HF repo: leoma-<your-finetune-tag>-<hotkey-ss58>. Always pass a full commit SHA as --model-revision.',
    },
    {
      symptom: 'Zero earnings despite working deployment',
      cause:   'Winner-take-all means you need to be best for some prompt slice. Median-quality models earn nothing.',
      fix:     'Specialize: pick a vertical (cinematic / character / action) and fine-tune hard on that distribution. Re-push as a new commit SHA.',
    },
  ],

  notes: [
    'TI2V only — T2V and I2V are on the roadmap per README.',
    'Inference is delegated to Chutes — your Chute spec drives inference cost. Match deployment hardware to expected validator query volume.',
    'README does not pin exact GPU requirements for fine-tuning — sized here from typical studio-grade TI2V workload.',
    'Winner-take-all means earnings are lumpy. Track win rate per prompt category, not per-tempo incentive.',
  ],
};
