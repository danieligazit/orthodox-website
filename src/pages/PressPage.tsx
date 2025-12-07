import { useEffect } from 'react';
import { getAllPressItems } from '../data/press';
import { BackgroundLayer, GrainOverlay, LogoLayer, Header } from '../components';
import { useWindowSize } from '../hooks/useWindowSize';

export function PressPage() {
  const windowHeight = useWindowSize();
  const pressItems = getAllPressItems();

  const easedProgress = 1;
  const headerOpacity = 1;

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  // Sort items by date (newest first)
  const sortedItems = [...pressItems].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            {/* Title */}
            <div className="mb-12">
              <h1 className="font-im-fell text-5xl md:text-7xl text-[#e8e6df] mb-6 drop-shadow-lg leading-tight mt-0">
                Press
              </h1>
            </div>

            {/* Content */}
            <div className="max-w-4xl">
              {sortedItems.length > 0 ? (
                <div className="space-y-12">
                  {sortedItems.map((item) => (
                    <article
                      key={item.id}
                      className="border-b border-[#e8e6df]/10 pb-8 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Optional Image */}
                        {item.image && (
                          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 border border-[#e8e6df]/20 bg-[#dcdad3] relative overflow-hidden">
                            <img
                              src={item.image.startsWith('http') ? item.image : `${import.meta.env.BASE_URL}${item.image}`}
                              alt={item.publication}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1">
                          {/* Category */}
                          {item.category && (
                            <span className="font-im-fell text-xs uppercase tracking-widest text-[#e8e6df]/60 mb-2 inline-block">
                              {item.category}
                            </span>
                          )}

                          {/* Title */}
                          <h2 className="font-im-fell text-2xl md:text-3xl text-[#e8e6df] mb-3 leading-tight">
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#b4b0a7] transition-colors duration-300"
                            >
                              {item.title}
                            </a>
                          </h2>

                          {/* Publication & Author */}
                          <div className="font-im-fell text-sm text-[#e8e6df]/70 mb-3">
                            <span className="font-semibold">{item.publication}</span>
                            {item.author && (
                              <span className="mx-2">•</span>
                            )}
                            {item.author && (
                              <span>{item.author}</span>
                            )}
                            <span className="mx-2">•</span>
                            <span className="text-[#e8e6df]/60">{formatDate(item.date)}</span>
                          </div>

                          {/* Excerpt */}
                          {item.excerpt && (
                            <p className="font-im-fell text-[#e8e6df] leading-loose text-base opacity-90 mb-4">
                              {item.excerpt}
                            </p>
                          )}

                          {/* Read More Link */}
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-im-fell text-sm uppercase tracking-widest text-[#b4b0a7] hover:text-[#e8e6df] transition-colors duration-300 inline-flex items-center gap-2"
                          >
                            Read Article
                            <span className="text-xs">→</span>
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="font-im-fell text-[#e8e6df] leading-loose text-lg opacity-60 italic">
                  Press coverage coming soon...
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
