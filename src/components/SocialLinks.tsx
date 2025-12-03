import { Music, Instagram, Disc } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const socialLinks: SocialLink[] = [
  {
    name: 'SoundCloud',
    url: 'https://soundcloud.com/orthodoxrecords',
    icon: <Music className="w-4 h-4" />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/orthodox_records/',
    icon: <Instagram className="w-4 h-4" />,
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

