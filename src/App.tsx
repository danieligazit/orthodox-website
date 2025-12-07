import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AlbumPage } from './pages/AlbumPage';
import { AboutPage } from './pages/AboutPage';
import { PressPage } from './pages/PressPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen w-full relative bg-[#e8e6df]"> {/* Add persistent background here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/album/:urlPath" element={<AlbumPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
