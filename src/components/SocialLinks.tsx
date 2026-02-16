import { Instagram, Disc } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

// SoundCloud icon SVG component
// Official SoundCloud logo from SVG Repo
const SoundCloudIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M.672 13.055L1 11.654l-.328-1.447c-.009-.043-.092-.076-.191-.076-.102 0-.184.033-.191.076L0 11.654l.289 1.4c.008.045.09.076.191.076.1.001.183-.03.192-.075zm2.051.777L3 11.668 2.723 8.32c-.009-.084-.114-.152-.239-.152-.127 0-.233.068-.238.152L2 11.668l.246 2.164c.006.086.111.152.238.152.125 0 .23-.066.239-.152zm2.045-.035L5 11.67l-.232-4.457c-.006-.106-.129-.188-.282-.188-.152 0-.275.082-.281.188L4 11.67l.205 2.129c.006.103.129.186.281.186.153-.001.276-.083.282-.188zm2.042-.031L7 11.67l-.19-4.49c-.005-.123-.146-.221-.32-.221-.176 0-.316.098-.321.221L6 11.67l.17 2.096c.004.123.145.221.32.221.174-.001.315-.096.32-.221zm2.04-.028L9 11.672l-.15-5.149c-.004-.142-.164-.255-.358-.255s-.354.115-.357.256L8 11.67l.135 2.068c.003.141.163.256.357.256.194 0 .354-.113.358-.256zm1.427.258l7.145.004C18.846 14 20 12.883 20 11.506s-1.154-2.492-2.578-2.492c-.353 0-.689.07-.996.193-.205-2.246-2.153-4.008-4.529-4.008a4.77 4.77 0 0 0-1.648.297c-.196.074-.247.148-.249.295v7.91a.306.306 0 0 0 .277.295z" />
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
    icon: <SoundCloudIcon className="w-5 h-5" />,
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
            className="group flex items-center gap-2.5 text-[#444] hover:text-[#e8e6df] transition-colors duration-300"
          >
            <span className="text-[#666] group-hover:text-[#e8e6df] transition-colors duration-300">
              {link.icon}
            </span>
            <span className="relative font-im-fell text-sm uppercase tracking-widest">
              {link.name}
              <span className="absolute left-0 top-1/2 w-full h-px bg-[#e8e6df] transform -translate-y-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

