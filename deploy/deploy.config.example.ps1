<#
    部署配置模板 —— 复制为 deploy.config.local.ps1 后按需修改。

    用法：
        Copy-Item deploy\deploy.config.example.ps1 deploy\deploy.config.local.ps1
        # 编辑 deploy.config.local.ps1，填入你的服务器信息
        # deploy/ 下的脚本会自动读取它（config.ps1 末尾点源）

    ⚠️ deploy.config.local.ps1 已被 .gitignore 忽略（规则 deploy/deploy.config.local.ps1），
       请勿把它提交到版本库，也不要把真实值写进本模板文件。
#>

# 目标服务器地址（IP 或域名）—— 必填
$env:VPS_HOST = 'your-server.example'

# SSH 登录用户（默认 root）
$env:VPS_USER = 'root'

# PM2 进程名（默认 jack-fashion）
$env:PM2_APP_NAME = 'jack-fashion'

# 服务器上的站点目录（默认 /var/www/jack-fashion-current）
$env:REMOTE_DIR = '/var/www/jack-fashion-current'

# 本机 SSH 凭据缓存文件（默认 $env:USERPROFILE\.ssh\vps-fasion-cred.xml）
# $env:VPS_CRED_FILE = "$env:USERPROFILE\.ssh\my-cred.xml"

# 本机项目根目录（默认自动取 deploy/ 的上一级）
# $env:PROJECT_ROOT = 'D:\code\my-site'
