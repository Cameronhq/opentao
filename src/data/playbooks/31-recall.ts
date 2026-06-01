import type { RichPlaybook } from '../playbook-rich';

// SN31 — Recall (current branding) / NASChain (legacy).
// Subnet is mid-transition from NASChain (Neural Architecture Search,
// Tensorplex Labs era → operated by neuronlogic) toward "Recall" — an
// end-to-end RAG pipeline tournament. No canonical Recall miner repo has
// been published publicly at time of verification; the only on-record
// miner code lineage is the NASChain repo. Treat as transitional.

export const sn31: RichPlaybook = {
  slug: '31-recall',
  netuid: 31,
  name: 'Recall',
  category: 'reason',
  categoryLabel: 'RAG / Retrieval',

  blurb:
    'Decentralized RAG tournament — embedding + retrieval + LLM as a full pipeline graded on retrieval recall and answer faithfulness. Subnet is mid-transition from legacy NASChain; canonical Recall miner repo is not publicly published at time of verification.',

  whatMinersDo:
    "Under the Recall positioning, miners are expected to operate an end-to-end RAG service — an embedding model for the corpus, a vector index, retrieval, and an LLM that answers with citations — exposed via the subnet axon. The validator dispatches questions with known answers, the miner returns a cited answer plus retrieved passages, and the validator grades retrieval recall + citation faithfulness + answer quality. Under the legacy NASChain framing the miner ran `neurons/miner.py --netuid 31 ... --genomaster.ip http://51.161.12.128 --genomaster.port 5000` to receive NAS genomes and report training results — that mechanism is no longer the active scoring spec.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'GPU node (RAG serving)',
      count: '1',
      gpu: '1× modern NVIDIA (A6000 / L40S / H100 depending on LLM choice)',
      vramGb: 24,
      cpuCores: 8,
      ramGb: 64,
      diskGb: 500,
      bandwidth: 'static public IP · open axon port · 1 Gbps',
      notes: 'Disk requirement depends on corpus + vector index size; 500 GB is a reasonable starting point for a multi-domain RAG miner.',
    },
  ],
  hardwareNote:
    'Hardware spec is inferred from the Recall positioning (embedding + vector store + LLM inference). Confirm the live spec from operator channels before committing capex — the subnet is mid-transition.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.49, runpod: 1.29, coreweave: 1.69 },

  repo: {
    url: 'https://github.com/neuronlogic/NASChain',
    branch: 'main',
    minerEntrypoint: 'neurons/miner.py',
    extraRepos: [
      { name: 'mutexlocker/NASChain', url: 'https://github.com/mutexlocker/NASChain', purpose: 'Alternative legacy NASChain implementation' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Subnet 31 is mid-transition from NASChain to Recall. No canonical Recall miner repo is publicly published at time of verification; the only on-record miner code is the legacy NASChain repo (Tensorplex Labs era → neuronlogic). Confirm the current scoring spec and miner entrypoint with the active operator before mining.',

  install: [
    { step: 'Confirm current scoring spec + miner repo with operator',
      note: 'Bittensor.ai subnet directory lists SN31 as "Recall" but the canonical Recall miner repo is not yet publicly verifiable. Reach out via the SN31 channel on Bittensor Discord before committing time.' },
    { step: '(Legacy NASChain reference) Clone the legacy repo',
      cmd: 'git clone https://github.com/neuronlogic/NASChain.git && cd NASChain' },
    { step: '(Legacy reference) Install requirements',
      cmd: 'pip install -r requirements.txt' },
    { step: 'Register on SN31',
      cmd: 'btcli subnet register --netuid 31 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: '(Legacy NASChain reference) Start miner',
      cmd: `python neurons/miner.py \\
  --netuid 31 \\
  --wallet.name $WALLET \\
  --wallet.hotkey $HOTKEY \\
  --logging.debug \\
  --axon.port <port> \\
  --dht.port <dht-port> \\
  --dht.announce_ip <your-public-ip> \\
  --genomaster.ip http://51.161.12.128 \\
  --genomaster.port 5000`,
      note: 'This is the legacy NASChain command — kept for reference. The active Recall scoring may use a different entrypoint; verify with operator.' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name', required: true },
  ],

  scoring: {
    summary:
      'Recall positioning: graded on the full RAG pipeline — retrieval recall (did the cited passages contain the ground-truth answer?), citation faithfulness, and answer quality. Legacy NASChain spec: Pareto frontier on accuracy / params / FLOPs for searched architectures. Current active spec is in transition.',
    rule: 'Recall: maximize retrieval recall × citation faithfulness × answer quality on held-out queries. Verify against the current operator publication.',
    cheatPath:
      'Fabricating plausible-looking citations is caught by passage-vs-answer content checks. Hardcoding answers to expected probes loses on held-out queries. Copying another miner is caught by cross-validator score correlation.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Subnet is mid-transition; treat any capex as exploratory until the current Recall scoring spec stabilizes.',
    notes:
      'Estimate is unreliable while the scoring spec transitions. Wait for the Recall codebase to be publicly published before sizing.',
  },

  milestones: [
    { day: 'day 1',  target: 'Confirm active scoring spec',     note: 'Reach out via Bittensor Discord #subnet-31 and confirm the current miner entrypoint + scoring rule before deploying.' },
    { day: 'day 3',  target: 'Miner registered + serving',      note: 'Once the active spec is confirmed, register and start serving; verify probes are hitting your axon.' },
    { day: 'day 7',  target: 'First scored cycle',              note: 'Validators have run enough eval cycles to write meaningful weights for your UID.' },
    { day: 'day 14', target: 'Out of immunity period',          note: 'Surviving deregistration with the current spec.' },
  ],

  monitoring: [
    { metric: 'Operator channel for spec updates', threshold: 'always current',  where: 'Bittensor Discord #subnet-31 · spec changes possible during transition' },
    { metric: 'Axon reachability',                 threshold: '> 99.5%',         where: 'curl http://<miner-ip>:<axon-port>/ from outside' },
    { metric: 'Per-tempo incentive',               threshold: 'rising or flat',  where: 'btcli subnet metagraph --netuid 31' },
  ],

  knownIssues: [
    {
      symptom: 'No canonical Recall miner repo can be found',
      cause:   'Subnet identity transitioned from NASChain to Recall; the Recall team has not (at time of verification) published a public miner repo.',
      fix:     'Wait for an official Recall repo publication, or contact the operator directly via Bittensor Discord. Do not assume the legacy NASChain code is the active spec.',
    },
    {
      symptom: 'Legacy NASChain miner deployed but earning nothing',
      cause:   'The genomaster server at the legacy IP may be retired now that the subnet has rebranded to Recall.',
      fix:     'Confirm whether the legacy NAS scoring is still active; migrate to the current Recall spec once it is published.',
    },
  ],

  notes: [
    'Subnet 31 is mid-transition from NASChain (Tensorplex Labs era → neuronlogic operating the legacy NAS spec) to Recall (RAG-pipeline tournament per Bittensor.ai directory).',
    'No canonical public miner repo for the Recall iteration is verifiable at time of writing — confirm with the operator before treating this playbook as definitive.',
    'Legacy genomaster IP (51.161.12.128) is the only entrypoint hint surviving in public documentation from the NASChain era.',
  ],
};
