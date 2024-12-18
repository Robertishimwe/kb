// Backend: server.js
// @ts-nocheck
const express = require('express');
const ytdl = require('ytdl-core');
const axios = require('axios');
const cors = require('cors');
const { Essentia, EssentiaWASM } = require('essentia.js');
const { google } = require('googleapis');
const youtube = google.youtube('v3');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Replace with your API key

class YouTubeTrack {
    constructor(videoId, title) {
        this.videoId = videoId;
        this.title = title;
        this.metadata = null;
        this.audioBuffer = null;
    }

    async analyze() {
        try {
            // Download and convert audio
            const audioStream = await this.getAudioStream();
            this.audioBuffer = await this.streamToBuffer(audioStream);
            
            // Initialize Essentia
            const essentia = new Essentia(await EssentiaWASM());
            
            // Analyze audio characteristics
            const audioData = new Float32Array(this.audioBuffer);
            
            this.metadata = {
                bpm: essentia.BpmHistogram(audioData).bpm,
                key: essentia.KeyExtractor(audioData).key,
                energy: essentia.Energy(audioData).energy,
                danceability: essentia.Danceability(audioData).danceability,
                loudness: essentia.Loudness(audioData).loudness,
                beats: essentia.BeatTracking(audioData).beats
            };
            
            return this.metadata;
        } catch (error) {
            console.error('Analysis error:', error);
            throw error;
        }
    }

    async getAudioStream() {
        return ytdl(this.videoId, {
            quality: 'highestaudio',
            filter: 'audioonly'
        });
    }

    async streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', reject);
        });
    }
}


// Add this class before the PlaylistManager class in the backend code

class EnhancedTransitionEngine {
  constructor() {
      this.transitionPoints = new Map();
  }

  async analyzeTransitionPoints(track) {
      try {
          const { audioBuffer, metadata } = track;
          if (!audioBuffer || !metadata) return;

          // Convert audio buffer to float32Array for analysis
          const audioData = new Float32Array(audioBuffer);

          // Analyze track structure
          const structuralSegments = await this.analyzeStructure(audioData, metadata);
          
          // Store analysis results
          this.transitionPoints.set(track.videoId, {
              drops: structuralSegments.drops,
              breaks: structuralSegments.breaks,
              outros: structuralSegments.outros,
              intros: structuralSegments.intros,
              metadata: metadata
          });

          return this.transitionPoints.get(track.videoId);
      } catch (error) {
          console.error('Error analyzing transition points:', error);
          throw error;
      }
  }

  async analyzeStructure(audioData, metadata) {
      // Initialize segments
      const segments = {
          drops: [],
          breaks: [],
          outros: [],
          intros: []
      };

      try {
          // Use the beats from metadata to find structural segments
          const beatPositions = metadata.beats || [];
          const energyProfile = this.calculateEnergyProfile(audioData);
          
          // Find significant energy changes
          for (let i = 0; i < beatPositions.length - 4; i++) {
              const currentEnergy = this.getAverageEnergy(energyProfile, beatPositions[i], beatPositions[i + 4]);
              const nextEnergy = this.getAverageEnergy(energyProfile, beatPositions[i + 4], beatPositions[i + 8]);
              
              // Detect drops (significant energy increase)
              if (nextEnergy > currentEnergy * 1.5) {
                  segments.drops.push(beatPositions[i + 4]);
              }
              
              // Detect breaks (significant energy decrease)
              if (nextEnergy < currentEnergy * 0.6) {
                  segments.breaks.push(beatPositions[i + 4]);
              }
          }

          // Identify intro and outro
          const introLength = Math.floor(beatPositions.length * 0.1); // First 10% of beats
          const outroLength = Math.floor(beatPositions.length * 0.1); // Last 10% of beats
          
          segments.intros = beatPositions.slice(0, introLength);
          segments.outros = beatPositions.slice(-outroLength);

          return segments;
      } catch (error) {
          console.error('Error in structure analysis:', error);
          return segments;
      }
  }

  calculateEnergyProfile(audioData) {
      const windowSize = 2048;
      const energyProfile = [];
      
      for (let i = 0; i < audioData.length - windowSize; i += windowSize) {
          let energy = 0;
          for (let j = 0; j < windowSize; j++) {
              energy += audioData[i + j] * audioData[i + j];
          }
          energyProfile.push(energy / windowSize);
      }
      
      return energyProfile;
  }

  getAverageEnergy(energyProfile, start, end) {
      const startIndex = Math.floor(start / 2048);
      const endIndex = Math.floor(end / 2048);
      
      if (startIndex >= endIndex || startIndex >= energyProfile.length) {
          return 0;
      }

      const sum = energyProfile
          .slice(startIndex, endIndex)
          .reduce((acc, val) => acc + val, 0);
          
      return sum / (endIndex - startIndex);
  }

  calculateOptimalTransition(currentTrack, nextTrack) {
      const currentPoints = this.transitionPoints.get(currentTrack.videoId);
      const nextPoints = this.transitionPoints.get(nextTrack.videoId);
      
      if (!currentPoints || !nextPoints) {
          return this.getDefaultTransition();
      }

      // Calculate optimal transition points
      const exitPoint = this.findBestExitPoint(currentPoints);
      const entryPoint = this.findBestEntryPoint(nextPoints);

      // Calculate BPM ratio for time stretching
      const bpmRatio = nextPoints.metadata.bpm / currentPoints.metadata.bpm;
      const timeStretchRequired = Math.abs(1 - bpmRatio) > 0.08; // >8% BPM difference

      return {
          exitPoint,
          entryPoint,
          transitionType: this.determineTransitionType(currentPoints, nextPoints),
          effectsChain: {
              eqSettings: this.calculateEQTransition(currentPoints.metadata, nextPoints.metadata),
              timeStretch: timeStretchRequired ? bpmRatio : null,
              volumeEnvelope: this.calculateVolumeEnvelope(currentPoints, nextPoints)
          }
      };
  }

  findBestExitPoint(trackPoints) {
      // Prefer outro points, then breaks, then drops
      if (trackPoints.outros.length > 0) {
          return trackPoints.outros[0];
      }
      
      if (trackPoints.breaks.length > 0) {
          return trackPoints.breaks[trackPoints.breaks.length - 1];
      }
      
      if (trackPoints.drops.length > 0) {
          return trackPoints.drops[trackPoints.drops.length - 1];
      }

      // Default to 8 beats before the end
      return trackPoints.metadata.beats[trackPoints.metadata.beats.length - 8];
  }

  findBestEntryPoint(trackPoints) {
      // Prefer intro points, then drops
      if (trackPoints.intros.length > 0) {
          return trackPoints.intros[0];
      }
      
      if (trackPoints.drops.length > 0) {
          return trackPoints.drops[0];
      }

      // Default to first beat
      return trackPoints.metadata.beats[0];
  }

  determineTransitionType(currentPoints, nextPoints) {
      const energyDiff = nextPoints.metadata.energy - currentPoints.metadata.energy;
      const bpmDiff = nextPoints.metadata.bpm - currentPoints.metadata.bpm;

      if (Math.abs(bpmDiff) > 10) {
          return 'tempo_transition';
      }

      if (Math.abs(energyDiff) > 0.3) {
          return energyDiff > 0 ? 'build_up' : 'wind_down';
      }

      return 'smooth_blend';
  }

  calculateEQTransition(currentMetadata, nextMetadata) {
      // Calculate EQ settings based on spectral characteristics
      return {
          lowCut: this.calculateFrequencyTransition(200, 400),
          midBoost: this.calculateFrequencyTransition(800, 2000),
          highCut: this.calculateFrequencyTransition(4000, 8000)
      };
  }

  calculateFrequencyTransition(minFreq, maxFreq) {
      return {
          frequency: minFreq + Math.random() * (maxFreq - minFreq),
          q: 0.7 + Math.random() * 0.6
      };
  }

  calculateVolumeEnvelope(currentPoints, nextPoints) {
      return {
          fadeOutDuration: 8, // seconds
          fadeInDuration: 8,
          fadeOutCurve: 'exponential',
          fadeInCurve: 'exponential'
      };
  }

  getDefaultTransition() {
      return {
          exitPoint: null,
          entryPoint: null,
          transitionType: 'smooth_blend',
          effectsChain: {
              eqSettings: {
                  lowCut: this.calculateFrequencyTransition(200, 400),
                  midBoost: this.calculateFrequencyTransition(800, 2000),
                  highCut: this.calculateFrequencyTransition(4000, 8000)
              },
              timeStretch: null,
              volumeEnvelope: {
                  fadeOutDuration: 8,
                  fadeInDuration: 8,
                  fadeOutCurve: 'exponential',
                  fadeInCurve: 'exponential'
              }
          }
      };
  }
}

class PlaylistManager {
    constructor() {
        this.tracks = new Map();
        this.transitionEngine = new EnhancedTransitionEngine();
    }

    async addTrack(videoId) {
        try {
            // Get video details from YouTube
            const videoDetails = await this.getVideoDetails(videoId);
            
            // Create and analyze track
            const track = new YouTubeTrack(videoId, videoDetails.title);
            await track.analyze();
            
            // Analyze transition points
            await this.transitionEngine.analyzeTransitionPoints(track);
            
            this.tracks.set(videoId, track);
            return track;
        } catch (error) {
            console.error('Error adding track:', error);
            throw error;
        }
    }

    async getVideoDetails(videoId) {
        const response = await youtube.videos.list({
            key: YOUTUBE_API_KEY,
            part: 'snippet',
            id: videoId
        });
        
        if (!response.data.items.length) {
            throw new Error('Video not found');
        }
        
        return {
            title: response.data.items[0].snippet.title,
            thumbnail: response.data.items[0].snippet.thumbnails.default.url
        };
    }

    async getPlaylistVideos(playlistId) {
        const response = await youtube.playlistItems.list({
            key: YOUTUBE_API_KEY,
            part: 'snippet',
            playlistId: playlistId,
            maxResults: 50
        });
        
        return response.data.items.map(item => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title
        }));
    }
}

const playlistManager = new PlaylistManager();

// API Routes
app.post('/api/analyze-track', async (req, res) => {
    try {
        const { videoId } = req.body;
        const track = await playlistManager.addTrack(videoId);
        res.json({
            success: true,
            track: {
                videoId: track.videoId,
                title: track.title,
                metadata: track.metadata
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/analyze-playlist', async (req, res) => {
    try {
        const { playlistId } = req.body;
        const videos = await playlistManager.getPlaylistVideos(playlistId);
        
        // Analyze each video
        const analyzedTracks = await Promise.all(
            videos.map(video => playlistManager.addTrack(video.videoId))
        );
        
        res.json({
            success: true,
            tracks: analyzedTracks.map(track => ({
                videoId: track.videoId,
                title: track.title,
                metadata: track.metadata
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/track/:videoId/stream', async (req, res) => {
    try {
        const { videoId } = req.params;
        const track = playlistManager.tracks.get(videoId);
        
        if (!track) {
            throw new Error('Track not found');
        }
        
        const audioStream = await track.getAudioStream();
        audioStream.pipe(res);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/transitions/:currentId/:nextId', async (req, res) => {
    try {
        const { currentId, nextId } = req.params;
        const currentTrack = playlistManager.tracks.get(currentId);
        const nextTrack = playlistManager.tracks.get(nextId);
        
        if (!currentTrack || !nextTrack) {
            throw new Error('One or both tracks not found');
        }
        
        const transition = playlistManager.transitionEngine.calculateOptimalTransition(
            currentTrack,
            nextTrack
        );
        
        res.json({ success: true, transition });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port http://localhost${PORT}`));




























// import express from 'express';
// import cors from 'cors';
// import { CONFIG } from './config/environment';
// import kbRoutes from './routes/kbRoutes';

// const app = express();
// app.use(cors())
// app.use(express.json());

// // Routes
// app.use('/api/kb', kbRoutes);

// // Start the server
// const PORT = CONFIG.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// export default app;






























































// // import express from 'express';
// // import { CONFIG } from './config/environment';
// // import kbRoutes from './routes/kbRoutes';
// // import cors from "cors";

// // const app = express();

// // app.use(express.json());

// // // Configure CORS
// // app.use(cors());

// // app.use('/api/kb', kbRoutes);

// // async function startServer() {
// //   app.listen(CONFIG.PORT, () => {
// //     console.log(`Server is running on port ${CONFIG.PORT}`);
// //   });
// // }

// // startServer().catch(console.error);

// // export default app;




























































// // import express from 'express';
// // import { CONFIG } from './config/environment';
// // import kbRoutes from './routes/kbRoutes';
// // import cors from "cors";

// // const app = express();

// // app.use(express.json());
// // app.use(cors({
// //   origin: '*'
// // }))
// // app.use('/api/kb', kbRoutes);

// // async function startServer() {
// //   app.listen(CONFIG.PORT, () => {
// //     console.log(`Server is running on port ${CONFIG.PORT}`);
// //   });
// // }

// // startServer().catch(console.error);

// // export default app;

















// // import express from 'express';
// // import { CONFIG } from './config/environment';
// // import kbRoutes from './routes/kbRoutes';
// // import cors from "cors";

// // const app = express();
// // app.use(cors({ origin: "*" }));
// // app.use(express.json());
// // app.use('/api/kb', kbRoutes);

// // async function startServer() {
// //   app.listen(CONFIG.PORT, () => {
// //     console.log(`Server is running on port ${CONFIG.PORT}`);
// //   });
// // }

// // startServer().catch(console.error);

// // export default app;