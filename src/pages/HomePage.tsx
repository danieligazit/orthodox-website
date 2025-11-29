import { useEffect, useLayoutEffect, useState, useMemo, useRef } from 'react';
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

  // 1. Determine if we are just starting in Catalog view (e.g. Back to Albums)
  const shouldStartScrolled = useMemo(() => {
     const state = location.state as { scrollToCatalog?: boolean } | null;
     const storage = typeof window !== 'undefined' ? sessionStorage.getItem('scrollToCatalog') : null;
     return state?.scrollToCatalog === true || storage === 'true';
  }, [location.state, location.key]);

  // 2. Determine if we are doing the "Logo Click" animation (Virtual Animation)
  const shouldAnimateToTop = useMemo(() => {
      const state = location.state as { animateToTop?: boolean } | null;
      const storage = typeof window !== 'undefined' ? sessionStorage.getItem('animateToTop') : null;
      return state?.animateToTop === true || storage === 'true';
  }, [location.state, location.key]);

  // State to control the virtual animation progress (0 to 1)
  // If shouldAnimateToTop is true, we start at 1 (scrolled look). Otherwise null (use real scroll).
  const [virtualProgress, setVirtualProgress] = useState<number | null>(shouldAnimateToTop ? 1 : null);
  const [isForcedScrolled, setIsForcedScrolled] = useState(shouldStartScrolled);

  // Handle Physical Scroll (Back to Albums)
  useLayoutEffect(() => {
    if (shouldStartScrolled) {
        window.scrollTo(0, ANIMATION_CONFIG.DISTANCE);
        sessionStorage.removeItem('scrollToCatalog');
        requestAnimationFrame(() => setIsForcedScrolled(false));
    } else {
        setIsForcedScrolled(false);
    }
  }, [shouldStartScrolled]); 

  // Handle Virtual Animation (Logo Click)
  useEffect(() => {
    if (shouldAnimateToTop) {
        sessionStorage.removeItem('animateToTop');
        
        let start: number | null = null;
        // CHANGE: Reduced duration from 800ms to 500ms for a faster, snappier feel
        const duration = 500; 

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            
            const t = Math.min(elapsed / duration, 1);
            
            // CHANGE: Use an ease-out cubic function for a more natural scroll deceleration
            // t goes 0 -> 1. We want progress 1 -> 0.
            // Ease out: start fast, end slow.
            const easeOut = 1 - Math.pow(1 - t, 3);
            
            // Map easeOut (0->1) to our value (1->0)
            const nextValue = 1 - easeOut;
            
            setVirtualProgress(nextValue);

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                setVirtualProgress(null); 
            }
        };
        
        requestAnimationFrame(animate);
    }
  }, [shouldAnimateToTop]);

  // Standard calculations
  const realProgress = getScrollProgress(scrollY);
  const realEasedProgress = getEasedProgress(realProgress);
  const headerOpacity = getHeaderOpacity(realProgress); // This depends on scrollY

  // Determine what to pass to visual components
  let effectiveEasedProgress = realEasedProgress;

  if (isForcedScrolled) {
      effectiveEasedProgress = 1;
  } else if (virtualProgress !== null) {
      // If we are virtually animating, use the virtual progress.
      // Note: virtualProgress needs to be passed through getEasedProgress logic?
      // No, virtualProgress essentially replaces 'progress'. 
      // Let's assume virtualProgress IS the eased value for simplicity, or map it.
      // Since we want 1 -> 0 visuals.
      effectiveEasedProgress = getEasedProgress(virtualProgress); 
  }

  return (
    <>
      <BackgroundLayer easedProgress={effectiveEasedProgress} windowHeight={windowHeight} />
      <GrainOverlay />
      <LogoLayer easedProgress={effectiveEasedProgress} windowHeight={windowHeight} />
      
      {/* Header visibility is usually driven by scrollY. 
          If we are virtual, scrollY is 0, so header would be hidden.
          But we want it visible initially then fading out?
          Actually, Logo expanding usually hides the header bar.
          At progress=0, header is visible? No, usually hidden at top.
          Let's verify Header logic.
      */}
      <Header opacity={virtualProgress !== null ? getHeaderOpacity(virtualProgress) : headerOpacity} />
      
      {/* Content Section: Driven by physical scrollY. 
          If we are virtual animating, scrollY is 0.
          So content is opacity 0 (hidden) automatically!
          This solves the flash perfectly because content never shows up.
      */}
      <ContentSection scrollY={scrollY} />
    </>
  );
}