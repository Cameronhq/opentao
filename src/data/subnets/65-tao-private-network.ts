import type { RichSubnet } from '../subnet-rich';

export const sn65: RichSubnet = {
  slug: '65-tao-private-network',
  netuid: 65,
  name: 'TAO Private Network',
  shortPitch: 'Decentralized VPN powered by geographically diverse miner exits.',
  overview: [
    'TAO Private Network (TPN, SN65) is a decentralized VPN built on Bittensor. Instead of a small set of company-owned servers, TPN routes traffic through an open network of independent miners scattered across the world, with the subnet incentive layer paying for geographic diversity and exit reliability.',
    'The thesis is that traditional VPNs are easy to detect and block: a finite set of known IP ranges that censors and anti-abuse systems can fingerprint and shut down. A VPN where every exit is a separately operated, dynamically priced miner — many of them in jurisdictions that incumbent VPNs avoid, like Iran or North Korea — is much harder to neutralize.',
    'Miners run exit nodes and are paid by the subnet according to their location uniqueness, uptime, and throughput. Validators continuously probe the network and weight miners on the diversity and quality of paths they actually provide. End users get a normal VPN interface — desktop and mobile clients — pointing at this decentralized backend.',
    'TPN positions itself against centralized VPN incumbents (NordVPN, ExpressVPN, Mullvad) and against decentralized peers (Mysterium, Orchid). <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Probe the network', body: 'Validator continuously probes miner exit nodes — checking reachability, location truthfulness, throughput, and latency from multiple vantage points.', dataK: 'payload', dataV: 'Probe + geo check' },
    compute:   { actor: 'Miner',     title: 'Serve traffic', body: 'Miner operates a VPN exit node with a verifiable geographic footprint, responding to probes and serving real user traffic.', dataK: 'latency',  dataV: 'ms RTT + uptime' },
    score:     { actor: 'Validator', title: 'Diversity × quality', body: 'Validator scores miners on location uniqueness, uptime, throughput, and behavior consistency, penalizing IP-spoofing or downtime.', dataK: 'scale',    dataV: '0–1 composite' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs a VPN exit node in a specific geographic location and serves user traffic with high uptime and throughput.',
    input: 'Encrypted user connection requests routed through the TPN client.',
    output: 'Forwarded internet traffic from the miner\'s real location, with verifiable geo and uptime signals.',
    hardware: 'A VPS or home node with stable bandwidth; the rarer the jurisdiction, the higher the reward.',
    paidFor: 'Providing reliable, geographically unique exit capacity',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Probes the miner network from many vantage points, scores location uniqueness and reliability, and submits weights.',
    requires: 'Distributed probe infrastructure, geolocation verification, and bandwidth/latency measurement.',
    output: 'Weight vector ranking miners on diversity-weighted quality of service.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'A useful exit is a real exit in a place no one else covers.',
    explanation: [
      'Validators reward miners whose location, uptime, and throughput are independently verifiable and whose IP space is not shared with a flood of other miners. Rare jurisdictions and high-quality service stack multiplicatively in the score.',
      'Spoofing matters more here than in most subnets — claiming to be in Tehran while running on AWS is a classic attack — so validators run multi-vantage-point geolocation probes and penalize any inconsistency between claimed and observed origin.',
    ],
    cheatPath: 'Renting cheap datacenter IPs in mainstream regions — diversity weighting and geo verification crash the score.',
  },
  customer: {
    leadOneLine: 'Anyone who needs internet access from somewhere a normal VPN cannot reach.',
    explanation: [
      'Consumer customers are the same audience that already buys NordVPN — privacy-conscious users, travelers, people behind restrictive networks — but TPN also targets users in heavily censored markets where mainstream VPNs are blocked or unreliable.',
      'The longer-term, more valuable buyer is the AI/agent stack: data-collection pipelines, scraping bots, and AI agents need legitimate residential or jurisdictionally diverse IPs to operate. TPN\'s pitch to that audience is "the AWS of decentralized VPNs" — buy capacity from a permissionless backend instead of one centralized vendor.',
    ],
  },
  competitive: {
    scope: '2026 · VPN & proxy networks',
    rows: [
      { name: 'TPN', subtitle: 'SN65', isSelf: true, approach: 'Open miner network of geographically diverse exits; pays for location uniqueness and reliability in TAO.', access: 'open · subnet', accessTone: 'open', differentiator: 'Censorship-resilient by design; rare jurisdictions are rewarded, not avoided.' },
      { name: 'NordVPN / ExpressVPN', approach: 'Centralized commercial VPNs with company-owned server fleets.', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Polished UX, easy to fingerprint and block at the IP level.' },
      { name: 'Mullvad', approach: 'Privacy-focused centralized VPN with strong no-logs posture.', access: 'closed · SaaS', accessTone: 'closed', differentiator: 'Best-in-class privacy ethos; still a finite known IP set.' },
      { name: 'Mysterium / Orchid', approach: 'Older decentralized VPN protocols with their own tokens.', access: 'open · decn', accessTone: 'decn', differentiator: 'Pioneered the space; TPN leverages Bittensor\'s incentive layer instead of a bespoke token economy.' },
      { name: 'Tor', approach: 'Volunteer-operated onion routing network.', access: 'open · decn', accessTone: 'decn', differentiator: 'Free and highly anonymous, but slow and increasingly blocked; TPN is faster and incentive-aligned.' },
    ],
    note: 'Most VPN buyers do not care which network is decentralized. They care about whether the connection works in the country they\'re sitting in and whether the bandwidth holds up for video. TPN\'s differentiator is that the subnet incentive layer keeps pulling capacity into the places centralized VPNs underserve.',
  },
  team: {
    intro: [
      'TPN is operated by the team behind Taofu Labs, led by co-founders Mitch and Mikel. Mitch has founded companies across traditional tech and crypto and helped launch Taofu to support Bittensor subnet teams; Mikel comes from a science / academic background with prior work in blockchain education.',
      'The team includes a contributor who previously founded and operated two VPN companies and created OnionDAO — a project that incentivized people to run Tor exit nodes — which is the direct intellectual ancestor of TPN\'s economics.',
    ],
    founders: [
      { initials: 'MT', gradient: 'v', name: 'Mitch', role: 'Co-founder, Taofu / TPN', bio: 'Serial founder across tech and crypto; co-founded Taofu Labs and TPN to bring incentive-driven VPN infrastructure to Bittensor.' },
      { initials: 'MK', gradient: 'a', name: 'Mikel', role: 'Co-founder, Taofu / TPN', bio: 'Science and innovation background; prior work in blockchain education and capital formation for subnet teams.' },
    ],
    size: 'Taofu Labs team',
    founded: '2024 (TPN subnet launch)',
    based: 'Distributed.',
    backers: 'Bootstrapped via Taofu with support from GLC Capital and Yuma Capital.',
  },
  milestones: [
    { date: '2024', text: 'TPN launches as subnet 65 on Bittensor under Taofu Labs.' },
    { date: '2025', text: 'iOS and Android mobile clients enter public preview.' },
    { date: '2025·Q4', text: 'TPN included in Project Rubicon, bridging Bittensor subnets to global Web3 markets.' },
  ],
  join: {
    title: 'Run a node in the place no one else covers',
    body: 'TPN rewards exit nodes in geographies normal VPNs avoid. The rarer the IP, the higher the weight — and uptime + throughput stack on top.',
    asideNote: 'VPN / sysadmin background is the natural fit.',
  },
  tags: ['vpn', 'privacy', 'infrastructure', 'censorship-resistance'],
  external: {
    github: 'https://github.com/taofu-labs/tpn-subnet',
    website: 'https://taoprivatenetwork.com/',
    twitter: 'https://x.com/TPN_Labs',
    taostats: 'https://taostats.io/subnets/65/',
  },
  tweets: [
    { when: '2025', body: 'Mobile clients are landing. TPN is the AWS of decentralized VPNs.' },
  ],
};
