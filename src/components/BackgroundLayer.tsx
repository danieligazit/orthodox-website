import { getBackgroundRotation, getBackgroundTranslateY } from '../utils/animation';
import { ANIMATION_CONFIG } from '../config/constants';

interface BackgroundLayerProps {
  easedProgress: number;
  windowHeight: number;
}

export function BackgroundLayer({ easedProgress, windowHeight }: BackgroundLayerProps) {
  const rotation = getBackgroundRotation(easedProgress);
  const translateY = getBackgroundTranslateY(
    easedProgress,
    windowHeight,
    ANIMATION_CONFIG.HEADER_HEIGHT
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
      <div
        className="relative"
        style={{
          transform: `translateY(${translateY}px) rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* THE BLACK PLANE */}
        <div
          className="bg-[#050505] absolute right-0 top-1/2"
          style={{
            width: '300vmax',
            height: '300vmax',
            transform: 'translate(0, -50%)', // Center vertically relative to the anchor
          }}
        />
      </div>
    </div>
  );
}

