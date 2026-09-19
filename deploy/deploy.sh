#!/usr/bin/env bash
# ============================================================
#  Jack African Fashion 一键部署脚本（应用层）
#  专注：Node环境 + 代码 + 构建 + PM2 + 备份
#  Web反代/SSL 交给 1Panel 面板可视化配置（不与面板冲突）
#
#  用法：把整个项目上传到 VPS 后，在项目根目录执行
#        bash deploy/deploy.sh
#
#  可配置项（优先读环境变量，未设置时使用中性默认值）：
#    DOMAIN         生产域名，不含 https:// 与 www   默认 example.com
#    PM2_APP_NAME   PM2 进程名                       默认 jack-fashion
#    PORT           应用监听端口                     默认 3000
#  站点目录由脚本位置自动推断（PROJECT_ROOT），无需配置。
# ============================================================
set -euo pipefail

# ---- Windows 换行符自修复（若文件被 Windows 编辑器改成 CRLF）----
if grep -q $'\r' "$0" 2>/dev/null; then
  sed -i 's/\r$//' "$0"
  exec bash "$0" "$@"
fi

# ---- 路径推断：脚本位于 项目根/deploy/deploy.sh ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
# ---- 可配置默认值（环境变量优先）----
DOMAIN="${DOMAIN:-example.com}"
PM2_APP_NAME="${PM2_APP_NAME:-jack-fashion}"
PORT="${PORT:-3000}"
# ---- 颜色 ----
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()  { echo -e "${BLUE}[信息]${NC} $*"; }
ok()    { echo -e "${GREEN}[完成]${NC} $*"; }
warn()  { echo -e "${YELLOW}[警告]${NC} $*"; }
die()   { echo -e "${RED}[错误]${NC} $*"; exit 1; }

# ---- 前置检查 ----
[[ $EUID -eq 0 ]] || die "请用 root 运行：sudo bash deploy/deploy.sh"
[[ "$(uname -s)" == "Linux" ]] || die "此脚本只能在 Linux VPS 上运行"

if [[ -f /etc/debian_version ]]; then PKG=apt
elif [[ -f /etc/redhat-release ]]; then PKG=yum
else die "不支持的系统，请用 Ubuntu/Debian 或 CentOS"; fi

VPS_IP="$(curl -s --max-time 5 ifconfig.me || echo 未知)"
cd "$PROJECT_ROOT"

# ============================================================
#  交互输入
# ============================================================
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Jack African Fashion 一键部署（应用层）${NC}"
echo -e "${BLUE}================================================${NC}"
echo "项目目录: $PROJECT_ROOT"
echo "本机公网 IP: $VPS_IP"
echo

# 域名：环境变量 DOMAIN 优先，直接回车沿用当前值（默认 example.com）
read -rp "1) 域名（不带 https:// 和 www，默认 $DOMAIN）: " DOMAIN_INPUT
DOMAIN="${DOMAIN_INPUT:-$DOMAIN}"

read -rp "2) SSL 证书提醒邮箱（后续在1Panel里用）: " EMAIL

# 管理员密码
while true; do
    read -s -rp "3) 设置管理员登录密码（≥8位）: " ADMIN_PASS; echo
    read -s -rp "   再输入一次确认: " ADMIN_PASS2; echo
    [[ "$ADMIN_PASS" == "$ADMIN_PASS2" ]] || { warn "两次不一致，重来"; continue; }
    [[ ${#ADMIN_PASS} -ge 8 ]] || { warn "至少 8 位，重来"; continue; }
    break
done

echo
echo -e "${YELLOW}==================== 请确认 ====================${NC}"
echo "  域名:       $DOMAIN"
echo "  邮箱:       $EMAIL"
echo "  项目目录:   $PROJECT_ROOT"
echo "  管理员账号: admin"
echo "================================================"
read -rp "确认开始部署？(y/N): " CONFIRM
[[ "$CONFIRM" =~ ^[Yy]$ ]] || die "已取消"

# ============================================================
#  1. 系统依赖（不装 nginx，避免和 1Panel 的 OpenResty 冲突）
# ============================================================
info "安装系统依赖（git / curl / rsync / unzip）..."
export DEBIAN_FRONTEND=noninteractive
if [[ "$PKG" = apt ]]; then
    apt-get update -y
    apt-get install -y git curl rsync unzip ca-certificates
else
    yum install -y git curl rsync unzip ca-certificates
fi
ok "系统依赖"

# ============================================================
#  2. Node.js 20
# ============================================================
need_node=true
if command -v node &>/dev/null; then
    nv=$(node -v | cut -dv -f2 | cut -d. -f1)
    [[ "$nv" -ge 20 ]] && need_node=false
fi
if $need_node; then
    info "安装 Node.js 20 LTS..."
    if [[ "$PKG" = apt ]]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    else
        curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
        yum install -y nodejs
    fi
fi
ok "Node $(node -v) / npm $(npm -v)"

# ============================================================
#  3. PM2
# ============================================================
command -v pm2 &>/dev/null || { info "安装 PM2..."; npm install -g pm2; }
ok "PM2 $(pm2 -v)"

# ============================================================
#  4. Swap（小内存 VPS 防 build 时 OOM）
# ============================================================
TOTAL_MEM=$(free -m | awk '/^Mem:/{print $2}')
if [[ "$TOTAL_MEM" -lt 2000 && ! -f /swapfile ]]; then
    info "内存 ${TOTAL_MEM}M < 2G，创建 2G swap 防止构建 OOM..."
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
    grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
    ok "Swap 2G 已启用"
fi

# ============================================================
#  5. 准备运行时目录
# ============================================================
info "准备运行时目录..."
mkdir -p "$PROJECT_ROOT/data" "$PROJECT_ROOT/public/images/products"
ok "data/ 和 public/images/products/ 就绪"

# ============================================================
#  6. 安装依赖 + 构建
# ============================================================
info "安装 npm 依赖（2-5 分钟，请耐心）..."
if [[ -f package-lock.json ]]; then npm ci || npm install
else npm install; fi

info "构建生产版本..."
npm run build
ok "构建完成"

# ============================================================
#  7. .env.local（强随机密钥）
# ============================================================
info "生成 .env.local..."
ADMIN_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
cat > "$PROJECT_ROOT/.env.local" <<EOF
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$ADMIN_PASS
ADMIN_SECRET=$ADMIN_SECRET
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
EOF
chmod 600 "$PROJECT_ROOT/.env.local"
ok ".env.local 已生成（权限 600）"

# ============================================================
#  8. PM2 启动 + 开机自启
# ============================================================
info "配置 PM2 进程守护..."
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
pm2 save
# 开机自启（按提示执行返回的命令，这里自动处理 systemd）
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root 2>/dev/null || pm2 startup
ok "PM2 已启动并设为开机自启"

# ============================================================
#  9. 验证本地端口
# ============================================================
sleep 3
if curl -sf -o /dev/null "http://127.0.0.1:$PORT"; then
    ok "Next.js 本地响应正常 (127.0.0.1:$PORT → 200)"
else
    warn "127.0.0.1:$PORT 未响应，查日志：pm2 logs $PM2_APP_NAME"
fi

# ============================================================
#  10. 每日自动备份（data/ 和 上传图片 是命根子）
# ============================================================
info "配置每日自动备份..."
mkdir -p /backup
CRON_LINE="0 3 * * * tar czf /backup/jack-\$(date +\%Y\%m\%d).tar.gz $PROJECT_ROOT/data $PROJECT_ROOT/public/images/products 2>/dev/null && find /backup -name 'jack-*.tar.gz' -mtime +14 -delete 2>/dev/null"
( crontab -l 2>/dev/null; echo "$CRON_LINE" ) | grep -v '^$' | sort -u | crontab -
ok "每日 03:00 备份到 /backup（保留 14 天）"

# ============================================================
#  11. 检测 1Panel，输出 Web 层配置引导
# ============================================================
PANEL_PORT=""
if command -v 1pctl &>/dev/null || [[ -d /opt/1panel ]]; then
    PANEL_PORT=$(ss -tlnp 2>/dev/null | grep -iE '1panel' | grep -oE ':\d+ ' | head -1 | tr -d ': ')
    PANEL_PORT=${PANEL_PORT:-14917}
fi

echo
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}        ✅  应用层部署完成！${NC}"
echo -e "${GREEN}================================================${NC}"
echo
echo -e "  项目目录:   $PROJECT_ROOT"
echo -e "  本地服务:   http://127.0.0.1:$PORT （已启动，仅本机可访问）"
echo -e "  域名:       $DOMAIN"
echo
if [[ -n "$PANEL_PORT" ]]; then
echo -e "${YELLOW}---------- 下一步：在 1Panel 配置反向代理 + SSL ----------${NC}"
echo "  检测到 1Panel 面板（端口 $PANEL_PORT）"
echo
echo "  1) 浏览器打开 1Panel：http://$VPS_IP:$PANEL_PORT"
echo "  2) 顶部「网站」→「创建网站」→ 选「反向代理」"
echo "     - 主域名:   $DOMAIN"
echo "     - 代号:     $PM2_APP_NAME"
echo "     - 代理地址: 127.0.0.1:$PORT"
echo "  3) 创建后点该网站「配置」→「HTTPS」→ 申请 Let's Encrypt 证书"
echo "     - 邮箱填: $EMAIL"
echo "     - 勾选「强制 HTTPS」"
echo "  4) 前提：$DOMAIN 的 DNS A 记录必须已指向 $VPS_IP"
echo "     （Hostinger 控制台配置，生效需几分钟到几小时）"
echo
echo -e "${YELLOW}  ⚠️  防火墙：在 1Panel「主机→防火墙」放行 22/80/443/${PANEL_PORT} 端口${NC}"
else
echo -e "${YELLOW}---------- 下一步：配置 Web 反向代理 ----------${NC}"
echo "  未检测到 1Panel。请安装 nginx 并配置反代到 127.0.0.1:$PORT，"
echo "  或安装 1Panel：curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && bash quick_start.sh"
fi
echo
echo -e "${YELLOW}日常命令：${NC}"
echo "  看状态:   pm2 status"
echo "  看日志:   pm2 logs $PM2_APP_NAME"
echo "  重启:     pm2 restart $PM2_APP_NAME"
echo "  更新代码: bash $PROJECT_ROOT/deploy/update.sh"
echo "  查看备份: ls /backup"
echo
echo -e "${YELLOW}文件位置：${NC}"
echo "  .env.local:   $PROJECT_ROOT/.env.local"
echo "  产品数据:     $PROJECT_ROOT/data/products.json"
echo "  上传图片:     $PROJECT_ROOT/public/images/products/"
