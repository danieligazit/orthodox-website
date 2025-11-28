import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Disc, ShoppingBag } from 'lucide-react';

// --- Configuration ---
const HEADER_HEIGHT = 120; // px
const ANIMATION_DISTANCE = 800; // scroll px to finish animation

// --- Mock Data ---
const ALBUMS = [
  {
    id: 1,
    artist: "Henri Schaeffer",
    title: "Object Sonore I",
    year: "1958 (Reissue)",
    coverType: "geometric",
    description: "A foundational exploration of tape loops and railroad mechanics. Raw, industrial, and uncompromising.",
    tracks: ["Etude aux Chemins", "Symphonie Pour Un Homme Seul", "Oiseau Trak", "Cinq Études de Bruits"]
  },
  {
    id: 2,
    artist: "Daphne Oram",
    title: "Drawn Sound",
    year: "1962",
    coverType: "noise",
    description: "Synthesized sounds created by drawing directly onto 35mm film stock. The visual becomes the auditory.",
    tracks: ["Pulse Persephone", "Bird of Parallax", "Rockets in Ursa Major", "Four Aspects"]
  },
  {
    id: 3,
    artist: "Basinski & The Decay",
    title: "Disintegration Loops IV",
    year: "2002",
    coverType: "minimal",
    description: "The sound of memory fading. Tape loops recorded as they physically deteriorate on the playhead.",
    tracks: ["dlp 1.1", "dlp 2.2", "dlp 3", "dlp 4", "dlp 5", "dlp 6"]
  },
  {
    id: 4,
    artist: "Xenakis",
    title: "Concrete Ph",
    year: "1958",
    coverType: "abstract",
    description: "Mathematical stochastic synthesis applied to the sound of burning charcoal.",
    tracks: ["Concret PH", "Diamorphoses", "Orient-Occident", "Bohor"]
  },
  {
    id: 5,
    artist: "Delia Derbyshire",
    title: "The Dreams",
    year: "1964",
    coverType: "lines",
    description: "Collages of people describing their dreams, set to electronic textures constructed from single sine waves.",
    tracks: ["Running", "Falling", "Land", "Sea", "Colour"]
  }
];

// --- Sub-Components ---

const AlbumCard = ({ album, onClick }) => {
  return (
    <div 
      onClick={() => onClick(album)}
      className="group relative cursor-pointer w-full max-w-md mx-auto mb-24 transition-transform duration-500 hover:scale-[1.02]"
    >
      <div className="aspect-square w-full border-2 border-[#333] bg-[#dcdad3] relative overflow-hidden shadow-2xl">
        {album.coverType === 'geometric' && (
           <div className="absolute inset-0 bg-[#050505] flex items-center justify-center">
             <div className="w-1/2 h-1/2 border-4 border-[#e8e6df] rounded-full mix-blend-difference animate-pulse"></div>
           </div>
        )}
        {album.coverType === 'noise' && (
           <div className="absolute inset-0 bg-[#1a1a1a] opacity-80" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}}></div>
        )}
        {album.coverType === 'minimal' && (
           <div className="absolute inset-0 bg-[#e8e6df] flex flex-col justify-between p-4">
             <div className="w-full h-1 bg-[#050505]"></div>
             <div className="w-full h-px bg-[#050505] opacity-30"></div>
           </div>
        )}
        {album.coverType === 'abstract' && (
           <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
             <div className="w-32 h-32 border border-[#e8e6df] rotate-45 mix-blend-exclusion"></div>
             <div className="w-32 h-32 border border-[#e8e6df] -rotate-12 absolute mix-blend-exclusion"></div>
           </div>
        )}
        {album.coverType === 'lines' && (
           <div className="absolute inset-0 bg-[#dcdad3] flex flex-col justify-center space-y-2 p-8">
             {[...Array(10)].map((_, i) => (
               <div key={i} className="w-full bg-[#050505]" style={{height: `${Math.random() * 4 + 1}px`, opacity: Math.random()}}></div>
             ))}
           </div>
        )}
        
        <div className="absolute inset-0 bg-[#050505]/0 group-hover:bg-[#050505]/90 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 text-[#e8e6df] font-im-fell">
            <span className="text-xl italic">Listen</span>
            <Disc className="mt-2 w-6 h-6 animate-spin-slow" />
        </div>
      </div>

      <div className="mt-4 flex justify-between items-baseline font-im-fell uppercase tracking-widest text-sm">
        <span className="bg-[#050505] text-[#e8e6df] px-2 py-1 shadow-lg">{album.artist}</span>
        <span className="bg-[#e8e6df] text-[#050505] px-2 py-1 border border-[#050505] shadow-lg">{album.year}</span>
      </div>
      <h3 className="text-center mt-2 text-2xl font-im-fell mix-blend-difference text-[#444] font-bold">{album.title}</h3>
    </div>
  );
};

const DetailView = ({ album, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="w-full md:w-1/2 bg-[#050505] text-[#e8e6df] h-full overflow-y-auto p-8 md:p-16 flex flex-col relative">
        <button onClick={onClose} className="absolute top-8 left-8 hover:opacity-50 transition-opacity flex items-center gap-2 font-im-fell">
          <ArrowLeft size={16} /> RETURN
        </button>
        
        <div className="mt-20 md:mt-auto">
          <h1 className="font-im-fell text-5xl md:text-7xl mb-4 leading-none">{album.title}</h1>
          <h2 className="font-im-fell text-xl md:text-2xl italic text-[#666] mb-8">{album.artist} — {album.year}</h2>
          
          <p className="font-sans text-sm md:text-base leading-relaxed text-[#999] max-w-md border-l border-[#333] pl-6">
            {album.description}
          </p>

          <div className="mt-12 flex gap-4">
             <button className="px-8 py-3 bg-[#e8e6df] text-[#050505] font-im-fell hover:bg-[#dcdad3] transition-colors flex items-center gap-2">
               <Play size={16} fill="currentColor" /> PLAY SIDES
             </button>
             <button className="px-8 py-3 border border-[#e8e6df] text-[#e8e6df] font-im-fell hover:bg-[#e8e6df]/10 transition-colors">
               ADD TO CART
             </button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-[#e8e6df] text-[#050505] h-full overflow-y-auto p-8 md:p-16 relative">
        <div className="h-full flex flex-col justify-center">
          <div className="mb-8 font-im-fell text-xs tracking-[0.2em] border-b-2 border-[#050505] pb-2 uppercase">
            Tracklist / Catalog No. ORTH-{album.id}00
          </div>
          
          <ul className="space-y-6">
            {album.tracks.map((track, i) => (
              <li key={i} className="group flex items-center justify-between cursor-pointer border-b border-transparent hover:border-[#050505] transition-all pb-2">
                <span className="font-im-fell text-2xl md:text-3xl text-[#999] group-hover:text-[#050505] transition-colors">
                  {i + 1}. {track}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono">
                  0{Math.floor(Math.random() * 5) + 2}:00
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function OrthodoxLabel() {
  const [scrollY, setScrollY] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [windowHeight, setWindowHeight] = useState(800);

  useEffect(() => {
    // Initial measure
    setWindowHeight(window.innerHeight);

    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    
    const handleResize = () => setWindowHeight(window.innerHeight);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
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
  const startScale = 1; 
  const endScale = 0.2; // Approximate scale down factor
  const currentScale = startScale - (easeProgress * (startScale - endScale));

  // 4. Logo Translation (Y Axis)
  const startLogoY = windowHeight / 2;
  const endLogoY = HEADER_HEIGHT / 2;
  const currentLogoY = startLogoY - (easeProgress * (startLogoY - endLogoY));

  // 5. Logo Separation (Gap)
  const startSeparation = 1; 
  const endSeparation = 0;
  const currentSeparation = startSeparation - (easeProgress * (startSeparation - endSeparation));

  // 6. Centering Correction (Horizontal Shift)
  // At start (0), we want the split (between O and R) to be at center screen. Shift = 0.
  // At end (1), we want the WHOLE WORD centered. 
  // currently the split is centered. The center of "ORTHODOX" is roughly between 'H' and 'O'.
  // The distance from the split ("O|R") to the visual center ("H|O") is roughly width of "RTH".
  // We need to shift LEFT by this amount.
  // Using 'em' units ensures it scales perfectly with the shrinking logo.
  const endXShift = -2.2; // Shift left by ~2.2em (approx 3 characters)
  const currentXShift = easeProgress * endXShift;

  return (
    <div className="min-h-screen w-full relative bg-[#e8e6df]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap');
        .font-im-fell { font-family: 'IM Fell English', serif; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
        
        /* Noise animation */
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        .animate-noise { animation: noise 0.2s steps(4) infinite; }
      `}</style>

      {/* --- BACKGROUND LAYER --- */}
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

      {/* Global Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.08] z-10 mix-blend-overlay overflow-hidden">
         <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] animate-noise"
           style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}}>
         </div>
      </div>

      {/* Detail Modal */}
      {selectedAlbum && (
        <DetailView album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
      )}

      {/* --- LOGO LAYER (The Solution) --- */}
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
         {/* Inner container handles the font-size dependent translateX shift */}
         <div 
            className="w-full flex items-center font-im-fell leading-none whitespace-nowrap"
            style={{ 
              fontSize: 'clamp(2rem, 12vw, 10rem)',
              transform: `translateX(${currentXShift}em)` // Apply centering shift here
            }}
         >
            {/* LEFT SIDE (The O) */}
            <div 
                className="w-1/2 flex justify-end" 
                style={{ paddingRight: `${currentSeparation}vw` }}
            >
                <span>O</span>
            </div>

            {/* RIGHT SIDE (The rest) */}
            <div 
                className="w-1/2 flex justify-start tracking-tighter" 
                style={{ paddingLeft: `${currentSeparation}vw` }}
            >
                <span>RTHODOX</span>
            </div>
         </div>
      </div>

      {/* Header Controls (Fade in) */}
      <div 
        className="fixed top-0 w-full z-40 flex justify-between px-8 items-center h-[120px] mix-blend-difference text-white pointer-events-none"
        style={{ opacity: progress > 0.8 ? 1 : 0, transition: 'opacity 0.5s' }}
      >
         <div className="w-1/3"></div> {/* Spacer for Logo */}
         <div className="flex gap-8 pointer-events-auto">
             <span className="text-sm font-im-fell uppercase tracking-widest cursor-pointer hover:underline">About</span>
             <span className="text-sm font-im-fell uppercase tracking-widest cursor-pointer hover:underline">Journal</span>
             <ShoppingBag className="w-5 h-5 cursor-pointer" />
         </div>
      </div>

      {/* Scroll Indicator */}
      <div 
          className="fixed bottom-12 left-1/2 -translate-x-1/2 font-im-fell animate-bounce text-sm tracking-widest mix-blend-difference text-white z-40 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - progress * 4) }}
        >
          SCROLL TO ROTATE
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className={`relative z-30 transition-opacity duration-500 ${selectedAlbum ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <main className="w-full">
            {/* Scroll Spacer */}
            <div style={{ height: `${ANIMATION_DISTANCE}px` }}></div>

            {/* Content Container */}
            <div 
                className="max-w-7xl mx-auto px-4 pb-32 min-h-screen"
                style={{ 
                    // Reveal content logic
                    opacity: Math.max(0, (scrollY - ANIMATION_DISTANCE + 200) / 400),
                    transform: `translateY(${Math.max(0, 100 - (scrollY - ANIMATION_DISTANCE + 200)/10)}px)`
                }}
            >
                <div className="h-48 md:h-64"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
                    {ALBUMS.map((album, index) => (
                        <div 
                        key={album.id} 
                        className={`${index % 2 === 0 ? 'md:translate-x-12' : 'md:-translate-x-12 md:mt-48'}`}
                        >
                        <AlbumCard album={album} onClick={setSelectedAlbum} />
                        </div>
                    ))}
                </div>
            
                {/* Footer */}
                <div className="mt-48 text-center font-im-fell pb-12">
                <div className="inline-block border-2 border-[#050505] bg-[#e8e6df] p-8 hover:bg-[#050505] hover:text-[#e8e6df] transition-colors duration-500 cursor-pointer shadow-lg group">
                    <h3 className="text-2xl">SUBSCRIBE TO NEWSLETTER</h3>
                    <p className="text-sm mt-2 italic group-hover:text-[#999]">Receive magnetic tape via post</p>
                </div>
                <div className="mt-12 text-[#444] text-xs tracking-widest uppercase mix-blend-difference">
                    &copy; 2024 Orthodox Recordings. Musique Concrète.
                </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}