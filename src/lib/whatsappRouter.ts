/**
 * WhatsApp Sales Multi-Account Dispatch Router
 * Jack African Fashion Independent Website Upgrade
 *
 * Implements Virtual WhatsApp Receptionist Matrix:
 * - 5+ specialized regional and domain trade advisors (+ Jack)
 * - Secret consolidation: ALL links strictly resolve to +86 189 2625 7367 (8618926257367)
 * - Magic pre-filled greeting text tailored to each representative
 * - Safe URL query / hash normalization and alias resolution
 */

export interface SalesAccount {
  id: string;
  name: string;
  title: string;
  chineseTitle: string;
  desk: string;
  region: string;
  status: 'online' | 'fast_reply';
  avatarText: string;
  avatarInitials: string;
  tags: string[];
  highlightKeywords: string[];
  number: string;
  defaultGreeting: string;
}

export type WhatsAppSalesRepresentative = SalesAccount;

export interface ResolvedSalesAccount extends SalesAccount {
  key: string;
  account: SalesAccount;
  rep: SalesAccount;
  waLink: string;
  matched: boolean;
}

/**
 * The single consolidated WhatsApp phone number for Jack African Fashion.
 * All representatives secretly route to this line.
 */
export const CONSOLIDATED_WHATSAPP_NUMBER = '8618926257367';
export const WHATSAPP_CONSOLIDATED_NUMBER = '8618926257367';
export const SHOWROOM_DIRECT_PHONE = '+86 189 2625 7367';
export const JACK_WHATSAPP_LINK = 'https://wa.me/message/3N5VOJCFAQIGO1';
export const JACK_WHATSAPP_MESSAGE_CODE = '3N5VOJCFAQIGO1';

/**
 * 6 Specialized Foreign Trade Representatives Catalog
 */
const GRACE_ADELE: SalesAccount = {
  id: 'grace-adele',
  name: 'Grace Adele',
  title: 'West Africa Desk: Nigeria, Ghana',
  chineseTitle: '尼日利亚/加纳大客户专线',
  desk: 'West Africa Desk',
  region: 'Nigeria, Ghana, West Africa',
  status: 'online',
  avatarText: 'GA',
  avatarInitials: 'GA',
  tags: ['Nigeria & Ghana', 'VIP Wholesale', 'Lagos Freight'],
  highlightKeywords: [
    'grace',
    'grace-adele',
    'adele',
    'west-africa',
    'westafrica',
    'nigeria',
    'ghana',
    'lagos',
    'accra',
    '格蕾丝'
  ],
  number: CONSOLIDATED_WHATSAPP_NUMBER,
  defaultGreeting:
    "Hello Grace, I found Jack African Fashion via official website. I'm looking for wholesale styles for the West African market (Nigeria & Ghana). Please share your latest catalog and MOQ details."
};

const DAVID_CHEN: SalesAccount = {
  id: 'david-chen',
  name: 'David Chen',
  title: 'East & South Africa Desk: Kenya, South Africa',
  chineseTitle: '东非南非专员',
  desk: 'East & South Africa Desk',
  region: 'Kenya, South Africa, East & Southern Africa',
  status: 'fast_reply',
  avatarText: 'DC',
  avatarInitials: 'DC',
  tags: ['Kenya & South Africa', 'Regional Sizing', 'Air Cargo'],
  highlightKeywords: [
    'david',
    'david-chen',
    'chen',
    'east-africa',
    'eastafrica',
    'south-africa',
    'southafrica',
    'kenya',
    'nairobi',
    'tanzania',
    'johannesburg',
    '大卫',
    '陈大卫'
  ],
  number: CONSOLIDATED_WHATSAPP_NUMBER,
  defaultGreeting:
    "Hello David, I found Jack African Fashion via official website. I'm interested in wholesale clothing for East & Southern Africa. Please send price list and shipment info."
};

const CHLOE_LIN: SalesAccount = {
  id: 'chloe-lin',
  name: 'Chloe Lin',
  title: 'OEM & Custom Sampling Lead',
  chineseTitle: '柔性打样、定制打版主管',
  desk: 'OEM & Custom Sampling Lead',
  region: 'Global Custom / Private Label / Boutiques',
  status: 'online',
  avatarText: 'CL',
  avatarInitials: 'CL',
  tags: ['3-Day Sampling', 'OEM/ODM Tech Packs', 'Flexible MOQ'],
  highlightKeywords: [
    'chloe',
    'chloe-lin',
    'lin',
    'oem',
    'odm',
    'custom',
    'sampling',
    'pattern',
    'techpack',
    'tech-pack',
    'sample',
    '克洛伊',
    '林克洛伊'
  ],
  number: CONSOLIDATED_WHATSAPP_NUMBER,
  defaultGreeting:
    'Hello Chloe, I found Jack African Fashion via official website. I would like to inquire about OEM custom sampling, tech packs, and flexible production.'
};

const SARAH_WU: SalesAccount = {
  id: 'sarah-wu',
  name: 'Sarah Wu',
  title: 'Ready-to-Ship Wholesale Desk',
  chineseTitle: '现货批发与极速出货专员',
  desk: 'Ready-to-Ship Wholesale Desk',
  region: 'Fast-turnaround Boutiques & Urgent Restocks',
  status: 'online',
  avatarText: 'SW',
  avatarInitials: 'SW',
  tags: ['Warehouse Stock', '48h Dispatch', 'Low MOQ 5 pcs'],
  highlightKeywords: [
    'sarah',
    'sarah-wu',
    'wu',
    'wholesale',
    'ready-to-ship',
    'ready_to_ship',
    'readystock',
    'ready-stock',
    'stock',
    '现货',
    '批发',
    '莎拉',
    '吴莎拉'
  ],
  number: CONSOLIDATED_WHATSAPP_NUMBER,
  defaultGreeting:
    'Hello Sarah, I found Jack African Fashion via official website. I am looking for ready-to-ship wholesale stock and immediate dispatch inventory.'
};

const LUCAS_ZHAO: SalesAccount = {
  id: 'lucas-zhao',
  name: 'Lucas Zhao',
  title: 'Cargo & Logistics Coordinator',
  chineseTitle: '广州出海货代清关专家',
  desk: 'Cargo & Logistics Coordinator',
  region: 'Port of Guangzhou to All African Ports',
  status: 'fast_reply',
  avatarText: 'LZ',
  avatarInitials: 'LZ',
  tags: ['Port Clearance', 'Cargo Consolidation', 'Door-to-Door'],
  highlightKeywords: [
    'lucas',
    'lucas-zhao',
    'zhao',
    'cargo',
    'logistics',
    'shipping',
    'freight',
    'clearance',
    'forwarding',
    'aircargo',
    'seafreight',
    '海运',
    '货代',
    '清关',
    '卢卡斯',
    '赵卢卡斯'
  ],
  number: CONSOLIDATED_WHATSAPP_NUMBER,
  defaultGreeting:
    'Hello Lucas, I found Jack African Fashion via official website. I need assistance regarding Guangzhou shipping, cargo consolidation, and freight forwarding to Africa.'
};

const JACK_DIRECTOR: SalesAccount = {
  id: 'jack',
  name: 'Jack',
  title: 'Showroom Director & Founder',
  chineseTitle: '广州展厅总负责人',
  desk: 'Showroom & Executive Sourcing',
  region: 'Guangzhou Yulong Showroom & Container Orders',
  status: 'online',
  avatarText: 'JF',
  avatarInitials: 'JF',
  tags: ['Showroom Visits', 'Container Orders', 'Factory Direct'],
  highlightKeywords: [
    'jack',
    'owner',
    'director',
    'showroom',
    'founder',
    'yulong',
    'factory',
    '玉龙',
    '展厅',
    '杰克'
  ],
  number: CONSOLIDATED_WHATSAPP_NUMBER,
  defaultGreeting:
    'Hello Jack, I found Jack African Fashion via official website. I would like to arrange a Guangzhou showroom visit and discuss bulk factory-direct purchasing.'
};

/**
 * Array of 5+ foreign trade representatives for Jack African Fashion
 */
export const AFRICAN_FASHION_SALES_ACCOUNTS: SalesAccount[] = [
  GRACE_ADELE,
  DAVID_CHEN,
  CHLOE_LIN,
  SARAH_WU,
  LUCAS_ZHAO,
  JACK_DIRECTOR
];

/**
 * Lookup map for all accounts by canonical ID and short keys
 */
export const SALES_REPRESENTATIVES: Record<string, SalesAccount> = {
  'grace-adele': GRACE_ADELE,
  grace: GRACE_ADELE,
  'david-chen': DAVID_CHEN,
  david: DAVID_CHEN,
  'chloe-lin': CHLOE_LIN,
  chloe: CHLOE_LIN,
  'sarah-wu': SARAH_WU,
  sarah: SARAH_WU,
  'lucas-zhao': LUCAS_ZHAO,
  lucas: LUCAS_ZHAO,
  jack: JACK_DIRECTOR
};

/**
 * Alias mapping engine for URL query parameter (?sales=xxx) and hash fragments
 */
export const AFRICAN_FASHION_SALES_ALIASES: Record<string, string> = {
  // Grace Adele aliases
  grace: 'grace-adele',
  'grace-adele': 'grace-adele',
  adele: 'grace-adele',
  'west-africa': 'grace-adele',
  'west_africa': 'grace-adele',
  westafrica: 'grace-adele',
  nigeria: 'grace-adele',
  ghana: 'grace-adele',
  lagos: 'grace-adele',
  accra: 'grace-adele',
  格蕾丝: 'grace-adele',

  // David Chen aliases
  david: 'david-chen',
  'david-chen': 'david-chen',
  chen: 'david-chen',
  'east-africa': 'david-chen',
  'east_africa': 'david-chen',
  eastafrica: 'david-chen',
  'south-africa': 'david-chen',
  'south_africa': 'david-chen',
  southafrica: 'david-chen',
  kenya: 'david-chen',
  nairobi: 'david-chen',
  tanzania: 'david-chen',
  johannesburg: 'david-chen',
  大卫: 'david-chen',
  陈大卫: 'david-chen',

  // Chloe Lin aliases
  chloe: 'chloe-lin',
  'chloe-lin': 'chloe-lin',
  lin: 'chloe-lin',
  oem: 'chloe-lin',
  odm: 'chloe-lin',
  custom: 'chloe-lin',
  sampling: 'chloe-lin',
  pattern: 'chloe-lin',
  techpack: 'chloe-lin',
  'tech-pack': 'chloe-lin',
  sample: 'chloe-lin',
  克洛伊: 'chloe-lin',
  林克洛伊: 'chloe-lin',

  // Sarah Wu aliases
  sarah: 'sarah-wu',
  'sarah-wu': 'sarah-wu',
  wu: 'sarah-wu',
  wholesale: 'sarah-wu',
  'ready-to-ship': 'sarah-wu',
  'ready_to_ship': 'sarah-wu',
  readystock: 'sarah-wu',
  'ready-stock': 'sarah-wu',
  stock: 'sarah-wu',
  现货: 'sarah-wu',
  批发: 'sarah-wu',
  莎拉: 'sarah-wu',
  吴莎拉: 'sarah-wu',

  // Lucas Zhao aliases
  lucas: 'lucas-zhao',
  'lucas-zhao': 'lucas-zhao',
  zhao: 'lucas-zhao',
  cargo: 'lucas-zhao',
  logistics: 'lucas-zhao',
  shipping: 'lucas-zhao',
  freight: 'lucas-zhao',
  clearance: 'lucas-zhao',
  forwarding: 'lucas-zhao',
  aircargo: 'lucas-zhao',
  seafreight: 'lucas-zhao',
  海运: 'lucas-zhao',
  货代: 'lucas-zhao',
  清关: 'lucas-zhao',
  卢卡斯: 'lucas-zhao',
  赵卢卡斯: 'lucas-zhao',

  // Jack aliases
  jack: 'jack',
  owner: 'jack',
  director: 'jack',
  showroom: 'jack',
  founder: 'jack',
  yulong: 'jack',
  factory: 'jack',
  玉龙: 'jack',
  展厅: 'jack',
  杰克: 'jack'
};

export const SALES_ALIASES = AFRICAN_FASHION_SALES_ALIASES;

/**
 * Normalizes input sales key from URL search query or hash
 */
export function normalizeSalesKey(rawKey?: string | null): string {
  if (!rawKey) return '';
  let cleaned = rawKey;
  // Strip leading ?, #, sales= if user passed raw query string
  cleaned = cleaned.replace(/^[?#]/, '');
  if (cleaned.toLowerCase().startsWith('sales=')) {
    cleaned = cleaned.slice(6);
  }
  try {
    return decodeURIComponent(cleaned).trim().toLowerCase();
  } catch {
    return cleaned.trim().toLowerCase();
  }
}

/**
 * Builds a magic WhatsApp link routing secretly to CONSOLIDATED_WHATSAPP_NUMBER.
 * Injects personalized greeting formula for the specified representative.
 */
export function buildWhatsAppLink(
  accountOrRep?: SalesAccount | string | null,
  customContext?: string
): string {
  let account: SalesAccount;
  if (!accountOrRep) {
    account = AFRICAN_FASHION_SALES_ACCOUNTS[0];
  } else if (typeof accountOrRep === 'string') {
    account = resolveSalesAccount(accountOrRep);
  } else {
    account = accountOrRep;
  }

  let text = account.defaultGreeting;

  if (customContext && customContext.trim()) {
    const trimmed = customContext.trim();
    if (
      trimmed.includes(account.name) ||
      trimmed.startsWith('Hello') ||
      trimmed.startsWith('Hi') ||
      trimmed.startsWith('Dear')
    ) {
      text = trimmed;
    } else {
      text = `${account.defaultGreeting}\n\n[Inquiry Reference]: ${trimmed}`;
    }
  }

  if (!text || !text.trim()) {
    return JACK_WHATSAPP_LINK;
  }

  return `https://wa.me/message/${JACK_WHATSAPP_MESSAGE_CODE}?text=${encodeURIComponent(text)}`;
}

export const buildMagicWhatsAppLink = buildWhatsAppLink;

/**
 * Resolves sales representative from a query key (e.g. 'grace', 'david', 'oem', 'lagos').
 * Returns a composite ResolvedSalesAccount that satisfies both direct SalesAccount property
 * access and { key, account, waLink, matched } destructured access.
 */
export function resolveSalesAccount(
  queryKey?: string | null,
  accounts: SalesAccount[] = AFRICAN_FASHION_SALES_ACCOUNTS,
  aliases: Record<string, string> = AFRICAN_FASHION_SALES_ALIASES,
  defaultId = 'grace-adele'
): ResolvedSalesAccount {
  const normalized = normalizeSalesKey(queryKey);
  const defaultAccount =
    accounts.find((a) => a.id === defaultId) || accounts[0];

  if (!normalized) {
    return {
      ...defaultAccount,
      key: defaultAccount.id,
      account: defaultAccount,
      rep: defaultAccount,
      waLink: buildWhatsAppLink(defaultAccount),
      matched: false
    };
  }

  // 1. Check direct account id match
  let targetAccount = accounts.find((a) => a.id.toLowerCase() === normalized);

  // 2. Check alias map match
  if (!targetAccount && aliases[normalized]) {
    const resolvedId = aliases[normalized];
    targetAccount = accounts.find((a) => a.id.toLowerCase() === resolvedId);
  }

  // 3. Check highlight keywords match
  if (!targetAccount) {
    targetAccount = accounts.find((a) =>
      a.highlightKeywords.some((kw) => kw.toLowerCase() === normalized)
    );
  }

  // 4. Check name contains match
  if (!targetAccount) {
    targetAccount = accounts.find((a) =>
      a.name.toLowerCase().includes(normalized)
    );
  }

  if (targetAccount) {
    return {
      ...targetAccount,
      key: targetAccount.id,
      account: targetAccount,
      rep: targetAccount,
      waLink: buildWhatsAppLink(targetAccount),
      matched: true
    };
  }

  // Fallback to default
  return {
    ...defaultAccount,
    key: defaultAccount.id,
    account: defaultAccount,
    rep: defaultAccount,
    waLink: buildWhatsAppLink(defaultAccount),
    matched: false
  };
}

/**
 * Helper returning structured { key, rep, waLink } for analysis parity
 */
export function resolveSalesRepresentative(queryKey?: string | null): {
  key: string | null;
  rep: SalesAccount | null;
  waLink: string;
} {
  const resolved = resolveSalesAccount(queryKey);
  return {
    key: resolved.matched ? resolved.id : null,
    rep: resolved.matched ? resolved : null,
    waLink: resolved.waLink
  };
}

/**
 * Client-side browser inspection for ?sales= or #sales
 */
export function getActiveSalesFromBrowser(): ResolvedSalesAccount {
  if (typeof window === 'undefined') {
    return resolveSalesAccount(null);
  }
  try {
    const url = new URL(window.location.href);
    const queryKey = url.searchParams.get('sales');
    const hash = url.hash.replace(/^#/, '');
    const hashKey = hash.startsWith('sales=') ? hash.slice(6) : hash;
    return resolveSalesAccount(queryKey || hashKey || null);
  } catch {
    return resolveSalesAccount(null);
  }
}
