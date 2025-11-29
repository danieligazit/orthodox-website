import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AlbumPage } from './pages/AlbumPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen w-full relative bg-[#e8e6df]"> {/* Add persistent background here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
