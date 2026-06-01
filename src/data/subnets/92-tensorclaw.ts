import type { RichSubnet } from '../subnet-rich';
export const sn92: RichSubnet = {
  slug: '92-tensorclaw', netuid: 92, name: 'TensorClaw',
  shortPitch: 'Decentralized LLM inference aggregator routing real API traffic to globally distributed miners.',
  overview: [
    'TensorClaw (SN92) is a decentralized LLM inference subnet that aggregates high-quality API nodes — OpenAI, DeepSeek, Claude, Llama, Qwen, and others — through Bittensor\'s incentive mechanism, exposing a unified, load-balanced, OpenAI-compatible API to end users and AI agents.',
    'Miners run inference endpoints behind persistent WebSocket tunnels, bypassing strict enterprise firewalls and NAT — so anyone with compute (and access to top open-source models) can join without exposing a public IP. The subnet advertises sub-millisecond routing latency and targets a 100% SLA for OpenClaw Agents, its branded agent-inference layer.',
    'The reward mechanism ties emissions directly to real commercial API traffic: miners that handle more high-quality real requests earn more TAO. Bonus multipliers reward miners that serve highly-demanded open-source models like Qwen and DeepSeek, biasing the network toward open, self-hostable backends instead of pure proxy farms.',
    'The LLM-inference subnet category on Bittensor is crowded (Targon SN4, Chutes SN64, Apex SN1), so TensorClaw\'s positioning around firewall-friendly miners and agent-grade SLAs needs to clear a real bar. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Forward request', body: 'Validator routes an OpenAI-compatible inference request (or test prompt) to selected miners over WebSocket.', dataK: 'payload', dataV: 'prompt + model id' },
    compute:   { actor: 'Miner',     title: 'Run inference', body: 'Miner serves the request via its hosted LLM (open-source or premium API passthrough) and streams tokens back.', dataK: 'latency',  dataV: 'sub-ms routing, p99 quality' },
    score:     { actor: 'Validator', title: 'Score quality + speed', body: 'Validators benchmark latency, throughput, and output quality vs. reference models; bonus multipliers apply to open-source backends.', dataK: 'scale',    dataV: 'real-traffic share' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Serves LLM inference behind a WebSocket tunnel to bypass firewall/NAT constraints.', input: 'OpenAI-compatible prompts and model selection', output: 'Streamed completions + metadata', hardware: 'GPU node sized for chosen model (e.g., A100/H100 for 70B class)', paidFor: 'Handling real commercial traffic with quality and speed', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Routes traffic, benchmarks miner output quality and latency, sets weights.', requires: 'Reference models + benchmark suites', output: 'Per-miner weights tied to real-request quality', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   {
    leadOneLine: 'Real API traffic served well — measured by quality, latency, and throughput.',
    explanation: [
      'Validators send a mix of synthetic benchmark prompts and (where available) real customer requests through the network, scoring miners on completion quality vs. reference outputs, p50/p99 latency, and sustained throughput. Bonus multipliers stack for hosting in-demand open-source models like Qwen and DeepSeek.',
      'The subnet\'s thesis is "whoever processes more real requests with high quality gets more TAO." If the business-API revenue stream materializes, miner economics become tied to genuine consumer demand rather than synthetic emission farming.',
    ],
    cheatPath: 'Proxying every prompt to a single premium API — bonus multipliers favor open backends, and validators check output entropy / signatures to detect simple passthrough.',
  },
  customer:  {
    leadOneLine: 'AI agents and applications wanting one OpenAI-compatible endpoint across multiple LLM backends.',
    explanation: [
      'OpenClaw Agents is the anchor customer — TensorClaw\'s own agent-inference layer that demands 100% SLA and sub-millisecond routing. Beyond it, the target is any AI agent builder who needs cross-model failover, cost arbitrage, and uncensored open-source backends without managing dozens of provider keys.',
      'The competitive set is fierce: OpenRouter and Together AI dominate centralized aggregation; Chutes (SN64) and Targon (SN4) dominate Bittensor-native inference. TensorClaw needs to win on either price (via bonus-multiplied open-source supply) or agent-grade reliability (via tunneled NAT-friendly miner pool).',
    ],
  },
  competitive: { scope: '2026 · LLM inference aggregation', rows: [
    { name: 'TensorClaw', subtitle: 'SN92', isSelf: true, approach: 'WebSocket-tunneled miners + real-traffic rewards', access: 'open · API', accessTone: 'open', differentiator: 'NAT-friendly mining + open-source bonus multipliers' },
    { name: 'Chutes', subtitle: 'SN64', approach: 'Serverless GPU inference + model marketplace', access: 'open · API', accessTone: 'open', differentiator: 'Largest Bittensor inference subnet by volume' },
    { name: 'Targon', subtitle: 'SN4', approach: 'Verified high-quality LLM inference', access: 'open · API', accessTone: 'open', differentiator: 'Verifier-driven quality, OpenAI-compatible' },
    { name: 'OpenRouter', approach: 'Centralized multi-model API gateway', access: 'closed · API', accessTone: 'closed', differentiator: 'Dominant aggregator outside Bittensor, fiat billing' },
    { name: 'Together AI', approach: 'Centralized hosted open-model inference', access: 'closed · API', accessTone: 'closed', differentiator: 'Top-tier latency + SLAs, VC-backed scale' },
  ], note: 'TensorClaw\'s niche is permissionless supply: NAT/firewall-tunneled miners can join from anywhere, and bonus multipliers steer the pool toward in-demand open models. The bet is that an OpenAI-compatible API on this supply beats centralized aggregators on price.' },
  team: {
    intro: [
      'TensorClaw is the team behind both the SN92 subnet and the OpenClaw Agents brand. Specific founder identities are not prominently disclosed in publicly available materials.',
      'Project resources live on tensorclaw.ai and the tensorclaw GitHub organization.',
    ],
    founders: [{ initials: 'TC', gradient: 'a', name: '[TensorClaw team]', role: 'Operators', bio: 'Operators of SN92 and OpenClaw Agents inference layer.' }],
    size: 'Not publicly disclosed', founded: '2025', based: 'Not publicly disclosed', backers: 'Not publicly disclosed.', placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 92 registered as TensorClaw.' },
    { date: '2025', text: 'OpenAI-compatible API and WebSocket-tunneled miner protocol live.' },
    { date: '2026', text: 'OpenClaw Agents layer announced as anchor consumer.' },
  ],
  join: { title: 'Tunnel your GPU into the network', body: 'Operators with GPU capacity (especially serving Qwen, DeepSeek, and other in-demand open models) can mine without exposing a public IP. Validators benchmark quality and latency across the pool.', asideNote: 'Inference subnets compete brutally on price and quality — verify current miner economics before deploying serious capital.' },
  tags: ['llm-inference', 'api-aggregation', 'openai-compatible', 'agents'],
  external: { github: 'https://github.com/tensorclaw/tensorclaw', website: 'https://www.tensorclaw.ai/', taostats: 'https://taostats.io/subnets/92/' },
  tweets: [],
};
