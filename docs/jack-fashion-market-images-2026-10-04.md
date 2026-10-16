# Jack Fashion 市场选款图片交付

日期：2026-10-04。网站：https://zamique.com。生成方式：内置 image_gen。

新增五张 1536 × 1024 的横向品牌服装视觉，统一自然光、影棚背景和完整穿搭构图。图片用于款式灵感，不代表已确认的现货、精确面料参数、实际尺码或真实场所。页面采用「Collection inspiration」的选款语境，图片上没有文字或角标。

| 图片 | 视觉内容 | 页面 |
| --- | --- | --- |
| Africa | 鲜明印花长裙、配套裙装 | `/markets/africa` |
| Middle East | 长袖长裙、日常与场合穿搭 | `/markets/middle-east` |
| Europe & North America | 大码印花连衣裙、阔腿连体裤 | `/markets/europe-north-america` |
| Latin America | 花卉裹身裙、印花裤装套装 | `/markets/latin-america` |
| Southeast Asia | 长袖裙装套装、花卉长裙 | `/markets/southeast-asia` |

五张图片同时用于首页、关于我们和市场总览的市场入口。对应市场页使用图片与文字分栏展示，手机端纵向排列；WhatsApp 继续直接打开官方链接。

## 素材与提示词

- 原图：`output/imagegen/jack-fashion-market-editorials-2026-10-04/*.png`。
- 每张图片的完整提示词、生成文件位置与原图哈希：上述目录中的 `manifest.json`。
- 原图和提示词下载包：`output/imagegen/jack-fashion-market-editorials-2026-10-04.zip`。
- 网页使用五个 WebP 主图和 40 个响应式版本：`public/images/market-editorials`。
- 素材使用清单、压缩大小与图片哈希：`artifacts/jack-fashion-market-editorials-20261004/image-usage.json`。
- 常用 480 像素版本约 21–35 KB，640 像素版本约 34–58 KB。首页入口图延迟加载；市场页首屏图采用框架预加载。原有图片映射保留，只新增五项。

## 实际检查和发布

- 现有 43 个测试文件、148 项测试通过；相关代码检查、本地构建和服务器构建通过。
- 本地及公网分别检查八个页面在 320、390、768、1024、1440、1920 像素下的显示，各 48 项通过。图片维持完整 3:2 比例，无横向溢出或脚本错误；五个市场页的官方 WhatsApp 跳转与市场入口导航通过。
- 测试环境、正式源站及公网分别检查 99 个公开页面：状态码、标题、canonical、结构化数据、真实 404 和匿名后台保护均通过。测试环境新增 45 个图片文件均为 200、WebP。
- 公网浏览器验收单独保存于 `artifacts/jack-fashion-market-editorials-20261004/public-ui`；测试拦截统计接口和 WhatsApp 外部导航，不发送消息。
- 当前版本：`/var/www/zamique-releases/20261004-jack-fashion-market-editorials-r1`。上一版本 `20261004-jack-fashion-image-display-r1` 和历史备份保留。
- 本地五个发布源文件与线上哈希一致；68 款商品数据、网站设置和依赖锁文件的哈希保持不变。原有款号、六色主图及 100 件/款定位保留。
- 访问、询盘与 IndexNow 数据继续使用 `/var/www/zamique-shared/runtime-data`。切换时统计为 793 个访问事件、89 个 WhatsApp 点击；19:13 的快照为 796、90，未回退旧记录。点击不等于有效询盘或成交。
- Cloudflare 确认定向刷新八个页面在主域与 www 域名的 16 个 URL，未清除商品图片或静态资源缓存。
- IndexNow 八条实际变更链接收到 HTTP 200 回执，待重试为 0；提交成功不保证收录或 AI 引用。
- PM2 在线、重启数为 0，Nginx 配置保持不变；测试环境进程和本地预览已停止。仅清理本次发布可再生成的构建缓存，回收约 154 MiB，服务器剩余约 1,105 MiB。
- 发布与回滚助手：`deploy/market-editorials-release.ps1`。回滚保留最新共享业务记录、商品资料与上传文件；本次未在生产执行回滚演练。

本轮完整检查、截图、发布日志、缓存回执和搜索通知回执保存在 `artifacts/jack-fashion-market-editorials-20261004`。
