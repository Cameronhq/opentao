// Frozen snapshot of playbook URLs that changed when the registry was re-keyed
// off the live subnet slug (2026-06-08). These subnets were renamed on-chain
// after the old static playbooks.ts was generated (2026-05-13), so their old
// slug URLs were live/indexed and must 301 to the current slug. Fed into
// astro.config.mjs `redirects`. Append here if more renames need preserving.
export const playbookRedirects: Record<string, string> = {
  '/mine/playbooks/3-templar': '/mine/playbooks/3-deprecated',
  '/mine/playbooks/5-lumen': '/mine/playbooks/5-hone',
  '/mine/playbooks/8-proteus': '/mine/playbooks/8-vanta',
  '/mine/playbooks/12-echelon': '/mine/playbooks/12-compute-horde',
  '/mine/playbooks/17-spectra': '/mine/playbooks/17-404-gen',
  '/mine/playbooks/26-unknown': '/mine/playbooks/26-perturb',
  '/mine/playbooks/27-atlas': '/mine/playbooks/27-nodexo',
  '/mine/playbooks/30-pending': '/mine/playbooks/30-endure-network',
  '/mine/playbooks/31-orion': '/mine/playbooks/31-recall',
  '/mine/playbooks/36-glyph': '/mine/playbooks/36-eirel',
  '/mine/playbooks/46-resi': '/mine/playbooks/46-zipcode',
  '/mine/playbooks/57-helix': '/mine/playbooks/57-57',
  '/mine/playbooks/58-handshake': '/mine/playbooks/58-pending',
  '/mine/playbooks/63-linnaeus': '/mine/playbooks/63-enigma',
  '/mine/playbooks/69-unknown': '/mine/playbooks/69-69',
  '/mine/playbooks/76-byzantium': '/mine/playbooks/76-sn76',
  '/mine/playbooks/84-unknown': '/mine/playbooks/84-84',
  '/mine/playbooks/86-unknown': '/mine/playbooks/86-sn86',
  '/mine/playbooks/87-luminar-network': '/mine/playbooks/87-87',
  '/mine/playbooks/90-unknown': '/mine/playbooks/90-90',
  '/mine/playbooks/92-tensorclaw': '/mine/playbooks/92-92',
  '/mine/playbooks/95-unknown': '/mine/playbooks/95-actual',
  '/mine/playbooks/97-distil': '/mine/playbooks/97-albedo',
  '/mine/playbooks/101-unknown': '/mine/playbooks/101-101',
  '/mine/playbooks/116-taolend': '/mine/playbooks/116-116',
  '/mine/playbooks/117-unknown': '/mine/playbooks/117-117',
  '/mine/playbooks/122-bitrecs': '/mine/playbooks/122-122',
};
