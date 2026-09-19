#!/usr/bin/env bash
# ============================================================
#  更新代码后重新部署（应用层）
#  用法：bash deploy/update.sh
#
#  两种场景：
#    - git 仓库：自动 git pull
#    - 手动上传：请先把新代码覆盖到项目目录，再跑本脚本
#
#  可配置项（优先读环境变量，未设置时使用中性默认值）：
#    PM2_APP_NAME   PM2 进程名     默认 jack-fashion
#    PORT           应用监听端口   默认 3000
#    SITE_URL       线上站点 URL   默认 https://example.com（仅用于完成提示）
#  项目目录由脚本位置自动推断（PROJECT_ROOT），无需配置。
# ============================================================
set -euo pipefail

# CRLF 自修复
if grep -q $'\r' "$0" 2>/dev/null; then
  sed -i 's/\r$//' "$0"
  exec bash "$0" "$@"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# ---- 可配置默认值（环境变量优先）----
PM2_APP_NAME="${PM2_APP_NAME:-jack-fashion}"
PORT="${PORT:-3000}"
SITE_URL="${SITE_URL:-https://example.com}"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info(){ echo -e "${BLUE}[信息]${NC} $*"; }
ok(){ echo -e "${GREEN}[完成]${NC} $*"; }
warn(){ echo -e "${YELLOW}[警告]${NC} $*"; }

[[ $EUID -eq 0 ]] || { echo "建议用 root 运行"; }

# 1. 拉取/确认代码
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    info "git 仓库，拉取最新代码..."
    git pull --ff-only
else
    warn "非 git 仓库。请确认已把新代码覆盖到 $PROJECT_ROOT"
    read -rp "代码已覆盖好？继续构建？(y/N): " c
    [[ "$c" =~ ^[Yy]$ ]] || exit 0
fi

# 2. 安装依赖（package-lock 有变才需要）
info "安装依赖..."
if [[ -f package-lock.json ]]; then npm ci || npm install; else npm install; fi

# 3. 重新构建
info "重新构建..."
npm run build

# 4. 重启（零停机：先 reload，失败再 restart）
info "重启服务..."
if pm2 reload "$PM2_APP_NAME" 2>/dev/null; then
    ok "PM2 reload 成功（零停机）"
else
    pm2 restart "$PM2_APP_NAME"
    ok "PM2 restart 成功"
fi

sleep 2
if curl -sf -o /dev/null "http://127.0.0.1:$PORT"; then
    ok "服务正常 (127.0.0.1:$PORT → 200)"
else
    warn "$PORT 未响应，查日志：pm2 logs $PM2_APP_NAME"
fi

echo
ok "更新完成。访问 $SITE_URL 验证。"
