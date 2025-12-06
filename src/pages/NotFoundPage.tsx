import { useNavigate } from 'react-router-dom';
import { BackgroundLayer, GrainOverlay, LogoLayer, Header } from '../components';
import { useWindowSize } from '../hooks/useWindowSize';

export function NotFoundPage() {
  const navigate = useNavigate();
  const windowHeight = useWindowSize();

  const easedProgress = 1;
  const headerOpacity = 1;

  return (
    <>
      <BackgroundLayer easedProgress={easedProgress} windowHeight={windowHeight} />
      <GrainOverlay />
      <LogoLayer easedProgress={easedProgress} windowHeight={windowHeight} />
      <Header opacity={headerOpacity} />

      <div className="relative z-20">
        <main className="w-full">
          <div className="max-w-6xl mx-auto px-6 py-32 min-h-screen">
            <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
              {/* 404 Number */}
              <h1 className="font-im-fell text-9xl md:text-[12rem] text-[#050505] mb-8 leading-none">
                404
              </h1>

              {/* Error Message */}
              <p className="font-im-fell text-2xl md:text-3xl text-[#050505] mb-4 uppercase tracking-widest">
                Page Not Found
              </p>

              <p className="font-im-fell text-lg text-[#666] mb-12 max-w-md">
                The page you're looking for doesn't exist or has been moved.
              </p>

              {/* Back to Home Button */}
              <button
                onClick={() => navigate('/')}
                className="font-im-fell uppercase tracking-widest text-sm border-2 border-[#050505] text-[#050505] bg-[#e8e6df] px-8 py-3 hover:bg-[#050505] hover:text-[#e8e6df] transition-all duration-500"
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

