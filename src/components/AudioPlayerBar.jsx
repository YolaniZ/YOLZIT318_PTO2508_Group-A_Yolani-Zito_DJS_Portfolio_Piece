import { Pause, Play, RotateCcw } from 'lucide-react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

function formatTime(value) {
  if (!Number.isFinite(value)) {
    return '0:00';
  }

  const mins = Math.floor(value / 60);
  const secs = Math.floor(value % 60)
    .toString()
    .padStart(2, '0');

  return `${mins}:${secs}`;
}

function AudioPlayerBar() {
  const { currentTrack, isPlaying, currentTime, duration, playTrack, seekTo, resetHistory } = useAudioPlayer();

  if (!currentTrack) {
    return (
      <div className="audio-player-bar empty">
        <p>Pick an episode to start listening.</p>
      </div>
    );
  }

  return (
    <div className="audio-player-bar">
      <div className="player-main">
        <img src={currentTrack.artwork} alt={currentTrack.showTitle} className="player-artwork" />
        <div>
          <p className="player-kicker">Now playing</p>
          <h4>{currentTrack.episodeTitle}</h4>
          <p>{currentTrack.showTitle}</p>
        </div>
      </div>

      <div className="player-controls">
        <button
          type="button"
          className="icon-button"
          aria-label={isPlaying ? 'Pause playback' : 'Play episode'}
          onClick={() => playTrack(currentTrack)}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <div className="player-timeline">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seekTo(Number(event.target.value))}
            aria-label="Seek within episode"
          />
          <span>{formatTime(duration)}</span>
        </div>

        <button type="button" className="ghost-button" onClick={resetHistory}>
          <RotateCcw size={14} />
          Reset progress
        </button>
      </div>
    </div>
  );
}

export default AudioPlayerBar;
