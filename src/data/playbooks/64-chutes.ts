import type { RichPlaybook } from '../playbook-rich';

// SN64 — Chutes. Operated by Rayon Labs.
// Chutes is a containerized serverless GPU inference market. Miners host
// arbitrary AI workloads (chutes) shipped by users; the validator picks chutes,
// places them on bidding miners, and scores on operational metrics over a 7-day
// rolling window. NOT a "python neurons/miner.py" subnet — it's a fleet-mode
// K3s + Helm + Ansible setup with a Gepetto placement engine the operator owns.

export const chutes: RichPlaybook = {
  slug: '64-chutes',
  netuid: 64,
  name: 'Chutes',
  category: 'compute',
  categoryLabel: 'Compute',

  blurb:
    'Serverless GPU inference market. Miners host containerized AI workloads (LLMs, image, audio) on bare-metal GPU fleets; validators bid chutes onto miners and score on 7-day operational metrics. SN64 — currently #2 by emission share (~14.88%).',

  whatMinersDo:
    "A Chutes miner runs a K3s cluster spanning a CPU control node plus one or more GPU nodes. The miner publishes available capacity to the validator's bidding API. The validator decides which chutes (containerized AI workloads owned by chute creators on the network) to place on which miner — chute creators set hourly prices, miners bid; you earn when your bid wins. You also earn bounties for being the first to pull a newly-requested chute online. Scoring rolls over a 7-day window: total chute instances served, compute-seconds, compute-units, and bounty count. GPU authenticity is enforced by GraVal (proof-of-consecutive-VRAM-work), which is why rented GPUs from Runpod/Vast are disqualified — they fail the attestation.",

  verifiedAt: '2026-05-30',
  verifiedBy: '@editorial',

  emission: '~530 τ/day (network share)',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Control / CPU node',
      count: '1 (cluster-wide)',
      cpuCores: 8,
      ramGb: 64,
      diskGb: 200,
      bandwidth: 'static public IP · 1 Gbps',
      notes: 'Runs the chutes-miner API, Postgres, Redis, Gepetto placement engine, Wireguard mesh. No GPU needed.',
    },
    {
      role: 'GPU node',
      count: '1–N per cluster',
      gpu: 'H100 / L40S / A6000 / A40 / A100 / A5000 / A10 / T4 (per supported list)',
      vramGb: 80,
      cpuCores: 16,
      ramGb: 192,
      diskGb: 1000,
      bandwidth: 'static public IP · ports 30000–32767 open',
      notes: 'Hard rule: system RAM ≥ sum(VRAM across GPUs). 4×A40 (48GB) → 192+ GB RAM. Disk is mostly HF model cache (default 850 GB, 30-day retention).',
    },
  ],
  hardwareNote:
    "Supported GPU list lives at chutesai/chutes-api/blob/main/api/gpu.py — refer there before purchasing hardware; the list updates as new models are added to the catalog. H100 / A6000 / L40S are favored for top-tier LLMs; lower tiers serve smaller models.",

  rentalOk: false,
  rentalNote:
    "Runpod, Vast, and similar rental marketplaces are explicitly disallowed — GraVal's VRAM-binding attestation fails on virtualized/shared GPUs, and you get zero score. Use bare-metal providers (Hetzner dedicated, Latitude.sh, OVH, FluidStack bare-metal tier) or owned hardware.",

  repo: {
    url: 'https://github.com/rayonlabs/chutes-miner',
    branch: 'main',
    extraRepos: [
      { name: 'chutes-api',       url: 'https://github.com/chutesai/chutes-api',       purpose: 'Validator code + canonical supported-GPU list (api/gpu.py)' },
      { name: 'chutes (SDK)',     url: 'https://github.com/chutesai/chutes',           purpose: 'Chute author SDK — useful to understand what you serve' },
      { name: 'minersunion/sn64', url: 'https://github.com/minersunion/sn64-tools',    purpose: 'Community helpers, dashboards, deploy scripts' },
    ],
  },

  setupShape: 'fleet-k8s',
  setupOverview:
    "Setup is a one-time fleet install: provision your nodes, run an Ansible playbook that lays down K3s + Postgres + Redis + Wireguard + GraVal, ship your customized Gepetto placement engine via a ConfigMap, then deploy the chutes-miner Helm chart. After that, day-to-day operation is `chutes-miner add-node` per new GPU box.",

  install: [
    { step: 'Clone the miner repo',
      cmd:  'git clone https://github.com/rayonlabs/chutes-miner && cd chutes-miner' },
    { step: 'Provision your nodes (1 control + 1+ GPU)',
      note: 'Bare-metal or single-tenant VMs only. Each node needs a static public IP. GPU nodes: open ephemeral ports 30000-32767, enable IP forwarding on the control node.' },
    { step: 'Fill inventory.yml and values.yaml',
      note: 'inventory.yml lists every node + its role; values.yaml sets validator socket URLs and the multiCluster flag.' },
    { step: 'Run the Ansible playbook to install K3s + deps',
      cmd:  'ansible-playbook -i inventory.yml site.yaml' },
    { step: 'Customize and load Gepetto (placement / scaling engine)',
      cmd:  'kubectl create configmap gepetto-code --from-file=gepetto.py',
      note: "Gepetto decides which chutes to pull, which GPUs they bind to, and when to claim bounties. You'll iterate on this file." },
    { step: 'Create k8s secrets',
      cmd:  'kubectl create secret docker-registry regcred --docker-server=docker.io --docker-username=$DH_USER --docker-password=$DH_PAT',
      note: 'Docker Hub PAT avoids pull rate-limits.' },
    { step: 'Create miner-credentials secret from hotkey',
      note: "Extract ss58Address + secretSeed from ~/.bittensor/wallets/<coldkey>/hotkeys/<hotkey>, then `kubectl create secret generic miner-credentials --from-literal=ss58Address=… --from-literal=secretSeed=…`." },
    { step: 'Render and apply the Helm chart',
      cmd:  'helm template . -f values.yaml > miner-charts.yaml && kubectl apply -f miner-charts.yaml' },
    { step: 'Register your hotkey on SN64',
      cmd:  'btcli subnet register --netuid 64 --wallet.name $WALLET --wallet.hotkey $HOTKEY',
      note: 'Re-check burn-cost immediately before this — it spikes unpredictably.' },
    { step: 'Install the operator CLI',
      cmd:  'pip install chutes-miner-cli' },
  ],

  runSteps: [
    { step: 'Add each GPU node to the cluster',
      cmd: `chutes-miner add-node \\
  --name gpu-node-01 \\
  --validator <VALIDATOR_HOTKEY_SS58> \\
  --hourly-cost 1.89 \\
  --gpu-short-ref h100 \\
  --hotkey ~/.bittensor/wallets/$WALLET/hotkeys/$HOTKEY \\
  --agent-api http://<control-ip>:32000 \\
  --miner-api http://<node-ip>:<port>`,
      note: 'Repeat per GPU node. `--gpu-short-ref` accepts comma-separated multi-GPU types (e.g. `h100,a6000`).' },
    { step: 'Watch logs converge',
      cmd:  'kubectl logs -f deploy/chutes-miner-api',
      note: 'You should see the bidding API picking up chute requests within a tempo (~72 min).' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 64',
      note: "Find your hotkey, confirm UID assignment and that incentive starts climbing." },
  ],

  envVars: [
    { name: 'WALLET',          description: 'Coldkey name (matches btcli wallet list)',                              required: true },
    { name: 'HOTKEY',          description: 'Hotkey name on that coldkey',                                           required: true },
    { name: 'VALIDATOR_HOTKEY',description: "Target validator's ss58 (which validator you bid into)",                required: true },
    { name: 'DH_USER',         description: 'Docker Hub username (for regcred secret)',                              required: false },
    { name: 'DH_PAT',          description: 'Docker Hub personal access token (avoids pull rate-limit)',             required: false },
  ],

  scoring: {
    summary:
      'Scoring is operational, not output-comparison. The validator tracks each miner over a rolling 7-day window across: total_instances (chutes hosted), compute_seconds (wall-clock GPU time serving traffic), compute_units (weighted by GPU tier), and bounty_count (first-to-serve for newly requested chutes). Score is also conditioned on GraVal — your GPUs must pass an AES-256-keyed VRAM proof every cycle, or your score drops to zero.',
    rule: 'Earn by serving real chute traffic on attested GPUs. Bounties reward responsiveness; compute_seconds rewards uptime + throughput; total_instances rewards a deep catalog of supported models.',
    sourcePath: 'chutesai/chutes-api · api/scoring.py',
    cheatPath:
      "Don't try rented Runpod/Vast GPUs — GraVal binds an AES key to the physical device's VRAM and fails on shared infra. Don't run multiple UIDs from the same fleet — self-cannibalization splits compute across hotkeys and lowers per-UID score. Don't underspec RAM — chutes silently fail to deploy when system RAM < sum(VRAM).",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 2.07,    // ~530 τ/day ÷ ~256 active UIDs (rough)
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex-heavy. A single H100 bare-metal box runs $4k–$8k/mo at long-term rates or $20k+ to own. Plan for at least 1 month of break-even-or-below while Gepetto tunes and your reputation accrues.',
    notes:
      'Distribution is very heavy-tailed — top-decile miners earn 10× the median because they (a) run more GPUs, (b) tune Gepetto well, (c) sit on top of bounty opportunities. The calculator below assumes you are at the median; halve the output to be conservative.',
  },

  milestones: [
    { day: 'day 1',  target: 'Cluster healthy, GraVal attesting',
      note: '`kubectl get pods --all-namespaces` clean. GraVal proof submissions visible in chutes-miner-api logs. UID assigned and incentive > 0.' },
    { day: 'day 3',  target: 'First chute placements landing',
      note: 'Bidding API has won at least one chute. compute_seconds counter rising. If still zero, validator may have GraVal complaints — check logs.' },
    { day: 'day 7',  target: 'Bounty wins > 0',
      note: 'Gepetto should be pre-pulling chutes that look likely to be requested. Look at top miners on taostats — what GPUs and chute patterns are they running?' },
    { day: 'day 14', target: 'Out of immunity period, surviving',
      note: 'Your incentive should be above the lowest non-immune miner. If close to the floor, expand GPU count or refine Gepetto placement logic.' },
    { day: 'day 30', target: 'Break-even on opex',
      note: 'Hardware capex still in the hole but daily emission ≥ daily server cost. Top-quartile miners reach here by day 21.' },
  ],

  monitoring: [
    { metric: 'GraVal proof success rate',     threshold: '100%',          where: 'chutes-miner-api logs — search "graval"' },
    { metric: 'Bidding API uptime',            threshold: '> 99.5%',       where: 'kubectl get pods + http://<control-ip>:32000/health' },
    { metric: 'GPU utilization (under load)',  threshold: '> 60%',         where: 'nvidia-smi · long-tail at low util = idle GPUs costing you opex' },
    { metric: 'Disk free on GPU nodes',        threshold: '> 100 GB',      where: 'df -h /var/snap · HF cache eviction is expensive' },
    { metric: 'Ephemeral port reachability',   threshold: '100%',          where: 'curl http://<gpu-node-ip>:30001/ from outside · validator needs this' },
    { metric: 'Per-tempo incentive',           threshold: 'rising or flat',where: 'btcli subnet metagraph --netuid 64 · check every ~72 min' },
  ],

  knownIssues: [
    {
      symptom: 'GraVal attestation failing → score stays at 0',
      cause:   'GPU is virtualized (Runpod/Vast) or shared. GraVal binds AES-256 to physical VRAM and detects time-shared / partitioned GPUs.',
      fix:     'Migrate to bare-metal (Hetzner, Latitude, FluidStack bare-metal). Confirm `nvidia-smi --query-gpu=gpu_bus_id --format=csv` shows a real PCIe address, not virt.',
    },
    {
      symptom: 'Chutes deploy then silently OOM-kill',
      cause:   'System RAM < sum(VRAM across GPUs). Chutes pull large model weights into RAM before swapping to VRAM.',
      fix:     'Re-spec the GPU node — RAM ≥ sum(VRAM). For 4×A40 (4×48GB) you need ≥ 192GB system RAM. No exceptions.',
    },
    {
      symptom: 'Validator never bids any chute onto you',
      cause:   'Ephemeral ports 30000–32767 closed at the cloud firewall, or `--agent-api` URL unreachable from outside.',
      fix:     "Open the ephemeral range explicitly: `ufw allow 30000:32767/tcp`. Test from a different network: `curl http://<gpu-node-ip>:30001/health`.",
    },
    {
      symptom: 'Wireguard mesh broken — control can\'t talk to GPU nodes',
      cause:   'IP forwarding disabled on the control node, or wireguard pod failing.',
      fix:     "`sudo sysctl -w net.ipv4.ip_forward=1` and persist in /etc/sysctl.conf. `kubectl logs -n kube-system <wireguard-pod>` for further clues.",
    },
    {
      symptom: '/var/snap fills up, chutes start failing to pull',
      cause:   'HF model cache exceeded the 850 GB default with no eviction.',
      fix:     "Mount /var/snap on a larger volume (1.5–2 TB recommended for catalog-of-the-month). Or adjust HF cache TTL in values.yaml.",
    },
    {
      symptom: 'Running 2+ UIDs from the same fleet, total earning DROPS',
      cause:   "Self-cannibalization — validator splits compute scoring across your own hotkeys, each one looks weaker.",
      fix:     'Pick one hotkey, deregister the others, consolidate stake and compute. Top miners run one UID per cluster.',
    },
  ],

  notes: [
    'Catalog of supported chutes/models changes weekly — subscribe to Rayon Discord #chutes-miners and #catalog-changes.',
    'Halving event landed 2025-12-14 — daily network emission dropped to ~3,600 τ. SN64 share is ~14.88% (~530 τ/day) at the moment.',
    'Old microk8s deployments must set `multiCluster: false` in values.yaml. Fresh K3s installs don\'t need it.',
    'minersunion/sn64-tools is community-maintained — useful Gepetto templates, dashboard configs, and migration scripts. Worth reading before writing your own.',
    'AsymmetricJump\'s subnet research report is the best 3rd-party economic deep-dive on Chutes. Read it before committing capex.',
  ],
};
