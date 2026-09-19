> 本文档原位于仓库根目录，现归档至 `docs/`。内容为开发期记录，可能早于当前代码实现。

# 📸 图片上传指南

## 📁 目录结构

所有图片都放在 `public/images/` 目录下：

```
public/
└── images/
    ├── products/          # 产品图片
    │   ├── elegant-pleated-maxi-dress.jpg
    │   ├── elegant-pleated-maxi-dress-2.jpg
    │   └── ...
    ├── categories/        # 分类图片
    │   ├── plus-size-dresses.jpg
    │   └── ...
    ├── hero/              # 首页 Hero 背景
    │   └── hero-bg.jpg
    └── about/             # About 页面图片
        └── store.jpg
```

## 🎯 产品图片规范

### 1. 图片命名

使用产品 slug（英文小写 + 连字符）：

```
✅ elegant-pleated-maxi-dress.jpg
✅ two-piece-set-casual.jpg
❌ Elegant Pleated Maxi Dress.jpg (不要空格和大写)
❌ IMG_20240101.jpg (不要随机命名)
```

### 2. 图片尺寸

- **主图**：1200 x 1600 px（3:4 比例）
- **副图**：1200 x 1600 px（同样比例）
- **格式**：JPG 或 WebP（推荐 JPG，兼容性好）
- **文件大小**：每张 < 500KB（可用 TinyPNG 压缩）

### 3. 图片数量

每个产品建议：
- **最少 1 张**主图
- **推荐 3-5 张**（主图 + 细节图 + 不同颜色/角度）

## 📤 上传步骤

### 方法 1：直接复制文件（推荐）

1. **准备图片**
   - 将产品图片重命名为对应的 slug
   - 例如：`elegant-pleated-maxi-dress.jpg`

2. **复制到目录**
   ```bash
   # Windows
   复制图片到项目内的 `public/images/products/` 目录
   
   # Mac/Linux
   cp your-image.jpg public/images/products/elegant-pleated-maxi-dress.jpg
   ```

3. **刷新页面**
   - 浏览器硬刷新（Ctrl + Shift + R）
   - 图片会自动显示

### 方法 2：使用文件管理器

1. 打开项目下的 `public/images/products/` 目录
2. 拖拽图片到文件夹
3. 重命名为产品 slug
4. 刷新浏览器

## 🔧 代码配置

### 1. 产品数据配置

在 `src/data/products.ts` 中，每个产品已有 `image` 和 `images` 字段：

```typescript
{
  id: "1",
  slug: "elegant-pleated-maxi-dress",
  image: "/images/products/elegant-pleated-maxi-dress.jpg",  // 主图
  images: [
    "/images/products/elegant-pleated-maxi-dress.jpg",
    "/images/products/elegant-pleated-maxi-dress-2.jpg",
    "/images/products/elegant-pleated-maxi-dress-3.jpg",
  ],
  // ... 其他字段
}
```

### 2. 图片路径规则

- **主图**：`/images/products/{slug}.jpg`
- **副图**：`/images/products/{slug}-2.jpg`、`{slug}-3.jpg` 等

## 🎨 图片优化建议

### 压缩工具

- **在线**：[TinyPNG](https://tinypng.com/)、[Squoosh](https://squoosh.app/)
- **桌面**：ImageOptim (Mac)、FileOptimizer (Windows)

### 批量重命名脚本

如果你有大量图片，可以用这个脚本批量重命名：

```bash
# 创建脚本文件 rename-images.sh
#!/bin/bash
cd public/images/products

# 示例：将 IMG_xxx.jpg 重命名为产品 slug
mv "IMG_001.jpg" "elegant-pleated-maxi-dress.jpg"
mv "IMG_002.jpg" "two-piece-set-casual.jpg"
# ... 继续添加
```

## 📊 图片清单

以下是当前 12 个产品需要的图片：

| 产品名称 | 主图文件名 | 建议副图数量 |
|---------|-----------|------------|
| Elegant Pleated Maxi Dress | elegant-pleated-maxi-dress.jpg | 2-3 张 |
| Two Piece Set Casual | two-piece-set-casual.jpg | 2-3 张 |
| Plus Size Floral Dress | plus-size-floral-dress.jpg | 2-3 张 |
| African Print Maxi Skirt | african-print-maxi-skirt.jpg | 2-3 张 |
| Elegant Jumpsuit | elegant-jumpsuit.jpg | 2-3 张 |
| Custom Embroidered Dress | custom-embroidered-dress.jpg | 2-3 张 |
| Pleated Midi Dress | pleated-midi-dress.jpg | 2-3 张 |
| Two Piece Formal Set | two-piece-formal-set.jpg | 2-3 张 |
| Plus Size Evening Gown | plus-size-evening-gown.jpg | 2-3 张 |
| African Wax Print Dress | african-wax-print-dress.jpg | 2-3 张 |
| Casual Maxi Dress | casual-maxi-dress.jpg | 2-3 张 |
| Custom Design Blouse | custom-design-blouse.jpg | 2-3 张 |

**总计**：12 张主图 + 24-36 张副图 = 36-48 张图片

## ✅ 检查清单

上传完成后，检查：

- [ ] 所有产品都有主图
- [ ] 图片命名正确（slug 格式）
- [ ] 图片尺寸合适（1200x1600）
- [ ] 图片已压缩（< 500KB）
- [ ] 浏览器硬刷新后图片显示正常
- [ ] 产品详情页图片轮播正常

## 🐛 常见问题

### Q: 图片不显示？

**A**: 
1. 检查图片路径是否正确（区分大小写）
2. 检查图片文件名是否包含空格或特殊字符
3. 浏览器硬刷新（Ctrl + Shift + R）
4. 查看浏览器控制台是否有 404 错误

### Q: 图片太大，加载慢？

**A**:
1. 使用 TinyPNG 压缩图片
2. 调整图片尺寸为 1200x1600（不要更大）
3. 考虑使用 WebP 格式

### Q: 图片变形了？

**A**:
- 确保所有图片都是 3:4 比例（1200x1600）
- 代码已设置 `object-cover` 自动裁剪填充

## 📞 需要帮助？

如果遇到问题，检查：
1. 浏览器控制台（F12）的错误信息
2. 图片文件是否真实存在
3. 文件路径是否正确

---

**提示**：可以先上传 1-2 张测试图片，确认流程正常后再批量上传所有图片。
