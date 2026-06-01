import type { RichPlaybook } from '../playbook-rich';

// SN84 — ChipForge (TATSU Ecosystem). Decentralized chip-design subnet:
// miners submit Verilog/SystemVerilog RTL against challenge specs, and
// validators run EDA toolchains to score on functionality (and over time,
// area / delay / power). Repo: TatsuProject/ChipForge_SN84. Python 3.12,
// .env-driven, and a CLI workflow (download → solve → submit).

export const sn84: RichPlaybook = {
  slug: '84-84',
  netuid: 84,
  name: 'ChipForge',
  category: 'reason',
  categoryLabel: 'Hardware / RTL',

  blurb:
    'Kaggle-style competition for silicon. Miners download chip-design challenges, write Verilog/SystemVerilog RTL, and submit solutions that validators score with EDA tools (currently functionality-weighted).',

  whatMinersDo:
    'You pull a challenge spec from the Chipforge Challenge Server (interface + functional requirements + future PPA targets), build synthesizable Verilog/SystemVerilog RTL that meets it, and submit a solution archive via the CLI. Validators run testbenches and (over time) full EDA flows to score functionality + area + delay + power; today functionality is 100% of the weight.',

  verifiedAt: '2026-06-01',
  verifiedBy: '@editorial',

  emission: '— τ/day',
  burnCostFallback: '— τ',
  minerCountFallback: 0,
  slotCap: 256,

  hardware: [
    {
      role: 'Workstation',
      count: '1',
      cpuCores: 8,
      ramGb: 32,
      diskGb: 200,
      bandwidth: 'normal home / colo connection',
      notes: 'Local sim + small synthesis runs benefit from many cores. GPU is only useful if you are running AI-assisted RTL generation locally.',
    },
  ],
  hardwareNote:
    'Not GPU-bound. The bottleneck is RTL design skill (and/or LLM-assisted design quality), not compute. EDA tooling access (Yosys, OpenLane, or commercial) on your workstation accelerates iteration but is not required for submission.',

  rentalOk: true,
  rentalUsdPerHr: { lambda: 1.99, runpod: 1.89, coreweave: 2.10 },

  repo: {
    url: 'https://github.com/TatsuProject/ChipForge_SN84',
    branch: 'main',
    minerEntrypoint: 'start_miner.sh',
  },

  setupShape: 'simple-binary',
  setupOverview:
    'Install Python 3.12 + the repo, configure a .env with your wallet and Challenge Server API parameters, then iterate: pull a challenge with miner_cli.py download → write RTL → submit with miner_cli.py submit. A long-running miner process (start_miner.sh) also picks up new challenges automatically.',

  install: [
    { step: 'Clone the repo',
      cmd:  'git clone https://github.com/TatsuProject/ChipForge_SN84 && cd ChipForge_SN84' },
    { step: 'Install Python 3.12 dependencies',
      cmd:  'pip install -r requirements.txt && pip install -e .' },
    { step: 'Copy .env.example → .env and fill in wallet + API config',
      cmd:  'cp .env.example .env',
      note: 'Set wallet name, hotkey, and Chipforge Challenge Server API endpoint/keys per the example file.' },
    { step: 'Create wallet + register on SN84',
      cmd:  'btcli wallet new_coldkey --wallet.name $WALLET && btcli wallet new_hotkey --wallet.name $WALLET --wallet.hotkey $HOTKEY && btcli subnet register --netuid 84 --wallet.name $WALLET --wallet.hotkey $HOTKEY --subtensor.network finney' },
  ],

  runSteps: [
    { step: 'Download a challenge',
      cmd:  'python3 python_scripts/miner_cli.py download',
      note: 'Pulls the latest challenge spec + interface files into the working directory.' },
    { step: 'Write your RTL solution', note: 'Implement the spec in Verilog/SystemVerilog. Match the interface exactly — interface mismatches fail testbench compilation.' },
    { step: 'Submit the solution archive',
      cmd:  'python3 python_scripts/miner_cli.py submit solution.zip --check_status',
      note: 'Submission is scored on testbench pass/fail + spec compliance; --check_status polls for the result.' },
    { step: '(Optional) Run the background miner',
      cmd:  'nohup ./start_miner.sh > miner.log 2>&1 &',
      note: 'Continuously picks up new challenges. Tail with `tail -f miner.log`.' },
  ],

  envVars: [
    { name: 'WALLET',                       description: 'Coldkey name',                                        required: true },
    { name: 'HOTKEY',                       description: 'Hotkey name on that coldkey',                         required: true },
    { name: 'CHIPFORGE_API_URL',            description: 'Chipforge Challenge Server endpoint (per .env.example)', required: true },
    { name: 'CHIPFORGE_API_KEY',            description: 'API key for the Challenge Server (per .env.example)',   required: true },
  ],

  scoring: {
    summary:
      'Currently 100% Functionality Score — testbench pass/fail + spec compliance, run by validators against industry/open EDA flows. Future versions will add area, delay, and power into a composite PPA score; designs that fail functional verification drop out entirely.',
    rule: 'Functionality (today) → per-tempo composite PPA (roadmap). Deterministic scoring against the testbench, so the same RTL gets the same score across validators.',
    cheatPath:
      'Cannot fake silicon performance — EDA flows are deterministic and measure real timing/power/area on the submitted RTL. Plagiarized designs from previous challenges either fail the new spec or are outscored by genuine improvements; scoring is grounded in physics, not text similarity.',
  },

  profitability: {
    estimatedDailyEmissionPerUid: 0.0,
    tokenPriceUsdFallback: 284,
    capexNote:
      'Capex-light — a developer workstation is enough. Cost is engineer-time, not GPUs. AI-assisted RTL generation (Verilog-focused LLMs) is increasingly competitive.',
    notes:
      'Edge comes from RTL skill + iteration speed. If you can pair a strong hardware engineer with an AI design assistant, you outpace single-mode miners.',
  },

  milestones: [
    { day: 'day 1',  target: 'First challenge downloaded + solution submitted', note: 'Just get a passing testbench on a simple challenge — validates the wallet + API plumbing.' },
    { day: 'day 7',  target: 'Multiple challenges submitted, non-zero incentive', note: 'Iterate on harder challenges; failing testbenches teach you the spec format.' },
    { day: 'day 14', target: 'Out of immunity window', note: 'Compare to top miners — what RTL patterns are scoring highest?' },
    { day: 'day 30', target: 'Composite-PPA-ready', note: 'Future scoring weights area/delay/power; start optimizing those even before they count.' },
  ],

  monitoring: [
    { metric: 'Submissions per day',         threshold: '> 1',                  where: 'miner.log + Chipforge dashboard' },
    { metric: 'Testbench pass rate',         threshold: '> 80%',                where: 'submission status endpoint' },
    { metric: 'Per-tempo incentive',         threshold: 'rising / flat',        where: 'btcli subnet metagraph --netuid 84' },
  ],

  knownIssues: [
    { symptom: 'Submission fails testbench compile', cause: 'Interface signal names / widths do not match the challenge spec.', fix: 'Re-read the interface file from the challenge download verbatim; pin signal types exactly.' },
    { symptom: 'Submission accepted but scores zero', cause: 'Testbench runs but functional checks fail mid-simulation.',       fix: 'Run the testbench locally with iverilog/Verilator before submitting.' },
    { symptom: 'CLI cannot reach Challenge Server',   cause: 'CHIPFORGE_API_URL / API_KEY misconfigured in .env.',              fix: 'Re-verify .env.example values; confirm network egress to the API host.' },
  ],

  notes: [
    'ChipForge is part of the TATSU ecosystem (@tatsuecosystem) — a broader decentralized AI + hardware project.',
    'A flagship outcome to date is an industrial-grade RISC-V processor with cryptographic capability produced through community competition.',
    'Functionality is the only scored dimension today — future scoring will weight area/delay/power, so optimizing those now is forward-compatible.',
  ],
};
