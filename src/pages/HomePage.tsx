import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BackgroundLayer, GrainOverlay, LogoLayer, Header, ContentSection } from '../components';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useWindowSize } from '../hooks/useWindowSize';
import { getScrollProgress, getEasedProgress, getHeaderOpacity } from '../utils/animation';
import { ANIMATION_CONFIG } from '../config/constants';

export function HomePage() {
  const scrollY = useScrollPosition();
  const windowHeight = useWindowSize();
  const location = useLocation();
  const scrollHandledRef = useRef<string | null>(null);

  // Calculate animation progress
  const progress = getScrollProgress(scrollY);
  const easedProgress = getEasedProgress(progress);
  const headerOpacity = getHeaderOpacity(progress);

  // Handle scroll to catalog when navigating from album page
  // Use useLayoutEffect to set initial scroll position before paint
  useLayoutEffect(() => {
    const state = location.state as { scrollToCatalog?: boolean } | null;
    const scrollToCatalogFromStorage = sessionStorage.getItem('scrollToCatalog');
    
    const shouldScrollToCatalog = state?.scrollToCatalog === true || scrollToCatalogFromStorage === 'true';
    const shouldScrollToTop = state?.scrollToCatalog === false || scrollToCatalogFromStorage === 'false';
    
    if (shouldScrollToCatalog) {
      // Scroll to catalog view (fully scrolled state)
      window.scrollTo(0, ANIMATION_CONFIG.DISTANCE);
      sessionStorage.removeItem('scrollToCatalog');
    } else if (shouldScrollToTop) {
      // Set scroll to fully scrolled position first to ensure animation is visible
      window.scrollTo(0, ANIMATION_CONFIG.DISTANCE);
      sessionStorage.removeItem('scrollToCatalog');
    }
  }, [location.state, location.pathname]);

  // Use useEffect for smooth scrolling animation after layout
  useEffect(() => {
    const state = location.state as { scrollToCatalog?: boolean } | null;
    const scrollToCatalogFromStorage = sessionStorage.getItem('scrollToCatalog');
    
    const shouldScrollToCatalog = state?.scrollToCatalog === true || scrollToCatalogFromStorage === 'true';
    const shouldScrollToTop = state?.scrollToCatalog === false || scrollToCatalogFromStorage === 'false';
    
    if (shouldScrollToCatalog) {
      // Smooth scroll to catalog after a brief delay
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: ANIMATION_CONFIG.DISTANCE,
          behavior: 'smooth',
        });
      }, 50);
      
      return () => clearTimeout(timeoutId);
    } else if (shouldScrollToTop) {
      // Smoothly scroll to top to show the animation
      // Use a small delay to ensure the layout effect has set the initial position
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [location.state, location.pathname]);

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

