import type { RichSubnet } from '../subnet-rich';

export const sn40: RichSubnet = {
  slug: '40-chunking',
  netuid: 40,
  name: 'Chunking',
  shortPitch: 'Decentralized intelligent chunking for retrieval-augmented generation pipelines.',
  overview: [
    'Chunking (Subnet 40) is operated by VectorChat and is purpose-built to advance Retrieval-Augmented Generation by incentivizing the development of intelligent chunking algorithms. Miners take long documents as input and return a partition into semantically coherent chunks; the goal is to maximize within-chunk similarity and between-chunk dissimilarity so that downstream retrieval surfaces the right context.',
    'Validators feed documents to miners, compute embeddings, and grade each partition by intra/inter-chunk similarity. Weights are committed each tempo and aggregated by Yuma, which means scores reward genuine semantic partitioning rather than length-based heuristics.',
    'The customer is anyone building a RAG pipeline that currently relies on naive fixed-size or sentence-boundary splitters. VectorChat itself is the lead customer through its consumer product Toffee, a long-memory chat platform that uses the chunking subnet as its retrieval backbone — a vertically-integrated demand loop.',
    'Differentiator: chunking treated as a first-class learned task with a continuous benchmark, not a one-line library call. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Send document', body: 'Validators sample a document from the evaluation corpus and broadcast it to miners with chunking constraints.', dataK: 'payload', dataV: 'doc + max chunk' },
    compute:   { actor: 'Miner',     title: 'Chunk doc', body: 'Miners run their chunking algorithm and return an ordered list of chunks covering the document.', dataK: 'latency',  dataV: 'per-doc' },
    score:     { actor: 'Validator', title: 'Embed & grade', body: 'Validators embed each chunk and score by intra-chunk similarity and inter-chunk dissimilarity.', dataK: 'scale',    dataV: 'embedding sim' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner:     { does: 'Partitions long documents into semantically coherent chunks.', input: 'Document text + constraint bounds (e.g., max chunk size).', output: 'Ordered list of chunks covering the document.', hardware: 'Modest GPU for embedding-based segmentation; CPU for rule-based runs.', paidFor: 'Chunk partitions with high intra-similarity and low inter-similarity.', paidVia: 'Per-tempo emission, score × validator stake' },
  validator: { does: 'Embeds returned chunks and computes the similarity-based reward signal.', requires: 'Embedding model + reference corpus.', output: 'Per-miner weight vector.', paidFor: 'Submitting weights that agree with consensus median', paidVia: 'Per-tempo emission, stake × consensus alignment' },
  scoring:   { leadOneLine: 'Score = intra-chunk similarity ÷ inter-chunk similarity, in embedding space.', explanation: [
    'Validators run a fixed embedding model over each chunk a miner returns. A good partition has chunks whose internal sentences are close together in embedding space and whose neighboring chunks are far apart — exactly what a downstream retriever needs.',
    'Because scoring is embedding-similarity-based, miners cannot win by tuning to a specific keyword set. They must produce partitions that generalize across the corpus VectorChat samples from.',
  ], cheatPath: 'Returning trivial single-sentence chunks or copying the input verbatim fails — the inter-chunk dissimilarity term collapses, and validators reject the response.' },
  customer:  { leadOneLine: 'RAG builders, long-context chat products, and VectorChat\'s own Toffee platform.', explanation: [
    'Almost every production RAG pipeline starts with naive fixed-window chunking, which is a known source of context bleed and missed-retrieval errors. Subnet 40 sells "chunking-as-a-service" through an API that any RAG team can call instead of building their own splitter.',
    'VectorChat closes the loop by being the lead consumer: Toffee, their long-memory AI chat product, retrieves over chunks produced by the subnet, which means real conversational traffic continuously dogfoods the network.',
  ] },
  competitive: { scope: '2026 · RAG infra', rows: [
    { name: 'Chunking', subtitle: 'SN40', isSelf: true, approach: 'Live competitive market of chunking algorithms judged on embedding similarity.', access: 'open · API', accessTone: 'open', differentiator: 'Vertical demand loop via Toffee; continuous benchmark pressure.' },
    { name: 'LangChain / LlamaIndex splitters', approach: 'Open-source rule-based and recursive splitters.', access: 'open · lib', accessTone: 'open', differentiator: 'Free and ubiquitous, but heuristic — no learning loop.' },
    { name: 'Unstructured.io', approach: 'Document parsing + chunking SaaS for enterprise docs.', access: 'open · API', accessTone: 'open', differentiator: 'Strong on formats (PDF, HTML); chunking quality is fixed by their team.' },
    { name: 'Pinecone / Vespa native chunkers', approach: 'Vector DB-bundled chunking utilities.', access: 'closed · platform', accessTone: 'closed', differentiator: 'Convenient but locked to that DB; no competitive pressure on chunk quality.' },
    { name: 'In-house chunkers', approach: 'Custom regex/semantic splitters at each company.', access: 'closed', accessTone: 'closed', differentiator: 'Tailored but expensive to maintain; no shared benchmark.' },
  ], note: 'The bet is that chunk quality is a real performance lever in RAG that\'s underpriced because everyone just uses the LangChain default. Subnet 40 turns it into a measurable, paid task.' },
  team: { intro: [
    'Chunking is operated by VectorChat, a team building decentralized RAG infrastructure. They run both the subnet and the downstream Toffee product, which gives them a tight loop between algorithm quality and end-user retention.',
    'Public individual founder identities for VectorChat are limited; the team operates under the VectorChat brand on GitHub, Twitter, and vectorchat.ai.',
  ], founders: [
    { initials: 'VC', gradient: 'v', name: '[Founder 1 name]', role: 'VectorChat team lead', bio: 'Operates the Chunking subnet and the Toffee RAG platform under the VectorChat brand.' },
  ], size: 'Small core team', founded: '2024', based: 'Not publicly disclosed.', backers: 'Not publicly disclosed.', placeholder: true },
  milestones: [
    { date: '2024', text: 'Chunking subnet (SN40) launched by VectorChat as part of the Toffee RAG stack.' },
  ],
  join: { title: 'Beat the default splitter', body: 'If you have a chunking algorithm that beats LangChain\'s recursive splitter on embedding-similarity benchmarks, register as a miner. Validators run the embedding evaluator.', asideNote: 'Read the VectorChat eval doc before tuning — the metric is intra/inter chunk similarity.' },
  tags: ['rag', 'chunking', 'retrieval', 'nlp'],
  external: { github: 'https://github.com/VectorChat/chunking_subnet', website: 'https://vectorchat.ai/', twitter: 'https://x.com/chunking_subnet', taostats: 'https://taostats.io/subnets/40/' },
  tweets: [],
};
