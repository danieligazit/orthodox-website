// Animation configuration
export const ANIMATION_CONFIG = {
  HEADER_HEIGHT: 90, // px
  DISTANCE: 800, // px - total scroll distance for animation
  LOGO: {
    START_SCALE: 0.75,
    END_SCALE: 0.39, // Increased for a bigger final logo
  },
  SEPARATION: {
    START: 0.4, // vw
    END: 0,
  },
  OPACITY: {
    SQUARE_START: 0.85,
    SQUARE_RANGE: 0.15,
    HEADER_START: 0.75,
    CONTENT_START: 0.5,
  },
} as const;

// Theme colors
export const THEME_COLORS = {
  background: '#e8e6df',
  foreground: '#050505',
  textLight: '#e8e6df',
  textDark: '#666',
  border: '#333',
} as const;

