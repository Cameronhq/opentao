import type { RichSubnet } from '../subnet-rich';

export const sn43: RichSubnet = {
  slug: '43-graphite',
  netuid: 43,
  name: 'Graphite',
  shortPitch: 'Decentralized solver network for graph optimization, starting with TSP.',
  overview: [
    'Graphite (Subnet 43, on-chain identity "ayin") is operated by GraphiteAI and turns combinatorial graph problems into a continuous mining task. The initial focus is the Traveling Salesman Problem — a classical NP-hard problem whose instances scale exponentially with city count — but the same incentive scaffold applies to any optimization workload that has a verifiable cost function.',
    'Validators construct TSP instances of varying size, broadcast them to miners, and grade returned tours by tour length and constraint feasibility. Yuma aggregates the validator weights every tempo, so emission flows to solvers who consistently produce the shortest valid tours.',
    'The customer is anyone with combinatorial optimization workloads: logistics planners, route schedulers, semiconductor place-and-route teams, and OR-as-a-service buyers who today pay for Gurobi, OR-Tools, or in-house heuristics. The subnet sells "best-effort optimization" as an API instead of a license.',
    'Differentiator: continuous competitive pressure between heuristic solvers, rather than a frozen library release. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Generate TSP', body: 'Validators sample a TSP instance (graph with edge weights) of a chosen size and broadcast it to miners.', dataK: 'payload', dataV: 'graph + n cities' },
    compute:   { actor: 'Miner',     title: 'Solve', body: 'Miners run their solver (heuristic, metaheuristic, or learned) and return a Hamiltonian tour with its cost.', dataK: 'latency',  dataV: 'per-instance' },
    score:     { actor: 'Validator', title: 'Score tour', body: 'Validators check feasibility, recompute tour length, and rank miners by shortest valid tour.', dataK: 'scale',    dataV: 'tour length' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Solves TSP / graph-optimization instances and returns valid low-cost solutions.', input: 'Graph with edge weights from the validator.', output: 'Hamiltonian tour (or other valid solution) with cost.', hardware: 'CPU-heavy for metaheuristics; optional GPU for learned solvers.', paidFor: 'Producing the shortest valid tour against each instance.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Generates TSP instances, verifies feasibility, ranks miners by tour cost.', requires: 'Subnet node + scoring code; baseline solver libraries.', output: 'Per-miner weight vector based on tour rank.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Score = inverse of valid tour length on each broadcast instance.', explanation: [
    'Validators recompute the cost of each submitted tour and verify that it visits every node exactly once. Invalid tours score zero; valid tours are ranked by length, with the shortest taking the bulk of the weight.',
    'Because the cost function is objective and verifiable, miners cannot win by stylistic tricks — they must improve their solver. The instance distribution covers multiple problem sizes so generalization is required.',
  ], cheatPath: 'Submitting infeasible tours or copying validator-baseline tours fails — both are caught at verification.' },
  customer:  { leadOneLine: 'Logistics, route planners, EDA, scheduling, and OR-as-a-service buyers.', explanation: [
    'TSP and its variants underpin a huge slice of industrial software: parcel routing, technician dispatch, VLSI place-and-route, drilling sequencing. The dominant tooling — Gurobi, CPLEX, OR-Tools — works but is either expensive or generic. Graphite sells a continuously-improving heuristic API instead.',
    'For decentralized AI buyers specifically, Graphite is a way to plug optimization into agent workflows without licensing a commercial solver — pay per query in TAO.',
  ] },
  competitive: { scope: '2026 · combinatorial optimization', rows: [
    { name: 'Graphite', subtitle: 'SN43', isSelf: true, approach: 'Competitive solver marketplace graded on tour cost.', access: 'open · API', accessTone: 'open', differentiator: 'Live solver competition; no license, pay per query.' },
    { name: 'Gurobi / CPLEX', approach: 'Commercial MILP solvers.', access: 'closed · license', accessTone: 'closed', differentiator: 'Gold-standard exact solvers, but expensive and not API-native.' },
    { name: 'Google OR-Tools', approach: 'Open-source CP / VRP toolkit.', access: 'open · lib', accessTone: 'open', differentiator: 'Free and capable, but no learning loop; tune-it-yourself.' },
    { name: 'Concorde', approach: 'Specialist exact TSP solver.', access: 'open · lib', accessTone: 'open', differentiator: 'Optimal for small TSP; impractical at industrial scale.' },
    { name: 'Learned solvers (research)', approach: 'GNN / RL solvers from academic groups.', access: 'open · research', accessTone: 'open', differentiator: 'Promising but not productized; Graphite is closest to a productized version.' },
  ], note: 'The Graphite bet is that a live, paid leaderboard for heuristics outperforms a license-once-and-forget commercial solver in the long tail of industrial optimization.' },
  team: { intro: [
    'Graphite is operated by GraphiteAI (graphite-ai.net), a small team focused on decentralized graph optimization on Bittensor. Public founder identities are limited; the team publishes documentation, miner/validator guides, and four reference TSP algorithms in the open-source repo.',
    'GraphiteAI is a distinct entity from the unrelated US code-review startup Graphite.dev (Merrill Lutsky); the subnet team operates under graphite-ai.net.',
  ], founders: [
    { initials: 'GA', gradient: 'g', name: '[Founder 1 name]', role: 'GraphiteAI team lead', bio: 'Operates the Graphite subnet; public identity not disclosed.' },
  ], size: 'Small core team', founded: '2024', based: 'Not publicly disclosed.', backers: 'Not publicly disclosed.', placeholder: true },
  milestones: [
    { date: '2024', text: 'Graphite (SN43) launched with TSP as the first benchmark and four reference algorithms.' },
  ],
  join: { title: 'Beat the baselines', body: 'If you have a TSP heuristic or learned solver, register as a miner — the baseline algorithms in the repo are deliberately beatable. Validators need only the subnet node and scoring code.', asideNote: 'Min/max stake bounds apply; see the docs/miner.md guide in the repo.' },
  tags: ['optimization', 'graphs', 'tsp', 'operations-research'],
  external: { github: 'https://github.com/GraphiteAI/Graphite-Subnet', website: 'https://graphite-ai.net/', taostats: 'https://taostats.io/subnets/43/' },
  tweets: [],
};
