import { BackgroundLayer, GrainOverlay, LogoLayer, Header, ContentSection } from './components';
import { useScrollPosition } from './hooks/useScrollPosition';
import { useWindowSize } from './hooks/useWindowSize';
import { getScrollProgress, getEasedProgress, getHeaderOpacity } from './utils/animation';

export default function App() {
  const scrollY = useScrollPosition();
  const windowHeight = useWindowSize();

  // Calculate animation progress
  const progress = getScrollProgress(scrollY);
  const easedProgress = getEasedProgress(progress);
  const headerOpacity = getHeaderOpacity(progress);

  return (
    <div className="min-h-screen w-full relative bg-[#e8e6df]">
      {/* Fixed background to prevent white showing through on scroll */}
      <div
        className="fixed bg-[#e8e6df] -z-10 pointer-events-none"
        style={{
          top: '-50px',
          left: '-50px',
          right: '-50px',
          bottom: '-50px',
          width: 'calc(100vw + 100px)',
          height: 'calc(100vh + 100px)',
        }}
      />

      {/* Background Layer */}
      <BackgroundLayer easedProgress={easedProgress} windowHeight={windowHeight} />

      {/* Global Grain Overlay */}
      <GrainOverlay />

      {/* Logo Layer */}
      <LogoLayer easedProgress={easedProgress} windowHeight={windowHeight} />

      {/* Header */}
      <Header opacity={headerOpacity} />

      {/* Content Section */}
      <ContentSection scrollY={scrollY} />
    </div>
  );
}
