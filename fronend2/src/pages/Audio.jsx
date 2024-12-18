import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Play, 
  Pause, 
  SkipForward, 
  Settings,
  Trash2,
  Music,
  Youtube
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';

const API_BASE_URL = 'http://localhost:3000/api';

const YouTubeAIDJ = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [inputUrl, setInputUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [transitionSettings, setTransitionSettings] = useState({
    crossfadeDuration: 8,
    autoMode: true,
    autoAnalyze: true,
    useAIDJ: true,
    eqTransition: true,
    timeStretch: true
  });

  useEffect(() => {
    // Initialize Web Audio API
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);

    return () => {
      context.close();
    };
  }, []);

  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleAddTrack = async (input) => {
    try {
      setIsLoading(true);
      setError(null);

      const videoId = extractYouTubeId(input);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Analyze track
      const response = await axios.post(`${API_BASE_URL}/analyze-track`, { videoId });
      
      setPlaylist(prev => [...prev, response.data.track]);
      
      // If this is the first track, set it as current
      if (!currentTrack) {
        setCurrentTrack(response.data.track);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlaylist = async (playlistUrl) => {
    try {
      setIsLoading(true);
      setError(null);

      const playlistId = playlistUrl.match(/list=([^&]+)/)?.[1];
      if (!playlistId) {
        throw new Error('Invalid playlist URL');
      }

      const response = await axios.post(`${API_BASE_URL}/analyze-playlist`, { playlistId });
      setPlaylist(prev => [...prev, ...response.data.tracks]);

      if (!currentTrack && response.data.tracks.length > 0) {
        setCurrentTrack(response.data.tracks[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const playTrack = async (track) => {
    try {
      if (!audioContext) return;

      const response = await axios.get(
        `${API_BASE_URL}/track/${track.videoId}/stream`,
        { responseType: 'arraybuffer' }
      );

      const audioBuffer = await audioContext.decodeAudioData(response.data);
      
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      
      source.buffer = audioBuffer;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (currentTrack && transitionSettings.useAIDJ) {
        const transitionResponse = await axios.get(
          `${API_BASE_URL}/transitions/${currentTrack.videoId}/${track.videoId}`
        );
        
        applyTransitionEffects(gainNode, transitionResponse.data.transition);
      }

      source.start(0);
      setIsPlaying(true);
      setCurrentTrack(track);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeTrack = (trackId) => {
    setPlaylist(prev => prev.filter(track => track.videoId !== trackId));
    if (currentTrack?.videoId === trackId) {
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>AI DJ Player</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Current Track Display */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4">
              {currentTrack ? (
                <img 
                  src={`https://img.youtube.com/vi/${currentTrack?.videoId}/mqdefault.jpg`}
                  alt="Thumbnail"
                  className="w-24 h-24 rounded"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <Music className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{currentTrack?.title || 'No track playing'}</h3>
                {currentTrack?.metadata && (
                  <>
                    <div className="text-sm text-gray-600">
                      BPM: {currentTrack.metadata.bpm.toFixed(1)} | 
                      Key: {currentTrack.metadata.key}
                    </div>
                    <div className="text-sm text-gray-600">
                      Energy: {currentTrack.metadata.energy.toFixed(2)} | 
                      Danceability: {currentTrack.metadata.danceability.toFixed(2)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                if (currentTrack) {
                  if (isPlaying) {
                    audioContext?.suspend();
                  } else {
                    audioContext?.resume();
                  }
                  setIsPlaying(!isPlaying);
                }
              }}
              disabled={!currentTrack || isLoading}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                const currentIndex = playlist.findIndex(t => t.videoId === currentTrack?.videoId);
                if (currentIndex < playlist.length - 1) {
                  playTrack(playlist[currentIndex + 1]);
                }
              }}
              disabled={!currentTrack || isLoading || playlist.length <= 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="space-y-4 mb-6 p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Transition Settings</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm">AI DJ Mode</label>
                  <Switch
                    checked={transitionSettings.useAIDJ}
                    onCheckedChange={(checked) => 
                      setTransitionSettings(prev => ({...prev, useAIDJ: checked}))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Crossfade Duration (seconds)</label>
                  <Slider
                    value={[transitionSettings.crossfadeDuration]}
                    min={2}
                    max={16}
                    step={1}
                    className="mt-2"
                    onValueChange={(value) => 
                      setTransitionSettings(prev => ({...prev, crossfadeDuration: value[0]}))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm">EQ Transition</label>
                  <Switch
                    checked={transitionSettings.eqTransition}
                    onCheckedChange={(checked) => 
                      setTransitionSettings(prev => ({...prev, eqTransition: checked}))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm">Time Stretch</label>
                  <Switch
                    checked={transitionSettings.timeStretch}
                    onCheckedChange={(checked) => 
                      setTransitionSettings(prev => ({...prev, timeStretch: checked}))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* URL Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Add YouTube URL or Playlist..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (inputUrl.includes('list=')) {
                    handleAddPlaylist(inputUrl);
                  } else {
                    handleAddTrack(inputUrl);
                  }
                  setInputUrl('');
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Playlist Section */}
      <Card>
        <CardHeader>
          <CardTitle>Playlist ({playlist.length} tracks)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {playlist.map((track, index) => (
              <div 
                key={track.videoId}
                className={`flex items-center gap-3 p-2 rounded-lg 
                  ${currentTrack?.videoId === track.videoId ? 'bg-blue-50' : 'hover:bg-gray-100'}
                  ${isLoading ? 'opacity-50' : ''}`}
              >
                <div 
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => playTrack(track)}
                >
                  <img 
                    src={`https://img.youtube.com/vi/${track.videoId}/default.jpg`}
                    alt="Thumbnail"
                    className="w-16 h-12 rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{track.title}</div>
                  <div className="text-sm text-gray-600">
                    BPM: {track.metadata?.bpm.toFixed(1) || '--'} | 
                    Key: {track.metadata?.key || '--'}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTrack(track.videoId)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {playlist.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Youtube className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Add YouTube URLs or playlists to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YouTubeAIDJ;