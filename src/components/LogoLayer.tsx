import { useRef } from 'react';
import logoImage from '../assets/orthodox-o-logo-transparent.png';
import { useLogoCentering } from '../hooks/useLogoCentering';
import {
  getLogoScale,
  getLogoY,
  getLogoSeparation,
  getLogoXShift,
  getSquareOpacity,
  getTextColorValue,
  getLogoFilter,
} from '../utils/animation';
import { ANIMATION_CONFIG } from '../config/constants';

interface LogoLayerProps {
  easedProgress: number;
  windowHeight: number;
}

export function LogoLayer({ easedProgress, windowHeight }: LogoLayerProps) {
  const logoSquareRef = useRef<HTMLDivElement>(null);
  const textLabelRef = useRef<HTMLDivElement>(null);
  const finalOffset = useLogoCentering(logoSquareRef, textLabelRef);

  const scale = getLogoScale(easedProgress);
  const logoY = getLogoY(easedProgress, windowHeight, ANIMATION_CONFIG.HEADER_HEIGHT);
  const separation = getLogoSeparation(easedProgress);
  const xShift = getLogoXShift(easedProgress, finalOffset);
  const squareOpacity = getSquareOpacity(easedProgress);
  const textColorVal = getTextColorValue(squareOpacity);
  const logoFilter = getLogoFilter(squareOpacity);

  return (
    <div
      className="fixed z-50 pointer-events-none mix-blend-difference text-white w-full h-screen flex justify-center"
      style={{
        top: `${logoY}px`,
        left: 0,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: 'center center',
        willChange: 'top, transform',
      }}
    >
      <div
        className="w-full flex items-center font-im-fell leading-none whitespace-nowrap"
        style={{
          fontSize: 'clamp(1.5rem, 9vw, 7.5rem)',
          transform: `translateX(${xShift}px)`,
        }}
      >
        {/* LEFT SIDE (The O) */}
        <div
          className="w-1/2 flex justify-end"
          style={{ paddingRight: `${separation}vw` }}
        >
          <div
            ref={logoSquareRef}
            className="flex items-center justify-center relative"
            style={{
              marginTop: '-0.1em',
              marginRight: '0.04em',
              width: '0.8em',
              height: '0.8em',
              backgroundColor: `rgba(232, 230, 223, ${squareOpacity})`,
              color: `rgb(${textColorVal}, ${textColorVal}, ${textColorVal})`,
            }}
          >
            <img
              src={logoImage}
              alt="O"
              style={{
                display: 'block',
                width: '1.06em',
                height: '1.06em',
                objectFit: 'contain',
                filter: logoFilter,
                mixBlendMode: squareOpacity > 0.4 ? 'normal' : 'difference',
                transition: 'filter 0.2s ease, mix-blend-mode 0.2s ease',
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE (The Text) */}
        <div
          className="w-1/2 flex justify-start tracking-tighter"
          style={{ paddingLeft: `${separation}vw` }}
        >
          <span ref={textLabelRef}>RTHODOX</span>
        </div>
      </div>
    </div>
  );
}

