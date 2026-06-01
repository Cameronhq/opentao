import type { RichSubnet } from '../subnet-rich';

export const sn87: RichSubnet = {
  slug: '87-luminar-network',
  netuid: 87,
  name: 'Luminar Network',
  shortPitch: 'Decentralized AI video forensics — CCTV in, verified evidence out.',
  overview: [
    'Luminar Network is Bittensor Subnet 87, a decentralized AI engine that turns raw CCTV footage into verified forensic intelligence. The mission is to make video evidence usable by communities, investigators, and platforms by running anomaly detection, event extraction, and structured-evidence generation across a network of miners.',
    'The subnet also runs as an AI-powered crime-reporting and community-safety surface — users can submit alerts and incident reports, and miners on the subnet process the incoming media into structured forensic outputs (timestamps, anomaly tags, event chains). Validators score the quality and correctness of those outputs and emit weights accordingly.',
    'External buyers are public-safety agencies, neighborhood-watch operators, insurance investigators, and platforms that handle large flows of incident video. The combination of "real-world video in" and "audit-grade structured evidence out" is the wedge — most forensic tooling today is either expensive vendor software or one-off contractor work.',
    'One-line diff: a TAO-incentivized forensic-video pipeline that any small org can call, instead of paying a specialist vendor. <a href="#customer" style="color: var(--accent);">See competitive landscape ↓</a>',
  ],
  cycle: {
    challenge: { actor: 'Validator', title: 'Submit footage', body: 'Validators dispatch CCTV clips or incident submissions to miners, along with the type of forensic output requested — anomaly detection, event extraction, or structured report.', dataK: 'payload', dataV: 'CCTV clip + spec' },
    compute:   { actor: 'Miner',     title: 'Run forensic AI', body: 'Miners run anomaly-detection and event-extraction models against the footage, producing structured forensic outputs (timestamps, anomaly tags, event chains, and supporting evidence frames).', dataK: 'latency',  dataV: 'process time / clip' },
    score:     { actor: 'Validator', title: 'Score correctness', body: 'Validators compare miner outputs against ground-truth annotations or benchmark cases, scoring on detection precision/recall and the structural quality of the forensic report.', dataK: 'scale',    dataV: 'precision · recall' },
    settle:    { actor: 'Subtensor', title: 'Yuma → emission', body: "Every validator's weights, multiplied by their stake, aggregated by Yuma into one reward vector. TAO mints to top miners.", dataK: 'tempo', dataV: '~72 min · 24×/day' },
  },
  miner: {
    does: 'Runs forensic computer-vision models on CCTV-style footage to detect anomalies, extract events, and produce structured evidence outputs suitable for downstream investigation.',
    input: 'Video clip / incident submission + requested output type',
    output: 'Structured forensic report (anomalies, events, timestamps, evidence frames)',
    hardware: 'GPU with enough VRAM for object-detection and temporal models on multi-frame clips',
    paidFor: 'Detection and report-quality scores over the tempo window',
    paidVia: 'Per-tempo emission, score × validator stake',
  },
  validator: {
    does: 'Dispatches footage to miners, evaluates miner outputs against ground truth or benchmark annotations, and submits a weight vector ranking miners by forensic quality.',
    requires: 'Bittensor validator stake + access to annotated forensic benchmark datasets',
    output: 'Weight vector across miner hotkeys per tempo',
    paidFor: 'Submitting weights that agree with consensus median',
    paidVia: 'Per-tempo emission, stake × consensus alignment',
  },
  scoring: {
    leadOneLine: 'Forensic precision / recall on detection and event extraction, plus structural quality of the generated report.',
    explanation: [
      'Validators compare miner outputs against annotated forensic ground truth — anomalies present in the clip, events that should be extracted, and the timestamps where they occur. Scores combine standard detection metrics (precision, recall) with structural correctness of the generated report (timestamps, event chains, evidence frames).',
      'Because the output is intended to be evidentiary, the scoring also penalizes hallucinated detections more heavily than missed ones, which biases miners toward higher-precision pipelines rather than spammy outputs.',
    ],
    cheatPath: 'A miner that floods reports with fabricated detections will be punished by precision-weighted scoring — validators check claimed anomalies against ground truth, and false positives cost more than misses. Pre-cached responses also fail because benchmark clips are rotated and timestamps are unique per submission.',
  },
  customer: {
    leadOneLine: 'Public-safety teams, insurance investigators, and community platforms that need affordable, structured forensic video analysis.',
    explanation: [
      'The headline customer is anyone holding video evidence: small police departments, neighborhood-watch groups, building-security operators, insurance fraud teams, and platforms that aggregate community safety reports. Today these buyers either pay specialist forensic vendors or rely on a human investigator scrubbing footage by hand.',
      'Luminar\'s value is automating the early-stage triage and event-extraction work so that downstream investigators only need to verify, not search. The subnet positions itself as a callable forensic layer rather than a single-vendor SaaS, which is attractive for buyers who do not want to commit to a closed pipeline.',
    ],
  },
  competitive: {
    scope: 'AI video forensics & anomaly detection · 2026',
    rows: [
      { name: 'Luminar Network', subtitle: 'SN87', isSelf: true, approach: 'Decentralized miner network runs forensic CV models on CCTV/incident submissions; structured reports scored by validators.', access: 'open · API', accessTone: 'open', differentiator: 'Only TAO-incentivized forensic-video pipeline — open supply, audit-friendly outputs.' },
      { name: 'BriefCam', approach: 'Enterprise video-analytics platform for law enforcement (video synopsis, search).', access: 'closed · enterprise', accessTone: 'closed', differentiator: 'Mature LEO vendor with deep workflow integration; expensive and closed.' },
      { name: 'Verkada', approach: 'Cloud-managed cameras with built-in AI analytics for security operations.', access: 'closed · vendor', accessTone: 'closed', differentiator: 'Hardware + cloud bundle; locks customers into their cameras and platform.' },
      { name: 'Eagle Eye Networks', approach: 'Cloud VMS with AI anomaly detection on top of existing CCTV infrastructure.', access: 'closed · cloud', accessTone: 'closed', differentiator: 'Strong VMS layer, but proprietary and per-camera subscription pricing.' },
      { name: 'Open-source CV stacks (YOLO + DeepStream)', approach: 'Roll-your-own video analytics using open models and Nvidia tooling.', access: 'open · OSS', accessTone: 'open', differentiator: 'Free but engineering-heavy; no hosted compute, no scoring layer.' },
    ],
    note: 'Luminar\'s differentiator is open supply + structured forensic output. Enterprise vendors are accurate but closed and expensive; open-source CV is free but requires a real engineering team. Luminar plugs a TAO incentive layer on top of forensic CV so that buyers get a callable, competitive pool of miners.',
  },
  team: {
    intro: [
      'Luminar Network is operated by a team focused on decentralized AI for video forensics and community safety. Public-facing materials (a "Decentralized Video Forensic engine powered by Bittensor" launch video and subnet listings) describe the project, but detailed founder bios are not yet broadly indexed.',
      'The brand is operationally distinct from the lidar company Luminar Technologies and the security-camera vendor Luminys; this profile refers strictly to the Bittensor SN87 operator.',
    ],
    founders: [
      { initials: '??', gradient: 'v', name: '[Founder name]', role: 'Subnet owner / Luminar Network', bio: 'Operates the Luminar Network forensic-video subnet on Bittensor (SN87).' },
    ],
    size: 'Small core team',
    founded: '2025',
    based: 'Not publicly disclosed',
    backers: 'Not publicly disclosed.',
    placeholder: true,
  },
  milestones: [
    { date: '2025', text: 'Subnet 87 registered on Bittensor as Luminar Network — decentralized AI video forensic engine.' },
    { date: '2025–26', text: 'AI-powered crime-reporting and community-safety surface introduced.' },
  ],
  join: {
    title: 'Run a Luminar forensic miner',
    body: 'Stand up a CV-capable GPU box, pull the Luminar miner client, and serve forensic jobs dispatched by validators. Strong object-detection and temporal-modeling stacks tend to outperform on detection precision and event-chain quality.',
    asideNote: 'Precision is weighted heavily — fabricated detections hurt your score more than misses.',
  },
  tags: ['video', 'forensics', 'cctv', 'computer-vision', 'safety'],
  external: {
    taostats: 'https://taostats.io/subnets/87/',
  },
};
