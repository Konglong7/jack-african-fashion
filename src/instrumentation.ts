export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (process.env.JACK_FASHION_INDEXNOW_ENABLED !== '1') {
      return;
    }
    const state = globalThis as typeof globalThis & {
      jackIndexNowTimer?: ReturnType<typeof setInterval>;
    };
    if (state.jackIndexNowTimer) return;
    const [{ flushIndexNow }, { getProducts }, { reconcileProductIndexNow }] = await Promise.all([
      import('./lib/indexNow'),
      import('./lib/db'),
      import('./lib/productPublication')
    ]);
    await reconcileProductIndexNow(await getProducts()).catch(() =>
      console.error('Product IndexNow reconciliation requires an administrator check.')
    );
    state.jackIndexNowTimer = setInterval(() => {
      void flushIndexNow().catch(() =>
        console.error('IndexNow retry requires an administrator check.')
      );
    }, 300_000);
    state.jackIndexNowTimer.unref();
  }
}
