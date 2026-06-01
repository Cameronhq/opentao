import type { RichPlaybook } from '../playbook-rich';

// SN57 — Gaia (Nickel5)
// Public miner-side documentation is currently sparse. The Nickel5-Inc/Gaia
// repo URL referenced in subnet metadata returns HTTP 404 / Not Found as of
// 2026-06-01. Treat this as a minimal playbook pending official miner docs.

export const sn57: RichPlaybook = {
  slug: '57-57',
  netuid: 57,
  name: 'Gaia',
  category: 'reason',
  categoryLabel: 'Geospatial',

  blurb:
    'Geospatial forecasting subnet — soil moisture, weather, geomagnetic storms. Validators score on H3 hex grids vs. SMAP / ECMWF ground truth.',
  whatMinersDo:
    "Train and serve geospatial ML models that predict soil moisture (anchored to NASA's SMAP L4), weather (built on Microsoft Aurora), and geomagnetic activity. Tasks arrive as H3 hex IDs with horizon + grid spec; you return per-hex predictions with timestamps. Validators wait for the horizon to resolve and score predictions against SMAP retrievals, ECMWF reanalysis, or observed station data — H3 spatial fairness prevents cherry-picking easy regions.",

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 192,

  hardware: [
    {
      role: 'Miner node',
      count: '1',
      gpu: '1× datacenter or high-end consumer GPU for Aurora-class inference',
      vramGb: 24,
      cpuCores: 16,
      ramGb: 64,
      diskGb: 1000,
      bandwidth: 'high — large geospatial reference datasets need cached access',
      notes: 'Cold storage for SMAP / Sentinel-2 / ECMWF datasets. GPU sized for the foundation models you build on top of.',
    },
  ],
  hardwareNote:
    'Repo / docs are not publicly accessible at verification time; specs above are best-guess based on Aurora-class workloads and Gaia\'s scoring surface. Confirm against the official guide before procurement.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/Nickel5-Inc/Gaia',
    branch: 'main',
    extraRepos: [
      { name: 'Nickel5 site', url: 'https://www.nickel5.com/', purpose: 'Operator site' },
    ],
  },

  setupShape: 'simple-binary',
  setupOverview:
    'The Nickel5-Inc/Gaia repository returned HTTP 404 at verification time, so a precise install script cannot be provided here. Based on subnet scoring (H3 grids, SMAP/ECMWF ground truth, Aurora as base model), miners need a GPU box plus access pipelines to global geospatial reference data. Coordinate via the Gaia_AI_ X account and the Bittensor Discord SN57 channel for the latest install path.',

  install: [
    { step: 'Install btcli', cmd: 'pip install bittensor-cli' },
    { step: 'Register hotkey', cmd: 'btcli subnet register --netuid 57 --wallet.name $WALLET --wallet.hotkey $HOTKEY' },
    { step: 'Obtain Gaia miner source', note: 'Coordinate via @Gaia_AI_ / Bittensor Discord — public repo URL is currently unreachable.' },
    { step: 'Set up geospatial data access', note: 'You need pipelines for SMAP L4 (NASA), Sentinel-2 (ESA), ECMWF reanalysis (paid or via Copernicus), and SRTM elevation.' },
  ],

  runSteps: [
    { step: 'Start miner', note: 'Per the official guide once available — typical pattern is `python neurons/miner.py --netuid 57 ...` under pm2.' },
    { step: 'Verify on metagraph', cmd: 'btcli subnet metagraph --netuid 57' },
  ],

  envVars: [
    { name: 'WALLET', description: 'Coldkey name', required: true },
    { name: 'HOTKEY', description: 'Hotkey name',  required: true },
  ],

  scoring: {
    summary:
      'Per-task: predictions are tied to H3 hexagons (excluding urban + water for fairness). After the horizon, validators pull SMAP retrievals, ECMWF reanalysis, or observed station data and score accuracy. H3 spatial fairness prevents farming easy regions — global consistency wins.',
    rule: 'Forecast accuracy vs. eventual ground truth, averaged across the H3 coverage area.',
    cheatPath:
      "Returning climatological averages won't survive — the score discriminates between forecasts that capture day-to-day departure from climate norms and ones that just repeat the long-run mean.",
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex includes GPU + bandwidth + (potentially) ECMWF data subscription. Aurora gives you a strong base; the marginal gain is in your specialist task models.',
  },

  milestones: [
    { day: 'day 1',  target: 'Hotkey registered + repo obtained', note: 'Coordinate with Gaia team for current miner source.' },
    { day: 'day 7',  target: 'First H3 predictions scored',       note: 'Most tasks have a 1-day horizon; first scores come back within a tempo or two.' },
    { day: 'day 14', target: 'Above-climatology baseline',        note: 'If you cannot beat climatology you will not earn — investigate task-specific feature engineering.' },
    { day: 'day 30', target: 'Stable on leaderboard',             note: 'Top miners consistently beat ECMWF baseline on at least one task family.' },
  ],

  monitoring: [
    { metric: 'Axon port reachability', threshold: 'reachable',           where: 'External curl' },
    { metric: 'Per-task accuracy',      threshold: 'above climatology',   where: 'Validator scoring output' },
    { metric: 'GPU utilization',        threshold: '> 50% during tasks',  where: 'nvidia-smi' },
    { metric: 'Per-tempo incentive',    threshold: 'rising/flat',         where: 'btcli subnet metagraph --netuid 57' },
  ],

  knownIssues: [
    { symptom: 'Cannot clone Nickel5-Inc/Gaia',
      cause:   'Repository URL listed in subnet metadata returns 404 as of 2026-06-01.',
      fix:     'Reach the team via @Gaia_AI_ on X or the SN57 Bittensor Discord channel for the current install path.' },
    { symptom: 'Score equals climatology baseline',
      cause:   'Model is regressing to long-run means rather than capturing day-to-day signal.',
      fix:     'Add ECMWF + SMAP + Sentinel features; fine-tune Aurora rather than using it raw.' },
    { symptom: 'Bandwidth costs blow up',
      cause:   'Pulling Sentinel-2 / ECMWF data on every task instead of caching.',
      fix:     'Pre-cache global reference data on local SSD; refresh on schedule, not per-task.' },
  ],

  notes: [
    'Repo URL https://github.com/Nickel5-Inc/Gaia was unreachable at verification time — treat install instructions here as provisional pending the official guide.',
    'Two EGU25 abstracts accepted on the soil-moisture pipeline — closest thing to a public methodology disclosure.',
    'Partnership with SN13 (Macrocosmos / Data Universe) feeds in real-time extreme-weather signal.',
  ],
};
