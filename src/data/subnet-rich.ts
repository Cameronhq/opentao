// Rich subnet content for the v1-final subnet-page template.
// Add a per-subnet TS file at src/data/subnets/<slug>.ts that exports a
// RichSubnet, then register it in `richSubnets` at the bottom.
//
// Subnets without a rich entry render the lightweight stub fallback in
// src/pages/beginner/subnets/[slug].astro.

export interface CycleStage {
  actor: 'Validator' | 'Miner' | 'Subtensor';
  title: string;       // 2-3 words
  body: string;        // 1-2 sentences
  dataK: string;       // small label, e.g. "payload" / "latency" / "scale" / "tempo"
  dataV: string;       // the value next to the label
}

export interface MinerRole {
  does: string;
  input: string;
  output: string;
  hardware: string;
  paidFor: string;
  paidVia: string;     // typically: "Per-tempo emission, score × validator stake"
}

export interface ValidatorRole {
  does: string;
  requires: string;
  output: string;
  paidFor: string;     // typically: "Submitting weights that agree with consensus median"
  paidVia: string;     // typically: "Per-tempo emission, stake × consensus alignment"
}

export interface Scoring {
  leadOneLine: string;     // 1 italic-friendly sentence
  explanation: string[];   // 2 paragraphs
  cheatPath: string;       // the red "what doesn't work" callout
}

export interface Customer {
  leadOneLine: string;
  explanation: string[];   // 2 paragraphs
}

export type AccessTone = 'open' | 'closed' | 'decn';

export interface CompetitorRow {
  name: string;
  subtitle?: string;       // e.g. "SN18", "DeepMind"
  approach: string;
  access: string;          // free-text e.g. "open · API"
  accessTone: AccessTone;
  differentiator: string;
  isSelf?: boolean;        // highlight the subnet row
}

export interface Competitive {
  scope: string;           // small "2026 · global · 120h skill" badge
  rows: CompetitorRow[];
  note: string;            // 1 paragraph after the table
}

export type FounderGradient = 'v' | 'a' | 'g';

export interface Founder {
  initials: string;
  gradient: FounderGradient;
  name: string;            // real name OR "[Founder N name]" placeholder
  role: string;
  bio: string;
  twitter?: string;
  github?: string;
}

export interface Team {
  intro: string[];         // 1-2 paragraphs about the operator
  founders: Founder[];     // 1-3 founders
  size: string;            // "~6-8" or exact number
  founded: string;         // year or year + brief context
  based: string;
  backers: string;         // free text — "Not publicly disclosed." is fine
  placeholder?: boolean;   // if any founder data is placeholder
}

export interface Milestone {
  date: string;            // "YYYY·MM" or "YYYY·Qn"
  text: string;
}

export interface JoinCta {
  title: string;
  body: string;
  asideNote: string;
}

export interface External {
  github?: string;
  website?: string;
  twitter?: string;
  taostats: string;        // always: https://taostats.io/subnets/<n>/
}

export interface Tweet {
  when: string;            // "3 days ago" or "2026·03"
  body: string;
}

export interface RichSubnet {
  slug: string;
  netuid: number;
  name: string;

  shortPitch: string;      // 1 sentence under 15 words
  overview: string[];      // 4 paragraphs

  cycle: {
    challenge: CycleStage;
    compute: CycleStage;
    score: CycleStage;
    settle: CycleStage;    // standard settle stage; same across subnets
  };

  miner: MinerRole;
  validator: ValidatorRole;

  scoring: Scoring;
  customer: Customer;
  competitive: Competitive;

  team: Team;
  milestones: Milestone[];

  join: JoinCta;

  tags: string[];          // owner-declared via taostats identity, normalized
  external: External;
  tweets?: Tweet[];        // optional recent operator tweets
}

/* ── Registry ────────────────────────────────────────────────────────────── */

import { apex } from './subnets/1-apex';
import { sn2 } from './subnets/2-dsperse';
import { sn3 } from './subnets/3-deprecated';
import { targon } from './subnets/4-targon';
import { sn5 } from './subnets/5-hone';
import { sn6 } from './subnets/6-numinous';
import { sn7 } from './subnets/7-allways';
import { sn8 } from './subnets/8-vanta';
import { iota } from './subnets/9-iota';
import { sn10 } from './subnets/10-swap';
import { sn11 } from './subnets/11-trajectoryrl';
import { sn12 } from './subnets/12-compute-horde';
import { dataUniverse } from './subnets/13-data-universe';
import { sn14 } from './subnets/14-cacheon';
import { sn15 } from './subnets/15-oro';
import { sn16 } from './subnets/16-bitads';
import { sn17 } from './subnets/17-404-gen';
import { zeus } from './subnets/18-zeus';
import { sn19 } from './subnets/19-blockmachine';
import { sn20 } from './subnets/20-groundlayer';
import { sn21 } from './subnets/21-adtao';
import { desearch } from './subnets/22-desearch';
import { sn23 } from './subnets/23-trishool';
import { sn24 } from './subnets/24-quasar';
import { sn25 } from './subnets/25-mainframe';
import { sn26 } from './subnets/26-perturb';
import { sn27 } from './subnets/27-nodexo';
import { sn28 } from './subnets/28-gm';
import { sn29 } from './subnets/29-coldint';
import { sn30 } from './subnets/30-pending';
import { sn31 } from './subnets/31-recall';
import { sn32 } from './subnets/32-itsai';
import { sn33 } from './subnets/33-readyai';
import { sn34 } from './subnets/34-bitmind';
import { sn35 } from './subnets/35-oxmarkets';
import { sn36 } from './subnets/36-eirel';
import { sn37 } from './subnets/37-aurelius';
import { sn38 } from './subnets/38-colosseum';
import { sn39 } from './subnets/39-deprecated';
import { sn40 } from './subnets/40-chunking';
import { sn41 } from './subnets/41-almanac';
import { masa } from './subnets/42-masa';
import { sn43 } from './subnets/43-graphite';
import { sn44 } from './subnets/44-score';
import { sn45 } from './subnets/45-talisman-ai';
import { sn46 } from './subnets/46-zipcode';
import { sn47 } from './subnets/47-evolai';
import { sn48 } from './subnets/48-quantum-compute';
import { sn49 } from './subnets/49-nepher-robotics';
import { sn50 } from './subnets/50-synth';
import { sn51 } from './subnets/51-lium-io';
import { sn52 } from './subnets/52-dojo';
import { sn53 } from './subnets/53-efficientfrontier';
import { sn54 } from './subnets/54-yanez-miid';
import { sn55 } from './subnets/55-niome';
import { gradients } from './subnets/56-gradients';
import { sn57 } from './subnets/57-57';
import { sn58 } from './subnets/58-pending';
import { sn59 } from './subnets/59-babelbit';
import { sn60 } from './subnets/60-bitsec-ai';
import { sn61 } from './subnets/61-redteam';
import { sn62 } from './subnets/62-ridges';
import { sn63 } from './subnets/63-enigma';
import { chutes } from './subnets/64-chutes';
import { sn65 } from './subnets/65-tao-private-network';
import { sn66 } from './subnets/66-ninja';
import { sn67 } from './subnets/67-harnyx';
import { sn68 } from './subnets/68-nova';
import { sn69 } from './subnets/69-69';
import { sn70 } from './subnets/70-nexisgen';
import { sn71 } from './subnets/71-leadpoet';
import { sn72 } from './subnets/72-streetvision-by-natix';
import { sn73 } from './subnets/73-parked';
import { sn74 } from './subnets/74-gittensor';
import { sn75 } from './subnets/75-hippius';
import { sn76 } from './subnets/76-byzantium';
import { sn77 } from './subnets/77-liquidity';
import { sn78 } from './subnets/78-vocence';
import { sn79 } from './subnets/79-mvtrx';
import { sn80 } from './subnets/80-dogelayer';
import { sn81 } from './subnets/81-deprecated';
import { sn82 } from './subnets/82-compelle';
import { sn83 } from './subnets/83-cliqueai';
import { sn84 } from './subnets/84-84';
import { sn85 } from './subnets/85-vidaio';
import { sn86 } from './subnets/86-sn86';
import { sn87 } from './subnets/87-luminar-network';
import { sn88 } from './subnets/88-investing';
import { sn89 } from './subnets/89-infinitehash';
import { sn90 } from './subnets/90-90';
import { sn91 } from './subnets/91-bitstarter-1';
import { sn92 } from './subnets/92-tensorclaw';
import { sn93 } from './subnets/93-bitcast';
import { sn94 } from './subnets/94-bitsota';
import { sn95 } from './subnets/95-95';
import { sn96 } from './subnets/96-verathos';
import { sn97 } from './subnets/97-albedo';
import { sn98 } from './subnets/98-forevermoney';
import { sn99 } from './subnets/99-leoma';
import { sn100 } from './subnets/100-pla-form';
import { sn101 } from './subnets/101-101';
import { sn102 } from './subnets/102-connitoai';
import { sn103 } from './subnets/103-djinn';
import { sn104 } from './subnets/104-for-sale-burn-to-uid1';
import { sn105 } from './subnets/105-beam';
import { sn106 } from './subnets/106-voidai';
import { sn107 } from './subnets/107-minos';
import { sn108 } from './subnets/108-talkhead';
import { sn109 } from './subnets/109-academia';
import { sn110 } from './subnets/110-green-compute';
import { sn111 } from './subnets/111-oneoneone';
import { sn112 } from './subnets/112-minotaur';
import { sn113 } from './subnets/113-tensorusd';
import { sn114 } from './subnets/114-soma';
import { sn115 } from './subnets/115-hashichain';
import { sn116 } from './subnets/116-116';
import { sn117 } from './subnets/117-117';
import { sn118 } from './subnets/118-ditto';
import { sn119 } from './subnets/119-satori';
import { affine } from './subnets/120-affine';
import { sn121 } from './subnets/121-sundae-bar';
import { sn122 } from './subnets/122-122';
import { sn123 } from './subnets/123-mantis';
import { sn124 } from './subnets/124-swarm';
import { sn125 } from './subnets/125-8-ball';
import { sn126 } from './subnets/126-poker44';
import { sn127 } from './subnets/127-astrid';
import { sn128 } from './subnets/128-byteleap';

export const richSubnets: Record<string, RichSubnet> = {
  '1-apex': apex,
  '2-dsperse': sn2,
  '3-deprecated': sn3,
  '4-targon': targon,
  '5-hone': sn5,
  '6-numinous': sn6,
  '7-allways': sn7,
  '8-vanta': sn8,
  '9-iota': iota,
  '10-swap': sn10,
  '11-trajectoryrl': sn11,
  '12-compute-horde': sn12,
  '13-data-universe': dataUniverse,
  '14-cacheon': sn14,
  '15-oro': sn15,
  '16-bitads': sn16,
  '17-404-gen': sn17,
  '18-zeus': zeus,
  '19-blockmachine': sn19,
  '20-groundlayer': sn20,
  '21-adtao': sn21,
  '22-desearch': desearch,
  '23-trishool': sn23,
  '24-quasar': sn24,
  '25-mainframe': sn25,
  '26-perturb': sn26,
  '27-nodexo': sn27,
  '28-gm': sn28,
  '29-coldint': sn29,
  '30-pending': sn30,
  '31-recall': sn31,
  '32-itsai': sn32,
  '33-readyai': sn33,
  '34-bitmind': sn34,
  '35-oxmarkets': sn35,
  '36-eirel': sn36,
  '37-aurelius': sn37,
  '38-colosseum': sn38,
  '39-deprecated': sn39,
  '40-chunking': sn40,
  '41-almanac': sn41,
  '42-masa': masa,
  '43-graphite': sn43,
  '44-score': sn44,
  '45-talisman-ai': sn45,
  '46-zipcode': sn46,
  '47-evolai': sn47,
  '48-quantum-compute': sn48,
  '49-nepher-robotics': sn49,
  '50-synth': sn50,
  '51-lium-io': sn51,
  '52-dojo': sn52,
  '53-efficientfrontier': sn53,
  '54-yanez-miid': sn54,
  '55-niome': sn55,
  '56-gradients': gradients,
  '57-57': sn57,
  '58-pending': sn58,
  '59-babelbit': sn59,
  '60-bitsec-ai': sn60,
  '61-redteam': sn61,
  '62-ridges': sn62,
  '63-enigma': sn63,
  '64-chutes': chutes,
  '65-tao-private-network': sn65,
  '66-ninja': sn66,
  '67-harnyx': sn67,
  '68-nova': sn68,
  '69-69': sn69,
  '70-nexisgen': sn70,
  '71-leadpoet': sn71,
  '72-streetvision-by-natix': sn72,
  '73-parked': sn73,
  '74-gittensor': sn74,
  '75-hippius': sn75,
  '76-byzantium': sn76,
  '77-liquidity': sn77,
  '78-vocence': sn78,
  '79-mvtrx': sn79,
  '80-dogelayer': sn80,
  '81-deprecated': sn81,
  '82-compelle': sn82,
  '83-cliqueai': sn83,
  '84-84': sn84,
  '85-vidaio': sn85,
  '86-sn86': sn86,
  '87-luminar-network': sn87,
  '88-investing': sn88,
  '89-infinitehash': sn89,
  '90-90': sn90,
  '91-bitstarter-1': sn91,
  '92-tensorclaw': sn92,
  '93-bitcast': sn93,
  '94-bitsota': sn94,
  '95-95': sn95,
  '96-verathos': sn96,
  '97-albedo': sn97,
  '98-forevermoney': sn98,
  '99-leoma': sn99,
  '100-pla-form': sn100,
  '101-101': sn101,
  '102-connitoai': sn102,
  '103-djinn': sn103,
  '104-for-sale-burn-to-uid1': sn104,
  '105-beam': sn105,
  '106-voidai': sn106,
  '107-minos': sn107,
  '108-talkhead': sn108,
  '109-academia': sn109,
  '110-green-compute': sn110,
  '111-oneoneone': sn111,
  '112-minotaur': sn112,
  '113-tensorusd': sn113,
  '114-soma': sn114,
  '115-hashichain': sn115,
  '116-116': sn116,
  '117-117': sn117,
  '118-ditto': sn118,
  '119-satori': sn119,
  '120-affine': affine,
  '121-sundae-bar': sn121,
  '122-122': sn122,
  '123-mantis': sn123,
  '124-swarm': sn124,
  '125-8-ball': sn125,
  '126-poker44': sn126,
  '127-astrid': sn127,
  '128-byteleap': sn128,
};

export function getRichSubnet(slug: string): RichSubnet | undefined {
  return richSubnets[slug];
}
