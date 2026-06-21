// @ts-nocheck
'use client';

import { useState, useRef, useEffect } from 'react';

const PLAYLIST = [
  {
    id: 1,
    title: "E.T. - Lyric Video",
    artist: "Katy Perry",
    src: "/videos/et.mp4"
  },
  {
    id: 2,
    title: "Tudo para amar você - Lyric Video",
    artist: "Marina Sena",
    src: "/videos/tpav.mp4"
  }
];

const COLOR_FILTERS = {
  normal: "",
  grayscale: "grayscale(100%)",
  red: "sepia(100%) hue-rotate(320deg) saturate(300%)",
  blue: "sepia(100%) hue-rotate(180deg) saturate(300%)",
  green: "sepia(100%) hue-rotate(90deg) saturate(300%)"
};

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeFilter, setActiveFilter] = useState('normal');

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); 
      videoRef.current.volume = volume;
      setCurrentTime(0);
      
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            if (error.name !== 'AbortError') setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrackIndex]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play().catch(e => console.error("Erro no play:", e));
    } else {
      videoRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipTrack = (direction: number) => {
    let nextIndex = currentTrackIndex + direction;
    if (nextIndex < 0) nextIndex = PLAYLIST.length - 1;
    if (nextIndex >= PLAYLIST.length) nextIndex = 0;
    setCurrentTrackIndex(nextIndex);
  };

  const skipTime = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white rounded-3xl shadow-2xl max-w-2xl mx-auto mt-10 border border-gray-800">
      
      <div className={`relative w-full aspect-video mb-6 bg-black rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${isPlaying ? 'border-2 border-blue-500' : 'border border-gray-800'}`}>
        <video 
          ref={videoRef} 
          src={currentTrack.src}
          preload="metadata" 
          playsInline
          onClick={togglePlayPause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleDurationChange}
          onDurationChange={handleDurationChange}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => skipTrack(1)}
          className="object-contain w-full h-full cursor-pointer transition-all duration-300"
          style={{ filter: COLOR_FILTERS[activeFilter as keyof typeof COLOR_FILTERS] }}
        />
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold truncate w-full">{currentTrack.title}</h2>
        <p className="text-blue-400 font-medium">{currentTrack.artist}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button onClick={() => setActiveFilter('normal')} className={`px-3 py-1 text-xs rounded-full border ${activeFilter === 'normal' ? 'bg-gray-100 text-gray-900' : 'border-gray-600 hover:bg-gray-800'}`}>Normal</button>
        <button onClick={() => setActiveFilter('grayscale')} className={`px-3 py-1 text-xs rounded-full border ${activeFilter === 'grayscale' ? 'bg-gray-500 text-white' : 'border-gray-600 hover:bg-gray-800'}`}>Sem Cores</button>
        <button onClick={() => setActiveFilter('red')} className={`px-3 py-1 text-xs rounded-full border ${activeFilter === 'red' ? 'bg-red-900 text-red-100 border-red-500' : 'border-gray-600 hover:bg-gray-800'}`}>Vermelho</button>
        <button onClick={() => setActiveFilter('blue')} className={`px-3 py-1 text-xs rounded-full border ${activeFilter === 'blue' ? 'bg-blue-900 text-blue-100 border-blue-500' : 'border-gray-600 hover:bg-gray-800'}`}>Azul</button>
        <button onClick={() => setActiveFilter('green')} className={`px-3 py-1 text-xs rounded-full border ${activeFilter === 'green' ? 'bg-green-900 text-green-100 border-green-500' : 'border-gray-600 hover:bg-gray-800'}`}>Verde</button>
      </div>

      <div className="w-full mb-6">
        <input 
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs mt-2 text-gray-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-5 mb-8">
        <button onClick={() => skipTime(-10)} className="text-gray-400 hover:text-white">↺ 10s</button>
        <button onClick={() => skipTrack(-1)} className="text-2xl hover:text-blue-500 transition-colors">⏮</button>
        
        <button 
          onClick={togglePlayPause}
          className="flex items-center justify-center w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg transition-transform active:scale-95"
        >
          <span className="text-2xl">{isPlaying ? '⏸' : '▶'}</span>
        </button>

        <button onClick={() => skipTrack(1)} className="text-2xl hover:text-blue-500 transition-colors">⏭</button>
        <button onClick={() => skipTime(10)} className="text-gray-400 hover:text-white">10s ↻</button>
      </div>

      <div className="flex items-center w-full max-w-sm gap-3 bg-gray-800 p-3 rounded-2xl mb-6">
        <span className="text-xs">🔈</span>
        <input 
          type="range" 
          min="0" max="1" step="0.01" 
          value={volume} 
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (videoRef.current) videoRef.current.volume = v;
          }}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none accent-blue-400"
        />
        <span className="text-xs">🔊</span>
      </div>

      <div className="w-full border-t border-gray-800 pt-4">
        <p className="text-xs font-bold uppercase text-gray-500 mb-3 ml-1">Próximos Vídeos</p>
        {PLAYLIST.map((track, index) => (
          <div 
            key={track.id}
            onClick={() => setCurrentTrackIndex(index)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-1 transition-colors ${index === currentTrackIndex ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-gray-800'}`}
          >
            <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold ${index === currentTrackIndex ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              {index === currentTrackIndex && isPlaying ? "▶" : index + 1}
            </div>
            
            <div className="overflow-hidden">
              <p className={`text-sm font-semibold truncate ${index === currentTrackIndex ? 'text-blue-400' : 'text-gray-200'}`}>
                {track.title}
              </p>
              <p className="text-xs text-gray-500 truncate">{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}