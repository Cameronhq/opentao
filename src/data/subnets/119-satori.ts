import type { RichSubnet } from '../subnet-rich';

export const sn119: RichSubnet = {
  slug: '119-satori',
  netuid: 119,
  name: 'Satori',
  shortPitch: 'AI companionship + Japan-rooted digital residency, on Bittensor.',
  overview: [
    'Satori (SN119) is one of the more unusual subnets on Bittensor — its pitch is constructing a persistent "Second Life" anchored in Japan, merging deep AI companionship with authentic Digital Residency, with virtual emotional connections that unlock real-world value and physical experiences.',
    'The premise is that the AI-companion category is converging with location-based experience design. Satori\'s framing places the companion layer inside a Japan-rooted digital-residency program, where the virtual relationship is paired with on-the-ground access — events, venues, communities, hospitality — that gives the emotional connection a physical anchor.',
    'On the subnet itself, miners are expected to power the AI companion side — running the models, memory systems, and persona logic that sustain long-term relationships with users. Validators benchmark companion quality, persona consistency, emotional fidelity, and probably retention metrics tied to the residency program.',
    'There is no direct comparator on Bittensor. Outside Bittensor, Replika, Character.AI, and Japanese-market companion apps like Cotomo and Loverse are the closest products; the Digital Residency angle has no real analog. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: {
      actor: 'Validator',
      title: 'Engage companion',
      body: 'Validator drives multi-turn interactions with each miner\'s companion to probe persona consistency, memory, and emotional fidelity.',
      dataK: 'payload',
      dataV: 'long-form interaction',
    },
    compute: {
      actor: 'Miner',
      title: 'Sustain companion',
      body: 'Miner runs the model + persona + memory stack that maintains the AI companion\'s identity across conversation turns and sessions.',
      dataK: 'latency',
      dataV: 'conversational responsiveness',
    },
    score: {
      actor: 'Validator',
      title: 'Quality + persistence',
      body: 'Validator grades persona consistency, memory recall, emotional appropriateness, and long-context coherence across the interaction.',
      dataK: 'scale',
      dataV: 'companion quality vector',
    },
    settle: {
      actor: 'Subtensor',
      title: 'Yuma → emission',
      body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.",
      dataK: 'tempo',
      dataV: '~72 min · 24×/day',
    },
  },
  miner: {
    does: 'Runs the AI-companion stack — model, persona, memory — that sustains long-term relationships with end users.',
    input: 'Conversational turns from validators (and eventually live residents) including persona/memory cues.',
    output: 'Conversational responses that maintain persona, recall prior context, and respond with appropriate emotional register.',
    hardware: 'GPU server for inference, persistent storage for memory systems, persona templating infrastructure.',
    paidFor: 'Persona consistency, memory recall accuracy, emotional fidelity, and conversational coherence',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Drives multi-turn probes against companion miners, grades quality of identity persistence and emotional fidelity, sets weights.',
    requires: 'Server, probe scripts that exercise long-context behavior, scoring rubrics for companion quality.',
    output: 'Per-miner weight vector based on companion quality across the probe set.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Be a consistent companion across long contexts — persona drift and memory loss zero out emission.',
    explanation: [
      'Validators run multi-turn probes designed to expose persona drift, memory failures, and emotional misfires. A companion miner that nails the first 50 turns but forgets earlier context, breaks character, or responds with the wrong register at turn 100 loses ground. Scoring rewards coherent identity and faithful long-term memory above raw cleverness.',
      'The Digital Residency hook means the companion is tied to a real-world program — events, venues, communities in Japan. The validation rubric probably reflects that integration, scoring not just generic companion quality but the ability to be useful inside the residency context (recommend, plan, coordinate around physical events).',
    ],
    cheatPath: 'Stateless single-turn responses or scripted persona templates — long-context probes catch both quickly.',
  },
  customer: {
    leadOneLine: 'Users who want a long-term AI companion with a real-world Japan-rooted social and physical layer.',
    explanation: [
      'Primary customers are subscribers to Satori\'s Digital Residency — people who want a persistent AI relationship plus an on-the-ground community and event calendar anchored in Japan. The product wedge is the integration: companion plus residency plus physical access, not just companion alone.',
      'Secondary customers are AI-companion-curious users who would otherwise pick Replika or Character.AI but value the open, on-chain incentive model and the cultural specificity of a Japan-rooted experience. This is a niche, but a deep one — Japan\'s companion-app market alone is sizeable, and the residency-program framing is novel.',
    ],
  },
  competitive: {
    scope: '2026 · AI companions with location anchor',
    rows: [
      { name: 'Satori', subtitle: 'SN119', isSelf: true, approach: 'AI companion + Japan-rooted digital residency on Bittensor', access: 'open · API', accessTone: 'open', differentiator: 'Only subnet combining companion AI with a physical-world residency program' },
      { name: 'Replika', approach: 'Centralized AI companion app with subscription pricing', access: 'closed · app', accessTone: 'closed', differentiator: 'No location or residency layer; closed model stack' },
      { name: 'Character.AI', approach: 'Multi-character chat platform with user-created personas', access: 'closed · platform', accessTone: 'closed', differentiator: 'Persona breadth; no long-term residency framing' },
      { name: 'Cotomo / Loverse (Japan)', approach: 'Japanese-market companion apps with cultural specificity', access: 'closed · app', accessTone: 'closed', differentiator: 'Culturally local but no decentralized backend or residency program' },
      { name: 'Soulgen / Pi by Inflection', approach: 'Generalized companion / friendly AI products from US labs', access: 'closed · app', accessTone: 'closed', differentiator: 'No location-specific identity, no residency hook' },
    ],
    note: 'Satori\'s wedge is the residency framing — turning an AI companion into a long-term relationship that pays off in physical access and community. As a Bittensor subnet, the open-source companion stack also lets buyers avoid vendor lock-in on something as intimate as a long-term AI relationship.',
  },
  team: {
    intro: [
      'Satori operates as subnet 119 with a Japan-rooted product framing. As of May 2026, the team has not published a centralized roster on the registry or its public surface.',
      'The operator handles the companion stack reference implementation, the validator scoring code, and the Digital Residency program operations that connect the virtual layer to physical events and venues in Japan.',
    ],
    founders: [
      { initials: 'ST', gradient: 'a', name: '[Founder 1 name]', role: 'Operator', bio: 'Operator team behind Satori subnet 119; identities not publicly disclosed as of May 2026.' },
    ],
    size: 'Not publicly disclosed.',
    founded: '2025',
    based: 'Japan-rooted; operator base not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 119 launches as Satori with the AI-companion + Digital-Residency framing.' },
    { date: '2026', text: 'Companion stack and residency program in early rollout in Japan.' },
  ],
  join: {
    title: 'Build the companion stack or join the residency',
    body: 'If you can run a long-context companion with persona consistency and memory recall, mine SN119. If you want the user-side experience, sign up for the Digital Residency program when it opens to public residents.',
    asideNote: 'Persona drift and memory loss are the two failure modes scoring is designed to catch.',
  },
  tags: ['companion', 'consumer-ai', 'japan', 'memory'],
  external: {
    taostats: 'https://taostats.io/subnets/119/',
  },
  tweets: [],
};
