'use client';

import { useEffect, type RefObject } from 'react';

const openDialogs: symbol[] = [];
let originalOverflow = '';

/** Nested dialogs share a scroll lock; only the top dialog owns keyboard focus. */
export function useModalDialog(open: boolean, ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const id = Symbol('dialog');
    const previousFocus = document.activeElement as HTMLElement | null;
    if (openDialogs.length === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    openDialogs.push(id);
    const focusable = () => Array.from(ref.current!.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]'
    )).filter((element) => element.getClientRects().length > 0);
    (focusable()[0] || ref.current).focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || openDialogs.at(-1) !== id) return;
      const controls = focusable();
      const first = controls[0];
      const last = controls.at(-1);
      if (!first) {
        event.preventDefault();
        ref.current?.focus();
      } else if (event.shiftKey && (document.activeElement === first || !ref.current?.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !ref.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
      const wasTop = openDialogs.at(-1) === id;
      const index = openDialogs.indexOf(id);
      if (index >= 0) openDialogs.splice(index, 1);
      if (openDialogs.length === 0) document.body.style.overflow = originalOverflow;
      if (wasTop && previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, ref]);
}
