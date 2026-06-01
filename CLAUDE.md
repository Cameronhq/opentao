# OpenTAO — Claude 工作规则

opentao.ai — Builder's Gateway to Bittensor。Astro 6 静态站,Cloudflare Pages/Workers 部署。
技术栈见 `README.md`。**本文件是每次会话的硬约束,优先级高于默认行为。**

---

## 0. 三份必须维护的文件(读 + 写)

每次会话开始,**先读** `PRD.md` 和 `CHANGELOG.md`,再动手——它们是跨会话的记忆,
弥补"上次说过的需求被忘记"的问题。

| 文件 | 作用 | 何时更新 |
|---|---|---|
| `PRD.md` | 产品需求 / 已拍板的决策(为什么这么做) | 每当用户做出新决策、改变方向、确认/否决一个 feature 时,**立即**追加或修订对应条目 |
| `CHANGELOG.md` | 改动日志(具体改了什么文件) | **每次**实际改了代码/数据后,在顶部加一条(日期 + 改了什么 + 涉及文件) |
| `CLAUDE.md` | 本文件,工作规则 | 流程/约定变化时 |

> 规则:**先改代码,再更 CHANGELOG;决策变了先更 PRD。** 不要等用户提醒。

---

## 1. 生成文件不能手改(反复 bug 的头号根因)

以下文件带 `auto-generated / DO NOT EDIT BY HAND` 头,**手改会被生成器覆盖**。
要永久改动,改对应的**生成器脚本**或**解释数据的页面**,然后重跑生成器:

| 生成文件 | 生成器 | 重生成命令 |
|---|---|---|
| `src/data/subnets.ts` | `scripts/refresh-subnets.ts`(拉 taostats) | `source ~/.claude/credentials/taostats.env && bun run scripts/refresh-subnets.ts > src/data/subnets.ts` |
| `src/data/subnet-rich.ts`(注册块) | `scripts/gen-rich-registry.ts` | `bun run scripts/gen-rich-registry.ts` |
| `src/data/playbook-rich.ts`(注册块) | `scripts/gen-playbook-registry.ts` | `bun run scripts/gen-playbook-registry.ts` |
| `src/data/insights.ts` | `scripts/gen-insights.ts`(读 `scripts/insights-source.json`) | `bun run scripts/gen-insights.ts` |

例:子网"featured 高亮"这种,改 `subnets.ts` 没用,要改 `RICH_SLUGS`(在 refresh 脚本里)+ `subnets.astro`。
注意:重跑 `refresh-subnets.ts` 会**覆盖整个 `subnets.ts`**,会冲掉里面任何手改——动它之前先确认。

`src/data/playbooks.ts` 是**手维护**的(不是 taostats 自动生成),可以直接改。

---

## 2. 预览 / 部署 —— "看不到改动"排查

- `bun run dev` → `astro dev`,热更新,端口 4321。
- `bun run preview` → `astro preview`,**只服务 `dist/`,不会自动重建**。改了代码必须先 `bun run build`,且浏览器要硬刷新(`Cmd+Shift+R`)。
- **线上 opentao.ai = 最后一次 `git push` 到 main**(GitHub `Cameronhq/opentao` → Cloudflare 自动部署)。
  本地未提交的改动**不会**出现在线上。

用户说"没改动 / 版本回退"时,先确认 ta 在看 **本地 preview(硬刷新)** 还是 **线上**。
线上看不到 = 还没 commit/push。

## 3. 【强制】严格的 Git 纪律 —— 保证改动落地

历史教训:大量工作长期未提交,导致"看线上像回退、说过的都没了"。**这是本项目最高优先级的纪律,必须严格遵守:**

1. **每完成一个可用的改动单元,立即 commit。** 不要攒一大堆未提交改动;不要在"工作区"里留长期未固化的成果。
2. **commit 后默认 push** —— 改动只有 push 到 `origin/main` 才会经 Cloudflare 自动部署到 opentao.ai,本地未推送的等于"没生效"。除非用户明确说"先别推",否则 commit 即 push。
3. 每次会话**收尾前检查 `git status`**:若有未提交改动,提醒用户并提议 commit+push,不要留尾巴。
4. commit message:简短描述 + 关联 PRD 条目号(如 `[SD-6]`),末尾加
   `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
5. 涉及不可逆/破坏性 git 操作(`reset --hard`、`push -f`、`checkout` 覆盖未提交改动等)**先确认**——
   这些正是过去"丢改动"的元凶。

> 一句话:**改了就 commit,commit 就 push,会话结束前 `git status` 必须干净。**

---

## 4. i18n / 中文(`/zh/`)

- 字典:`src/i18n/ui.ts`(`en` 为真相源,`zh` 覆盖;缺失的 zh 键自动回退 en)。
- 助手:`src/i18n/utils.ts` — `getLangFromUrl` / `useTranslations(lang)` / `localizePath` / `ZH_ROUTES`。
- chrome(Nav/Footer)已 locale-aware,**所有页面**自动按 URL 语言双语;`BaseLayout` 的 `<html lang>` 动态。
- **加一个中文页**:① 建 `src/pages/zh/<path>.astro`(翻译版);② 把它的英文 base route 加进 `utils.ts` 的 `ZH_ROUTES`(切换器才会深链而不是回退首页);③ 新 UI 文案进 `ui.ts`。
- 未翻译页**回退英文**,不要做成 404。深层数据页(子网/playbook)body 来自 taostats 英文,翻译需缓存层(见 PRD I18N-4)。

## 5. 数据口径约定(taostats)

- **7d 涨跌**:直接取 `dtao/pool/latest` 的 `price_change_1_week`(已是百分比),不要自己算、不要画折线。
- **矿工数**显示 `注册 / 总槽位 · N earning`:`注册 = active_keys − validators`,`总槽位 = max_neurons`,`earning = active_miners`(= 链上 incentive>0)。单独显示 `active_miners` 会误导(常常是个位数)。
- 凭据:`source ~/.claude/credentials/taostats.env`。
