import type { RichSubnet } from '../subnet-rich';

export const sn25: RichSubnet = {
  slug: '25-mainframe',
  netuid: 25,
  name: 'Mainframe',
  shortPitch: 'A Bittensor subnet for decentralized scientific compute — starting with protein folding.',
  overview: [
    'Mainframe is the subnet operated by Macrocosmos for generalized decentralized scientific compute. Originally launched as the Protein-Folding subnet in June 2024, Mainframe runs molecular-dynamics simulations via OpenMM and protein-ligand docking via DiffDock. Miners contribute GPU compute to fold proteins; validators verify simulation outputs against scientific constraints. The customer outside Bittensor is a drug-discovery lab.',
    'The subnet uses a standard metagraph. Each tempo the validator dispatches a folding job — a target protein, a simulation length, a docking task — to active miners. Miners run the simulation on local GPUs and return the trajectory or docked pose. Validators verify the energy, geometry, and convergence of the result against scientific ground truth.',
    'The pitch is hard scientific: in less than a year after launch, Mainframe folded more proteins than Folding@Home managed in its first decade. The subnet has reported 162,200 proteins folded, simulation throughput of ~132,000 nsec/day, and roughly 17 petaflops of effective compute — 20% more than Folding@Home today. The customer is anyone running molecular-dynamics in a drug-discovery pipeline.',
    'Where AlphaFold gives a single static structure prediction, Mainframe runs full molecular-dynamics trajectories — the actual physics of protein motion that drug discovery requires. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Dispatch folding job', body: 'Pick a target protein and a simulation length (or a ligand-docking pair) and broadcast the job spec to active miners.', dataK: 'payload', dataV: 'Protein PDB + simulation params' },
    compute:   { actor: 'Miner',     title: 'Run MD simulation', body: 'Each miner runs OpenMM or DiffDock on local GPUs to produce the simulation trajectory or the docked pose. Returns the trajectory to the validator.', dataK: 'latency',  dataV: 'hours to days · job-dependent' },
    score:     { actor: 'Validator', title: 'Verify physics', body: 'Check energy conservation, geometry, convergence to scientific ground truth. Compare against known structures where available.', dataK: 'scale', dataV: 'energy · geometry · convergence' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs molecular-dynamics simulations and protein-ligand docking on local GPUs.',
    input: 'Target protein PDB + simulation parameters (or ligand for docking)',
    output: 'Trajectory / docked pose with energy and geometry data',
    hardware: 'GPU-heavy · A100 or H100 strongly preferred for production-grade throughput',
    paidFor: 'Producing scientifically valid simulation results',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Dispatches folding jobs, verifies physics of returned trajectories, submits weights.',
    requires: 'Top-N stake + OpenMM/DiffDock validation stack + scientific ground-truth references',
    output: 'Per-UID weight vector, signed on-chain',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Did the protein actually fold according to physics?',
    explanation: [
      'The validator dispatches a folding job — a target protein with simulation parameters, or a protein-ligand docking task — to every active miner. Each miner runs the simulation (OpenMM for molecular dynamics, DiffDock for ligand docking) on local GPUs and returns the trajectory and energy data. The validator then verifies the result against physics: energy conservation, geometry constraints (bond lengths, angles, no atom clashes), convergence to a stable state, and where ground-truth structures are known, RMSD to the published structure.',
      'The scoring rewards scientific validity over raw speed. A fast simulation that violates energy conservation scores zero. A slow but rigorous simulation scores high. Drug-discovery customers care about reproducibility, not benchmark posturing — and that\'s what the validator enforces.',
    ],
    cheatPath: 'Returning a low-resolution interpolation of known structures — fails the trajectory-detail check. Skipping simulation timesteps — energy curves go non-physical and the validator catches it. Faking trajectories with random noise — fails geometry and convergence checks immediately. The Macrocosmos team has published weight-transparency methodology specifically to make cheating visible.',
  },
  customer: {
    leadOneLine: 'The customer outside Bittensor is a drug-discovery lab.',
    explanation: [
      'Most drug-discovery pipelines need either protein-folding (to understand a target structure) or protein-ligand docking (to test candidate molecules against the target). AlphaFold solves the static-structure problem cheaply but ignores dynamics. Centralized molecular-dynamics services (Schrödinger, OpenEye) cost tens of thousands of dollars per workflow and are gatekept by enterprise contracts. Mainframe runs the same workloads on a decentralized GPU pool — same OpenMM stack, much lower cost per query.',
      'Concretely: Macrocosmos has publicly partnered with Rowan (a computational-chemistry company) to accelerate next-generation neural-network potentials, and is positioned as the protocol\'s first decentralized-science subnet. The customer never sees Bittensor under the hood — they see a cheaper, parallel-scale MD compute service.',
    ],
  },
  competitive: {
    scope: 'molecular-dynamics & drug discovery · 2026',
    rows: [
      { name: 'Mainframe', subtitle: 'SN25', isSelf: true, approach: 'Decentralized MD + docking tournament on Bittensor', access: 'open · API', accessTone: 'open', differentiator: '~17 petaflops effective · 162K+ proteins folded · scientific validity scoring' },
      { name: 'Folding@Home', approach: 'Volunteer-compute distributed-MD network (donated CPU/GPU)', access: 'open · volunteer', accessTone: 'open', differentiator: 'Pure volunteer · no economic incentive · throughput plateauing' },
      { name: 'AlphaFold', approach: 'DeepMind\'s static structure-prediction model', access: 'open weights', accessTone: 'open', differentiator: 'Best structure prediction · no dynamics · single-shot output' },
      { name: 'Schrödinger', approach: 'Centralized commercial MD + drug-discovery platform', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Industry standard · 6-figure contracts · slow procurement' },
      { name: 'OpenEye / OE Apps', approach: 'Commercial molecular-modeling toolkit', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Strong toolchain · expensive · vertical integration' },
    ],
    note: 'AlphaFold solves structure prediction; Mainframe solves dynamics. Folding@Home runs on donated compute but has no economic mechanism to scale supply. Schrödinger has the science but is gatekept by enterprise pricing. Mainframe\'s pitch is: take the same OpenMM / DiffDock stack the labs already use, point it at a TAO-incentivized GPU pool, and the unit economics flip in the customer\'s favor.',
  },
  team: {
    intro: [
      'Mainframe is operated by Macrocosmos, a research-grade subnet team that also operates other subnets across the Bittensor ecosystem. The team has a mix of computational-biology and ML systems backgrounds and has published the weight-transparency methodology that makes the validator\'s scientific-validity scoring auditable from outside.',
      'The pitch they make: Bittensor is the best platform for decentralized science because it natively prices compute and verification. Mainframe proves that out for life sciences — and the same template extends to any other compute-heavy scientific workload.',
    ],
    founders: [
      { initials: 'MC', gradient: 'v', name: '[Macrocosmos core team]', role: 'Subnet operator', bio: 'Macrocosmos operates Mainframe along with several other Bittensor subnets. Public engineering output is visible at github.com/macrocosm-os.', github: 'https://github.com/macrocosm-os' },
    ],
    size: '~10+ across Macrocosmos\' subnet portfolio',
    founded: '2024·06 · launched as Protein-Folding, later renamed Mainframe',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024·06', text: 'Subnet 25 launches as Protein-Folding — the first decentralized-science subnet on Bittensor.' },
    { date: '2024·Q4', text: 'OpenMM-based molecular-dynamics fully wired into the validator scoring.' },
    { date: '2025·Q1', text: 'Subnet renamed to Mainframe — generalized scientific compute beyond protein folding.' },
    { date: '2025·Q2', text: 'DiffDock-based protein-ligand docking added to the job mix.' },
    { date: '2025·Q3', text: '162K+ proteins folded since launch — more in one year than Folding@Home in a decade.' },
    { date: '2025·Q4', text: 'Partnership with Rowan announced for next-gen neural-network potentials.' },
  ],
  join: {
    title: 'Contribute GPU compute to science',
    body: 'Hardware spec (A100 / H100 preferred), install steps, and reference miner are in macrocosm-os/mainframe and macrocosm-os/folding. Validators welcome — OpenMM validation stack + top-N stake.',
    asideNote: 'Validating? OpenMM/DiffDock validation stack + top-N stake. Reference validator in the Macrocosmos GitHub org.',
  },
  tags: ['desci', 'compute', 'protein-folding', 'drug-discovery', 'ai-model'],
  external: {
    github: 'https://github.com/macrocosm-os/mainframe',
    website: 'https://www.macrocosmos.ai',
    twitter: 'https://twitter.com/MacrocosmosAI',
    taostats: 'https://taostats.io/subnets/25/',
  },
};
