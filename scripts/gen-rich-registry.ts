#!/usr/bin/env bun
// Scans src/data/subnets/*.ts and regenerates the registry block in src/data/subnet-rich.ts.
// Each file must export `export const sn{netuid}: RichSubnet = {...}` or a named alias for tier-1.
//
// Usage:  bun run scripts/gen-rich-registry.ts

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = 'src/data/subnets';
const RICH_FILE = 'src/data/subnet-rich.ts';

interface Found { slug: string; netuid: number; varName: string; }

const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts')).sort();
const found: Found[] = [];

for (const file of files) {
  const slug = file.replace(/\.ts$/, '');
  const netuid = Number(slug.split('-')[0]);
  const src = readFileSync(join(DATA_DIR, file), 'utf8');
  // Find the exported const name: `export const NAME: RichSubnet`
  const m = src.match(/export\s+const\s+(\w+)\s*:\s*RichSubnet/);
  if (!m) {
    console.warn(`[skip] ${file} — no \`export const X: RichSubnet\` found`);
    continue;
  }
  found.push({ slug, netuid, varName: m[1] });
}

found.sort((a, b) => a.netuid - b.netuid);

const imports = found.map((f) => `import { ${f.varName} } from './subnets/${f.slug}';`).join('\n');
const entries = found.map((f) => `  '${f.slug}': ${f.varName},`).join('\n');

const block = `${imports}

export const richSubnets: Record<string, RichSubnet> = {
${entries}
};

export function getRichSubnet(slug: string): RichSubnet | undefined {
  return richSubnets[slug];
}
`;

const rich = readFileSync(RICH_FILE, 'utf8');
// Replace the registry block (everything from the first `import { ` line that targets ./subnets/, through the bottom of the file)
const updated = rich.replace(
  /import\s+\{[^}]*\}\s+from\s+'\.\/subnets\/[^']+'\s*;[\s\S]*$/,
  block,
);

writeFileSync(RICH_FILE, updated);
console.log(`Registry updated. Imported ${found.length} subnets.`);
