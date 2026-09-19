#!/usr/bin/env bash
# ============================================================
#  Jack African Fashion 非交互部署脚本（远程自动执行版）
#  用法：DOMAIN=... EMAIL=... ADMIN_PASS=... bash deploy/deploy-auto.sh
#  逻辑同 deploy.sh，但去掉所有 read 交互，参数从环境变量读
#
#  可配置项（优先读环境变量，未设置时使用中性默认值）：
#    DOMAIN         生产域名，不含 https:// 与 www   默认 example.com
#    EMAIL          Let's Encrypt 提醒邮箱             必填（无默认）
#    ADMIN_PASS     管理员密码，≥8 位                 必填（无默认）
#    PM2_APP_NAME   PM2 进程名                       默认 jack-fashion
#    PORT           应用监听端口                     默认 3000
#  站点目录由脚本位置自动推断（PROJECT_ROOT），无需配置。
# ============================================================
set -euo pipefail

# CRLF 自修复
if grep -q $'\r' "$0" 2>/dev/null; then
  sed -i 's/\r$//' "$0"; exec bash "$0" "$@"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info(){ echo -e "${BLUE}[信息]${NC} $*"; }
ok(){ echo -e "${GREEN}[完成]${NC} $*"; }
warn(){ echo -e "${YELLOW}[警告]${NC} $*"; }
die(){ echo -e "${RED}[错误]${NC} $*"; exit 1; }

[[ $EUID -eq 0 ]] || die "请用 root 运行"
cd "$PROJECT_ROOT"
DOMAIN="${DOMAIN:-example.com}"
EMAIL="${EMAIL:-}"
ADMIN_PASS="${ADMIN_PASS:-}"
PM2_APP_NAME="${PM2_APP_NAME:-jack-fashion}"
PORT="${PORT:-3000}"

[[ -n "$EMAIL" ]] || die "缺少 EMAIL 环境变量"
[[ -n "$ADMIN_PASS" ]] || die "缺少 ADMIN_PASS 环境变量"
[[ ${#ADMIN_PASS} -ge 8 ]] || die "ADMIN_PASS 至少 8 位"

info "域名=$DOMAIN  邮箱=$EMAIL  项目=$PROJECT_ROOT"

# 1. 系统依赖
info "安装系统依赖..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y -qq
apt-get install -y -qq git curl rsync unzip ca-certificates tar > /dev/null 2>&1
ok "系统依赖"

# 2. Node.js 20
need_node=true
if command -v node &>/dev/null; then
    nv=$(node -v | cut -dv -f2 | cut -d. -f1)
    [[ "$nv" -ge 20 ]] && need_node=false
fi
if $need_node; then
    info "安装 Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
    apt-get install -y -qq nodejs > /dev/null 2>&1
fi
ok "Node $(node -v) / npm $(npm -v)"

# 3. PM2
command -v pm2 &>/dev/null || { info "安装 PM2..."; npm install -g pm2 > /dev/null 2>&1; }
ok "PM2 $(pm2 -v)"

# 4. Swap
TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
if [[ "$TOTAL_MEM" -lt 2000 && ! -f /swapfile ]]; then
    info "内存 ${TOTAL_MEM}M，创建 2G swap..."
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
    grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
    ok "Swap 2G"
fi

# 5. 运行时目录
mkdir -p "$PROJECT_ROOT/data" "$PROJECT_ROOT/public/images/products"

# 6. 安装依赖 + 构建
info "安装 npm 依赖（2-5分钟）..."
if [[ -f package-lock.json ]]; then npm ci || npm install; else npm install; fi
info "构建生产版本..."
npm run build
ok "构建完成"

# 7. .env.local
info "生成 .env.local..."
ADMIN_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
cat > "$PROJECT_ROOT/.env.local" <<EOF
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$ADMIN_PASS
ADMIN_SECRET=$ADMIN_SECRET
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
EOF
chmod 600 "$PROJECT_ROOT/.env.local"
ok ".env.local（权限600）"

# 8. PM2
info "配置 PM2..."
cat > "$PROJECT_ROOT/ecosystem.config.cjs" <<EOF
module.exports = {
  apps: [{
    name: '$PM2_APP_NAME',
    script: 'npm',
    args: 'run start',
    cwd: '$PROJECT_ROOT',
    env: { NODE_ENV: 'production', PORT: '$PORT' },
    autorestart: true,
    max_memory_restart: '500M'
  }]
};
EOF
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
pm2 start "$PROJECT_ROOT/ecosystem.config.cjs"
pm2 save > /dev/null 2>&1
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true
ok "PM2 已启动 + 开机自启"

# 9. 验证
sleep 3
if curl -sf -o /dev/null "http://127.0.0.1:$PORT"; then
    ok "Next.js 本地响应正常 (127.0.0.1:$PORT → 200)"
else
    warn "$PORT 未响应，查 pm2 logs $PM2_APP_NAME"
fi

# 10. 备份
mkdir -p /backup
CRON_LINE="0 3 * * * tar czf /backup/jack-\$(date +\%Y\%m\%d).tar.gz $PROJECT_ROOT/data $PROJECT_ROOT/public/images/products 2>/dev/null && find /backup -name 'jack-*.tar.gz' -mtime +14 -delete 2>/dev/null"
( crontab -l 2>/dev/null; echo "$CRON_LINE" ) | grep -v '^$' | sort -u | crontab -
ok "每日03:00备份→/backup（保留14天）"

echo
echo "================================================"
echo "✅ 应用层部署完成"
echo "  项目目录: $PROJECT_ROOT"
echo "  域名:     $DOMAIN"
echo "  本地服务: http://127.0.0.1:$PORT"
echo "================================================"
