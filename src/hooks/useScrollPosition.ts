import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(() => {
    if (typeof window === 'undefined') return 0;
    
    // 1. Prefer actual physical scroll if available and non-zero
    if (window.scrollY > 0) return window.scrollY;

    // 2. Fallback to session storage keyed by history entry
    // This ensures we only restore scroll for the specific history state (e.g. Back button)
    // and not for new navigations to the same page.
    // We use window.history.state.key (provided by React Router) to distinguish history entries.
    const key = window.history.state?.key || 'default';
    const saved = sessionStorage.getItem(`scroll_pos_${key}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);
      
      // Save scroll position for this specific history entry
      const key = window.history.state?.key || 'default';
      sessionStorage.setItem(`scroll_pos_${key}`, currentY.toString());
    };

    // Note: We deliberately SKIP calling handleScroll() immediately here.
    // If we are waiting for browser scroll restoration (where window.scrollY is temporarily 0),
    // calling it now would overwrite our correct initial state from sessionStorage with 0,
    // causing a flash. We rely on the 'scroll' event which fires when restoration completes.

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
}