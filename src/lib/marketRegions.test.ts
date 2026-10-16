import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { getMarketRegion, MARKET_REGIONS } from './marketRegions';

const expectedSlugs = [
  'africa',
  'middle-east',
  'europe-north-america',
  'latin-america',
  'southeast-asia'
];

describe('market regions', () => {
  test('provides each supported regional landing page exactly once', () => {
    const slugs = MARKET_REGIONS.map((region) => region.slug);

    expect(slugs).toEqual(expectedSlugs);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test('looks up known slugs without sending unknown routes to another region', () => {
    for (const region of MARKET_REGIONS) {
      expect(getMarketRegion(region.slug)).toBe(region);
    }

    expect(getMarketRegion('unknown-market')).toBeUndefined();
    expect(getMarketRegion('')).toBeUndefined();
    expect(getMarketRegion('Africa')).toBeUndefined();
  });

  test('only recommends categories present in the current product catalog', () => {
    const products = JSON.parse(
      readFileSync(join(process.cwd(), 'data', 'products.json'), 'utf8')
    ) as Array<{ category: string }>;
    const availableCategories = new Set(products.map((product) => product.category));

    expect(availableCategories.size).toBeGreaterThan(0);
    for (const region of MARKET_REGIONS) {
      expect(region.categories.length).toBeGreaterThan(0);
      expect(new Set(region.categories).size).toBe(region.categories.length);
      for (const category of region.categories) {
        expect(availableCategories.has(category), `${region.slug}: ${category}`).toBe(true);
      }
    }
  });

  test('gives every buyer concrete specification and order checks', () => {
    for (const region of MARKET_REGIONS) {
      expect(region.countries.length).toBeGreaterThan(0);
      expect(region.buyingChecks).toHaveLength(3);
      const checks = region.buyingChecks.map((check) => `${check.title} ${check.body}`).join(' ');

      expect(checks).toMatch(/measurements/i);
      expect(checks).toMatch(/lining|opacity|coverage/i);
      expect(checks).toMatch(/MOQ/);
      expect(checks).toMatch(/payment terms/i);
      expect(checks).toMatch(/agent/i);
      expect(checks).toMatch(/export/i);
      expect(checks).toMatch(/confirm|agree/i);
      expect(region.introduction).toMatch(/sourcing enquiries/i);
      expect(region.whatsappMessage).toContain('Jack Fashion');
      expect(region.whatsappMessage).toContain('[country/city]');
      expect(region.whatsappMessage).toContain('[quantity]');
    }
  });

  test('addresses region-specific fit and clothing questions', () => {
    const middleEast = getMarketRegion('middle-east')!;
    const europeNorthAmerica = getMarketRegion('europe-north-america')!;
    const latinAmerica = getMarketRegion('latin-america')!;
    const southeastAsia = getMarketRegion('southeast-asia')!;

    expect(middleEast.buyingChecks[0].body).toMatch(/sleeve length.*neckline.*slit.*lining/i);
    expect(europeNorthAmerica.categories).toContain('Plus Size Dresses');
    expect(europeNorthAmerica.buyingChecks[0].body).toMatch(/size labels are style-specific/i);
    expect(europeNorthAmerica.buyingChecks[0].body).toMatch(/grading between sizes/i);
    expect(latinAmerica.buyingChecks[1].body).toMatch(/rise and inseam for jumpsuits/i);
    expect(southeastAsia.buyingChecks[0].body).toMatch(/fabric weight.*stretch.*lining/i);
  });

  test('keeps enquiries free of unsupported commercial or fulfillment promises', () => {
    const content = JSON.stringify(MARKET_REGIONS);
    const unsupportedClaims = [
      /(?:already|currently|regularly)\s+(?:serve|supply|ship|deliver)/i,
      /(?:trusted by|our customers in|completed orders in)/i,
      /(?:guaranteed|guarantee)\s+(?:sales|profit|delivery|compliance)/i,
      /(?:profit margin|average order value|\bAOV\b|conversion rate|market share)/i,
      /(?:cash on delivery|\bCOD\b|PayPal|Stripe|Klarna)/i,
      /(?:100%|all garments)\s+(?:inspected|checked)/i,
      /(?:delivered|delivery|shipping)\s+(?:within|in)\s+\d+/i,
      /(?:certified|certification|ISO\s*\d|OEKO.TEX)/i,
      /(?:XL|XXL|3XL)\s*(?:=|equals|equivalent to)\s*(?:EU|UK|US)/i,
      /\b(?:abayas?|wedding gowns?|menswear)\b/i
    ];

    for (const claim of unsupportedClaims) {
      expect(content).not.toMatch(claim);
    }
  });
});
