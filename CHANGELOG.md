# 修改日志 (Changelog)

> 每次实际改动后在顶部加一条。格式:`## 日期`,下列 `- 改了什么 — 涉及文件`。
> 决策性的"为什么"记在 `PRD.md`,这里只记"改了什么"。

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
