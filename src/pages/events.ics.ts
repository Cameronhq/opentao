import type { APIRoute } from 'astro';
import { events } from '../data/events';

const SITE = 'https://opentao.ai';

// RFC 5545 escape: backslash, semicolon, comma, newline
function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// Convert "09:00 PST" / "18:00 UTC" / "17:00 CEST" to a UTC offset in minutes.
// We approximate non-UTC times by tagging them as floating local times (no TZ),
// which calendar apps interpret in viewer's local zone. Good enough for stubs.
function toIcsTime(date: string, time: string): { dtstart: string } {
  // date "2026-06-08", time "19:00 JST"
  const [hStr] = time.split(' ');
  const [hh, mm] = hStr.split(':');
  const [y, m, d] = date.split('-');
  const dtstart = `${y}${m}${d}T${hh}${mm}00`;
  return { dtstart };
}

function addMinutes(dtstart: string, minutes: number): string {
  // dtstart format: YYYYMMDDTHHMMSS
  const y = Number(dtstart.slice(0, 4));
  const mo = Number(dtstart.slice(4, 6)) - 1;
  const d = Number(dtstart.slice(6, 8));
  const h = Number(dtstart.slice(9, 11));
  const mi = Number(dtstart.slice(11, 13));
  const dt = new Date(Date.UTC(y, mo, d, h, mi));
  dt.setUTCMinutes(dt.getUTCMinutes() + minutes);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00`;
}

export const GET: APIRoute = () => {
  const now = new Date();
  const dtstamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}T${String(now.getUTCHours()).padStart(2, '0')}${String(now.getUTCMinutes()).padStart(2, '0')}00Z`;

  const vEvents = events.map((e) => {
    const { dtstart } = toIcsTime(e.date, e.time);
    const dur = e.duration ? Number(e.duration.replace(/[^0-9]/g, '')) || 60 : 60;
    const dtend = addMinutes(dtstart, dur);
    return [
      'BEGIN:VEVENT',
      `UID:${e.slug}@opentao.ai`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:${esc(e.title)}`,
      `DESCRIPTION:${esc(e.blurb)}`,
      `LOCATION:${esc(e.location)}`,
      `URL:${SITE}/community/events/${e.slug}`,
      e.host ? `ORGANIZER;CN=${esc(e.host)}:mailto:events@opentao.ai` : '',
      'END:VEVENT',
    ].filter(Boolean).join('\r\n');
  });

  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenTAO//Events//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:OpenTAO Events',
    ...vEvents,
    'END:VCALENDAR',
  ].join('\r\n') + '\r\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="opentao-events.ics"',
    },
  });
};
