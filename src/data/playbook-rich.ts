// Rich playbook content for individual subnets. The slim `Playbook` list in
// playbooks.ts powers the directory; this registry powers the detail page.

import type { PlaybookCat } from './playbooks';

export type SetupShape =
  | 'simple-binary'   // python neurons/miner.py … (most subnets)
  | 'fleet-k8s'       // K3s + Helm + multi-node (Chutes)
  | 'docker-compose'; // single-host compose stacks

export interface HardwareNode {
  role: string;                // "Control node" / "GPU node"
  count?: string;              // "1" / "1-N per GPU"
  gpu?: string;                // "1×H100 80GB" — omit for non-GPU nodes
  vramGb?: number;
  cpuCores: number;
  ramGb: number;
  diskGb: number;
  bandwidth?: string;
  notes?: string;
}

export interface RichPlaybook {
  slug: string;
  netuid: number;
  name: string;
  category: PlaybookCat;
  categoryLabel: string;

  // Lead
  blurb: string;
  whatMinersDo: string;
  verifiedAt: string;
  verifiedBy: string;

  // Live-data fallbacks (taostats overrides at runtime)
  emission: string;
  burnCostFallback: string;
  minerCountFallback: number;
  slotCap: number;                  // 192/256/etc., for "X of Y slots" display

  // Hardware: one or more node types (Chutes has control + GPU; most subnets one row)
  hardware: HardwareNode[];
  hardwareNote?: string;
  rentalOk: boolean;                // false for subnets that ban rented GPUs (Chutes)
  rentalNote?: string;              // free text when rentalOk=false explains why
  rentalUsdPerHr?: {                // only relevant when rentalOk=true
    lambda?: number;
    runpod?: number;
    coreweave?: number;
  };

  // Repo
  repo: {
    url: string;
    branch: string;
    verifiedCommit?: string;
    extraRepos?: { name: string; url: string; purpose: string }[];
  };

  // Setup shape + steps
  setupShape: SetupShape;
  setupOverview: string;            // 2–3 sentence intro to setup model
  install: { step: string; cmd?: string; note?: string }[];
  runSteps: { step: string; cmd?: string; note?: string }[];

  // Env / secrets
  envVars: { name: string; description: string; required: boolean }[];

  // Validator scoring
  scoring: {
    summary: string;
    rule: string;
    sourcePath?: string;
    cheatPath: string;
  };

  // Profitability
  profitability: {
    estimatedDailyEmissionPerUid: number; // τ/day, average
    tokenPriceUsdFallback: number;
    capexNote?: string;
    notes?: string;
  };

  // Milestones
  milestones: { day: string; target: string; note: string }[];

  // Monitoring
  monitoring: { metric: string; threshold: string; where: string }[];

  // Known issues
  knownIssues: { symptom: string; cause: string; fix: string }[];

  // Operator notes
  notes?: string[];
}

// Registry — imported as needed by [slug].astro
import { sn1 } from './playbooks/1-apex';
import { sn2 } from './playbooks/2-dsperse';
import { sn3 } from './playbooks/3-deprecated';
import { sn4 } from './playbooks/4-targon';
import { sn5 } from './playbooks/5-hone';
import { sn6 } from './playbooks/6-numinous';
import { sn7 } from './playbooks/7-allways';
import { sn8 } from './playbooks/8-vanta';
import { sn9 } from './playbooks/9-iota';
import { sn10 } from './playbooks/10-swap';
import { sn11 } from './playbooks/11-trajectoryrl';
import { sn12 } from './playbooks/12-compute-horde';
import { sn13 } from './playbooks/13-data-universe';
import { sn14 } from './playbooks/14-cacheon';
import { sn15 } from './playbooks/15-oro';
import { sn16 } from './playbooks/16-bitads';
import { sn17 } from './playbooks/17-404-gen';
import { sn18 } from './playbooks/18-zeus';
import { sn19 } from './playbooks/19-blockmachine';
import { sn20 } from './playbooks/20-groundlayer';
import { sn21 } from './playbooks/21-adtao';
import { sn22 } from './playbooks/22-desearch';
import { sn23 } from './playbooks/23-trishool';
import { sn24 } from './playbooks/24-quasar';
import { sn25 } from './playbooks/25-mainframe';
import { sn26 } from './playbooks/26-perturb';
import { sn27 } from './playbooks/27-nodexo';
import { sn28 } from './playbooks/28-gm';
import { sn29 } from './playbooks/29-coldint';
import { sn30 } from './playbooks/30-pending';
import { sn31 } from './playbooks/31-recall';
import { sn32 } from './playbooks/32-itsai';
import { sn33 } from './playbooks/33-readyai';
import { sn34 } from './playbooks/34-bitmind';
import { sn35 } from './playbooks/35-oxmarkets';
import { sn36 } from './playbooks/36-eirel';
import { sn37 } from './playbooks/37-aurelius';
import { sn38 } from './playbooks/38-colosseum';
import { sn39 } from './playbooks/39-deprecated';
import { sn40 } from './playbooks/40-chunking';
import { sn41 } from './playbooks/41-almanac';
import { sn42 } from './playbooks/42-masa';
import { sn43 } from './playbooks/43-graphite';
import { sn44 } from './playbooks/44-score';
import { sn45 } from './playbooks/45-talisman-ai';
import { sn46 } from './playbooks/46-zipcode';
import { sn47 } from './playbooks/47-evolai';
import { sn48 } from './playbooks/48-quantum-compute';
import { sn49 } from './playbooks/49-nepher-robotics';
import { sn50 } from './playbooks/50-synth';
import { sn51 } from './playbooks/51-lium-io';
import { sn52 } from './playbooks/52-dojo';
import { sn53 } from './playbooks/53-efficientfrontier';
import { sn54 } from './playbooks/54-yanez-miid';
import { sn55 } from './playbooks/55-niome';
import { sn56 } from './playbooks/56-gradients';
import { sn57 } from './playbooks/57-57';
import { sn58 } from './playbooks/58-pending';
import { sn59 } from './playbooks/59-babelbit';
import { sn60 } from './playbooks/60-bitsec-ai';
import { sn61 } from './playbooks/61-redteam';
import { sn62 } from './playbooks/62-ridges';
import { sn63 } from './playbooks/63-enigma';
import { chutes } from './playbooks/64-chutes';
import { sn65 } from './playbooks/65-tao-private-network';
import { sn66 } from './playbooks/66-ninja';
import { sn67 } from './playbooks/67-harnyx';
import { sn68 } from './playbooks/68-nova';
import { sn69 } from './playbooks/69-69';
import { sn70 } from './playbooks/70-nexisgen';
import { sn71 } from './playbooks/71-leadpoet';
import { sn72 } from './playbooks/72-streetvision-by-natix';
import { sn73 } from './playbooks/73-parked';
import { sn74 } from './playbooks/74-gittensor';
import { sn75 } from './playbooks/75-hippius';
import { sn76 } from './playbooks/76-byzantium';
import { sn77 } from './playbooks/77-liquidity';
import { sn78 } from './playbooks/78-vocence';
import { sn79 } from './playbooks/79-mvtrx';
import { sn80 } from './playbooks/80-dogelayer';
import { sn81 } from './playbooks/81-deprecated';
import { sn82 } from './playbooks/82-compelle';
import { sn83 } from './playbooks/83-cliqueai';
import { sn84 } from './playbooks/84-84';
import { sn85 } from './playbooks/85-vidaio';
import { sn86 } from './playbooks/86-sn86';
import { sn87 } from './playbooks/87-luminar-network';
import { sn88 } from './playbooks/88-investing';
import { sn89 } from './playbooks/89-infinitehash';
import { sn90 } from './playbooks/90-90';
import { sn91 } from './playbooks/91-bitstarter-1';
import { sn92 } from './playbooks/92-tensorclaw';
import { sn93 } from './playbooks/93-bitcast';
import { sn94 } from './playbooks/94-bitsota';
import { sn95 } from './playbooks/95-95';
import { sn96 } from './playbooks/96-verathos';
import { sn97 } from './playbooks/97-albedo';
import { sn98 } from './playbooks/98-forevermoney';
import { sn99 } from './playbooks/99-leoma';
import { sn100 } from './playbooks/100-pla-form';
import { sn101 } from './playbooks/101-101';
import { sn102 } from './playbooks/102-connitoai';
import { sn103 } from './playbooks/103-djinn';
import { sn104 } from './playbooks/104-for-sale-burn-to-uid1';
import { sn105 } from './playbooks/105-beam';
import { sn106 } from './playbooks/106-voidai';
import { sn107 } from './playbooks/107-minos';
import { sn108 } from './playbooks/108-talkhead';
import { sn109 } from './playbooks/109-academia';
import { sn110 } from './playbooks/110-green-compute';
import { sn111 } from './playbooks/111-oneoneone';
import { sn112 } from './playbooks/112-minotaur';
import { sn113 } from './playbooks/113-tensorusd';
import { sn114 } from './playbooks/114-soma';
import { sn115 } from './playbooks/115-hashichain';
import { sn116 } from './playbooks/116-116';
import { sn117 } from './playbooks/117-117';
import { sn118 } from './playbooks/118-ditto';
import { sn119 } from './playbooks/119-satori';
import { sn120 } from './playbooks/120-affine';
import { sn121 } from './playbooks/121-sundae-bar';
import { sn122 } from './playbooks/122-122';
import { sn123 } from './playbooks/123-mantis';
import { sn124 } from './playbooks/124-swarm';
import { sn125 } from './playbooks/125-8-ball';
import { sn126 } from './playbooks/126-poker44';
import { sn127 } from './playbooks/127-astrid';
import { sn128 } from './playbooks/128-byteleap';

export const richPlaybooks: Record<string, RichPlaybook> = {
  '1-apex': sn1,
  '2-dsperse': sn2,
  '3-deprecated': sn3,
  '4-targon': sn4,
  '5-hone': sn5,
  '6-numinous': sn6,
  '7-allways': sn7,
  '8-vanta': sn8,
  '9-iota': sn9,
  '10-swap': sn10,
  '11-trajectoryrl': sn11,
  '12-compute-horde': sn12,
  '13-data-universe': sn13,
  '14-cacheon': sn14,
  '15-oro': sn15,
  '16-bitads': sn16,
  '17-404-gen': sn17,
  '18-zeus': sn18,
  '19-blockmachine': sn19,
  '20-groundlayer': sn20,
  '21-adtao': sn21,
  '22-desearch': sn22,
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
  '42-masa': sn42,
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
  '56-gradients': sn56,
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
  '120-affine': sn120,
  '121-sundae-bar': sn121,
  '122-122': sn122,
  '123-mantis': sn123,
  '124-swarm': sn124,
  '125-8-ball': sn125,
  '126-poker44': sn126,
  '127-astrid': sn127,
  '128-byteleap': sn128,
};

export function getRichPlaybook(slug: string): RichPlaybook | undefined {
  return richPlaybooks[slug];
}
