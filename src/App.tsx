import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AlbumPage } from './pages/AlbumPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/album/:id" element={<AlbumPage />} />
      </Routes>
    </BrowserRouter>
  );
}
