'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = searchParams.get('from') || '/admin';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='bg-brand-cream flex min-h-screen items-center justify-center px-4'>
      <div className='w-full max-w-sm'>
        {/* Logo / Title */}
        <div className='mb-8 text-center'>
          <h1 className='text-brand-black text-2xl font-bold'>Jack African Fashion</h1>
          <p className='text-brand-brown/60 mt-1 text-sm'>Admin Panel</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleSubmit} className='rounded-2xl bg-white p-6 shadow-lg sm:p-8'>
          <h2 className='text-brand-black mb-6 text-center text-lg font-semibold'>
            Sign in to manage your store
          </h2>

          {error && (
            <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600'>
              {error}
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label htmlFor='username' className='text-brand-brown mb-1 block text-sm font-medium'>
                Username
              </label>
              <input
                id='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete='username'
                className='border-brand-sand focus:ring-brand-orange text-brand-black w-full rounded-lg border px-4 py-2.5 focus:border-transparent focus:ring-2 focus:outline-none'
                placeholder='admin'
              />
            </div>

            <div>
              <label htmlFor='password' className='text-brand-brown mb-1 block text-sm font-medium'>
                Password
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='current-password'
                className='border-brand-sand focus:ring-brand-orange text-brand-black w-full rounded-lg border px-4 py-2.5 focus:border-transparent focus:ring-2 focus:outline-none'
                placeholder='••••••••'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='bg-brand-orange hover:bg-brand-gold mt-6 w-full rounded-lg py-3 font-semibold text-white transition-colors disabled:opacity-50'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Back to site */}
        <p className='text-brand-brown/60 mt-6 text-center text-sm'>
          <Link href='/' className='hover:text-brand-orange transition-colors'>
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
