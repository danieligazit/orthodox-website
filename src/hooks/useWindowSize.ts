import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [windowHeight, setWindowHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight;
    }
    return 800;
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowHeight;
}

