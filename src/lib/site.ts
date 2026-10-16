/**
 * 站点基础信息。
 *
 * Jack Fashion 的官方联系方式存放在 data/site-content.json；本文件仅提供构建期默认值。
 * 号码和深链接可在后台「站点设置」中维护，所有 CTA 均通过站点配置生成。
 */
export const SITE = {
  name: 'Jack Fashion',
  slogan: "Women's Clothing Wholesale · Guangzhou",
  location: 'Yulong Fashion Plaza, No. 229 Guangyuan Xi Road, Yuexiu District, Guangzhou, China',
  // 主联系入口；双账号分流由 data/site-content.json 统一配置。
  whatsappNumber: '8618926257367',
  whatsappDisplay: '+86 189 2625 7367',
  whatsappLink: 'https://wa.me/qr/AMLHEDRK4NQTL1',
  business: "Factory-direct women's clothing wholesale, ready stock and custom production"
} as const;
