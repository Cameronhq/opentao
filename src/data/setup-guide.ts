// The one-time "general setup" every miner does before registering on any
// subnet. SINGLE SOURCE OF TRUTH — consumed by:
//   - src/pages/mine/general-setup.astro   (renders the full rich page)
//   - src/pages/mining-data.json.ts        (emits an agent-friendly form)
//   - the OpenTAO MCP (get_setup_guide)     (reads it from mining-data.json)
// Previously these each kept their own hardcoded copy and drifted (8 steps on
// the site vs 7 in the MCP). Edit the steps here only.

export type CodeLine = { kind: 'comment' | 'prompt' | 'ok' | 'spacer'; text?: string };
export interface CodeBlock { lines: CodeLine[]; }

export interface SetupStep {
  id: string;                                            // anchor id (step-01 .. step-08)
  n: string;
  title: string;
  time: string;
  body: string;
  bullets?: string[];
  code?: CodeBlock;                                      // OS-agnostic code
  codeByOs?: { macos: CodeBlock; linux: CodeBlock; wsl: CodeBlock };  // OS-specific variants
  callout?: { tip: string; html: string };
  seeAlso?: { label: string; href: string; meta?: string }[];  // links into /mine/resources
}

export const setupSteps: SetupStep[] = [
  {
    id: 'step-01',
    n: '01 / 08',
    title: 'System requirements',
    time: '~2 min',
    body: "Confirm your machine has what's needed. Most modern laptops do; servers usually need a Python upgrade.",
    bullets: [
      'Python 3.10–3.12 · disk ≥ 50GB · RAM ≥ 16GB',
      'macOS 12+ / Ubuntu 22.04+ / Windows 11 with WSL2 (Ubuntu inside)',
      'Subnet miners are NOT supported on native Windows. Use WSL2 for tooling, but run actual mining workloads on Linux.',
      'Stable broadband — chain comms during registration; long-lived TCP for miner ↔ validator.',
    ],
  },
  {
    id: 'step-02',
    n: '02 / 08',
    title: 'Install dependencies',
    time: '~4 min',
    body: 'Python ≥ 3.10, git, and build essentials. Pick your OS above — the rest of the page is identical regardless.',
    codeByOs: {
      macos: {
        lines: [
          { kind: 'comment', text: '# macOS — via Homebrew' },
          { kind: 'prompt', text: 'brew install python@3.12 git' },
          { kind: 'prompt', text: 'python3 --version' },
          { kind: 'ok', text: 'Python 3.12.7' },
          { kind: 'spacer' },
          { kind: 'comment', text: '# Alternative: install btcli directly (skip step 3)' },
          { kind: 'prompt', text: 'brew install btcli' },
        ],
      },
      linux: {
        lines: [
          { kind: 'comment', text: '# Ubuntu 22.04+ / Debian 12+' },
          { kind: 'prompt', text: 'sudo apt update' },
          { kind: 'prompt', text: 'sudo apt install -y python3.12 python3.12-venv python3-pip git build-essential' },
          { kind: 'prompt', text: 'python3 --version' },
          { kind: 'ok', text: 'Python 3.12.3' },
        ],
      },
      wsl: {
        lines: [
          { kind: 'comment', text: '# Inside WSL2 — Ubuntu 22.04+' },
          { kind: 'prompt', text: 'sudo apt update' },
          { kind: 'prompt', text: 'sudo apt install -y python3.12 python3.12-venv python3-pip git build-essential' },
          { kind: 'spacer' },
          { kind: 'comment', text: '# Run actual miner inside WSL — not Windows PowerShell.' },
        ],
      },
    },
  },
  {
    id: 'step-03',
    n: '03 / 08',
    title: 'Install bittensor CLI',
    time: '~3 min',
    body: 'Install the official btcli into a Python virtual environment. Keeps your system Python clean and avoids dep conflicts with old `bittensor` SDK installs.',
    seeAlso: [
      { label: 'btcli reference + alt wallets',  href: '/mine/resources#wallets', meta: 'Wallets · 3 entries' },
    ],
    code: {
      lines: [
        { kind: 'prompt', text: 'python3 -m venv ~/.venv-bittensor' },
        { kind: 'prompt', text: 'source ~/.venv-bittensor/bin/activate' },
        { kind: 'prompt', text: 'pip install --upgrade pip' },
        { kind: 'prompt', text: 'pip install bittensor-cli' },
        { kind: 'spacer' },
        { kind: 'prompt', text: 'btcli --version' },
        { kind: 'ok', text: 'BTCLI version: 9.22.0' },
      ],
    },
    callout: {
      tip: '⚠ tip',
      html: '— Add <code class="font-mono text-xs px-1 py-0.5 rounded" style="background: #fafaf9; border: 1px solid rgba(15,15,18,0.1);">source ~/.venv-bittensor/bin/activate</code> to your <code class="font-mono text-xs px-1 py-0.5 rounded" style="background: #fafaf9; border: 1px solid rgba(15,15,18,0.1);">~/.zshrc</code> or <code class="font-mono text-xs px-1 py-0.5 rounded" style="background: #fafaf9; border: 1px solid rgba(15,15,18,0.1);">~/.bashrc</code> so the venv auto-loads in new terminals. If you used <code class="font-mono text-xs px-1 py-0.5 rounded" style="background: #fafaf9; border: 1px solid rgba(15,15,18,0.1);">brew install btcli</code> in Step 2, skip the pip install.',
    },
  },
  {
    id: 'step-04',
    n: '04 / 08',
    title: 'Create wallet',
    time: '~5 min',
    body: "Generate a coldkey + hotkey. Coldkey holds your TAO and signs balance moves; hotkey is the identity you mine/validate from. Write down the 12-word mnemonic — there's no recovery without it.",
    code: {
      lines: [
        { kind: 'comment', text: '# Create both coldkey and hotkey in one prompt-driven flow' },
        { kind: 'prompt', text: 'btcli wallet create --wallet.name my-coldkey --wallet.hotkey my-hot1' },
        { kind: 'spacer' },
        { kind: 'comment', text: '# Or create them separately:' },
        { kind: 'prompt', text: 'btcli wallet new-coldkey --wallet.name my-coldkey' },
        { kind: 'prompt', text: 'btcli wallet new-hotkey  --wallet.name my-coldkey --wallet.hotkey my-hot1' },
        { kind: 'spacer' },
        { kind: 'prompt', text: 'btcli wallet list' },
      ],
    },
    callout: {
      tip: '🔐 security',
      html: '— The coldkey mnemonic is the only way back if you lose the keystore. Write it on paper, store it offline. Never paste it into a chat, screenshot it, or commit it to git. If you can, run a separate cold/offline machine for the coldkey and copy only the hotkey to the mining box.',
    },
    seeAlso: [
      { label: 'Wallet options (CLI · browser · Ledger)', href: '/mine/resources#wallets', meta: 'Wallets · 3 entries' },
    ],
  },
  {
    id: 'step-05',
    n: '05 / 08',
    title: 'Get TAO',
    time: '~8 min',
    body: 'Mainnet (finney): buy on a CEX and withdraw to your coldkey ss58 address. Testnet: request testnet TAO from the official Discord — the on-chain PoW faucet was disabled on mainnet/finney, it now works only on local chains.',
    bullets: [
      'CEX listings (2026): Binance, Kraken, KuCoin, MEXC, Bybit, Gate.io, regional Coinbase. Binance has the deepest book.',
      'Withdraw to the coldkey ss58 address shown in `btcli wallet list` — NOT to a hotkey.',
      'Testnet faucet: Bittensor Discord, #testnet-faucet channel. Read the channel rules first.',
      'Have a small buffer beyond the burn-cost — registration prices spike unpredictably.',
    ],
    seeAlso: [
      { label: 'CEX comparison + KYC notes', href: '/mine/resources#exchanges', meta: 'Exchanges · 3 entries' },
    ],
  },
  {
    id: 'step-06',
    n: '06 / 08',
    title: 'Register on a subnet',
    time: '~5 min',
    body: 'Registration is burn-based: you pay a recycled TAO fee for a UID slot. The fee doubles after each successful registration on that subnet and decays smoothly per block. Always re-check the burn-cost immediately before you register.',
    code: {
      lines: [
        { kind: 'comment', text: '# Replace 64 with your target subnet' },
        { kind: 'prompt', text: 'btcli subnet burn-cost --netuid 64' },
        { kind: 'ok', text: 'Current burn-cost: 0.421 τ' },
        { kind: 'spacer' },
        { kind: 'prompt', text: 'btcli subnet register --netuid 64 \\' },
        { kind: 'prompt', text: '  --wallet.name my-coldkey --wallet.hotkey my-hot1' },
        { kind: 'spacer' },
        { kind: 'comment', text: '# Testnet — append the network flag' },
        { kind: 'prompt', text: 'btcli subnet register --netuid 64 \\' },
        { kind: 'prompt', text: '  --wallet.name my-coldkey --wallet.hotkey my-hot1 \\' },
        { kind: 'prompt', text: '  --subtensor.network test' },
      ],
    },
    callout: {
      tip: '⚠ immunity period',
      html: "— A freshly registered hotkey is protected from pruning for ~4,096 blocks (~13.7h). If your incentive doesn't climb above the lowest non-immune miner before immunity expires, you get deregistered and the burn-cost is gone. Plan to be earning real incentive within that window.",
    },
    seeAlso: [
      { label: 'Live burn-cost & subnet stats', href: '/mine/resources#tools', meta: 'Tools · Taostats' },
      { label: 'GPU rental (Lambda · RunPod · Vast)', href: '/mine/resources#compute', meta: 'Compute · 3 entries' },
    ],
  },
  {
    id: 'step-07',
    n: '07 / 08',
    title: 'Verify your setup',
    time: '~2 min',
    body: "Confirm the registration landed: your hotkey should appear at a UID on the subnet's metagraph, and your coldkey should show the burn-cost deducted.",
    code: {
      lines: [
        { kind: 'prompt', text: 'btcli wallet overview --wallet.name my-coldkey' },
        { kind: 'comment', text: '# Shows balance, all hotkeys, and which UIDs they hold across subnets.' },
        { kind: 'spacer' },
        { kind: 'prompt', text: 'btcli subnet metagraph --netuid 64' },
        { kind: 'comment', text: '# Find your hotkey in the table to confirm UID assignment.' },
        { kind: 'spacer' },
        { kind: 'prompt', text: 'btcli subnet list' },
        { kind: 'comment', text: '# Snapshot of all subnets, current burn-costs, validator counts.' },
      ],
    },
    seeAlso: [
      { label: 'Taostats explorer · btcli-tui · Grafana exporter', href: '/mine/resources#tools', meta: 'Tools · 3 entries' },
    ],
  },
  {
    id: 'step-08',
    n: '08 / 08',
    title: 'Common errors (reference)',
    time: 'reference',
    body: 'The five real-world failures that swallow most new miners. Bookmark this section.',
    bullets: [
      'Deregistered before earning: your incentive didn\'t cross the prune threshold inside the 4,096-block immunity window. Solution: profile the lowest non-immune incentive on the subnet before you register, and have the miner config tuned ahead of time.',
      'Burn-cost spike: cost doubled between your `burn-cost` query and the `register` call. Re-query within a few seconds of registering, and keep extra TAO buffer.',
      'Network flag mismatch: miner code talking to `finney` while wallet was registered on `test`. Pass `--subtensor.network` consistently across registration and miner invocation.',
      'Dep conflicts: old `bittensor` SDK installed alongside `bittensor-cli` causing version mismatch. Solution: pin to the venv, `pip uninstall bittensor bittensor-cli bittensor-wallet` then re-install only `bittensor-cli`.',
      'Coldkey/hotkey confusion: TAO sent to a hotkey ss58 (lost), or attempting to register a hotkey already on the subnet (each hotkey can hold only one UID per subnet). Always copy the address from `btcli wallet list`.',
    ],
  },
];

// ── Agent-friendly projection ────────────────────────────────────────────────
// Flatten the rich steps to a clean shape an LLM/agent can act on: the real
// shell commands per OS (prompt lines only), plus bullets for command-less
// steps. Embedded into /mining-data.json so the MCP reads it from one source.

export type SetupOs = 'macos' | 'linux' | 'wsl';

const cmds = (block?: CodeBlock): string[] =>
  block ? block.lines.filter((l) => l.kind === 'prompt' && l.text).map((l) => l.text!) : [];

export interface AgentSetupStep {
  n: number;
  id: string;
  title: string;
  summary: string;
  bullets: string[];
  /** Shell commands keyed by OS; `all` when the step is OS-agnostic. */
  commandsByOs: Partial<Record<SetupOs | 'all', string[]>>;
}

export const agentSetupGuide: AgentSetupStep[] = setupSteps.map((s) => ({
  n: Number(s.n.split('/')[0].trim()),
  id: s.id,
  title: s.title,
  summary: s.body,
  bullets: s.bullets ?? [],
  commandsByOs: s.codeByOs
    ? { macos: cmds(s.codeByOs.macos), linux: cmds(s.codeByOs.linux), wsl: cmds(s.codeByOs.wsl) }
    : { all: cmds(s.code) },
}));
