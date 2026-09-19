'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { buildNavLinks } from '@/lib/siteNavigation';
import type { SiteContent } from '@/lib/siteContentTypes';
import { siteWhatsAppLink } from '@/lib/siteContentTypes';
import { WhatsAppIcon, SearchIcon } from '@/components/Icons';
import { getInquiryItemCount, INQUIRY_UPDATED_EVENT } from '@/lib/inquiry';

export function AnnouncementBar({ siteContent }: { siteContent: SiteContent }) {
  const whatsappLink = siteWhatsAppLink(siteContent);

  return (
    <div className='bg-brand-black text-brand-cream text-xs sm:text-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:justify-between'>
        <p className='truncate tracking-wide text-left sm:text-left'>
          Wholesale Women&apos;s Fashion from Guangzhou · Ready Stock &amp; Custom Orders
        </p>
        <a
          href={whatsappLink}
          target='_blank'
          rel='noopener noreferrer'
          className='text-brand-gold inline-flex shrink-0 items-center gap-1.5 font-medium whitespace-nowrap transition-colors hover:text-white'
        >
          <WhatsAppIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
          WhatsApp Us
        </a>
      </div>
    </div>
  );
}

export function Header({ siteContent }: { siteContent: SiteContent }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [drawerSearch, setDrawerSearch] = useState('');
  const whatsappLink = siteWhatsAppLink(siteContent);
  const navLinks = buildNavLinks(siteContent.categories);
  const desktopNavLinks = [
    { label: 'Catalog', href: '/catalog' },
    { label: 'New Arrivals', href: '/catalog?sort=newest' },
    { label: 'Custom Orders', href: '/custom-orders' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function updateCount() {
      setInquiryCount(getInquiryItemCount(localStorage));
    }
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener(INQUIRY_UPDATED_EVENT, updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener(INQUIRY_UPDATED_EVENT, updateCount);
    };
  }, []);

  function handleDrawerSearch(e: React.FormEvent) {
    e.preventDefault();
    if (drawerSearch.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(drawerSearch.trim())}`);
      setMenuOpen(false);
      setDrawerSearch('');
    }
  }

  function isLinkActive(href: string) {
    if (href === '/') return pathname === '/';
    if (href.includes('?')) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className='sticky top-0 z-50' role='banner'>
      <AnnouncementBar siteContent={siteContent} />
      <motion.div
        className={`border-brand-sand/60 border-b backdrop-blur transition-colors duration-300 ${
          scrolled ? 'bg-white/98 shadow-sm' : 'bg-white/95'
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className='mx-auto max-w-7xl px-4'>
          <div className='flex h-16 items-center justify-between lg:h-20'>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link
                href='/'
                className='group flex flex-col leading-none'
                onClick={() => setMenuOpen(false)}
              >
                <motion.span
                  className='font-display text-brand-black text-lg font-bold tracking-tight sm:text-xl'
                  whileHover={{ scale: 1.02 }}
                >
                  Jack
                </motion.span>
                <motion.span
                  className='text-brand-brown text-[10px] tracking-[0.2em] uppercase sm:text-xs'
                  animate={{
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  African Fashion
                </motion.span>
              </Link>
            </motion.div>

            {/* Desktop nav */}
            <motion.nav
              className='hidden items-center gap-4 md:flex lg:gap-7'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {desktopNavLinks.map((link, i) => {
                const active = isLinkActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`group relative text-sm font-medium transition-colors ${
                        active
                          ? 'text-brand-orange font-semibold'
                          : 'text-brand-brown hover:text-brand-orange'
                      }`}
                    >
                      {link.label}
                      <motion.span
                        className='bg-brand-orange absolute -bottom-1 left-0 h-0.5'
                        initial={{ width: active ? '100%' : 0 }}
                        animate={{ width: active ? '100%' : 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.25 }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Right actions */}
            <motion.div
              className='flex items-center gap-2 sm:gap-4'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href='/catalog'
                  className='text-brand-brown hover:text-brand-orange flex p-1.5 transition-colors sm:p-2'
                  aria-label='Search products'
                >
                  <SearchIcon className='h-5 w-5' />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href='/inquiry'
                  className='text-brand-brown hover:text-brand-orange relative flex p-1.5 transition-colors sm:p-2'
                  aria-label={
                    inquiryCount > 0
                      ? `Inquiry cart (${inquiryCount} items)`
                      : 'Inquiry cart'
                  }
                  title='Inquiry list'
                >
                  <svg
                    className='h-5 w-5'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    viewBox='0 0 24 24'
                  >
                    <path d='M6 6h15l-1.5 9h-12L6 6Z' />
                    <path d='M6 6 5.25 3H3' />
                    <circle cx='9' cy='20' r='1' />
                    <circle cx='18' cy='20' r='1' />
                  </svg>
                  {inquiryCount > 0 && (
                    <span className='bg-brand-orange absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-sm ring-1 ring-white'>
                      {inquiryCount}
                    </span>
                  )}
                </Link>
              </motion.div>

              <motion.a
                href={whatsappLink}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-brand-orange hover:bg-brand-gold hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-colors sm:inline-flex'
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <WhatsAppIcon className='h-4 w-4' />
                WhatsApp
              </motion.a>

              {/* Mobile menu button */}
              <motion.button
                className='text-brand-black -mr-2 p-2 md:hidden'
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label='Toggle menu'
                aria-expanded={menuOpen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode='wait'>
                  {menuOpen ? (
                    <motion.svg
                      key='close'
                      className='h-6 w-6'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      viewBox='0 0 24 24'
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path d='M18 6 6 18M6 6l12 12' />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key='menu'
                      className='h-6 w-6'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      viewBox='0 0 24 24'
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path d='M3 12h18M3 6h18M3 18h18' />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className='border-brand-sand/60 border-b bg-white shadow-lg md:hidden'
            role='dialog'
            aria-modal='true'
            aria-label='Mobile navigation menu'
            onClick={(e) => e.stopPropagation()}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <nav className='flex flex-col px-4 py-3'>
              {/* Quick Search inside Drawer */}
              <form onSubmit={handleDrawerSearch} className='relative mb-2'>
                <input
                  type='text'
                  placeholder='Search styles, dresses, tags...'
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  className='border-brand-sand bg-brand-cream/50 placeholder:text-brand-brown/40 text-brand-black focus:border-brand-orange w-full rounded-full border py-2.5 pr-4 pl-10 text-sm focus:outline-none'
                />
                <SearchIcon className='text-brand-brown/40 absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2' />
              </form>

              {navLinks.map((link, i) => {
                const active = isLinkActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className={`hover:bg-brand-cream/50 border-brand-sand/30 block rounded-lg border-b px-2 py-3 text-sm transition-colors last:border-0 ${
                        active
                          ? 'text-brand-orange bg-brand-cream/30 font-bold'
                          : 'text-brand-brown hover:text-brand-orange font-medium'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.a
                href={whatsappLink}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-brand-orange mt-3 inline-flex items-center justify-center gap-2 rounded-full py-3 font-semibold text-white'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <WhatsAppIcon className='h-5 w-5' />
                Contact on WhatsApp
              </motion.a>
              <motion.p
                className='text-brand-brown/60 mt-3 text-center text-xs'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {siteContent.whatsappDisplay}
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
