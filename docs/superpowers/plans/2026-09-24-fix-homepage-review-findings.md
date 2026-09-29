# 修复首页性能审查问题实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修复本轮首页性能与部署审查发现的问题，同时保留未注册商品素材，不引入无关重构。

**Architecture:** 保留地图的按需加载组件；恢复 Next.js 内部链接默认预取，避免全站点击后才开始加载；在部署打包白名单中显式排除当前未注册的 `0921*.png` 素材。测试改为验证服务端首次渲染结果和部署配置，而不是依赖脆弱的源码计数。

**Tech Stack:** Next.js 15, React 19, TypeScript, Vitest, PowerShell deployment scripts, GNU tar.

**Spec:** 本次会话上一轮审查结果：56 张未注册图片、全站关闭预取、性能测试源码断言不足、相关新增文件格式不符合项目规则。

## Global Constraints

- 不删除或覆盖 `public/images/products/0921001.png` 至 `0921056.png`。
- 不修改产品数据来臆造缺失的名称、分类、MOQ 或销售文案。
- 不格式化整个仓库，只格式化本次新增源码/测试文件。
- 不部署、不上传、不发送外部请求；仅修改本地源码和部署打包规则。

## Review Focus

- 未注册素材不能进入部署包；由部署配置测试和打包清单检查覆盖。
- 内部导航必须保持点击可用且不被强制改成全量禁用预取；由导航策略测试和生产页面导航检查覆盖。
- 地图首次服务端渲染不能创建 iframe；由 React 服务端渲染测试覆盖。
- 地图组件仍必须保留可访问的加载入口和原 iframe 属性；由服务端标记断言与生产浏览器检查覆盖。
- 本次新增文件必须通过 Prettier；由目标文件格式检查覆盖。

### Task 1: 固化失败测试

**Files:**
- Modify: `src/components/homePerformance.test.tsx`
- Create: `vitest.config.ts`

- [x] **Step 1: 将导航测试改为要求恢复默认预取，并增加部署排除规则断言。**
- [x] **Step 2: 将地图测试改为使用 `renderToStaticMarkup` 检查真实首次渲染标记。**
- [x] **Step 3: 运行目标测试并确认因当前源码尚未修复而失败。**

### Task 2: 修复导航与部署打包

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/Categories.tsx`
- Modify: `src/components/home/CustomOrderProcess.tsx`
- Modify: `src/components/home/AboutSnippet.tsx`
- Modify: `src/components/home/BlogTips.tsx`
- Modify: `deploy/pack.ps1`

- [x] **Step 1: 删除本次加入的全站 `prefetch={false}`，恢复 Next.js 默认导航预取。**
- [x] **Step 2: 在部署打包命令中排除当前未注册的 `public/images/products/0921*.png`，保留工作区素材。**
- [x] **Step 3: 运行目标测试，确认导航和部署规则通过。**

### Task 3: 清理新增文件格式并回归验证

**Files:**
- Modify: `src/components/DeferredMapEmbed.tsx`
- Modify: `src/components/homePerformance.test.tsx`

- [x] **Step 1: 仅格式化本次新增的两个文件。**
- [x] **Step 2: 运行完整 Vitest、TypeScript、ESLint 和生产构建。**
- [x] **Step 3: 启动本地生产服务，验证首页初始无 iframe、点击后加载地图、内部导航仍可用。**
- [x] **Step 4: 检查部署包清单逻辑和工作树，确认没有删除用户素材或产生无关改动。**
