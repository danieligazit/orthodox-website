import { useState, useLayoutEffect, RefObject } from 'react';

export function useLogoCentering(
  logoSquareRef: RefObject<HTMLDivElement>,
  textLabelRef: RefObject<HTMLDivElement>
) {
  const [finalOffset, setFinalOffset] = useState(0);

  useLayoutEffect(() => {
    const calculateCenter = () => {
      if (logoSquareRef.current && textLabelRef.current) {
        const logoWidth = logoSquareRef.current.offsetWidth;
        const textWidth = textLabelRef.current.offsetWidth;

        // The mass of the text is heavier. We calculate how much to shift LEFT
        // so the midpoint of the entire word hits the center of the screen.
        const diff = textWidth - logoWidth;
        setFinalOffset(-(diff / 2));
      }
    };

    calculateCenter();
    window.addEventListener('resize', calculateCenter);
    // document.fonts.ready ensures we measure after the custom font loads
    document.fonts.ready.then(calculateCenter);

    return () => window.removeEventListener('resize', calculateCenter);
  }, [logoSquareRef, textLabelRef]);

  return finalOffset;
}

