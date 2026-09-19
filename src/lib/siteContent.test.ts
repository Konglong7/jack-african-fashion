import { afterEach, describe, expect, it, vi } from 'vitest';

const fsMock = vi.hoisted(() => ({
  readFile: vi.fn(),
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  rename: vi.fn()
}));

vi.mock('fs', () => ({
  promises: fsMock
}));

describe('updateSiteContent', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('writes through a temp file before replacing site-content.json', async () => {
    fsMock.mkdir.mockResolvedValueOnce(undefined);
    fsMock.writeFile.mockResolvedValueOnce(undefined);
    fsMock.rename.mockResolvedValueOnce(undefined);

    const { updateSiteContent } = await import('./siteContent');
    await updateSiteContent({ name: 'Test Store' });

    expect(fsMock.writeFile).toHaveBeenCalledWith(
      expect.stringMatching(/site-content\.json\.tmp$/),
      expect.any(String),
      'utf-8'
    );
    expect(fsMock.rename).toHaveBeenCalledWith(
      expect.stringMatching(/site-content\.json\.tmp$/),
      expect.stringMatching(/site-content\.json$/)
    );
    expect(fsMock.writeFile.mock.invocationCallOrder[0]).toBeLessThan(
      fsMock.rename.mock.invocationCallOrder[0]
    );
  });
});
