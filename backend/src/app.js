// Backend: server.js
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));