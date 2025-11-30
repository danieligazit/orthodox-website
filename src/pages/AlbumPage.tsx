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

  // Generate serial number
  const serialNumber = `ORTH${album.id.toString().padStart(3, '0')}`;
  
  // Format release date
  const releaseDate = new Date(album.releaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get Embed URL for the vertical player
  const getBandcampEmbedUrl = () => {
    if (album.bandcampEmbedId) {
      return `https://bandcamp.com/EmbeddedPlayer/album=${album.bandcampEmbedId}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/`;
    }
    return '';
  };

  return (
    <>
      <BackgroundLayer easedProgress={easedProgress} windowHeight={windowHeight} />
      <GrainOverlay />
      <LogoLayer easedProgress={easedProgress} windowHeight={windowHeight} />
      <Header opacity={headerOpacity} />

      <div className="relative z-20">
        <main className="w-full">
          <div className="max-w-5xl mx-auto px-4 py-32 min-h-screen">
            {/* Back Button */}
            <button
              onClick={() => {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
              {/* Left Column: Player OR Cover Image */}
              <div className="w-full">
                {album.bandcampEmbedId ? (
                  // If we have an embed ID, show the vertical player
                  <div className="w-full flex justify-center md:justify-start">
                    <iframe
                      style={{ border: 0, width: '350px', height: '470px', maxWidth: '100%' }}
                      src={getBandcampEmbedUrl()}
                      seamless
                      title={`${album.artist} - ${album.title}`}
                    >
                      <a href={album.bandcampUrl}>{album.title} by {album.artist}</a>
                    </iframe>
                  </div>
                ) : (
                  // Fallback: Show static cover image if no embed ID
                  <div className="aspect-square w-full border-2 border-[#333] bg-[#dcdad3] relative overflow-hidden shadow-2xl">
                    <img
                      src={`${import.meta.env.BASE_URL}${album.cover}`}
                      alt={`${album.artist} - ${album.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Album Details & Description */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <div className="font-im-fell uppercase tracking-widest text-sm mb-4">
                    <span className="bg-[#050505] text-[#e8e6df] px-2 py-1 shadow-lg inline-block mb-2">
                      {album.artist}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-im-fell uppercase tracking-widest text-[#050505] mb-4">
                    {album.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap mb-8">
                    <span className="bg-[#e8e6df] text-[#050505] px-2 py-1 border border-[#050505] shadow-lg font-im-fell uppercase tracking-widest text-sm">
                      {serialNumber}
                    </span>
                    <span className="text-[#050505] font-im-fell text-sm">
                      Released: {releaseDate}
                    </span>
                  </div>

                  {/* Description */}
                  {album.description && (
                    <div className="mb-8">
                      <h2 className="font-im-fell uppercase tracking-widest text-lg mb-3 text-[#050505]">
                        About
                      </h2>
                      <p className="font-im-fell text-[#050505] leading-relaxed text-lg">
                        {album.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}