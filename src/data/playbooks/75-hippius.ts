import type { RichPlaybook } from '../playbook-rich';

// SN75 — Hippius. Operated by The Nerve Lab.
// Decentralized S3-compatible storage on its own Substrate chain bridged to
// Bittensor. Storage-miner deploys 6 services via Ansible playbook.

export const sn75: RichPlaybook = {
  slug: '75-hippius',
  netuid: 75,
  name: 'Hippius',
  category: 'storage',
  categoryLabel: 'Storage',

  blurb:
    'Decentralized S3-compatible cloud storage on its own Substrate chain bridged to Bittensor. Storage miners deploy a 6-service stack (Hippius node, IPFS/Kubo, HAProxy, Index Provider, Rust miner-ipfs-service, ZFS) via an Ansible playbook.',

  whatMinersDo:
    'A Hippius miner runs a storage node fleet. The Ansible playbook lays down six systemd services on each target host: the Hippius Substrate node (hippius.service), IPFS/Kubo (ipfs.service), HAProxy on port 5001 (haproxy.service), an Index Provider that announces CIDs to the network (index-provider.service), the Rust miner-ipfs-service that handles automated pinning (miner-ipfs-service.service), and a ZFS-managed storage pool. The miner holds committed shards on the ZFS pool, responds to validator retrieval challenges, and serves customer reads via the S3-compatible gateway. Miners take ~60% of storage fees plus a share of TAO emission.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 400,
  slotCap: 256,

  hardware: [
    {
      role: 'Storage miner node',
      count: '1+',
      cpuCores: 4,
      ramGb: 16,
      diskGb: 2000,
      bandwidth: '1 Gbps minimum, ≥100 Mbps sustained',
      notes: '4 cores minimum (8+ recommended). 16 GB RAM minimum (32+ recommended) for IPFS cache + ZFS memory. 100 GB+ SSD for OS/chain data; 2 TB minimum (4 TB+ recommended) for IPFS pool. NVMe / enterprise drives preferred; ZFS mirror or RAID-Z recommended. Plan for 5–10 TB+ monthly egress.',
    },
  ],
  hardwareNote:
    'Capacity-bound, not compute-bound. Two-machine pattern is common: one Ubuntu/WSL2 control box runs Ansible, plus N target storage hosts running Ubuntu with ZFS-capable disks.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.30, runpod: 0.25, coreweave: 0.40 },
  rentalNote: 'Storage VPS pricing varies wildly; bare-metal with owned disks is usually more economical at this scale.',

  repo: {
    url: 'https://github.com/thenervelab/hippius-storage-miner',
    branch: 'main',
    minerEntrypoint: 'site.yml (Ansible) — installs miner-ipfs-service + 5 supporting services',
    extraRepos: [
      { name: 'hippius-doc',     url: 'https://github.com/thenervelab/hippius-doc',     purpose: 'Operator documentation' },
      { name: 'hippius-desktop', url: 'https://github.com/thenervelab/hippius-desktop', purpose: 'Dropbox-style desktop client (customer-side)' },
      { name: 'arion',           url: 'https://github.com/thenervelab/arion',          purpose: 'Hippius Arion protocol components' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'On a control machine (Ubuntu or WSL2): install Ansible, clone the repo, fill `inventory/production/hosts.yml` with your target storage hosts, then run the `site.yml` playbook with your 12-word hotkey mnemonic. The playbook bootstraps the Hippius node, IPFS, HAProxy, Index Provider, the Rust miner-ipfs-service, and ZFS pools on each host.',

  install: [
    { step: 'Install Ansible on the control machine',
      cmd: 'sudo apt update && sudo apt install -y python3-pip && pip install ansible' },
    { step: 'Clone the storage-miner repo',
      cmd: 'git clone https://github.com/thenervelab/hippius-storage-miner.git && cd hippius-storage-miner' },
    { step: 'Configure SSH access to target hosts',
      note: 'Standard ssh-key auth to each host listed in inventory. Verify with `ansible -i inventory/production/hosts.yml all -m ping`.' },
    { step: 'Edit inventory',
      note: 'Update `inventory/production/hosts.yml` with your hosts. Edit `group_vars/all.yml` for disks, ports, directories.' },
  ],

  runSteps: [
    { step: 'Run the deployment playbook',
      cmd: `ansible-playbook -i inventory/production/hosts.yml site.yml \\
  -e "hippius_hotkey_mnemonic='word1 word2 ... word12'"`,
      note: 'Bootstraps all 6 services on each target host. Re-run after config changes — playbook is idempotent.' },
    { step: 'Verify services are up',
      cmd: 'systemctl status hippius ipfs haproxy index-provider miner-ipfs-service' },
    { step: 'Register hotkey on SN75 (if not already)',
      cmd: 'btcli subnet register --netuid 75 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  envVars: [
    { name: 'WALLET',                    description: 'Coldkey name',                                                       required: true },
    { name: 'HOTKEY',                    description: 'Hotkey name',                                                        required: true },
    { name: 'hippius_hotkey_mnemonic',   description: '12-word seed phrase for the Hippius network hotkey (passed via Ansible -e)', required: true },
  ],

  scoring: {
    summary:
      'Validators issue storage and retrieval challenges (proof-of-storage) against shards each miner has committed to hold. Scoring tracks: proof-of-storage success rate, retrieval latency, durability, and bandwidth — the operational KPIs of a real cloud-storage SLA. Miners also collect ~60% of customer storage fees paid through the Hippius chain, layered on top of TAO emission.',
    rule: 'uptime × proof-of-storage success × retrieval latency × served bytes. Fee revenue scales with customer adoption of your specific nodes.',
    sourcePath: 'thenervelab/hippius-doc · scoring section',
    cheatPath:
      'Sybil-storing the same shards across many identities, or serving cached responses while dropping cold data. Challenge cadence + multi-validator consensus on uptime are the counters; correlated outages and validator collusion on what counts as successful retrieval are the residual surface.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Capex on disks dominates. A 4 TB enterprise SSD pool plus a small control VM is the starting point; scale horizontally to grow the score.',
    notes: 'Reported 400+ miners and 500+ nodes across 15 countries by late 2025. Fee revenue layered on TAO emission gives operators a more stable mix than emission-only subnets.',
  },

  milestones: [
    { day: 'day 1',  target: 'All 6 services running on every host', note: '`systemctl status` clean on hippius, ipfs, haproxy, index-provider, miner-ipfs-service across the inventory.' },
    { day: 'day 3',  target: 'Passing retrieval challenges',         note: 'Logs of miner-ipfs-service show successful responses to validator probes.' },
    { day: 'day 7',  target: 'Incentive rising + first fee revenue', note: 'btcli metagraph --netuid 75 shows non-zero incentive; first customer reads logged on HAProxy.' },
    { day: 'day 30', target: 'Storage utilisation > 50%',             note: 'IPFS pool utilisation shows real customer data committed, not just challenge dummies.' },
  ],

  monitoring: [
    { metric: 'Hippius node sync',         threshold: 'in-sync',          where: '`systemctl status hippius` + chain head height' },
    { metric: 'IPFS pin success',          threshold: '> 99%',            where: '`miner-ipfs-service` logs' },
    { metric: 'HAProxy 5xx rate',          threshold: '< 0.1%',           where: 'HAProxy stats / logs' },
    { metric: 'ZFS pool health',           threshold: 'ONLINE',           where: '`zpool status`' },
    { metric: 'Egress used',               threshold: '< plan budget',    where: 'Network counters / bandwidth provider dashboard' },
    { metric: 'Per-tempo incentive',       threshold: 'rising or flat',   where: 'btcli subnet metagraph --netuid 75' },
  ],

  knownIssues: [
    {
      symptom: 'Retrieval challenges failing',
      cause:   'IPFS service not pinning data correctly or ZFS pool degraded.',
      fix:     'Check `miner-ipfs-service` logs and `zpool status`; resilver any degraded vdev. Ensure HAProxy on 5001 is reachable from validators.',
    },
    {
      symptom: 'High retrieval latency penalising score',
      cause:   'Slow disks, undersized RAM (IPFS cache thrashing), or insufficient bandwidth.',
      fix:     'Move IPFS to NVMe, bump RAM to 32+ GB, verify sustained ≥100 Mbps. Add a second host before pushing a single one too hard.',
    },
    {
      symptom: 'Ansible playbook fails mid-run',
      cause:   'SSH connectivity / disks not mounted as ZFS-capable / wrong Ubuntu release.',
      fix:     'Re-run `ansible -m ping` against the host, confirm raw disks are exposed (not pre-formatted), and pin to supported Ubuntu LTS.',
    },
    {
      symptom: 'Egress costs eat into margin',
      cause:   'Hosting at a provider that charges per-GB out (AWS, GCP).',
      fix:     'Move to flat-bandwidth providers (Hetzner, OVH bare-metal, dedicated colo). Plan for 5–10 TB+ monthly egress.',
    },
  ],

  notes: [
    'Two-token economy: Hippius runs its own Substrate chain (alpha + fees) bridged to Bittensor (TAO emission). Miners earn ~60% of storage fees plus emission share.',
    'Customer surface is broad: S3 API + Stripe fiat billing + a Dropbox-style desktop client (hippius-desktop).',
    'Genesis March 2025; 400+ miners and 500+ nodes across 15 countries reported late 2025.',
  ],
};
