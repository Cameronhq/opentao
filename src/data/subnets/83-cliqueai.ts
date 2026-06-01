import type { RichSubnet } from '../subnet-rich';

export const sn83: RichSubnet = {
  slug: '83-cliqueai',
  netuid: 83,
  name: 'CliqueAI',
  shortPitch: 'Decentralized solver network for maximum-clique graph problems.',
  overview: [
    'CliqueAI is Bittensor Subnet 83, an AI-powered network that finds maximum cliques in graphs. The maximum-clique problem is a classic NP-hard combinatorial task with applications in bioinformatics, social network analysis, fraud detection, and scheduling — CliqueAI turns it into a service backed by competing miners.',
    'Miners are given graphs by validators and submit candidate cliques. Validators verify the cliques (cheap — just check that every claimed edge exists and the subgraph is complete) and score by the size of the largest valid clique returned in the time budget. Because verification is trivial and search is hard, the subnet is a clean asymmetry play.',
    'The buyer outside Bittensor is any team that needs scaled combinatorial search as an API. The subnet runs the open-source toptensor/CliqueAI repo (~99% Python) and currently shows roughly 188 miners, 9 validators, and ~1,095 token holders.',
    'One-line diff: a TAO-incentivized solver-as-a-service for one of the canonical NP-hard problems. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send a graph', body: 'Validator transmits a graph instance (vertices, edges, time budget) to miners, drawn from a benchmark distribution that covers a range of densities and sizes.', dataK: 'payload', dataV: 'graph + budget' },
    compute:   { actor: 'Miner',     title: 'Search for clique', body: 'Miner runs heuristic + AI-augmented solvers (branch-and-bound, local search, learned heuristics) to find the largest clique it can within the time budget, then submits the candidate.', dataK: 'latency',  dataV: 'solve time per graph' },
    score:     { actor: 'Validator', title: 'Verify + rank by size', body: 'Validator cheaply verifies each submission is a valid clique, then ranks miners by the size of the largest valid clique they returned across the tempo\'s graph set.', dataK: 'scale',    dataV: 'clique size · valid %' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs combinatorial solvers (and optionally learned heuristics) to find maximum cliques in graphs sent by validators, returning candidates within a per-instance time budget.',
    input: 'Graph instance + time budget from validator',
    output: 'Candidate clique (set of vertices) for each graph',
    hardware: 'CPU-heavy; benefits from many cores and fast memory. GPU optional for learned heuristic models.',
    paidFor: 'Size of valid cliques returned across the tempo\'s benchmark set',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Issues graph instances, verifies miner submissions are valid cliques, ranks miners by best clique size, and submits a weight vector each tempo.',
    requires: 'Bittensor validator stake; cheap to verify since clique-checking is polynomial.',
    output: 'Weight vector across miner hotkeys per tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Largest valid clique wins — verification is cheap, search is hard, so the asymmetry favors honest miners.',
    explanation: [
      'For each graph in the tempo benchmark, miners are ranked by the size of the largest valid clique they submit. Invalid submissions (missing edges, non-cliques) are simply dropped. Across the full benchmark set, miners accumulate a score that maps directly to weights.',
      'The mechanism leans on the NP-hard / P-verifiable structure of max-clique: validators do not need expensive ground truth, they just need to verify the submitted vertex set is a clique. This keeps validator cost low and makes the subnet hard to game without doing real combinatorial work.',
    ],
    cheatPath: 'A miner cannot fake a clique — validators verify the submitted vertex set really is a complete subgraph, and invalid submissions drop out. The only edge is having better solvers (better branch-and-bound, smarter learned heuristics, more CPU). Memorizing benchmark instances also fails because validators rotate graphs from a parametric distribution.',
  },
  customer: {
    leadOneLine: 'Teams that need cheap, scaled combinatorial search — bioinformatics, fraud rings, social-network analysis, scheduling.',
    explanation: [
      'Maximum-clique solvers show up across many practical problems: identifying tightly connected protein interaction modules, detecting collusion rings in transaction graphs, finding consistent label assignments in vision tasks, and matching constraints in scheduling. CliqueAI exposes a decentralized solver as a callable service so that buyers can submit a graph and pull back the largest clique without running their own optimization cluster.',
      'Because the subnet incentivizes solver quality directly (bigger clique = more emissions), the long-run effect should be a continuously improving open solver — buyers benefit from the arms race between miners.',
    ],
  },
  competitive: {
    scope: 'Maximum-clique / NP-hard combinatorial solvers · 2026',
    rows: [
      { name: 'CliqueAI', subtitle: 'SN83', isSelf: true, approach: 'TAO-incentivized solver network with on-chain matchups; miners compete on clique size, validators verify cheaply.', access: 'open · API', accessTone: 'open', differentiator: 'Only decentralized network that pays miners directly for combinatorial-search quality.' },
      { name: 'Gurobi', approach: 'Industry-leading commercial MIP / combinatorial solver with branch-and-cut.', access: 'closed · license', accessTone: 'closed', differentiator: 'Best-in-class commercial solver but expensive licenses and single-vendor.' },
      { name: 'IBM CPLEX', approach: 'Mature commercial optimization suite supporting clique and ILP formulations.', access: 'closed · license', accessTone: 'closed', differentiator: 'Deep enterprise integration; closed pricing model.' },
      { name: 'NetworkX / igraph', approach: 'Open-source Python/R libraries with exact and approximate clique algorithms.', access: 'open · OSS', accessTone: 'open', differentiator: 'Free and ubiquitous, but no compute behind it — you bring your own CPU.' },
      { name: 'GraphLab / academic solvers', approach: 'Research-grade exact and heuristic max-clique implementations (PMC, MCS).', access: 'open · research', accessTone: 'open', differentiator: 'State-of-the-art on benchmarks; no productized API or hosted compute.' },
    ],
    note: 'CliqueAI\'s differentiator is incentives + hosted compute. Commercial solvers are accurate but pay-to-play; OSS libraries are free but force you to manage the cluster. CliqueAI lets a buyer hit one API and have a competitive pool of miners race to return the largest clique.',
  },
  team: {
    intro: [
      'CliqueAI is operated by TopTensor, a team focused on bringing classical hard combinatorial problems into the Bittensor incentive layer. The codebase (toptensor/CliqueAI) is open-source and roughly 99% Python plus shell scripts; the team maintains the network parameters and ships software updates.',
      'Public bios of individual contributors are not extensively published; the team\'s expertise is implied by the project itself, which sits at the intersection of graph algorithms and distributed AI.',
    ],
    founders: [
      { initials: 'TT', gradient: 'a', name: '[TopTensor core team]', role: 'Subnet owner / engineering', bio: 'TopTensor maintains the CliqueAI mechanism, network parameters, and miner / validator client software for SN83.' },
    ],
    size: 'Small core team plus open-source contributors',
    founded: '2025 (subnet launched late August 2025)',
    based: 'Not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025·08', text: 'CliqueAI subnet (SN83) goes live on Bittensor with the maximum-clique solver mechanism.' },
    { date: '2025', text: 'Open-source repo toptensor/CliqueAI published with miner and validator clients.' },
    { date: '2026', text: 'Network grows to ~188 miners, 9 validators, and over 1,000 token holders.' },
  ],
  join: {
    title: 'Run a CliqueAI solver',
    body: 'Clone toptensor/CliqueAI, plug in your solver (branch-and-bound, local search, or a learned heuristic), register a hotkey on subnet 83, and start responding to validator-issued graphs. CPU-heavy boxes with high memory bandwidth do well.',
    asideNote: 'Verification is cheap and rotation is real — invalid cliques score zero and benchmarks rotate.',
  },
  tags: ['combinatorial', 'graph', 'np-hard', 'optimization', 'data'],
  external: {
    github: 'https://github.com/toptensor/CliqueAI',
    website: 'https://cliqueai.toptensor.ai/',
    taostats: 'https://taostats.io/subnets/83/',
  },
};
