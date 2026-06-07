// Mining playbook registry — DERIVED from the live subnet registry (subnets.ts,
// 6h taostats refresh) joined with the rich playbook content by NETUID. This
// replaced a hand-maintained static array whose slugs/names drifted as subnets
// were renamed (netuid stayed put, slug didn't), which broke the detail-page
// join to rich content. netuid is the chain's canonical identity, so joining on
// it keeps the listing, detail pages, /mining-data.json and the MCP correct as
// subnets get renamed. Old slugs are 301-redirected via astro.config redirects.
import { subnets } from './subnets';
import { getRichPlaybookByNetuid, playbookStatusByNetuid } from './playbook-rich';

export type PlaybookCat = 'llm' | 'vision' | 'audio' | 'robotics' | 'data' | 'reason' | 'storage' | 'compute';
export type PlaybookStatus = 'verified' | 'draft' | 'missing';

export interface Playbook {
  netuid: string;
  name: string;
  slug: string;
  category: PlaybookCat;
  categoryLabel: string;
  emission: string;
  blurb: string;
  status: PlaybookStatus;
  statusText: string;
  href: string;
  hardware?: string;
  setupTime?: string;
  firstEmission?: string;
}

export const playbooks: Playbook[] = subnets
  .map((s): Playbook => {
    const rich = getRichPlaybookByNetuid(s.netuid);
    const st = playbookStatusByNetuid(s.netuid);
    return {
      netuid: String(s.netuid),
      name: s.name,
      slug: s.slug, // canonical live slug — detail pages live here
      category: (rich?.category ?? s.cat) as PlaybookCat,
      categoryLabel: rich?.categoryLabel ?? s.catLabel,
      emission: s.emission,
      blurb: rich?.blurb ?? s.description,
      status: st.status,
      statusText: st.statusText,
      href: `/mine/playbooks/${s.slug}`,
    };
  })
  .sort((a, b) => Number(a.netuid) - Number(b.netuid));

export function getPlaybook(slug: string): Playbook | undefined {
  return playbooks.find((p) => p.slug === slug);
}

export const stats = {
  total: playbooks.length,
  verified: playbooks.filter((p) => p.status === 'verified').length,
  draft: playbooks.filter((p) => p.status === 'draft').length,
  missing: playbooks.filter((p) => p.status === 'missing').length,
};
