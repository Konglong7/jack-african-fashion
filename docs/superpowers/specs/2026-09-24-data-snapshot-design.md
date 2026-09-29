# JSON 数据快照与恢复设计

## 目标

为当前无数据库的产品与站点 JSON 数据提供明确、可审计、可回滚的本地快照和恢复入口，降低部署前后数据误操作风险。

## 范围与约束

- 只覆盖 `data/products.json` 和 `data/site-content.json`；`data/analytics.json` 属于真实分析数据，不通过仓库工具复制或输出。
- 默认快照目录为根目录 `backups/data/`，必须加入 Git 忽略规则。
- 快照包含文件、生成时间和 SHA-256 清单。
- 恢复必须显式传入 `--confirm`，默认拒绝覆盖当前数据。
- 所有路径必须解析后限制在项目根目录和快照目录内。
- 本阶段不修改线上数据；脚本只提供后续部署时可调用的入口。

## 设计

新增 `scripts/data-snapshot.mjs`，提供以下命令：

- `node scripts/data-snapshot.mjs backup`：把存在的受支持 JSON 文件复制到带 UTC 时间戳的快照目录，并写入 `manifest.json`。
- `node scripts/data-snapshot.mjs list`：列出快照时间、文件数量和清单校验状态，不读取或打印业务字段。
- `node scripts/data-snapshot.mjs restore <snapshot> --confirm`：先校验快照清单和目标文件，再原子替换受支持文件；缺少确认参数、清单不匹配或快照路径越界时失败。

脚本导出可测试的 `createSnapshot`、`listSnapshots`、`restoreSnapshot` 函数，命令行只负责参数解析和状态码。恢复使用同目录临时文件完成替换，避免直接截断目标文件。快照路径和内容均不写入日志中的敏感字段。

在 `package.json` 增加 `data:backup`、`data:list` 和 `data:restore` 入口，并在 `.gitignore` 忽略 `backups/data/`。

## 验证

- 在临时项目目录生成快照，验证文件内容和清单哈希。
- 修改临时数据后，无 `--confirm` 恢复必须失败；带确认恢复后内容必须回到快照版本。
- 篡改快照或传入越界路径必须失败，原数据保持不变。
- 当前仓库只做 dry-run/隔离目录测试，不生成或恢复真实业务快照。

## 明确不做

- 不迁移 SQLite/PostgreSQL，不添加 ORM、Redis 或消息队列。
- 不备份、打印或提交 `data/analytics.json`。
- 不自动把恢复动作接入部署脚本，避免本阶段改变线上发布行为。
