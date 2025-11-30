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
        <div className="text-center pt-32">
          <h1 className="text-2xl font-im-fell mb-4 text-[#e8e6df]">Album not found</h1>
          <button
            onClick={() => {
              sessionStorage.setItem('scrollToCatalog', 'true');
              navigate('/', { 
                state: { scrollToCatalog: true },
                replace: false
              });
            }}
            className="font-im-fell uppercase tracking-widest text-sm border border-[#e8e6df] text-[#e8e6df] px-4 py-2 hover:bg-[#e8e6df] hover:text-[#050505] transition-colors duration-500"
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
      return `https://bandcamp.com/EmbeddedPlayer/album=${album.bandcampEmbedId}/size=large/bgcol=333333/linkcol=e8e6df/tracklist=false/transparent=true/`;
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
              className="mb-8 font-im-fell uppercase tracking-widest text-sm border border-[#e8e6df] text-[#e8e6df] bg-black/20 backdrop-blur-sm px-4 py-2 hover:bg-[#e8e6df] hover:text-[#050505] transition-colors duration-500 relative z-[60]"
            >
              ← Back to Albums
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6 md:gap-10 mb-12 items-start">


              {/* Left Column: Album Details & Description */}
              <div className="flex flex-col bg-black/40 backdrop-blur-sm p-6 md:p-8 rounded-sm border border-[#e8e6df]/10">
                <div className="mb-2">
                  <div className="font-im-fell uppercase tracking-widest text-sm mb-4">
                    <span className="bg-[#e8e6df] text-[#050505] px-2 py-1 shadow-lg inline-block font-bold">
                      {album.artist}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-im-fell uppercase tracking-widest text-[#e8e6df] mb-6 drop-shadow-lg">
                    {album.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap mb-8">
                    <span className="bg-black/50 text-[#e8e6df] px-2 py-1 border border-[#e8e6df] shadow-lg font-im-fell uppercase tracking-widest text-xs">
                      {serialNumber}
                    </span>
                    <span className="text-[#e8e6df] font-im-fell text-sm opacity-80">
                      Released: {releaseDate}
                    </span>
                  </div>

                  {/* Description */}
                  {album.description && (
                    <div className="mb-2">
                      <h2 className="font-im-fell uppercase tracking-widest text-lg mb-4 text-[#e8e6df] border-b border-[#e8e6df]/20 pb-2 inline-block">
                        About
                      </h2>
                      
                      {typeof album.description === 'string' ? (
                        <p className="font-im-fell text-[#e8e6df] leading-relaxed text-lg opacity-90">
                          {album.description}
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {/* Paragraphs */}
                          <div className="space-y-4">
                            {album.description.paragraphs.map((paragraph, index) => (
                              <p key={index} className="font-im-fell text-[#e8e6df] leading-relaxed text-lg opacity-90">
                                {paragraph}
                              </p>
                            ))}
                          </div>

                          {/* Credits */}
                          {album.description.credits && (
                            <div className="mt-8 pt-6 border-t border-[#e8e6df]/20 space-y-6">
                              {/* Artists */}
                              {album.description.credits.artists && (
                                <div className="space-y-1">
                                  {album.description.credits.artists.map((credit, index) => (
                                    <p key={index} className="font-im-fell text-[#e8e6df] text-sm opacity-80">
                                      {credit}
                                    </p>
                                  ))}
                                </div>
                              )}
                              
                              {/* Additional */}
                              {album.description.credits.additional && (
                                <div className="space-y-1">
                                  {album.description.credits.additional.map((credit, index) => (
                                    <p key={index} className="font-im-fell text-[#e8e6df] text-sm opacity-80">
                                      {credit}
                                    </p>
                                  ))}
                                </div>
                              )}

                              {/* Production */}
                              {album.description.credits.production && (
                                <div className="space-y-1">
                                  {album.description.credits.production.map((credit, index) => (
                                    <p key={index} className="font-im-fell text-[#e8e6df] text-sm opacity-80">
                                      {credit}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

                            {/* Right Column: Player OR Cover Image */}
                            <div className="w-full flex justify-center md:justify-start">
                {album.bandcampEmbedId ? (
                  // If we have an embed ID, show the vertical player
                  <div className="w-full max-w-[350px]">
                    <iframe
                      style={{ border: 0, width: '100%', height: '470px' }}
                      src={getBandcampEmbedUrl()}
                      seamless
                      title={`${album.artist} - ${album.title}`}
                    >
                      <a href={album.bandcampUrl}>{album.title} by {album.artist}</a>
                    </iframe>
                  </div>
                ) : (
                  // Fallback: Show static cover image if no embed ID
                  <div className="aspect-square w-full max-w-[350px] border-2 border-[#333] bg-[#dcdad3] relative overflow-hidden shadow-2xl">
                    <img
                      src={`${import.meta.env.BASE_URL}${album.cover}`}
                      alt={`${album.artist} - ${album.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}