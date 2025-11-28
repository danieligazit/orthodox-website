import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import type { Album } from './types';
import logoImage from './assets/orthodox-o-logo-transparent.png';

// --- Configuration ---
const HEADER_HEIGHT = 80; // px
const ANIMATION_DISTANCE = 600; 

const ALBUMS: Album[] = [
  {
    id: 1,
    artist: "Daniella Ljungsberg",
    title: "I Do Care",
    releaseDate: "2024-02-14",
    cover: "i_do_care.jpg"
  },
  {
    id: 2,
    artist: "Na'ama Zisser",
    title: "From Behind the Door",
    releaseDate: "2024-06-21",
    cover: "from_behind_the_door.jpg"
  },
  {
    id: 3,
    artist: "Kashaiof",
    title: "Days",
    releaseDate: "2024-08-30",
    cover: "days.jpg"
  },
  {
    id: 4,
    artist: "Wackelkontakt",
    title: "Change the Process",
    releaseDate: "2024-10-25",
    cover: "change_the_process.jpg"
  },
  {
    id: 5,
    artist: "Cadaver Eyes",
    title: "Road Extends",
    releaseDate: "2024-12-20",
    cover: "road_extends.jpg"
  },
  {
    id: 6,
    artist: "Daniella Ljungsberg",
    title: "Do I Care",
    releaseDate: "2025-02-15",
    cover: "do_i_care.jpg"
  },
  {
    id: 7,
    artist: "SEVELLE",
    title: "Turn of a Millstone",
    releaseDate: "2025-04-11",
    cover: "turn_of_a_millstone.jpg"
  }
];

// --- Sub-Components ---

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  // Format release date to show year
  const releaseYear = album.releaseDate ? new Date(album.releaseDate).getFullYear().toString() : '';
  
  return (
    <div 
      className="group relative w-full transition-transform duration-500 hover:scale-[1.02]"
    >
      <div className="aspect-square w-full border-2 border-[#333] bg-[#dcdad3] relative overflow-hidden shadow-2xl">
        <img 
          src={`${import.meta.env.BASE_URL}${album.cover}`}
          alt={`${album.artist} - ${album.title}`}
          className="w-full h-full object-cover transition-all duration-500 group-hover:invert group-hover:brightness-110"
        />
      </div>

      <div className="mt-4 flex justify-between items-baseline font-im-fell uppercase tracking-widest text-sm">
        <span className="bg-[#050505] text-[#e8e6df] px-2 py-1 shadow-lg">{album.artist}</span>
        <span className="bg-[#e8e6df] text-[#050505] px-2 py-0.25 border border-[#050505] shadow-lg">{releaseYear}</span>
      </div>
      <h3 className="text-center mt-2 text-2xl font-im-fell mix-blend-difference text-[#666] font-bold">{album.title}</h3>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(800);

  // --- NEW REFS & STATE FOR CENTERING ---
  const logoSquareRef = useRef<HTMLDivElement>(null);
  const textLabelRef = useRef<HTMLDivElement>(null);
  const [finalOffset, setFinalOffset] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setWindowHeight(window.innerHeight);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // --- MEASUREMENT LOGIC ---
  // Calculates where the logo *should* be when fully merged
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
  }, []);

  // --- Animation Physics ---
  
  // Normalized progress (0 to 1)
  const progress = Math.min(Math.max(scrollY / ANIMATION_DISTANCE, 0), 1);
  const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out for smoother feel

  // 1. Background Rotation
  const rotation = easeProgress * -90; // Rotate CCW
  
  // 2. Background Translation Correction
  const centerOffset = (windowHeight / 2) - HEADER_HEIGHT;
  const bgTranslateY = easeProgress * -centerOffset;

  // 3. Logo Scaling
  const startScale = 0.75; // Smaller at start
  const endScale = 0.26; // Smaller at end when merged
  const currentScale = startScale - (easeProgress * (startScale - endScale));

  // 4. Logo Translation (Y Axis)
  const startLogoY = windowHeight / 2;
  const endLogoY = HEADER_HEIGHT / 2;
  const currentLogoY = startLogoY - (easeProgress * (startLogoY - endLogoY));

  // Separation logic (Gap closing)
  const startSeparation = 0.4; 
  const endSeparation = 0;
  const currentSeparation = startSeparation - (easeProgress * (startSeparation - endSeparation));

  // --- THE FIX: INTERPOLATED X SHIFT ---
  // Start (0%): 0px shift (Gap is perfectly centered by CSS layout)
  // End (100%): finalOffset (Optical center calculated by JS)
  const currentXShiftPx = finalOffset * easeProgress;

  // 7. Logo Square Opacity - appears later and more gradually
  const squareOpacityStart = 0.85; // Start appearing later (was 0.8)
  const squareOpacityRange = 0.15; // Range over which it fades in
  const squareOpacityRaw = Math.min(Math.max(0, (easeProgress - squareOpacityStart) / squareOpacityRange), 1);
  // Apply smooth easing to make it more gradual with more intermediate states
  const squareOpacity = squareOpacityRaw * squareOpacityRaw * (3 - 2 * squareOpacityRaw); // Smoothstep easing

  // 8. O Text Color Calculation
  const textColorVal = Math.round(255 - (squareOpacity * 255));
  
  // Logo filter: make it white when square is fully opaque
  // Invert to white when square opacity is high enough
  const logoFilter = squareOpacity > 0.4 ? 'invert(1) brightness(2)' : 'none';

  // 9. HEADER & CURTAIN OPACITY
  // Linked directly to progress (starts at 75%, full at 100%)
  const headerOpacity = Math.min(Math.max(0, (progress - 0.75) * 4), 1);

  // 10. CONTENT OPACITY (NEW LOGIC)
  // Starts appearing at 50% of the scroll animation (300px)
  // Reaches full opacity by 100% of the scroll animation (600px)
  const contentOpacity = Math.min(Math.max(0, (scrollY - (ANIMATION_DISTANCE * 0.5)) / (ANIMATION_DISTANCE * 0.5)), 1);

  return (
    <div className="min-h-screen w-full relative bg-[#e8e6df]">
      {/* Fixed background to prevent white showing through on scroll */}
      <div className="fixed bg-[#e8e6df] -z-10 pointer-events-none" style={{
        top: '-50px',
        left: '-50px',
        right: '-50px',
        bottom: '-50px',
        width: 'calc(100vw + 100px)',
        height: 'calc(100vh + 100px)'
      }}></div>
      
      {/* --- BACKGROUND LAYER (Z-0) --- */}
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <div 
           className="relative"
           style={{
             transform: `translateY(${bgTranslateY}px) rotate(${rotation}deg)`,
             transformOrigin: 'center center',
             willChange: 'transform'
           }}
        >
             {/* THE BLACK PLANE */}
             <div 
               className="bg-[#050505] absolute right-0 top-1/2"
               style={{
                 width: '300vmax',
                 height: '300vmax',
                 transform: 'translate(0, -50%)' // Center vertically relative to the anchor
               }}
             />
        </div>
      </div>

      {/* Global Grain Overlay (Z-10) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.08] z-10 mix-blend-overlay overflow-hidden">
         <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] animate-noise"
           style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}}>
         </div>
      </div>

      {/* --- LOGO LAYER (Z-50) --- */}
      <div 
        className="fixed z-50 pointer-events-none mix-blend-difference text-white w-full h-screen flex justify-center"
        style={{
            top: `${currentLogoY}px`,
            left: 0,
            transform: `translateY(-50%) scale(${currentScale})`, 
            transformOrigin: 'center center',
            willChange: 'top, transform'
        }}
      >
         <div 
            className="w-full flex items-center font-im-fell leading-none whitespace-nowrap"
            style={{ 
              fontSize: 'clamp(1.5rem, 9vw, 7.5rem)',
              // APPLY THE INTERPOLATED PIXEL SHIFT HERE
              transform: `translateX(${currentXShiftPx}px)` 
            }}
         >
            {/* LEFT SIDE (The O) */}
            <div 
                className="w-1/2 flex justify-end" 
                style={{ paddingRight: `${currentSeparation}vw` }}
            >
                {/* ATTACH REF FOR MEASUREMENT */}
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
                            transition: 'filter 0.2s ease, mix-blend-mode 0.2s ease'
                        }} 
                    />
                </div>
            </div>

            {/* RIGHT SIDE (The Text) */}
            <div 
                className="w-1/2 flex justify-start tracking-tighter" 
                style={{ paddingLeft: `${currentSeparation}vw` }}
            >
                {/* ATTACH REF FOR MEASUREMENT */}
                <span ref={textLabelRef}>RTHODOX</span>
            </div>
         </div>
      </div>

      {/* --- HEADER CURTAIN (Z-30) --- */}
      <div 
        className="fixed top-0 w-full h-[80px] z-30 bg-[#e8e6df]"
        style={{ 
            opacity: headerOpacity, 
            willChange: 'opacity'
        }}
      />

      {/* --- HEADER CONTROLS (Z-40) --- */}
      <div 
        className="fixed top-0 w-full z-40 flex justify-between px-8 items-center h-[80px] mix-blend-difference text-white pointer-events-none"
        style={{ opacity: headerOpacity }}
      >
         <div className="w-1/3"></div> {/* Spacer for Logo */}
         <div className="flex gap-8 pointer-events-auto">
             <span className="relative text-sm font-im-fell uppercase tracking-widest cursor-pointer group">
                 ABOUT
                 <span className="absolute left-0 top-1/2 w-full h-px bg-white transform -translate-y-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
             </span>
             <span className="relative text-sm font-im-fell uppercase tracking-widest cursor-pointer group">
                 PRESS
                 <span className="absolute left-0 top-1/2 w-full h-px bg-white transform -translate-y-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
             </span>
         </div>
      </div>

      {/* Scroll Indicator */}
      {/* <div 
          className="fixed bottom-12 left-1/2 -translate-x-1/2 font-im-fell animate-bounce text-sm tracking-widest mix-blend-difference text-white z-40 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - progress * 4) }}
        >
          SCROLL TO ROTATE
      </div> */}

      {/* --- CONTENT LAYER (Z-20) --- */}
      <div className="relative z-20">
        <main className="w-full">
            {/* Scroll Spacer - Matches the animation distance to prevent jumpiness */}
            <div style={{ height: `${ANIMATION_DISTANCE}px` }}></div>

            {/* Content Container */}
            <div 
                className="max-w-7xl mx-auto px-4 pb-32 min-h-screen"
                style={{ 
                    // Overlaps animation. Starts appearing at 50% scroll.
                    opacity: contentOpacity,
                    // Reduced travel distance (50px) for faster settling.
                    transform: `translateY(${Math.max(0, 50 - (scrollY - 300)/6)}px)`
                }}
            >
                {/* Spacer between header and first row */}
                <div className="h-48 md:h-64"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {[...ALBUMS].sort((a, b) => {
                        // Sort by releaseDate descending (newest first)
                        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
                    }).map((album) => (
                        <AlbumCard key={album.id} album={album} />
                    ))}
                </div>
            
                {/* Footer */}
                <div className="mt-48 text-center font-im-fell pb-12">
                <div className="inline-block border-1 border-[#050505] bg-[#e8e6df] p-8 hover:bg-[#050505] hover:text-[#e8e6df] transition-colors duration-500 cursor-pointer shadow-lg group">
                    <h3 className="text-lg">SUBSCRIBE TO NEWSLETTER</h3>
                </div>
                <div className="mt-12 text-[#444] text-xs tracking-widest uppercase mix-blend-difference">
                    &copy; 2025 Orthodox Records.
                </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}

