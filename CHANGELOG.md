# 修改日志 (Changelog)

> 每次实际改动后在顶部加一条。格式:`## 日期`,下列 `- 改了什么 — 涉及文件`。
> 决策性的"为什么"记在 `PRD.md`,这里只记"改了什么"。

## 2026-06-08

- **根治 playbook slug 漂移:registry 改为按 netuid 从 live 数据派生** — `playbooks.ts` 由手维护静态数组(05-13 快照,27 个子网改名后 slug 漂移、详情页 join 不到 rich)改为**从 `subnets.ts` + rich 按 netuid 派生**。netuid 是链上恒定身份,以后子网再改名页面自动跟随。
  - 结果:列表/详情/`mining-data.json`/MCP 全部 **122 verified · 6 draft · 0 missing**(原 11 verified / 117 "missing");27 个原本访问不到 rich 的详情页恢复内容。
  - 新增 `getRichPlaybookByNetuid` / `playbookStatusByNetuid`(playbook-rich.ts);详情页 `[slug].astro`、`[slug].json.ts`、`[slug].md.ts`、`mining-data.json.ts` 全改按 netuid join。
  - 详情页 URL 改用 live subnet slug;27 个旧 URL 通过 `astro.config` `redirects` 做重定向(快照存 `src/data/playbook-redirects.ts`)。
  - zh 列表(`zh/mine/playbooks.astro`)同步 Verified/Draft(原来还是 stale/missing 旧逻辑)。

## 2026-06-07

- **修复 "Refresh chain data" 6 小时 cron 一直挂(429)** — 两步脚本背靠背在同一分钟内打了 7 次 taostats(`fetch-chain-stats` 4 次 + `refresh-subnets` 3 次),超免费 5/min 限额,撞 429 即 `exit 1`,数据自 06-02 起卡死 5 天。
  - 两个 fetch 封装(`scripts/fetch-chain-stats.ts` 的 `get`、`scripts/refresh-subnets.ts` 的 `fetchTaostats`)加 429/5xx 指数退避重试(尊重 `Retry-After`,最多 5 次,15/30/45/60s)。
  - `refresh-subnets.ts` 的 3 个 `Promise.all` 并发改串行,避免瞬时突发。
  - workflow(`.github/workflows/refresh-chain-stats.yml`)两步之间加 `sleep 60`,让两批请求落在不同分钟窗口。
  - 顺手补上 5 天的陈旧数据:`src/data/chain-stats.json` + `src/data/subnets.ts` 重新生成(128 子网,build 通过)。
- **cron 失败不再静默** — `refresh-chain-stats.yml` 失败时自动开/评论一个 tracking issue(去重,不刷屏),成功时自动关闭。`permissions` 加 `issues: write`。
- **`actions/checkout` v4 → v5** — 消除 Node 20 弃用警告,跑在 Node 24。
- **hreflang alternate** [SEO] — `BaseLayout.astro` 为有 `/zh` 版本的 21 个手写页输出 `en`/`zh-Hans`/`x-default` alternate;数据驱动 `[slug]` 页(单语回退英文)不输出,只保留 canonical。
- **playbook status 改为从 rich registry 派生** [PRD 对齐] — 列表/详情/MCP 不再读 `playbooks.ts` 那个陈旧的 `status`(它把 117 个有完整内容的 playbook 标成 "missing")。新增 `playbookStatus()` helper + `RichPlaybook.placeholder` 标记(6 个占位页:3/19/20/69/86/101),三处统一显示 verified/draft。改动:`playbook-rich.ts`、`playbooks.astro`(含筛选 Verified/Draft、coverage 重算)、`playbooks/[slug].astro`、`mining-data.json.ts`。
  - **发现更深的 bug(待决策)**:`playbooks.ts` 的 slug/name 自 05-13 起陈旧,26 个子网改名后 netuid 对得上但 slug 对不上 rich(如 netuid 3 子网=`3-deprecated` vs playbook=`3-templar`),导致这 23 个详情页 join 不到 rich 内容、URL 也是旧名。当前已让三处口径一致(103 verified/2 draft/23 missing),但根治需把 playbook 页改为以 live registry(netuid)为脊。
- **playbook 详情页矿工口径统一 SD-4** — `playbooks/[slug].astro` 的 "Miners" 改为 join `subnets.ts`(`注册/槽位 · earning`,6h 刷新),去掉只覆盖单个裸数字、还硬编码 "256 slot cap" 的 live override(emission/burn/price 的 live 保留)。
- **setup guide 抽成单一数据源** — 新建 `src/data/setup-guide.ts`(types + 8 步 + agent 投影);`general-setup.astro` 从它渲染;`mining-data.json` 新增 `setupGuide` 字段;`opentao-mcp` 的 `get_setup_guide` 改读这份数据,不再自带硬编码 7 步副本(消除站点 8 步 vs MCP 7 步漂移)。

## 2026-06-05

- **中文全量上线:21 个手写页全部翻完** [PRD I18N-1/4] — 首页 + Mine(agent/general-setup/playbooks/resources)+ Beginner(wiki/subnets/3 concept)+ Build(hackathon/incubator/idea-bank)+ Community(events/chapters/insights/become-a-host/contribute/东京活动/东京分会)+ 404(双语)。
  - 每个 `/zh` 页是 EN 页的完整副本,按"达意"重写,术语保留英文;表单逻辑、表格筛选、排序脚本原样保留。
  - section 子导航用 `hasZh()` 智能深链(已翻译去 /zh,未翻译回退英文);所有路由登记进 `ZH_ROUTES`。
  - 修了个全站 switcher bug:`toBaseRoute` 现在去掉尾斜杠,子页深链才正确。
  - 数据驱动的 `[slug]` 详情页(子网/playbook/concept)仍回退英文,待 Phase 3。

## 2026-06-02 (下午)

- **首页露出 MCP** [audit 8] — 首页(EN + /zh)hero 下加 agent/MCP strip:一行接入命令 + 示例问答 + CTA 到 /mine/agent。
- **MCP 加 `estimate_pnl`** [audit 10] — 给定硬件成本/币价,估算某子网日/月 P&L(用 rich.profitability + rentalUsdPerHr)。已部署、线上验证(7 工具)。/mine/agent 工具列表 + README 同步。注:部分子网 profitability 是占位 0,估算会偏(B5 数据质量待补)。
- **修子网详情页 data-live(fix 6)** — `/api/subnet/{netuid}` 这个端点 opentao-api 根本没有,fetch 一直静默 404、是死代码。删掉;矿工数改为和目录一致的 `注册/槽位 · earning` + 加 7d 列。
- **修 README(fix 7)** — 删过时的"playbook 404"(已修),加 MCP / i18n 章节,修 repo URL(opentao-ai → Cameronhq)。

## 2026-06-02

- **数据刷新自动化**:6 小时的 GitHub Action 现在同时刷新 `subnets.ts`(原来只刷 chain-stats.json)。push → CF 重新部署 → `/mining-data.json` 重生成 → MCP 数据自动新。workflow 改名 "Refresh chain data"。
- **opentao-mcp 建仓 + git 部署**:新仓库 `github.com/Cameronhq/opentao-mcp`(public),加 `.github/workflows/deploy.yml`,push 到 main 自动 `wrangler deploy`。**一次性设置**:在该仓库加 secret `CLOUDFLARE_API_TOKEN`(CF dashboard → API Tokens → "Edit Cloudflare Workers" 模板)。
- **MCP 前端露出** [PRD MCP-5] — server 已部署 `https://opentao-mcp.cameron-530.workers.dev/mcp`(线上验证通过)。
  - 新增落地页 `/mine/agent`:接入配置(Claude Code / Cursor / Claude Desktop,带复制按钮)+ 示例 prompt + 6 工具说明 + 安全说明。
  - Start mining SubNav 四个页面都加 "Mine with agent" 标签(置首)。
  - playbooks 页加 "◆ Mine with an agent" CTA。
  - 子网详情页(rich + stub 两分支)加 "◆ Ask your agent about SN{n}" 复制 prompt 按钮。
- **MCP server**(新仓库 `../opentao-mcp`)— Cloudflare Agents SDK `McpAgent`,6 个只读工具(`list_subnets`/`get_subnet`/`get_playbook`/`get_setup_guide`/`recommend_subnets`/`get_resources`),streamable HTTP `/mcp`。读 `/mining-data.json`。本地 SDK client 验证:握手 + tools/list + recommend + get_playbook 全部返回实时数据。**待用户部署**(`wrangler deploy`)。[PRD MCP-3]
- **MCP 数据层** `/mining-data.json` — 新增 `src/pages/mining-data.json.ts`,build 时把 `subnets.ts`(实时经济数据)+ `playbooks.ts`(状态)+ `playbook-rich.ts`(硬件/命令/scoring/盈利)合并成单一 JSON。网站与即将做的 OpenTAO MCP server 共用一个源。128 子网,数值字段已解析好(emission τ/day、矿工 registered/earning、rewardConcentration、7d %)。只读,带 notice 说明动钱包动作需人确认。[PRD MCP-2]

## 2026-06-01 (晚)

- **全站 i18n 地基 + 中文(Phase 1)** [PRD I18N-1~4]
  - 新增 `src/i18n/ui.ts`(en/zh 字典,zh 缺失键回退 en)+ `src/i18n/utils.ts`(`getLangFromUrl`/`useTranslations`/`localizePath`/`ZH_ROUTES`)。
  - `Nav.astro` / `Footer.astro` 改为 locale-aware:按 URL 语言渲染中/英 chrome,内链按 `hasZh()` 指向已翻译的 /zh 版或回退英文。
  - `Nav` 加 **EN · 中 语言切换器**:有中文版的页面互切,没有的页面 → /zh 首页(不 404)。
  - `BaseLayout` 的 `<html lang>` 按 URL 动态(en / zh-CN)。
  - 新增**中文首页** `src/pages/zh/index.astro`(全文翻译)。
  - 深层数据页(子网/playbook 等)暂未翻译,切中文时回退英文(见 PRD I18N 决策)。
- **修复 404 回归**:上一轮换 insights slug 后,首页 + contribute 的精选卡片仍指向已删的推文 slug;改指真实文章 slug(`bittensor-ecosystem-guide` 等)。

## 2026-06-01

- **Insights 换成 @quack_builder 的真实 X Articles(长文章,非推文)** — 6 篇 Bittensor 长文替换全部 placeholder。中文原文保留,带 sourceUrl 回链。[PRD IN-1~4]
  - 数据走 X API 的 `tweet.fields=article` → `article.plain_text`(真长文全文);**修正**:上一版误抓了 `note_tweet`(长推文),内容不对,已全部替换。
  - 新增 `scripts/gen-insights.ts` + `scripts/insights-source.json`:`insights.ts` 改为**生成文件**(长正文用 JSON.stringify 安全转义,带 include-list 跳过 off-topic)。
  - `src/pages/community/insights.astro`:改为**读 `insights.ts` 单一数据源**(原来 listing 自己硬编码一份),featured + 类型 pill 动态生成。
  - `src/pages/community/insights/[slug].astro`:去掉"essay coming"stub banner,渲染真实多段正文 + "原文首发于 X"回链。
  - `src/pages/index.astro` & `community/insights/contribute.astro`:把指向已删 placeholder slug 的卡片改指真实文章。
  - `src/components/Nav.astro`:insights 计数 28 → 6。
  - 删除孤立的 placeholder 页 `community/insights/yuma-walk-through.astro`。
- **Mining playbooks 页重排** — 稀疏卡片网格 → 密集可排序表格(`pb-table`),列:netuid、子网名+blurb、category、Emission·24h、Miners·earning(`注册/槽位·N earning`)、Reward spread(Concentrated/Mixed/Spread)、7d、Playbook 状态。[PRD PB-1/2/4]
  - 真实数据靠按 netuid **join `src/data/subnets.ts`**(已含真实字段),不新建 API;顺手绕过 `playbooks.ts` 的 emission rao bug。[PRD PB-5/6]
  - **删掉编造的硬件 tier 卡片区**和死的"coming soon / Sort"标签;无硬件数据源,不造假。[PRD PB-3]
  - 文件:`src/pages/mine/playbooks.astro`(整页重写)。
- **移除子网目录的 "featured subnet" 机制**(橙色高亮行 + ★ full page 徽章),三层同改 — `scripts/refresh-subnets.ts`(`RICH_SLUGS` 清空)、`src/data/subnets.ts`(去 Zeus 的 `rich:true`)、`src/pages/beginner/subnets.astro`(去接口字段/映射/渲染 + `.featured`/`.featured-callout`/`.ref-badge`/`.pill-select` 死 CSS)。[PRD SD-6]
- **新增 PRD.md / CHANGELOG.md / CLAUDE.md**,建立跨会话记忆与工作规则。
- 诊断记录:"改了又回来" = ① 生成文件 `subnets.ts` 被刷新脚本覆盖;② 5/30 起所有工作未提交,看线上像"回退"。

## 2026-05-31

- **子网目录 7d 列改造** — 删掉空的 `24h` 列和假的 `7d trend` 折线列,合并为单列 `7d`(文字百分比、涨绿跌红、可排序)。数据取 taostats `dtao/pool/latest.price_change_1_week`,零额外请求。[PRD SD-2/SD-3]
  - 文件:`scripts/refresh-subnets.ts`(新增 `delta7d`/`delta7dSign` 输出)、`src/data/subnets.ts`(重新生成)、`src/pages/beginner/subnets.astro`、`src/pages/subnets.csv.ts`。
- **矿工数显示改造** — 由裸 `active_miners` 改为 `注册 / 总槽位 · N earning`。新增字段 `minerSlots`/`minersEarning`,`miners` 改为注册数(`active_keys − validators`)。[PRD SD-4]
- **删除两个失效筛选开关** `Active only` / `Rich pages only` 及其 JS 逻辑。[PRD SD-5]
- **CSV 导出**列同步:`delta_24h` → `change_7d`,miners 拆成 `miners_registered`/`miner_slots`/`miners_earning`。
