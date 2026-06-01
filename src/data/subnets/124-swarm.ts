import type { RichSubnet } from '../subnet-rich';

export const sn124: RichSubnet = {
  slug: '124-swarm',
  netuid: 124,
  name: 'Swarm',
  shortPitch: 'Decentralized open-source autopilot for autonomous drone flight.',
  overview: [
    'Swarm is Bittensor Subnet 124, the network\'s first robotics-focused subnet. It is engineered to enable decentralized autonomous drone flight by paying miners to produce reinforcement-learning policies that can fly a drone through synthetic missions inside a PyBullet physics simulator.',
    'Validators generate synthetic "map tasks" — sets of waypoints, obstacles, energy budgets, and time limits — and send them to miners. Miners return pre-trained RL policies (or sequences of motor commands) that validators then execute in a sandboxed Docker simulation. Successful, energy-efficient, collision-free flights earn higher weights and emissions.',
    'The mission goes beyond benchmarks: Swarm aims to keep aerial-autonomy software open and community-governed so UAVs become cheaper, safer, and more accountable, rather than locked behind defence-prime NDAs. Real-world traction includes selection into Enlaira, Andorra\'s official startup acceleration program (one of five companies chosen nationwide).',
    'One-line diff: a drone-autopilot research network paid in TAO, with the same incentive design used for LLMs aimed instead at robotics policies. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Generate map task', body: 'Validator procedurally generates a synthetic flight scenario — waypoints, obstacles, weather noise, energy and time budgets — and dispatches it to miners.', dataK: 'payload', dataV: 'synthetic map task' },
    compute:   { actor: 'Miner',     title: 'Return flight policy', body: 'Miner runs their pre-trained RL policy (or generates a deterministic plan) and returns the motor-command trajectory needed to reach the goal.', dataK: 'latency',  dataV: 'plan per task' },
    score:     { actor: 'Validator', title: 'Sim replay + grade', body: 'Validator replays the plan in PyBullet inside a secure Docker container; rewards safe, fast, energy-efficient completion; penalises crashes, timeouts, and energy overruns.', dataK: 'scale',    dataV: 'safety × efficiency × time' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Train RL drone-flight policies (PPO, SAC, custom) and serve them to validators that score in a PyBullet simulator.',
    input: 'Validator-issued synthetic map tasks (waypoints, obstacles, budgets)',
    output: 'RL policy / motor command sequence per task',
    hardware: 'GPU node for RL training; inference is light',
    paidFor: 'Producing policies that fly the drone safely, quickly, and efficiently across diverse maps',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Generate synthetic map tasks, run miner policies in PyBullet inside Docker, score on safety/efficiency/time, set weights.',
    requires: 'Bittensor validator stake, Swarm validator stack with PyBullet + Docker, GPU optional',
    output: 'Weight vector concentrating emission on best autopilot policies',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Win by flying safely, fast, and efficiently across an unpredictable distribution of maps.',
    explanation: [
      'Each map task carries explicit budgets: time-to-goal, energy, and a safety constraint (no collisions). Validators score by replaying the miner\'s plan inside a deterministic PyBullet simulation and computing a composite reward that rewards completion and penalises overruns. Because validators procedurally generate maps, miners cannot pre-compute solutions.',
      'The Docker sandbox is structurally important — it prevents miners from leaking state across tasks, copying other miners\' policies at inference time, or exploiting validator-side computation. Policies that generalise across the map distribution earn most emission; brittle, one-trick policies fail on the next batch.',
    ],
    cheatPath: 'Hard-coding solutions for a fixed map set fails because validators procedurally generate new maps. Brute-force search over motor commands at validator-time is throttled by Docker time limits. The real attack surface is overfitting to a narrow map distribution — Swarm rotates obstacle layouts and budgets to keep that risk bounded.',
  },
  customer: {
    leadOneLine: 'UAV builders, drone-program operators, and government / defence agencies needing transparent autopilot stacks.',
    explanation: [
      'The longer-term customer surface is drone OEMs and operators who currently buy proprietary autopilot software with hard licensing terms or build in-house. Swarm\'s pitch is an open, continuously-improving autopilot core that any operator can audit, fork, and deploy without renegotiating IP.',
      'Near-term traction is government-adjacent: SN124 was selected by Enlaira, Andorra\'s national startup acceleration program (one of five chosen), as evidence that the subnet can compete with traditional startups for real customer slots. Commercial pilots and pricing details remain in development.',
    ],
  },
  competitive: {
    scope: 'autonomous-drone autopilot stacks · 2026',
    rows: [
      { name: 'Swarm', subtitle: 'SN124', isSelf: true, approach: 'Bittensor-incentivised RL policies for drone flight; PyBullet sim + Docker sandbox.', access: 'open · subnet + open-source policies', accessTone: 'open', differentiator: 'Only TAO-paid robotics subnet with selection into a national startup program (Enlaira / Andorra).' },
      { name: 'PX4 / ArduPilot', approach: 'Open-source flight-control firmware for hobbyist and commercial UAVs.', access: 'open · self-host', accessTone: 'open', differentiator: 'Industry-standard open autopilot but classical control, not learned policies, and no built-in contributor incentive.' },
      { name: 'Skydio', approach: 'Closed, vertically-integrated autonomous drones with proprietary autopilot.', access: 'closed · hardware + SDK', accessTone: 'closed', differentiator: 'Best-in-class consumer autonomy but fully proprietary stack and US-export-controlled.' },
      { name: 'Shield AI', approach: 'Defence-grade autonomy software (Hivemind) for military UAVs.', access: 'closed · defence contracts', accessTone: 'closed', differentiator: 'Heavy defence customers and capability lead but black-box licensing and contract-only access.' },
      { name: 'AirSim / NVIDIA Isaac', approach: 'Simulation toolkits for RL on drones, robots, and AVs.', access: 'open · self-host', accessTone: 'open', differentiator: 'Strong sim tooling but no payout mechanism to crowdsource policies.' },
    ],
    note: 'Open-source autopilot stacks (PX4, ArduPilot) own the hobbyist and small-commercial market with classical control; closed vendors (Skydio, Shield AI) own the high-end consumer and defence segments with vertically-integrated software. Swarm targets a third lane: TAO-paid contributors continuously improving an open RL policy core that can plug into any drone using a standard autopilot bridge. The execution risk is the sim-to-real gap — PyBullet success has to translate into real flight.',
  },
  team: {
    intro: [
      'Swarm is operated by a small group of AI engineers and drone enthusiasts under the @SwarmSubnet brand. Their stated mission is to open-source the autopilot logic that defence primes and consumer-drone vendors keep proprietary, leaving aerial autonomy auditable and accountable.',
      'Named founder identities are not publicly listed on the team page; the strongest external validation to date is the Enlaira selection — Andorra\'s national startup acceleration program — as one of five companies chosen, beating traditional startups.',
    ],
    founders: [
      { initials: 'F1', gradient: 'v', name: '[Founder 1 name]', role: 'Co-founder · AI / robotics', bio: 'AI engineer leading the RL autopilot stack and validator infrastructure; identity not publicly disclosed.' },
      { initials: 'F2', gradient: 'a', name: '[Founder 2 name]', role: 'Co-founder · Drone systems', bio: 'Drone-systems engineer overseeing the PyBullet simulation stack and sim-to-real roadmap.' },
    ],
    size: 'Small team (AI + drone-systems engineering)',
    founded: '2025',
    based: 'Distributed (with Andorra ties via Enlaira)',
    backers: 'Selected into Enlaira (Andorra national startup program); no disclosed external investors.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Swarm launches as Subnet 124 — described as the first robotics subnet on Bittensor.' },
    { date: '2025', text: '100-day go-from-design-to-validation milestone publicly highlighted by the team.' },
    { date: '2025·Q4', text: 'SN124 selected for Enlaira, Andorra\'s official startup acceleration program (1 of 5 nationwide).' },
  ],
  join: {
    title: 'Train the open-source autopilot',
    body: 'Spin up a Bittensor miner against the Swarm subnet, train an RL policy on PyBullet drone tasks, and serve it to validators. Policies that complete maps safely, quickly, and efficiently across diverse synthetic scenarios earn emission and shape the open autopilot core.',
    asideNote: 'Setup: github.com/swarm-subnet/swarm · swarm.aero for mission framing · @SwarmSubnet on X for updates.',
  },
  tags: ['robotics', 'drones', 'reinforcement-learning', 'autopilot', 'simulation'],
  external: {
    github: 'https://github.com/swarm-subnet/swarm',
    website: 'https://www.swarm.aero/',
    twitter: 'https://x.com/SwarmSubnet',
    taostats: 'https://taostats.io/subnets/124/',
  },
  tweets: [
    { when: '2025', body: '"Swarm is a Bittensor subnet engineered to enable decentralized autonomous drone flight. Validators create synthetic ‘map tasks\' and evaluate miner-supplied pre-trained RL policies inside a PyBullet physics simulator." — @CryptoZPunisher.' },
    { when: '2025', body: '"Swarm\'s SN124 Enlaira selection is $TAO\'s & Alpha undervaluation proof. A subnet just beat traditional startups in a government competition." — @bittingthembits.' },
  ],
};
