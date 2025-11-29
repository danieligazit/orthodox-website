import { ANIMATION_CONFIG } from '../config/constants';

const { DISTANCE, OPACITY } = ANIMATION_CONFIG;

/**
 * Normalizes scroll progress to a value between 0 and 1
 */
export function getScrollProgress(scrollY: number): number {
  return Math.min(Math.max(scrollY / DISTANCE, 0), 1);
}

/**
 * Applies cubic ease-out easing to progress
 */
export function getEasedProgress(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

/**
 * Calculates background rotation angle
 */
export function getBackgroundRotation(easedProgress: number): number {
  return easedProgress * -90; // Rotate CCW
}

/**
 * Calculates background Y translation to keep it centered
 */
export function getBackgroundTranslateY(
  easedProgress: number,
  windowHeight: number,
  headerHeight: number
): number {
  const centerOffset = windowHeight / 2 - headerHeight;
  return easedProgress * -centerOffset;
}

/**
 * Calculates logo scale based on scroll progress
 */
export function getLogoScale(easedProgress: number): number {
  const { START_SCALE, END_SCALE } = ANIMATION_CONFIG.LOGO;
  return START_SCALE - easedProgress * (START_SCALE - END_SCALE);
}

/**
 * Calculates logo Y position
 */
export function getLogoY(
  easedProgress: number,
  windowHeight: number,
  headerHeight: number
): number {
  const startY = windowHeight / 2;
  const endY = headerHeight / 2;
  return startY - easedProgress * (startY - endY);
}

/**
 * Calculates logo separation (gap between O and text)
 */
export function getLogoSeparation(easedProgress: number): number {
  const { START, END } = ANIMATION_CONFIG.SEPARATION;
  return START - easedProgress * (START - END);
}

/**
 * Calculates logo X shift for optical centering
 */
export function getLogoXShift(easedProgress: number, finalOffset: number): number {
  return finalOffset * easedProgress;
}

/**
 * Calculates square opacity with smoothstep easing
 */
export function getSquareOpacity(easedProgress: number): number {
  const { SQUARE_START, SQUARE_RANGE } = OPACITY;
  const rawOpacity = Math.min(
    Math.max(0, (easedProgress - SQUARE_START) / SQUARE_RANGE),
    1
  );
  // Smoothstep easing
  return rawOpacity * rawOpacity * (3 - 2 * rawOpacity);
}

/**
 * Calculates text color value based on square opacity
 */
export function getTextColorValue(squareOpacity: number): number {
  return Math.round(255 - squareOpacity * 255);
}

/**
 * Determines logo filter based on square opacity
 */
export function getLogoFilter(squareOpacity: number): string {
  return squareOpacity > 0.4 ? 'invert(1) brightness(2)' : 'none';
}

/**
 * Calculates header opacity
 */
export function getHeaderOpacity(progress: number): number {
  const { HEADER_START } = OPACITY;
  return Math.min(Math.max(0, (progress - HEADER_START) * 4), 1);
}

/**
 * Calculates content opacity
 */
export function getContentOpacity(scrollY: number): number {
  const { CONTENT_START } = OPACITY;
  const startScroll = DISTANCE * CONTENT_START;
  const range = DISTANCE * CONTENT_START;
  return Math.min(Math.max(0, (scrollY - startScroll) / range), 1);
}

/**
 * Calculates content translate Y for fade-in effect
 */
export function getContentTranslateY(scrollY: number): number {
  return Math.max(0, 50 - (scrollY - 300) / 6);
}

