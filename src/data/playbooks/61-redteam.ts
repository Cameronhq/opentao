import type { RichPlaybook } from '../playbook-rich';

// SN61 — RedTeam. Innerworks-operated adversarial bot-detection tournament.
// Setup is Docker-Compose-shaped: miners build a container, push to Docker Hub,
// then submit the image digest to the subnet via a `.env`-configured compose stack.
// Docs at github.com/RedTeamSubnet/RedTeam/docs/miner/workflow/*.

export const sn61: RichPlaybook = {
  slug: '61-redteam',
  netuid: 61,
  name: 'RedTeam',
  category: 'reason',
  categoryLabel: 'Reasoning · Security',

  blurb:
    'Decentralized red-team for bot detection. Miners build adversarial containers that try to bypass live detection systems, publish them via Docker Hub, then submit the image digest on-chain. Innerworks runs the subnet.',
  whatMinersDo:
    "A RedTeam miner builds a Docker image (under `examples/miner_commit/`) that implements an attack against the current challenge — usually a bot-detection bypass. The miner pushes the image to Docker Hub, retrieves its SHA256 digest, and submits that commit via the subnet's `compose.sh start` stack. Validators run the miner's container against live detection targets and grade on bypass success and novelty.",

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
      cpuCores: 2,
      ramGb: 8,
      diskGb: 50,
      bandwidth: 'stable broadband',
      notes: 'From docs: 2+ CPU cores, 8+ GB RAM, 50+ GB disk, Ubuntu 22.04 LTS+, Python 3.10+, Docker + Compose. Compute floor is low — the game is offensive-security skill, not GPU.',
    },
  ],
  hardwareNote:
    'RedTeam is not GPU-bound. A small VPS with Docker is enough; the differentiator is the cleverness of your bypass code, not raw compute.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.10, runpod: 0.08, coreweave: 0.15 },

  repo: {
    url: 'https://github.com/RedTeamSubnet/RedTeam',
    branch: 'main',
    extraRepos: [
      { name: 'RedTeamSubnet/miner', url: 'https://github.com/RedTeamSubnet/miner', purpose: 'Reference miner (agent) repo' },
    ],
  },

  setupShape: 'docker-compose',
  setupOverview:
    'Setup is Docker-Compose: clone the repo, copy the dev compose override, build your miner container under `examples/miner_commit/`, push to Docker Hub, then bring the compose stack up with your wallet env vars set. The stack handles on-chain commit submission.',

  install: [
    { step: 'Prepare workspace + conda env',
      cmd:  'mkdir -pv ~/workspaces/projects/redteam61 && cd ~/workspaces/projects/redteam61 && conda create -y -n redteam python=3.10 pip && conda activate redteam' },
    { step: 'Clone the subnet repo',
      cmd:  'git clone https://github.com/RedTeamSubnet/RedTeam && cd RedTeam' },
    { step: 'Prepare a compose override for your miner',
      cmd:  'cp templates/compose/compose.override.dev.yml compose.override.yml' },
    { step: 'Configure miner image in compose.override.yml',
      note: 'Set `miner-commit-api.image: <USER>/<REPO>:<VERSION>` and `build.context: ./examples/miner_commit`.' },
    { step: 'Build the miner image',
      cmd:  'docker compose build miner-commit-api' },
    { step: 'Push to Docker Hub',
      cmd:  'docker login && docker push <USER>/<REPO>:<VERSION>' },
    { step: 'Grab the image digest (needed for on-chain commit)',
      cmd:  "docker inspect --format='{{index .RepoDigests 0}}' <USER>/<REPO>:<VERSION>" },
    { step: 'Register hotkey on SN61',
      cmd:  'btcli subnet register --netuid 61 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Configure wallet vars in .env',
      note: 'Set RT_BTCLI_WALLET_DIR, RT_MINER_WALLET_NAME, RT_MINER_HOTKEY_NAME in the `.env` file to point at your wallet.' },
    { step: 'Start the compose stack',
      cmd:  './compose.sh start -l' },
    { step: 'Or use raw docker compose',
      cmd:  'docker compose up -d --remove-orphans --force-recreate' },
  ],

  envVars: [
    { name: 'WALLET',                description: 'Coldkey name (must match RT_MINER_WALLET_NAME in .env)', required: true },
    { name: 'HOTKEY',                description: 'Hotkey name (must match RT_MINER_HOTKEY_NAME in .env)',  required: true },
    { name: 'RT_BTCLI_WALLET_DIR',   description: 'Path to your Bittensor wallet directory',                 required: true },
    { name: 'RT_MINER_WALLET_NAME',  description: 'Coldkey name as seen by btcli',                           required: true },
    { name: 'RT_MINER_HOTKEY_NAME',  description: 'Hotkey name as seen by btcli',                            required: true },
  ],

  scoring: {
    summary:
      'Validator runs the miner-submitted container against the current detection target and scores bypass success rate weighted by novelty. Final emission share is computed as (50% × Challenge Score) + (50% × Alpha Burn). Re-submitting an idea identical to a prior solution is rejected outright.',
    rule: 'Defeat the detection system in a novel way. Recycled exploits earn near-zero.',
    cheatPath:
      "Don't include the challenge name or your Discord username in your Docker image name — others can resubmit your image under their hotkey. Don't run `docker build .` from the project root; always go through `docker compose build` so context is correct.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    notes:
      '50% of your score is burn-weighted — funded burn is part of the economics. Skilled offensive-security operators capture most of the emission.',
  },

  milestones: [
    { day: 'day 1', target: 'Compose stack up; miner image pushed to Docker Hub', note: 'docker push succeeds; SHA256 digest captured for submission.' },
    { day: 'day 3', target: 'First commit submitted on-chain',                    note: 'Validator should pick up and run your image within a tempo.' },
    { day: 'day 7', target: 'First bypass score > 0',                             note: 'If still zero, your bypass is being detected — iterate the exploit.' },
    { day: 'day 14', target: 'Out of immunity, novelty score > floor',            note: 'Novelty weighting penalizes recycled tricks — fresh approaches needed weekly.' },
  ],

  monitoring: [
    { metric: 'Docker image digest matches on-chain commit', threshold: 'always',  where: 'docker inspect vs. commit log' },
    { metric: 'Bypass success rate',                         threshold: '> 0',     where: 'validator-reported scores per challenge' },
    { metric: 'Novelty bonus',                               threshold: 'positive', where: 'subnet UI / Innerworks dashboards' },
    { metric: 'Per-tempo incentive',                         threshold: 'rising',  where: 'btcli subnet metagraph --netuid 61' },
  ],

  knownIssues: [
    {
      symptom: 'Submission rejected as duplicate',
      cause:   'Image content is too close to a previously-submitted miner solution.',
      fix:     'Add genuine novelty — new evasion technique, not a tweaked template.',
    },
    {
      symptom: 'Image name shows challenge / Discord username',
      cause:   "Naming convention violated; others can resubmit your image against their hotkey.",
      fix:     "Don't include the challenge name or your Discord username in the Docker image name.",
    },
    {
      symptom: '`docker build .` produces a broken image',
      cause:   "Build context wrong — Compose expects `examples/miner_commit/` as context.",
      fix:     'Always build via `docker compose build miner-commit-api` from the repo root.',
    },
  ],

  notes: [
    'Successful bypasses get open-sourced back into the RedTeam library — the next round starts from a higher floor.',
    'Operated by Innerworks (UK); detection customers include 1inch.',
  ],
};
