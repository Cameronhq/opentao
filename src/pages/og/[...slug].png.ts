// One PNG per built page. Routes at /og/{page-slug}.png and BaseLayout
// computes the og:image url from Astro.url.pathname.

import type { APIRoute } from 'astro';
import { renderOg } from '../../lib/og';
import { concepts } from '../../data/concepts';
import { subnets } from '../../data/subnets';
import { playbooks } from '../../data/playbooks';
import { chapters } from '../../data/chapters';
import { events } from '../../data/events';
import { insights } from '../../data/insights';

interface Spec {
  slug: string; // matches Astro.url.pathname without leading /, '' for landing
  title: string;
  section: string;
  tag?: string;
}

const STATIC: Spec[] = [
  { slug: '', title: "Builder's Gateway to Bittensor", section: 'OpenTAO', tag: 'v0.1' },
  { slug: 'beginner/wiki', title: 'The Bittensor Wiki', section: 'Beginner · Wiki', tag: '25 concepts' },
  { slug: 'beginner/subnets', title: 'Subnet Directory', section: 'Beginner · Directory', tag: '128 subnets' },
  { slug: 'build/hackathon', title: 'OpenTAO Hackathon · Season 1', section: 'Build a subnet · Hackathon', tag: 'live' },
  { slug: 'build/incubator', title: 'A 10-week run to mainnet', section: 'Build a subnet · Incubator', tag: 'cohort 02' },
  { slug: 'build/idea-bank', title: "Twelve subnets that don't exist yet", section: 'Build a subnet · Idea bank', tag: '12 open' },
  { slug: 'mine/general-setup', title: 'General Setup for Mining', section: 'Start mining · Setup', tag: '8 steps' },
  { slug: 'mine/playbooks', title: 'Subnet Playbooks', section: 'Start mining · Playbooks', tag: '128 · 12 verified' },
  { slug: 'mine/resources', title: 'Mining Resources', section: 'Start mining · Resources' },
  { slug: 'community/events', title: 'Find your people', section: 'Community · Events', tag: 'live' },
  { slug: 'community/chapters', title: 'Twelve local groups', section: 'Community · Chapters', tag: '12 cities' },
  { slug: 'community/insights', title: 'Long reads', section: 'Community · Insights', tag: '7 articles' },
  { slug: 'community/become-a-host', title: 'Show up for your city', section: 'Community · Become a host', tag: 'apply' },
  { slug: 'community/insights/contribute', title: 'Send the outline first', section: 'Community · Insights · Pitch', tag: '5 formats' },
];

function specs(): Spec[] {
  const all: Spec[] = [...STATIC];

  for (const c of concepts) {
    all.push({
      slug: `beginner/concepts/${c.slug}`,
      title: c.title || c.slug,
      section: `Beginner · Wiki · ${c.cluster || 'Concept'}`,
    });
  }

  for (const s of subnets) {
    all.push({
      slug: `beginner/subnets/${s.slug}`,
      title: `SN${s.netuid} · ${s.name}`,
      section: `Subnet · ${s.catLabel}`,
      tag: s.rich ? 'rich' : 'stub',
    });
  }

  for (const p of playbooks) {
    all.push({
      slug: `mine/playbooks/${p.slug}`,
      title: `${p.name} — Mining Playbook`,
      section: `Playbook · SN${p.netuid}`,
      tag: p.status,
    });
  }

  for (const c of chapters) {
    all.push({
      slug: `community/chapters/${c.slug}`,
      title: `${c.city} Chapter`,
      section: `Community · Chapter · ${c.region}`,
      tag: c.events,
    });
  }

  for (const e of events) {
    all.push({
      slug: `community/events/${e.slug}`,
      title: e.title,
      section: `Community · ${e.category}`,
      tag: e.date,
    });
  }

  for (const i of insights) {
    all.push({
      slug: `community/insights/${i.slug}`,
      title: i.title,
      section: `Insight · ${i.type}`,
      tag: i.readTime,
    });
  }

  return all;
}

export async function getStaticPaths() {
  return specs().map((s) => ({
    // empty slug = landing → /og/index.png
    params: { slug: s.slug === '' ? 'index' : s.slug },
    props: { spec: s },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const spec = (props as { spec: Spec }).spec;
  const png = await renderOg({ title: spec.title, section: spec.section, tag: spec.tag });
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
