import { describe, expect, test } from 'vitest';
import prompts from '../../data/ai-search-prompts.json';

describe('AI search validation prompt matrix', () => {
  test('contains 18 unique English prompts in the approved 3/5/5/5 groups', () => {
    expect(prompts).toHaveLength(18);
    expect(new Set(prompts.map((item) => item.id)).size).toBe(18);
    expect(new Set(prompts.map((item) => item.prompt)).size).toBe(18);

    const counts = Object.groupBy(prompts, (item) => item.category);
    expect(counts.brand).toHaveLength(3);
    expect(counts.product).toHaveLength(5);
    expect(counts.region).toHaveLength(5);
    expect(counts.due_diligence).toHaveLength(5);
    for (const item of prompts) {
      expect(item.prompt).toMatch(/[A-Za-z]/);
      expect(item.successCriteria.length).toBeGreaterThan(30);
    }
  });
});
