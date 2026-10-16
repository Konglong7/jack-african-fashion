import { describe, expect, test } from 'vitest';
import { buildDiscoveryFiles } from './discovery-content.mjs';

const site = {
  name: 'Jack Fashion',
  location: 'Guangzhou verified address',
  whatsappDisplay: '+86 100 2000 3000',
  whatsappLink: 'https://wa.me/message/OFFICIAL'
};

const claims = [
  {
    id: 'name',
    subjectType: 'brand',
    subjectId: 'jack-fashion',
    field: 'name',
    publicValue: 'Jack Fashion',
    status: 'verified',
    evidenceId: 'owner',
    verifiedAt: '2026-10-05'
  },
  {
    id: 'site',
    subjectType: 'brand',
    subjectId: 'jack-fashion',
    field: 'officialWebsite',
    publicValue: 'https://zamique.com',
    status: 'verified',
    evidenceId: 'production',
    verifiedAt: '2026-10-05'
  },
  {
    id: 'blocked-review',
    subjectType: 'customer_case',
    subjectId: '*',
    field: 'review',
    publicValue: 'Thousands of repeat customers',
    status: 'blocked',
    evidenceId: 'none',
    verifiedAt: '2026-10-05'
  }
];

describe('AI discovery text generation', () => {
  test('links only configured social profiles whose dated owner evidence is valid', () => {
    const profile = 'https://www.instagram.com/jack.africanfashion/';
    const unverified = 'https://www.tiktok.com/@unverified';
    const socialSite = { ...site, socialLinks: { instagram: profile, tiktok: unverified } };
    const records = [...claims, {
      id: 'owner-instagram', subjectType: 'brand', subjectId: 'jack-fashion',
      field: 'socialProfile', publicValue: profile, status: 'verified',
      evidenceId: 'owner-provided-profile', verifiedAt: '2026-10-14'
    }];
    const before = buildDiscoveryFiles({ site: socialSite, claims: records, products: [], asOf: '2026-10-13' });
    const after = buildDiscoveryFiles({ site: socialSite, claims: records, products: [], asOf: '2026-10-14' });
    expect(before.llms).not.toContain(profile);
    expect(before.full).not.toContain(profile);
    expect(after.llms).toContain(`](${profile})`);
    expect(after.full).toContain(`](${profile})`);
    expect(after.llms).not.toContain(unverified);
    expect(after.full).not.toContain(unverified);
  });
  test('publishes factory ownership only after its dated evidence is verified', () => {
    const businessClaims = [...claims, {
      id: 'own-factory', subjectType: 'brand', subjectId: 'jack-fashion',
      field: 'businessModel', publicValue: 'Own factory, factory-direct wholesale and custom production.',
      status: 'verified', evidenceId: 'owner-business-card', verifiedAt: '2026-10-12'
    }, {
      id: 'liuhua-showroom', subjectType: 'brand', subjectId: 'jack-fashion',
      field: 'showroomLocation', publicValue: 'Shop 0081, LIUHUA Market, Guangzhou, China',
      status: 'verified', evidenceId: 'owner-business-card', verifiedAt: '2026-10-12'
    }];
    const before = buildDiscoveryFiles({ site, claims: businessClaims, products: [], asOf: '2026-10-11' });
    const after = buildDiscoveryFiles({ site, claims: businessClaims, products: [], asOf: '2026-10-12' });
    expect(before.full).not.toContain('Own factory, factory-direct');
    expect(before.full).not.toContain('Shop 0081');
    expect(after.full).toContain('Own factory, factory-direct wholesale and custom production.');
    expect(after.full).toContain('Shop 0081, LIUHUA Market, Guangzhou, China');
    expect(after.full).not.toContain('Factory ownership, production capacity and certifications are not established');
  });
  test('provides parseable llms.txt file lists and a linked detailed reference', () => {
    const files = buildDiscoveryFiles({ site, claims, products: [], asOf: '2026-10-09' });
    const [introduction, ...sections] = files.llms.split(/^## /m);

    expect(introduction).toMatch(/^# Jack Fashion\n\n?> /);
    expect(sections.length).toBeGreaterThan(0);
    for (const section of sections) {
      const [, ...lines] = section.trim().split('\n');
      const entries = lines.filter((line) => line.trim());
      expect(entries.length).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(entry).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)]+\)(?:: .+)?$/);
      }
    }
    expect(files.llms).toContain('(https://zamique.com/llms-full.txt)');
    expect(files.llms).toContain('(https://wa.me/message/OFFICIAL)');
    expect(files.llms).toContain('(https://zamique.com/wholesale/african-dresses)');
    expect(files.llms).toContain('(https://zamique.com/wholesale/maxi-dresses)');
    expect(files.llms).toContain('(https://zamique.com/wholesale/jumpsuits)');
  });

  test('gives a product directory without turning raw MOQ or stock labels into offers', () => {
    const files = buildDiscoveryFiles({
      site,
      claims,
      products: [{
        id: 'p1', slug: 'print-dress', name: 'Print Dress', category: 'Maxi Dresses',
        moq: 100, stockType: 'Ready Stock'
      }],
      asOf: '2026-10-09'
    });

    expect(files.full).toContain('[Print Dress](https://zamique.com/products/print-dress)');
    expect(files.full).toContain('Style code: p1');
    expect(files.full).toContain('MOQ requires confirmation for each style');
    expect(files.full).not.toContain('Ready Stock');
    expect(files.full).not.toContain('100 pieces');
  });

  test('derives brand, catalog count and categories while withholding unverified MOQ data', () => {
    const files = buildDiscoveryFiles({
      site,
      claims,
      products: [
        { id: 'p1', category: 'Plus Size Dresses', moq: 100 },
        { id: 'p2', category: 'Two Piece Sets', moq: 100 },
        { id: 'p3', category: 'Maxi Dresses', moq: 100 }
      ],
      asOf: '2026-10-05'
    });

    expect(files.llms).toContain('# Jack Fashion');
    expect(files.llms).toContain('3 wholesale styles');
    expect(files.llms).toContain('MOQ requires confirmation for each style');
    expect(files.llms).not.toContain('MOQ 100 pieces per style');
    expect(files.full).toContain('Plus Size Dresses, Two Piece Sets, Maxi Dresses');
    expect(files.llms + files.full).not.toContain('Thousands of repeat customers');
    expect(files.llms + files.full).not.toContain('Brand: Zamique');
  });

  test('publishes only current verified MOQ claims', () => {
    const verifiedClaims = [
      ...claims,
      ...['p1', 'p2'].map((subjectId) => ({
        id: `${subjectId}-moq`,
        subjectType: 'product',
        subjectId,
        field: 'moq',
        publicValue: '80 pcs',
        status: 'verified',
        evidenceId: `${subjectId}-quote`,
        verifiedAt: '2026-10-05'
      }))
    ];
    const files = buildDiscoveryFiles({
      site,
      claims: verifiedClaims,
      products: [
        { id: 'p1', category: 'Plus Size Dresses', moq: 50 },
        { id: 'p2', category: 'Jumpsuits', moq: 100 }
      ],
      asOf: '2026-10-05'
    });

    expect(files.llms).toContain('Verified MOQ: 80 pcs per style');
    expect(files.llms).not.toContain('MOQ 50');
    expect(files.llms).not.toContain('MOQ 100');
  });
});
