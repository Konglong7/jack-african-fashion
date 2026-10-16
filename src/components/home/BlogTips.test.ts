import { describe, expect, test } from 'vitest';
import { BLOG_POSTS } from './BlogTips';

describe('homepage buying guide cards', () => {
  test('each card links to its matching guide instead of a shared placeholder', () => {
    expect(BLOG_POSTS.map((post) => post.href)).toEqual([
      '/guides/size-color-ratios',
      '/guides/ready-stock-custom-orders',
      '/guides/wholesale-moq'
    ]);
    expect(new Set(BLOG_POSTS.map((post) => post.href)).size).toBe(BLOG_POSTS.length);
  });

  test('does not describe unverified factory pricing as a published offer', () => {
    expect(JSON.stringify(BLOG_POSTS)).not.toMatch(/factory prices?/i);
  });
});
