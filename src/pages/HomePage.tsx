import { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BackgroundLayer, GrainOverlay, LogoLayer, Header, ContentSection } from '../components';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useWindowSize } from '../hooks/useWindowSize';
import { getScrollProgress, getEasedProgress, getHeaderOpacity } from '../utils/animation';
import { ANIMATION_CONFIG } from '../config/constants';

export function HomePage() {
  const scrollY = useScrollPosition();
  const windowHeight = useWindowSize();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Determine if we are just starting in Catalog view (e.g. Back to Albums)
  // We now also check the URL hash for '#albums'
  const isCatalogView = location.hash === '#albums';

  // 2. Determine if we are doing the "Logo Click" animation (Virtual Animation)
  const shouldAnimateToTop = useMemo(() => {
      const state = location.state as { animateToTop?: boolean } | null;
      const storage = typeof window !== 'undefined' ? sessionStorage.getItem('animateToTop') : null;
      return state?.animateToTop === true || storage === 'true';
  }, [location.state, location.key]);

  const shouldStartScrolled = useMemo(() => {
     // If we're animating to top, don't start scrolled
     if (shouldAnimateToTop) {
       return false;
     }
     const state = location.state as { scrollToCatalog?: boolean } | null;
     const storage = typeof window !== 'undefined' ? sessionStorage.getItem('scrollToCatalog') : null;
     return state?.scrollToCatalog === true || storage === 'true' || isCatalogView;
  }, [location.state, location.key, isCatalogView, shouldAnimateToTop]);

  // State to control the virtual animation progress (0 to 1)
  // If shouldAnimateToTop is true, we start at 1 (scrolled look). Otherwise null (use real scroll).
  const [virtualProgress, setVirtualProgress] = useState<number | null>(shouldAnimateToTop ? 1 : null);
  const [isForcedScrolled, setIsForcedScrolled] = useState(shouldStartScrolled);

  // Update URL hash based on scroll position to save state
  useEffect(() => {
    // If we are currently "forcing" the scroll state (handling initial load/restore),
    // do NOT update the URL hash yet. Wait until the user actually scrolls or the restoration settles.
    if (isForcedScrolled) return;
    
    // Don't update hash during virtual animation (logo click animation)
    if (virtualProgress !== null) return;
    
    // After animation completes, ensure hash is cleared if we're at top
    if (scrollY === 0 && location.hash === '#albums') {
      navigate(location.pathname, { replace: true });
      return;
    }

    // Add hash when scrolled past animation (inclusive of the end point)
    if (scrollY >= ANIMATION_CONFIG.DISTANCE && location.hash !== '#albums') {
      navigate('#albums', { replace: true });
    } 
    // Remove hash when back at top (intro view)
    else if (scrollY < ANIMATION_CONFIG.DISTANCE && location.hash === '#albums') {
      navigate(location.pathname, { replace: true });
    }
  }, [scrollY, location.hash, navigate, location.pathname, isForcedScrolled, virtualProgress]);

  // Handle Physical Scroll (Back to Albums)
  useLayoutEffect(() => {
    // Don't force scroll if we're in the middle of a virtual animation
    if (virtualProgress !== null) {
      return;
    }
    
    if (shouldStartScrolled) {
        // Only force scroll if we aren't already scrolled (avoids fighting browser restoration)
        if (window.scrollY < ANIMATION_CONFIG.DISTANCE) {
            window.scrollTo(0, ANIMATION_CONFIG.DISTANCE);
        }
        sessionStorage.removeItem('scrollToCatalog');
        requestAnimationFrame(() => setIsForcedScrolled(false));
    } else {
        setIsForcedScrolled(false);
    }
  }, [shouldStartScrolled, virtualProgress]); 

  // Handle Virtual Animation (Logo Click)
  useEffect(() => {
    if (shouldAnimateToTop) {
        sessionStorage.removeItem('animateToTop');
        // Clear scrollToCatalog to prevent scrolling after animation
        sessionStorage.removeItem('scrollToCatalog');
        
        // Ensure URL hash is cleared when starting animation
        if (location.hash === '#albums') {
          navigate(location.pathname, { replace: true });
        }
        
        // Ensure we're at the top of the page
        window.scrollTo(0, 0);
        
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
                // Animation complete - ensure we stay at top
                setVirtualProgress(null);
                // Ensure scroll position stays at top after animation
                // Use multiple attempts to ensure it sticks
                window.scrollTo(0, 0);
                requestAnimationFrame(() => {
                  window.scrollTo(0, 0);
                  // Prevent any scroll-to-catalog behavior
                  sessionStorage.removeItem('scrollToCatalog');
                });
            }
        };
        
        requestAnimationFrame(animate);
    }
  }, [shouldAnimateToTop, location.hash, location.pathname, navigate]);

  // Standard calculations
  const realProgress = getScrollProgress(scrollY);
  const realEasedProgress = getEasedProgress(realProgress);
  const headerOpacity = getHeaderOpacity(realProgress); // This depends on scrollY

  // Determine what to pass to visual components
  let effectiveEasedProgress = realEasedProgress;

  if (isForcedScrolled || isCatalogView) {
      // Force "End State" visuals if we are forced OR if the URL indicates we are in catalog view.
      // This prevents the "flash" of the intro animation on back-navigation/refresh.
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
          If we are virtual animating, hide content completely.
      */}
      <ContentSection scrollY={scrollY} isVirtualAnimation={virtualProgress !== null} />
    </>
  );
}