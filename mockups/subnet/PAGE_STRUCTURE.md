# Subnet page · structure draft

> Single-source-of-truth doc for what goes on `/beginner/subnets/[slug]`.
> Edit directly. When you're done, I'll diff and update the live template.

---

## 1 · The split — Subnet page vs Mining Playbook

Two pages, two readers, two questions. **No duplication.**

| Page | URL | Reader's question | Reader's intent |
|---|---|---|---|
| **Subnet page** | `/beginner/subnets/[slug]` | *What is this subnet, and should I care?* | Curious / evaluating / journalist / AI agent |
| **Mining Playbook** | `/mine/playbooks/[slug]` | *How do I actually run a miner here?* | Operator who already decided to mine |

**Rule of thumb:** if it's a `WHAT / WHY / WHO`, it lives on the subnet page.
If it's a `HOW (commands, monitoring, debug)`, it lives on the playbook.

### Hard split — what goes where

| Topic | Subnet page | Mining Playbook |
|---|---|---|
| One-line pitch | ✓ |  |
| Live stats (emission/burn/price) | ✓ | ✓ |
| What miners produce (concept) | ✓ | ✓ |
| What validators score on (rule) | ✓ | ✓ |
| Tempo cycle diagram | ✓ | ✓ |
| Hardware tier (1×GPU / cluster) | ✓ (1-line summary) | ✓ (full spec) |
| Hardware spec (exact GPU/VRAM/RAM/Disk) |  | ✓ |
| Repo URL + verified commit |  | ✓ |
| Install commands |  | ✓ |
| Run command |  | ✓ |
| Env vars |  | ✓ |
| Common failures + fixes |  | ✓ |
| Monitoring metrics |  | ✓ |
| Profitability calculator |  | ✓ |
| Project history / milestones | ✓ |  |
| Customer outside Bittensor | ✓ |  |
| Operator / team identity | ✓ |  |
| External links (GitHub/site/Twitter) | ✓ | (top-of-page only) |
| Related subnets (same category) | ✓ | show subnets with similar requiment |
| AI-agent endpoints (.json / .md) | ✓ | ✓ (both have, different content) |

---

## 2 · Subnet page · proposed section order

Top to bottom, what a reader sees. **Mark sections you want to drop / merge / move.**

### 1. Hero
- [ ✓] Breadcrumb
- [✓ ] Category badge (Data · Prediction)
- [ ✓] Active dot + miner/validator counts (live)
- [ ✓] Operator name (with link to operator page if rich)
- [✓ ] netuid (big number)
- [ ✓] Name (h1)
- [ ✓] **One-line pitch** ← currently too long, see §5
- [ ] (drop the second sub-pitch? it's filler)

### 2. Live stats grid (taostats live)
- [ ✓] Emission · 24h
- [ ✓] Burn-cost now
- [ ✓] α-price (τ)
- [ ✓] Active miners (vs slot cap)
- [ ] Validators
- [ ✓] Registered (date)
- [ ✓] "Live ✓ via taostats · refreshed everyday" badge

### 3. **One Tempo Cycle** (V1 mockup — the main diagram)
- [✓ ] 4-step pipeline: Challenge → Compute → Score → Settle
- [ ✓] Per-stage actor (validator / miner / chain)
- [ ✓] Per-stage `data:` row (payload / latency / scale / tempo)
- [ ] Timing ribbon underneath

### 4. Who Does What (role compare)
- [ ✓] Miner card: does · input · output · hardware tier · paid for · paid via
- [ ✓] Validator card: does · requires · output · paid for · paid via
- [ ] **(decide: keep tight role-table, OR replace with sentence-form like "Miners do X, validators do Y, paid in Z")**

### 5. Scoring rule (subnet-specific)
- [ ✓] 1 paragraph: what the verifier function is, in plain English
- [ ] Reference to source code if available (file:line link)
- [ ✓] **"What doesn't work"** red callout — anti-patterns / cheat paths blocked
- [ ] (do NOT include hardware here — that's playbook territory)

### 6. Customer outside Bittensor
- [ ✓] 1–2 sentence answer to "who pays for this in real life"
- [ ✓] Concrete examples (energy traders for Zeus, AI inference users for Chutes…)
- [ ] (optional: revenue model — incentive only / incentive + customer / commercial-only)

这里增加一个 competitive analysis

### 7. Project history / momentum
- [ ✓] Timeline of 3–5 milestones
- [ ✓] Operator name + brief background
- [ ✓] Last meaningful commit date / catalog change (if known)

### 8. Joining (just the routing — full ops on playbook)
- [ ✓] **Mine** card → big CTA → `/mine/playbooks/[slug]`
- [ ] **Validate** card → 1-paragraph stake & requirements summary (no install commands)
- [ ] **Build** card → idea-bank link if this subnet inspires variants

### 9. Sidebar (sticky right-rail on the section above)
- [ ✓] Quick facts (operator · category · registered · customer · verifier)
- [✓ ] Tags (from taostats identity)
- [ ✓] External links (GitHub · website · Twitter · taostats)
- [ ] **For AI agents** card: `/api/subnet/[netuid]` + `.json` + `.md`

### 10. Related subnets
- [ ✓] 3–4 same-category cards at the bottom
- [ ] Optional: "Compare across category" link → `/beginner/subnets?cat=data`

### 11. Footer
- [✓ ] Edit on GitHub
- [✓ ] Claim this subnet (if you're the operator)
- [ ] All 128 subnets back-link

---

## 3 · Open questions (mark a choice)

**Q1 · Top miners leaderboard?**
Pull top-5 by incentive from taostats metagraph. Pro: real signal. Con: another stat block, may compete with playbook's "milestones".
- [ ] Yes, include as small table in §7
- [✓ ] No, only on playbook
- [ ] Yes but only for "rich" subnets (gate by `subnet.rich`)

**Q2 · Operator Twitter feed?**
Embedded latest 3 tweets. Pro: liveness signal. Con: visually busy, requires JS embed.
- [✓] Yes, in sidebar
- [ ] No, just a Twitter link
- [ ] Yes but only for subnets with verified twitter handle

**Q3 · Sidebar layout?**
- [ ] Sticky right-rail (current 18-zeus.astro approach)
- [✓ ] Inline section, no sticky
- [ ] Drop sidebar entirely, move quick-facts to a stat strip

**Q4 · Tempo cycle diagram — interactive?**
- [✓ ] Static SVG (fastest, no JS)
- [ ] Hover to expand each stage with more detail
- [ ] Animated pulse on the connecting arrows

**Q5 · "Validate" path on §8 — depth?**
- [ ] Just 1-paragraph CTA pointing somewhere (where? we don't have a validator playbook yet)
- [ ] Full 4-step mini-guide (becomes its own thing, scope creep)
- [ ✓] Drop it — only show "Mine" CTA, mention validation casually elsewhere

**Q6 · How prominent should the "customer outside Bittensor" be?**
- [ ] Own dedicated §6 section (current draft)
- [ ] Two-line callout near the hero
- [ ✓] Tag in the sidebar "Customer: energy traders"

**Q7 · For subnets without rich content (the 127 non-Zeus ones), what to show?**
- [✓ ] Same template, just sparse / "—" placeholders
- [ ] Stripped-down stub (current behavior on `[slug].astro`)
- [ ] Progressive — show §1, §2, §10 only, hide §3–9 with "help us fill this in"

---

## 4 · Things explicitly NOT on the subnet page

(Marking these so they don't sneak back in via temptation.)

- ❌ Install commands (→ playbook)
- ❌ Run command template (→ playbook)
- ❌ Hardware spec table (→ playbook)
- ❌ Env vars / secrets (→ playbook)
- ❌ Common failures with fix recipes (→ playbook)
- ❌ Monitoring thresholds table (→ playbook)
- ❌ Profitability calculator (→ playbook)
- ❌ "Copy as agent prompt" full setup brief (→ playbook)
- ❌ Repo branch / verified commit details (→ playbook; subnet page just links to GitHub)

---

## 5 · One-line pitch — pick one

Current (too long, ~3 clauses):
> Zeus is a subnet that forecasts the weather — miners run global atmospheric models, validators score their predictions against ground-truth ERA5 reanalysis, and the customer outside the network is the energy-trading desk.

Candidates (mark one or rewrite):

- [ ] **A.** Zeus is a Bittensor subnet for global weather forecasting — sold to energy traders.
- [ ] **B.** Zeus produces global weather forecasts that beat ECMWF, scored against ERA5 truth.
- [ ] **C.** Global weather forecasts, judged against satellite truth, sold to power traders.
- [✓ ] **D.** __keep now__ (write your own)

Generalization for the template: every subnet's one-liner should fit `{name} {produces what}, {how it's judged}, {who pays}.` — three clauses max, ideally under 25 words.

---

## 6 · Notes from the editor

- The cycle diagram (V1) is locked in. We just need to make sure §1 / §2 / §4–§10 don't dilute its centrality.
- Live data (taostats) already wired via `/api/subnet/[netuid]` — we'll reuse on this page.
- AI agents need stable `#section-id` anchors. I'll add `id="cycle"`, `id="scoring"`, `id="join"` etc.
- For dormant subnets (Masa SN42 with `emission: 0`), §2 should gracefully show 0s without looking broken.

---

## Edit history

- 2026-05-31 — draft generated from V1 mockup + 18-zeus.astro audit.
- (your edits here)
