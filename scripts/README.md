# scripts/

一次性（one-shot）批量导入 / 转换脚本。这些脚本是本站在建站期用来把本地素材图片转换成站内图片、并把商品数据追加进 `data/products.json` 的临时工具，**不属于运行时代码**，正常部署不需要它们。

注意事项：

- 全部脚本都必须**在项目根目录**执行，例如 `node scripts/bulk-add-psd.mjs`。
- 脚本会**直接改写 `data/products.json`**，运行前请自行提交或备份（部分脚本内部会自动生成 `.bak` 备份）。
- 素材图片目录**不入库**（仓库里没有原始素材）。需要原始素材的脚本通过环境变量 `MATERIALS_DIR` 指定素材目录；未设置时使用仓库外的占位路径 `./materials-not-included`（该目录不存在时脚本会报错退出，这是预期行为）。
- 素材目录里的中文目录名（如 `2026年8月16日 水印图`、`01_TikTok_Reels_节日强钩子_12张`）是素材批次本身的命名，属于输入约定，不是仓库内容。

## 额外依赖：sharp

`convert-watermark-20260809.mjs` 与 `bulk-add-christmas-2026.mjs` 需要 `sharp` 做图片压缩。`package.json` 里**没有声明** sharp（避免把仅供一次性脚本使用的原生依赖装进生产依赖），clone 之后请手动安装（**devDependency**，只在本地跑脚本时需要）：

```bash
npm i -D sharp
```

未安装时这两个脚本会以 `Cannot find package 'sharp'` 失败，其余 4 个脚本不需要额外依赖。

## 用法

```bash
# 需要 sharp 的两个脚本属于这一类：
MATERIALS_DIR=/path/to/raw-materials node scripts/convert-watermark-20260809.mjs
MATERIALS_DIR=/path/to/raw-materials node scripts/bulk-add-christmas-2026.mjs
```

Windows PowerShell 同样可以接受正斜杠路径：

```powershell
$env:MATERIALS_DIR='/path/to/raw-materials'; node scripts/convert-watermark-20260809.mjs
```

## 脚本一览

| 脚本 | 作用 | 输入 | 输出 | 额外依赖 | 幂等 |
| --- | --- | --- | --- | --- | --- |
| `bulk-add-psd.mjs` | 追加 39 款 Plus Size 连衣裙（0708 批次）商品记录 | 已放入 `public/images/products/` 的 `psd0708-*.jpg` / `.png` + `data/products.json` | `data/products.json`（追加） | 无 | 是：slug 已存在则跳过 |
| `bulk-add-psd-0711.mjs` | 追加 43 款 Plus Size 连衣裙（0711 批次）：拷贝图片 + 写记录 | 素材目录 `上新/7月11日`（不入库，需自备同批次图片）+ `data/products.json` | `public/images/products/psd0711-*.jpg` + `data/products.json`（追加） | 无 | 是：slug 去重、目标图片已存在则跳过拷贝 |
| `bulk-add-psd-0716.mjs` | 追加 26 款 Plus Size 连衣裙（0716 批次）：拷贝图片 + 写记录 | 素材目录 `上新/7月16`（不入库，需自备同批次图片）+ `data/products.json` | `public/images/products/psd0716-*.{jpg,png}` + `data/products.json`（追加） | 无 | 是：slug 去重、目标图片已存在则跳过拷贝 |
| `convert-watermark-20260809.mjs` | 把 2026-08/09 的水印拼图 PNG 压缩成 1200px JPEG，并生成首页 banner | `MATERIALS_DIR` 下的 7 个批次目录（`2026年8月16日 水印图` … `2026年9月6日 水印图`）与 `2026年8月11日 水印图` 里的横幅图 | `public/images/products/new-*.jpg`、`public/images/site/wholesale-banner.jpg` | **sharp** | 是：输出文件已存在则跳过 |
| `bulk-add-20260809.mjs` | 为 2026-08-16..2026-09-06 的 306 张 `new-*.jpg` 追加商品记录（旧批次先写，新批次 ID 最大、排在前面） | `public/images/products/new-*.jpg`（需先运行上面的转换脚本）+ `data/products.json` | `data/products.json`（追加）+ 备份 `data/products.json.pre-20260907.bak` | 无 | 是：slug 已存在则跳过 |
| `bulk-add-christmas-2026.mjs` | 80 款 2026 圣诞 / 节日连衣裙：PNG 转 1200px JPEG + 追加商品记录（按素材子目录分组生成文案） | `MATERIALS_DIR` 指向的素材根目录，内含 `01_TikTok_Reels_节日强钩子_12张`、`02_TikTok_Reels_教会家庭端庄_12张` 等子目录及原始 PNG | `public/images/products/xmas-*.jpg` + `data/products.json`（追加）+ 备份 `data/products.json.pre-christmas2026.bak` | **sharp** | 是：slug 去重、输出图片已存在则跳过转换 |

## 运行顺序（2026-08/09 批次）

1. `npm i -D sharp`
2. `MATERIALS_DIR=/path/to/raw-materials node scripts/convert-watermark-20260809.mjs` —— 生成 `public/images/products/new-*.jpg`
3. `node scripts/bulk-add-20260809.mjs` —— 依据图片生成商品数据
