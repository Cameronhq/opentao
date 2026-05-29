// OG image renderer. Used by src/pages/og/[...slug].png.ts to produce one
// per-page social card during `bun run build`.
//
// Visual: white paper, hairline border, section eyebrow + accent dot,
// big Inter title with optional Fraunces-italic accent, OpenTAO wordmark
// in the corner. Designed to feel like the site, not like a generic OG card.

import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

// Resolve fonts from project root — Astro prerender chunks live in dist/.prerender/
// so relative-to-module paths don't survive bundling.
const fontDir = path.join(process.cwd(), 'src/assets/fonts');

// v1 OG renderer uses Roboto (visually close to Inter, reliably distributed as
// static TTF). Swap to real Inter when a static-instance TTF source exists.
const sansRegular = fs.readFileSync(path.join(fontDir, 'Inter-Regular.ttf'));
const sansBold = fs.readFileSync(path.join(fontDir, 'Inter-SemiBold.ttf'));
const monoRegular = fs.readFileSync(path.join(fontDir, 'JetBrainsMono-Regular.ttf'));

export interface OgParams {
  /** Big title, ≤ 80 chars looks best */
  title: string;
  /** Eyebrow line above the title, e.g. "Build a subnet · Idea bank" */
  section: string;
  /** Optional accent tag bottom-left, e.g. "12 open" or "verified" */
  tag?: string;
}

const SECTION_ACCENT: Record<string, string> = {
  Beginner: '#1c6ea4',
  Build: '#b8470b',
  Mine: '#15803d',
  Community: '#6741d9',
  OpenTAO: '#b8470b',
};

function pickAccent(section: string): string {
  for (const key of Object.keys(SECTION_ACCENT)) {
    if (section.toLowerCase().startsWith(key.toLowerCase())) {
      return SECTION_ACCENT[key];
    }
  }
  return '#b8470b';
}

// JSX-less Satori tree. Satori accepts plain objects shaped like React elements.
function node(type: string, props: Record<string, any> = {}, children?: any) {
  return { type, props: { ...props, children } };
}

export async function renderOg({ title, section, tag }: OgParams): Promise<Buffer> {
  const accent = pickAccent(section);

  // Long titles need a smaller font
  const titleSize = title.length > 60 ? 64 : title.length > 38 ? 80 : 96;

  const tree = node('div', {
    style: {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 72,
      fontFamily: 'Inter',
      color: '#0c0c10',
      position: 'relative',
    },
  }, [
    // Dot-grid background, subtle
    node('div', {
      style: {
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(15,15,18,0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.4,
      },
    }),

    // Top: eyebrow
    node('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: 'JetBrains Mono', fontSize: 18, color: '#767680',
        letterSpacing: '0.14em', textTransform: 'uppercase',
      },
    }, [
      node('div', { style: { width: 8, height: 8, borderRadius: 999, background: accent } }),
      node('span', {}, section),
    ]),

    // Spacer
    node('div', { style: { flex: 1 } }),

    // Title
    node('div', {
      style: {
        display: 'flex', flexDirection: 'column', gap: 24,
      },
    }, [
      node('div', {
        style: {
          fontSize: titleSize, fontWeight: 600,
          letterSpacing: '-0.03em', lineHeight: 1.04,
          color: '#0c0c10',
          maxWidth: 1056,
        },
      }, title),

      // Accent rule
      node('div', {
        style: {
          width: 80, height: 3, background: accent, marginTop: 8,
        },
      }),
    ]),

    // Spacer
    node('div', { style: { flex: 1 } }),

    // Footer: wordmark + tag
    node('div', {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'JetBrains Mono', fontSize: 16, color: '#767680',
      },
    }, [
      node('div', { style: { display: 'flex', alignItems: 'center', gap: 14 } }, [
        node('span', {
          style: { fontFamily: 'Inter', fontWeight: 600, fontSize: 22, color: '#0c0c10', letterSpacing: '-0.01em' },
        }, 'OpenTAO'),
        node('span', { style: { color: '#b8b8be' } }, '·'),
        node('span', {}, "Builder's Gateway to Bittensor"),
      ]),
      tag
        ? node('div', {
            style: {
              padding: '8px 14px',
              border: `1px solid ${accent}33`,
              background: `${accent}11`,
              color: accent,
              fontSize: 14,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderRadius: 6,
            },
          }, tag)
        : node('div', {}, 'opentao.ai'),
    ]),
  ]);

  const svg = await satori(tree as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: sansRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: sansBold, weight: 600, style: 'normal' },
      { name: 'JetBrains Mono', data: monoRegular, weight: 400, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return Buffer.from(png);
}
