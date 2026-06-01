import type { RichPlaybook } from '../playbook-rich';

// SN24 — Quasar. Source: github.com/SILX-LABS/QUASAR-SUBNET README (2026-06).
// This is a model-submission subnet, not a per-tempo inference subnet.

export const sn24: RichPlaybook = {
  slug: '24-quasar',
  netuid: 24,
  name: 'Quasar',
  category: 'llm',
  categoryLabel: 'Small-model competition · long-context',

  blurb:
    'SILX Labs\' competitive small-model subnet. Miners train Quasar-compatible LLMs, publish them as public Hugging Face repos, and commit the pinned revision on-chain. Validators score with paired-KL duels + a composite evaluator (math/code/reasoning/long-context/robustness/conversational quality); the king holds 1.0 weight, everyone else 0.0.',

  whatMinersDo:
    "A miner trains an LLM on the Quasar base interface (vocab_size=248320, Quasar tokenizer, Quasar custom code, public safetensors, no quantization), uploads it to a public Hugging Face repo, then commits the pinned revision on-chain via `miner/miner.py`. The validator runs `check_model.py` style pre-checks (architecture, tokenizer, safetensors integrity, dup-hash detection, quantization rejection), then evaluates the model on a block-seeded prompt set covering math, code, reasoning, instruction following, tool use, long context, and robustness. King-of-the-hill: only the strongest valid model under composite + paired-KL wins; that hotkey gets 1.0 weight, everyone else 0.0.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Training node (miner-side, off-chain)',
      count: '1',
      gpu: 'H100 80GB (recommended) or comparable',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 128,
      diskGb: 500,
      bandwidth: 'standard',
      notes: 'README says "Training infrastructure of your choice" — there is no enforced miner-side hardware. The model needs to be a public HF safetensors checkpoint. Plan capex around your own training budget for a Quasar 3B-total / ~1B-active MoE.',
    },
  ],
  hardwareNote:
    'The on-chain miner process is light (publishing a commitment); the heavy lift is the training cluster you bring. The README\'s explicit hardware requirements are on the validator side (GPU capacity for the current evaluator). Validators may use a local vLLM backend (.venv-vllm) or remote Lium evaluation backend.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/SILX-LABS/QUASAR-SUBNET',
    branch: 'main',
    minerEntrypoint: 'miner/miner.py',
    extraRepos: [
      { name: 'Base checkpoint',  url: 'https://huggingface.co/silx-ai/Quasar-3B-A1B-Preview', purpose: 'Canonical Quasar config.json + custom code files' },
      { name: 'Launch teacher',   url: 'https://huggingface.co/Qwen/Qwen3.5-4B',                purpose: 'Teacher for distribution-match (teacher-support KL)' },
      { name: 'VALIDATOR.md',     url: 'https://github.com/SILX-LABS/QUASAR-SUBNET/blob/main/VALIDATOR.md', purpose: 'Validator rollout doc + 2026-05-18 local-state reset' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Miner side: train a Quasar-compatible model, publish it on Hugging Face, run check_model.py and test_miner.py locally, then submit a dry-run with miner.py, then submit live. Validator side: two-venv pattern (`.venv` for validator deps, `.venv-vllm` for vLLM); local-GPU validators run `scripts/run_validator.sh` after setting QUASAR_* env in `~/.secrets/quasar.env`.',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/SILX-LABS/QUASAR-SUBNET.git && cd QUASAR-SUBNET' },
    { step: 'Install miner deps',
      cmd:  'python -m pip install -r requirements-miner.txt' },
    { step: 'Train / fine-tune a Quasar-compatible model',
      note: 'Use the canonical config.json from silx-ai/Quasar-3B-A1B-Preview. Must keep vocab_size=248320, stay within the subnet parameter cap, ship safetensors + Quasar custom code, no quantized formats (no GPTQ/AWQ/GGUF/FP8).' },
    { step: 'Publish to Hugging Face as public repo with pinned revision',
      note: 'Repo must remain public and unchanged after the committed revision.' },
    { step: 'Local pre-flight checks',
      cmd:  'python miner/check_model.py --model-repo your-username/your-model && python miner/test_miner.py --model-repo your-username/your-model' },
    { step: 'Register hotkey on SN24',
      cmd:  'btcli subnet register --netuid 24 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Dry-run the commitment',
      cmd:  'python miner/miner.py --network finney --netuid 24 --wallet-name $WALLET --hotkey-name $HOTKEY --model-repo your-username/your-model --dry-run',
      note: 'Validates everything except the on-chain write.' },
    { step: 'Commit on-chain (permanent for that hotkey)',
      cmd:  'python miner/miner.py --network finney --netuid 24 --wallet-name $WALLET --hotkey-name $HOTKEY --model-repo your-username/your-model',
      note: 'Removing --dry-run writes the commitment. If disqualified, the only path forward is registering a NEW hotkey and committing a different model — the old commitment is permanent.' },
    { step: 'Wait for the next evaluation round',
      note: 'Validators evaluate in shared chain-coordinated rounds — your model may wait until the next round. On-chain commit-reveal can make the visible chain weight lag the latest local eval winner.' },
  ],

  envVars: [
    { name: 'WALLET',     description: 'Coldkey name (matches btcli wallet list)',            required: true },
    { name: 'HOTKEY',     description: 'Hotkey name on that coldkey',                          required: true },
    { name: 'MODEL_REPO', description: 'Public HF repo (username/model) hosting the Quasar-compatible safetensors', required: true },
  ],

  scoring: {
    summary:
      'Composite evaluator: distribution match (teacher-support KL + on-policy distribution checks); capability (math, code, reasoning, instruction following, tool use, long context, robustness); conversational quality (chat-turn + judge probes); generation discipline (reasoning-density + collapse checks penalizing rambling / looping / non-answers); robustness (block-seeded procedural prompts so miners can\'t train against a static answer key). King-of-the-hill: one-hot weights — king 1.0, everyone else 0.0. Dethroning requires BOTH a valid paired-KL win AND a composite quality pass.',
    rule: 'Beat the current king on paired-KL duels AND on composite quality. KL alone cannot crown; composite alone cannot override a head-to-head regression.',
    sourcePath: 'SILX-LABS/QUASAR-SUBNET · validator scoring + king-of-the-hill workflow',
    cheatPath:
      "Quantized formats (GPTQ/AWQ/GGUF/FP8) → rejected at pre-check. Duplicate weights or re-sharded copies of an earlier committed model → caught by weight-hash + content-hash dup detection. Changing or privatising the HF repo after commit → REMOVED disqualification. Modified architecture / tokenizer / vocab → INVALID disqualification. Eval KL above the validator threshold (default 4.0) → disqualified for quality.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Brutal king-of-the-hill economics: ONLY the king earns. Everyone else gets 0.0 weight. Plan around your training budget — H100 fleet rental for a 3B-total / ~1B-active MoE is a real number. The reward is winner-take-all; do not enter casually.',
  },

  milestones: [
    { day: 'day 1',  target: 'Local Quasar-3B-A1B-Preview loaded and inferring',
      note: 'Sanity-check that AutoModelForCausalLM.from_pretrained(..., trust_remote_code=True) loads the base checkpoint and inference works.' },
    { day: 'day 3',  target: 'Custom model passes check_model.py + test_miner.py',
      note: 'All pre-checks (vocab, tokenizer, parameter cap, safetensors, custom code) must pass before commit.' },
    { day: 'day 7',  target: 'Dry-run miner.py succeeds end-to-end',
      note: 'If --dry-run completes cleanly, the on-chain commit will too — but the commit is permanent for that hotkey, so iterate first.' },
    { day: 'day 14', target: 'On-chain commit + evaluated by validators',
      note: 'You may wait until the next chain-coordinated evaluation round. The dashboard distinguishes latest local eval winner vs chain-revealed weight target during commit-reveal lag.' },
  ],

  monitoring: [
    { metric: 'Local composite score vs current king', threshold: 'higher',    where: 'Validator scoring code (re-run locally)' },
    { metric: 'Eval KL vs threshold',                  threshold: '≤ 4.0 (default)', where: 'Local eval · QUASAR_MAX_KL_THRESHOLD' },
    { metric: 'HF repo availability',                  threshold: '100%',      where: 'huggingface.co/<your-repo>' },
    { metric: 'King status',                            threshold: 'crowned',   where: 'Subnet dashboard / chain weights' },
  ],

  knownIssues: [
    {
      symptom: 'Model rejected as COPY despite different training',
      cause:   'Weight hash or content hash collides with an earlier committed model — re-sharded copies are caught via content hashing.',
      fix:     'Train materially different weights. Earlier on-chain commitment owns the hash, even when the later commitment uses the same coldkey.',
    },
    {
      symptom: 'INVALID disqualification',
      cause:   'Incompatible architecture, tokenizer, custom code, parameter cap, format, or quantization.',
      fix:     'Re-run check_model.py locally; align config.json with silx-ai/Quasar-3B-A1B-Preview exactly. No GPTQ/AWQ/GGUF/FP8.',
    },
    {
      symptom: 'REMOVED disqualification',
      cause:   'Model deleted, made private, or changed after the committed revision.',
      fix:     'Keep the HF repo public, pinned, and untouched after commit. If you need a different model, register a new hotkey and commit a new repo — the prior commitment is permanent.',
    },
    {
      symptom: 'EVAL_ERROR disqualification',
      cause:   'Repeated non-transient failure during validator evaluation (loading errors, generation hangs, etc.).',
      fix:     'Re-test with test_miner.py on the exact pinned revision. Disqualification is scoped to the commitment, not the hotkey.',
    },
    {
      symptom: 'King never changes despite high local score',
      cause:   'Paired-KL evidence is missing — composite alone cannot dethrone the king without a direct head-to-head regression.',
      fix:     'Generate explicit paired-KL data against the current king on the block-seeded prompt set.',
    },
  ],

  notes: [
    'Pin the crown-policy env per validator (SINGLE_EVAL_MIN_CROWN_QUALITY=0.20, QUASAR_NO_WINNER_FALLBACK_UID=155, etc.) so all operators run the same gates and vTrust stays aligned.',
    'Validator local-state was reset on 2026-05-18 per VALIDATOR.md — current production knobs: QUASAR_EVAL_PROMPTS_H2H=300, QUASAR_VLLM_CONCURRENCY=8, isolated .venv-vllm, 2-epoch chain coordination window.',
    'The "no-winner fallback UID" model means emissions can be withheld from unsafe submissions while vTrust stays aligned across validators.',
    'On-chain commitments are permanent per hotkey. To retry with a different model, register a new hotkey.',
  ],
};
