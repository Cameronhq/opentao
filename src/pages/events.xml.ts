import type { APIRoute } from 'astro';
import { events } from '../data/events';

const SITE = 'https://opentao.ai';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function pubDate(date: string, time: string): string {
  const [hStr] = time.split(' ');
  const [hh, mm] = hStr.split(':').map(Number);
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh || 0, mm || 0)).toUTCString();
}

export const GET: APIRoute = () => {
  const items = [...events]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((e) => `    <item>
      <title>${esc(e.title)}</title>
      <link>${SITE}/community/events/${e.slug}</link>
      <guid isPermaLink="true">${SITE}/community/events/${e.slug}</guid>
      <pubDate>${pubDate(e.date, e.time)}</pubDate>
      <category>${esc(e.category)}</category>
      <description>${esc(`${e.blurb} · ${e.location} · ${e.time}`)}</description>
    </item>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>OpenTAO · Events</title>
    <link>${SITE}/community/events</link>
    <description>Upcoming Bittensor meetups, AMAs, workshops, and demo days.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
