# CI 生产安全冒烟设计

## 目标

让 CI 在完成 Next.js 生产构建后，使用临时测试凭据启动隔离的本地生产服务，并运行现有 `tests/e2e/test_security.py`，验证未认证访问、登录、会话 Cookie 和认证 API 的基本安全边界。

## 范围与约束

- 只在 GitHub Actions 的临时 Ubuntu runner 上启动服务，不连接线上环境。
- 临时凭据由 CI step 内生成，不写入仓库、日志或 `.env` 文件。
- 使用独立端口 `3100`，避免与现有默认端口 `3000` 混淆。
- 保留现有 Lint、类型检查、单元测试和构建步骤。
- 安全冒烟失败时必须返回非零状态，并尽力清理后台 Next.js 进程。

## 设计

在 `.github/workflows/ci.yml` 的构建步骤后新增一个 step。该 step 将 `NODE_ENV=production`、`PORT=3100`、`BASE_URL=http://127.0.0.1:3100` 和满足生产校验的临时管理员变量导出到当前 shell，后台运行 `npm run start -- --hostname 127.0.0.1 --port 3100`，轮询首页直到服务可用，然后执行 `python3 tests/e2e/test_security.py`。通过 shell `trap` 在成功、失败和中断路径清理进程。

现有 Python 脚本继续作为唯一安全冒烟入口，不新增重复的登录实现。CI 只证明本地生产构建的关键安全路径，浏览器级商品编辑和真实公网/反代行为仍属于后续阶段。

## 错误处理

- 服务在限定次数内未响应：输出 Next.js 日志并失败。
- 安全脚本断言失败：保留服务日志并以原状态退出。
- 清理进程失败不能覆盖原始失败状态。

## 验证

- CI YAML 语法和 shell step 可执行。
- 本地使用同样的临时环境启动生产服务，安全脚本通过。
- 现有 `npm run test`、`npm run lint`、`npm run type-check` 和 `npm run build` 继续通过。

## 明确不做

- 不接入真实 GitHub Secrets、线上 URL、真实账号或外部数据库。
- 不把完整 Playwright 浏览器套件强行加入本阶段 CI。
