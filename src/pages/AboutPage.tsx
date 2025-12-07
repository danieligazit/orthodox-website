import { useEffect } from 'react';
import { ABOUT_DATA } from '../data/about';
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
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#b4b0a7] hover:underline transition-colors duration-300"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

export function AboutPage() {
  const windowHeight = useWindowSize();

  const easedProgress = 1;
  const headerOpacity = 1;

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  return (
    <>
      <BackgroundLayer easedProgress={easedProgress} windowHeight={windowHeight} />
      <GrainOverlay />
      <LogoLayer easedProgress={easedProgress} windowHeight={windowHeight} />
      <Header opacity={headerOpacity} />

      <div className="relative z-20">
        <main className="w-full">
          <div className="max-w-6xl mx-auto px-6 py-32 min-h-screen">
            {/* Title */}
            <div className="mb-12">
              <h1 className="font-im-fell text-5xl md:text-7xl text-[#e8e6df] mb-6 drop-shadow-lg leading-tight mt-0">
                About
              </h1>
            </div>

            {/* Content */}
            <div className="max-w-4xl">
              {ABOUT_DATA.paragraphs.length > 0 ? (
                <div className="space-y-6">
                  {ABOUT_DATA.paragraphs.map((paragraph, index) => (
                    <p key={index} className="font-im-fell text-[#e8e6df] leading-loose text-lg opacity-90">
                      {formatTextWithLinks(paragraph)}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="font-im-fell text-[#e8e6df] leading-loose text-lg opacity-60 italic">
                  Content coming soon...
                </p>
              )}

              {/* Copyright Notice */}
              <div className="pt-20 pb-10">
                <p className="font-im-fell text-sm text-[#e8e6df]/40 tracking-wider">
                  &copy; {new Date().getFullYear()} ORTHODOX
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
