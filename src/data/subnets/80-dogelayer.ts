import type { RichSubnet } from '../subnet-rich';

export const sn80: RichSubnet = {
  slug: '80-dogelayer',
  netuid: 80,
  name: 'DogeLayer',
  shortPitch: 'Scrypt mining pool that pays DOGE, LTC, and TAO from one rig.',
  overview: [
    'DogeLayer is Bittensor Subnet 80, the first mining pool that lets Scrypt ASIC operators contribute hashrate to Bittensor while continuing to mine LTC and DOGE through merged mining. The pitch is "triple rewards with one rig" — Dogecoin, Litecoin, and subnet Alpha tokens from a single Scrypt machine, with the pool charging 0% fees.',
    'Mechanically, miners point standard Scrypt ASICs at the DogeLayer stratum. The same proof-of-work that finds LTC/DOGE shares is also used as a verifiable contribution metric on Bittensor, so the subnet does not need a separate AI task — it reuses real-world hashpower as the work to be scored. Validators measure submitted shares and assign emissions proportionally.',
    'The external customers are existing Scrypt miners who want to boost ROI without buying new hardware. The team claims merged mining lifts revenue per kWh by roughly 3× versus pure LTC/DOGE pools, because the same electricity now also earns TAO-denominated Alpha emissions.',
    'One-line diff: a 0% fee merged-mining pool where the protocol incentive layer is Bittensor instead of an exchange listing. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue Scrypt work', body: 'Validators distribute Scrypt mining work units through the pool stratum so that ASIC miners can submit valid LTC/DOGE shares as their proof of contribution to the subnet.', dataK: 'payload', dataV: 'Scrypt stratum job' },
    compute:   { actor: 'Miner',     title: 'Hash + submit shares', body: 'Miners run unmodified Scrypt ASICs against the stratum and stream accepted shares back to the pool, which simultaneously credit LTC/DOGE block rewards and on-chain Bittensor contribution counters.', dataK: 'latency',  dataV: 'share rate · MH/s' },
    score:     { actor: 'Validator', title: 'Score by hashrate', body: 'Validators tally each miner\'s accepted Scrypt shares over the tempo window and convert hashpower into a weight vector, with pool-wide LTC/DOGE block rewards also distributed proportionally.', dataK: 'scale',    dataV: 'shares × difficulty' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Operates standard Scrypt ASIC hardware (DOGE/LTC miners) and points it at the DogeLayer stratum to simultaneously mine Dogecoin/Litecoin blocks and submit shares as Bittensor contribution proof.',
    input: 'Scrypt stratum work from the pool',
    output: 'Accepted Scrypt shares + valid LTC/DOGE block solutions',
    hardware: 'Any standard Scrypt ASIC (Antminer L7, L9, Goldshell LT/Mini-Doge class); no GPU required',
    paidFor: 'Accepted Scrypt shares contributed to the pool over the tempo',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Runs the pool-side accounting that translates Scrypt shares into Bittensor weights, monitors stratum integrity, and submits a weight vector each tempo.',
    requires: 'Bittensor validator stake plus operational pool infrastructure / share auditing',
    output: 'Weight vector across all miner hotkeys per tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Real Scrypt hashrate is the work — accepted shares over the tempo window are the score.',
    explanation: [
      'Because the subnet reuses Scrypt proof-of-work, there is no synthetic ML task to game. Each miner is scored on accepted shares accumulated by the pool stratum, weighted by share difficulty, then normalized across the active hotkey set. Pool-level LTC/DOGE block rewards are distributed pari passu so that on-chain emissions and off-chain coin rewards track the same hashrate.',
      'The design favors miners with stable uptime and properly tuned ASICs. Because the underlying Scrypt algorithm is well understood and impossible to fake at scale, validators mostly converge by reading verifiable pool telemetry; there is little disagreement on who hashed what.',
    ],
    cheatPath: 'Submitting fake share data without real hashpower fails immediately — Scrypt shares are cryptographically verifiable, and the pool only credits shares whose proof-of-work hash actually meets the network difficulty. There is no GPU shortcut: only ASIC-class Scrypt machines are competitive on power-per-share.',
  },
  customer: {
    leadOneLine: 'Existing Scrypt ASIC operators who want a third revenue stream stacked on top of LTC and DOGE payouts.',
    explanation: [
      'The buyer outside Bittensor is the Scrypt mining community — operators of Antminer L7/L9-class farms who already mine DOGE/LTC and want to increase revenue per kWh without changing hardware. DogeLayer markets a 300% ROI lift versus traditional Scrypt pools, driven entirely by the additional Alpha/TAO emissions paid out alongside coin rewards.',
      'A secondary customer is the broader Dogecoin community, which gets a network-aligned pool that funds Dogecoin Layer 2 development (libdogelayer, Dogelayer-tunnel) using TAO-denominated cashflows. In effect, DogeLayer routes Bittensor emissions into Dogecoin infrastructure work via the pool fee structure.',
    ],
  },
  competitive: {
    scope: 'Scrypt merged-mining pools (DOGE/LTC) · 2026',
    rows: [
      { name: 'DogeLayer', subtitle: 'SN80', isSelf: true, approach: 'Merged mining pool where LTC/DOGE shares double as Bittensor contribution; 0% pool fee.', access: 'open · stratum', accessTone: 'open', differentiator: 'Only pool that pays TAO emissions on top of LTC/DOGE — three revenue streams from one ASIC.' },
      { name: 'ViaBTC', approach: 'Major centralized LTC/DOGE merged-mining pool with PPS+ payouts.', access: 'open · stratum', accessTone: 'open', differentiator: 'Deep liquidity and stable payouts but standard pool fee and no protocol-token incentives.' },
      { name: 'F2Pool', approach: 'Large multi-coin pool that supports merged Scrypt mining of DOGE/LTC.', access: 'open · stratum', accessTone: 'open', differentiator: 'Brand and uptime leader; charges a pool fee and offers no third-token rewards.' },
      { name: 'LitecoinPool.org', approach: 'Established Litecoin-focused pool with optional merged Dogecoin mining.', access: 'open · stratum', accessTone: 'open', differentiator: 'Community-aligned LTC pool with proven history; no Bittensor or third-asset exposure.' },
      { name: 'Antpool', approach: 'Bitmain-affiliated multi-asset pool covering Scrypt LTC/DOGE alongside SHA-256 BTC.', access: 'open · stratum', accessTone: 'open', differentiator: 'Closely tied to ASIC supply (Bitmain); typical pool economics, no TAO layer.' },
    ],
    note: 'DogeLayer is differentiated less on mining mechanics — Scrypt merged mining is well understood — and more on its incentive stack. By plugging the same hashrate into Bittensor it converts pool participation into a TAO-denominated revenue stream that traditional pools cannot offer.',
  },
  team: {
    intro: [
      'DogeLayer is operated by a Dogecoin-aligned team that positions the project as more than a subnet: it is presented publicly as "the Layer 2 for Dogecoin", with the Bittensor subnet acting as the incentive engine that funds further DOGE infrastructure work.',
      'Max Ng has been the most publicly visible team member, appearing in AMAs (including one with TDM founder Zov) to explain the merged-mining design and the broader Dogecoin Layer 2 roadmap.',
    ],
    founders: [
      { initials: 'MN', gradient: 'v', name: 'Max Ng', role: 'Director, DogeLayer', bio: 'Public face of DogeLayer; leads communications and AMAs on the merged-mining pool and the Dogecoin Layer 2 roadmap.' },
      { initials: 'DL', gradient: 'a', name: '[DogeLayer core team]', role: 'Engineering', bio: 'Pool, stratum, and subnet engineering team behind the merged-mining stack and libdogelayer Layer 2 tooling.' },
    ],
    size: 'Small core team plus open-source contributors',
    founded: '2024 (DogeLayer project) · Subnet 80 launched 2025',
    based: 'Distributed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024', text: 'DogeLayer project established with focus on Dogecoin Layer 2 (libdogelayer, Dogelayer-tunnel).' },
    { date: '2025', text: 'Subnet 80 registered on Bittensor; merged-mining stratum brought online.' },
    { date: '2025', text: 'Pool publishes the "triple rewards" model — LTC + DOGE + Alpha on one Scrypt rig at 0% fee.' },
  ],
  join: {
    title: 'Point your Scrypt ASIC at DogeLayer',
    body: 'If you already run an Antminer L7/L9 or Goldshell LT-class machine, switch the stratum to the DogeLayer endpoint and register a hotkey to start accruing Bittensor emissions alongside your LTC/DOGE payouts. No firmware changes are required.',
    asideNote: 'Pool fee is advertised as 0% permanently; verify on the official DogeLayer site before committing hashrate.',
  },
  tags: ['scrypt', 'merged-mining', 'pow', 'dogecoin', 'litecoin'],
  external: {
    github: 'https://github.com/dogelayer-ai/dogelayer',
    website: 'https://dogelayer.ai',
    taostats: 'https://taostats.io/subnets/80/',
  },
};
