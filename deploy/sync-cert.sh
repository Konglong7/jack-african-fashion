#!/bin/bash
# ============================================================
#  certbot 续期成功后，把新证书同步到 openresty 挂载目录并重载
#
#  可配置项（优先读环境变量，未设置时使用中性默认值）：
#    DOMAIN               证书对应的域名（letsencrypt 目录名 + 目标子目录名）
#                         默认 example.com
#    CERT_LIVE_DIR        letsencrypt 证书源目录
#                         默认 /etc/letsencrypt/live/$DOMAIN
#    SSL_TARGET_DIR       openresty 证书存放目录
#                         默认 /opt/1panel/apps/openresty/openresty/conf/ssl/$DOMAIN
#    OPENRESTY_CONTAINER  openresty 容器名
#                         默认 openresty（请按你的面板实际容器名覆盖）
#    CERT_SYNC_LOG        同步日志文件
#                         默认 /var/log/cert-sync.log
#
#  用法：DOMAIN=your-domain.example bash deploy/sync-cert.sh
# ============================================================

DOMAIN="${DOMAIN:-example.com}"
CERT_LIVE_DIR="${CERT_LIVE_DIR:-/etc/letsencrypt/live/$DOMAIN}"
SSL_TARGET_DIR="${SSL_TARGET_DIR:-/opt/1panel/apps/openresty/openresty/conf/ssl/$DOMAIN}"
OPENRESTY_CONTAINER="${OPENRESTY_CONTAINER:-openresty}"
CERT_SYNC_LOG="${CERT_SYNC_LOG:-/var/log/cert-sync.log}"

mkdir -p "$SSL_TARGET_DIR"
cp "$CERT_LIVE_DIR/fullchain.pem" "$SSL_TARGET_DIR/fullchain.pem"
cp "$CERT_LIVE_DIR/privkey.pem" "$SSL_TARGET_DIR/privkey.pem"
docker exec "$OPENRESTY_CONTAINER" nginx -s reload
echo "[$(date)] $DOMAIN 证书已同步并重载 openresty" >> "$CERT_SYNC_LOG"
