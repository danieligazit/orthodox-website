import { Link } from 'react-router-dom';
import type { Album } from '../types';

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  // Generate serial number from album id (ORTH001, ORTH002, etc.)
  const serialNumber = `ORTH${album.id.toString().padStart(3, '0')}`;

  return (
    <Link to={`/album/${album.id}`} className="group relative w-full transition-transform duration-500 hover:scale-[1.02] block">
      <div className="aspect-square w-full border-2 border-[#333] bg-[#dcdad3] relative overflow-hidden shadow-2xl">
        <img
          src={`${import.meta.env.BASE_URL}${album.cover}`}
          alt={`${album.artist} - ${album.title}`}
          className="w-full h-full object-cover transition-all duration-500 group-hover:invert group-hover:brightness-110"
        />
      </div>

      <div className="mt-4 font-im-fell uppercase tracking-widest flex items-end justify-between gap-4 w-full">
        <div className="flex flex-col items-start gap-1">
          <span className="bg-[#050505] text-[#e8e6df] py-1 shadow-lg whitespace-nowrap text-xs">
            {album.artist}
          </span>
          <span className="text-[#e8e6df] font-bold text-lg leading-none">
            {album.title}
          </span>
        </div>
        <span className="text-sm bg-[#e8e6df] text-[#050505] px-2 py-1 border border-[#050505] shadow-lg whitespace-nowrap flex-shrink-0">
          {serialNumber}
        </span>
      </div>
    </Link>
  );
}

