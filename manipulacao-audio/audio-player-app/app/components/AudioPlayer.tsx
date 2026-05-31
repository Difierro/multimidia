// @ts-nocheck
'use client';

import { useState, useRef, useEffect } from 'react';
const PLAYLIST = [
  {
    id: 1,
    title: "Happiness is a butterfly",
    artist: "Lana Del Rey",
    cover: "https://upload.wikimedia.org/wikipedia/en/8/8a/Lana_Del_Rey_-_Norman_Fucking_Rockwell.png",
    src: "/happiness-is-a-butterfly.mp3"
  },
  {
    id: 2,
    title: "Young and Beautiful",
    artist: "Lana Del Rey",
    cover: "https://images.genius.com/d2dd4391c1a86d651bbbe663331db375.1000x1000x1.jpg",
    src: "/young-and-beautiful.mp3"
  },
  {
    id: 3,
    title: "Coisas Naturais",
    artist: "Marina Sena",
    cover: "https://static.qobuz.com/images/covers/uc/y1/djdpookguy1uc_600.jpg",
    src: "/coisas-naturais.mp3"
  }
];

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = PLAYLIST[currentTrackIndex];

  //sincroniza volume e play/pause quando a musica muda
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  // Formatacao de tempo
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlayPause = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const skipTrack = (direction) => {
    let nextIndex = currentTrackIndex + direction;
    if (nextIndex < 0) nextIndex = PLAYLIST.length - 1;
    if (nextIndex >= PLAYLIST.length) nextIndex = 0;
    setCurrentTrackIndex(nextIndex);
  };

  const skipTime = (amount) => {
    audioRef.current.currentTime += amount;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white rounded-3xl shadow-2xl max-w-sm mx-auto mt-10 border border-gray-800">
      
      <div className={`w-64 h-64 mb-6 rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 ${isPlaying ? 'scale-105 border-2 border-blue-500' : 'scale-100'}`}>
        <img src={currentTrack.cover} alt="Capa" className="object-cover w-full h-full" />
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold truncate w-64">{currentTrack.title}</h2>
        <p className="text-blue-400 font-medium">{currentTrack.artist}</p>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => skipTrack(1)}
      />

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

      <div className="flex items-center w-full gap-3 bg-gray-800 p-3 rounded-2xl">
        <span className="text-xs">🔈</span>
        <input 
          type="range" 
          min="0" max="1" step="0.01" 
          value={volume} 
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            audioRef.current.volume = v;
          }}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none accent-blue-400"
        />
        <span className="text-xs">🔊</span>
      </div>

      <div className="mt-8 w-full border-t border-gray-800 pt-4">
        <p className="text-xs font-bold uppercase text-gray-500 mb-3 ml-1">Sua Fila</p>
        {PLAYLIST.map((track, index) => (
          <div 
            key={track.id}
            onClick={() => setCurrentTrackIndex(index)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-1 transition-colors ${index === currentTrackIndex ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-gray-800'}`}
          >
            <div className="w-8 h-8 rounded bg-gray-700 flex-shrink-0 flex items-center justify-center text-[10px]">
              {index === currentTrackIndex && isPlaying ? "♫" : index + 1}
            </div>
            <div className="overflow-hidden">
              <p className={`text-sm font-semibold truncate ${index === currentTrackIndex ? 'text-blue-400' : 'text-gray-200'}`}>
                {track.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}