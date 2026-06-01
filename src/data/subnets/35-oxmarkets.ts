import type { RichSubnet } from '../subnet-rich';

export const sn35: RichSubnet = {
  slug: '35-oxmarkets',
  netuid: 35,
  name: '0xMarkets',
  shortPitch: 'Decentralized perpetuals DEX for FX, crypto, commodities — liquidity-as-a-service.',
  overview: [
    'Subnet 35 — 0xMarkets — is a Bittensor "liquidity-as-a-service" subnet that powers a permissionless perpetuals DEX for foreign exchange, cryptocurrencies, and commodities. Users deposit USDC into the protocol and earn yield through spreads, fees, and alpha generation by the miner network. Public site: 0xmarkets.io / liquidity.0xmarkets.io.',
    'Miners on the subnet provide USDC liquidity positions tied to specific markets and pool weights; they earn emission based on the amount of locked liquidity, pool composition, and the trading performance they enable. Validators verify miner positions, gate which miners receive queries, and write weights on-chain — only whitelisted validators can route order flow to verified miners.',
    'The customer is outside Bittensor: retail and pro traders who want decentralized leveraged exposure to FX, crypto, and commodities (up to 500x leverage per public materials), plus USDC depositors looking for yield. The subnet was announced (September 2025) by the team behind Taoshi together with General TAO Ventures.',
    'Subnet 35 itself was originally "LogicNet" (a reasoning-model subnet by AIT) which stalled and was relinquished; General Tao Ventures took the slot over and is rebooting it as 0xMarkets. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Verify liquidity', body: 'Validator queries the miner registry, checks each miner\'s on-chain USDC liquidity position, pool weight, and lock duration against the 0xMarkets liquidity contract.', dataK: 'payload', dataV: 'liquidity position + pool weight' },
    compute:   { actor: 'Miner',     title: 'Hold + signal', body: 'Miner maintains its USDC liquidity position in the requested pools and (depending on miner role) provides trading signals or quote streams that feed the perpetual DEX.', dataK: 'latency',  dataV: 'pool-tempo, not request-tempo' },
    score:     { actor: 'Validator', title: 'Score liquidity + alpha', body: 'Validator combines locked USDC, pool weights, and downstream trading performance (spreads earned, alpha) into a per-miner score; writes weights on-chain every tempo.', dataK: 'scale', dataV: 'locked USDC × weight × alpha' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Provides USDC liquidity to the 0xMarkets perpetuals DEX and/or serves trading signals that route order flow; positions are verified on-chain.',
    input: 'Pool definitions and weight requirements from the 0xMarkets liquidity contract.',
    output: 'Locked USDC positions across pools; depending on role, trading signals / quotes used by the DEX.',
    hardware: 'Light infra by mining standards — primarily reliable hosts for signal generation; significant capital requirement (USDC) for liquidity provision.',
    paidFor: 'Maintaining locked USDC liquidity in the right pools at the right weights, and providing alpha that earns DEX revenue.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Verifies miner USDC positions on-chain, enforces whitelist of which miners can be queried, scores liquidity + alpha contributions, writes weights.',
    requires: 'Stake plus the ability to query 0xMarkets contracts and gate the order-flow routing layer.',
    output: 'Per-miner weight vector reflecting locked USDC, pool weight, and trading performance.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Verified USDC liquidity positions weighted by pool composition and downstream trading performance.',
    explanation: [
      'Miners are scored on three components: total USDC locked in 0xMarkets pools (verified on-chain), the pool composition weights (the protocol favours liquidity in pools that match its risk profile), and downstream alpha — how much real DEX revenue the miner\'s liquidity / signals actually generated for the protocol. Combining capital provision with productive use prevents pure "lock and forget" liquidity strategies.',
      'Only whitelisted validators may query verified miners — this gate prevents Sybil validators from siphoning order-flow data and ensures the routing layer stays trusted. Weights are written on-chain every tempo and Yuma consensus picks the median; weights translate directly into TAO emission proportional to verified contribution.',
    ],
    cheatPath: 'A miner can claim USDC liquidity it does not have, misreport pool weights, or sit idle on locked USDC without producing alpha. On-chain verification of the position contracts catches false claims; the alpha component prevents idle capital from earning full emission; validator whitelisting blocks rogue routers.',
  },
  customer: {
    leadOneLine: 'Retail and pro traders wanting decentralized FX/crypto/commodity perps, plus USDC depositors looking for yield via DEX liquidity provision.',
    explanation: [
      'The customer-facing product is 0xmarkets.io — a perpetuals DEX where users deposit USDC and trade FX (EUR/USD, USD/JPY, etc.), crypto perps, and commodities with leverage up to 500x. The differentiator versus dYdX / GMX / Hyperliquid is the inclusion of FX and the Bittensor-incentivized liquidity backstop.',
      'For depositors, liquidity.0xmarkets.io exposes a yield-bearing USDC product: deposit USDC into the protocol, earn from spreads, fees, and miner alpha generation. The subnet is the alpha engine — miners compete to provide liquidity efficiently and to surface profitable price signals.',
    ],
  },
  competitive: {
    scope: 'decentralized perpetuals + liquidity provision · 2026',
    rows: [
      { name: '0xMarkets', subtitle: 'SN35', isSelf: true, approach: 'Bittensor-incentivized liquidity + alpha generation backing a perp DEX covering FX, crypto, and commodities.', access: 'open · DEX + API', accessTone: 'open', differentiator: 'FX coverage is rare in DeFi; Bittensor incentive ties liquidity reward to productive use, not just locked capital.' },
      { name: 'Hyperliquid', approach: 'Custom L1 perpetuals DEX with on-chain orderbook; top-tier crypto perp venue by volume.', access: 'open · DEX', accessTone: 'open', differentiator: 'Crypto-only, very deep liquidity; no FX or commodities; no Bittensor incentive layer.' },
      { name: 'dYdX v4', approach: 'Cosmos-based DEX with on-chain orderbook for crypto perps.', access: 'open · DEX', accessTone: 'open', differentiator: 'Mature DEX product; crypto-only; centralized matching historically.' },
      { name: 'GMX / Synthetix Perps', approach: 'AMM-style perp DEXes on Arbitrum / Optimism / Base.', access: 'open · DEX', accessTone: 'open', differentiator: 'Passive LP model; popular but well-known impermanent-loss style risks.' },
      { name: 'CFD brokers (FX retail)', approach: 'Centralized retail FX/CFD brokers (Plus500, IG, OANDA) offering FX leverage.', access: 'closed · KYC', accessTone: 'closed', differentiator: 'Massive existing FX retail base; KYC + regional regulation; no DeFi composability.' },
    ],
    note: '0xMarkets fights on two fronts: against crypto-native perp DEXes (Hyperliquid, dYdX, GMX) it adds FX and commodities and a Bittensor liquidity layer; against centralized FX/CFD brokers (Plus500, IG) it offers permissionless, KYC-free access and on-chain settlement. The Bittensor incentive is the technical wedge — a long-tail of miners compete to back the DEX with productive liquidity.',
  },
  team: {
    intro: [
      'Subnet 35 is being relaunched as 0xMarkets by the team behind Taoshi (a leading Bittensor finance subnet builder) together with General TAO Ventures, a Bittensor-focused investment vehicle. The slot was previously LogicNet (reasoning model, AIT) which stalled before being handed over.',
      'The stated philosophy is that DeFi has under-served FX and commodities and that Bittensor is the right place to build a liquidity layer where capital is rewarded for productive use, not just for sitting locked.',
    ],
    founders: [
      { initials: 'AY', gradient: 'v', name: 'Arrash Yasavolian', role: 'CEO, Taoshi (lead operator of SN35)', bio: 'CEO of Taoshi, the Bittensor finance team leading 0xMarkets; Taoshi also operates SN8 Proprietary Trading Network.', twitter: 'https://x.com/Arrash' },
      { initials: 'MG', gradient: 'a', name: 'Mike Grantis', role: 'Co-founder, General TAO Ventures', bio: '0xMarkets contributor; Co-Founder of General TAO Ventures, a Bittensor-focused investment vehicle and SN35 stakeholder.', twitter: 'https://x.com/MikeGrantis' },
    ],
    size: 'Taoshi team + General TAO Ventures',
    founded: '2025·09 (0xMarkets brand announcement)',
    based: 'Distributed (Taoshi / General TAO Ventures)',
    backers: 'General TAO Ventures (subnet co-builder).',
    placeholder: false,
  },
  milestones: [
    { date: '2024', text: 'Subnet 35 originally launched as LogicNet (AIT) — reasoning-model subnet that subsequently stalled.' },
    { date: '2025', text: 'General Tao Ventures takes the slot; LogicNet enters "minor burn" while the rebrand is prepared.' },
    { date: '2025·09', text: 'Public announcement of 0xMarkets via PR Newswire — decentralized FX/crypto/commodities perpetuals DEX backed by SN35 liquidity.' },
    { date: '2026', text: 'Public liquidity portal liquidity.0xmarkets.io launched; miner liquidity provision and validator whitelisting documented in 0xMarkets docs.' },
  ],
  join: {
    title: 'Provide liquidity or trade on 0xMarkets',
    body: 'Deposit USDC into liquidity.0xmarkets.io to back the perp DEX as a passive LP, register a miner for active liquidity / signal provision, or trade FX/crypto/commodities on 0xmarkets.io.',
    asideNote: 'Subnet 35 is mid-relaunch — confirm whitelisting and current pool definitions from official docs before participating.',
  },
  tags: ['defi', 'perps', 'fx', 'liquidity', 'trading'],
  external: {
    website: 'https://www.0xmarkets.io',
    twitter: 'https://x.com/0x_Markets',
    taostats: 'https://taostats.io/subnets/35/',
  },
};
