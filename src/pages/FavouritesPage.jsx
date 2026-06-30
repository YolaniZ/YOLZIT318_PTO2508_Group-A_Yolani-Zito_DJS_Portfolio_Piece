import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartOff, Play } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

function FavouritesPage() {
  const { allFavourites, toggleFavourite } = useFavorites();
  const { playTrack } = useAudioPlayer();
  const [sortBy, setSortBy] = useState('title-asc');

  const groupedFavourites = useMemo(() => {
    const grouped = allFavourites.reduce((acc, item) => {
      const key = item.showTitle;
      const list = acc.get(key) || [];
      list.push(item);
      acc.set(key, list);
      return acc;
    }, new Map());

    let entries = [...grouped.entries()];

    if (sortBy === 'title-asc') {
      entries.sort((a, b) => a[0].localeCompare(b[0]));
    }

    if (sortBy === 'title-desc') {
      entries.sort((a, b) => b[0].localeCompare(a[0]));
    }

    if (sortBy === 'date-newest' || sortBy === 'date-oldest') {
      entries.sort((a, b) => {
        const aTime = Math.max(...a[1].map((item) => new Date(item.addedAt).getTime()));
        const bTime = Math.max(...b[1].map((item) => new Date(item.addedAt).getTime()));
        return sortBy === 'date-newest' ? bTime - aTime : aTime - bTime;
      });
    }

    return entries.map(([showTitle, items]) => ({
      showTitle,
      items: [...items].sort((a, b) => {
        if (sortBy === 'date-oldest') {
          return new Date(a.addedAt) - new Date(b.addedAt);
        }

        if (sortBy === 'date-newest') {
          return new Date(b.addedAt) - new Date(a.addedAt);
        }

        return a.episodeNumber - b.episodeNumber;
      })
    }));
  }, [allFavourites, sortBy]);

  return (
    <section className="page-wrap favourites-page">
      <div className="section-headline">
        <div>
          <p className="eyebrow">Saved episodes</p>
          <h2>Favourites grouped by show</h2>
        </div>

        <label>
          Sort favourites
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="title-asc">Title A to Z</option>
            <option value="title-desc">Title Z to A</option>
            <option value="date-newest">Date added newest</option>
            <option value="date-oldest">Date added oldest</option>
          </select>
        </label>
      </div>

      {groupedFavourites.length === 0 ? (
        <div className="status-message">
          <p>No favourites yet. Save episodes from any show page.</p>
          <Link to="/" className="text-link">
            Browse shows
          </Link>
        </div>
      ) : (
        groupedFavourites.map((group) => (
          <article key={group.showTitle} className="favourites-group">
            <h3>{group.showTitle}</h3>
            {group.items.map((item) => (
              <div key={item.episodeId} className="favourite-row">
                <div>
                  <p className="episode-kicker">
                    Season {item.seasonNumber} Episode {item.episodeNumber}
                  </p>
                  <h4>{item.episodeTitle}</h4>
                  <p>Added {new Date(item.addedAt).toLocaleString()}</p>
                  <Link to={`/show/${item.showId}`} className="text-link">
                    Go to show
                  </Link>
                </div>

                <div className="favourite-actions">
                  <button type="button" className="icon-button" onClick={() => playTrack(item)}>
                    <Play size={16} />
                    Play
                  </button>
                  <button type="button" className="icon-button" onClick={() => toggleFavourite(item)}>
                    <HeartOff size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </article>
        ))
      )}
    </section>
  );
}

export default FavouritesPage;
