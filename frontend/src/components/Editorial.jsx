// Import necessary hooks and icons
import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Maximize2 } from 'lucide-react';

// Functional component to display a video editorial player
const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  
  // Reference to the video DOM element
  const videoRef = useRef(null);
  
  // State variables to track video playback
  const [isPlaying, setIsPlaying] = useState(false);       // whether video is playing
  const [currentTime, setCurrentTime] = useState(0);       // current playback time in seconds
  const [isHovering, setIsHovering] = useState(false);     // whether mouse is hovering on video
  const [playbackRate, setPlaybackRate] = useState(1);
  // REMOVE: const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Fallback thumbnail if not provided
  const fallbackThumbnail = '/default-thumbnail.png'; // Place a default image in your public folder
  const posterUrl = thumbnailUrl ? thumbnailUrl : fallbackThumbnail;
  if (!thumbnailUrl) {
    // eslint-disable-next-line no-console
    console.warn('Editorial: No thumbnailUrl provided, using fallback.');
  }

  // Helper function to convert seconds into MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Play/pause toggle function
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();      // pause the video
      } else {
        videoRef.current.play();       // play the video
      }
      setIsPlaying(!isPlaying);        // toggle the state
    }
  };

  // Fullscreen handler
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  // REMOVE: Theater mode handler
  // REMOVE: const handleTheaterMode = () => { setIsTheaterMode((prev) => !prev); };

  // Playback rate handler
  const handleSpeedChange = (e) => {
    const rate = Number(e.target.value);
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Effect to listen to video playback time updates
  useEffect(() => {
    const video = videoRef.current;

    // Handler to update currentTime on every time update
    const handleTimeUpdate = () => {
      if (video) setCurrentTime(video.currentTime);
    };

    // Add the event listener if video element is ready
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      // Clean up listener on unmount
      return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, []);

  // Set playback rate on mount and when changed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <div 
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg"
      onMouseEnter={() => setIsHovering(true)}   // Show controls on mouse hover
      onMouseLeave={() => setIsHovering(false)}  // Hide controls when mouse leaves
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={secureUrl}                       // video source URL
        poster={posterUrl}                    // thumbnail to show before playing
        onClick={togglePlayPause}             // allow clicking video to toggle play/pause
        className="w-full aspect-video bg-black cursor-pointer"
      />

      {/* Control overlay at the bottom */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${
          isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-2 w-full">
          {/* Play/Pause button (left) */}
          <button
            onClick={togglePlayPause}
            className="btn btn-circle btn-primary"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>

          {/* Fullscreen and speed controls (right) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFullscreen}
              className="btn btn-circle btn-neutral"
              aria-label="Fullscreen"
            >
              <Maximize2 />
            </button>
            <select
              value={playbackRate}
              onChange={handleSpeedChange}
              className="ml-2 px-2 py-1 rounded bg-gray-800 text-white text-sm border border-gray-600 focus:outline-none"
              style={{ width: '70px' }}
              aria-label="Playback speed"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>

        {/* Progress bar with time display */}
        <div className="flex items-center w-full mt-2">
          <span className="text-white text-sm mr-2">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (videoRef.current) {
                videoRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="range range-primary range-xs flex-1"
          />
          <span className="text-white text-sm ml-2">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Export the component
export default Editorial;
