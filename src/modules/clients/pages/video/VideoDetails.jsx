import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Eye } from 'lucide-react';

const VideoDetails = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVietnamese, setShowVietnamese] = useState(true);
  const [activeLineId, setActiveLineId] = useState(null);
  const lyricsRef = useRef(null);

  // Mock video data
  const videoData = {
    id: 31,
    title: "A1 English Listening Practice - Weather",
    author_name: "Listening Time",
    provider_name: "YouTube",
    thumbnail_url: "https://i.ytimg.com/vi/uVGV8LG3HHM/hqdefault.jpg",
    video_url: "https://www.youtube.com/watch?v=uVGV8LG3HHM",
    views: 12450,
    cefr_level: "A1",
    topics: [
      {
        id: 36,
        name: "English for Kids",
        alias: "video-english-for-kids"
      }
    ]
  };

  // Lyrics data from the document
  const lyrics = [
    {
      id: 311,
      line_order: 1,
      start_ms: 30,
      end_ms: 2669,
      text_en: "hey everybody welcome to this a one",
      text_vi: "Xin chào mọi người, chào mừng đến với"
    },
    {
      id: 312,
      line_order: 2,
      start_ms: 2669,
      end_ms: 5700,
      text_en: "English listening practice video you can",
      text_vi: "video luyện nghe tiếng Anh này, bạn có thể"
    },
    {
      id: 313,
      line_order: 3,
      start_ms: 5700,
      end_ms: 8010,
      text_en: "use this video to train your listening",
      text_vi: "sử dụng video này để luyện nghe"
    },
    {
      id: 314,
      line_order: 4,
      start_ms: 8010,
      end_ms: 11519,
      text_en: "and comprehension as I speak you ready",
      text_vi: "và hiểu khi tôi nói, bạn đã sẵn sàng chưa?"
    },
    {
      id: 315,
      line_order: 5,
      start_ms: 11519,
      end_ms: 15000,
      text_en: "so today I'm going to talk about the",
      text_vi: "Hôm nay tôi sẽ nói về"
    },
    {
      id: 316,
      line_order: 6,
      start_ms: 15000,
      end_ms: 17699,
      text_en: "weather this is an important topic",
      text_vi: "thời tiết. Đây là một chủ đề quan trọng"
    },
    {
      id: 317,
      line_order: 7,
      start_ms: 17699,
      end_ms: 20460,
      text_en: "because everybody talks about the",
      text_vi: "vì mọi người đều nói về"
    },
    {
      id: 318,
      line_order: 8,
      start_ms: 20460,
      end_ms: 23279,
      text_en: "weather if you are learning English you",
      text_vi: "thời tiết. Nếu bạn đang học tiếng Anh, bạn"
    }
  ];

  // Simulate video playback
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 100;
          // Loop back to start after last lyric
          if (newTime > lyrics[lyrics.length - 1].end_ms) {
            return 0;
          }
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Find active lyric line
  useEffect(() => {
    const activeLine = lyrics.find(
      line => currentTime >= line.start_ms && currentTime <= line.end_ms
    );
    if (activeLine) {
      setActiveLineId(activeLine.id);
      // Auto-scroll to active line
      const activeElement = document.getElementById(`lyric-${activeLine.id}`);
      if (activeElement && lyricsRef.current) {
        const container = lyricsRef.current;
        const elementTop = activeElement.offsetTop;
        const containerHeight = container.clientHeight;
        const scrollPosition = elementTop - containerHeight / 2;
        container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
      }
    }
  }, [currentTime]);

  const handleLineClick = (startMs) => {
    setCurrentTime(startMs);
    setIsPlaying(true);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-10 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Video Info Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <img 
              src={videoData.thumbnail_url} 
              alt={videoData.title}
              className="w-32 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {videoData.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {videoData.views.toLocaleString()} views
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {videoData.cefr_level}
                </span>
                <span>by {videoData.author_name}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {videoData.topics.map(topic => (
                  <span 
                    key={topic.id}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                  >
                    {topic.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Player */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative">
              <img 
                src={videoData.thumbnail_url}
                alt="Video"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10" />
                  ) : (
                    <Play className="w-10 h-10 ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Video Controls */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <div className="flex-1">
                  <div className="relative h-2 bg-gray-300 rounded-full overflow-hidden cursor-pointer">
                    <div 
                      className="absolute inset-y-0 left-0 bg-blue-600 transition-all"
                      style={{ 
                        width: `${(currentTime / lyrics[lyrics.length - 1].end_ms) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(lyrics[lyrics.length - 1].end_ms)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lyrics Panel */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Lyrics</h2>
                <button
                  onClick={() => setShowVietnamese(!showVietnamese)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showVietnamese ? 'Hide' : 'Show'} Vietnamese
                </button>
              </div>
            </div>

            <div 
              ref={lyricsRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
              style={{ maxHeight: '500px' }}
            >
              {lyrics.map((line) => (
                <div
                  key={line.id}
                  id={`lyric-${line.id}`}
                  onClick={() => handleLineClick(line.start_ms)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    activeLineId === line.id
                      ? 'bg-blue-100 border-l-4 border-blue-600 shadow-md transform scale-105'
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                      {formatTime(line.start_ms)}
                    </span>
                    <div className="flex-1">
                      <p className={`font-medium mb-1 ${
                        activeLineId === line.id ? 'text-blue-900 text-lg' : 'text-gray-800'
                      }`}>
                        {line.text_en}
                      </p>
                      {showVietnamese && (
                        <p className="text-gray-600 text-sm italic">
                          {line.text_vi}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About this video</h3>
          <p className="text-gray-700 leading-relaxed">
            This A1 level English listening practice video focuses on weather vocabulary and expressions. 
            Perfect for beginners who want to improve their listening comprehension and learn everyday English phrases.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Source:</span>
            <a 
              href={videoData.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Watch on {videoData.provider_name}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;