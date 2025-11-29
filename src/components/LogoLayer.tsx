import { useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  getLogoRotation,
} from '../utils/animation';
import { ANIMATION_CONFIG } from '../config/constants';

interface LogoLayerProps {
  easedProgress: number;
  windowHeight: number;
  onClick?: () => void;
}

export function LogoLayer({ easedProgress, windowHeight, onClick }: LogoLayerProps) {
  const logoSquareRef = useRef<HTMLDivElement>(null);
  const textLabelRef = useRef<HTMLDivElement>(null);
  const finalOffset = useLogoCentering(logoSquareRef, textLabelRef);
  const navigate = useNavigate();
  const location = useLocation();

  const scale = getLogoScale(easedProgress);
  const logoY = getLogoY(easedProgress, windowHeight, ANIMATION_CONFIG.HEADER_HEIGHT);
  const separation = getLogoSeparation(easedProgress);
  const xShift = getLogoXShift(easedProgress, finalOffset);
  const squareOpacity = getSquareOpacity(easedProgress);
  const textColorVal = getTextColorValue(squareOpacity);
  const logoFilter = getLogoFilter(squareOpacity);
  const logoRotation = getLogoRotation(easedProgress);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // If already on homepage, just scroll smoothly to top to show animation
      if (location.pathname === '/') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        // Navigate to homepage at top (unscrolled)
        // Set sessionStorage as fallback
        sessionStorage.setItem('scrollToCatalog', 'false');
        navigate('/', { state: { scrollToCatalog: false } });
      }
    }
  };

  return (
    <div
      className="fixed z-50 mix-blend-difference text-white w-full h-screen flex justify-center pointer-events-none"
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
          className="w-1/2 flex justify-end pointer-events-auto"
          style={{ paddingRight: `${separation}vw` }}
        >
          <div
            ref={logoSquareRef}
            className="flex items-center justify-center relative cursor-pointer"
            style={{
              marginTop: '-0.1em',
              marginRight: '0.04em',
              width: '0.8em',
              height: '0.8em',
              backgroundColor: `rgba(232, 230, 223, ${squareOpacity})`,
              color: `rgb(${textColorVal}, ${textColorVal}, ${textColorVal})`,
            }}
            onClick={handleClick}
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
                transform: `rotate(${logoRotation}deg)`,
                transformOrigin: 'center center',
                // Remove the transition for filter and mix-blend-mode
                // transition: 'filter 0.2s ease, mix-blend-mode 0.2s ease',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDE (The Text) */}
        <div
          className="w-1/2 flex justify-start tracking-tighter pointer-events-auto"
          style={{ paddingLeft: `${separation}vw` }}
        >
          <span 
            ref={textLabelRef}
            className="cursor-pointer"
            onClick={handleClick}
          >
            RTHODOX
          </span>
        </div>
      </div>
    </div>
  );
}

