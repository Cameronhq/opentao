import type { RichSubnet } from '../subnet-rich';

export const sn84: RichSubnet = {
  slug: '84-84',
  netuid: 84,
  name: 'ChipForge',
  shortPitch: 'Decentralized chip design — Verilog submissions evaluated by EDA tools.',
  overview: [
    'ChipForge is Bittensor Subnet 84, the first digital design subnet for decentralized hardware innovation. Hardware engineers and AI tools compete in on-chain "challenges" to design real silicon — AI accelerators, cryptographic modules, mini-GPUs, RISC-V cores — with the highest-scoring Verilog submissions earning TAO rewards.',
    'For each challenge, miners download a specification, craft a Verilog design (either by hand or using AI-assisted tools), and submit completed RTL solutions to the network. Validators run industry-standard EDA toolchains to automatically evaluate each submission on functionality, timing, power, and area — the four classic PPA dimensions of hardware design.',
    'The subnet is developed as part of the broader TATSU ecosystem, which positions itself as a decentralized infrastructure for AI and hardware innovation. A flagship outcome so far is a complete industrial-grade RISC-V processor with cryptographic capability, generated through ChipForge\'s contributor competitions and producing FPGA-deployable RTL output.',
    'One-line diff: a Kaggle-style competition for silicon, where EDA tools are the judge and TAO is the prize. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Post a design spec', body: 'Validator publishes a chip-design challenge — for example a RISC-V core, AES accelerator, or matrix-multiply unit — with target functionality, interface, and PPA constraints.', dataK: 'payload', dataV: 'spec + interface' },
    compute:   { actor: 'Miner',     title: 'Submit Verilog RTL', body: 'Miner produces Verilog/SystemVerilog RTL that meets the spec (using human engineering and/or AI design tools) and submits it to the subnet for evaluation.', dataK: 'latency',  dataV: 'submission deadline' },
    score:     { actor: 'Validator', title: 'EDA-based PPA score', body: 'Validator runs industry EDA toolchains to verify functionality and measure timing, power, and area, producing a combined PPA score that maps to per-tempo weights.', dataK: 'scale',    dataV: 'PPA composite' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Designs digital logic in Verilog/SystemVerilog to meet ChipForge challenge specifications, optimizing for functional correctness plus performance / power / area.',
    input: 'Challenge spec + interface + PPA targets',
    output: 'Synthesizable Verilog RTL submission',
    hardware: 'Workstation-class compute for simulation and synthesis; access to EDA tooling helpful but not required for submission',
    paidFor: 'Highest-scoring valid Verilog submissions over the tempo',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Runs EDA toolchains to verify and score Verilog submissions on functionality, timing, power, and area, then submits a weight vector each tempo.',
    requires: 'Bittensor validator stake + access to industry EDA tools (or open-source synthesis flows)',
    output: 'Weight vector across miner hotkeys per tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'EDA-tool PPA evaluation — functionality, timing, power, area — is the score.',
    explanation: [
      'For each challenge, validators run the submitted RTL through standard EDA flows: functional simulation against a testbench, static timing analysis, power estimation, and area calculation. A composite PPA score combines these dimensions; designs that fail functional verification drop out entirely.',
      'Because EDA tooling produces deterministic numerical metrics, the scoring surface is reproducible and hard to game. Miners cannot win simply with a clever submission story — they have to ship RTL that actually meets the spec and beats other submissions on hard PPA numbers.',
    ],
    cheatPath: 'A miner cannot fake silicon performance — submissions are run through deterministic EDA flows that measure real timing, power, and area on the actual RTL. Plagiarized or copy-pasted designs from previous challenges either fail spec checks or get outscored by genuine improvements; the scoring is grounded in physics, not text similarity.',
  },
  customer: {
    leadOneLine: 'Hardware teams and edge-AI startups that need novel silicon designs without funding a full in-house design team.',
    explanation: [
      'The headline customer is anyone building edge-AI or specialized hardware: startups building inference accelerators, crypto / ZK hardware, sensor SoCs, or new RISC-V cores. ChipForge gives them a path to source competitive Verilog designs from a global pool of engineers and AI tools, with EDA scoring proving quality before they fab anything.',
      'A secondary buyer is open silicon programs — the project has already delivered an industrial-grade RISC-V core with cryptographic capability, which is exactly the kind of output that ecosystems like CHIPS Alliance and RISC-V International care about. The Bittensor incentive layer effectively turns chip design into a global open competition.',
    ],
  },
  competitive: {
    scope: 'Decentralized hardware design & open silicon · 2026',
    rows: [
      { name: 'ChipForge', subtitle: 'SN84', isSelf: true, approach: 'On-chain Verilog design competitions scored by EDA tools across PPA dimensions; TAO emissions reward best designs.', access: 'open · GitHub', accessTone: 'open', differentiator: 'Only network where chip design itself is the incentive surface — global contributors competing on real PPA.' },
      { name: 'OpenROAD / OpenLane', approach: 'Open-source RTL-to-GDS flow for digital ASIC design.', access: 'open · OSS', accessTone: 'open', differentiator: 'Tooling stack rather than a market — solves the EDA flow but no incentive layer.' },
      { name: 'Efabless / chipIgnite', approach: 'Open-shuttle silicon program letting designers tape out small chips on shared MPW runs.', access: 'open · service', accessTone: 'open', differentiator: 'Path to actual fab, but limited shuttle slots and no continuous competition mechanism.' },
      { name: 'Arm / SiFive IP', approach: 'Commercial CPU and IP licensing (Arm cores, SiFive RISC-V cores).', access: 'closed · license', accessTone: 'closed', differentiator: 'Industry-default high-quality IP; expensive licenses and closed development.' },
      { name: 'In-house ASIC teams', approach: 'Hyperscalers and AI labs designing accelerators internally (Google TPU, Meta MTIA, Tesla Dojo).', access: 'closed · internal', accessTone: 'closed', differentiator: 'World-class silicon but only available to the parent company.' },
    ],
    note: 'ChipForge\'s differentiator is the open competition itself. Open silicon programs solve fabrication; commercial IP solves quality but at a price. ChipForge plugs an incentive layer onto the design step so that good Verilog gets paid in TAO regardless of who wrote it.',
  },
  team: {
    intro: [
      'ChipForge is developed as part of the TATSU ecosystem, a decentralized infrastructure focused on AI and hardware innovation. The repository (TatsuProject/ChipForge_SN84) is the canonical implementation of the subnet and includes the challenge format, miner / validator clients, and EDA evaluation hooks.',
      'Specific founder identities are not widely publicized; the Tatsu Ecosystem brand operates the public channels (@TatsuEcosystem on X) and runs the design competitions.',
    ],
    founders: [
      { initials: 'TT', gradient: 'g', name: '[TATSU core team]', role: 'Subnet owner / TATSU Ecosystem', bio: 'TATSU operates ChipForge (SN84) and the broader decentralized AI + hardware ecosystem at tatsuecosystem.io.' },
    ],
    size: 'Small core team plus contributor pool',
    founded: '2025',
    based: 'Not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'ChipForge launches as Subnet 84 within the TATSU ecosystem.' },
    { date: '2025', text: 'First industrial-grade RISC-V processor with cryptographic capability produced through community competition.' },
    { date: '2025–26', text: 'Challenges expand across AI accelerators, cryptographic modules, mini-GPUs, and RISC-V cores.' },
  ],
  join: {
    title: 'Submit RTL to a ChipForge challenge',
    body: 'Pull the latest challenge spec from TatsuProject/ChipForge_SN84, build Verilog that meets the interface and PPA targets, and submit through the miner client. Strong hardware design instincts plus AI-assisted RTL tools tend to climb the leaderboard fastest.',
    asideNote: 'Scoring is deterministic — bad RTL fails the EDA flow, full stop.',
  },
  tags: ['hardware', 'chip-design', 'verilog', 'eda', 'risc-v'],
  external: {
    github: 'https://github.com/TatsuProject/ChipForge_SN84',
    website: 'https://tatsuecosystem.io',
    twitter: 'https://twitter.com/tatsuecosystem',
    taostats: 'https://taostats.io/subnets/84/',
  },
};
