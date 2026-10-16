# IndexNow 配置与验证

站点已有自动通知流程：商品新增、编辑、删除及站点设置更新，会把受影响的公开 URL 写入持久队列，再向 `https://api.indexnow.org/indexnow` 发起 POST。相同内容版本去重；失败记录保留并退避重试，进程每五分钟检查一次到期队列。应用启动时还会对照商品快照，发现直接修改数据文件的商品更新。

## 本地准备

运行 `npm.cmd run prepare:indexnow-key`，在 `public/indexnow-key.txt` 创建 UTF-8 密钥文件。重复运行保留已有密钥，输出只有文件路径、是否创建和摘要。已有文件内容无效时会报错并保留原文件。

该文件和 IndexNow 运行队列已被 Git 忽略。无需把通知开关加入构建步骤，也不要在每次构建时重新生成密钥。默认 `JACK_FASHION_INDEXNOW_ENABLED=0`，本地测试不通知搜索平台。

## 当前生产部署

生产环境沿用 `/var/www/zamique-indexnow/indexnow-key.txt`，由现有 Nginx 配置映射为 `https://zamique.com/indexnow-key.txt`；不要用新生成的本地文件替换它。`JACK_FASHION_INDEXNOW_KEY_FILE` 明确设置时只读该文件，缺失或无效会保留待重试任务，不会改用另一个密钥。

启用通知前核对以下条件：

1. 正式域名的 `/indexnow-key.txt` 返回 HTTP 200，正文与配置文件中的密钥一致，不依赖管理员登录或浏览器挑战。
2. `NEXT_PUBLIC_SITE_URL=https://zamique.com`；通知开关为 `JACK_FASHION_INDEXNOW_ENABLED=1`。
3. `JACK_FASHION_RUNTIME_DATA_DIR` 指向已有持久目录，避免发布或进程重启丢失队列、回执和商品快照。

2026-10-09 发布及验收：正式域名的密钥地址返回 HTTP 200，正文摘要与持久化密钥文件一致，并带有 `X-Robots-Tag: noindex`。此前本地访问曾返回 403，此次公网读取未复现。生产环境沿用现有通知流程；用户确认发布后，`20261009-jack-fashion-seo-geo-r1` 已上线，并通过受保护的管理员接口提交当前 sitemap 的 169 个网址。IndexNow 返回 HTTP 200，169 个网址均有接收记录，待处理为 0；这不表示已经收录。完整证据见 `artifacts/seo-geo-release-2026-10-09/indexnow-release-receipt.json` 和 `发布验收记录.md`。本地发送开关保持关闭。

## 发布页面代码后的通知

商品及设置保存自动触发通知。模板、指南或其他源代码修改需要在正式发布并确认页面可访问后通知受影响页面；启动商品对照流程不会发现纯页面代码变化。

沿用受管理员会话与同源校验保护的 `POST /api/admin/indexnow`，请求体为：

```json
{
  "paths": ["/catalog", "/guides/wholesale-moq"],
  "change": "release-unique-revision"
}
```

`paths` 只能包含当前公开 sitemap 中的规范 URL，每次最多 1000 个；`change` 为本次内容版本标识，最多 160 字符。无请求体的 POST 只重试现有队列，兼容后台“搜索更新”操作。该接口不会将管理员、API、查询参数页面或未知路径作为发布更新提交。

## 回执含义

HTTP 200 表示通知成功接收，202 表示收到且密钥验证待完成；两者都不表示已收录、排名提升或获得 AI 引用。失败通知保留于队列。后台“搜索更新”显示待处理 URL、重试时间及最近回执。

协议参考：[IndexNow 官方文档](https://www.indexnow.org/documentation)。
