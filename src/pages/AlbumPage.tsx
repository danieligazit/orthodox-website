import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumById } from '../data/albums';
import { BackgroundLayer, GrainOverlay, LogoLayer, Header } from '../components';
import { useWindowSize } from '../hooks/useWindowSize';

export function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const windowHeight = useWindowSize();

  // Album page should always show the fully scrolled state (no animation)
  const easedProgress = 1; // Fully scrolled
  const headerOpacity = 1; // Header fully visible

  // Scroll to top when album page loads
  useEffect(() => {
    // Immediately scroll to top
    window.scrollTo(0, 0);
    
    // Also use requestAnimationFrame to ensure it happens after render
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [id]);

  const albumId = id ? parseInt(id, 10) : null;
  const album = albumId ? getAlbumById(albumId) : null;

  if (!album) {
    return (
      <>
        <div className="text-center">
          <h1 className="text-2xl font-im-fell mb-4">Album not found</h1>
          <button
            onClick={() => {
              // Set sessionStorage as fallback in case state doesn't work
              sessionStorage.setItem('scrollToCatalog', 'true');
              navigate('/', { 
                state: { scrollToCatalog: true },
                replace: false
              });
            }}
            className="font-im-fell uppercase tracking-widest text-sm border border-[#050505] bg-[#e8e6df] px-4 py-2 hover:bg-[#050505] hover:text-[#e8e6df] transition-colors duration-500"
          >
            Back to Home
          </button>
        </div>
      </>
    );
  }

  // Generate serial number from album id (ORTH001, ORTH002, etc.)
  const serialNumber = `ORTH${album.id.toString().padStart(3, '0')}`;
  
  // Format release date
  const releaseDate = new Date(album.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Convert Bandcamp URL to embed format
  const getBandcampEmbedUrl = (url: string) => {
    // If already an embed URL, return as is
    if (url.includes('bandcamp.com/EmbeddedAlbum')) {
      return url;
    }
    
    // Extract label and album slug from URL (e.g., "orthodoxrecords" and "i-do-care" from "https://orthodoxrecords.bandcamp.com/album/i-do-care")
    const match = url.match(/https?:\/\/([^.]+)\.bandcamp\.com\/album\/([^/?#]+)/);
    if (match) {
      const label = match[1];
      const albumSlug = match[2];
      return `https://bandcamp.com/EmbeddedAlbum/${label}/${albumSlug}/size=large/bgcol=ffffff/linkcol=0687f5/transparent=true/`;
    }
    
    // Fallback: return original URL if pattern doesn't match
    return url;
  };

  return (
    <>
      {/* Background Layer */}
      <BackgroundLayer easedProgress={easedProgress} windowHeight={windowHeight} />

      {/* Global Grain Overlay */}
      <GrainOverlay />

      {/* Logo Layer */}
      <LogoLayer easedProgress={easedProgress} windowHeight={windowHeight} />

      {/* Header */}
      <Header opacity={headerOpacity} />

      {/* Content */}
      <div className="relative z-20">
        <main className="w-full">
          <div className="max-w-5xl mx-auto px-4 py-32 min-h-screen">
            {/* Back Button */}
            <button
              onClick={() => {
                // Set sessionStorage as fallback in case state doesn't work
                sessionStorage.setItem('scrollToCatalog', 'true');
                navigate('/', { 
                  state: { scrollToCatalog: true },
                  replace: false
                });
              }}
              className="mb-8 font-im-fell uppercase tracking-widest text-sm border border-[#050505] bg-[#e8e6df] px-4 py-2 hover:bg-[#050505] hover:text-[#e8e6df] transition-colors duration-500 relative z-[60]"
            >
              ← Back to Albums
            </button>

            {/* Album Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
              {/* Album Cover */}
              <div className="w-full">
                <div className="aspect-square w-full border-2 border-[#333] bg-[#dcdad3] relative overflow-hidden shadow-2xl">
                  <img
                    src={`${import.meta.env.BASE_URL}${album.cover}`}
                    alt={`${album.artist} - ${album.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Album Details */}
              <div className="flex flex-col justify-center">
                <div className="mb-6">
                  <div className="font-im-fell uppercase tracking-widest text-sm mb-4">
                    <span className="bg-[#050505] text-[#e8e6df] px-2 py-1 shadow-lg inline-block mb-2">
                      {album.artist}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-im-fell uppercase tracking-widest text-[#050505] mb-4">
                    {album.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="bg-[#e8e6df] text-[#050505] px-2 py-1 border border-[#050505] shadow-lg font-im-fell uppercase tracking-widest text-sm">
                      {serialNumber}
                    </span>
                    <span className="text-[#050505] font-im-fell text-sm">
                      Released: {releaseDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {album.description && (
              <div className="mb-12">
                <h2 className="font-im-fell uppercase tracking-widest text-lg mb-4 text-[#050505]">
                  About
                </h2>
                <p className="font-im-fell text-[#050505] leading-relaxed text-lg">
                  {album.description}
                </p>
              </div>
            )}

            {/* Bandcamp Player */}
            {album.bandcampUrl && (
              <div className="mb-12">
                <h2 className="font-im-fell uppercase tracking-widest text-lg mb-4 text-[#050505]">
                  Listen
                </h2>
                <div className="w-full">
                  <iframe
                    style={{ border: 0, width: '100%', height: '472px' }}
                    src={getBandcampEmbedUrl(album.bandcampUrl)}
                    seamless
                    title={`${album.artist} - ${album.title}`}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

