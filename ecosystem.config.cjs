// PM2 进程配置。
//
// 注意：这里的 PORT 必须与以下位置保持一致，否则发布脚本的健康检查会探不到服务：
//   - deploy/auto-update.ps1 的探活地址（默认 http://127.0.0.1:3000）
//   - deploy/deploy.sh / update.sh 的 PORT 默认值
//   - 反向代理（1Panel/OpenResty）里配置的上游端口
// 如需改动，请通过环境变量 PORT 统一覆盖，不要只改这一个文件。
const PORT = process.env.PORT || '3000';

module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME || 'jack-fashion',
      script: 'node_modules/next/dist/bin/next',
      args: `start -H 127.0.0.1 -p ${PORT}`,
      cwd: __dirname,
      env: { NODE_ENV: 'production', PORT },
      autorestart: true,
      max_memory_restart: '500M'
    }
  ]
};
