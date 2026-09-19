# E2E test scripts

这些脚本是针对本机 `http://localhost:3000` 运行的开发期端到端脚本（`test_security.py` 可用 `BASE_URL` 覆盖地址，`test_ui.py` 内的地址写死为 `http://localhost:3005`），运行前需要先在项目根目录启动 dev server（`npm run dev`），管理后台相关用例可用 `ADMIN_USERNAME` / `ADMIN_PASSWORD` 覆盖默认口令（默认值仅为开发占位：`admin` / `dev-only-change-me`，不要把真实口令写回代码或提交进仓库）；脚本依赖 `playwright`，安装方式为 `pip install playwright && playwright install chromium`，三者都使用无头 Chromium，并把截图输出到仓库根目录的 `test_screenshots/`（与脚本位置相对，不依赖当前工作目录）。
