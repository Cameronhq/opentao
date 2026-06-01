import type { APIRoute } from 'astro';
import { insights } from '../data/insights';

const SITE = 'https://opentao.ai';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function pubDate(d: string): string {
  // "2026·05·19" → Date
  const [y, m, day] = d.split('·').map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, day || 1)).toUTCString();
}

export const GET: APIRoute = () => {
  const items = [...insights]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${SITE}/community/insights/${i.slug}</link>
      <guid isPermaLink="true">${SITE}/community/insights/${i.slug}</guid>
      <pubDate>${pubDate(i.date)}</pubDate>
      <category>${esc(i.type)}</category>
      <author>${esc(i.author)}</author>
      <description>${esc(i.lead)}</description>
    </item>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>OpenTAO · Insights</title>
    <link>${SITE}/community/insights</link>
    <description>Deep dives, retrospectives, and interviews on Bittensor.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
