# Jack Fashion SEO 与 AI 搜索优化交付

正式上线日期：2026-10-04，北京时间。站点：[Jack Fashion](https://zamique.com)。本轮已完成实施、测试环境验证、正式发布和搜索更新提交。

## 已上线的内容与体验

保留 Jack Fashion、B2B 女装批发、每款 100 件起订和官方 WhatsApp 直接联系的采购路径。现有 68 款商品的编号、链接、数据和六色主图与本轮开始时一致；目录支持款号搜索和分类筛选。非洲仍是基础市场，中东、欧美、拉美和东南亚入口沿用实际商品选款及采购确认内容，不承诺尚未开通的当地支付或交期。

商品卡片取消无条件高优先级加载，首屏主视觉保留优先加载；列表继续显示完整六色拼图及自然比例。大图查看器打开后才加载完整原图，支持关闭和 Escape；预览中的 WhatsApp 点击也纳入统计。修复移动目录横向溢出和页面加载时的布局跳动。

新增 [采购指南中心](https://zamique.com/guides) 和六篇英文采购指南，保留 [Buying guide](https://zamique.com/buying-guide) 为总入口。文章连接实际商品、批发分类、市场页面和 WhatsApp，使用 Article 与面包屑标记。

| 指南 | 地址 |
| --- | --- |
| 起订量与询价准备 | [Wholesale MOQ](https://zamique.com/guides/wholesale-moq) |
| 尺码与颜色配比 | [Size and color ratios](https://zamique.com/guides/size-color-ratios) |
| 大码实测检查 | [Plus-size measurements](https://zamique.com/guides/plus-size-measurements) |
| 图片与订单确认 | [Photos and order confirmation](https://zamique.com/guides/photos-order-confirmation) |
| 现货与定制确认 | [Ready stock and custom orders](https://zamique.com/guides/ready-stock-custom-orders) |
| 包装与货代交接 | [Packing and cargo handover](https://zamique.com/guides/packing-cargo-handover) |

实际公开页面为 **99 个**，由真实路由和商品数据生成。标题、描述、canonical、内部链接、站点地图、页面正文和结构化数据已核查；未知商品和指南返回真实 404，筛选参数指向目录主页面。后台和接口不加入站点地图，后台及旧询盘入口保持 noindex。

## 真实素材使用清单

采用站主授权的五组人台照片，制作 35 个网页图片版本。原始照片未修改，同款关系未确认前没有加入现有商品相册；页面明确提示库存、颜色、尺码及订单条件需要询盘确认。

| 原图 | 用途 |
| --- | --- |
| [098601：装饰褶皱裙](<D:/Desktop/code/African Fashion/上新/7月11日/098601bdeff437c46f676530c9c1975a.jpg>) | 图片确认指南 |
| [4ce493：层叠花裙](<D:/Desktop/code/African Fashion/上新/7月11日/4ce493fe3c5578b2469aa04705d5ec13.jpg>) | 首页优先展示、图片确认指南 |
| [074c23：印花裙展示](<D:/Desktop/code/African Fashion/上新/7月16/074c23546d3f151635227ef79fd35625.jpg>) | 图片确认指南 |
| [1b3855：花卉蕾丝长裙](<D:/Desktop/code/African Fashion/上新/7月16/1b38559e213bf42d9cda79dd75536b9a.jpg>) | 图片确认指南 |
| [38ecb6：晚宴长裙](<D:/Desktop/code/African Fashion/上新/7月16/38ecb64a2fc2720e5d3405a00239f738.jpg>) | 首页第二组展示、图片确认指南 |

来源校验值、原始尺寸与网页路径：[素材清单](<D:/Desktop/code/African Fashion/artifacts/jack-fashion-seo-ai-20261003/garment-photo-usage.json>)。35 个线上图片版本均返回 200 和正确图片类型。

实测尺码、面料成分、同款视频、认证及发货案例仍需真实资料。页面没有补造这些内容，也未将流花市场历史作为 Jack Fashion 的经营证明。现有社媒配置是平台首页占位链接，已排除在品牌账号展示和组织标记之外；以后填入官方账号后再启用。

## 询盘登记与来源统计

新增 [询盘后台](https://zamique.com/admin/leads)，沿用现有管理员登录。可以登记客户简称、国家、款式、数量、来源、来源依据和备注，编辑、筛选、归档，并记录新询盘、有效询盘、已报价、成交及未成交状态和首次阶段日期。

客户仍直接进入官方 WhatsApp。后台需要人工登记实际沟通结果；网站点击不会自动成为有效询盘，也不会读取 WhatsApp 聊天。

统计支持商品编号、按钮位置、市场和指南标识；按可识别的访问来源区分 Google、Bing、ChatGPT、Perplexity 等，缺失来源保留为未知。测试中的 ChatGPT 标识使用受控 UTM 链接，只证明归因与点击追踪功能，不能当作真实 AI 引荐客户。

发布切换时完整保留 **775 次页面访问、85 次 WhatsApp 点击、815 条最近记录及 203 个已知访客标识**，统计起始时间仍为 2026-07-22。最后健康检查为 778 次访问、85 次点击，业务继续记录。生产询盘登记数为 0，本地及测试环境的验收客户没有迁入生产。

记录属于技术事件，可能包含站主测试，不代表同等数量的真实采购客户。历史有效询盘和成交需要根据实际 WhatsApp 沟通补登。

## 搜索提交与 AI 发现检查

| 平台或检查项 | 实际结果 |
| --- | --- |
| Google sitemap | 已显示 “Sitemap submitted successfully”；界面当前仍显示先前发现的 92 个页面，新版站点地图包含 99 个页面 |
| Bing sitemap | 已对现有验证站点重新提交；状态 Processing，提交日期界面显示 10/3/2026，旧抓取发现数为 83，等待新抓取 |
| IndexNow | 当前发布的 99 个公开链接获得 HTTP 200 接收回执，待重试数为 0 |
| 后续更新通知 | 后台商品和内容保存按实际变更链接进入去重队列；失败保存回执并进入重试，定期重试不阻断商品保存 |
| Google AI 参与设置 | 当前为 Include，本轮没有改动该设置 |
| Google robots | 新版 HTTPS 文件已于北京时间 10/4 03:13 抓取；HTTP 和 www 路径重定向至 HTTPS。旧 HTTP 报告的异常发生于 9/17，已申请重新抓取 |
| Google robots 警告 | Host 指令被 Googlebot 忽略；属于非阻断警告 |
| ChatGPT 搜索与用户访问 | Cloudflare 近 7 天显示 OAI-SearchBot 约 1.1k 次允许请求、ChatGPT-User 131 次允许请求；相关阻止开关未开启 |
| Perplexity | Cloudflare 近 7 天显示 PerplexityBot 5 次允许请求；Perplexity-User 无请求，两个阻止开关均未开启 |
| 训练控制 | Cloudflare 原有 GPTBot 训练爬虫阻止设置保留，与搜索访问分别处理 |

已查询官方抓取 IP 清单并检查源站日志。源站日志记录的是 Cloudflare 边缘 IP，不能据此验证每个机器人原始 IP；上表机器人分类依据 Cloudflare 报告，不声称已完成源站逐请求 IP 身份验证。`llms.txt` 和 `llms-full.txt` 同步采购指南与公开信息。

提交与允许抓取均不保证收录、排名、AI 引用或成交。Google 当前发现数、Bing 处理状态和历史报告不属于新版发布后的增长结果。

提交凭证：[Google](<D:/Desktop/code/African Fashion/artifacts/jack-fashion-seo-ai-20261003/google-sitemap-submission.json>) · [Bing](<D:/Desktop/code/African Fashion/artifacts/jack-fashion-seo-ai-20261003/bing-sitemap-submission.json>) · [IndexNow](<D:/Desktop/code/African Fashion/artifacts/jack-fashion-seo-ai-20261003/indexnow-submission.json>)。后台 [搜索更新页面](https://zamique.com/admin/search) 可查看更新队列和回执。

## 性能与验收

采用同一 Lighthouse 13.5.0 默认移动测试配置，发布前后各对三个公开页面运行一次；属于实验室结果，尚不足以代表真实用户性能分布。

| 页面 | 发布前评分 | 发布后评分 | 发布前 CLS | 发布后 CLS | 发布前 LCP | 发布后 LCP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 首页 | 71 | 97 | 2.646 | 0 | 1.905 秒 | 1.819 秒 |
| 目录 | 62 | 92 | 0.882 | 0 | 3.150 秒 | 2.873 秒 |
| 商品 | 55 | 83 | 0.882 | 0 | 3.692 秒 | 4.167 秒 |

三页 SEO 检查评分均为 100。商品页本次 LCP 比发布前慢，不能声称所有加载指标都改善；继续结合真实用户数据和同条件重复测量判断。实验室没有证明真实用户 INP 或全站 Core Web Vitals 已达标。

- 43 个测试文件、148 个测试通过；代码检查、本地构建及服务器生产构建通过；迁移脚本 3 个测试通过。
- 7 个页面在 320、390、768、1024、1440、1920 六种宽度下共 42 项布局检查通过。
- 实际筛选、款号搜索、完整拼图、高清原图、Escape 关闭和预览 WhatsApp 点击记录验证通过。
- 询盘登记、编辑、阶段日期、来源、归档，以及未登录拒绝和跨来源写入拒绝验证通过；测试环境不对搜索平台发出验收通知。
- 测试环境和线上分别检查全部 99 个公开页面；标题、canonical、结构化数据和真实 404 通过；匿名访问询盘及搜索更新接口返回 401。
- 35 个真实照片网页版本全部在线可访问。

证据：[测试结果](<D:/Desktop/code/African Fashion/artifacts/jack-fashion-seo-ai-20261003/tests.log>) · [响应式检查](<D:/Desktop/code/African Fashion/artifacts/jack-fashion-seo-ai-20261003/responsive-local-final.json>) · [线上页面检查](<D:/Desktop/code/African Fashion/artifacts/jack-fashion-seo-ai-20261003/public-verification.json>) · [性能对比](<D:/Desktop/code/African Fashion/artifacts/jack-fashion-seo-ai-20261003/performance-comparison.json>) · [最终健康状态](<D:/Desktop/code/African Fashion/artifacts/jack-fashion-seo-ai-20261003/final-production-health.json>)。

## 发布、数据和回滚

当前发布目录：`/var/www/zamique-releases/20261003-jack-fashion-seo-ai-r1`，活动入口：`/var/www/zamique-current`。发布标识使用 UTC 日期，因此目录中的 20261003 对应北京时间 10/4 上线。PM2 `jack-fashion` 状态 online，最后检查重启次数为 0；使用独立发布目录完成构建和验证后切换。

访问统计、询盘和 IndexNow 队列持久化于 `/var/www/zamique-shared/runtime-data`，独立于发布目录。迁移在暂停旧写入进程后执行，迁移前备份并核对数量。商品数据、网站内容和锁文件校验值与本轮开始时一致，原有未提交修改及历史备份保留；本轮没有提交或改写 Git 历史。

服务器备份：`/backup/zamique-20261003-jack-fashion-seo-ai-r1`。上一版本：`/var/www/zamique-releases/20261003-jack-fashion-global-r1`。回滚助手：[jack-fashion-seo-release.ps1](<D:/Desktop/code/African Fashion/deploy/jack-fashion-seo-release.ps1>) 的 Rollback 阶段会保留最新兼容商品、内容、图片和统计数据；询盘与 IndexNow 数据继续留在共享目录。当前线上健康，本轮未执行回滚。

Cloudflare 已确认 8 批、212 个精确 HTML 与发现文件地址的缓存刷新；没有全站清空图片或静态资源缓存。发布版本通过资源版本标识避免继续使用旧页面脚本。

本地源代码快照、历史访问记录和验收目录含内部资料，仅用于备份和维护，不作为对外品牌附件发布。

## 后续复盘与经营资料

第 4 周复盘：**2026-11-01**；第 8 周复盘：**2026-11-29**。日期和清单已交付，未创建自动定时任务。

本次搜索报告基线：Google 当前读取的历史报表图表区间为 9/27–9/29，搜索报告显示 0 点击、3 曝光、平均位置 4；报表控件包含 Page: undefined、United States、Desktop 等筛选信息，因此不当作全站无筛选结果。Google 生成式 AI 报告显示 1 次历史曝光及 about 页面，曝光不等于一次引用。Bing AI Performance 的 3 个月区间（7/3–10/2）显示 0 次引用、0 个平均被引用页面；Bing 普通搜索报告显示该区间暂无可用数据。

复盘时使用同一明确区间和筛选条件，分别比较提交、收录、曝光、AI 引用、有效询盘、报价及成交。可以先在询盘后台补登实际 WhatsApp 客户，依据客户说明或带标识的链接填写来源。

已整理真实英文品牌介绍、采购资料、实拍使用边界和 Europages、Fibre2Fashion、Alibaba.com、LIUHUAMALL 候选渠道：[品牌与采购资料包](<D:/Desktop/code/African Fashion/artifacts/jack-fashion-seo-ai-20261003/brand-and-buyer-materials.md>)。本轮没有对外发帖、联系合作方或购买服务。
