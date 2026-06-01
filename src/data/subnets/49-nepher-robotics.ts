import type { RichSubnet } from '../subnet-rich';

export const sn49: RichSubnet = {
  slug: '49-nepher-robotics',
  netuid: 49,
  name: 'Nepher Robotics',
  shortPitch: 'Tournament network for sim-to-real robotic control policies.',
  overview: [
    'Nepher Robotics (SN49) runs a decentralized tournament where miners submit trained robot control policies and validators evaluate them inside NVIDIA Isaac Sim / Isaac Lab environments. The best policy in each task takes the emissions — and the winning weights get open-sourced to a public registry called SimStore.',
    'The pitch is sim-to-real reinforcement learning as a competitive sport. Instead of one lab grinding ablations behind closed doors, Nepher uses Bittensor\'s 192-slot incentive to keep dozens of teams iterating in parallel against the same standardized benchmark — manipulation, locomotion, navigation, all in physics-faithful simulation.',
    'Tooling ships as Python packages on PyPI plus a Tournament API and EnvHub SDK that lets third parties define new robot tasks, package them as Isaac Lab environments, and put them on the leaderboard. Miners pull tasks, train policies offline, then submit checkpoints; validators run them in deterministic eval rigs.',
    'Open-sourcing winning policies is the network\'s value-capture story: companies that need a controller for a specific arm or quadruped can grab the best public solution and skip the months of bootstrapping. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue task', body: 'Validators publish an Isaac Lab task spec — robot, environment, reward function, observation space — and the deterministic eval seeds miners must beat.', dataK: 'payload', dataV: 'Isaac Lab task + seeds' },
    compute:   { actor: 'Miner',     title: 'Submit policy', body: 'Miners train RL or imitation-learning policies offline and submit serialized checkpoints (PyTorch / ONNX) referencing the task ID.', dataK: 'latency',  dataV: 'training offline, submit-on-demand' },
    score:     { actor: 'Validator', title: 'Roll out in sim', body: 'Validators load each checkpoint into Isaac Sim and roll out N episodes per seed, ranking by task return and stability.', dataK: 'scale',    dataV: 'multi-episode tournaments' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Trains and submits robot control policies for whatever task the network is currently running.',
    input: 'Task spec, observation/action schema, evaluation seeds from validators.',
    output: 'Trained policy checkpoint with metadata for deterministic replay.',
    hardware: 'GPU box for RL training (A6000 / H100 class typical); Isaac Sim local rig for self-evaluation.',
    paidFor: 'Average evaluation return on validator rollouts; "winner takes the weights" dynamic per tournament.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Defines tasks, runs Isaac Sim rollouts, ranks policies and submits weights.',
    requires: 'GPU for Isaac Sim, deterministic evaluation harness, current EnvHub catalog.',
    output: 'Per-miner score derived from rollout returns.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Highest expected return on the standardized Isaac Lab rollout wins the epoch.',
    explanation: [
      'Each task ships with a fixed reward function, fixed seeds, and a fixed episode budget. Validators run every submitted policy through the same harness and average the returns. The "tournament" framing means scores are competitive — your value is your rank, not your absolute number.',
      'Open-sourcing winning policies to SimStore creates a public ratchet. The bar to win goes up every cycle because last week\'s winner becomes everyone\'s starting checkpoint.',
    ],
    cheatPath: 'Overfitting to public seeds doesn\'t survive — validators rotate held-out seeds and rerun in fresh sim instances; submitting a policy that memorizes trajectories collapses on new conditions.',
  },
  customer: {
    leadOneLine: 'Robotics teams who need a working controller without a six-month RL research project.',
    explanation: [
      'The downstream buyer is anyone deploying a robot: warehouse automation, surgical assistants, agricultural arms, quadrupeds for inspection. SimStore makes winning policies publicly forkable, which is unusual — most RL labs treat learned controllers as proprietary IP.',
      'For Nepher itself, longer-term monetization plausibly comes from custom-task contracts: a customer pays to put their specific robot + environment on the network and lets the global miner pool race to solve it.',
    ],
  },
  competitive: {
    scope: '2026 · sim-to-real robotic policy training',
    rows: [
      { name: 'Nepher Robotics', subtitle: 'SN49', isSelf: true, approach: 'Open tournament on Isaac Lab; miners submit policies; winners are open-sourced to SimStore.', access: 'open · API', accessTone: 'open', differentiator: 'Public leaderboard + emissions force compounding policy improvement across the field.' },
      { name: 'Skild AI',           approach: 'Foundation-model approach to general robot brains; closed commercial lab.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Single team, single model, billion-dollar funding round.' },
      { name: 'Physical Intelligence', approach: 'Vision-language-action models for robots; closed model API.', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Generalist policies, not task-specific tournaments.' },
      { name: 'NVIDIA GR00T',       approach: 'NVIDIA\'s humanoid foundation model + Isaac Sim ecosystem.', access: 'closed · partner', accessTone: 'closed', differentiator: 'Same sim stack, but model gating is centralized.' },
      { name: 'Open X-Embodiment',  approach: 'Cross-institution academic dataset + policy release.', access: 'open · dataset', accessTone: 'open', differentiator: 'Static dataset, no incentive for continued improvement.' },
    ],
    note: 'Nepher\'s wedge is the combination of Isaac Lab fidelity, an open leaderboard, and TAO emissions that keep many miners grinding on the same task. The closed labs win on absolute scale; Nepher wins on iteration speed per task and on giving downstream users a forkable artifact.',
  },
  team: {
    intro: [
      'Nepher operates as nepher-ai with active GitHub contributors who use pseudonymous handles (akhenova, Superstar221, camminatore21, qvantax). The org has shipped ~90+ commits as of early 2026 plus a PyPI release, Tournament API, and EnvHub SDK.',
      'Public-facing identity is light — the team is currently behind GitHub handles and a docs site rather than named founders. Treat the named entries below as placeholders pending a public bio.',
    ],
    founders: [
      { initials: 'NA', gradient: 'a', name: '[Founder 1 name]', role: 'Lead, Nepher AI', bio: 'Robotics + RL background; primary maintainer behind the Isaac Sim tournament harness.' },
    ],
    size: '~4-6',
    founded: '2025',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025·Q4', text: 'Nepher Robotics SN49 registers on Bittensor.' },
    { date: '2026·Q1', text: 'Tournament API and EnvHub SDK released; PyPI tooling published.' },
    { date: '2026·Q1', text: 'SimStore goes live as the open registry of winning policies.' },
  ],
  join: {
    title: 'Train a robot, win the epoch.',
    body: 'Miners need a GPU box and a working knowledge of Isaac Lab + reinforcement learning. Validators need a deterministic eval rig. Task authors can use EnvHub to propose new tournaments.',
    asideNote: 'Open-sourcing of winning policies is non-negotiable — the network\'s public-goods loop depends on it.',
  },
  tags: ['Robotics', 'Reinforcement Learning', 'Sim-to-Real', 'Isaac Sim'],
  external: {
    github: 'https://github.com/nepher-ai/nepher-subnet',
    website: 'https://nepher.ai/',
    taostats: 'https://taostats.io/subnets/49/',
  },
};
