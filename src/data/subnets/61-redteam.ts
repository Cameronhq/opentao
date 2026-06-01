import type { RichSubnet } from '../subnet-rich';

export const sn61: RichSubnet = {
  slug: '61-redteam',
  netuid: 61,
  name: 'RedTeam',
  shortPitch: 'Decentralized red-team for bot detection and adversarial cybersecurity.',
  overview: [
    'RedTeam (SN61) is a joint project from cybersecurity firm Innerworks and Bittensor. It runs a continuous adversarial tournament where developers submit code that tries to bypass bot detection systems — and get paid in TAO when their attacks work.',
    'The subnet operationalizes a simple insight: bot detection only gets better when smart adversaries keep attacking it. Where defensive vendors usually red-team their own products in private, RedTeam turns the whole exercise into an open challenge, then folds the winning attacks back into an open-source defensive library that the network — and partners like Innerworks — can train against.',
    'Miners submit automation, evasion, and behavioral mimicry techniques. Validators score them by running submissions against existing detection models and measuring how successfully they pass as human. The harder the existing defense, the bigger the payout for breaking it.',
    'RedTeam\'s long-term ambition is to be the default decentralized bounty platform for cybersecurity — enterprises post challenges, the swarm attacks them, and findings flow back to defenders. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Detection target', body: 'Validator publishes a bot-detection challenge — a model, a CAPTCHA, a behavioral signal — and asks miners to find an exploit.', dataK: 'payload', dataV: 'Detection target spec' },
    compute:   { actor: 'Miner',     title: 'Build the bypass', body: 'Miner writes code or behavioral patterns that attempt to defeat the detection system while looking convincingly human.', dataK: 'latency',  dataV: 'hours per round' },
    score:     { actor: 'Validator', title: 'Bypass rate', body: 'Validator runs miner submissions against the detection target and scores how often the bypass succeeds, weighted by novelty.', dataK: 'scale',    dataV: '0–1 bypass success' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Designs and submits adversarial code or behavioral profiles that defeat existing bot detection systems.',
    input: 'Detection target description, API or model endpoint to attack.',
    output: 'Bypass code or behavioral trace plus telemetry showing success rate.',
    hardware: 'Modest compute; the bottleneck is offensive security skill, not GPUs.',
    paidFor: 'Successfully bypassing detection in novel ways',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Hosts detection targets, evaluates miner bypasses against them, and submits weights based on bypass success and novelty.',
    requires: 'Detection models, behavioral signal pipelines, and sandboxed evaluation environment.',
    output: 'Weight vector ranking miners on real bypass success.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Pass as human, score as miner.',
    explanation: [
      'Each round, validators run miner-submitted bypasses against live detection systems and measure how often they succeed. Novelty matters: copying a known attack pattern earns less than discovering a new one, because the goal is to push defenses forward.',
      'Successful bypasses are open-sourced back into the RedTeam library, which raises the floor for the next round. Miners are running a treadmill — what worked last week may be patched this week, so the system rewards ongoing creativity rather than one-shot exploits.',
    ],
    cheatPath: 'Recycling a known evasion technique — novelty weighting drops the reward to near zero.',
  },
  customer: {
    leadOneLine: 'Any company that operates bot detection or fraud-prevention infrastructure.',
    explanation: [
      'Direct customer is Innerworks itself, which uses RedTeam findings to train its bot-detection products that protect financial-services and DeFi clients (Innerworks has publicized partnerships including 1inch).',
      'The longer-term market is enterprises posting their own detection systems as paid challenges — banks, exchanges, ad platforms — converting RedTeam into a continuous bug-bounty service for the bot/fraud surface. The buyer is the head of fraud or security at a high-volume consumer service.',
    ],
  },
  competitive: {
    scope: '2026 · adversarial security & bot detection',
    rows: [
      { name: 'RedTeam', subtitle: 'SN61', isSelf: true, approach: 'Open swarm of adversaries paid in TAO for defeating bot detection; findings open-sourced back into a library.', access: 'open · subnet', accessTone: 'open', differentiator: 'Continuous decentralized red-team; novelty-weighted scoring.' },
      { name: 'HackerOne / Bugcrowd', approach: 'Human bug-bounty marketplaces for enterprise programs.', access: 'open · platform', accessTone: 'open', differentiator: 'Broad scope, but no incentive-shaped continuous tournament for bot detection specifically.' },
      { name: 'Internal red teams', approach: 'In-house offensive security inside detection vendors.', access: 'closed · internal', accessTone: 'closed', differentiator: 'Limited to one company\'s creativity; RedTeam pools attackers across the internet.' },
      { name: 'Arkose Labs / hCaptcha R&D', approach: 'Vendor-driven adversarial research on CAPTCHA / bot systems.', access: 'closed · vendor', accessTone: 'closed', differentiator: 'Vendor-aligned only; no token-incentivized open swarm.' },
      { name: 'Academic adversarial-ML', approach: 'University research on adversarial examples and evasion.', access: 'open · paper', accessTone: 'open', differentiator: 'Slow publication cycle; RedTeam wants weekly tournaments.' },
    ],
    note: 'RedTeam\'s thesis is that adversarial pressure has to be continuous and economically rewarded to actually keep defenses honest. Bug bounties get part of the way there; a subnet-shaped tournament with novelty scoring tries to close the loop.',
  },
  team: {
    intro: [
      'RedTeam is operated by Innerworks, a UK-based cybersecurity company founded by Oliver Quie (CEO), Oscar Hayek, and Tom Ryan. Innerworks pioneered what it calls Synthetic Threat Intelligence — using AI-generated adversaries to harden bot detection — before partnering with Bittensor to launch the subnet in late 2024.',
      'Innerworks brings the defensive product surface (used by clients including 1inch) and the bot-detection ground truth; Bittensor provides the incentive layer and the global pool of attackers.',
    ],
    founders: [
      { initials: 'OQ', gradient: 'v', name: 'Oliver Quie', role: 'CEO, Innerworks', bio: '10+ years in identity and behavioral analytics. Founded Innerworks; co-launched RedTeam with Bittensor in December 2024.' },
      { initials: 'OH', gradient: 'a', name: 'Oscar Hayek', role: 'Co-founder, Innerworks', bio: 'Co-founder of Innerworks; works on Synthetic Threat Intelligence and the RedTeam product surface.' },
      { initials: 'TR', gradient: 'g', name: 'Tom Ryan', role: 'Co-founder, Innerworks', bio: 'Co-founder of Innerworks; operates the detection product line that RedTeam feeds into.' },
    ],
    size: 'Innerworks team + subnet operators',
    founded: '2024 (RedTeam subnet); Innerworks predates it.',
    based: 'UK',
    backers: 'Innerworks is a venture-backed cybersecurity company; specific RedTeam funding not separately disclosed.',
  },
  milestones: [
    { date: '2024·12', text: 'Innerworks and Bittensor launch RedTeam (SN61) jointly.' },
    { date: '2025', text: 'Continuous bypass tournaments running; findings folded into open-source detection library.' },
    { date: '2025·10', text: 'Innerworks announces 1inch partnership leveraging its threat-detection products.' },
  ],
  join: {
    title: 'Get paid to break things',
    body: 'If you do offensive security, automation, or behavioral mimicry research, RedTeam pays you continuously rather than once per bug. Novel bypasses score highest.',
    asideNote: 'AppSec / fraud-research background is the natural fit.',
  },
  tags: ['security', 'red-team', 'bot-detection', 'adversarial'],
  external: {
    website: 'https://innerworks.me/',
    twitter: 'https://x.com/RedTeam_Subnet',
    taostats: 'https://taostats.io/subnets/61/',
  },
  tweets: [
    { when: '2024·12', body: 'RedTeam is live: a decentralized hub for cybersecurity innovation on Bittensor.' },
  ],
};
