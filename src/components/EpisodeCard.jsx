import { Heart, Pause, Play } from 'lucide-react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useFavorites } from '../contexts/FavoritesContext';

function progressSummary(progressRecord) {
  if (!progressRecord) {
    return 'Not started';
  }

  if (progressRecord.finished) {
    return 'Finished';
  }

  if (progressRecord.duration > 0) {
    const percentage = Math.round((progressRecord.position / progressRecord.duration) * 100);
    return `${percentage}% played`;
  }

  return 'In progress';
}

function EpisodeCard({ show, seasonNumber, episode }) {
  const { playTrack, currentTrack, isPlaying, progressMap } = useAudioPlayer();
  const { isFavourite, toggleFavourite } = useFavorites();

  const episodeId = `${show.id}-${seasonNumber}-${episode.episode}`;
  const favourited = isFavourite(episodeId);

  const trackPayload = {
    episodeId,
    showId: show.id,
    showTitle: show.title,
    seasonNumber,
    episodeNumber: episode.episode,
    episodeTitle: episode.title,
    artwork: show.image,
    audioSrc: episode.file
  };

  const isCurrentTrack = currentTrack?.episodeId === episodeId;
  const playingThisTrack = isCurrentTrack && isPlaying;

  return (
    <article className="episode-card">
      <div>
        <p className="episode-kicker">
          Season {seasonNumber} Episode {episode.episode}
        </p>
        <h4>{episode.title}</h4>
        <p>{episode.description}</p>
      </div>

      <div className="episode-actions">
        <button
          type="button"
          className="icon-button"
          onClick={() => playTrack(trackPayload)}
          aria-label={playingThisTrack ? 'Pause episode' : 'Play episode'}
        >
          {playingThisTrack ? <Pause size={16} /> : <Play size={16} />}
          <span>{playingThisTrack ? 'Pause' : 'Play'}</span>
        </button>

        <button
          type="button"
          className={`icon-button ${favourited ? 'is-favourite' : ''}`}
          onClick={() =>
            toggleFavourite({
              ...trackPayload,
              episodeDescription: episode.description
            })
          }
          aria-label={favourited ? 'Remove favourite' : 'Add favourite'}
        >
          <Heart size={16} fill={favourited ? 'currentColor' : 'none'} />
          <span>{favourited ? 'Saved' : 'Favourite'}</span>
        </button>

        <span className="progress-pill">{progressSummary(progressMap[episodeId])}</span>
      </div>
    </article>
  );
}

export default EpisodeCard;
