import { WhatsAppIcon } from '@/components/Icons';
import {
  getWhatsAppContacts,
  isConfiguredSocialLink,
  type SiteContent
} from '@/lib/siteContentTypes';

export function WhatsAppContacts({
  siteContent,
  className = ''
}: {
  siteContent: SiteContent;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-1 text-sm ${className}`}>
      {getWhatsAppContacts(siteContent).map((contact) => {
        const name =
          contact.number === '8618926257367'
            ? 'Jack'
            : contact.number === '8618665055946'
              ? 'Amber'
              : 'WhatsApp';
        return (
          <a
            key={contact.number}
            href={contact.link}
            target='_blank'
            rel='noopener noreferrer'
            title={`Contact ${name} on WhatsApp`}
            className='inline-flex min-h-11 items-center gap-2 rounded-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current'
          >
            <WhatsAppIcon className='h-4 w-4 shrink-0' />
            {name}: {contact.display}
          </a>
        );
      })}
    </div>
  );
}

const socialPlatforms = [
  {
    key: 'facebook',
    label: 'Facebook',
    path: 'M13.5 22v-9h3l.5-3.5h-3.5v-2c0-1 .3-1.5 1.7-1.5H17V2.8A22 22 0 0 0 14.3 2C11.6 2 10 3.7 10 6.8V9.5H7V13h3v9z'
  },
  { key: 'instagram', label: 'Instagram', path: '' },
  {
    key: 'tiktok',
    label: 'TikTok',
    path: 'M16 2h-4v13.5a2.5 2.5 0 1 1-2-2.45V9a6.5 6.5 0 1 0 6 6.5V8.8A9 9 0 0 0 21 10V6a5 5 0 0 1-5-4z'
  }
] as const;

export function SocialLinks({
  siteContent,
  dark = false,
  className = ''
}: {
  siteContent: SiteContent;
  dark?: boolean;
  className?: string;
}) {
  const links = socialPlatforms.filter(({ key }) =>
    isConfiguredSocialLink(siteContent.socialLinks[key])
  );
  if (!links.length) return null;
  return (
    <nav aria-label='Follow Jack Fashion' className={`flex flex-wrap gap-2 ${className}`}>
      {links.map(({ key, label, path }) => (
        <a
          key={key}
          href={siteContent.socialLinks[key]}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`Jack Fashion on ${label}`}
          title={label}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${
            dark
              ? 'border-white/25 text-white/75 hover:border-white/60 hover:text-white'
              : 'border-slate-300 text-slate-600 hover:border-slate-500 hover:text-slate-900'
          }`}
        >
          <svg
            viewBox='0 0 24 24'
            className='h-5 w-5'
            aria-hidden='true'
            fill={key === 'instagram' ? 'none' : 'currentColor'}
          >
            {key === 'instagram' ? (
              <>
                <rect
                  x='3'
                  y='3'
                  width='18'
                  height='18'
                  rx='5'
                  stroke='currentColor'
                  strokeWidth='1.8'
                />
                <circle cx='12' cy='12' r='4' stroke='currentColor' strokeWidth='1.8' />
                <circle cx='17.5' cy='6.5' r='1.1' fill='currentColor' />
              </>
            ) : (
              <path d={path} />
            )}
          </svg>
        </a>
      ))}
    </nav>
  );
}
