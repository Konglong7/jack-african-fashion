export function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
      <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
    </svg>
  );
}

export function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
      <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path d='M5 12h14M12 5l7 7-7 7' />
    </svg>
  );
}

export function ExternalLinkIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path d='M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25' />
    </svg>
  );
}

export function SearchIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <circle cx='11' cy='11' r='8' />
      <path d='m21 21-4.3-4.3' />
    </svg>
  );
}

export function XIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path d='M18 6 6 18M6 6l12 12' />
    </svg>
  );
}

export function MenuIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path d='M3 12h18M3 6h18M3 18h18' />
    </svg>
  );
}

export function UploadIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v12' />
    </svg>
  );
}

export function ImageIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth={1.5}
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' />
    </svg>
  );
}
