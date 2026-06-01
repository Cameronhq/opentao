import type { RichPlaybook } from '../playbook-rich';

// SN40 — Chunking (VectorChat). Document → semantically coherent chunks for RAG.
// Validators score on intrachunk similarity vs interchunk dissimilarity (embeddings).
// As of 2026-06-01 the VectorChat/chunking_subnet repo was not publicly reachable
// from our checks — operator may have moved hosting. URL kept; rest of fields are
// inferred from the public subnet docs and the bittensor-report dossier. Verify
// the active repo with the team before depositing capex.

export const sn40: RichPlaybook = {
  slug: '40-chunking',
  netuid: 40,
  name: 'Chunking',
  category: 'data',
  categoryLabel: 'RAG / Embedding',

  blurb:
    'Decentralized document chunking for RAG. Validators send documents with size + count constraints; miners return chunked segments; scoring rewards intrachunk similarity and interchunk dissimilarity via embedding comparison.',

  whatMinersDo:
    'The miner receives a document plus parameters (target chunk size, chunk count, time budget) and returns a JSON list of text chunks produced by its own algorithm. Validators embed each chunk and compute (a) intrachunk similarity to the source document, (b) interchunk dissimilarity from siblings. Reward is multiplicatively reduced for oversize, overcount, or late responses, and is integrated into an EMA so steady high-quality miners climb the weight ranking.',

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
      gpu: 'optional — small embedding GPU helps (RTX 3060 / 4060 class)',
      vramGb: 12,
      cpuCores: 8,
      ramGb: 32,
      diskGb: 100,
      bandwidth: '100 Mbps+',
      notes: 'CPU-only is workable but tighter on time budget. A small GPU lets you run a local embedding/sentence-segmentation model for faster, smarter chunking.',
    },
  ],
  hardwareNote:
    'Earnings on SN40 are about chunking algorithm quality, not raw FLOPS. A modest GPU mostly buys you headroom under the validator time penalty.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 0.45, runpod: 0.39, coreweave: 0.50 },

  repo: {
    url: 'https://github.com/VectorChat/chunking_subnet',
    branch: 'main',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Standard Bittensor neuron layout — clone, pip install, configure axon, run neurons/miner.py. Your chunking algorithm lives in the miner forward() — that is where your edge comes from. Treat the baseline miner as a starting point and replace its segmentation logic.',

  install: [
    { step: 'Clone the chunking_subnet repo',
      cmd:  'git clone https://github.com/VectorChat/chunking_subnet && cd chunking_subnet',
      note: 'As of 2026-06-01 the public URL was intermittently unavailable. If this 404s, ping the VectorChat team on X (@chunking_subnet) for the current hosting.' },
    { step: 'Create venv + install deps',
      cmd:  'python -m venv .venv && source .venv/bin/activate && pip install -e .' },
    { step: 'Copy env template',
      cmd:  'cp .env.example .env',
      note: 'Fill in wallet / hotkey / axon fields.' },
    { step: 'Register your hotkey on SN40',
      cmd:  'btcli subnet register --netuid 40 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
  ],

  runSteps: [
    { step: 'Start the miner with PM2',
      cmd:  'pm2 start neurons/miner.py --name sn40-miner --interpreter python -- --netuid 40 --wallet.name $WALLET --wallet.hotkey $HOTKEY --axon.port 8091 --logging.debug',
      note: 'Iterate on the forward() function — that is where chunking quality is decided.' },
    { step: 'Verify on the metagraph',
      cmd:  'btcli subnet metagraph --netuid 40' },
  ],

  envVars: [
    { name: 'WALLET',  description: 'Coldkey name', required: true },
    { name: 'HOTKEY',  description: 'Hotkey name',  required: true },
    { name: 'NETUID',  description: 'Mainnet = 40', required: false },
  ],

  scoring: {
    summary:
      'Validators embed each returned chunk and score on two axes: intrachunk similarity to the original document (higher is better) and interchunk dissimilarity from siblings (higher is better). Penalties multiplicatively reduce the score for: oversize chunks, wrong chunk count, late responses. Final weights flow through an exponential moving average so quality compounds over time.',
    rule: 'Build a smarter chunker than the baseline — use semantic boundary detection (sentence transformers, section headers, topic shift heuristics) instead of naive character splits. Stay under the size cap and the time budget.',
    cheatPath:
      "Don't return one giant chunk — interchunk dissimilarity drops to undefined and you score zero. Don't return many tiny shards — intrachunk similarity goes high but the count-penalty kills the multiplier. Don't sleep on time budget — late returns are multiplicatively penalized.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote: 'Light capex — single CPU/GPU node. The competitive edge is your chunking algorithm, not your hardware.',
  },

  milestones: [
    { day: 'day 1', target: 'Baseline miner registered and answering queries',
      note: 'Run the stock baseline first to confirm wiring works.' },
    { day: 'day 3', target: 'Custom chunking algorithm deployed',
      note: 'Replace the baseline forward() with a semantic chunker (sentence-transformers + boundary heuristic).' },
    { day: 'day 7', target: 'EMA weight rising above floor',
      note: 'If still floored, your size/count compliance is failing — log the actual chunk counts returned.' },
  ],

  monitoring: [
    { metric: 'Average chunk size vs target', threshold: '± 10%',  where: 'Local miner logs — log returned chunk sizes' },
    { metric: 'Response time vs deadline',    threshold: '< 50%',  where: 'Local miner logs' },
    { metric: 'Per-tempo incentive',          threshold: 'rising', where: 'btcli subnet metagraph --netuid 40' },
  ],

  knownIssues: [
    {
      symptom: 'Score stuck at zero despite responding',
      cause:   'Returning a single chunk or wildly off the requested count — the dissimilarity metric undefined or the count-penalty zeroes the multiplier.',
      fix:     'Log returned chunk_count and avg_size per request. Honor the validator-supplied count and size limits exactly.',
    },
    {
      symptom: 'High-quality chunks but low score',
      cause:   'Late responses — time penalty is multiplicative.',
      fix:     'Cache embedding models in memory. Reject the temptation to run a 7B model for boundary detection when a small sentence-transformer would do.',
    },
    {
      symptom: 'Cannot find repo at the documented URL',
      cause:   'Operator may have relocated hosting; the canonical URL was unreachable in late May 2026.',
      fix:     'Confirm current repo on VectorChat\'s X (@chunking_subnet) or website (vectorchat.ai) before investing time.',
    },
  ],

  notes: [
    'The competitive moat on SN40 is algorithmic: better semantic boundary detection. GPU is helpful but not the differentiator.',
    'Repo hosting was intermittent as of 2026-06-01 — verify current URL with the team before pinning your CI to it.',
  ],
};
