import { Instagram, Disc } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

// SoundCloud icon SVG component
const SoundCloudIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.017 0C8.396 0 5.29 2.154 3.594 5.31c-.094.188-.156.375-.188.563-.656-.375-1.406-.563-2.25-.563C.469 5.31 0 5.779 0 6.373v11.25c0 .594.469 1.063 1.156 1.063h10.875c.375 0 .75-.094 1.031-.281 1.125-.75 1.875-2.063 1.875-3.563 0-1.125-.469-2.156-1.219-2.906.281-.656.469-1.406.469-2.156 0-2.625-2.156-4.781-4.781-4.781zm7.594 7.5c-.188 0-.375.094-.563.188-.656-.938-1.688-1.5-2.813-1.5-.375 0-.75.094-1.031.188C14.017 5.625 12.892 5.06 11.642 5.06c-1.969 0-3.563 1.594-3.563 3.563 0 .188 0 .375.094.563-.469.281-.75.844-.75 1.406v4.5c0 .844.656 1.5 1.5 1.5h9.75c1.969 0 3.563-1.594 3.563-3.563 0-1.969-1.594-3.563-3.563-3.563z" />
  </svg>
);

// Bandcamp icon SVG component
const BandcampIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 18.75l7.437-13.5H24l-7.5 13.5H0z" />
  </svg>
);

const socialLinks: SocialLink[] = [
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/orthodoxrecords',
    icon: <SoundCloudIcon className="w-4 h-4" />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/orthodox_records/',
    icon: <Instagram className="w-4 h-4" />,
  },
  {
    name: 'Bandcamp',
    url: 'https://orthodoxrecords.bandcamp.com/artists',
    icon: <BandcampIcon className="w-4 h-4" />,
  },
  {
    name: 'Discogs',
    url: 'https://www.discogs.com/label/3808648-ORTHODOX-Records?page=1',
    icon: <Disc className="w-4 h-4" />,
  },
];

export function SocialLinks() {
  return (
    <div className="mt-16 flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 text-[#444] hover:text-[#050505] transition-colors duration-300"
          >
            <span className="text-[#666] group-hover:text-[#050505] transition-colors duration-300">
              {link.icon}
            </span>
            <span className="relative font-im-fell text-sm uppercase tracking-widest">
              {link.name}
              <span className="absolute left-0 bottom-0 w-full h-px bg-[#050505] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

