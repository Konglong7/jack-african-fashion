> 本文档原位于仓库根目录，现归档至 `docs/`。内容为开发期记录，可能早于当前代码实现。

# 项目改进计划

> 基于 PROJECT_REVIEW.md 生成的改进任务清单

---

## ✅ 已完成的改进

### [✅] 1. 创建 README.md
**完成时间**：2026-06-30  
**文件路径**：`README.md`  
**改进内容**：
- 完整的项目介绍和功能特性
- 详细的技术栈说明
- 清晰的安装和运行步骤
- 环境变量配置指南
- 项目结构说明
- 常见问题解答

---

### [✅] 2. 创建 .env.example
**完成时间**：2026-06-30  
**文件路径**：`.env.example`  
**改进内容**：
- 所有必需的环境变量配置
- 详细的使用说明和注释
- 生产环境安全提示
- 密钥生成命令示例

---

### [✅] 3. 修复产品ID生成逻辑
**完成时间**：2026-06-30  
**文件路径**：`src/lib/db.ts`  
**改进内容**：
- 使用 parseInt 替代 Number 防止 NaN
- 使用 reduce 安全计算最大ID
- 添加详细注释说明修复原因

---

### [✅] 4. 启用图片优化
**完成时间**：2026-06-30  
**文件路径**：`next.config.ts`  
**改进内容**：
- 移除 unoptimized: true
- 添加 AVIF/WebP 格式支持
- 配置设备尺寸和图片尺寸
- 设置远程图片域名白名单

---

### [✅] 5. 改进错误处理
**完成时间**：2026-06-30  
**文件路径**：`src/lib/db.ts`  
**改进内容**：
- readAll: 添加错误日志（仅开发环境）
- writeAllAtomic: 添加错误日志和详细错误信息
- deleteProduct: 改进图片删除错误处理
- 移除未使用的变量

---

### [✅] 6. 添加 ESLint & Prettier 配置
**完成时间**：2026-06-30  
**文件路径**：
- `eslint.config.mjs`
- `.prettierrc`
- `.prettierignore`
- `package.json`（新增依赖）

**改进内容**：
- ESLint 9 flat config 格式
- Next.js + React + TypeScript 规则
- Prettier 格式化配置（单引号、无尾随逗号）
- Tailwind CSS 插件支持
- 新增 npm 脚本：lint:fix, format, type-check

---

## 🔴 高优先级（建议立即执行）

### [✅] 1. 创建 README.md
**优先级**：高  
**预估时间**：1小时  
**影响**：项目可维护性、新开发者上手  

**任务**：
- [x] 项目介绍
- [x] 功能特性
- [x] 技术栈说明
- [x] 安装步骤
- [x] 运行命令
- [x] 环境变量配置

**文件路径**：`README.md`

---

### [✅] 2. 创建 .env.example
**优先级**：高  
**预估时间**：10分钟  
**影响**：新人快速开始、生产环境部署  

**任务**：
- [x] 复制 `.env.local` 作为模板
- [x] 添加注释说明每个变量
- [x] 添加敏感信息警告

**文件路径**：`.env.example`

---

### [✅] 3. 修复产品ID生成逻辑
**优先级**：高  
**预估时间**：30分钟  
**影响**：数据完整性、避免ID冲突  

**文件路径**：`src/lib/db.ts` 第107行

**修复内容**：
```typescript
// 当前代码（有问题）
const id = String(Math.max(0, ...all.map((p) => Number(p.id))) + 1);

// 修复后
const maxId = all.reduce((max, p) => {
  const num = parseInt(p.id, 10);
  return !isNaN(num) && num > max ? num : max;
}, 0);
const id = String(maxId + 1);
```

---

## 🟡 中优先级（建议本月完成）

### [✅] 4. 启用图片优化
**优先级**：中  
**预估时间**：30分钟  
**影响**：页面加载性能、SEO  

**文件路径**：`next.config.ts`

**任务**：
- [x] 移除 `unoptimized: true`
- [x] 添加 `images.remotePatterns`
- [x] 测试图片加载

```typescript
// 修改前
images: {
  unoptimized: true,
}

// 修改后
images: {
  formats: ["image/avif", "image/webp"],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
  ],
}
```

---

### [✅] 5. 改进错误处理
**优先级**：中  
**预估时间**：1小时  
**影响**：调试效率、可维护性  

**文件路径**：`src/lib/db.ts`

**任务**：
- [x] 添加错误日志记录
- [x] 区分不同类型的错误
- [x] 添加错误类型定义

---

### [✅] 6. 添加 ESLint & Prettier 配置
**优先级**：中  
**预估时间**：30分钟  
**影响**：代码一致性、团队协作  

**任务**：
- [x] 安装依赖
- [x] 创建 `.eslintrc.json` -> `eslint.config.mjs` (ESLint 9 flat config)
- [x] 创建 `.prettierrc`
- [x] 修改 `package.json` scripts

---

### [✅] 7. 安装新依赖包
**优先级**：中  
**预估时间**：5分钟  
**影响**：代码质量工具  

**新增依赖**：
- @eslint/eslintrc
- @eslint/js
- eslint
- eslint-config-next
- eslint-plugin-react
- eslint-plugin-react-hooks
- prettier
- prettier-plugin-tailwindcss
- typescript-eslint

---

### [✅] 8. 验证项目构建
**优先级**：中  
**预估时间**：10分钟  
**影响**：确保所有改进正常工作  

**验证结果**：
- ✅ TypeScript 类型检查通过
- ✅ 项目构建成功
- ⚠️ ESLint 检查通过（仅剩余警告）

---

## 🟢 低优先级（未来3-6个月）

### [ ] 8. 迁移到数据库
**优先级**：低  
**预估时间**：8小时  
**影响**：性能、扩展性  
**适合场景**：数据量 > 1000时

**建议方案**：
- **开发环境**：SQLite + better-sqlite3
- **生产环境**：PostgreSQL

**任务**：
- [ ] 设计数据库Schema
- [ ] 安装数据库依赖
- [ ] 替换文件读写的实现
- [ ] 迁移现有数据
- [ ] 数据库迁移脚本

---

### [ ] 9. 添加日志系统
**优先级**：低  
**预估时间**：4小时  
**影响**：生产调试  
**理由**：当前console.log不适用于生产环境

**任务**：
- [ ] 安装 Winston
- [ ] 配置日志格式
- [ ] 替换所有console.log
- [ ] 添加日志级别

---

### [ ] 10. 实现图片上传功能
**优先级**：低  
**预估时间**：6小时  
**影响**：管理后台功能完善  

**当前状态**：
- ✅ 产品图片说明文档完整
- ❌ 图片上传API未实现

**任务**：
- [ ] 安装 `multer` (文件上传)
- [ ] 创建上传API：`/api/admin/upload`
- [ ] 创建上传组件：`ProductImageUpload.tsx`
- [ ] 图片压缩和命名规范

---

### [ ] 11. 添加客户端缓存
**优先级**：低  
**预估时间**：2小时  
**影响**：页面加载性能  

**任务**：
- [ ] 使用 React Query 或 SWR
- [ ] 添加请求取消
- [ ] 实现请求重试

---

### [ ] 12. 优化首屏加载
**优先级**：低  
**预估时间**：4小时  
**影响**：用户体验、SEO  

**任务**：
- [ ] 实现SSR而不是SSG
- [ ] 添加骨架屏
- [ ] 图片懒加载
- [ ] 移除未使用的依赖

---

## 📊 进度追踪

### ✅ 本周目标 - 已完成
- [x] README.md
- [x] .env.example
- [x] 修复产品ID生成逻辑

### ✅ 本月目标 - 已完成
- [x] 图片优化
- [x] 错误处理
- [x] ESLint & Prettier
- [x] 基础测试（验证构建）

### 🔄 未来目标 - 待完成
- [ ] 数据库迁移
- [ ] 日志系统
- [ ] 图片上传
- [ ] 性能优化

---

## 🎯 优先级说明

### 高优先级 (🔴)
**理由**：
- 阻塞项目正常使用
- 影响新开发者上手
- 影响生产环境部署
- 存在潜在Bug

### 中优先级 (🟡)
**理由**：
- 提升开发效率和代码质量
- 改善性能和用户体验
- 方便团队协作
- 增加测试覆盖率

### 低优先级 (🟢)
**理由**：
- 提升功能和性能
- 优化开发和运维
- 当前功能可稳定运行
- 非紧急需求

---

## 📝 备注

1. **优先级不是固定的**：根据实际需求和资源调整
2. **测试执行顺序**：先核心功能，后边缘场景
3. **回滚计划**：每次改进前做好代码备份
4. **代码审查**：重要改进需要PR流程审查
5. **文档更新**：代码改动同步更新文档

---

## 🔗 相关链接

- Review报告：`PROJECT_REVIEW.md`
- 代码指南：`IMAGE_UPLOAD_GUIDE.md`
- 项目结构：`/src`
- 类型定义：`/data/products.ts`

---

## ✅ 完成总结

### 改进统计

- **总改进项**：8项
- **已完成**：8项 (100%)
- **剩余警告**：7项（非阻塞）

### 构建验证结果

✅ **构建成功**  
✅ **TypeScript类型检查通过**  
✅ **ESLint检查通过（仅警告）**  

### 剩余警告（不影响构建）

1. `<img>` 标签警告（建议使用 Next.js Image）- 4处
2. console 语句警告（生产环境应使用日志系统）- 3处
3. 自定义字体警告（建议在 _document.js 中添加）

这些警告都是优化建议，不影响项目正常运行和构建。

### 新增的 npm 脚本

```bash
npm run dev          # 开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # ESLint检查
npm run lint:fix     # ESLint自动修复
npm run format       # Prettier格式化
npm run format:check # Prettier检查
npm run type-check   # TypeScript类型检查
```

---

**完成日期**：2026-06-30  
**执行状态**：✅ 所有高优先级和中优先级改进已完成
