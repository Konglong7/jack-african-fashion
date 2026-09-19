'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page renders without sidebar
  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className='bg-brand-cream min-h-screen'>
      {/* Mobile header */}
      <header className='border-brand-sand sticky top-0 z-40 border-b bg-white lg:hidden'>
        <div className='flex items-center justify-between px-4 py-3'>
          <Link href='/admin' className='text-brand-black font-bold'>
            Jack Admin
          </Link>
          <MobileNav pathname={pathname} />
        </div>
      </header>

      {/* Desktop sidebar + content */}
      <div className='lg:flex'>
        {/* Sidebar */}
        <aside className='border-brand-sand hidden border-r bg-white lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col'>
          <div className='flex flex-1 flex-col'>
            {/* Logo */}
            <div className='border-brand-sand border-b px-6 py-6'>
              <Link href='/admin' className='font-display text-brand-black text-xl font-bold'>
                Jack Admin
              </Link>
              <p className='text-brand-brown/60 mt-0.5 text-xs'>Product Management</p>
            </div>

            {/* Nav links */}
            <nav className='flex-1 space-y-1 px-3 py-4'>
              <NavLink href='/admin' pathname={pathname} icon='home'>
                Dashboard
              </NavLink>
              <NavLink href='/admin/products' pathname={pathname} icon='box'>
                Products
              </NavLink>
              <NavLink href='/admin/upload' pathname={pathname} icon='upload'>
                Upload Images
              </NavLink>
              <NavLink href='/admin/settings' pathname={pathname} icon='settings'>
                Settings
              </NavLink>
            </nav>

            {/* Bottom actions */}
            <div className='border-brand-sand space-y-2 border-t px-3 py-4'>
              <Link
                href='/'
                target='_blank'
                className='text-brand-brown hover:text-brand-orange flex items-center gap-2 px-3 py-2 text-sm transition-colors'
              >
                <IconExternalLink />
                View Website
              </Link>
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className='flex-1 lg:pl-64'>
          <div className='p-4 sm:p-6 lg:p-8'>{children}</div>
        </main>
      </div>
    </div>
  );
}

// ── Components ───────────────────────────────────────────────────────

function NavLink({
  href,
  pathname,
  icon,
  children
}: {
  href: string;
  pathname: string;
  icon: 'home' | 'box' | 'upload' | 'settings';
  children: React.ReactNode;
}) {
  const active = pathname === href || pathname.startsWith(href + '/');
  const icons = {
    home: <IconHome />,
    box: <IconBox />,
    upload: <IconUpload />,
    settings: <IconSettings />
  };
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-brand-orange text-white' : 'text-brand-brown hover:bg-brand-sand/50'
      }`}
    >
      {icons[icon]}
      {children}
    </Link>
  );
}

function MobileNav({ pathname: pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className='text-brand-brown hover:text-brand-black p-2'
      >
        {open ? <IconClose /> : <IconMenu />}
      </button>
      {open && (
        <div className='border-brand-sand absolute inset-x-0 top-full border-b bg-white shadow-lg'>
          <nav className='space-y-2 p-4'>
            <MobileNavLink href='/admin' pathname={pathname} onClick={() => setOpen(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink
              href='/admin/products'
              pathname={pathname}
              onClick={() => setOpen(false)}
            >
              Products
            </MobileNavLink>
            <MobileNavLink href='/admin/upload' pathname={pathname} onClick={() => setOpen(false)}>
              Upload Images
            </MobileNavLink>
            <MobileNavLink
              href='/admin/settings'
              pathname={pathname}
              onClick={() => setOpen(false)}
            >
              Settings
            </MobileNavLink>
            <hr className='border-brand-sand' />
            <Link
              href='/'
              target='_blank'
              className='text-brand-brown block px-3 py-2 text-sm'
              onClick={() => setOpen(false)}
            >
              View Website →
            </Link>
            <LogoutButton />
          </nav>
        </div>
      )}
    </>
  );
}

function MobileNavLink({
  href,
  pathname,
  onClick,
  children
}: {
  href: string;
  pathname: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const active = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-lg px-3 py-2 text-sm font-medium ${
        active ? 'bg-brand-orange text-white' : 'text-brand-brown hover:bg-brand-sand/50'
      }`}
    >
      {children}
    </Link>
  );
}

function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className='text-brand-brown flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:text-red-600 disabled:opacity-50'
    >
      <IconLogout />
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}

// ── Icons ────────────────────────────────────────────────────────────

function IconHome() {
  return (
    <svg
      className='h-5 w-5'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
    >
      <path d='M2.25 12l8.25-8.25m0 0l8.25 8.25M10.5 3.75v16.5m0-16.5h6m-6 16.5h6m3-3h3m-3 0v6m0-6l-3 3m3-3l3 3' />
    </svg>
  );
}

function IconBox() {
  return (
    <svg
      className='h-5 w-5'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
    >
      <path d='M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg
      className='h-5 w-5'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
    >
      <path d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v12' />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg
      className='h-5 w-5'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
    >
      <path d='M10.5 6h9.75M10.5 6a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 10-4.5 0M3.75 6H6m4.5 12h9.75m-9.75 0a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 10-4.5 0m-2.25 0H3.75m14.25-6h2.25m-2.25 0a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 10-4.5 0M3.75 12h9.75' />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg
      className='h-5 w-5'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
    >
      <path d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75' />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg
      className='h-6 w-6'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
    >
      <path d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      className='h-6 w-6'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
    >
      <path d='M6 18L18 6M6 6l12 12' />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg
      className='h-5 w-5'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
    >
      <path d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25' />
    </svg>
  );
}
