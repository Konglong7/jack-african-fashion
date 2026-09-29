/**
 * 站点基础信息。
 *
 * Jack African Fashion 的官方联系方式存放在 data/site-content.json；本文件仅提供构建期默认值。
 * 号码和深链接可在后台「站点设置」中维护，所有 CTA 均通过站点配置生成。
 */
export const SITE = {
  name: 'Jack African Fashion',
  slogan: "Guangzhou African Women's Clothing Supplier",
  location: 'Yulong Fashion Plaza, No. 229 Guangyuan Xi Road, Yuexiu District, Guangzhou, China',
  // 官方 WhatsApp 联系方式：+86 189 2625 7367
  whatsappNumber: '8618926257367',
  whatsappDisplay: '+86 189 2625 7367',
  whatsappLink: 'https://wa.me/message/3N5VOJCFAQIGO1',
  business: "Women's Clothing Wholesale Supplier & Factory-Direct Manufacturer for African Markets"
} as const;
