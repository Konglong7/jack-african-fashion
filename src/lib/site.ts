/**
 * 站点基础信息。
 *
 * ⚠️ WhatsApp 号码为 **Demo 示例值**（中国大陆格式的保留示例号），
 * 请勿把它当作可用的真实联系方式；上线前请通过环境变量或后台「站点设置」替换为你自己的号码。
 * 真实号码存放于 data/site-content.json（后台可改），本文件仅作为构建期兜底默认值。
 */
export const SITE = {
  name: 'Jack African Fashion',
  slogan: "Guangzhou Women's Fashion Wholesale for African Market",
  location: 'Guangzhou, China',
  // Demo 值：+86 138 0000 0000
  whatsappNumber: '8613800000000',
  whatsappDisplay: '+86 138 0000 0000',
  business: "Women's Fashion Wholesale"
} as const;
