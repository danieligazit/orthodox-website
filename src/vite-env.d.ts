/// <reference types="vite/client" />

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        config: {
          videoId?: string;
          height?: string;
          width?: string;
          playerVars?: Record<string, number>;
          events?: { onStateChange?: (e: { data: number }) => void };
        }
      ) => { destroy: () => void };
      PlayerState?: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
    Vimeo?: {
      Player: new (el: HTMLIFrameElement) => {
        on(event: 'play' | 'pause', cb: () => void): void;
      };
    };
  }
}

export {};

