import { AlbumCard } from './AlbumCard';
import { getSortedAlbums } from '../data/albums';
import { ANIMATION_CONFIG } from '../config/constants';
import { getContentOpacity, getContentTranslateY } from '../utils/animation';

interface ContentSectionProps {
  scrollY: number;
}

export function ContentSection({ scrollY }: ContentSectionProps) {
  const opacity = getContentOpacity(scrollY);
  const translateY = getContentTranslateY(scrollY);

  return (
    <div className="relative z-20">
      <main className="w-full">
        {/* Scroll Spacer - Matches the animation distance to prevent jumpiness */}
        <div style={{ height: `${ANIMATION_CONFIG.DISTANCE}px` }}></div>

        {/* Content Container */}
        <div
          className="max-w-7xl mx-auto px-4 pb-32 min-h-screen"
          style={{
            opacity,
            transform: `translateY(${translateY}px)`,
          }}
        >
          {/* Spacer between header and first row */}
          <div className="h-48 md:h-32"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {getSortedAlbums().map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-48 text-center font-im-fell pb-12">
      <div className="inline-block border-1 border-[#050505] bg-[#e8e6df] p-8 hover:bg-[#050505] hover:text-[#e8e6df] transition-colors duration-500 cursor-pointer shadow-lg group">
        <h3 className="text-lg">SUBSCRIBE TO NEWSLETTER</h3>
      </div>
      <div className="mt-12 text-[#444] text-xs tracking-widest uppercase mix-blend-difference">
        &copy; 2025 Orthodox Records.
      </div>
    </div>
  );
}

