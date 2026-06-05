import { Album } from '../types';
import { INITIAL_ALBUMS } from '../data';
import { BookOpen, Check, Award, PlusCircle } from 'lucide-react';

interface AlbumSelectionScreenProps {
  activeAlbumId: string;
  onSelectAlbum: (albumId: string) => void;
  onNext: () => void;
  hideNextButton?: boolean;
}

export default function AlbumSelectionScreen({
  activeAlbumId,
  onSelectAlbum,
  onNext,
  hideNextButton = false
}: AlbumSelectionScreenProps) {
  return (
    <div className="px-6 py-4 max-w-sm mx-auto w-full space-y-5">
      <div className="text-left">
        <h2 className="text-2xl font-black text-gray-900 font-display flex items-center gap-2">
          Elegí tu Álbum Activo <BookOpen size={20} className="text-indigo-600" />
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Podés intercambiar figuritas para un álbum a la vez. Seleccioná cuál estás completando ahora:
        </p>
      </div>

      {/* Grid of Albums */}
      <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
        {INITIAL_ALBUMS.map((album) => {
          const isSelected = album.id === activeAlbumId;
          return (
            <button
              key={album.id}
              onClick={() => onSelectAlbum(album.id)}
              className={`w-full flex items-center gap-3 p-3 text-left rounded-2xl border-2 transition duration-250 relative overflow-hidden ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                  : 'border-gray-100 bg-gray-50 hover:bg-slate-100'
              }`}
            >
              {/* Overlay highlight */}
              {isSelected && (
                <div className="absolute top-0 right-0 h-10 w-10 flex items-center justify-center bg-indigo-600 text-white rounded-bl-2xl">
                  <Check size={14} className="stroke-[3]" />
                </div>
              )}

              {/* Album cover mockup */}
              <div
                className="w-14 h-16 rounded-xl bg-cover bg-center flex-shrink-0 shadow-sm"
                style={{ backgroundImage: `url(${album.imageUrl})` }}
              />

              <div className="flex-1 min-w-0 pr-6">
                <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
                  {album.category}
                </p>
                <p className="text-xs font-bold text-gray-900 leading-tight truncate mt-0.5">
                  {album.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="bg-gray-100 text-gray-600 font-mono text-[9px] px-1.5 py-0.5 rounded-md font-semibold">
                    {album.totalStickers} Figus
                  </span>
                  <span className="text-[9px] text-gray-400 font-light">
                    Álbum Oficial
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        {/* Option for other albums */}
        <button
          onClick={() => onSelectAlbum('otro_album')}
          className={`w-full flex items-center gap-3 p-3 text-left rounded-2xl border-2 border-dashed transition duration-250 ${
            activeAlbumId === 'otro_album'
              ? 'border-indigo-600 bg-indigo-50/45'
              : 'border-gray-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="w-14 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
            <PlusCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Otro Álbum</p>
            <p className="text-[9px] text-gray-400 mt-0.5">
              Cargá figuritas personalizadas de un álbum alternativo o escolar.
            </p>
          </div>
        </button>
      </div>

      {!hideNextButton && (
        <button
          onClick={onNext}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-xs tracking-wider uppercase"
        >
          Ir al Álbum y Cargar Figuritas
        </button>
      )}
    </div>
  );
}
