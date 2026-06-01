// Insights registry — real long-form posts by @quack_builder, brought over from
// X (Twitter). Both the listing (/community/insights) and the detail route
// ([slug].astro) read from this single source. Body kept in the original
// Chinese; `sourceUrl` links back to the original post.

export interface Insight {
  slug: string;
  title: string;
  lead: string;
  body: string;            // full text; blank lines separate paragraphs
  type: string;            // "观点" / "解读" / "深度" / "现场"
  readTime: string;        // "3 分钟"
  cover: string;           // cover gradient class, e.g. "cover-1"
  coverText: string;       // short label on the cover tile
  author: string;
  authorHandle?: string;
  date: string;            // "2026·05·08"
  sourceUrl?: string;      // original post on X
  featured?: boolean;      // one entry shown in the hero slot
  rich?: boolean;          // has its own standalone .astro page (skipped by [slug].astro)
}

export const insights: Insight[] = [
  {
    slug: 'price-is-nothing-and-everything',
    title: '对 Bittensor 来说,币价 is nothing & everything',
    lead: '币价直接决定子网 emission 的真实价值,也决定矿工还有没有动力继续 mining;但对真正的 HODLer,短期波动其实什么都不是。',
    body: `bittensor:native 重新站上 300,大家都很兴奋。对 Bittensor 生态来说,币价 is nothing & everything。

PRICE is EVERYTHING:
和比特币价格决定矿工成本与收益一样,Bittensor 这种完全靠激励驱动的网络,bittensor:native 的价格直接决定了子网 emission 到手的真实价值。在一些算力价格非常透明的领域尤其明显——币价直接决定矿工还有没有动力继续 mining。所以你会看到,币价高的时候子网里矿工扎堆,币价低的时候算力则严重不足。

PRICE is NOTHING:
对真正相信 bittensor:native 的 HODLER 来说,短期波动其实不重要。这次拉升不过是 Templar rug 负面情绪的出清而已。把时间线拉长,一个有价值的生态波动是十倍、百倍甚至千倍——别因为一时的涨而兴奋,也别因为将来的跌而看衰。`,
    type: '深度', readTime: '3 分钟',
    cover: 'cover-1', coverText: 'PRICE · emission',
    author: 'quack_builder', authorHandle: '@quack_builder',
    date: '2026·05·08',
    sourceUrl: 'https://x.com/quack_builder/status/2052582711840375121',
    featured: true,
  },
  {
    slug: 'building-a-subnet-is-like-a-startup',
    title: '做子网和创业非常像(但有两点关键不同)',
    lead: '启动资金、商业模式、marketing——子网创业三件套;不同的是 Bittensor 帮你雇了 256 个员工,还给你 4 个月的试错保护期。',
    body: `做子网和创业非常像:
1. 你需要一笔启动资金(子网注册费,目前大概 1200 tao;当然你也可以找投资人来帮你 cover 这笔钱)
2. 你需要想清楚你的商业模式(怎么产生有价值的成果,且不被人钻机制的空子)
3. 你需要做 marketing,让 miner/validator/retail 了解你的子网,并愿意 HODL 你的 alpha token

但是不一样的地方在:
A. 如果你的机制设计的正确,相当于 Bittensor 为你雇了 256 个员工来工作,他们的工资是通过 emission 支付的,而你可以用他们的成果来进行商业化。
B. 你一共有 4 个月的时间可以试错(新子网有 4 个月保护期),就算你最后发现你的 idea 行不通,在当前子网需求火热的情况下,你把子网挂牌售出也不会亏的太多。`,
    type: '解读', readTime: '3 分钟',
    cover: 'cover-4', coverText: 'subnet · startup',
    author: 'quack_builder', authorHandle: '@quack_builder',
    date: '2026·05·05',
    sourceUrl: 'https://x.com/quack_builder/status/2051524862380785813',
  },
  {
    slug: 'two-reasons-bullish-on-bittensor',
    title: '和人聊 Bittensor,我看到两个截然不同的出发点',
    lead: '一个是投资视角——TAO 在熊市依然坚挺;另一个是对抗 AI 霸权——我们需要去中心化的 AI infra。',
    body: `最近跟人聊 Bittensor 大家基本都很 bullish,但能看出有很明显的两个出发点:

一个当然是从投资的角度看,#TAO 在熊市依然非常坚挺,不论从叙事还是价值层面都是 crypto 生态里顶级的。

另一个更多——那就是看到现在美国的 AI 霸权,最强大的武器被掌控在几个疯狂的人手中,我们需要 Bittensor 这样去中心化的 AI infra。`,
    type: '观点', readTime: '2 分钟',
    cover: 'cover-2', coverText: 'TAO · two angles',
    author: 'quack_builder', authorHandle: '@quack_builder',
    date: '2026·05·01',
    sourceUrl: 'https://x.com/quack_builder/status/2050051499905208333',
  },
  {
    slug: 'tao-will-be-top-20',
    title: '为什么我认为 Bittensor 市值至少会进前 20',
    lead: '把时间维度拉到 3-5 年,crypto 里只有真正有 utility 的项目才可能撑起足够高的市值。',
    body: `今天 bittensor:native 的市值刚好排在整个市场的第 30 名。一个非常简单的逻辑判断:把时间维度拉长到 3-5 年,crypto 里面只有真正有 utility 的项目才可能支撑起足够高的市值。基于此我认为 Bittensor 的市值至少会进入前 20 名。

大家觉得目前 top 30 的项目里面哪个市值是最虚的?欢迎留下你的评论。`,
    type: '观点', readTime: '2 分钟',
    cover: 'cover-6', coverText: 'TAO · top 20',
    author: 'quack_builder', authorHandle: '@quack_builder',
    date: '2026·05·03',
    sourceUrl: 'https://x.com/quack_builder/status/2050879181802688796',
  },
  {
    slug: 'shanghai-ideathon-recap',
    title: '上海 Bittensor Ideathon 现场:50+ proposal 超出预期',
    lead: '周六的 Shanghai Ideathon 收到超过 50 份 proposal,我 vibe code 了个网页把大家的提案都放上来。',
    body: `周六的 Shanghai Ideathon 大家的热情远超我们的预期,我们在现场一共收到了超过 50 份 proposal,可惜因为时间关系,在 Demo 环节只有 20 多支团队有机会 pitch,而且也只有 3 分钟时间。

为了更好的让大家的 idea 得到展示,今天我 vibe code 了一个网页把大家的 proposal 都放上来,欢迎大家给自己喜欢的 proposal 点赞。

(提醒:大家的点赞数量和最终评奖结果没有关系,请大家不要刷赞哦)`,
    type: '现场', readTime: '1 分钟',
    cover: 'cover-3', coverText: 'Shanghai · ideathon',
    author: 'quack_builder', authorHandle: '@quack_builder',
    date: '2026·05·25',
    sourceUrl: 'https://x.com/quack_builder/status/2058876473575174232',
  },
];

export function getInsight(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}
