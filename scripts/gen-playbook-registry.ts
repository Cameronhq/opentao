#!/usr/bin/env bun
// Scans src/data/playbooks/*.ts and regenerates the registry block at the
// bottom of src/data/playbook-rich.ts. Each file must export a const typed
// as `RichPlaybook`.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = 'src/data/playbooks';
const TARGET = 'src/data/playbook-rich.ts';

interface Found { slug: string; netuid: number; varName: string; }

const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts')).sort();
const found: Found[] = [];

for (const file of files) {
  const slug = file.replace(/\.ts$/, '');
  const netuid = Number(slug.split('-')[0]);
  const src = readFileSync(join(DATA_DIR, file), 'utf8');
  const m = src.match(/export\s+const\s+(\w+)\s*:\s*RichPlaybook/);
  if (!m) {
    console.warn(`[skip] ${file} — no \`export const X: RichPlaybook\` found`);
    continue;
  }
  found.push({ slug, netuid, varName: m[1] });
}

found.sort((a, b) => a.netuid - b.netuid);

const imports = found.map((f) => `import { ${f.varName} } from './playbooks/${f.slug}';`).join('\n');
const entries = found.map((f) => `  '${f.slug}': ${f.varName},`).join('\n');

const block = `${imports}

export const richPlaybooks: Record<string, RichPlaybook> = {
${entries}
};

export function getRichPlaybook(slug: string): RichPlaybook | undefined {
  return richPlaybooks[slug];
}
`;

const target = readFileSync(TARGET, 'utf8');
// Replace from the first `import { … } from './playbooks/…'` line to EOF
const updated = target.replace(
  /import\s+\{[^}]*\}\s+from\s+'\.\/playbooks\/[^']+'\s*;[\s\S]*$/,
  block,
);

writeFileSync(TARGET, updated);
console.log(`Playbook registry updated. Imported ${found.length} playbooks.`);
