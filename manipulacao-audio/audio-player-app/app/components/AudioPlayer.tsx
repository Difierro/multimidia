'use client';

import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white rounded-2xl shadow-2xl max-w-sm mx-auto mt-10">
      
      <div className="w-64 h-64 mb-6 rounded-xl overflow-hidden shadow-lg bg-gray-800 relative">
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/8/8a/Lana_Del_Rey_-_Norman_Fucking_Rockwell.png" 
          alt="Capa do Álbum" 
          className="object-cover w-full h-full"
        />
      </div>

      <h2 className="text-2xl font-bold mb-1">Happiness is a butterfly</h2>
      <p className="text-gray-400 mb-8 text-sm">Lana Del Rey</p>

      <audio 
        ref={audioRef} 
        src="/happiness-is-a-butterfly.mp3" 
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex gap-4 mb-8 w-full justify-center">
        <button 
          onClick={togglePlayPause}
          className="flex items-center justify-center w-16 h-16 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all shadow-lg hover:scale-105"
        >
          {isPlaying ? (
            <span className="text-2xl">||</span>
          ) : (
            <span className="text-2xl ml-1">▶</span>
          )}
        </button>
      </div>

      <div className="flex items-center w-full gap-3 px-2">
        <span className="text-sm opacity-70">🔈</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={handleVolumeChange}
          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <span className="text-sm opacity-70">🔊</span>
      </div>
      
    </div>
  );
}
