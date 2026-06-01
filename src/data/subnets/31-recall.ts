import type { RichSubnet } from '../subnet-rich';

export const sn31: RichSubnet = {
  slug: '31-recall',
  netuid: 31,
  name: 'Recall',
  shortPitch: 'Decentralized RAG — open competition for the best retrieval-augmented pipeline.',
  overview: [
    'Subnet 31 is currently branded as Recall, an open competition for retrieval-augmented generation (RAG) on Bittensor. The slot was previously NASChain (Neural Architecture Search) operated by Tensorplex Labs; under Recall the focus has shifted to running an end-to-end RAG pipeline — embeddings, vector retrieval, and answer synthesis — as a single Bittensor-incentivized service.',
    'Miners serve the full RAG stack: an embedding model for the corpus, vector search, and an LLM that answers the user query with citations. Validators independently evaluate retrieval accuracy and answer quality and write weights on-chain. The "best pipeline" emerges from open competition between many miners rather than being hand-picked by the operator.',
    'The customer is downstream: AI agent builders, search products, and chat applications that want a citation-grounded answer endpoint without operating their own embedding + retrieval + LLM stack. The framing positioning Recall as "an always-improving, community-owned search engine with citations" appears on the Bittensor.ai subnet directory.',
    'SN31 competes with hosted RAG endpoints (Perplexity Sonar, You.com) and other Bittensor retrieval subnets (SN22 Desearch live-web search, SN40 Chunking). <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Issue RAG query', body: 'Validator dispatches a synthetic or organic question (with a ground-truth answer or rubric) to a sample of miners and asks for a cited answer over the target corpus.', dataK: 'payload', dataV: 'question + corpus pointer' },
    compute:   { actor: 'Miner',     title: 'Embed → retrieve → answer', body: 'Miner embeds the query, runs vector retrieval against its index, feeds top passages into an LLM, and returns a cited answer plus the source passages.', dataK: 'latency',  dataV: 'seconds-scale per query' },
    score:     { actor: 'Validator', title: 'Grade retrieval + answer', body: 'Validator independently checks whether retrieved passages contain the ground-truth answer and whether the generated response is faithful and well-cited; weights reflect both retrieval recall and answer quality.', dataK: 'scale', dataV: 'recall × faithfulness' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Operates an end-to-end RAG service — embedding model, vector index, retrieval, and an LLM that answers with citations — exposed via the subnet axon.',
    input: 'Natural-language question plus a pointer to the target corpus / context window.',
    output: 'A cited answer plus the supporting retrieved passages.',
    hardware: 'GPU host(s) for embedding + LLM inference, fast storage for the vector index, decent network for retrieval at request time.',
    paidFor: 'High retrieval recall and faithful, well-cited answers measured against validator rubrics.',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Generates queries with known answers, evaluates miner retrievals and generated answers independently, and writes weights on-chain every tempo.',
    requires: 'Stake, access to evaluation corpora and ground-truth answers / rubrics, and a validator host able to run the grading pipeline.',
    output: 'Per-miner weight vector reflecting retrieval recall and answer faithfulness.',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Grade the whole RAG pipeline — retrieval recall, citation faithfulness, and answer quality — not just the LLM output.',
    explanation: [
      'For each query the validator knows (or can independently derive) the ground-truth answer plus a set of passages that should be retrieved. It checks whether the miner\'s retrieval contains those passages (recall), whether the cited passages actually support the answer (faithfulness), and whether the answer is coherent and complete (quality). Scoring the full pipeline — not just the final string — pushes miners to invest in better embeddings and retrieval, not just better prompting.',
      'Because miners control both retrieval and generation, the subnet effectively runs a tournament across the space of RAG architectures: embedding model choice, chunk size, hybrid keyword+vector retrieval, reranking, and LLM choice. Weights are written on-chain every tempo and Yuma consensus picks the median, so a single rogue validator cannot reward a friendly miner.',
    ],
    cheatPath: 'A miner can fabricate citations that look real, hardcode answers to expected validator probes, or cache stale retrievals. Validators counter with held-out queries, citation-vs-passage checks, and rotation of the underlying eval corpus. Miners that confidently cite passages that do not contain the answer get marked down hard.',
  },
  customer: {
    leadOneLine: 'AI agent builders and chat products that want a citation-grounded answer endpoint without running their own RAG stack.',
    explanation: [
      'Customers are external: builders of copilots, support bots, research tools, and search apps who would otherwise stand up their own embedding pipeline, vector store, and LLM inference. Recall packages the whole stack behind one query → cited-answer interface, with the Bittensor incentive layer doing the model-selection work.',
      'Bittensor.ai pitches Recall as "an always-improving, community-owned search engine with citations" — the durable angle is that whichever embedding, retrieval, or reranking technique wins, the subnet routes to it automatically without the customer having to migrate.',
    ],
  },
  competitive: {
    scope: 'RAG + retrieval + answer endpoints · 2026',
    rows: [
      { name: 'Recall', subtitle: 'SN31', isSelf: true, approach: 'Bittensor-incentivized end-to-end RAG — miners run embeddings + retrieval + LLM, validators grade retrieval recall and answer faithfulness.', access: 'open', accessTone: 'open', differentiator: 'Tournament across the full RAG pipeline, not just the LLM step; community-owned and routes to winners automatically.' },
      { name: 'SN22 Desearch', approach: 'Live-web search subnet (Datura Labs) — scrapes X, web, Reddit and returns ranked links + summary.', access: 'open · API', accessTone: 'open', differentiator: 'Live-web focus rather than RAG over a fixed corpus; serves search-style queries.' },
      { name: 'SN40 Chunking', approach: 'Bittensor subnet focused on the chunking step of RAG pipelines — improving similarity within chunks.', access: 'open', accessTone: 'open', differentiator: 'Solves a sub-step, not the full RAG pipeline; composable with Recall.' },
      { name: 'Perplexity Sonar API', approach: 'Centralized answer engine with cited web sources, billed per query.', access: 'closed · API', accessTone: 'closed', differentiator: 'Strong UX and brand, but closed-stack and a single vendor model.' },
      { name: 'LangChain + Pinecone / vendor RAG kits', approach: 'Self-built RAG stacks using third-party embedding APIs and vector DBs.', access: 'open · DIY', accessTone: 'open', differentiator: 'Full control but you own the entire stack — model selection, ops, costs.' },
    ],
    note: 'Recall fights for the same buyer as Perplexity Sonar and self-built RAG stacks. Inside Bittensor it overlaps least with SN22 (live web) and SN40 (chunking) — Recall is the full-pipeline tournament where embedding + retrieval + LLM are jointly graded, which is rare in either centralized or decentralized AI today.',
  },
  team: {
    intro: [
      'The current Recall identity on subnet 31 is operated by a small team focused on RAG infrastructure on Bittensor; the slot was previously NASChain (Neural Architecture Search) under Tensorplex Labs before the rebrand.',
      'Founder identities for the current Recall iteration are not extensively documented in the public sources cross-checked for this profile; treat any biographical detail as placeholder until the operator publishes a public team page.',
    ],
    founders: [
      { initials: 'RE', gradient: 'v', name: '[Recall founder]', role: 'Operator, Recall (SN31)', bio: 'Current operator of subnet 31\'s Recall RAG product; not extensively documented in publicly-cross-checkable sources at time of writing.' },
    ],
    size: 'Not publicly disclosed.',
    founded: '2024 (NASChain) → rebranded Recall',
    based: 'Not publicly disclosed.',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2024', text: 'Subnet 31 launched as NASChain (Neural Architecture Search) under Tensorplex Labs, scoring miners on Pareto frontier of accuracy / params / FLOPs.' },
    { date: '2025·2026', text: 'Subnet identity transitions to Recall — decentralized retrieval-augmented generation, end-to-end RAG pipeline competition.' },
  ],
  join: {
    title: 'Stand up a RAG pipeline on Recall',
    body: 'Run a miner that does embedding + vector retrieval + LLM answer generation; validators will grade your retrieval recall and answer faithfulness against ground-truth queries.',
    asideNote: 'Subnet 31 is mid-transition from NASChain to Recall — confirm the current scoring spec from operator channels before mining.',
  },
  tags: ['rag', 'retrieval', 'search', 'embeddings', 'agents'],
  external: {
    website: 'https://bittensor.ai/subnets/31',
    taostats: 'https://taostats.io/subnets/31/',
  },
};
