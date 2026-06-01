# OpenTAO — 产品需求 / 决策记录 (PRD)

> 跨会话的产品决策真相源。每条记录**做什么 + 为什么 + 状态**。
> 状态:`✅ 已实现` / `🚧 计划中` / `🅿️ 暂缓` / `❌ 已否决`。
> 新决策追加到对应章节;改变方向时改原条目并注明日期。最后更新:2026-06-01。

---

## 子网目录 `/beginner/subnets`

**定位**:128 个子网的可比较、可排序总表,面向想了解/挑选子网的人。

| # | 决策 | 状态 | 备注 |
|---|---|---|---|
| SD-1 | 列:`# · Subnet · Category · Emission·24h · Market cap · Price(τ) · 7d · Miners · Validators · Playbook · 状态点` | ✅ | |
| SD-2 | **7d 列**:单列文字百分比,涨绿跌红,可排序 | ✅ 2026-06-01 | 数据 = taostats `price_change_1_week`,**不自己算、不画折线** |
| SD-3 | 删掉原来的 `24h` 列和 `7d trend` 迷你折线列 | ✅ 2026-06-01 | 两者原本都是假数据(`delta:'—'` + 硬编码水平线) |
| SD-4 | **矿工数**显示 `注册 / 总槽位 · N earning`(如 `247 / 256 · 4 earning`) | ✅ 2026-06-01 | 单独显示 `active_miners` 会让人误以为"只有几个矿工/数据坏了" |
| SD-5 | 删除 `Active only` 和 `Rich pages only` 两个筛选开关 | ✅ 2026-06-01 | Active only 本就失效(所有行 active);两者都没意义 |
| SD-6 | **彻底移除 "featured subnet" 机制**(橙色高亮行 + ★ full page 徽章) | ✅ 2026-06-01 | 在三层都删:`RICH_SLUGS` 清空 + `subnets.ts` 去 `rich:true` + `subnets.astro` 去渲染/CSS。子网详情页的 rich 内容由 `subnet-rich.ts` 独立驱动,不受影响 |

---

## 挖矿 / Playbooks `/mine/playbooks`

**定位**:面向矿工,帮其判断"挖哪个、门槛多高、回报如何"。

| # | 决策 | 状态 | 备注 |
|---|---|---|---|
| PB-1 | 排布改成类似子网目录的**信息密集、可比较、可排序**表格 | ✅ 2026-06-01 | 卡片网格 → `pb-table` 密集表 |
| PB-2 | 列:**当前矿工数(同 SD-4 格式)、当前 miner emission、emission 分配方式(Reward spread:Concentrated/Mixed/Spread)、7d、category、playbook 状态** | ✅ 2026-06-01 | 硬件门槛列**砍掉**(无数据源,见 PB-3) |
| PB-3 | ~~硬件筛选~~ | ❌ 2026-06-01 | 任何数据源都没有"每个子网要什么硬件";原来的 4 个 tier 卡片是编的,**整段删除**,不造假。等有数据源再议 |
| PB-4 | 把死的 `Sort` 标签换成**真排序**(表头点击) | ✅ 2026-06-01 | 默认 emission desc |
| PB-5 | 修 `playbooks.ts` 里 emission 的 rao bug | ✅ 2026-06-01 | 改为忽略 playbook.emission,直接用 join 来的子网 emission |
| PB-6 | playbooks 接真实矿工数/emission | ✅ 2026-06-01 | **不用新 API**:在页面里按 netuid join `subnets.ts`(已含真实字段)。Reward spread = earning/registered 比例分桶 |

---

## 社区 Insights `/community/insights`

**定位**:放 @quack_builder 的真实长文(不是占位/编造内容)。

| # | 决策 | 状态 | 备注 |
|---|---|---|---|
| IN-1 | 用 @quack_builder 的真实 **X Articles(长文章,不是推文)** 替换所有 placeholder | ✅ 2026-06-01 | 6 篇 Bittensor 长文(7 篇里跳过 1 篇 off-topic 的"6 个 AI 产品") |
| IN-2 | **保留中文原文**(不译),带 `sourceUrl` 回链原帖 | ✅ 2026-06-01 | EN/CN 两版 Jacob 清华文都收;featured = 万字长文生态指南 |
| IN-3 | listing 与详情页都读 `src/data/insights.ts` 单一数据源 | ✅ 2026-06-01 | 原来 listing 自己硬编码一份,易漂移 |
| IN-4 | **关键区分**:X **Article** 全文在 API 的 `tweet.fields=article` → `article.plain_text`;**不是** `note_tweet`(那是长推文/long post),也不是 timeline 的 280 字截断 | ✅ 参考 | `insights.ts` 由 `scripts/gen-insights.ts` 从 `scripts/insights-source.json` 生成;刷新源需 X API(free tier 紧) |

## 挖矿通用设置 `/mine/general-setup`

| # | 决策 | 状态 | 备注 |
|---|---|---|---|
| GS-1 | macOS / Linux / WSL 顶部 OS tab **保留现状,不调整** | ✅ 决策于 2026-05-31 | 8 步里只有 step-02 有 OS 差异,切 tab 视觉变化小,但可接受 |

---

## 数据与基础设施

| # | 决策 | 状态 | 备注 |
|---|---|---|---|
| INF-1 | `subnets.ts` 由 `refresh-subnets.ts` 拉 taostats 生成,**手动刷新**(不在 6h CI cron 里) | ✅ | 数据会停在上次手动刷新的快照 |
| INF-2 | 落地页 Section[03] 链上数据走 `chain-stats.json`,由 GitHub Action 每 6h 刷新 | ✅ | 见 README "Live data" |

---

## 待办 / 开放问题

- [ ] 子网详情页 `[slug].astro` 的 `data-live` 从 `opentao-api` 抓 `miner_count`,口径可能还是旧的 `active_miners`,需与 SD-4 统一。
- [ ] playbooks 的"硬件门槛"列:若日后拿到每个子网硬件需求数据源,再加回(PB-3)。
- [ ] playbooks 的 emission/矿工数依赖 `subnets.ts` 快照,会随手动刷新过期(同 INF-1)。
