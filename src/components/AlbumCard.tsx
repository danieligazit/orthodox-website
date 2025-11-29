import type { Album } from '../types';

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const releaseYear = album.releaseDate
    ? new Date(album.releaseDate).getFullYear().toString()
    : '';

  return (
    <div className="group relative w-full transition-transform duration-500 hover:scale-[1.02]">
      <div className="aspect-square w-full border-2 border-[#333] bg-[#dcdad3] relative overflow-hidden shadow-2xl">
        <img
          src={`${import.meta.env.BASE_URL}${album.cover}`}
          alt={`${album.artist} - ${album.title}`}
          className="w-full h-full object-cover transition-all duration-500 group-hover:invert group-hover:brightness-110"
        />
      </div>

      <div className="mt-4 flex justify-between items-baseline font-im-fell uppercase tracking-widest text-sm">
        <span className="bg-[#050505] text-[#e8e6df] px-2 py-1 shadow-lg">
          {album.artist}
        </span>
        <span className="bg-[#e8e6df] text-[#050505] px-2 py-0.25 border border-[#050505] shadow-lg">
          {releaseYear}
        </span>
      </div>
      <h3 className="text-center mt-2 text-2xl font-im-fell mix-blend-difference text-[#666] font-bold">
        {album.title}
      </h3>
    </div>
  );
}

