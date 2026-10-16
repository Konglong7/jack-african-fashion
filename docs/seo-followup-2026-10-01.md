# zamique.com SEO 与服务器后续处理记录

本记录接续 `seo-audit-2026-10-01.md`，保留前一轮审查的历史结果。按用户继续实施的要求，本轮优先处理磁盘余量、HTML 缓存、系统运行时、跨浏览器验证和索引通知。网站仍使用已验证的 R3 版本，没有重写界面或覆盖业务数据；未进行 Git 提交。用户授权浏览器登录后，Cloudflare 认证已恢复，旧 CDN 缓存已清除，最终公开验收全部通过。当前安全技术实施范围已完成，真实商业资料、收录与长期现场表现仍按文末清单处理。

## 优先级、执行结果和风险

| 优先级 | 问题 | 本轮处理 | 风险与当前状态 |
| --- | --- | --- | --- |
| P1 | 磁盘约 94%，可用约 2.1GiB | 清理五个明确站点目录下可再生的 webpack 构建缓存；先执行 npm verify，再清理 npm 下载缓存 | 117868 个受保护文件核对通过。保留全部版本、历史备份、商品图片、图片缓存、运行配置及重要工具缓存；后续首次构建会重新下载/编译 |
| P1 | 普通静态 HTML 原来可在边缘保存一年，更新与 canonical 不易及时到访客端 | Nginx 将已知公开页面缓存限定为 60/600 秒，缩短过长的过期重用窗口；保留图片、JS、CSS 的原有缓存 | 源站与边缘均完成验收：30 个源站专项、17 个公开缓存专项及全部 83 个公开 HTML 页面通过 |
| P1 | 304 响应没有 Content-Type，第一次缓存修正对它失效 | 根据已知 URI 与上游原策略匹配缓存类别，确保 200 和 304 使用同一时效 | 30 个源站检查全部通过，包含条件请求、私密页面、不可变脚本与真正 404 |
| P1 | 系统 Node 20 与 PM2 守护进程仍使用旧运行时 | 使用签名仓库验证的 NodeSource 22.23.3 包，兼容性检查后升级；通过独立临时健康进程承接网站访问 | 系统、PM2 守护进程和网站运行时均为 Node 22.23.3；旧包与私有配置可恢复，3210 临时进程已停止 |
| P2 | Cloudflare HTML 规则覆盖不完整，并需要明确保护 RSC/询盘 | 扩充至国家/批发页，排除 RSC 头和 `_rsc=` 查询、询盘/后台/API；浏览器尊重源站，边缘依据源站缓存策略 | 已保存并核实持久化设置；修正 GET/HEAD 规则漏掉内部 PURGE 评估的问题，精确刷新实际生效。所有查询参数保留，不修改 WAF 或 AI 训练封锁政策 |
| P2 | 尚未验证 Firefox/WebKit | 补充两个引擎的完整响应式、功能和图片测试 | 两个引擎各 90 个布局、8 组流程、5 种图片全部通过；不能代替真实 iPhone/Safari/非洲弱网验证 |
| P2 | 目录历史 canonical 指向 www；示例商品未抓取 | Google 实时手机检查确认可抓取、根域名 canonical 与索引许可；提交修复页面的重新索引请求 | 两页请求均成功进入队列；实际收录、Google 最终 canonical 与排名仍待重新处理 |
| P2 | Bing 账号尚未添加本站，缺少收录与 AI 引用观察入口 | 按用户指定的 Zhijie Ning 登录，手动添加并通过 XML 文件完成所有权验证，提交 sitemap 一次 | 网站后台可用；sitemap 为 Processing，搜索数据尚未生成，AI 报告历史窗口无数据，不宣称已收录 |
| P2 | 尚未接入 IndexNow | 持久化网站所有权验证文件，核对 83 个公开规范网址后提交一次 | 接口返回 202，已收到，所有权验证待服务方完成；不等于收录、排名或 AI 推荐 |
| P2 | 维护凭据初始化脚本已有重复尾段，语法解析失败 | 备份后仅移除重复的 8 行连接检查尾段 | 18 个 PowerShell 维护脚本语法通过；未执行密码初始化或改写凭据 |
| P2 | 商业身份、尺寸/QC 配图和真实规格缺少独立核验 | 整理 `business-content-verification-2026-10-01.md`，请求经营者提供真实资料 | 不编造售价、评价、工厂证明和客户案例；等待资料后完善内容 |

## 缓存边界与最终公开验收

公开首页、目录与商品保留 60 秒共享缓存，过期重用窗口限制为 300 秒；About、Contact、FAQ、定制、国家与批发页对原一年策略限定为 600 秒，过期重用 60 秒。robots、sitemap、manifest 原有即时校验策略保持原样；只有原本一年期的发现文件才被限定为 300 秒。询盘使用 private/no-store，后台延续源站私密策略，未知商品与未知路径仍返回真正 404。

发现的 304 问题有前后证据：修正前 About 的 200 是 600 秒，而 304 重新返回一年；目录的 304 也恢复了过长的重用窗口。URI 分类修正后两种响应完全一致，30 个源站专项通过。

本次用户授权后，使用现有 Google 登录恢复 Cloudflare 控制台，没有读取密码或导出登录凭据。第一次恢复登录后的 178 URL 精确刷新虽收到控制台成功提示，但 About、Contact、Custom Orders 仍返回旧一年对象，公开检查明确失败。核查保存的缓存规则及官方说明，确认本轮 GET/HEAD 条件漏掉了 Cloudflare 内部单文件刷新所用的 PURGE 评估。补齐 PURGE 后重新保存，回读表单确认表达式与时效设置一致，再完成 6 批、178 个根域名/www 页面与发现 URL 的精确刷新。没有全站清缓存，图片及 JS/CSS 不在范围内。

最终 17 个公开缓存专项全部通过，覆盖普通 HTML、RSC 及 `_rsc=` 分离和询盘/后台私密边界；全部 83 个 sitemap 页面均返回正确的 60/600 秒策略、HTTP 200 和 HTML 内容类型。About、Contact、Custom Orders 首次验证为 MISS，后续重复访问为 HIT，Age 约 373–376 秒，时效均为 600 秒，证明新策略实际生效且缓存功能保留。缓存验收精确解析数字，避免把 600 秒误认为 60 秒。证据为 `public-cache-final-verified.json`、`public-cache-all-pages-final.json`、`cache-hit-after-final-refresh.json`、`cloudflare-cache-rule-final.json` 与 `purge-final-with-method-fix/`。

刷新助手还补充了弹窗加载等待：打开后在有界时间内观察状态，再提交；不因界面尚在过渡就重复点击。此前失败或登录阻塞的证据保留为历史，不再作为当前未完成状态。

## 系统升级与恢复证据

NodeSource 20/22 安装包来自签名 APT 元数据，安装模拟仅变更 nodejs 一个包，没有删除其他包。升级前使用解包后的实际候选二进制检查 PM2、npm、corepack、Codex、Claude Code、OpenCode 的版本命令，没有发起模型请求或读取登录凭据。

升级时暂时独立运行相同 R3 网站于回环 3210，健康检查后让 Nginx 承接该进程；安装系统包并重启 systemd 管理的 PM2，再验证回环 3200、守护进程实际可执行文件和原有 CLI 后切回。不会因 PM2 重启同时失去备用进程。

- 系统安装包：22.23.3-1nodesource1；PM2 守护进程实际 `/proc` 可执行文件为新 `/usr/bin/node`。
- 原有 PM2 7.0.1、Codex 0.134.0、Claude Code 2.1.170、OpenCode 1.15.6 保持不变。
- 系统包配套 npm 从 10.8.2 变为 10.9.9，corepack 从 0.34.6 变为 0.36.0，版本检查通过。
- NodeSource 更新渠道从 20 改为 22，保留原签名密钥，没有安装新信任源或执行远程引导脚本。
- 网站继续使用版本内专用 Node，不依赖系统解释器路径变化。没有修改其他服务、代理出口、防火墙、机器网络配置或 Windows 全局设置。
- 恢复资料：`/backup/zamique-continuation-20261001/node-upgrade`，目录权限 700，含前后仓库源、原 PM2 服务、私有 dump、旧/新安装包、安装和验收记录。

旧 Node 20 包仅为紧急恢复而保留；不应把恢复旧运行时作为长期运行方案。升级脚本在流量切换及包安装失败时恢复原配置；若主进程恢复失败，会保留健康备用进程并报错。紧急操作前仍须检查当时进程和业务状态，不应盲目重跑已完成的一次性应用脚本。

## 实际测试和当前运行状态

- 本轮 Firefox 和 WebKit：各 90 个布局用例、8 组核心功能、5 种图像尺寸，全部通过，脚本异常为 0。覆盖 320/375/768/1024/1440px 的 18 个页面。
- WebKit 最初的强制整页替换会取消未结束的后台 RSC 预取，浏览器将取消报告为访问控制错误；静置页面和真实链接导航均没有异常。测试改为等待当前预取结束后再换整页，没有过滤或屏蔽异常。通过记录见 `ui-webkit-final/results.json`。
- Node 升级后及最终 CDN 刷新后分别验证线上 83 页，全部 200，无缺 canonical、H1 异常或 JSON-LD 解析错误；最终 189 个补充 HTTP/SEO/重定向/图片/私密访问检查通过。升级后 8 个反向代理专项通过，后续没有更改代理或应用源码。
- 升级后及最终 CDN 刷新后，Chromium 分别再验 8 组核心流程与 5 种图片适配，脚本异常 0；WhatsApp 只检查目标 URL，没有真实发送。测试统计请求被拦截，没有管理员业务写入。
- 图片为 480×1600、1600×480、700×700、24×32、3840×2160，均完整 contain、自适应且无横向溢出；低清图片无法恢复原始细节。
- 3 分钟、7 次只读运行观察：同一正式 PID、全部在线、目录始终 200、无新增重启、错误日志无变化；最大 RSS 387MiB。后续 Google 抓取/补充检查结束后又观察 2 分钟、5 次，状态和日志同样通过，最大 RSS 565.1MiB。这不是高并发压测或长期稳定性保证。
- 20:44 最终服务器快照：磁盘 87%，可用 4262MiB；正式进程 PID 3809074，RSS 约 599MiB，回环 3200，PM2 自动重启计数 0。自 17:54 的计划内切换以来保持同一正式 PID。前述 387MiB 是早先三分钟观察窗口的最大值，不是全程最大值。升级产生了一次计划内服务重启，不能据此称完全没有重启。错误日志最后修改仍为 13:11 排查阶段。
- 临时 3210 进程已停止，PM2 已保存；部署源码与本地对应文件哈希一致，保留服务器原有未导入测试文件。

非洲独立 HTTPS 首页探针均 200：Johannesburg 1212ms、Lagos 1073ms、Nairobi 1549ms。它们是单次数据中心 HTTP 总耗时，不能代表真实客户 LCP，也不能与前次不同探针/缓存状态直接作因果比较。

## Google 与 AI 搜索发现性

目录历史报告仍显示 7 月抓取未声明 canonical、Google 选择 www；2026-10-01 17:58 的实时手机检查已读取 `https://zamique.com/catalog`，抓取和索引允许，并已成功请求索引。示例商品历史状态为 Discovered - currently not indexed，18:04 实时检查同样读取正确商品 canonical，抓取和索引允许，也已成功请求索引。两页均看到 Indexing requested 回执，只提交一次，没有重复点击 Request again。

示例商品的 Breadcrumbs 有效，但 Product snippets 提示 offers、review 或 aggregateRating 至少提供一项。本站现有真实业务为询价流程，没有可核实的公开售价或评价来源，因此没有用零价格或假评分消除提示；语法有效的 Product JSON-LD 与 Google 商品富结果资格是不同检查。这不阻止普通页面索引。

IndexNow 所有权文件由 Nginx 在根路径提供，独立于发布版本，未加入源码或 sitemap，带 noindex。验证从源站、美国两个边缘节点可正常取到一致内容后，通知 83 个本次更新后的公开规范网址；HTTP 202 表示已收到、等待密钥验证。脚本默认仅预览，已接收的同版本同网址集合不会重复提交，网络结果不确定时也不会自动重试。此次继续使用经营者指定的账号完成 Bing 后台接入；通知与收录统计仍待后台处理。

此前连续三轮因 Cloudflare 未登录、旧边缘对象仍存在而真实阻塞，目标未提前标记完成。此次用户授权登录后已恢复控制台访问、修正 PURGE 条件并完成刷新及验收，这一阻塞已解决。历史登录与失败检查证据保留。

Bing 登录页有多个 Google 账号，经营者指定 Zhijie Ning 后继续登录，只确认登录所需的基本姓名、头像和邮箱；没有授权 GSC 导入或读取其他 Google 数据。该账号原来没有网站，本轮手动添加 `https://zamique.com`，下载 Bing 提供的 XML，安装到独立持久目录 `/var/www/zamique-verification/BingSiteAuth.xml` 并由 Nginx 精确路径公开提供，带 noindex、300 秒缓存和安全响应头。文件内容不加入源码或 sitemap，私有恢复副本保留于权限 700 的续办目录。5 个公开文件检查通过，包括内容哈希、XML 类型/安全头、HEAD、304 一致性及 www 规范跳转。初次检查把 Content-Type 限死为 application/xml，实际沿用 Nginx 的 text/xml 类型；两者均为 XML，修正测试要求后通过，没有为此修改网站。

点击 Verify 后进入本站完整后台，网站选择项为 zamique.com；随后仅提交一次 `https://zamique.com/sitemap.xml`。后台显示 Known sitemaps 1、错误/警告 0、状态 Processing、发现 URL 尚为 0。它不代表 sitemap 最终解析成功或本站已被收录。IndexNow 页面仍展示接入介绍，尚未生成通知统计；不据此重复提交先前已返回 202 的相同网址集合。已读取 AI Performance（BETA）：Microsoft Copilots and Partners 范围，2026-07-01 至 2026-09-30 的 Citations/Cited Pages 为 0、Grounding Queries 无数据。该窗口早于此次修改，也不覆盖其他全部 AI 服务，不能据此评估此次优化结果。

Bing 验证的 Nginx 变更应用后，30 项源站缓存和 17 项公开缓存再次通过，正式网站进程、业务数据与 R3 源码保持不变。真实后台记录见 `bing-home-after-reload.txt`、`bing-site-selection.txt`、`bing-sitemap-submitted.txt`、`bing-indexnow-after-login.txt`、`bing-ai-performance.txt`；文件与恢复证据见 `bing-verification-install.json` 和 `bing-public-verification-file.json`。源站 IndexNow 验证文件此前 6 次读取均为 200，但自报 Bing/IndexNow 的用户代理不能独立证明身份、密钥验证或收录，继续保留 HTTP 202 的准确含义。

`llms.txt`、真实商品 HTML、内部链接与结构化组织信息继续保留。既有搜索爬虫允许策略和训练爬虫封锁策略没有更改。真实产品规格、可核实主体与客户资料是下一步内容重点；不承诺搜索排名、收录数量或 AI 推荐出现。

## 业务数据与后续事项

线上商品已正式发布为 68 款全量 MOQ 100（当前版本：20261001-images-moq100-r4），线上与本地数据完全对齐。本轮没有清除业务图片、历史版本、完整备份或重要工具缓存，没有真实业务提交、对外消息或付款。

剩余处理顺序：

1. 技术实施与最终 CDN 验收已完成。今后发布仍需检查实际 HTML、60/600 秒时效和精确刷新效果，缓存规则应保留内部 PURGE 条件。
2. 经营者提供真实资料，完善主推款规格和商业身份/QC/物流案例，视真实价格或评价决定商品富结果。
3. 观察 Google 再抓取、最终 canonical 与收录，等待 Bing sitemap 从 Processing 转为处理结果，并查询 IndexNow 通知统计和 AI Performance 的新日期窗口；不要反复提交已进入队列的页面。
4. 用真实手机和非洲客户网络复查，累计现场性能数据；观察 RSS、重启、502、磁盘和图片转换，不把短时采样当成长期保证。
5. 现有磁盘余量已恢复，无需本轮付费扩容；历史版本/备份的迁出与删除需明确保留策略和恢复验证，尚未实施。未创建后台定时监控或自动清理任务。

## 证据与资料

本轮证据位于 `artifacts/continuation-2026-10-01/`，包括缓存清理前后、Cloudflare 规则持久化、200/304、签名包准备与升级、三引擎界面测试、83 页与 189 项 HTTP 检查、Google 实时检查/索引回执、IndexNow 202 回执、非洲探针和运行观察。私有密钥、PM2 环境备份及完整业务归档仅留服务器私有目录，不输出或纳入 Git。

相对续办开始时的 22 个文件变更记录于 `changes-continuation.json/.patch`。相对最初审查开始、包含用户原有改动的基线，共 69 个变更文件记录于初轮证据目录的 `changes-cumulative.json/.patch`；原先 53 个文件的 R3 发布清单保留，不被覆盖。18 个 PowerShell 维护脚本及 4 个相关 Python 文件语法检查、Git 差异空白检查通过，本地受保护数据与原备份字节一致。

官方参考：

- Node 维护状态：https://nodejs.org/en/about/previous-releases
- npm 缓存维护：https://docs.npmjs.com/cli/v11/commands/npm-cache/
- Next CDN/RSC 缓存：https://nextjs.org/docs/app/guides/cdn-caching
- Nginx map：https://nginx.org/en/docs/http/ngx_http_map_module.html
- IndexNow 所有权与响应含义：https://www.indexnow.org/documentation
- Bing IndexNow 接入与限制：https://www.bing.com/indexnow/getstarted
- Google AI 搜索基础：https://developers.google.com/search/docs/appearance/ai-features

- Cloudflare 单文件刷新规则评估（内部 PURGE）：https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-single-file/

- Bing 添加与 XML 所有权验证：https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b
- Bing sitemap 提交与处理：https://www2.bing.com/webmasters/help/sitemaps-3b5cf6ed
