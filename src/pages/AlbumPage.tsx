import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlbumByUrlPath } from '../data/albums';
import { BackgroundLayer, GrainOverlay, LogoLayer, Header } from '../components';
import { useWindowSize } from '../hooks/useWindowSize';

// Helper function to format text with clickable links
const formatTextWithLinks = (text: string | null | undefined) => {
  if (!text) return null;

  // Regex to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank" // Open link in a new tab
          rel="noopener noreferrer" // Security best practice for target="_blank"
          className="text-[#b4b0a7] hover:underline transition-colors duration-300" // Tailwind classes for styling
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

export function AlbumPage() {
  const { urlPath } = useParams<{ urlPath: string }>();
  const navigate = useNavigate();
  const windowHeight = useWindowSize();

  const easedProgress = 1;
  const headerOpacity = 1;

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [urlPath]);

  const album = urlPath ? getAlbumByUrlPath(urlPath) : null;

  if (!album) {
    return (
      <div className="text-center pt-32">
        <h1 className="text-2xl mb-4 text-[#e8e6df] font-im-fell">Album not found</h1>
        <button
          onClick={() => navigate('/')}
          className="font-im-fell uppercase tracking-widest text-sm border border-[#e8e6df] text-[#e8e6df] px-4 py-2 hover:bg-[#e8e6df] hover:text-[#050505] transition-colors duration-500"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Defensive checks for required fields
  if (!album.id || !album.artist || !album.title || !album.cover || !album.releaseDate) {
    console.error('AlbumPage: Missing required fields', album);
    return (
      <div className="text-center pt-32">
        <h1 className="text-2xl mb-4 text-[#e8e6df] font-im-fell">Album data is incomplete</h1>
        <button
          onClick={() => navigate('/')}
          className="font-im-fell uppercase tracking-widest text-sm border border-[#e8e6df] text-[#e8e6df] px-4 py-2 hover:bg-[#e8e6df] hover:text-[#050505] transition-colors duration-500"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Use the album id directly (e.g., "orth001", "room001")
  const serialNumber = album.id.toUpperCase();

  // Format release date with validation
  let releaseDate: string;
  try {
    const dateObj = new Date(album.releaseDate);
    if (isNaN(dateObj.getTime())) {
      releaseDate = album.releaseDate; // Fallback to raw string if invalid
    } else {
      releaseDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch (error) {
    releaseDate = album.releaseDate; // Fallback to raw string on error
  }

  const getBandcampEmbedUrl = () => {
    if (album.bandcampEmbedId) {
      return `https://bandcamp.com/EmbeddedPlayer/album=${album.bandcampEmbedId}/size=large/bgcol=333333/linkcol=e8e6df/tracklist=false/transparent=true/`;
    }
    return '';
  };

  // Helper function to detect video type and get embed URL
  const getVideoEmbedInfo = (videoUrl: string) => {
    // YouTube detection (youtube.com or youtu.be)
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = videoUrl.match(youtubeRegex);
    if (youtubeMatch) {
      return {
        type: 'youtube' as const,
        videoId: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?modestbranding=1&rel=0&enablejsapi=1`
      };
    }

    // Vimeo detection
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = videoUrl.match(vimeoRegex);
    if (vimeoMatch) {
      return {
        type: 'vimeo' as const,
        videoId: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`
      };
    }

    // Bandcamp video detection (23video.com or bandcamp video embed) - no play/pause API
    if (videoUrl.includes('bandcamp') || videoUrl.includes('23video.com')) {
      // Extract the iframe src URL if it's a full iframe tag
      const iframeSrcMatch = videoUrl.match(/src=["']([^"']+)["']/);
      if (iframeSrcMatch) {
        let embedUrl = iframeSrcMatch[1];
        // Handle protocol-relative URLs (//) by adding https:
        if (embedUrl.startsWith('//')) {
          embedUrl = 'https:' + embedUrl;
        }
        return {
          type: 'bandcamp' as const,
          embedUrl: embedUrl
        };
      }
      // If it's already a URL, use it directly (handle protocol-relative)
      if (videoUrl.startsWith('http') || videoUrl.startsWith('//')) {
        let embedUrl = videoUrl.startsWith('//') ? 'https:' + videoUrl : videoUrl;
        return {
          type: 'bandcamp' as const,
          embedUrl: embedUrl
        };
      }
    }

    return null;
  };

  // Get video info if video section exists (only when embed is supported)
  const embedInfo = album.video ? getVideoEmbedInfo(album.video.url) : null;
  const videoInfo = embedInfo ? {
    ...embedInfo,
    title: album.video!.title,
    aspectRatio: album.video!.aspectRatio || '9/16'
  } : null;

  // Video title: before first play → always show. After video has been played → show only on hover
  const [hasEverPlayed, setHasEverPlayed] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ytPlayerRef = useRef<{ destroy: () => void } | null>(null);
  const vimeoPlayerRef = useRef<unknown>(null);
  const bandcampPlayHeuristicRef = useRef<number | null>(null);

  const supportsPlayDetection = videoInfo?.type === 'youtube' || videoInfo?.type === 'vimeo';

  useEffect(() => {
    return () => {
      ytPlayerRef.current?.destroy?.();
      if (bandcampPlayHeuristicRef.current) clearTimeout(bandcampPlayHeuristicRef.current);
    };
  }, []);

  // YouTube: load IFrame API and subscribe to play/pause
  useEffect(() => {
    if (!videoInfo || videoInfo.type !== 'youtube' || !('videoId' in videoInfo)) return;
    const videoId = videoInfo.videoId;
    const container = videoContainerRef.current;
    if (!container) return;

    const initYtPlayer = () => {
      const YT = window.YT;
      if (!YT?.Player) return;
      const player = new YT.Player(container, {
        videoId,
        height: '100%',
        width: '100%',
        playerVars: { modestbranding: 1, rel: 0 },
        events: {
          onStateChange: (e: { data: number }) => {
            // 1 = playing - mark as "ever played" once they hit play
            if (e.data === 1) setHasEverPlayed(true);
          }
        }
      }) as { destroy: () => void };
      ytPlayerRef.current = player;
    };

    if (window.YT?.Player) {
      initYtPlayer();
      return;
    }
    const win = window as Window & { onYouTubeIframeAPIReady?: () => void };
    const prev = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => {
      prev?.();
      initYtPlayer();
    };
    const existing = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (!existing) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    return () => {
      ytPlayerRef.current?.destroy?.();
      ytPlayerRef.current = null;
    };
  }, [videoInfo?.type, videoInfo && 'videoId' in videoInfo ? videoInfo.videoId : null]);

  // Vimeo: load Player SDK and subscribe to play/pause
  useEffect(() => {
    if (!videoInfo || videoInfo.type !== 'vimeo' || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const loadVimeoAndInit = () => {
      const Vimeo = (window as Window & { Vimeo?: { Player: new (el: HTMLIFrameElement) => { on: (e: string, cb: () => void) => void } } }).Vimeo;
      if (!Vimeo?.Player) return;
      const player = new Vimeo.Player(iframe);
      vimeoPlayerRef.current = player;
      player.on('play', () => setHasEverPlayed(true));
    };

    if ((window as Window & { Vimeo?: { Player: unknown } }).Vimeo?.Player) {
      loadVimeoAndInit();
      return;
    }
    const existing = document.querySelector('script[src*="vimeo.com/api/player"]');
    if (!existing) {
      const tag = document.createElement('script');
      tag.src = 'https://player.vimeo.com/api/player.js';
      tag.onload = loadVimeoAndInit;
      document.head.appendChild(tag);
    }
    return () => {
      vimeoPlayerRef.current = null;
    };
  }, [videoInfo?.type]);

  // Before first play: always show. After ever played: show only when hovering
  const showVideoTitle = !hasEverPlayed || isMouseOver;

  const handleVideoMouseEnter = () => {
    setIsMouseOver(true);
    // Cancel Bandcamp heuristic - user came back before we assumed "played"
    if (bandcampPlayHeuristicRef.current) {
      clearTimeout(bandcampPlayHeuristicRef.current);
      bandcampPlayHeuristicRef.current = null;
    }
  };

  const handleVideoMouseLeave = () => {
    setIsMouseOver(false);
    // Bandcamp/23video: no play API – assume "played" when mouse leaves (user likely clicked play)
    if (!supportsPlayDetection && videoInfo) {
      if (bandcampPlayHeuristicRef.current) clearTimeout(bandcampPlayHeuristicRef.current);
      bandcampPlayHeuristicRef.current = window.setTimeout(() => {
        setHasEverPlayed(true);
        bandcampPlayHeuristicRef.current = null;
      }, 150);
    }
  };

  return (
    <>
      <BackgroundLayer easedProgress={easedProgress} windowHeight={windowHeight} />
      <GrainOverlay />
      <LogoLayer easedProgress={easedProgress} windowHeight={windowHeight} />
      <Header opacity={headerOpacity} />

      <div className="relative z-20">
        <main className="w-full">
          <div className="max-w-6xl mx-auto px-6 py-32 min-h-screen">

            {/* --- NEW SECTION: Navigation Row ---
                Separates navigation/utility from the content so they don't fight.
            */}
            <div className="flex justify-between items-end border-b border-[#e8e6df]/10 pb-6 mb-10">
                {/* Minimal Text-Only Back Button */}
                <button
                  onClick={() => {
                    sessionStorage.setItem('scrollToCatalog', 'true');
                    navigate('/', {
                      state: { scrollToCatalog: true },
                      replace: false
                    });
                  }}
                  className="font-im-fell uppercase tracking-widest text-xs text-[#e8e6df]/60 hover:text-[#e8e6df] transition-colors duration-300 flex items-center gap-2"
                >
                  <span>←</span> Back to Albums
                </button>

                {/* Serial Number moved to right to balance layout */}
                <span className="font-im-fell text-xs tracking-widest text-[#e8e6df]/40">
                   {serialNumber}
                </span>
            </div>

            {/* Video Section - Displayed at top if video section exists */}
            {videoInfo && (
              <div className="mb-16">
                <div className="w-full">
                  <div 
                    className="w-full shadow-2xl bg-black overflow-hidden relative"
                    onMouseEnter={handleVideoMouseEnter}
                    onMouseLeave={handleVideoMouseLeave}
                  >
                    <div className="relative" style={{ paddingBottom: `calc(100% * ${videoInfo.aspectRatio})` }}>
                      {videoInfo.type === 'youtube' ? (
                        <div
                          ref={videoContainerRef}
                          className="absolute top-0 left-0 w-full h-full"
                          style={{ border: 0, margin: 0, padding: 0 }}
                        />
                      ) : (
                        <iframe
                          ref={videoInfo.type === 'vimeo' ? iframeRef : undefined}
                          className="absolute top-0 left-0 w-full h-full"
                          style={{ 
                            border: 0, 
                            margin: 0, 
                            padding: 0,
                            display: 'block',
                            width: '100%',
                            height: '100%'
                          }}
                          src={videoInfo.embedUrl}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`${album.artist} - ${album.title} Video`}
                          frameBorder="0"
                        />
                      )}
                      {/* Video title overlay - only for Vimeo/Bandcamp (YouTube shows its own title) */}
                      {videoInfo.title && videoInfo.type !== 'youtube' && (
                        <div 
                          className={`absolute top-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-sm pointer-events-none transition-opacity duration-300 ${
                            showVideoTitle ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <p className="font-im-fell text-xs text-[#e8e6df]/95 uppercase tracking-widest">
                            {videoInfo.title}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- REFACTORED SECTION: Album Title Header --- */}
            <div className="mb-12">
                {/* Artist Name: Bigger (text-xl) and using brand font */}
                <h2 className="font-im-fell uppercase tracking-widest text-xl text-[#e8e6df] mb-2 ml-1">
                  {album.artist}
                </h2>

                {/* Title: Large and clean, using brand font */}
                <h1 className="font-im-fell text-5xl md:text-7xl text-[#e8e6df] mb-6 drop-shadow-lg leading-tight mt-0">
                    {album.title}
                </h1>
            </div>

            {/* --- EXISTING CONTENT GRID (Preserved) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

              {/* LEFT COLUMN: Description & Credits */}
              <div className="lg:col-span-7 flex flex-col">
                {album.description && (
                  <div>
                    {typeof album.description === 'string' ? (
                      <p className="font-im-fell text-[#e8e6df] leading-loose text-lg opacity-90">
                        {formatTextWithLinks(album.description)}
                      </p>
                    ) : (
                      <div className="space-y-8">
                        {/* Paragraphs */}
                        {album.description.paragraphs && Array.isArray(album.description.paragraphs) && album.description.paragraphs.length > 0 && (
                          <div className="space-y-6">
                            {album.description.paragraphs.map((paragraph, index) => (
                              <p key={index} className="font-im-fell text-[#e8e6df] leading-loose text-lg opacity-90">
                                {formatTextWithLinks(paragraph)}
                              </p>
                            ))}
                          </div>
                        )}

                                       {/* Date: Subtle italic text */}
                <div className="font-im-fell text-[#e8e6df]/60 italic text-sm ml-1">
                    Released {releaseDate}
                </div>

                        {/* Credits Section */}
                        {album.description.credits && (
                          <div className="pt-10 mt-10 border-t border-[#e8e6df]/10 grid grid-cols-1 sm:grid-cols-2 gap-y-10">

                            {album.description.credits.artists && (
                              <div className="space-y-3">
                                {album.description.credits.artists.map((credit, index) => (
                                  <p key={index} className="font-im-fell text-[#e8e6df] text-sm opacity-80 leading-relaxed">
                                    {formatTextWithLinks(credit)}
                                  </p>
                                ))}
                              </div>
                            )}

                            {album.description.credits.production && (
                              <div className="space-y-3">
                                {album.description.credits.production.map((credit, index) => (
                                  <p key={index} className="font-im-fell text-[#e8e6df] text-sm opacity-80 leading-relaxed">
                                    {formatTextWithLinks(credit)}
                                  </p>
                                ))}
                              </div>
                            )}

                             {album.description.credits.additional && (
                              <div className="space-y-3 sm:col-span-2">
                                {album.description.credits.additional.map((credit, index) => (
                                  <p key={index} className="font-im-fell text-[#e8e6df] text-sm opacity-80 leading-relaxed">
                                    {formatTextWithLinks(credit)}
                                  </p>
                                ))}
                              </div>
                            )}

                            {album.description.credits.coverArt && (
                              <div className="space-y-3">
                                {album.description.credits.coverArt.map((credit, index) => (
                                  <p key={index} className="font-im-fell text-[#e8e6df] text-sm opacity-80 leading-relaxed">
                                    {formatTextWithLinks(credit)}
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

                {/* --- NEW SECTION: Copyright Notice --- */}
                <div className="pt-20 pb-10">
                  <p className="font-im-fell text-sm text-[#e8e6df]/40 tracking-wider">
                    &copy; {new Date().getFullYear()} ORTHODOX
                  </p>
                </div>
              </div>


              {/* RIGHT COLUMN: Player/Cover */}
              <div className="lg:col-span-5 w-full flex justify-center lg:justify-end mt-3">
                  {album.bandcampEmbedId ? (
                    // Bandcamp audio player
                    <div className="w-full max-w-[350px] shadow-2xl bg-black">
                      <iframe
                        style={{ border: 0, width: '100%', height: '470px' }}
                        src={getBandcampEmbedUrl()}
                        seamless
                        title={`${album.artist} - ${album.title}`}
                      >
                      </iframe>
                    </div>
                  ) : (
                    // Cover image (fallback)
                    <div className="aspect-square w-full max-w-[350px] border border-[#333] bg-[#dcdad3] relative overflow-hidden shadow-2xl">
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